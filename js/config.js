// Shared constants used across browser-side modules.
// Project content itself now lives in content/*.js and is rendered into
// static HTML at build time (see build.js) — nothing left to duplicate here.

export const GITHUB_USERNAME = 'ReanuxM';

// Respected by particles.js and hero.js to skip/short-circuit continuous animation.
export const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const langColors = {JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572A5', Java: '#b07219', HTML: '#e34c26', CSS: '#563d7c', 'Jupyter Notebook': '#DA5B0B', Shell: '#89e051', C: '#555', 'C++': '#f34b7d'};
