#!/usr/bin/env node
/**
 * Fetches the authenticated viewer's contribution calendar via GitHub GraphQL
 * (includes private/restricted contributions, unlike the public scrapers)
 * and writes:
 *   - assets/contributions.svg  (the chart, MODO green palette)
 *   - assets/profile.json       (profile stats, removes the unauth API rate limit)
 *
 * Env:
 *   CONTRIB_TOKEN   GitHub PAT (read:user). Required.
 *   GITHUB_USER     Override username for logging. Defaults to viewer.login.
 *   OUTPUT_SVG      Override path. Defaults to assets/contributions.svg.
 *   OUTPUT_JSON     Override path. Defaults to assets/profile.json.
 */

import { writeFile, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const TOKEN = process.env.CONTRIB_TOKEN || process.env.GH_TOKEN;
if (!TOKEN) {
  console.error('Missing CONTRIB_TOKEN env var');
  process.exit(1);
}

const OUTPUT_SVG = process.env.OUTPUT_SVG || 'public/assets/contributions.svg';
const OUTPUT_JSON = process.env.OUTPUT_JSON || 'public/assets/profile.json';

const query = `query {
  viewer {
    login name avatarUrl bio
    followers { totalCount }
    following { totalCount }
    repositories(privacy: PUBLIC) { totalCount }
    contributionsCollection {
      restrictedContributionsCount
      totalCommitContributions
      totalPullRequestContributions
      totalIssueContributions
      contributionCalendar {
        totalContributions
        weeks {
          firstDay
          contributionDays {
            date
            contributionCount
            contributionLevel
            weekday
          }
        }
      }
    }
  }
}`;

const res = await fetch('https://api.github.com/graphql', {
  method: 'POST',
  headers: {
    Authorization: `bearer ${TOKEN}`,
    'Content-Type': 'application/json',
    'User-Agent': 'erno-modo-contrib-generator'
  },
  body: JSON.stringify({ query })
});

if (!res.ok) {
  console.error('GraphQL HTTP', res.status, await res.text());
  process.exit(1);
}

const json = await res.json();
if (json.errors) {
  console.error('GraphQL errors', JSON.stringify(json.errors, null, 2));
  process.exit(1);
}

const viewer = json.data.viewer;
const cc = viewer.contributionsCollection;
const cal = cc.contributionCalendar;

const CELL = 11;
const GAP = 3;
const STRIDE = CELL + GAP;
const PAD_LEFT = 28;
const PAD_TOP = 22;
const PAD_BOTTOM = 28;

const weeks = cal.weeks;
const W = PAD_LEFT + weeks.length * STRIDE + 6;
const H = PAD_TOP + 7 * STRIDE + PAD_BOTTOM;

const colors = {
  NONE: '#ebedf0',
  FIRST_QUARTILE: '#c6e4d2',
  SECOND_QUARTILE: '#5cba8a',
  THIRD_QUARTILE: '#008859',
  FOURTH_QUARTILE: '#00603e'
};

const months = ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'];
const dayLabels = ['', 'Lun', '', 'Mié', '', 'Vie', ''];

const esc = (s) => String(s).replace(/[<>&"]/g, (c) => ({ '<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;' }[c]));

let svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-labelledby="title desc">`;
svg += `<title id="title">Contribuciones de @${esc(viewer.login)} en el último año</title>`;
svg += `<desc id="desc">${cal.totalContributions} contribuciones totales, ${cc.restrictedContributionsCount} privadas.</desc>`;
svg += `<style>text{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;font-size:9px;fill:#57606a}</style>`;

let lastMonth = -1;
weeks.forEach((w, i) => {
  const d = new Date(w.firstDay + 'T00:00:00Z');
  const m = d.getUTCMonth();
  if (m !== lastMonth && d.getUTCDate() <= 7) {
    svg += `<text x="${PAD_LEFT + i * STRIDE}" y="${PAD_TOP - 8}">${months[m]}</text>`;
    lastMonth = m;
  }
});

dayLabels.forEach((d, i) => {
  if (d) svg += `<text x="0" y="${PAD_TOP + i * STRIDE + CELL - 1}">${d}</text>`;
});

weeks.forEach((w, weekIdx) => {
  w.contributionDays.forEach((day) => {
    const fill = colors[day.contributionLevel] || colors.NONE;
    const x = PAD_LEFT + weekIdx * STRIDE;
    const y = PAD_TOP + day.weekday * STRIDE;
    svg += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2" ry="2" fill="${fill}">`;
    svg += `<title>${day.date}: ${day.contributionCount} contribuciones</title></rect>`;
  });
});

const legendY = PAD_TOP + 7 * STRIDE + 12;
svg += `<text x="${PAD_LEFT}" y="${legendY + 8}">${cal.totalContributions} contribuciones · ${cc.restrictedContributionsCount} privadas</text>`;

const legendStart = W - 5 * STRIDE - 56;
svg += `<text x="${legendStart - 30}" y="${legendY + 8}">Menos</text>`;
['NONE','FIRST_QUARTILE','SECOND_QUARTILE','THIRD_QUARTILE','FOURTH_QUARTILE'].forEach((lvl, i) => {
  svg += `<rect x="${legendStart + i * STRIDE}" y="${legendY}" width="${CELL}" height="${CELL}" rx="2" ry="2" fill="${colors[lvl]}"/>`;
});
svg += `<text x="${legendStart + 5 * STRIDE + 4}" y="${legendY + 8}">Más</text>`;
svg += `</svg>`;

const profile = {
  login: viewer.login,
  name: viewer.name,
  avatarUrl: viewer.avatarUrl,
  bio: viewer.bio,
  followers: viewer.followers.totalCount,
  following: viewer.following.totalCount,
  publicRepos: viewer.repositories.totalCount,
  contributions: {
    total: cal.totalContributions,
    restricted: cc.restrictedContributionsCount,
    commits: cc.totalCommitContributions,
    pullRequests: cc.totalPullRequestContributions,
    issues: cc.totalIssueContributions
  },
  generatedAt: new Date().toISOString()
};

await mkdir(dirname(OUTPUT_SVG), { recursive: true });
await writeFile(OUTPUT_SVG, svg);
await writeFile(OUTPUT_JSON, JSON.stringify(profile, null, 2));

console.log(`OK ${OUTPUT_SVG} (${svg.length} bytes)`);
console.log(`OK ${OUTPUT_JSON}`);
console.log(`   total=${cal.totalContributions} restricted=${cc.restrictedContributionsCount} commits=${cc.totalCommitContributions} PRs=${cc.totalPullRequestContributions}`);
