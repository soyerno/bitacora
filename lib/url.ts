/** URL helpers shared across feed renderers. */

const EXTERNAL_PROTO = /^https?:\/\//;
const STATIC_FILE = /\.[a-z0-9]+(?:\?.*)?$/i;

export const isExternal = (href: string): boolean => EXTERNAL_PROTO.test(href);

/** True when href points to a static asset in `public/` (has file extension). */
export const isStaticAsset = (href: string): boolean =>
  !isExternal(href) && STATIC_FILE.test(href);

/**
 * Normalize a feed-relative href ("./foo/bar.html" or "foo/bar.html") to an
 * absolute public path ("/foo/bar.html"). External URLs pass through.
 */
export function toAbsoluteHref(href: string): string {
  if (isExternal(href)) return href;
  return "/" + href.replace(/^\.?\//, "");
}
