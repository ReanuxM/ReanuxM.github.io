// Scroll-reveal: fades in any .reveal element as it enters the viewport.
// All project content is static at build time now, so this only needs to
// observe what's already in the DOM on load — nothing injects cards
// dynamically anymore.

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') });
}, {threshold: .1});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
