// Static-site generator for the parts of this portfolio that would otherwise
// duplicate the same nav/footer chrome across many files.
//
// Run with `node build.js` after editing anything under content/ or partials/.
// Output is plain static HTML — GitHub Pages needs no build step at deploy
// time, this only runs locally before committing.

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SITE_URL = 'https://reanuxm.github.io';

const caseStudies = require('./content/case-studies.js');
const otherProjects = require('./content/other-projects.js');
const experience = require('./content/experience.js');
const certifications = require('./content/certifications.js');

const navPartial = fs.readFileSync(path.join(ROOT, 'partials/nav.html'), 'utf8');
const footerPartial = fs.readFileSync(path.join(ROOT, 'partials/footer.html'), 'utf8');

function renderNav(homeToken, rootToken) {
  return navPartial.replace(/__HOME__/g, homeToken).replace(/__ROOT__/g, rootToken);
}

function injectBetween(html, marker, fragment) {
  const start = `<!-- BUILD:${marker}_START -->`;
  const end = `<!-- BUILD:${marker}_END -->`;
  const re = new RegExp(escapeRegExp(start) + '[\\s\\S]*?' + escapeRegExp(end));
  if (!re.test(html)) throw new Error(`Marker ${marker} not found in target HTML`);
  return html.replace(re, `${start}\n${fragment}\n${end}`);
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function renderTags(tags) {
  return tags.map(t => `<span class="project-tag">${t}</span>`).join('');
}

// ---- Spotlight (graduation project) ----
function renderSpotlight() {
  const cs = caseStudies.find(c => c.gradProject);
  if (!cs) return '';
  return `    <div class="spotlight-card reveal">
      <span class="spotlight-badge">🎓 Graduation Project</span>
      <h2 class="spotlight-name">${cs.name}</h2>
      <p class="spotlight-tagline">${cs.tagline}</p>
      <div class="spotlight-results">${cs.results.map(r => `<span class="spotlight-result">${r}</span>`).join('')}</div>
      <div class="spotlight-tags">${renderTags(cs.stack)}</div>
      <a href="projects/${cs.slug}.html" class="btn btn-primary spotlight-cta">Read Case Study →</a>
    </div>`;
}

// ---- Experience ----
function renderExperience() {
  return experience.map((e, i) => `      <div class="experience-card reveal reveal-d${Math.min(i + 1, 5)}">
        <div class="experience-head">
          <h3 class="experience-title">${e.title} <span>· ${e.company}</span></h3>
          <span class="experience-dates">${e.dates}</span>
        </div>
        <p class="experience-desc">${e.description}</p>
      </div>`).join('\n');
}

// ---- Certifications ----
function renderCertifications() {
  return certifications.map((c, i) => `      <div class="cert-card reveal reveal-d${Math.min(i + 1, 5)}">
        <span class="cert-icon" aria-hidden="true">🎓</span>
        <h3 class="cert-name">${c.name}</h3>
        <p class="cert-issuer">${c.issuer}</p>
        <div class="cert-meta">
          <span class="cert-year">${c.year || 'Year'}</span>
          ${c.verifyUrl ? `<a href="${c.verifyUrl}" target="_blank" rel="noopener" class="cert-verify">Verify credential →</a>` : ''}
        </div>
      </div>`).join('\n');
}

// ---- Case studies grid (homepage teaser cards) ----
function renderCaseStudiesGrid() {
  return caseStudies.map((cs, i) => `      <div class="case-study-card reveal reveal-d${Math.min(i + 1, 5)}">
        ${cs.gradProject ? '<span class="case-study-grad-badge">🎓 Graduation Project</span>' : ''}
        <h3 class="case-study-name">${cs.name}</h3>
        <p class="case-study-tagline">${cs.tagline}</p>
        <div class="case-study-tags">${renderTags(cs.stack)}</div>
        <a href="projects/${cs.slug}.html" class="case-study-link">Read case study →</a>
      </div>`).join('\n');
}

// ---- Other (non-case-study) featured projects ----
function renderOtherProjects() {
  return otherProjects.map(p => `      <div class="project-card reveal">
        <div class="project-header">
          <span class="project-icon" aria-hidden="true">🚀</span>
          <div class="project-links">${p.url ? `<a href="${p.url}" target="_blank" rel="noopener"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg></a>` : ''}</div>
        </div>
        <h3 class="project-name">${p.name}</h3>
        <p class="project-desc">${p.desc}</p>
        <div class="project-meta">${renderTags(p.tags)}</div>
      </div>`).join('\n');
}

// ---- Build index.html ----
function buildIndex() {
  const file = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(file, 'utf8');
  html = injectBetween(html, 'NAV', renderNav('', ''));
  html = injectBetween(html, 'FOOTER', footerPartial.trim());
  html = injectBetween(html, 'SPOTLIGHT', renderSpotlight());
  html = injectBetween(html, 'EXPERIENCE', renderExperience());
  html = injectBetween(html, 'CERTIFICATIONS', renderCertifications());
  html = injectBetween(html, 'CASE_STUDIES', renderCaseStudiesGrid());
  html = injectBetween(html, 'OTHER_PROJECTS', renderOtherProjects());
  fs.writeFileSync(file, html);
  console.log('  index.html updated');
}

// ---- Build case-study pages ----
function caseStudyPage(cs) {
  const nav = renderNav('../index.html', '../');
  const resultsList = cs.results.map(r => `<li>${r}</li>`).join('\n            ');
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${cs.name} — Mohammed Mahrous</title>
<meta name="description" content="${cs.tagline}">
<meta name="theme-color" content="#07060d">
<link rel="canonical" href="${SITE_URL}/projects/${cs.slug}.html">
<link rel="icon" href="../favicon.svg" type="image/svg+xml">

<meta property="og:type" content="article">
<meta property="og:url" content="${SITE_URL}/projects/${cs.slug}.html">
<meta property="og:site_name" content="Mohammed Mahrous">
<meta property="og:title" content="${cs.name} — Mohammed Mahrous">
<meta property="og:description" content="${cs.tagline}">
<meta property="og:image" content="${SITE_URL}/favicon.svg">

<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${cs.name} — Mohammed Mahrous">
<meta name="twitter:description" content="${cs.tagline}">

<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": "${cs.name}",
  "description": "${cs.tagline}",
  "url": "${SITE_URL}/projects/${cs.slug}.html",
  "author": {"@type": "Person", "name": "Mohammed Mahrous", "url": "${SITE_URL}/"}
}
</script>

<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../css/main.css">
<link rel="stylesheet" href="../css/case-study.css">
</head>
<body>

<a href="#main" class="skip-link">Skip to content</a>
<div class="scroll-progress" id="scrollProgress"></div>

${nav}

<main id="main">
<article>
  <div class="case-study-hero">
    <a href="../index.html#projects" class="case-study-back">← Back to portfolio</a>
    ${cs.gradProject ? '<span class="spotlight-badge">🎓 Graduation Project</span>' : ''}
    <h1>${cs.name}</h1>
    <p class="case-study-tagline">${cs.tagline}</p>
    <div class="case-study-tags">${renderTags(cs.stack)}</div>
  </div>

  <div class="case-study-body">
    <div class="case-study-section reveal">
      <h2><em>Problem</em></h2>
      <p>${cs.problem}</p>
    </div>
    <div class="case-study-section reveal">
      <h2><em>Approach</em></h2>
      <p>${cs.approach}</p>
    </div>
    <div class="case-study-section reveal">
      <h2><em>Results</em></h2>
      <ul class="case-study-results">
            ${resultsList}
      </ul>
    </div>

    <div class="case-study-cta reveal">
      <p>Want the full picture, or think this kind of work fits a role you're hiring for?</p>
      <div class="case-study-cta-links">
        <a href="../resume.pdf" download class="btn btn-primary">Download Resume</a>
        <a href="../index.html#contact" class="btn btn-ghost">Get In Touch</a>
      </div>
    </div>
  </div>
</article>
</main>

${footerPartial.trim()}

<script type="module" src="../js/nav.js"></script>
<script type="module" src="../js/reveal.js"></script>
<script type="module" src="../js/year.js"></script>
</body>
</html>
`;
}

function buildCaseStudyPages() {
  const outDir = path.join(ROOT, 'projects');
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir);
  caseStudies.forEach(cs => {
    fs.writeFileSync(path.join(outDir, `${cs.slug}.html`), caseStudyPage(cs));
    console.log(`  projects/${cs.slug}.html written`);
  });
}

// ---- Sitemap ----
function buildSitemap() {
  const urls = [
    {loc: `${SITE_URL}/`, priority: '1.0'},
    ...caseStudies.map(cs => ({loc: `${SITE_URL}/projects/${cs.slug}.html`, priority: '0.8'})),
  ];
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <changefreq>monthly</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), xml);
  console.log('  sitemap.xml updated');
}

buildIndex();
buildCaseStudyPages();
buildSitemap();
console.log('Build complete.');
