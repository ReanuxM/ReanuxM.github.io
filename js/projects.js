// Renders the Projects grid from the hardcoded featured list plus a live
// GitHub repos fetch, and wires up the All/Featured/From GitHub tabs.

import {GITHUB_USERNAME, FEATURED_PROJECTS, langColors} from './config.js';
import {revealObserver} from './reveal.js';

let allProjects = [];
let githubError = null;

function renderProjects(tab) {
  const grid = document.getElementById('projectsGrid');
  let list = allProjects;
  if (tab === 'featured') list = allProjects.filter(p => p.type === 'featured');
  if (tab === 'github') list = allProjects.filter(p => p.type === 'github');

  if (!list.length) {
    const msg = tab === 'github' && githubError === 'rate-limited' ? 'GitHub API rate limit reached — try again later.'
      : tab === 'github' && githubError ? 'Could not load GitHub projects right now.'
      : 'No projects in this category.';
    grid.innerHTML = '<p class="projects-loading">' + msg + '</p>';
    return;
  }

  grid.innerHTML = '';
  list.forEach((p, i) => {
    const card = document.createElement('div');
    card.className = 'project-card reveal';
    card.style.transitionDelay = i * .06 + 's';

    let meta = '';
    if (p.tags) meta = p.tags.map(t => '<span class="project-tag">' + t + '</span>').join('');
    if (p.language) meta += '<span class="project-lang"><span class="lang-dot" aria-hidden="true" style="background:' + (langColors[p.language] || '#888') + '"></span>' + p.language + '</span>';
    if (p.stars) meta += '<span class="project-stat">★ ' + p.stars + '</span>';
    if (p.forks) meta += '<span class="project-stat">⑂ ' + p.forks + '</span>';

    card.innerHTML = '<div class="project-header"><span class="project-icon" aria-hidden="true">' + (p.type === 'github' ? '📂' : '🚀') + '</span><div class="project-links">' + (p.url ? '<a href="' + p.url + '" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>' : '') + '</div></div><h3 class="project-name">' + p.name + '</h3><p class="project-desc">' + p.desc + '</p><div class="project-meta">' + meta + '</div>';
    grid.appendChild(card);
    revealObserver.observe(card);
  });
}

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProjects(btn.dataset.tab);
  });
});

async function fetchGitHub() {
  allProjects = [...FEATURED_PROJECTS];
  try {
    const res = await fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=30');
    if (res.status === 403) { githubError = 'rate-limited'; throw new Error('GitHub API rate limit reached') }
    if (!res.ok) { githubError = 'error'; throw new Error('GitHub API error ' + res.status) }
    const repos = await res.json();
    repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 12).forEach(r => {
      allProjects.push({name: r.name, desc: r.description || 'A project built during development labs and coursework.', language: r.language, stars: r.stargazers_count || 0, forks: r.forks_count || 0, url: r.html_url, type: 'github'});
    });
  } catch (e) {
    console.warn('GitHub:', e);
    if (!githubError) githubError = 'error';
  }
  renderProjects(document.querySelector('.tab-btn.active')?.dataset.tab || 'all');
}

fetchGitHub();
