// "Selected Projects" (7 static, build-generated cards) vs "From GitHub"
// (live repos, fetched lazily on first click of that tab — not on page load).

import {GITHUB_USERNAME, langColors} from './config.js';
import {revealObserver} from './reveal.js';

const otherGrid = document.getElementById('otherProjectsGrid');
const githubGrid = document.getElementById('githubProjectsGrid');

let githubLoaded = false;
let githubError = null;

document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const tab = btn.dataset.tab;
    otherGrid.hidden = tab !== 'other';
    githubGrid.hidden = tab !== 'github';
    if (tab === 'github' && !githubLoaded) fetchGitHub();
  });
});

function renderGithubCard(r) {
  const card = document.createElement('div');
  card.className = 'project-card reveal';

  let meta = '';
  if (r.language) meta += '<span class="project-lang"><span class="lang-dot" aria-hidden="true" style="background:' + (langColors[r.language] || '#888') + '"></span>' + r.language + '</span>';
  if (r.stargazers_count) meta += '<span class="project-stat">★ ' + r.stargazers_count + '</span>';
  if (r.forks_count) meta += '<span class="project-stat">⑂ ' + r.forks_count + '</span>';

  card.innerHTML = '<div class="project-header"><span class="project-icon" aria-hidden="true">📂</span><div class="project-links"><a href="' + r.html_url + '" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a></div></div><h3 class="project-name">' + r.name + '</h3><p class="project-desc">' + (r.description || 'A project built during development labs and coursework.') + '</p><div class="project-meta">' + meta + '</div>';
  githubGrid.appendChild(card);
  revealObserver.observe(card);
}

async function fetchGitHub() {
  githubGrid.innerHTML = '<div class="projects-loading"><div class="spinner"></div>Loading projects...</div>';
  try {
    const res = await fetch('https://api.github.com/users/' + GITHUB_USERNAME + '/repos?sort=updated&per_page=30');
    if (res.status === 403) { githubError = 'rate-limited'; throw new Error('GitHub API rate limit reached') }
    if (!res.ok) { githubError = 'error'; throw new Error('GitHub API error ' + res.status) }
    const repos = await res.json();
    const filtered = repos.filter(r => !r.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 12);
    githubGrid.innerHTML = '';
    if (!filtered.length) { githubGrid.innerHTML = '<p class="projects-loading">No public repositories found.</p>'; }
    else filtered.forEach(renderGithubCard);
  } catch (e) {
    console.warn('GitHub:', e);
    const msg = githubError === 'rate-limited' ? 'GitHub API rate limit reached — try again later.' : 'Could not load GitHub projects right now.';
    githubGrid.innerHTML = '<p class="projects-loading">' + msg + '</p>';
  }
  githubLoaded = true;
}
