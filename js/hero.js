// Hero section entrance choreography: name letter reveal, badge/subtitle/CTA
// fade-ins, and the fake-typing code block.

import {reduceMotion} from './config.js';

const nameEl = document.getElementById('heroName');
const first = 'Mohammed', last = 'Mahrous';

function addChars(text, cls, container, startDelay) {
  text.split('').forEach((ch, i) => {
    const span = document.createElement('span');
    span.className = 'char ' + cls;
    span.textContent = ch;
    span.dataset.delay = startDelay + i * 55;
    container.appendChild(span);
  });
}

const l1 = document.createElement('span'); l1.className = 'name-line'; nameEl.appendChild(l1);
const l2 = document.createElement('span'); l2.className = 'name-line'; nameEl.appendChild(l2);
addChars(first, 'fname', l1, 500);
addChars(last, 'lname', l2, 500 + first.length * 55);
setTimeout(() => {
  document.querySelectorAll('.hero-name .char').forEach(c => {
    setTimeout(() => c.classList.add('show'), +c.dataset.delay);
  });
}, 100);

setTimeout(() => { const b = document.getElementById('heroBadge'); b.style.transition = 'all .6s ease'; b.style.opacity = '1'; b.style.transform = 'translateY(0)' }, 300);
setTimeout(() => { const s = document.getElementById('heroSub'); s.style.transition = 'all .6s ease'; s.style.opacity = '1'; s.style.transform = 'translateY(0)' }, 1400);

const codeBlock = document.getElementById('codeBlock'), codeContent = document.getElementById('codeContent');
const segs = [
  {t: 'const ', c: 'kw'}, {t: 'ml_engineer', c: 'prop'}, {t: ' = {\n', c: 'punc'},
  {t: '  name', c: 'prop'}, {t: ': ', c: 'punc'}, {t: "'Mohammed Mahrous'", c: 'str'}, {t: ',\n', c: 'punc'},
  {t: '  role', c: 'prop'}, {t: ': ', c: 'punc'}, {t: "'AI/ML Engineer'", c: 'str'}, {t: ',\n', c: 'punc'},
  {t: '  ai', c: 'prop'}, {t: ': ', c: 'punc'}, {t: "['BERT','LSTM','CNN']", c: 'str'}, {t: ',\n', c: 'punc'},
  {t: '  ml', c: 'prop'}, {t: ': ', c: 'punc'}, {t: "['TF','PyTorch','Sklearn']", c: 'str'}, {t: ',\n', c: 'punc'},
  {t: '  hireable', c: 'prop'}, {t: ': ', c: 'punc'}, {t: 'true', c: 'bool'}, {t: '\n', c: 'punc'},
  {t: '};', c: 'punc'},
];

setTimeout(() => {
  codeBlock.style.transition = 'all .7s ease'; codeBlock.style.opacity = '1'; codeBlock.style.transform = 'translateY(0)';
  let line = document.createElement('div'); line.className = 'code-line'; codeContent.appendChild(line);

  if (reduceMotion) {
    // Skip the char-by-char typing effect — render the finished block instantly.
    segs.forEach(seg => {
      const parts = seg.t.split('\n');
      parts.forEach((part, i) => {
        if (part) { const s = document.createElement('span'); s.className = seg.c; s.textContent = part; line.appendChild(s) }
        if (i < parts.length - 1) { line = document.createElement('div'); line.className = 'code-line'; codeContent.appendChild(line) }
      });
    });
    return;
  }

  const cur = document.createElement('span'); cur.className = 'code-cursor';
  let si = 0, ci = 0;
  function type() {
    if (si >= segs.length) { cur.remove(); return }
    const ch = segs[si].t[ci];
    if (ch === '\n') { cur.remove(); line = document.createElement('div'); line.className = 'code-line'; codeContent.appendChild(line); line.appendChild(cur) }
    else { cur.remove(); const s = document.createElement('span'); s.className = segs[si].c; s.textContent = ch; line.appendChild(s); line.appendChild(cur) }
    ci++; if (ci >= segs[si].t.length) { si++; ci = 0 }
    setTimeout(type, 28 + Math.random() * 22);
  }
  line.appendChild(cur); type();
}, 1600);

setTimeout(() => { const c = document.getElementById('heroCta'); c.style.transition = 'all .6s ease'; c.style.opacity = '1'; c.style.transform = 'translateY(0)' }, 3400);
setTimeout(() => document.getElementById('scrollHint').classList.add('show'), 3800);
