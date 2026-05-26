#!/usr/bin/env bash
# audit-decks.sh — Bitácora deck coverage audit
#
# Scans MODO project repos for HTML decks and cross-references them
# against the canonical bitácora catalog (decks/decks.json).
# Reports orphans (on disk, missing from bitácora) and broken refs
# (in decks.json, missing on disk).
#
# Usage:
#   ./scripts/audit-decks.sh                    # human report to stdout
#   ./scripts/audit-decks.sh --json             # JSON for tooling
#   ./scripts/audit-decks.sh --report PATH      # also write markdown to PATH
#   ./scripts/audit-decks.sh --quiet            # only print if drift found
#
# Exit codes:
#   0 — all decks accounted for (or only ignored)
#   1 — drift detected (orphans or broken refs)
#   2 — script error (missing deps, bad catalog)

set -euo pipefail

REPO_ROOT="${REPO_ROOT:-/Users/hernan.desouza/Documents/Proyectos/modo/erno-modo}"
CATALOG="${CATALOG:-$REPO_ROOT/decks/decks.json}"
WORKSPACE_ROOT="${WORKSPACE_ROOT:-/Users/hernan.desouza/Documents/Proyectos/modo}"

# Scan roots — repos to inspect for deck HTML files
SCAN_ROOTS=(
  "$WORKSPACE_ROOT/modo-checkout-skill"
  "$WORKSPACE_ROOT/tofu-comercios"
  "$WORKSPACE_ROOT/modo-landing-workspace/modo-landing"
  "$WORKSPACE_ROOT/modo-landing-workspace/aprendeatumodo"
  "$WORKSPACE_ROOT/promos-hub-site"
  "$WORKSPACE_ROOT/modo-landing-workspace/promos-hub-site"
)

# Ignore patterns — paths that contain HTML but are NOT decks
# (storybook, test fixtures, demos that are intentionally local, etc.)
IGNORE_PATTERNS=(
  "/node_modules/"
  "/.next/"
  "/.claude/worktrees/"
  "/dist/"
  "/build/"
  "/coverage/"
  "/storybook-static/"
  "/.git/"
  "/public/"
  "/static/"
  "/test-results/"
  "/playwright-report/"
)

# Allowlist — these decks are intentionally NOT in bitácora
# (POC artifacts, drafts archived locally, demo scaffolding).
# Match by basename. Add entries via env: AUDIT_ALLOWLIST=foo.html,bar.html
ALLOWLIST_DEFAULT=(
  "modo-for-agents-replica.html"     # local POC replica, canon is completo/modo-for-agents
  "video-pov-e2e.html"               # demo video shell
  "presentacion-ejecutiva.v1.html"   # superseded v1
  "presentacion-ejecutiva-mvp-fer.v1.html"
  "presentacion-team.v1.html"
  "01-pitch-ejecutivo.html"          # entregable bundle, internal
  "02-pitch-tecnico.html"
  "deck-marketplaces.html"           # bundled inside checkout-skill demo
  "agent-plan.html"                  # plan artifact, not a deck
  "estado-actual-2026-05-16.html"
  "plan.html"
  "prd-comercios-mvp.html"
  "rfc-comercios-mvp.html"
  "index.html"                       # tofu workspace landing, not a deck
)

# Merge env allowlist if present
ALLOWLIST=("${ALLOWLIST_DEFAULT[@]}")
if [[ -n "${AUDIT_ALLOWLIST:-}" ]]; then
  IFS=',' read -ra ALLOWLIST_ENV <<< "$AUDIT_ALLOWLIST"
  ALLOWLIST+=("${ALLOWLIST_ENV[@]}")
fi

JSON_MODE=false
QUIET=false
REPORT_PATH=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --json) JSON_MODE=true; shift ;;
    --quiet) QUIET=true; shift ;;
    --report) REPORT_PATH="$2"; shift 2 ;;
    -h|--help)
      grep '^#' "$0" | sed 's/^# \{0,1\}//'
      exit 0
      ;;
    *) echo "unknown arg: $1" >&2; exit 2 ;;
  esac
done

command -v jq >/dev/null 2>&1 || { echo "jq required" >&2; exit 2; }
[[ -f "$CATALOG" ]] || { echo "catalog not found: $CATALOG" >&2; exit 2; }

# --- canonical catalog ---
canonical_ids=$(jq -r '.decks[].id' "$CATALOG")
canonical_hrefs=$(jq -r '.decks[].href' "$CATALOG")

# --- broken refs (catalog → disk) ---
broken_refs=()
while IFS= read -r href; do
  [[ -z "$href" ]] && continue
  abspath="$REPO_ROOT/$href"
  [[ -f "$abspath" ]] || broken_refs+=("$href")
done <<< "$canonical_hrefs"

