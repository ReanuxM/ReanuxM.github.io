// Navbar scroll shadow, scroll-progress bar, and mobile menu toggle.

window.addEventListener('scroll', () => {
  document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 50);
  document.getElementById('scrollProgress').style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100 + '%';
});

const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', function () {
  this.classList.toggle('active');
  const open = navLinks.classList.toggle('open');
  this.setAttribute('aria-expanded', open);
});

navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.classList.remove('active');
  navToggle.setAttribute('aria-expanded', 'false');
}));
