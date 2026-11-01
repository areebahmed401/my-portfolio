// Builds the whole page from data/cv.json. Edit that file, not this one.
(() => {
  'use strict';

  const ICONS = {
    github: '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z"/></svg>',
    email: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zm0 4.2-8 5-8-5V6l8 5 8-5v2.2z"/></svg>',
    download: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>',
    trophy: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 5h-2V3H7v2H5a2 2 0 0 0-2 2v1c0 2.55 1.92 4.63 4.39 4.94A5.01 5.01 0 0 0 11 15.9V19H7v2h10v-2h-4v-3.1a5.01 5.01 0 0 0 3.61-2.96C19.08 12.63 21 10.55 21 8V7a2 2 0 0 0-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>'
  };
  const LEVELS = ['', 'Basic', 'Familiar', 'Proficient', 'Advanced', 'Expert'];
  const TABS = [
    { id: 'experience', label: 'Work Experience', intro: 'Roles, responsibilities and impact.' },
    { id: 'education', label: 'Education', intro: 'Degrees and academic background.' },
    { id: 'portfolio', label: 'Portfolio', intro: 'Climate-tech hardware and engineering software I have designed and built.' },
    { id: 'skills', label: 'Skills & Software', intro: 'Tools and software I work with.' },
    { id: 'accolades', label: 'Accolades', intro: 'Awards, certificates and honours.' }
  ];
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);

  const esc = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const safeUrl = (u) => (/^(https?:|mailto:|\.?\/|[\w-]+\/|#)/i.test(u || '') ? esc(u) : '#');
  const ext = (u) => (/^https?:/i.test(u) ? ' target="_blank" rel="noopener"' : '');
  const dates = (s, e) => esc([s, e].filter(Boolean).join(' – '));
  const tags = (list) => (list && list.length ? `<div class="tags">${list.map((t) => `<span class="tag">${esc(t)}</span>`).join('')}</div>` : '');
  const bullets = (list) => (list && list.length ? `<ul>${list.map((b) => `<li>${esc(b)}</li>`).join('')}</ul>` : '');
  const pending = (item) => (item.pending ? ' pending' : '');
  const pendingNote = (item) => (item.pending ? '<span class="pending-note">⏳ placeholder: will be filled from CV</span>' : '');
  const stagger = (i) => `style="--d:${Math.min(i, 6) * 0.08}s"`;
  const initials = (name) => esc(String(name || '').split(/[\s-]+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toUpperCase());

  // Software logos for skill chips: first keyword match wins. Add a row to give a new tool a logo.
  // color: brand colour, or null to use the text colour (for black logos).
  const SOFTWARE = [
    [/matlab|simulink/i, 'matlab', 'img'],
    [/autocad/i, 'autocad', '#E51050'],
    [/autodesk|inventor|vault|navisworks|advance steel|mep toolset|revit/i, 'autodesk', null],
    [/solidworks|catia|abaqus|dassault|cswa/i, 'dassaultsystemes', null],
    [/python/i, 'python', '#3776AB'],
    [/c\+\+/i, 'cplusplus', '#00599C'],
    [/jupyter/i, 'jupyter', '#F37626'],
    [/javascript/i, 'javascript', '#F7DF1E']
  ];
  const softwareIcon = (name) => {
    const hit = SOFTWARE.find(([re]) => re.test(name));
    if (!hit) return '';
    const [, slug, color] = hit;
    if (color === 'img') return `<img class="sw" src="assets/icons/${slug}.svg" alt="">`;
    const url = new URL(`assets/icons/${slug}.svg`, document.baseURI).href;
    return `<i class="sw" style="--icon:url('${url}')${color ? `;--c:${color}` : ''}"></i>`;
  };

  const orgLogo = (name, logo, site) => {
    const inner = logo ? `<img src="${safeUrl(logo)}" alt="${esc(name)} logo" loading="lazy">` : `<span>${initials(name)}</span>`;
    return site ? `<a class="org-logo" href="${safeUrl(site)}"${ext(site)} title="${esc(name)}">${inner}</a>` : `<span class="org-logo">${inner}</span>`;
  };

  const gallery = (photos) => (photos && photos.length ? `<div class="gallery">${photos.map((ph) => {
    const p = typeof ph === 'string' ? { src: ph } : ph;
    return `<button type="button" class="shot" data-src="${safeUrl(p.src)}" data-caption="${esc(p.caption)}" aria-label="Open photo${p.caption ? `: ${esc(p.caption)}` : ''}">
      <img src="${safeUrl(p.src)}" alt="${esc(p.caption)}" loading="lazy"></button>`;
  }).join('')}</div>` : '');

  // One timeline card, shared by experience and education
  const timelineCard = (x, i, title, org, meta, list) => `
      <article class="tl-item reveal" ${stagger(i)}>
        <div class="card${pending(x)}">
          <div class="card-head">
            ${orgLogo(org, x.logo, x.website)}
            <div class="card-head-text">
              <div class="card-top"><h3>${esc(title)}</h3><span class="dates">${dates(x.start, x.end)}</span></div>
              <p class="org">${esc(org)}</p>
              ${meta ? `<p class="meta">${esc(meta)}</p>` : ''}
            </div>
          </div>
          ${x.summary ? `<p>${esc(x.summary)}</p>` : ''}
          ${bullets(list)}${gallery(x.photos)}${tags(x.tags)}${pendingNote(x)}
        </div>
      </article>`;

  // ---------- Section renderers ----------
  const render = {
    experience: (items) => `<div class="timeline"><span class="timeline-line"></span>${items.map((x, i) =>
      timelineCard(x, i, x.role, x.company, x.location, x.bullets)).join('')}</div>`,

    education: (items) => `<div class="timeline"><span class="timeline-line"></span>${items.map((x, i) =>
      timelineCard(x, i, x.degree, x.institution, [x.location, x.grade].filter(Boolean).join(' · '), x.details)).join('')}</div>`,

    portfolio: (items) => `<div class="grid">${items.map((x, i) => {
      const links = `<div class="links">
        ${x.url ? `<a href="${safeUrl(x.url)}"${ext(x.url)}>${ICONS.github.replace('<svg', '<svg width="16" height="16" fill="currentColor"')} View repo <span class="arrow">→</span></a>` : ''}
        ${x.demo ? `<a href="${safeUrl(x.demo)}"${ext(x.demo)}>Live demo <span class="arrow">→</span></a>` : ''}
      </div>`;
      if (x.featured) {
        return `<article class="card project featured reveal" ${stagger(i)}>
          <div class="featured-row">${x.image ? `<img src="${safeUrl(x.image)}" alt="">` : ''}
            <div><span class="badge">Featured</span><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${tags(x.tags)}${links}</div>
          </div></article>`;
      }
      return `<article class="card project reveal" ${stagger(i)}><h3>${esc(x.title)}</h3><p>${esc(x.description)}</p>${tags(x.tags)}${links}</article>`;
    }).join('')}</div>`,

    skills: (groups) => `<div class="skill-groups">${groups.map((g, gi) => `
      <section class="card reveal${pending(g)}" ${stagger(gi)}>
        <h3>${esc(g.group)}</h3>
        ${(g.items || []).filter((s) => typeof s === 'string').length
          ? `<div class="chips">${g.items.filter((s) => typeof s === 'string').map((s, i) => `<span class="chip" style="--d:${0.05 + i * 0.05}s">${softwareIcon(s)}${esc(s)}</span>`).join('')}</div>` : ''}
        ${(g.items || []).filter((s) => typeof s === 'object').map((s, i) => {
          const lvl = Math.max(1, Math.min(5, Number(s.level) || 3));
          return `<div class="skill"><div class="skill-row"><span>${softwareIcon(s.name)}${esc(s.name)}</span><span>${LEVELS[lvl]}</span></div>
            <div class="bar" role="img" aria-label="${esc(s.name)}: ${LEVELS[lvl]}"><i style="--w:${lvl * 20}%;--d:${0.1 + i * 0.08}s"></i></div></div>`;
        }).join('')}
        ${pendingNote(g)}
      </section>`).join('')}</div>`,

    accolades: (items) => `<div class="grid">${items.map((x, i) => `
      <article class="card accolade reveal${pending(x)}" ${stagger(i)}>
        <span class="medal">${ICONS.trophy}</span>
        <div>
          <h3>${x.url ? `<a href="${safeUrl(x.url)}"${ext(x.url)}>${esc(x.title)}</a>` : esc(x.title)}</h3>
          <p class="meta">${esc([x.issuer, x.date].filter(Boolean).join(' · '))}</p>
          ${x.description ? `<p>${esc(x.description)}</p>` : ''}${pendingNote(x)}
        </div>
      </article>`).join('')}</div>`
  };

  // ---------- Profile / hero ----------
  function renderProfile(p) {
    document.querySelectorAll('[data-bind]').forEach((el) => { el.textContent = p[el.dataset.bind] || ''; });
    const photo = $('#heroPhoto');
    if (p.photo) { photo.src = p.photo; photo.alt = `Portrait of ${p.name || ''}`; } else { photo.closest('.hero-photo').remove(); }
    const links = p.links || {};
    const social = [];
    if (links.github) social.push(['github', links.github, 'GitHub']);
    if (links.linkedin) social.push(['linkedin', links.linkedin, 'LinkedIn']);
    if (p.email) social.push(['email', `mailto:${p.email}`, 'Email']);
    $('#social').innerHTML = social.map(([k, u, l]) => `<a class="icon-btn" href="${safeUrl(u)}"${ext(u)} aria-label="${l}" title="${l}">${ICONS[k]}</a>`).join('');

    const cta = [];
    if (links.github) cta.push(`<a class="btn btn-primary" href="${safeUrl(links.github)}"${ext(links.github)}>${ICONS.github} GitHub</a>`);
    if (links.linkedin) cta.push(`<a class="btn btn-ghost" href="${safeUrl(links.linkedin)}"${ext(links.linkedin)}>${ICONS.linkedin} LinkedIn</a>`);
    if (p.cvPdf) cta.push(`<a class="btn btn-ghost" href="${safeUrl(p.cvPdf)}" download>${ICONS.download} Download CV</a>`);
    $('#heroCta').innerHTML = cta.join('');
    $('#year').textContent = new Date().getFullYear();
    renderStats(p.highlights || []);
    typeRoles(p.roles && p.roles.length ? p.roles : [p.title || '']);
  }

  function renderStats(list) {
    const el = $('#stats');
    if (!list.length) { el.remove(); return; }
    el.innerHTML = list.map((h) => `<div class="stat"><strong><span class="count" data-to="${Number(h.value) || 0}">${reduceMotion ? esc(h.value) : 0}</span>${esc(h.suffix)}</strong><span class="stat-label">${esc(h.label)}</span></div>`).join('');
    if (reduceMotion) return;
    setTimeout(() => el.querySelectorAll('.count').forEach((c) => {
      const to = Number(c.dataset.to), t0 = performance.now(), dur = 1600;
      (function step(t) {
        const k = Math.min(1, (t - t0) / dur);
        c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(t0);
    }), 1000);
  }

  function typeRoles(roles) {
    const el = $('#typed');
    if (reduceMotion) { el.textContent = roles[0]; return; }
    let r = 0, c = 0, deleting = false;
    (function tick() {
      const word = roles[r];
      c += deleting ? -1 : 1;
      el.textContent = word.slice(0, c);
      let wait = deleting ? 35 : 70;
      if (!deleting && c === word.length) { wait = 2200; deleting = roles.length > 1; if (!deleting) return; }
      else if (deleting && c === 0) { deleting = false; r = (r + 1) % roles.length; wait = 400; }
      setTimeout(tick, wait);
    })();
  }

  // ---------- Tabs ----------
  function buildTabs(data) {
    const tabbar = $('#tabbar'), panels = $('#panels');
    const tabs = TABS.filter((t) => Array.isArray(data[t.id]) && data[t.id].length);
    tabs.forEach((t) => {
      const b = document.createElement('button');
      b.className = 'tab'; b.type = 'button'; b.id = `tab-${t.id}`;
      b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', `panel-${t.id}`);
      b.textContent = t.label; b.dataset.id = t.id;
      b.addEventListener('click', () => select(t.id, true));
      tabbar.appendChild(b);

      const s = document.createElement('section');
      s.className = 'panel'; s.id = `panel-${t.id}`;
      s.setAttribute('role', 'tabpanel'); s.setAttribute('aria-labelledby', b.id);
      s.innerHTML = `<div class="panel-head"><h2>${esc(t.label)}</h2><p>${esc((data.intros || {})[t.id] || t.intro)}</p></div>${render[t.id](data[t.id])}`;
      panels.appendChild(s);
    });

    tabbar.addEventListener('keydown', (e) => {
      if (!['ArrowLeft', 'ArrowRight'].includes(e.key)) return;
      const btns = [...tabbar.querySelectorAll('.tab')];
      const i = btns.indexOf(document.activeElement);
      const next = btns[(i + (e.key === 'ArrowRight' ? 1 : btns.length - 1)) % btns.length];
      next.focus(); select(next.dataset.id, true);
    });

    const fromHash = () => {
      const id = location.hash.slice(1);
      return tabs.some((t) => t.id === id) ? id : tabs[0].id;
    };
    window.addEventListener('hashchange', () => select(fromHash(), false));
    window.addEventListener('resize', moveIndicator);
    select(fromHash(), false);
    document.fonts && document.fonts.ready.then(moveIndicator);
  }

  function select(id, userAction) {
    document.querySelectorAll('.tab').forEach((b) => {
      const on = b.dataset.id === id;
      b.setAttribute('aria-selected', on); b.tabIndex = on ? 0 : -1;
    });
    document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === `panel-${id}`));
    moveIndicator();
    if (userAction) {
      history.replaceState(null, '', `#${id}`);
      const top = $('#tabs').getBoundingClientRect().top + scrollY - 40;
      if (scrollY > top) scrollTo({ top, behavior: reduceMotion ? 'auto' : 'smooth' });
      $(`#tab-${id}`).scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
    }
    observeReveals();
    drawTimelines();
  }

  function moveIndicator() {
    const active = $('.tab[aria-selected="true"]'), ind = $('#tabIndicator');
    if (!active) return;
    ind.style.width = `${active.offsetWidth}px`;
    ind.style.transform = `translateX(${active.offsetLeft}px)`;
  }

  // ---------- Scroll effects ----------
  const io = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }) : null;

  function observeReveals() {
    document.querySelectorAll('.panel.active .reveal:not(.in)').forEach((el) => (io ? io.observe(el) : el.classList.add('in')));
  }

  function drawTimelines() {
    document.querySelectorAll('.panel.active .timeline').forEach((tl) => {
      const line = $('.timeline-line', tl);
      const r = tl.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, (innerHeight * 0.75 - r.top) / r.height));
      line.style.height = `${progress * (r.height - 12)}px`;
    });
  }

  function onScroll() {
    $('#topbar').classList.toggle('scrolled', scrollY > 40);
    drawTimelines();
  }

  // Cursor-follow glow on portfolio cards
  document.addEventListener('pointermove', (e) => {
    const card = e.target.closest && e.target.closest('.project');
    if (!card) return;
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', `${e.clientX - r.left}px`);
    card.style.setProperty('--my', `${e.clientY - r.top}px`);
  });

  // ---------- Photo lightbox ----------
  function initLightbox() {
    const box = $('#lightbox'), img = $('#lightboxImg'), cap = $('#lightboxCaption');
    let last = null;
    const close = () => { box.classList.remove('open'); box.setAttribute('aria-hidden', 'true'); last && last.focus(); };
    document.addEventListener('click', (e) => {
      const shot = e.target.closest && e.target.closest('.shot');
      if (shot) {
        last = shot; img.src = shot.dataset.src; img.alt = shot.dataset.caption || ''; cap.textContent = shot.dataset.caption || '';
        box.classList.add('open'); box.setAttribute('aria-hidden', 'false'); $('#lightboxClose').focus();
      } else if (e.target === box || e.target.closest('#lightboxClose')) close();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && box.classList.contains('open')) close(); });
  }

  // ---------- Theme ----------
  function initTheme() {
    const root = document.documentElement;
    const dark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
    const sync = () => root.classList.toggle('is-dark', dark());
    sync();
    matchMedia('(prefers-color-scheme: dark)').addEventListener('change', sync);
    $('#themeToggle').addEventListener('click', () => {
      root.dataset.theme = dark() ? 'light' : 'dark';
      try { localStorage.setItem('theme', root.dataset.theme); } catch (e) {}
      sync();
    });
  }

  // ---------- Boot ----------
  initTheme();
  initLightbox();
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  fetch('data/cv.json', { cache: 'no-cache' })
    .then((r) => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
    .then((data) => { renderProfile(data.profile || {}); buildTabs(data); })
    .catch((err) => {
      console.error('Could not load data/cv.json', err);
      $('#panels').innerHTML = '<p class="card">Could not load <code>data/cv.json</code>. If you are opening the file directly, run a local server (see README).</p>';
    });
})();