# --- canonical basenames for matching ---
canonical_basenames=$(echo "$canonical_hrefs" | awk -F/ '{print $NF}' | sort -u)

# --- scan filesystem for stray decks ---
is_ignored() {
  local path="$1"
  for pat in "${IGNORE_PATTERNS[@]}"; do
    [[ "$path" == *"$pat"* ]] && return 0
  done
  return 1
}

is_allowlisted() {
  local base="$1"
  for entry in "${ALLOWLIST[@]}"; do
    [[ "$base" == "$entry" ]] && return 0
  done
  return 1
}

is_in_catalog() {
  local base="$1"
  echo "$canonical_basenames" | grep -qx "$base"
}

orphans=()
for root in "${SCAN_ROOTS[@]}"; do
  [[ -d "$root" ]] || continue
  while IFS= read -r f; do
    is_ignored "$f" && continue
    base=$(basename "$f")
    # heuristic: file is a deck candidate if it lives under a path with
    # "deck", "presentacion", "slides", or is a top-level *.html in the repo
    if [[ "$f" == *"/deck"* || "$f" == *"presentacion"* || "$f" == *"slides"* || "$f" == *"pitch"* ]]; then
      :
    else
      # also accept root-level HTMLs in scan roots
      parent=$(dirname "$f")
      [[ "$parent" == "$root" ]] || continue
    fi
    is_allowlisted "$base" && continue
    is_in_catalog "$base" && continue
    orphans+=("$f")
  done < <(find "$root" -name "*.html" -type f 2>/dev/null)
done

# --- emit report ---
total_canonical=$(echo "$canonical_ids" | grep -c . || true)
n_broken=${#broken_refs[@]}
n_orphans=${#orphans[@]}
exit_code=0
[[ $n_broken -gt 0 || $n_orphans -gt 0 ]] && exit_code=1

if $JSON_MODE; then
  # Build JSON arrays guarding the empty case. Expanding an empty array as
  # "${arr[@]}" under `set -u` aborts on bash <4.4 (the default /bin/bash on
  # macOS is 3.2); on modern bash a bare `printf '%s\n'` would still emit a
  # phantom "" element. So only printf when the array is non-empty.
  if [[ ${#broken_refs[@]} -gt 0 ]]; then
    broken_json=$(printf '%s\n' "${broken_refs[@]}" | jq -R . | jq -s .)
  else
    broken_json='[]'
  fi
  if [[ ${#orphans[@]} -gt 0 ]]; then
    orphan_json=$(printf '%s\n' "${orphans[@]}" | jq -R . | jq -s .)
  else
    orphan_json='[]'
  fi
  jq -n \
    --argjson total "$total_canonical" \
    --argjson broken "$n_broken" \
    --argjson orphans "$n_orphans" \
    --arg date "$(date -u +%Y-%m-%dT%H:%M:%SZ)" \
    --argjson broken_list "$broken_json" \
    --argjson orphan_list "$orphan_json" \
    '{date: $date, canonical_total: $total, broken_refs: $broken_list, orphans: $orphan_list, exit_code: (if $broken > 0 or $orphans > 0 then 1 else 0 end)}'
else
  if $QUIET && [[ $exit_code -eq 0 ]]; then
    exit 0
  fi
  render_report() {
    echo "# Bitácora deck audit"
    echo ""
    echo "_$(date)_ · catálogo: \`$CATALOG\`"
    echo ""
    echo "- Canonical decks: **$total_canonical**"
    echo "- Broken refs (in catalog, missing on disk): **$n_broken**"
    echo "- Orphans (on disk, missing from catalog): **$n_orphans**"
    echo ""
    if [[ $n_broken -gt 0 ]]; then
      echo "## Broken refs"
      echo ""
      for r in "${broken_refs[@]}"; do echo "- \`$r\`"; done
      echo ""
    fi
    if [[ $n_orphans -gt 0 ]]; then
      echo "## Orphans"
      echo ""
      echo "Decks found in MODO repos but not published in the bitácora. Either publish them via the \`modo-deck\` skill or add to the allowlist in \`audit-decks.sh\`."
      echo ""
      for f in "${orphans[@]}"; do
        rel="${f#$WORKSPACE_ROOT/}"
        title=$(grep -oE '<title>[^<]+</title>' "$f" 2>/dev/null | head -1 | sed -e 's/<[^>]*>//g')
        echo "- \`$rel\` — ${title:-(no title)}"
      done
      echo ""
    fi
    if [[ $exit_code -eq 0 ]]; then
      echo "✓ All decks accounted for."
    fi
  }

  if [[ -n "$REPORT_PATH" ]]; then
    render_report | tee "$REPORT_PATH"
  else
    render_report
  fi
fi

exit "$exit_code"
