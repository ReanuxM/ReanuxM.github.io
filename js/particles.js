// Ambient particle background on the hero canvas.

import {reduceMotion} from './config.js';

const c = document.getElementById('particles-canvas'), ctx = c.getContext('2d');
let ps = [], mouse = {x: null, y: null}, w, h;

function resize() { w = c.width = window.innerWidth; h = c.height = window.innerHeight }
resize();
window.addEventListener('resize', resize);
c.addEventListener('mousemove', e => { mouse.x = e.x; mouse.y = e.y });
c.addEventListener('mouseleave', () => { mouse.x = null; mouse.y = null });

class Particle {
  constructor() {
    this.x = Math.random() * w; this.y = Math.random() * h;
    this.s = Math.random() * 1.5 + .5;
    this.vx = (Math.random() - .5) * .25; this.vy = (Math.random() - .5) * .25;
    this.o = Math.random() * .4 + .15;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > w) this.vx *= -1;
    if (this.y < 0 || this.y > h) this.vy *= -1;
    if (mouse.x !== null) {
      const dx = mouse.x - this.x, dy = mouse.y - this.y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 150) { const f = (150 - d) / 150; this.x -= dx * f * .015; this.y -= dy * f * .015 }
    }
  }
  draw() {
    ctx.fillStyle = `rgba(245,158,11,${this.o})`;
    ctx.beginPath(); ctx.arc(this.x, this.y, this.s, 0, Math.PI * 2); ctx.fill();
  }
}

const n = Math.min(Math.floor(w * h / 9000), 100);
for (let i = 0; i < n; i++) ps.push(new Particle());

// O(n^2) pairwise distance check for connecting lines — fine at n<=100.
function loop() {
  ctx.clearRect(0, 0, w, h);
  for (let i = 0; i < ps.length; i++) {
    ps[i].update(); ps[i].draw();
    for (let j = i + 1; j < ps.length; j++) {
      const dx = ps[i].x - ps[j].x, dy = ps[i].y - ps[j].y, d = Math.sqrt(dx * dx + dy * dy);
      if (d < 110) {
        ctx.strokeStyle = `rgba(245,158,11,${.06 * (1 - d / 110)})`;
        ctx.lineWidth = .5;
        ctx.beginPath(); ctx.moveTo(ps[i].x, ps[i].y); ctx.lineTo(ps[j].x, ps[j].y); ctx.stroke();
      }
    }
  }
  requestAnimationFrame(loop);
}

// Reduced motion: draw one static frame instead of a continuous rAF loop.
if (reduceMotion) { ctx.clearRect(0, 0, w, h); ps.forEach(p => p.draw()); }
else { loop(); }
