// Scroll-reveal observer. Exported so projects.js can attach it to
// project cards it injects after the initial page load.

export const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') });
}, {threshold: .1});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
