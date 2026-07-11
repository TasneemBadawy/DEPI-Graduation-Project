import { GUIDES } from "../data/guides";

const STORAGE_KEY = "nomade_admin_guide_verification";

/**
 * No backend yet, so admin verify/unverify actions live as a small
 * { [guideSlug]: true|false } override map in localStorage, layered on top
 * of each guide's seed `verified` flag. Every place that shows a guide's
 * verified badge (GuideCard, GuideProfile, the admin table itself) should
 * resolve through isGuideVerified()/getGuidesWithStatus() here instead of
 * reading guide.verified directly, so an admin action is reflected
 * everywhere immediately.
 */
function readOverrides() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeOverrides(map) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
}

export function isGuideVerified(slug) {
  const overrides = readOverrides();
  if (Object.prototype.hasOwnProperty.call(overrides, slug)) return overrides[slug];
  const guide = GUIDES.find((g) => g.slug === slug);
  return guide ? Boolean(guide.verified) : false;
}

export function setGuideVerified(slug, verified) {
  const overrides = readOverrides();
  overrides[slug] = verified;
  writeOverrides(overrides);
}

/** All seed guides with their verified flag resolved through any admin override. */
export function getGuidesWithStatus() {
  return GUIDES.map((g) => ({ ...g, verified: isGuideVerified(g.slug) }));
}
