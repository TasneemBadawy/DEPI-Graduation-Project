import { GUIDES } from "../data/guides";

const STORAGE_KEY = "nomade_admin_guide_verification";

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

export function getGuidesWithStatus() {
  return GUIDES.map((g) => ({ ...g, verified: isGuideVerified(g.slug) }));
}