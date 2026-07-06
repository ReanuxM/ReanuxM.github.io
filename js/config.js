// Shared constants used across browser-side modules.
// Project content lives in content/*.js and is rendered into static HTML at
// build time (see build.js) — nothing left to fetch or duplicate here.

// Respected by particles.js and hero.js to skip/short-circuit continuous animation.
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
