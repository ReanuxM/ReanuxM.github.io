// Animated stat counters in the About section, triggered once on scroll into view.

function animateNum(id, target) {
  const el = document.getElementById(id); if (!el) return;
  let cur = 0; const step = Math.max(1, Math.floor(target / 35));
  const iv = setInterval(() => { cur += step; if (cur >= target) { cur = target; clearInterval(iv) } el.textContent = cur }, 30);
}

const aboutObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateNum('modelCount', 8);
      animateNum('projectCount', 20);
      animateNum('langCount', 15);
      animateNum('specCount', 6);
      aboutObs.disconnect();
    }
  });
}, {threshold: .3});

document.querySelectorAll('.about-stats').forEach(el => aboutObs.observe(el));
