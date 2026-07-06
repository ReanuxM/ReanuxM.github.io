// Fetches and shapes GitHub repository data for the "Latest Projects" section.
// Deliberately isolated from HTML rendering (that lives in build.js) so the
// network/caching concerns don't leak into the templating code.
//
// Resilience contract: if GitHub can't be reached, fall back to the last
// successfully fetched data (content/.github-cache.json) and warn loudly —
// the build must never fail or blank the section just because the API
// timed out or hit a rate limit.

const fs = require('fs');
const path = require('path');
const https = require('https');

const USERNAME = 'ReanuxM';
const EXCLUDE = new Set(['ReanuxM.github.io', 'ReanuxM', 'test']);
const COUNT = 6;
const CACHE_FILE = path.join(__dirname, '..', 'content', '.github-cache.json');

function fetchJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {'User-Agent': 'reanuxm-portfolio-build', 'Accept': 'application/vnd.github+json'},
      timeout: 10000,
    }, res => {
      if (res.statusCode !== 200) {
        res.resume();
        reject(new Error(`GitHub API responded ${res.statusCode} for ${url}`));
        return;
      }
      let body = '';
      res.on('data', chunk => { body += chunk; });
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (err) { reject(err); }
      });
    });
    req.on('timeout', () => req.destroy(new Error('GitHub API request timed out')));
    req.on('error', reject);
  });
}

function prepare(repos) {
  return repos
    .filter(r => !r.fork && !EXCLUDE.has(r.name))
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, COUNT)
    .map(r => ({
      name: r.name,
      description: r.description || 'No description provided.',
      language: r.language,
      topics: r.topics || [],
      createdAt: r.created_at,
      updatedAt: r.updated_at,
      stars: r.stargazers_count || 0,
      forks: r.forks_count || 0,
      url: r.html_url,
    }));
}

async function getLatestRepos() {
  try {
    const repos = await fetchJSON(`https://api.github.com/users/${USERNAME}/repos?per_page=100&sort=created&direction=desc`);
    if (!Array.isArray(repos)) throw new Error('Unexpected GitHub API response shape');
    const prepared = prepare(repos);
    fs.writeFileSync(CACHE_FILE, JSON.stringify({fetchedAt: new Date().toISOString(), repos: prepared}, null, 2));
    return prepared;
  } catch (err) {
    console.warn(`[build] WARNING: GitHub fetch failed (${err.message}).`);
    if (fs.existsSync(CACHE_FILE)) {
      const cache = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      console.warn(`[build] Falling back to cached data from ${cache.fetchedAt} — Latest Projects section left unchanged.`);
      return cache.repos;
    }
    console.warn('[build] No cache available — Latest Projects section will be empty this build.');
    return [];
  }
}

module.exports = {getLatestRepos};
