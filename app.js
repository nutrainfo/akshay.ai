/* ============================================================
   FinCalc Pro — app.js
   Main application: calculators, compare
   ============================================================ */

/* ---- Global State ---- */
const App = {
  currentCalc: null,
  reducedMotion: false,
};

/* ============================================================
   PREMIUM SVG ICON LIBRARY
   ============================================================ */
const ICONS = {
  sip: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  'step-sip': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="14" width="5" height="7" rx="1"/><rect x="9" y="9" width="5" height="12" rx="1"/><rect x="16" y="4" width="5" height="17" rx="1"/></svg>`,
  lumpsum: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="17" r="4"/><path d="M12 13V5"/><polyline points="8 9 12 5 16 9"/></svg>`,
  swp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="10" rx="2"/><path d="M12 13v6"/><polyline points="9 16 12 19 15 16"/></svg>`,
  'sip-vs-lumpsum': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m16 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="m2 16 3-8 3 8c-.87.65-1.92 1-3 1s-2.13-.35-3-1Z"/><path d="M7 21H17"/><path d="M12 3v18"/><path d="M3 7h2c2 0 5-1 7-2 2 1 5 2 7 2h2"/></svg>`,
  'sip-goal': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none"/></svg>`,
  'sip-ladder': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="3" x2="8" y2="21"/><line x1="16" y1="3" x2="16" y2="21"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="17" x2="16" y2="17"/></svg>`,
  'home-loan': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`,
  'car-loan': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="11" width="22" height="7" rx="2"/><path d="M4.5 11L7 6h10l2.5 5"/><circle cx="7.5" cy="18" r="1.5"/><circle cx="16.5" cy="18" r="1.5"/></svg>`,
  'edu-loan': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/></svg>`,
  prepayment: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="15" rx="2"/><line x1="3" y1="10" x2="21" y2="10"/><line x1="8" y1="3" x2="8" y2="7"/><line x1="16" y1="3" x2="16" y2="7"/><path d="M9 15l2 2 4-4"/></svg>`,
  fd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M8 9v2"/><path d="M12 9v2"/><path d="M16 9v2"/><path d="M7 14h2v3H7z"/><path d="M11 14h2v3h-2z"/><path d="M15 14h2v3h-2z"/></svg>`,
  rd: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="16" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14l2 2 4-4"/></svg>`,
  ppf: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/><line x1="12" y1="15" x2="12" y2="17"/></svg>`,
  tax: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/><line x1="9" y1="9" x2="11" y2="9"/></svg>`,
  'income-tax': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>`,
  'capital-gains': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  nps: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>`,
  retirement: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M5 21v-1a7 7 0 0 1 14 0v1"/><path d="M8 14l-2 7"/><path d="M16 14l2 7"/><line x1="6" y1="21" x2="18" y2="21"/></svg>`,
  'child-edu': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c0 2 2 3 6 3s6-1 6-3v-5"/><circle cx="18" cy="4" r="2"/></svg>`,
  /* Quick strip icons */
  'quick-sip': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>`,
  'quick-emi': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>`,
  'quick-fd': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><path d="M7 14h2v3H7z"/><path d="M11 14h2v3h-2z"/><path d="M15 14h2v3h-2z"/></svg>`,
  'quick-tax': `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="9" y1="13" x2="15" y2="13"/><line x1="9" y1="17" x2="15" y2="17"/></svg>`,
};

function getIcon(id, size = 28) {
  const svg = ICONS[id] || ICONS['fd'];
  return svg.replace('<svg ', `<svg width="${size}" height="${size}" `);
}

/* ============================================================
   CALCULATOR REGISTRY
   ============================================================ */
const CALCULATORS = [
  { id:'sip', name:'SIP Calculator', cat:'investment', desc:'Monthly SIP with CAGR, contribution schedule & tax returns' },
  { id:'step-sip', name:'Step-up SIP', cat:'investment', desc:'SIP with annual step-up percentage' },
  { id:'lumpsum', name:'Lumpsum Investment', cat:'investment', desc:'One-time investment growth with CAGR' },
  { id:'swp', name:'SWP Calculator', cat:'investment', desc:'Systematic Withdrawal Plan longevity & corpus depletion' },
  { id:'sip-vs-lumpsum', name:'SIP vs Lumpsum', cat:'investment', desc:'Side-by-side comparison of SIP and Lumpsum strategies' },
  { id:'sip-goal', name:'SIP Goal Planner', cat:'investment', desc:'Required monthly SIP to reach target corpus' },
  { id:'sip-ladder', name:'SIP Ladder Planner', cat:'investment', desc:'Multi-SIP instrument planner with total projection' },
  { id:'home-loan', name:'Home Loan EMI', cat:'loan', desc:'EMI, amortization schedule & prepayment impact' },
  { id:'car-loan', name:'Car Loan EMI', cat:'loan', desc:'Car loan EMI with full amortization table' },
  { id:'edu-loan', name:'Education Loan EMI', cat:'loan', desc:'Education loan with moratorium period support' },
  { id:'prepayment', name:'Prepayment Calculator', cat:'loan', desc:'Impact of extra payments on loan tenure & interest saved' },
  { id:'fd', name:'FD Calculator', cat:'savings', desc:'FD maturity with compounding frequency & TDS deduction' },
  { id:'rd', name:'RD Calculator', cat:'savings', desc:'Recurring deposit maturity value' },
  { id:'ppf', name:'PPF Calculator', cat:'savings', desc:'PPF 15-year maturity with annual contribution' },
  { id:'nps', name:'NPS Calculator', cat:'retirement', desc:'NPS Tier I corpus with tax savings and annuity projection' },
  { id:'retirement', name:'Retirement Corpus', cat:'retirement', desc:'Inflation-adjusted retirement corpus & required SIP' },
  { id:'child-edu', name:'Child Education Planner', cat:'investment', desc:'Future cost of education with required SIP' },
];

/* ============================================================
   INIT
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initSettings();
  initCookieBanner();
  initHeader();
  initScrollProgress();
  initCommandPalette();
  initHeroSearch();
  initHeroStats();
  initQuickWidgets();
  initBentoWidgets();
  renderCalcGrid();
  initCalcFilters();
  initCompare();
  initRevealAnimations();
  initHeroCanvas();
  initMagneticButtons();
  initCursorGlow();
  renderSavedWidget();
  renderRecentWidget();
  initBackToTop();
  initShortcutsPanel();
  initPlayground();
  initPersonalization();
  renderDashStrip();
  initPlayground2();
  initConfettiAndEgg();
  initFeaturePack4();
  const marquee = document.getElementById('rate-marquee-track');
  if (marquee) marquee.innerHTML += marquee.innerHTML;
});

/* ============================================================
   SAVED CALCULATIONS WIDGET (localStorage, device-only)
   ============================================================ */
function getSavedCalcs() {
  try { return JSON.parse(localStorage.getItem('fincalc-saved') || '[]'); }
  catch { return []; }
}

function relativeTime(iso) {
  const s = Math.max(0, (Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return 'just now';
  if (s < 3600) return Math.floor(s / 60) + 'm ago';
  if (s < 86400) return Math.floor(s / 3600) + 'h ago';
  return Math.floor(s / 86400) + 'd ago';
}

function renderSavedWidget() {
  const list = document.getElementById('saved-list');
  if (!list) return;
  const saved = getSavedCalcs();
  if (!saved.length) {
    list.innerHTML = '<div class="saved-empty">Nothing saved yet — open any calculator and hit <b>Save</b> to pin the result here.</div>';
    return;
  }
  list.innerHTML = saved.slice(0, 4).map((s, i) => `
    <div class="saved-item">
      <button class="saved-item-main" onclick="openSavedCalc(${i})" aria-label="Reopen ${s.name} with saved inputs">
        <span class="saved-item-name">${s.name}</span>
        <span class="saved-item-meta">${relativeTime(s.at)}</span>
      </button>
      <span class="saved-item-result">${s.result}</span>
      <button class="saved-item-del" onclick="deleteSavedCalc(${i})" aria-label="Delete saved ${s.name}">✕</button>
    </div>`).join('');
}

function openSavedCalc(index) {
  const s = getSavedCalcs()[index];
  if (!s || !CALCULATORS.find(c => c.id === s.id)) return;
  openCalc(s.id);
  /* restore the saved inputs, then recalculate */
  Object.entries(s.inputs || {}).forEach(([elId, val]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.value = val;
    const slider = document.getElementById(elId + '-slider');
    if (slider) { slider.value = val; paintSlider(slider); }
  });
  calcLive(s.id);
}

function deleteSavedCalc(index) {
  const saved = getSavedCalcs();
  saved.splice(index, 1);
  localStorage.setItem('fincalc-saved', JSON.stringify(saved));
  renderSavedWidget();
  showToast('Saved calculation removed');
}

/* ============================================================
   RECENTLY USED WIDGET
   ============================================================ */
function trackRecent(id) {
  try {
    let recent = JSON.parse(localStorage.getItem('fincalc-recent') || '[]');
    recent = [id, ...recent.filter(r => r !== id)].slice(0, 8);
    localStorage.setItem('fincalc-recent', JSON.stringify(recent));
  } catch { /* storage unavailable — skip */ }
  renderRecentWidget();
}

function renderRecentWidget() {
  const wrap = document.getElementById('recent-chips');
  if (!wrap) return;
  let recent = [];
  try { recent = JSON.parse(localStorage.getItem('fincalc-recent') || '[]'); } catch {}
  const calcs = recent.map(id => CALCULATORS.find(c => c.id === id)).filter(Boolean);
  if (!calcs.length) {
    wrap.innerHTML = '<div class="saved-empty">Calculators you open will appear here for one-tap access.</div>';
    return;
  }
  wrap.innerHTML = calcs.map(c => `
    <button class="recent-chip" onclick="openCalc('${c.id}')" aria-label="Open ${c.name}">
      ${getIcon(c.id, 14)}
      ${c.name}
    </button>`).join('');
}

/* ============================================================
   BACK TO TOP + SHORTCUTS PANEL
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  let visible = false;
  window.addEventListener('scroll', () => {
    const show = window.scrollY > 700;
    if (show !== visible) { visible = show; btn.classList.toggle('hidden', !show); }
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: App.reducedMotion ? 'auto' : 'smooth' }));
}

function initShortcutsPanel() {
  const modal = document.getElementById('shortcuts-modal');
  if (!modal) return;
  document.addEventListener('keydown', (e) => {
    const typing = /^(input|textarea|select)$/i.test(document.activeElement?.tagName || '');
    if (e.key === '?' && !typing && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      modal.classList.toggle('hidden');
    } else if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
      modal.classList.add('hidden');
    }
  });
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
}

/* ============================================================
   CURSOR GLOW TRAIL
   A luminous blue→cyan ribbon that follows the pointer (mouse)
   or finger (touch), drawn on a background canvas. The render
   loop only runs while the trail is alive, so it costs nothing
   when idle. Disabled under reduced motion.
   ============================================================ */
function initCursorGlow() {
  const canvas = document.getElementById('cursor-glow');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  const LIFE = 620;       /* ms a point stays visible */
  const MAX_POINTS = 48;
  const trail = [];
  let raf = null;

  function addPoint(x, y) {
    if (App.reducedMotion) return;
    const last = trail[trail.length - 1];
    if (last && Math.hypot(x - last.x, y - last.y) < 3) { last.t = performance.now(); return; }
    trail.push({ x, y, t: performance.now() });
    if (trail.length > MAX_POINTS) trail.shift();
    if (!raf) raf = requestAnimationFrame(draw);
  }

  /* pointermove covers mouse and pen; touchmove covers finger drags */
  window.addEventListener('pointermove', (e) => addPoint(e.clientX, e.clientY), { passive: true });
  window.addEventListener('touchmove', (e) => {
    const t = e.touches[0];
    if (t) addPoint(t.clientX, t.clientY);
  }, { passive: true });

  function draw() {
    raf = null;
    const now = performance.now();
    while (trail.length && now - trail[0].t > LIFE) trail.shift();
    ctx.clearRect(0, 0, w, h);
    if (trail.length > 1) {
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      const n = trail.length;
      for (let i = 1; i < n; i++) {
        const p0 = trail[i - 1], p1 = trail[i];
        const fade = Math.max(0, 1 - (now - p1.t) / LIFE);
        if (fade <= 0) continue;
        const prog = i / n; /* 0 = tail, 1 = head → blue → cyan */
        const r = Math.round(59 + (34 - 59) * prog);
        const g = Math.round(130 + (211 - 130) * prog);
        const b = Math.round(246 + (238 - 246) * prog);
        /* soft halo pass */
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.085 * fade).toFixed(3)})`;
        ctx.lineWidth = 14 * fade + 2;
        ctx.stroke();
        /* bright core pass */
        ctx.beginPath();
        ctx.moveTo(p0.x, p0.y);
        ctx.lineTo(p1.x, p1.y);
        ctx.strokeStyle = `rgba(${r},${g},${b},${(0.5 * fade).toFixed(3)})`;
        ctx.lineWidth = 2.2 * fade + 0.4;
        ctx.stroke();
      }
      /* luminous head dot */
      const head = trail[n - 1];
      const headFade = Math.max(0, 1 - (now - head.t) / LIFE);
      if (headFade > 0) {
        const glow = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, 26);
        glow.addColorStop(0, `rgba(120,200,255,${0.5 * headFade})`);
        glow.addColorStop(0.35, `rgba(34,211,238,${0.18 * headFade})`);
        glow.addColorStop(1, 'rgba(34,211,238,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(head.x, head.y, 26, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalCompositeOperation = 'source-over';
    }
    if (trail.length) raf = requestAnimationFrame(draw);
  }
}

/* ---- Theme ---- */
function initTheme() {
  const saved = localStorage.getItem('fincalc-theme');
  if (saved === 'light') applyTheme('light', false);
  else if (!saved) {
    /* follow the system until the user explicitly picks a theme */
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    if (mq.matches) applyTheme('light', false);
    mq.addEventListener?.('change', (e) => {
      if (!localStorage.getItem('fincalc-theme')) applyTheme(e.matches ? 'light' : 'dark', false);
    });
  }
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'light' ? 'dark' : 'light';
    applyTheme(next, true);
  });
}

function applyTheme(theme, persist) {
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : '';
  if (theme !== 'light') delete document.documentElement.dataset.theme;
  document.getElementById('theme-icon-moon')?.classList.toggle('hidden', theme === 'light');
  document.getElementById('theme-icon-sun')?.classList.toggle('hidden', theme !== 'light');
  const dmToggle = document.getElementById('dark-mode-toggle');
  if (dmToggle) dmToggle.checked = theme !== 'light';
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#F5F6F9' : '#050505');
  if (persist) { localStorage.setItem('fincalc-theme', theme); award('theme-switcher'); }
  /* re-render canvases that bake in theme colors */
  refreshBentoSparks?.();
  if (App.currentCalc) calcLive(App.currentCalc);
}

/* ---- Settings ---- */
function initSettings() {
  App.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const rmToggle = document.getElementById('reduced-motion-toggle');
  const dmToggle = document.getElementById('dark-mode-toggle');
  if (rmToggle) {
    rmToggle.checked = App.reducedMotion;
    rmToggle.addEventListener('change', () => {
      App.reducedMotion = rmToggle.checked;
      document.body.classList.toggle('reduce-motion', App.reducedMotion);
    });
  }
  if (dmToggle) {
    dmToggle.checked = document.documentElement.dataset.theme !== 'light';
    dmToggle.addEventListener('change', () => applyTheme(dmToggle.checked ? 'dark' : 'light', true));
  }
}

function toggleSettings() {
  const panel = document.getElementById('settings-panel');
  panel.classList.toggle('hidden');
}

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
}

/* ---- Cookie Banner ---- */
function initCookieBanner() {
  const banner = document.getElementById('cookie-banner');
  const accept = document.getElementById('cookie-accept');
  if (localStorage.getItem('cookieConsent')) { banner.style.display = 'none'; return; }
  accept?.addEventListener('click', () => {
    localStorage.setItem('cookieConsent', 'dismissed');
    banner.style.display = 'none';
  });
}

/* ---- Category metadata (labels + icons for menus/cards) ---- */
const CATEGORY_META = {
  investment:   { label: 'Investment',       icon: 'sip' },
  loan:         { label: 'Loans',            icon: 'home-loan' },
  tax:          { label: 'Tax',              icon: 'income-tax' },
  savings:      { label: 'Savings',          icon: 'rd' },
  retirement:   { label: 'Retirement',       icon: 'nps' },
  business:     { label: 'Business',         icon: 'tax' },
  'real-estate':{ label: 'Real Estate',      icon: 'home-loan' },
  insurance:    { label: 'Insurance',        icon: 'ppf' },
  crypto:       { label: 'Crypto',           icon: 'lumpsum' },
  personal:     { label: 'Personal Finance', icon: 'retirement' },
  stocks:       { label: 'Stocks & Forex',   icon: 'capital-gains' },
  startup:      { label: 'Startup',          icon: 'lumpsum' },
  education:    { label: 'Education',        icon: 'child-edu' },
};

/* ---- Header: floating nav, mega menu, mobile menu ---- */
function initHeader() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 30);
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) {
      nav.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* mega menu — built from registered categories */
  buildMegaMenu();
  const megaWrap = document.getElementById('nav-mega');
  const megaToggle = document.getElementById('mega-toggle');
  megaToggle?.addEventListener('click', () => {
    const open = megaWrap.classList.toggle('open');
    megaToggle.setAttribute('aria-expanded', String(open));
  });

  /* highlight active nav + bottom-nav on scroll */
  const sections = document.querySelectorAll('section[id]');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        document.querySelectorAll('a.nav-link').forEach(l => l.classList.remove('active'));
        document.querySelector(`a.nav-link[href="#${e.target.id}"]`)?.classList.add('active');
        document.querySelectorAll('.bottom-nav [data-bn]').forEach(l => l.classList.remove('bn-active'));
        document.querySelector(`.bottom-nav [data-bn="${e.target.id}"]`)?.classList.add('bn-active');
      }
    });
  }, { threshold: 0.35 });
  sections.forEach(s => observer.observe(s));

  document.getElementById('bn-search')?.addEventListener('click', () => openPalette());
}

function buildMegaMenu() {
  const menu = document.getElementById('mega-menu');
  if (!menu) return;
  const counts = {};
  CALCULATORS.forEach(c => { counts[c.cat] = (counts[c.cat] || 0) + 1; });
  menu.innerHTML = Object.entries(CATEGORY_META)
    .filter(([cat]) => counts[cat])
    .map(([cat, meta]) => `
      <a class="mega-item" role="menuitem" href="#calculators" onclick="filterCategory('${cat}')">
        <span class="mega-item-icon">${getIcon(meta.icon, 17)}</span>
        <span>
          <span class="mega-item-name">${meta.label}</span>
          <span class="mega-item-count">${counts[cat]} tool${counts[cat] > 1 ? 's' : ''}</span>
        </span>
      </a>`).join('');
}

function filterCategory(cat) {
  const btn = document.querySelector(`.filter-btn[data-filter="${cat}"]`);
  if (btn) btn.click();
  document.getElementById('main-nav')?.classList.remove('open');
}

/* ---- Scroll progress hairline ---- */
function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    });
  }, { passive: true });
}

/* ---- Magnetic buttons (desktop, subtle) ---- */
function initMagneticButtons() {
  if (App.reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  document.addEventListener('mousemove', (e) => {
    const btn = e.target.closest?.('.btn-primary, .btn-lg');
    document.querySelectorAll('.btn-magnetized').forEach(b => {
      if (b !== btn) { b.style.translate = ''; b.classList.remove('btn-magnetized'); }
    });
    if (!btn) return;
    const r = btn.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width / 2)) / r.width;
    const dy = (e.clientY - (r.top + r.height / 2)) / r.height;
    btn.style.translate = `${dx * 6}px ${dy * 5}px`;
    btn.classList.add('btn-magnetized');
  }, { passive: true });
}

/* ---- Slider progress fill (webkit tracks have no native fill) ---- */
function paintSlider(el) {
  const min = parseFloat(el.min) || 0, max = parseFloat(el.max) || 100;
  const v = parseFloat(el.value);
  const pct = max > min ? Math.min(100, Math.max(0, ((v - min) / (max - min)) * 100)) : 0;
  el.style.setProperty('--fill', pct + '%');
}

document.addEventListener('input', (e) => {
  if (e.target.classList?.contains('range-input')) paintSlider(e.target);
});

function paintAllSliders(root = document) {
  root.querySelectorAll('.range-input').forEach(paintSlider);
}

/* ---- Toast ---- */
let toastTimer;
function showToast(msg) {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;
  msgEl.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
}

/* ============================================================
   COMMAND PALETTE + SEARCH
   ============================================================ */
function searchCalculators(query, limit = 8) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const scored = CALCULATORS.map(c => {
    const name = c.name.toLowerCase(), cat = c.cat.toLowerCase();
    const desc = (c.desc + ' ' + (SEARCH_ALIASES[c.id] || '')).toLowerCase();
    let score = -1;
    if (name.startsWith(q)) score = 100;
    else if (name.includes(q)) score = 60;
    else if (cat.includes(q)) score = 30;
    else if (desc.includes(q)) score = 20;
    return { c, score };
  }).filter(x => x.score >= 0);
  scored.sort((a, b) => b.score - a.score);
  return scored.slice(0, limit).map(x => x.c);
}

function searchResultHTML(c, extraClass = '') {
  const meta = CATEGORY_META[c.cat];
  return `
    <button class="palette-item ${extraClass}" data-calc="${c.id}" role="option">
      <span class="palette-item-icon">${getIcon(c.id, 17)}</span>
      <span class="palette-item-body">
        <span class="palette-item-name">${c.name}</span>
        <span class="palette-item-desc">${c.desc}</span>
      </span>
      <span class="palette-item-cat calc-tag tag-${c.cat}">${meta ? meta.label : c.cat}</span>
    </button>`;
}

function initCommandPalette() {
  const overlay = document.getElementById('palette-overlay');
  const input = document.getElementById('palette-input');
  const results = document.getElementById('palette-results');
  if (!overlay || !input || !results) return;
  let selected = 0;

  const render = () => {
    const list = input.value.trim() ? searchCalculators(input.value, 10) : defaultPaletteList();
    if (!list.length) {
      results.innerHTML = '<div class="palette-empty">No calculators found. Try “SIP”, “EMI” or “tax”.</div>';
      return;
    }
    selected = Math.min(selected, list.length - 1);
    results.innerHTML = list.map((c, i) => searchResultHTML(c, i === selected ? 'selected' : '')).join('');
    results.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('click', () => { closePalette(); openCalc(item.dataset.calc); });
    });
  };

  input.addEventListener('input', () => { selected = 0; render(); });
  input.addEventListener('keydown', (e) => {
    const items = results.querySelectorAll('.palette-item');
    if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, items.length - 1); render(); results.querySelector('.selected')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); results.querySelector('.selected')?.scrollIntoView({ block: 'nearest' }); }
    else if (e.key === 'Enter') { e.preventDefault(); items[selected]?.click(); }
  });

  overlay.addEventListener('click', (e) => { if (e.target === overlay) closePalette(); });
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); overlay.classList.contains('hidden') ? openPalette() : closePalette(); }
    else if (e.key === 'Escape' && !overlay.classList.contains('hidden')) closePalette();
  });
  document.getElementById('nav-search')?.addEventListener('click', () => openPalette());

  window._renderPalette = render;
}

function openPalette() {
  const overlay = document.getElementById('palette-overlay');
  const input = document.getElementById('palette-input');
  if (!overlay) return;
  overlay.classList.remove('hidden');
  input.value = '';
  window._renderPalette?.();
  input.focus();
}

function closePalette() {
  document.getElementById('palette-overlay')?.classList.add('hidden');
}

/* ---- Hero search (inline suggestions) ---- */
function initHeroSearch() {
  const input = document.getElementById('hero-search-input');
  const dropdown = document.getElementById('hero-search-results');
  if (!input || !dropdown) return;

  const render = () => {
    const list = searchCalculators(input.value, 6);
    if (!input.value.trim() || !list.length) {
      dropdown.classList.add('hidden');
      dropdown.innerHTML = '';
      return;
    }
    dropdown.innerHTML = list.map(c => searchResultHTML(c)).join('');
    dropdown.classList.remove('hidden');
    dropdown.querySelectorAll('.palette-item').forEach(item => {
      item.addEventListener('click', () => { dropdown.classList.add('hidden'); input.value = ''; openCalc(item.dataset.calc); });
    });
  };

  input.addEventListener('input', render);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') dropdown.querySelector('.palette-item')?.click();
    if (e.key === 'Escape') dropdown.classList.add('hidden');
  });
  document.addEventListener('click', (e) => {
    if (!document.getElementById('hero-search')?.contains(e.target)) dropdown.classList.add('hidden');
  });
}

/* ============================================================
   HERO STATS (count-up) + LIVE WIDGETS
   ============================================================ */
function initHeroStats() {
  const els = document.querySelectorAll('.stat-val[data-count]');
  if (!els.length) return;
  const animate = (el) => {
    const target = parseFloat(el.dataset.count) || 0;
    const suffix = el.dataset.suffix || '';
    if (App.reducedMotion || target === 0) { el.textContent = target + suffix; return; }
    const dur = 1400, t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(target * eased) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { animate(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.5 });
  els.forEach(el => io.observe(el));
}

function initQuickWidgets() {
  const fmt = FC.formatINR;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  set('ql-sip', fmt(FC.sipFV(5000, 0.12, 15)));
  set('ql-emi', fmt(FC.emi(3000000, 0.085, 240)) + '/mo');
  set('ql-fd', fmt(FC.fdFV(100000, 0.07, 5, 4, 0).grossFV));
  set('ql-nps', fmt(FC.npsFV(5000, 0, 0.10, 25, 0.30).corpus));
}

/* ---- Bento dashboard widgets ---- */
function initBentoWidgets() {
  if (!document.getElementById('bento-grid')) return;
  const fmt = FC.formatINR;
  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  /* Investment overview: SIP 10k/mo @12% for 20y */
  const sipFV = FC.sipFV(10000, 0.12, 20);
  set('bw-sip-value', fmt(sipFV));
  set('bw-sip-invested', fmt(10000 * 12 * 20));

  /* EMI snapshot: 50L @8.5% 20y */
  const emi = FC.emi(5000000, 0.085, 240);
  const totalPay = emi * 240;
  set('bw-emi-value', fmt(emi) + '/mo');
  set('bw-emi-interest', fmt(totalPay - 5000000));
  drawMeter('bw-emi-meter', [
    { frac: 5000000 / totalPay, color: cssVar('--ch-1') },
    { frac: (totalPay - 5000000) / totalPay, color: cssVar('--ch-3') },
  ]);

  /* Retirement: 30y old, retire 60, 50k/mo expense */
  const ret = FC.retirementCorpus(30, 60, 50000, 0.06, 0.07);
  set('bw-ret-value', fmt(ret.corpus));

  /* Inflation: purchasing power of 1L in 10y at 6% */
  set('bw-inf-value', fmt(100000 / Math.pow(1.06, 10)));

  /* Tax estimator: ₹15L income, New Regime FY 2026-27 slabs (incl. 4% cess) */
  const taxable = 1500000 - 75000; /* standard deduction */
  const tax = newRegimeTaxEstimate(taxable);
  set('bw-tax-value', fmt(tax));
  set('bw-tax-rate', ((tax / 1500000) * 100).toFixed(1) + '%');
  const oldTax = oldRegimeTaxEstimate(1500000 - 50000 - 150000); /* std deduction + 80C maxed */
  const deltaEl = document.getElementById('bw-tax-delta');
  if (deltaEl) {
    deltaEl.textContent = oldTax > tax
      ? `New regime saves ${fmt(oldTax - tax)}/yr vs old (80C maxed)`
      : `Old regime with 80C would save ${fmt(tax - oldTax)}/yr`;
  }
  drawMeter('bw-tax-meter', [
    { frac: (1500000 - tax) / 1500000, color: cssVar('--ch-2') },
    { frac: tax / 1500000, color: cssVar('--ch-3') },
  ]);

  /* Step-up SIP vs flat */
  const ssip = FC.stepUpSIP(5000, 0.12, 20, 10);
  set('bw-ssip-value', fmt(ssip));
  set('bw-ssip-flat', fmt(FC.sipFV(5000, 0.12, 20)));

  refreshBentoSparks();
}

/* simplified New Regime slab math for the dashboard teaser widget */
function newRegimeTaxEstimate(taxable) {
  const slabs = [[400000, 0], [400000, 0.05], [400000, 0.10], [400000, 0.15], [400000, 0.20], [400000, 0.25], [Infinity, 0.30]];
  let remaining = taxable, tax = 0;
  for (const [width, rate] of slabs) {
    if (remaining <= 0) break;
    const inSlab = Math.min(remaining, width);
    tax += inSlab * rate;
    remaining -= inSlab;
  }
  return tax * 1.04; /* + 4% cess */
}

function refreshBentoSparks() {
  drawSparkline('bw-sip-spark', [
    { fn: (yr) => FC.sipFV(10000, 0.12, yr), color: cssVar('--ch-1'), fill: true },
    { fn: (yr) => 10000 * 12 * yr, color: cssVar('--ch-muted'), dash: [4, 4] },
  ], 20);
  drawSparkline('bw-ssip-spark', [
    { fn: (yr) => FC.stepUpSIP(5000, 0.12, yr, 10), color: cssVar('--ch-2'), fill: true },
    { fn: (yr) => FC.sipFV(5000, 0.12, yr), color: cssVar('--ch-muted'), dash: [4, 4] },
  ], 20);
  const repo = [4.0, 4.0, 4.9, 6.5, 6.5, 5.5];
  drawSparkline('repo-spark', [
    { fn: (i) => repo[Math.round(i)], color: cssVar('--ch-5'), fill: true },
  ], repo.length - 1);
}

function cssVar(name) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim() || '#3B82F6';
}

function drawMeter(id, parts) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = parts.map(p => `<i style="width:${(p.frac * 100).toFixed(1)}%;background:${p.color}"></i>`).join('');
}

function drawSparkline(canvasId, series, years) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth || 300, h = canvas.offsetHeight || 56;
  canvas.width = w * dpr; canvas.height = h * dpr;
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);

  const all = series.flatMap(s => Array.from({ length: years + 1 }, (_, yr) => s.fn(yr)));
  const maxVal = Math.max(...all) || 1;
  const toX = (yr) => (yr / years) * (w - 4) + 2;
  const toY = (v) => h - 3 - (v / maxVal) * (h - 8);

  series.forEach(s => {
    const pts = Array.from({ length: years + 1 }, (_, yr) => ({ x: toX(yr), y: toY(s.fn(yr)) }));
    if (s.fill) {
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, s.color + '3D');
      grad.addColorStop(1, s.color + '00');
      ctx.beginPath();
      ctx.moveTo(pts[0].x, h - 2);
      pts.forEach(p => ctx.lineTo(p.x, p.y));
      ctx.lineTo(pts[pts.length - 1].x, h - 2);
      ctx.closePath();
      ctx.fillStyle = grad;
      ctx.fill();
    }
    ctx.beginPath();
    pts.forEach((p, i) => i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    if (s.dash) ctx.setLineDash(s.dash);
    ctx.stroke();
    ctx.setLineDash([]);
  });
}

/* ============================================================
   CALCULATOR GRID
   ============================================================ */
function calcTimeEstimate(id) {
  /* rough completion time from input count (extra calcs expose their defs) */
  let inputs = 3;
  if (typeof EXTRA_CALC_DEFS !== 'undefined') {
    const def = EXTRA_CALC_DEFS.find(d => d.id === id);
    if (def) inputs = def.inputs.length;
  }
  return `~${Math.max(15, Math.min(60, inputs * 10))}s`;
}

function renderCalcGrid(filter = 'all', search = '') {
  const grid = document.getElementById('calc-grid');
  if (!grid) return;
  const favs = getFavs();
  let filtered = CALCULATORS.filter(c =>
    (filter === 'all' || (filter === 'favorites' ? favs.includes(c.id) : c.cat === filter)) &&
    (c.name.toLowerCase().includes(search) || c.desc.toLowerCase().includes(search))
  );
  if (filter === 'all' && favs.length) {
    /* pinned calculators float to the top */
    filtered = [...filtered].sort((a, b) => favs.includes(b.id) - favs.includes(a.id));
  }

  const countEl = document.getElementById('calc-count');
  if (countEl) {
    const catLabel = filter === 'all' ? 'across all categories'
      : filter === 'favorites' ? 'pinned by you'
      : `in ${CATEGORY_META[filter]?.label || filter}`;
    countEl.textContent = `${filtered.length} calculator${filtered.length === 1 ? '' : 's'} ${catLabel}`;
  }

  if (!filtered.length) {
    grid.innerHTML = filter === 'favorites' && !search
      ? `<div class="calc-empty">No favorites yet — tap the ☆ on any calculator card to pin it here.</div>`
      : `<div class="calc-empty">No calculators match “${search}”. Try a different term or category.</div>`;
    return;
  }

  grid.innerHTML = filtered.map((c, idx) => `
    <div class="calc-card reveal" role="listitem" tabindex="0" data-cat="${c.cat}"
         style="transition-delay:${(idx % 8) * 45}ms"
         onclick="openCalc('${c.id}')" onkeydown="if(event.key==='Enter')openCalc('${c.id}')"
         aria-label="${c.name}">
      <div class="calc-card-top">
        <div class="calc-icon">${getIcon(c.id, 22)}</div>
        <span style="flex:1"></span>
        <span class="calc-tag tag-${c.cat}">${CATEGORY_META[c.cat]?.label || c.cat}</span>
        <button class="calc-fav ${favs.includes(c.id) ? 'faved' : ''}" onclick="toggleFav(event,'${c.id}')"
          aria-label="${favs.includes(c.id) ? 'Unpin' : 'Pin'} ${c.name}" title="Pin to favorites">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="${favs.includes(c.id) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </button>
      </div>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
      <div class="calc-card-meta">
        <span class="calc-time">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          ${calcTimeEstimate(c.id)}
        </span>
        <span class="calc-go">Calculate <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
      </div>
    </div>
  `).join('');
  observeReveal();
  /* clear stagger delays once entrance finishes so hover stays snappy */
  setTimeout(() => grid.querySelectorAll('.calc-card').forEach(el => { el.style.transitionDelay = ''; }), 1400);
}

function initCalcFilters() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      const s = document.getElementById('calc-search')?.value.toLowerCase() || '';
      renderCalcGrid(f, s);
    });
  });
  document.getElementById('calc-search')?.addEventListener('input', (e) => {
    const f = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
    renderCalcGrid(f, e.target.value.toLowerCase());
  });
}

/* ============================================================
   CALCULATOR MODAL
   ============================================================ */
function openCalc(id) {
  App.currentCalc = id;
  const modal = document.getElementById('calc-modal');
  const body = document.getElementById('modal-body');
  const title = document.getElementById('modal-title');
  const calc = CALCULATORS.find(c => c.id === id);
  if (!calc) return;
  title.textContent = calc.name;
  body.innerHTML = buildCalcUI(id);
  modal.classList.remove('hidden');
  document.body.style.overflow = 'hidden';
  document.body.classList.add('modal-open');
  const firstInput = body.querySelector('input, select');
  firstInput?.focus();
  paintAllSliders(body);
  calcLive(id);
  watchResultPulse(body);
  document.querySelectorAll('#modal-body .result-main').forEach(m => updateResultDelta(m));

  /* restore inputs: shared link state wins, then autosaved values */
  if (!applyUrlState(id)) applyAutosavedInputs(id);
  undoStack = [inputsSnapshot()];
  injectAmortCopy();

  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal-export-csv').onclick = () => exportCSV(id);
  document.getElementById('modal-share').onclick = (e) => { e.stopPropagation(); toggleSharePop(id); };
  document.getElementById('modal-copy').onclick = () => copyResult(id);
  document.getElementById('modal-save').onclick = () => saveCalculation(id);
  document.getElementById('modal-image').onclick = () => shareResultImage(id);
  document.getElementById('modal-pdf').onclick = () => window.print();
  document.getElementById('modal-reset').onclick = () => {
    clearAutosavedInputs(id);
    body.innerHTML = buildCalcUI(id);
    paintAllSliders(body);
    calcLive(id);
    watchResultPulse(body);
    document.querySelectorAll('#modal-body .result-main').forEach(m => updateResultDelta(m));
    injectAmortCopy();
    showToast('Inputs reset to defaults');
  };
  document.getElementById('modal-link').onclick = () => {
    navigator.clipboard.writeText(stateLink(id))
      .then(() => showToast('Link copied — includes your inputs'));
  };
  document.getElementById('modal-fullscreen').onclick = () => {
    modal.querySelector('.modal').classList.toggle('modal-full');
  };
  const order = CALCULATORS.map(c => c.id);
  const at = order.indexOf(id);
  document.getElementById('modal-prev').onclick = () => openCalc(order[(at - 1 + order.length) % order.length]);
  document.getElementById('modal-next').onclick = () => openCalc(order[(at + 1) % order.length]);
  updateResultWords();
  trackRecent(id);
  try {
    const opened = (parseInt(localStorage.getItem('fincalc-opens') || '0', 10) || 0) + 1;
    localStorage.setItem('fincalc-opens', String(opened));
    if (opened >= 5) award('explorer');
    const counts = JSON.parse(localStorage.getItem('fincalc-opencounts') || '{}');
    counts[id] = (counts[id] || 0) + 1;
    localStorage.setItem('fincalc-opencounts', JSON.stringify(counts));
  } catch {}
  renderStatsTile?.();
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', modalEscHandler);
}

function closeModal() {
  const modal = document.getElementById('calc-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  document.body.classList.remove('modal-open');
  App.currentCalc = null;
  resultPulseObserver?.disconnect();
  document.removeEventListener('keydown', modalEscHandler);
}

/* pulse the headline number whenever a live recalculation changes it */
let resultPulseObserver;
function watchResultPulse(body) {
  resultPulseObserver?.disconnect();
  resultPulseObserver = new MutationObserver((muts) => {
    const seen = new Set();
    muts.forEach(m => {
      const main = (m.target.nodeType === 3 ? m.target.parentElement : m.target)?.closest?.('.result-main');
      if (main && !seen.has(main)) {
        seen.add(main);
        main.classList.remove('pulse');
        void main.offsetWidth; /* restart animation */
        main.classList.add('pulse');
        updateResultWords();
        updateResultDelta(main);
      }
    });
  });
  resultPulseObserver.observe(body, { subtree: true, childList: true, characterData: true });
}

/* ---- Copy / Save result ---- */
function collectResultText(id) {
  const calc = CALCULATORS.find(c => c.id === id);
  const body = document.getElementById('modal-body');
  if (!calc || !body) return null;
  const lines = [`${calc.name} — FinCalc Pro`];
  body.querySelectorAll('.result-card').forEach(card => {
    const label = card.querySelector('.result-label')?.textContent.trim();
    const main = card.querySelector('.result-main')?.textContent.trim();
    if (label && main) lines.push(`${label}: ${main}`);
    card.querySelectorAll('.result-item').forEach(item => {
      const v = item.querySelector('.result-item-val')?.textContent.trim();
      const l = item.querySelector('.result-item-label')?.textContent.trim();
      if (v && l) lines.push(`${l}: ${v}`);
    });
  });
  const explain = body.querySelector('.calc-explanation')?.textContent.trim();
  if (explain) lines.push('', explain);
  return lines.join('\n');
}

function copyResult(id) {
  const text = collectResultText(id);
  if (!text) return;
  navigator.clipboard.writeText(text)
    .then(() => showToast('Result copied to clipboard'))
    .catch(() => showToast('Could not copy — select the text manually'));
}

function saveCalculation(id) {
  const calc = CALCULATORS.find(c => c.id === id);
  const body = document.getElementById('modal-body');
  if (!calc || !body) return;
  const inputs = {};
  body.querySelectorAll('input[id], select[id]').forEach(el => {
    if (!el.id.endsWith('-slider')) inputs[el.id] = el.value;
  });
  const saved = JSON.parse(localStorage.getItem('fincalc-saved') || '[]');
  saved.unshift({
    id, name: calc.name,
    result: body.querySelector('.result-main')?.textContent.trim() || '',
    inputs,
    at: new Date().toISOString(),
  });
  localStorage.setItem('fincalc-saved', JSON.stringify(saved.slice(0, 50)));
  renderSavedWidget();
  award('first-save');
  showToast('Calculation saved on this device');
}

/* ---- Share result as a branded image ---- */
function shareResultImage(id) {
  const calc = CALCULATORS.find(c => c.id === id);
  const body = document.getElementById('modal-body');
  if (!calc || !body) return;
  const card = body.querySelector('.result-card');
  const label = card?.querySelector('.result-label')?.textContent.trim() || 'Result';
  const main = card?.querySelector('.result-main')?.textContent.trim() || '--';
  const items = [...(card?.querySelectorAll('.result-item') || [])].slice(0, 4).map(it => ({
    val: it.querySelector('.result-item-val')?.textContent.trim() || '',
    label: it.querySelector('.result-item-label')?.textContent.trim() || '',
  }));

  const W = 1200, H = 675, dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  /* backdrop */
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);
  let glow = ctx.createRadialGradient(W * 0.85, -60, 0, W * 0.85, -60, 700);
  glow.addColorStop(0, 'rgba(59,130,246,0.28)');
  glow.addColorStop(1, 'rgba(59,130,246,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  glow = ctx.createRadialGradient(60, H + 80, 0, 60, H + 80, 560);
  glow.addColorStop(0, 'rgba(34,211,238,0.16)');
  glow.addColorStop(1, 'rgba(34,211,238,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  /* faint grid */
  ctx.strokeStyle = 'rgba(255,255,255,0.035)';
  ctx.lineWidth = 1;
  for (let x = 0; x <= W; x += 72) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
  for (let y = 0; y <= H; y += 72) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

  /* brand */
  const M = 80;
  ctx.fillStyle = '#3B82F6';
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(M, 64, 40, 40, 11); else ctx.rect(M, 64, 40, 40);
  ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 3; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(M + 9, 92); ctx.lineTo(M + 16, 78); ctx.lineTo(M + 23, 86); ctx.lineTo(M + 31, 73);
  ctx.stroke();
  ctx.font = '700 26px "Space Grotesk", Inter, sans-serif';
  ctx.fillStyle = '#F4F6FB';
  ctx.fillText('FinCalc', M + 54, 92);
  ctx.fillStyle = '#60A5FA';
  ctx.fillText('Pro', M + 54 + ctx.measureText('FinCalc').width, 92);

  /* calculator name + headline result */
  ctx.font = '600 24px Inter, sans-serif';
  ctx.fillStyle = '#9BA3B5';
  ctx.fillText(calc.name, M, 190);
  ctx.font = '700 15px Inter, sans-serif';
  ctx.fillStyle = '#5D6474';
  ctx.fillText(label.toUpperCase(), M, 246);
  const grad = ctx.createLinearGradient(M, 0, M + 700, 0);
  grad.addColorStop(0, '#F4F6FB');
  grad.addColorStop(1, '#60A5FA');
  ctx.font = '700 92px "Space Grotesk", Inter, sans-serif';
  ctx.fillStyle = grad;
  ctx.fillText(main, M, 344);

  /* breakdown tiles */
  const tileW = (W - M * 2 - 3 * 20) / 4;
  items.forEach((it, i) => {
    const x = M + i * (tileW + 20), y = 408, th = 118;
    ctx.fillStyle = 'rgba(255,255,255,0.04)';
    ctx.strokeStyle = 'rgba(255,255,255,0.09)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, tileW, th, 14); else ctx.rect(x, y, tileW, th);
    ctx.fill(); ctx.stroke();
    ctx.font = '700 24px "Space Grotesk", Inter, sans-serif';
    ctx.fillStyle = '#F4F6FB';
    ctx.fillText(it.val, x + 20, y + 52, tileW - 40);
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = '#5D6474';
    ctx.fillText(it.label.toUpperCase(), x + 20, y + 84, tileW - 40);
  });

  /* footer */
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.beginPath(); ctx.moveTo(M, H - 84); ctx.lineTo(W - M, H - 84); ctx.stroke();
  ctx.font = '500 16px Inter, sans-serif';
  ctx.fillStyle = '#5D6474';
  ctx.fillText('fincalcpro.in — 130+ free calculators. No ads, no sign-up.', M, H - 46);
  ctx.textAlign = 'right';
  ctx.fillText('Not financial advice', W - M, H - 46);
  ctx.textAlign = 'left';

  canvas.toBlob((blob) => {
    if (!blob) { showToast('Could not generate image'); return; }
    const file = new File([blob], `fincalcpro-${id}.png`, { type: 'image/png' });
    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      navigator.share({ files: [file], title: 'FinCalc Pro' })
        .then(() => showToast('Result image shared'))
        .catch(() => downloadBlob(blob, file.name));
    } else {
      downloadBlob(blob, file.name);
    }
  }, 'image/png');
}

function downloadBlob(blob, name) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = name;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Result image downloaded');
}

function modalEscHandler(e) { if (e.key === 'Escape') closeModal(); }

/* ---- Build calculator UI ---- */
function buildCalcUI(id) {
  const builders = { sip: uiSIP, 'step-sip': uiStepSIP, lumpsum: uiLumpsum, swp: uiSWP, 'sip-vs-lumpsum': uiSIPvsLumpsum, 'sip-goal': uiSIPGoal, 'sip-ladder': uiSIPLadder, 'home-loan': uiHomeLoan, 'car-loan': uiCarLoan, 'edu-loan': uiEduLoan, prepayment: uiPrepayment, fd: uiFD, rd: uiRD, ppf: uiPPF, nps: uiNPS, retirement: uiRetirement, 'child-edu': uiChildEdu };
  return builders[id] ? builders[id]() : '<p>Calculator coming soon.</p>';
}

/* ============================================================
   INDIVIDUAL CALCULATOR UIs
   ============================================================ */

function uiSIP() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('sip-amount','Monthly SIP (₹)','500','100000','1000','5000')}
      ${sliderField('sip-rate','Expected Return (% p.a.)','1','30','0.5','12')}
      ${sliderField('sip-years','Tenure (Years)','1','40','1','15')}
      ${field('sip-tax-bracket','Tax Bracket (%)','select','',[['0','0%'],['5','5%'],['10','10%'],['20','20%'],['30','30%']],'0')}
    </div>
    <div class="calc-output">
      <div class="result-card" id="sip-result">
        <div class="result-label">Estimated Corpus</div>
        <div class="result-main" id="sip-corpus">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="sip-invested">--</div><div class="result-item-label">Total Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="sip-gains">--</div><div class="result-item-label">Gains</div></div>
          <div class="result-item"><div class="result-item-val" id="sip-xirr">--</div><div class="result-item-label">CAGR</div></div>
          <div class="result-item"><div class="result-item-val" id="sip-net">--</div><div class="result-item-label">Post-Tax Value</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="sip-chart" width="380" height="160" aria-label="SIP growth chart"></canvas></div>
      <div class="calc-explanation" id="sip-explain"></div>
    </div>
  </div>`;
}

function uiStepSIP() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('ssip-amount','Starting Monthly SIP (₹)','500','100000','500','5000')}
      ${sliderField('ssip-step','Annual Step-up (%)','1','50','1','10')}
      ${sliderField('ssip-rate','Expected Return (% p.a.)','1','30','0.5','12')}
      ${sliderField('ssip-years','Tenure (Years)','1','40','1','15')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Step-up SIP Corpus</div><div class="result-main" id="ssip-corpus">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="ssip-invested">--</div><div class="result-item-label">Total Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="ssip-gains">--</div><div class="result-item-label">Gains</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="ssip-chart" width="380" height="160" aria-label="Step-up SIP chart"></canvas></div>
      <div class="calc-explanation" id="ssip-explain"></div>
    </div>
  </div>`;
}

function uiLumpsum() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('ls-amount','Investment Amount (₹)','1000','5000000','1000','100000')}
      ${sliderField('ls-rate','Expected Return (% p.a.)','1','30','0.5','12')}
      ${sliderField('ls-years','Tenure (Years)','1','40','1','10')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Future Value</div><div class="result-main" id="ls-fv">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="ls-gains">--</div><div class="result-item-label">Gains</div></div>
          <div class="result-item"><div class="result-item-val" id="ls-xirr">--</div><div class="result-item-label">CAGR</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="ls-chart" width="380" height="160" aria-label="Lumpsum growth chart"></canvas></div>
      <div class="calc-explanation" id="ls-explain"></div>
    </div>
  </div>`;
}

function uiSWP() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('swp-corpus','Starting Corpus (₹)','10000','50000000','10000','1000000')}
      ${sliderField('swp-withdrawal','Monthly Withdrawal (₹)','1000','200000','1000','10000')}
      ${sliderField('swp-rate','Expected Return (% p.a.)','1','20','0.5','8')}
      ${sliderField('swp-horizon','Your Planning Horizon (Years)','1','40','1','20')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Corpus Lasts Exactly</div><div class="result-main" id="swp-duration">--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="swp-remaining-horizon">--</div><div class="result-item-label" id="swp-remaining-horizon-label">Remaining After Horizon</div></div>
          <div class="result-item"><div class="result-item-val" id="swp-total-withdrawn">--</div><div class="result-item-label">Total Withdrawn</div></div>
          <div class="result-item"><div class="result-item-val" id="swp-last-corpus">--</div><div class="result-item-label">Corpus At Depletion</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="swp-chart" width="380" height="160" aria-label="Corpus depletion chart"></canvas></div>
      <div class="calc-explanation" id="swp-explain"></div>
    </div>
  </div>`;
}

function uiSIPvsLumpsum() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('svl-sip','Monthly SIP (₹)','500','100000','500','5000')}
      ${sliderField('svl-lumpsum','Lumpsum Amount (₹)','1000','5000000','1000','60000')}
      ${sliderField('svl-rate','Expected Return (% p.a.)','1','30','0.5','12')}
      ${sliderField('svl-years','Tenure (Years)','1','40','1','10')}
    </div>
    <div class="calc-output">
      <div class="result-card">
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="svl-sip-fv">--</div><div class="result-item-label">SIP Corpus</div></div>
          <div class="result-item"><div class="result-item-val" id="svl-ls-fv">--</div><div class="result-item-label">Lumpsum Corpus</div></div>
          <div class="result-item"><div class="result-item-val" id="svl-sip-inv">--</div><div class="result-item-label">SIP Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="svl-winner">--</div><div class="result-item-label">Better Option</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="svl-chart" width="380" height="160" aria-label="SIP vs Lumpsum comparison chart"></canvas></div>
      <div class="calc-explanation" id="svl-explain"></div>
    </div>
  </div>`;
}

function uiSIPGoal() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('sg-target','Target Corpus (₹)','10000','50000000','10000','1000000')}
      ${sliderField('sg-rate','Expected Return (% p.a.)','1','30','0.5','12')}
      ${sliderField('sg-years','Tenure (Years)','1','40','1','10')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Required Monthly SIP</div><div class="result-main" id="sg-sip">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="sg-invested">--</div><div class="result-item-label">Total Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="sg-gains">--</div><div class="result-item-label">Wealth Gained</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="sg-explain"></div>
    </div>
  </div>`;
}

function uiSIPLadder() {
  return `<div style="display:flex;flex-direction:column;gap:1rem;">
    <p style="font-size:.85rem;color:var(--text2)">Add multiple SIPs and see total projected corpus.</p>
    <div id="ladder-rows">
      ${ladderRow(0)}${ladderRow(1)}${ladderRow(2)}
    </div>
    <button class="btn btn-ghost btn-sm" onclick="addLadderRow()">+ Add SIP</button>
    <div class="result-card"><div class="result-label">Total Projected Corpus</div><div class="result-main" id="ladder-total">₹--</div>
      <div class="result-grid">
        <div class="result-item"><div class="result-item-val" id="ladder-invested">--</div><div class="result-item-label">Total Invested</div></div>
        <div class="result-item"><div class="result-item-val" id="ladder-gains">--</div><div class="result-item-label">Gains</div></div>
      </div>
    </div>
  </div>`;
}

function ladderRow(i) {
  return `<div class="ladder-row" id="lrow-${i}">
    <div class="form-group"><label>Monthly SIP (₹)</label><input type="number" class="input" id="lr-amt-${i}" value="${[5000,3000,2000][i]||1000}" oninput="calcLive('sip-ladder')" /></div>
    <div class="form-group"><label>Return % p.a.</label><input type="number" class="input" id="lr-rate-${i}" value="12" oninput="calcLive('sip-ladder')" /></div>
    <div class="form-group"><label>Years</label><input type="number" class="input" id="lr-years-${i}" value="10" oninput="calcLive('sip-ladder')" /></div>
    <button class="btn btn-ghost btn-sm" onclick="removeLadderRow(${i})">✕</button>
  </div>`;
}

let ladderCount = 3;
function addLadderRow() {
  document.getElementById('ladder-rows').insertAdjacentHTML('beforeend', ladderRow(ladderCount++));
  calcLive('sip-ladder');
}
function removeLadderRow(i) {
  document.getElementById(`lrow-${i}`)?.remove();
  calcLive('sip-ladder');
}

function uiHomeLoan() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('hl-principal','Loan Amount (₹)','100000','100000000','100000','3000000')}
      ${sliderField('hl-rate','Interest Rate (% p.a.)','1','20','0.1','8.5')}
      ${sliderField('hl-years','Tenure (Years)','1','30','1','20')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Monthly EMI</div><div class="result-main" id="hl-emi">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="hl-total">--</div><div class="result-item-label">Total Payment</div></div>
          <div class="result-item"><div class="result-item-val" id="hl-interest">--</div><div class="result-item-label">Total Interest</div></div>
        </div>
      </div>
      <div class="calc-chart-wrap"><canvas id="hl-chart" width="380" height="160" aria-label="Loan amortization chart"></canvas></div>
      <div class="amort-table-wrap"><table class="amort-table"><thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody id="hl-amort"></tbody></table></div>
    </div>
  </div>`;
}

function uiCarLoan() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('cl-principal','Loan Amount (₹)','50000','5000000','50000','700000')}
      ${sliderField('cl-rate','Interest Rate (% p.a.)','1','25','0.1','9.5')}
      ${sliderField('cl-years','Tenure (Years)','1','7','1','5')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Monthly EMI</div><div class="result-main" id="cl-emi">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="cl-total">--</div><div class="result-item-label">Total Payment</div></div>
          <div class="result-item"><div class="result-item-val" id="cl-interest">--</div><div class="result-item-label">Total Interest</div></div>
        </div>
      </div>
      <div class="amort-table-wrap"><table class="amort-table"><thead><tr><th>Month</th><th>EMI</th><th>Principal</th><th>Interest</th><th>Balance</th></tr></thead><tbody id="cl-amort"></tbody></table></div>
    </div>
  </div>`;
}

function uiEduLoan() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('el-principal','Loan Amount (₹)','50000','2000000','50000','500000')}
      ${sliderField('el-rate','Interest Rate (% p.a.)','1','18','0.1','10.5')}
      ${sliderField('el-years','Repayment Years','1','15','1','7')}
      ${sliderField('el-moratorium','Moratorium (Months)','0','36','1','12')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Monthly EMI (post-moratorium)</div><div class="result-main" id="el-emi">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="el-total">--</div><div class="result-item-label">Total Repayment</div></div>
          <div class="result-item"><div class="result-item-val" id="el-interest">--</div><div class="result-item-label">Total Interest</div></div>
          <div class="result-item"><div class="result-item-val" id="el-principal-due">--</div><div class="result-item-label">Principal After Moratorium</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="el-explain"></div>
    </div>
  </div>`;
}

function uiPrepayment() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('pp-principal','Original Loan (₹)','100000','100000000','100000','3000000')}
      ${sliderField('pp-rate','Interest Rate (% p.a.)','1','20','0.1','8.5')}
      ${sliderField('pp-years','Original Tenure (Years)','1','30','1','20')}
      ${sliderField('pp-prepay','Prepayment Amount (₹)','10000','5000000','10000','200000')}
      ${sliderField('pp-month','Prepayment After (Month)','1','360','1','24')}
    </div>
    <div class="calc-output">
      <div class="result-card">
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="pp-saved">--</div><div class="result-item-label">Interest Saved</div></div>
          <div class="result-item"><div class="result-item-val" id="pp-new-tenure">--</div><div class="result-item-label">New Tenure (months)</div></div>
          <div class="result-item"><div class="result-item-val" id="pp-orig-interest">--</div><div class="result-item-label">Original Interest</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="pp-explain"></div>
    </div>
  </div>`;
}

function uiFD() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('fd-principal','Principal (₹)','1000','10000000','1000','100000')}
      ${sliderField('fd-rate','Interest Rate (% p.a.)','1','15','0.1','7')}
      ${sliderField('fd-years','Tenure (Years)','0.25','10','0.25','2')}
      ${field('fd-compound','Compounding Frequency','select','',[['1','Annual'],['2','Semi-Annual'],['4','Quarterly'],['12','Monthly']],'4')}
      ${field('fd-tds','TDS Applicable?','select','',[['0','No TDS'],['0.1','10% TDS'],['0.2','20% TDS (No PAN)']],'0.1')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Maturity Value</div><div class="result-main" id="fd-maturity">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="fd-interest">--</div><div class="result-item-label">Interest Earned</div></div>
          <div class="result-item"><div class="result-item-val" id="fd-tds-val">--</div><div class="result-item-label">TDS Deducted</div></div>
          <div class="result-item"><div class="result-item-val" id="fd-net">--</div><div class="result-item-label">Net Payout</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="fd-explain"></div>
    </div>
  </div>`;
}

function uiRD() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('rd-monthly','Monthly Deposit (₹)','500','100000','500','5000')}
      ${sliderField('rd-rate','Interest Rate (% p.a.)','1','12','0.1','7')}
      ${sliderField('rd-months','Tenure (Months)','3','120','3','24')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Maturity Value</div><div class="result-main" id="rd-maturity">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="rd-invested">--</div><div class="result-item-label">Total Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="rd-interest">--</div><div class="result-item-label">Interest Earned</div></div>
        </div>
      </div>
    </div>
  </div>`;
}

function uiPPF() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('ppf-annual','Yearly Contribution (₹)','500','150000','500','50000')}
      ${sliderField('ppf-years','Years (min 15)','15','30','1','15')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Maturity Value (at 7.1% p.a.)</div><div class="result-main" id="ppf-maturity">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="ppf-invested">--</div><div class="result-item-label">Total Invested</div></div>
          <div class="result-item"><div class="result-item-val" id="ppf-interest">--</div><div class="result-item-label">Interest Earned</div></div>
          <div class="result-item"><div class="result-item-val">EEE</div><div class="result-item-label">Tax Status</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="ppf-explain"></div>
    </div>
  </div>`;
}

function uiNPS() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('nps-monthly','Monthly Contribution (₹)','500','100000','500','5000')}
      ${sliderField('nps-employer','Employer Contribution (₹)','0','100000','500','0')}
      ${sliderField('nps-rate','Expected Return (% p.a.)','6','14','0.5','10')}
      ${sliderField('nps-years','Years to Retirement','1','40','1','25')}
      ${field('nps-tax','Tax Bracket','select','',[['0','0%'],['0.05','5%'],['0.20','20%'],['0.30','30%']],'0.30')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Projected NPS Corpus</div><div class="result-main" id="nps-corpus">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="nps-lumpsum">--</div><div class="result-item-label">Tax-free Lumpsum (60%)</div></div>
          <div class="result-item"><div class="result-item-val" id="nps-annuity">--</div><div class="result-item-label">Annuity Corpus (40%)</div></div>
          <div class="result-item"><div class="result-item-val" id="nps-tax-saved">--</div><div class="result-item-label">Annual Tax Saved</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="nps-explain"></div>
    </div>
  </div>`;
}

function uiRetirement() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('ret-age','Current Age','20','60','1','30')}
      ${sliderField('ret-retire','Retirement Age','40','70','1','60')}
      ${sliderField('ret-expense','Monthly Expenses Today (₹)','5000','500000','1000','30000')}
      ${sliderField('ret-inflation','Inflation Rate (% p.a.)','3','10','0.5','6')}
      ${sliderField('ret-return','Post-Retirement Return (% p.a.)','4','12','0.5','7')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Required Retirement Corpus</div><div class="result-main" id="ret-corpus">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="ret-expense-future">--</div><div class="result-item-label">Monthly Expense at Retirement</div></div>
          <div class="result-item"><div class="result-item-val" id="ret-sip">--</div><div class="result-item-label">Required Monthly SIP (12% p.a.)</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="ret-explain"></div>
    </div>
  </div>`;
}

function uiChildEdu() {
  return `<div class="calc-layout">
    <div class="calc-inputs">
      ${sliderField('ce-cost','Current Education Cost (₹)','10000','10000000','10000','500000')}
      ${sliderField('ce-years','Years Until Course','1','20','1','10')}
      ${sliderField('ce-inflation','Education Inflation (% p.a.)','5','15','0.5','10')}
      ${sliderField('ce-return','Expected Return (% p.a.)','6','20','0.5','12')}
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Future Education Cost</div><div class="result-main" id="ce-future">₹--</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="ce-sip">--</div><div class="result-item-label">Required Monthly SIP</div></div>
          <div class="result-item"><div class="result-item-val" id="ce-lumpsum">--</div><div class="result-item-label">Lumpsum Needed Today</div></div>
        </div>
      </div>
      <div class="calc-explanation" id="ce-explain"></div>
    </div>
  </div>`;
}

/* ---- Field builders ---- */
function sliderField(id, label, min, max, step, defaultVal) {
  return `<div class="form-group">
    <label for="${id}">${label}</label>
    <div class="slider-row">
      <input type="range" class="range-input" id="${id}-slider" min="${min}" max="${max}" step="${step}" value="${defaultVal}" data-def="${defaultVal}"
        oninput="document.getElementById('${id}').value=this.value;calcLive(App.currentCalc)" aria-label="${label} slider" />
      <div class="num-stepper">
        <button type="button" class="step-btn" data-target="${id}" data-dir="-1" aria-label="Decrease ${label}" tabindex="-1">−</button>
        <input type="number" class="input input-num" id="${id}" value="${defaultVal}" min="${min}" max="${max}" step="${step}" data-def="${defaultVal}"
          oninput="var s=document.getElementById('${id}-slider');s.value=this.value;paintSlider(s);calcLive(App.currentCalc)" aria-label="${label}" />
        <button type="button" class="step-btn" data-target="${id}" data-dir="1" aria-label="Increase ${label}" tabindex="-1">+</button>
      </div>
    </div>
  </div>`;
}

function field(id, label, type, placeholder, options, defaultVal) {
  if (type === 'select') {
    return `<div class="form-group"><label for="${id}">${label}</label><select id="${id}" class="input" onchange="calcLive(App.currentCalc)" aria-label="${label}">
      ${options.map(([v,l]) => `<option value="${v}"${v==defaultVal?' selected':''}>${l}</option>`).join('')}
    </select></div>`;
  }
  return `<div class="form-group"><label for="${id}">${label}</label><input type="${type}" id="${id}" class="input" value="${defaultVal}" placeholder="${placeholder}" oninput="calcLive(App.currentCalc)" aria-label="${label}" /></div>`;
}

/* ============================================================
   LIVE CALCULATOR LOGIC
   ============================================================ */
function calcLive(id) {
  const get = (elId, fallback = 0) => {
    const el = document.getElementById(elId);
    if (!el) return fallback;
    const v = el.type === 'select-one' ? parseFloat(el.value) : parseFloat(el.value);
    return isNaN(v) ? fallback : v;
  };
  const set = (elId, val) => { const el = document.getElementById(elId); if (el) el.textContent = val; };
  const fmt = FC.formatINR;

  switch(id) {
    case 'sip': {
      const monthly = get('sip-amount', 5000), rate = get('sip-rate', 12) / 100, years = get('sip-years', 15), taxBracket = get('sip-tax-bracket', 0) / 100;
      const fv = FC.sipFV(monthly, rate, years);
      const invested = monthly * years * 12;
      const gains = fv - invested;
      const taxOnGains = gains * taxBracket;
      set('sip-corpus', fmt(fv));
      set('sip-invested', fmt(invested));
      set('sip-gains', fmt(gains));
      set('sip-xirr', (rate * 100).toFixed(1) + '% p.a.');
      set('sip-net', fmt(fv - taxOnGains));
      set('sip-explain', `Investing ${fmt(monthly)}/month at ${(rate*100).toFixed(1)}% p.a. for ${years} years yields ${fmt(fv)}. Your total investment is ${fmt(invested)} and wealth gained is ${fmt(gains)} (${((gains/invested)*100).toFixed(0)}% absolute return).`);
      drawGrowthChart('sip-chart', (yr) => FC.sipFV(monthly, rate, yr), years, invested, 'SIP Corpus');
      break;
    }
    case 'step-sip': {
      const monthly = get('ssip-amount',5000), step = get('ssip-step',10), rate = get('ssip-rate',12)/100, years = get('ssip-years',15);
      const fv = FC.stepUpSIP(monthly, rate, years, step);
      let invested = 0, m = monthly;
      for (let y = 0; y < years; y++) { invested += m * 12; m *= (1 + step/100); }
      set('ssip-corpus', fmt(fv));
      set('ssip-invested', fmt(invested));
      set('ssip-gains', fmt(fv - invested));
      set('ssip-explain', `With a ${step}% annual step-up, your SIP grows from ${fmt(monthly)}/month to ${fmt(m)}/month by year ${years}. Total invested: ${fmt(invested)}, corpus: ${fmt(fv)}.`);
      drawGrowthChart('ssip-chart', (yr) => FC.stepUpSIP(monthly, rate, yr, step), years, invested, 'Step-up SIP');
      break;
    }
    case 'lumpsum': {
      const amount = get('ls-amount',100000), rate = get('ls-rate',12)/100, years = get('ls-years',10);
      const fv = FC.lumpsumFV(amount, rate, years);
      set('ls-fv', fmt(fv));
      set('ls-gains', fmt(fv - amount));
      set('ls-xirr', (rate*100).toFixed(1) + '% p.a.');
      set('ls-explain', `${fmt(amount)} invested at ${(rate*100).toFixed(1)}% p.a. for ${years} years grows to ${fmt(fv)}. Absolute return: ${((fv/amount-1)*100).toFixed(0)}%.`);
      drawGrowthChart('ls-chart', (yr) => FC.lumpsumFV(amount, rate, yr), years, amount, 'Lumpsum');
      break;
    }
    case 'swp': {
      const corpus = get('swp-corpus',1000000), withdrawal = get('swp-withdrawal',10000), rate = get('swp-rate',8)/100, horizon = get('swp-horizon',20);
      const sched = FC.swpSchedule(corpus, withdrawal, rate, 1200); /* exact, capped at 100 years */
      const horizonMonths = Math.round(horizon * 12);

      if (sched.sustainable) {
        set('swp-duration', '100+ yrs (sustainable)');
      } else {
        const yrs = Math.floor(sched.months / 12), mos = sched.months % 12;
        set('swp-duration', mos === 0 ? `${yrs} yr${yrs===1?'':'s'}` : `${yrs} yr${yrs===1?'':'s'} ${mos} mo`);
      }

      const remainingAtHorizon = sched.sustainable || horizonMonths < sched.months
        ? FC.swpRemainingAfter(corpus, withdrawal, rate, horizonMonths)
        : 0;
      set('swp-remaining-horizon', fmt(remainingAtHorizon));
      set('swp-remaining-horizon-label', `Remaining After ${horizon} Yr${horizon==1?'':'s'}`);

      const withdrawnMonths = sched.sustainable ? horizonMonths : sched.months;
      set('swp-total-withdrawn', fmt(withdrawal * withdrawnMonths));
      set('swp-last-corpus', sched.sustainable ? fmt(sched.finalBalance) : '₹0');

      set('swp-explain', sched.sustainable
        ? `At ${(rate*100).toFixed(1)}% p.a., your ${fmt(corpus)} corpus earns more than the ${fmt(withdrawal)}/month you're withdrawing, so it lasts 100+ years and keeps growing. At the end of your ${horizon}-year horizon you'd still have roughly ${fmt(remainingAtHorizon)}.`
        : horizonMonths >= sched.months
          ? `Your corpus of ${fmt(corpus)} withdrawing ${fmt(withdrawal)}/month at ${(rate*100).toFixed(1)}% p.a. lasts exactly ${Math.floor(sched.months/12)} year${Math.floor(sched.months/12)===1?'':'s'}${sched.months%12 ? ` ${sched.months%12} month${sched.months%12===1?'':'s'}` : ''} — it runs out before your ${horizon}-year horizon, so nothing remains at year ${horizon}.`
          : `Your corpus of ${fmt(corpus)} withdrawing ${fmt(withdrawal)}/month at ${(rate*100).toFixed(1)}% p.a. lasts exactly ${Math.floor(sched.months/12)} year${Math.floor(sched.months/12)===1?'':'s'}${sched.months%12 ? ` ${sched.months%12} month${sched.months%12===1?'':'s'}` : ''}. At the end of your ${horizon}-year horizon (shorter than that), you'd still have ${fmt(remainingAtHorizon)} left.`);

      drawSWPChart('swp-chart', sched, corpus, horizonMonths);
      break;
    }
    case 'sip-vs-lumpsum': {
      const sip = get('svl-sip',5000), ls = get('svl-lumpsum',60000), rate = get('svl-rate',12)/100, years = get('svl-years',10);
      const sipFV = FC.sipFV(sip, rate, years);
      const lsFV = FC.lumpsumFV(ls, rate, years);
      const sipInvested = sip * years * 12;
      set('svl-sip-fv', fmt(sipFV));
      set('svl-ls-fv', fmt(lsFV));
      set('svl-sip-inv', fmt(sipInvested));
      set('svl-winner', sipFV > lsFV ? '✅ SIP' : '✅ Lumpsum');
      set('svl-explain', `SIP of ${fmt(sip)}/month → ${fmt(sipFV)} | Lumpsum of ${fmt(ls)} → ${fmt(lsFV)}. ${sipFV > lsFV ? 'SIP wins by ' + fmt(sipFV-lsFV) : 'Lumpsum wins by ' + fmt(lsFV-sipFV)}.`);
      drawCompareChart('svl-chart', (yr) => FC.sipFV(sip, rate, yr), (yr) => FC.lumpsumFV(ls, rate, yr), years, 'SIP', 'Lumpsum');
      break;
    }
    case 'sip-goal': {
      const target = get('sg-target',1000000), rate = get('sg-rate',12)/100, years = get('sg-years',10);
      const sipNeeded = FC.sipRequired(target, rate, years);
      const invested = sipNeeded * years * 12;
      set('sg-sip', fmt(sipNeeded));
      set('sg-invested', fmt(invested));
      set('sg-gains', fmt(target - invested));
      set('sg-explain', `To accumulate ${fmt(target)} in ${years} years at ${(rate*100).toFixed(1)}% p.a., invest ${fmt(sipNeeded)} monthly. Total invested: ${fmt(invested)}.`);
      break;
    }
    case 'sip-ladder': {
      let totalFV = 0, totalInvested = 0;
      for (let i = 0; i < ladderCount; i++) {
        const amt = get(`lr-amt-${i}`, 0), rate = get(`lr-rate-${i}`, 12)/100, years = get(`lr-years-${i}`, 10);
        if (amt > 0) { totalFV += FC.sipFV(amt, rate, years); totalInvested += amt * years * 12; }
      }
      set('ladder-total', fmt(totalFV));
      set('ladder-invested', fmt(totalInvested));
      set('ladder-gains', fmt(totalFV - totalInvested));
      break;
    }
    case 'home-loan': case 'car-loan': {
      const prefix = id === 'home-loan' ? 'hl' : 'cl';
      const principal = get(`${prefix}-principal`, 3000000), rate = get(`${prefix}-rate`, 8.5)/100, years = get(`${prefix}-years`, 20);
      const e = FC.emi(principal, rate, years * 12);
      const total = e * years * 12;
      set(`${prefix}-emi`, fmt(e));
      set(`${prefix}-total`, fmt(total));
      set(`${prefix}-interest`, fmt(total - principal));
      const schedule = FC.amortSchedule(principal, rate, years * 12);
      const tbody = document.getElementById(`${prefix}-amort`);
      if (tbody) tbody.innerHTML = schedule.slice(0,24).map(r => `<tr><td>${r.month}</td><td>${fmt(r.emi)}</td><td>${fmt(r.principalPaid)}</td><td>${fmt(r.interest)}</td><td>${fmt(r.balance)}</td></tr>`).join('') + (schedule.length > 24 ? `<tr><td colspan="5" style="color:var(--text3);font-size:.75rem;text-align:center">…showing first 24 months. Export CSV for full schedule.</td></tr>` : '');
      if (id === 'home-loan') drawAmortChart('hl-chart', schedule);
      break;
    }
    case 'edu-loan': {
      const principal = get('el-principal',500000), rate = get('el-rate',10.5)/100, years = get('el-years',7), moratorium = get('el-moratorium',12);
      const interestDuringMoratorium = principal * (rate/12) * moratorium;
      const newPrincipal = principal + interestDuringMoratorium;
      const e = FC.emi(newPrincipal, rate, years * 12);
      const total = e * years * 12;
      set('el-emi', fmt(e));
      set('el-total', fmt(total));
      set('el-interest', fmt(total - newPrincipal));
      set('el-principal-due', fmt(newPrincipal));
      set('el-explain', `During ${moratorium}-month moratorium, interest of ${fmt(interestDuringMoratorium)} accrues (if simple). Effective loan becomes ${fmt(newPrincipal)}. EMI starts after moratorium.`);
      break;
    }
    case 'prepayment': {
      const principal = get('pp-principal',3000000), rate = get('pp-rate',8.5)/100, years = get('pp-years',20), prepay = get('pp-prepay',200000), month = Math.min(get('pp-month',24), years*12 - 1);
      const orig = FC.amortSchedule(principal, rate, years * 12);
      const origInterest = orig.reduce((s,r) => s + r.interest, 0);
      const impact = FC.prepaymentImpact(principal, rate, years * 12, prepay, month);
      set('pp-saved', fmt(impact.savedInterest));
      set('pp-new-tenure', `${impact.newTenure} months (${(impact.newTenure/12).toFixed(1)} yrs)`);
      set('pp-orig-interest', fmt(origInterest));
      set('pp-explain', `Paying ${fmt(prepay)} extra at month ${month} saves ${fmt(impact.savedInterest)} in interest and reduces tenure from ${years*12} to ${impact.newTenure} months.`);
      break;
    }
    case 'fd': {
      const principal = get('fd-principal',100000), rate = get('fd-rate',7)/100, years = get('fd-years',2), compound = get('fd-compound',4), tds = get('fd-tds',0.1);
      const result = FC.fdFV(principal, rate, years, compound, tds);
      set('fd-maturity', fmt(result.grossFV));
      set('fd-interest', fmt(result.interest));
      set('fd-tds-val', fmt(result.tds));
      set('fd-net', fmt(result.netFV));
      set('fd-explain', `${fmt(principal)} at ${(rate*100).toFixed(2)}% p.a. compounded ${['','annually','semi-annually','','quarterly','','','','','','','','monthly'][compound]} for ${years} years = ${fmt(result.grossFV)}. After ${(tds*100).toFixed(0)}% TDS: ${fmt(result.netFV)}.`);
      break;
    }
    case 'rd': {
      const monthly = get('rd-monthly',5000), rate = get('rd-rate',7)/100, months = get('rd-months',24);
      const fv = FC.rdFV(monthly, rate, months);
      const invested = monthly * months;
      set('rd-maturity', fmt(fv));
      set('rd-invested', fmt(invested));
      set('rd-interest', fmt(fv - invested));
      break;
    }
    case 'ppf': {
      const annual = get('ppf-annual',50000), years = get('ppf-years',15);
      const fv = FC.ppfFV(annual, years);
      const invested = annual * years;
      set('ppf-maturity', fmt(fv));
      set('ppf-invested', fmt(invested));
      set('ppf-interest', fmt(fv - invested));
      set('ppf-explain', `PPF is a government-backed EEE instrument (Exempt-Exempt-Exempt): contribution, interest and maturity are all tax-free. Current rate: 7.1% p.a. Minimum tenure: 15 years (extendable in 5-year blocks).`);
      break;
    }
    case 'nps': {
      const monthly = get('nps-monthly',5000), employer = get('nps-employer',0), rate = get('nps-rate',10)/100, years = get('nps-years',25), taxBracket = get('nps-tax',0.30);
      const res = FC.npsFV(monthly, employer, rate, years, taxBracket);
      set('nps-corpus', fmt(res.corpus));
      set('nps-lumpsum', fmt(res.lumpsum));
      set('nps-annuity', fmt(res.annuityCorpus));
      set('nps-tax-saved', fmt(res.taxSaved));
      set('nps-explain', `NPS corpus of ${fmt(res.corpus)}: 60% (${fmt(res.lumpsum)}) is tax-free lumpsum; 40% (${fmt(res.annuityCorpus)}) must be used to buy annuity. Additional 80CCD(1B) deduction of ₹50k/yr saves ${fmt(res.taxSaved)} annually.`);
      break;
    }
    case 'retirement': {
      const age = get('ret-age',30), retireAge = get('ret-retire',60), expense = get('ret-expense',30000), inflation = get('ret-inflation',6)/100, returnRate = get('ret-return',7)/100;
      const res = FC.retirementCorpus(age, retireAge, expense, inflation, returnRate);
      set('ret-corpus', fmt(res.corpus));
      set('ret-expense-future', fmt(res.inflatedExpense));
      set('ret-sip', fmt(res.requiredMonthlySIP));
      set('ret-explain', `At 6% inflation, today's ${fmt(expense)}/month expense becomes ${fmt(res.inflatedExpense)}/month at age ${retireAge}. You need a corpus of ${fmt(res.corpus)} to sustain this for 25 years (assuming life expectancy 85). Required monthly SIP at 12% p.a.: ${fmt(res.requiredMonthlySIP)}.`);
      break;
    }
    case 'child-edu': {
      const cost = get('ce-cost',500000), years = get('ce-years',10), inflation = get('ce-inflation',10)/100, returnRate = get('ce-return',12)/100;
      const res = FC.childEducation(cost, years, inflation, returnRate);
      const lumpsum = FC.lumpsumFV(1,returnRate,years);
      set('ce-future', fmt(res.futureCost));
      set('ce-sip', fmt(res.requiredMonthlySIP));
      set('ce-lumpsum', fmt(res.futureCost / lumpsum));
      set('ce-explain', `At ${(inflation*100).toFixed(0)}% education inflation, ${fmt(cost)} today becomes ${fmt(res.futureCost)} in ${years} years. Required monthly SIP: ${fmt(res.requiredMonthlySIP)} at ${(returnRate*100).toFixed(0)}% p.a.`);
      break;
    }
  }
}

/* ============================================================
   CHART DRAWING (Canvas, no external libs)
   ============================================================ */
function chartCtx(canvas) {
  /* retina-sharp canvas sized to its CSS box */
  const dpr = window.devicePixelRatio || 1;
  const w = canvas.offsetWidth || 380, h = canvas.offsetHeight || 170;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, w, h);
  return { ctx, w, h };
}

function chartTextColor() { return cssVar('--text2') || '#9BA3B5'; }

function drawGrowthChart(canvasId, fvFn, years, invested, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = chartCtx(canvas);
  const c1 = cssVar('--ch-1');

  const points = [];
  for (let yr = 0; yr <= years; yr++) { points.push({ yr, fv: fvFn(yr), inv: invested / years * yr }); }
  const maxVal = Math.max(...points.map(p => p.fv));
  const toX = (yr) => (yr / years) * (w - 40) + 20;
  const toY = (val) => h - 20 - (val / maxVal) * (h - 34);

  /* gradient area under the growth line */
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, c1 + '42');
  grad.addColorStop(1, c1 + '00');
  ctx.beginPath();
  ctx.moveTo(toX(0), h - 20);
  points.forEach(p => ctx.lineTo(toX(p.yr), toY(p.fv)));
  ctx.lineTo(toX(years), h - 20);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  /* growth line */
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.yr), toY(p.fv)) : ctx.lineTo(toX(p.yr), toY(p.fv)));
  ctx.strokeStyle = c1;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  /* invested reference line */
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.yr), toY(p.inv)) : ctx.lineTo(toX(p.yr), toY(p.inv)));
  ctx.strokeStyle = cssVar('--ch-muted');
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* legend (text ink + colored swatch, never colored text) */
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = c1;
  ctx.fillRect(22, 10, 8, 8);
  ctx.fillStyle = chartTextColor();
  ctx.fillText(label, 34, 18);
  ctx.fillStyle = cssVar('--ch-muted');
  ctx.fillRect(22, 24, 8, 8);
  ctx.fillStyle = chartTextColor();
  ctx.fillText('Invested', 34, 32);
}

function drawCompareChart(canvasId, fn1, fn2, years, label1, label2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = chartCtx(canvas);

  const pts1 = Array.from({length: years+1}, (_,i) => fn1(i));
  const pts2 = Array.from({length: years+1}, (_,i) => fn2(i));
  const maxVal = Math.max(...pts1, ...pts2);
  const toX = (yr) => (yr / years) * (w - 40) + 20;
  const toY = (val) => h - 20 - (val / maxVal) * (h - 34);

  [[cssVar('--ch-1'), pts1, label1], [cssVar('--ch-2'), pts2, label2]].forEach(([color, pts, lbl], li) => {
    ctx.beginPath();
    pts.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();
    ctx.font = '10px Inter, sans-serif';
    ctx.fillStyle = color;
    ctx.fillRect(22, 10 + li * 14, 8, 8);
    ctx.fillStyle = chartTextColor();
    ctx.fillText(lbl, 34, 18 + li * 14);
  });
}

function drawSWPChart(canvasId, sched, corpus, horizonMonths) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = chartCtx(canvas);
  const c1 = cssVar('--ch-1'), cGold = cssVar('--ch-3');

  const points = sched.points;
  const totalMonths = points[points.length - 1].month || 1;
  const maxVal = Math.max(corpus, ...points.map(p => p.balance)) || 1;
  const toX = (m) => (m / totalMonths) * (w - 40) + 20;
  const toY = (v) => h - 20 - (v / maxVal) * (h - 34);

  /* gradient area under the depletion curve */
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, c1 + '42');
  grad.addColorStop(1, c1 + '00');
  ctx.beginPath();
  ctx.moveTo(toX(0), h - 20);
  points.forEach(p => ctx.lineTo(toX(p.month), toY(p.balance)));
  ctx.lineTo(toX(totalMonths), h - 20);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  /* balance line */
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.month), toY(p.balance)) : ctx.lineTo(toX(p.month), toY(p.balance)));
  ctx.strokeStyle = c1;
  ctx.lineWidth = 2;
  ctx.lineJoin = 'round';
  ctx.stroke();

  /* marker at the user's planning horizon, if within the plotted range */
  if (horizonMonths > 0 && horizonMonths <= totalMonths) {
    const hx = toX(horizonMonths);
    ctx.beginPath();
    ctx.moveTo(hx, 10);
    ctx.lineTo(hx, h - 20);
    ctx.strokeStyle = cGold;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([3, 3]);
    ctx.stroke();
    ctx.setLineDash([]);
  }

  /* legend */
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = c1;
  ctx.fillRect(22, 10, 8, 8);
  ctx.fillStyle = chartTextColor();
  ctx.fillText('Corpus balance', 34, 18);
  if (horizonMonths > 0 && horizonMonths <= totalMonths) {
    ctx.fillStyle = cGold;
    ctx.fillRect(22, 24, 8, 8);
    ctx.fillStyle = chartTextColor();
    ctx.fillText('Your horizon', 34, 32);
  }
}

function drawAmortChart(canvasId, schedule) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const { ctx, w, h } = chartCtx(canvas);
  const cInterest = cssVar('--ch-3'), cPrincipal = cssVar('--ch-1');

  const step = Math.max(1, Math.floor(schedule.length / 30));
  const sampled = schedule.filter((_, i) => i % step === 0);
  const barW = (w - 40) / sampled.length;
  const maxEMI = sampled[0]?.emi || 1;

  sampled.forEach((r, i) => {
    const x = 20 + i * barW;
    const principalH = (r.principalPaid / maxEMI) * (h - 62);
    const interestH = (r.interest / maxEMI) * (h - 62);
    /* 2px surface gap between stacked segments */
    ctx.fillStyle = cInterest;
    ctx.fillRect(x, h - 20 - principalH - 2 - interestH, Math.max(barW - 2, 1), interestH);
    ctx.fillStyle = cPrincipal;
    ctx.fillRect(x, h - 20 - principalH, Math.max(barW - 2, 1), principalH);
  });

  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = cInterest;
  ctx.fillRect(22, 10, 8, 8);
  ctx.fillStyle = chartTextColor();
  ctx.fillText('Interest', 34, 18);
  ctx.fillStyle = cPrincipal;
  ctx.fillRect(22, 24, 8, 8);
  ctx.fillStyle = chartTextColor();
  ctx.fillText('Principal', 34, 32);
}

/* ============================================================
   EXPORT / SHARE
   ============================================================ */
function exportCSV(calcId) {
  const data = getCalcExportData(calcId);
  if (!data) { showToast('No CSV data for this calculator'); return; }
  const csv = data.map(row => row.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `fincalcpro-${calcId}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function getCalcExportData(calcId) {
  if (calcId === 'home-loan' || calcId === 'car-loan') {
    const p = calcId === 'home-loan' ? 'hl' : 'cl';
    const principal = parseFloat(document.getElementById(`${p}-principal`)?.value);
    const rate = parseFloat(document.getElementById(`${p}-rate`)?.value) / 100;
    const years = parseFloat(document.getElementById(`${p}-years`)?.value);
    const schedule = FC.amortSchedule(principal, rate, years * 12);
    return [['Month','EMI','Principal','Interest','Balance'], ...schedule.map(r => [r.month, r.emi.toFixed(2), r.principalPaid.toFixed(2), r.interest.toFixed(2), r.balance.toFixed(2)])];
  }
  return null;
}

function shareCalc(calcId) {
  const url = `${window.location.origin}${window.location.pathname}?calc=${calcId}`;
  if (navigator.share) {
    navigator.share({ title: 'FinCalc Pro', url }).catch(() => {});
  } else {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied to clipboard'));
  }
}

/* ============================================================
   COMPARE ENGINE
   ============================================================ */
function initCompare() {
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('active'));
  });
  document.getElementById('run-compare')?.addEventListener('click', runComparison);
}

const INSTRUMENT_PARAMS = {
  conservative: { sip: 9, fd: 7.2, lumpsum: 9, gold: 8, nps: 9, ppf: 7.1, rd: 7, elss: 9, debt: 7, realestate: 7, crypto: 10, ssy: 8.2 },
  moderate:     { sip:12, fd: 7.2, lumpsum:12, gold:10, nps:11, ppf: 7.1, rd: 7, elss:13, debt: 7.5, realestate: 9, crypto: 18, ssy: 8.2 },
  aggressive:   { sip:16, fd: 7.2, lumpsum:16, gold:10, nps:13, ppf: 7.1, rd: 7, elss:17, debt: 8, realestate:11, crypto: 28, ssy: 8.2 },
};

const INSTRUMENT_META = {
  sip:        { label:'SIP (MF)',       liquidity:'High',    risk:'Market Risk' },
  fd:         { label:'Fixed Deposit',  liquidity:'Low',     risk:'Very Low' },
  lumpsum:    { label:'Lumpsum (MF)',   liquidity:'High',    risk:'Market Risk' },
  gold:       { label:'Gold',           liquidity:'Medium',  risk:'Medium' },
  nps:        { label:'NPS',            liquidity:'Very Low',risk:'Market Risk' },
  ppf:        { label:'PPF',            liquidity:'Low',     risk:'None' },
  rd:         { label:'RD',             liquidity:'Low',     risk:'Very Low' },
  elss:       { label:'ELSS (MF)',      liquidity:'Medium',  risk:'Market Risk' },
  debt:       { label:'Debt Fund',      liquidity:'High',    risk:'Low' },
  realestate: { label:'Real Estate',    liquidity:'Very Low',risk:'Medium' },
  crypto:     { label:'Crypto',         liquidity:'High',    risk:'Very High' },
  ssy:        { label:'Sukanya Samriddhi', liquidity:'Very Low', risk:'None' },
};

function runComparison() {
  const amount = parseFloat(document.getElementById('cmp-amount')?.value) || 100000;
  const horizon = parseFloat(document.getElementById('cmp-horizon')?.value) || 10;
  const risk = document.getElementById('cmp-risk')?.value || 'moderate';
  const selected = [...document.querySelectorAll('.chip.active')].map(c => c.dataset.inst).slice(0, 3);
  if (!selected.length) { alert('Select at least one instrument.'); return; }

  const rates = INSTRUMENT_PARAMS[risk];
  const results = selected.map(inst => {
    const rate = rates[inst] / 100;
    let fv, monthlyInv = amount / (horizon * 12);
    if (inst === 'sip') fv = FC.sipFV(monthlyInv, rate, horizon);
    else if (inst === 'fd') fv = FC.fdFV(amount, rate, horizon, 4, 0).grossFV;
    else if (inst === 'lumpsum') fv = FC.lumpsumFV(amount, rate, horizon);
    else if (inst === 'gold') fv = FC.lumpsumFV(amount, rate, horizon);
    else if (inst === 'nps') fv = FC.sipFV(monthlyInv, rate, horizon) * 1.15;
    else if (inst === 'ppf') fv = FC.ppfFV(amount, Math.min(horizon, 30));
    else if (inst === 'rd') fv = FC.rdFV(monthlyInv, rate, horizon * 12);
    else if (inst === 'elss') fv = FC.sipFV(monthlyInv, rate, horizon);
    else if (inst === 'debt') fv = FC.lumpsumFV(amount, rate, horizon);
    else if (inst === 'realestate') fv = FC.lumpsumFV(amount, rate, horizon);
    else if (inst === 'crypto') fv = FC.lumpsumFV(amount, rate, horizon);
    else if (inst === 'ssy') {
      let corpus = 0;
      for (let y = 0; y < Math.min(horizon, 15); y++) corpus = (corpus + amount) * (1 + rate);
      if (horizon > 15) corpus *= Math.pow(1 + rate, horizon - 15);
      fv = corpus;
    }
    const meta = INSTRUMENT_META[inst];
    return { inst, fv, rate, meta };
  });

  const maxFV = Math.max(...results.map(r => r.fv));
  const winner = results.find(r => r.fv === maxFV);
  award('comparer');

  /* horizontal bar chart — color follows the instrument, in selection order */
  const chartEl = document.getElementById('compare-chart');
  if (chartEl) {
    const barColors = [cssVar('--ch-1'), cssVar('--ch-2'), cssVar('--ch-4')];
    chartEl.innerHTML = `<div class="compare-chart-title">Projected value after ${horizon} years</div>` +
      results.map((r, i) => `
        <div class="compare-bar-row">
          <span class="compare-bar-label"><i style="background:${barColors[i]}"></i>${r.meta.label}</span>
          <span class="compare-bar-track"><span class="compare-bar-fill" data-w="${((r.fv / maxFV) * 100).toFixed(1)}" style="background:${barColors[i]}"></span></span>
          <span class="compare-bar-val">${FC.formatINR(r.fv)}</span>
        </div>`).join('');
    /* let the 0-width bars mount, then animate to size */
    requestAnimationFrame(() => requestAnimationFrame(() => {
      chartEl.querySelectorAll('.compare-bar-fill').forEach(bar => { bar.style.width = bar.dataset.w + '%'; });
    }));
  }

  const thead = document.getElementById('compare-thead');
  const tbody = document.getElementById('compare-tbody');
  thead.innerHTML = `<tr><th>Metric</th>${results.map(r => `<th>${r.meta.label}</th>`).join('')}</tr>`;

  const metrics = [
    ['Return Rate', r => `${(r.rate*100).toFixed(1)}%`],
    ['Future Value', r => FC.formatINR(r.fv)],
    ['Absolute Return', r => `${((r.fv/amount - 1)*100).toFixed(0)}%`],
    ['CAGR', r => `${(r.rate*100).toFixed(1)}% p.a.`],
    ['Liquidity', r => r.meta.liquidity],
    ['Risk Level', r => r.meta.risk],
  ];

  tbody.innerHTML = metrics.map(([label, fn]) =>
    `<tr><td style="font-weight:600;color:var(--text2)">${label}</td>${results.map(r => `<td>${fn(r)}${r === winner && label === 'Future Value' ? '<span class="best-badge">Best</span>' : ''}</td>`).join('')}</tr>`
  ).join('');

  const verdictEl = document.getElementById('compare-verdict');
  const verdictTexts = {
    conservative: `Conservative investors prioritize capital safety. ${winner.meta.label} offers the best corpus at ${FC.formatINR(winner.fv)} but consider risk vs. your comfort level.`,
    moderate: `For moderate investors, ${winner.meta.label} delivers optimal risk-adjusted returns of ${(winner.rate*100).toFixed(1)}% p.a., yielding ${FC.formatINR(winner.fv)} over ${horizon} years.`,
    aggressive: `Aggressive investors can maximize wealth with ${winner.meta.label} at ${(winner.rate*100).toFixed(1)}% p.a. CAGR, targeting ${FC.formatINR(winner.fv)} in ${horizon} years. Ensure you have an adequate emergency fund.`,
  };
  verdictEl.innerHTML = `<h3>🏆 Recommended: ${winner.meta.label}</h3><p>${verdictTexts[risk]}</p><p style="margin-top:.5rem;font-size:.78rem;color:var(--text3)">Note: Returns are indicative based on historical averages. Actual returns may vary. This is not investment advice.</p>`;

  document.getElementById('compare-results').classList.remove('hidden');
  document.getElementById('compare-results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================
   CONTACT FORM
   ============================================================ */
/* ============================================================
   HERO CANVAS — Particle animation
   ============================================================ */
function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || App.reducedMotion) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let raf;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize, { passive: true });

  function createParticles() {
    particles = [];
    const count = Math.min(60, Math.floor(canvas.width / 20));
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    /* grid lines */
    ctx.strokeStyle = 'rgba(59,130,246,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 80) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 80) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
    }

    /* particles and connections */
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(34,211,238,${p.alpha * 0.8})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(59,130,246,${0.09 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(draw);
  }
  draw();

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) cancelAnimationFrame(raf);
    else draw();
  });
}

/* ============================================================
   SCROLL REVEAL
   ============================================================ */
function observeReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.1 });
  document.querySelectorAll('.reveal:not(.visible)').forEach(el => {
    /* IntersectionObserver callbacks can be throttled on inactive/background
       tabs, leaving above-the-fold content stuck invisible until interaction.
       Reveal anything already on/near screen immediately as a safe fallback. */
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      el.classList.add('visible');
    } else {
      io.observe(el);
    }
  });
}

function initRevealAnimations() {
  document.querySelectorAll('.section, .section-header, .itr-step, .legal-card').forEach(el => {
    el.classList.add('reveal');
  });
  observeReveal();
  /* Safety net: force-reveal anything still hidden after layout settles
     (e.g. web fonts shifting content, or a throttled/missed observer). */
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 1500);
}

/* ---- Deep-link to calculator on page load ---- */
window.addEventListener('load', () => {
  const params = new URLSearchParams(window.location.search);
  const calc = params.get('calc');
  if (calc && CALCULATORS.find(c => c.id === calc)) openCalc(calc);
});

/* ============================================================
   PLAYGROUND — games, experiments & retention features
   ============================================================ */
function initPlayground() {
  initQuiz();
  initGuessGame();
  initTimeMachine();
  initWealthTicker();
  initRule72();
  initGoalTracker();
  initFactOfDay();
  initStreak();
  renderBadges();
  initSurprise();
  /* night-owl achievement */
  const h = new Date().getHours();
  if (h >= 22 || h < 5) award('night-owl');
}

/* ---- Achievements ---- */
const BADGES = {
  'explorer':       { emoji: '🧭', name: 'Explorer',        desc: 'Opened 5 calculators' },
  'first-save':     { emoji: '📌', name: 'Keeper',          desc: 'Saved a calculation' },
  'comparer':       { emoji: '⚖️', name: 'Analyst',         desc: 'Ran a comparison' },
  'health-checked': { emoji: '🩺', name: 'Self-Aware',      desc: 'Took the health quiz' },
  'sharp-guesser':  { emoji: '🎯', name: 'Sharp Guesser',   desc: 'Guessed within 10%' },
  'planner':        { emoji: '🏔️', name: 'Goal Setter',     desc: 'Set a savings goal' },
  'random-roller':  { emoji: '🎲', name: 'Adventurer',      desc: 'Rolled a random calculator' },
  'theme-switcher': { emoji: '🌗', name: 'Day Trader',      desc: 'Switched the theme' },
  'streak-3':       { emoji: '🔥', name: 'Regular',         desc: '3-day visit streak' },
  'night-owl':      { emoji: '🦉', name: 'Night Owl',       desc: 'Planning finances after 10pm' },
  'curator':        { emoji: '⭐', name: 'Curator',         desc: 'Pinned 3 favorites' },
  'myth-master':    { emoji: '🧠', name: 'Myth Buster',     desc: '5 myths busted correctly' },
  'word-wizard':    { emoji: '🔤', name: 'Word Wizard',     desc: 'Solved the money word' },
  'personalized':   { emoji: '🎭', name: 'Regular Face',    desc: 'Told us your name' },
  'backup-pro':     { emoji: '💾', name: 'Backup Pro',      desc: 'Exported your data' },
  'secret-wealth':  { emoji: '🔑', name: 'Secret Key',      desc: 'Found the hidden word' },
  'supporter':      { emoji: '☕', name: 'Coffee Patron',   desc: 'Checked out the support page' },
  'perfectionist':  { emoji: '🏅', name: 'Perfect Score',   desc: '100/100 on the health quiz' },
};

function getBadges() {
  try { return JSON.parse(localStorage.getItem('fincalc-badges') || '[]'); }
  catch { return []; }
}

function award(id) {
  if (!BADGES[id]) return;
  const owned = getBadges();
  if (owned.includes(id)) return;
  owned.push(id);
  try { localStorage.setItem('fincalc-badges', JSON.stringify(owned)); } catch {}
  showToast(`${BADGES[id].emoji} Achievement unlocked: ${BADGES[id].name}`);
  renderBadges();
  renderStatsTile?.();
}

function renderBadges() {
  const wall = document.getElementById('badge-wall');
  if (!wall) return;
  const owned = getBadges();
  wall.innerHTML = Object.entries(BADGES).map(([id, b]) => `
    <div class="badge ${owned.includes(id) ? 'unlocked' : 'locked'}" title="${b.desc}">
      <span class="badge-emoji">${b.emoji}</span>
      <span><span class="badge-name">${b.name}</span><span class="badge-desc">${b.desc}</span></span>
    </div>`).join('');
}

/* ---- Visit streak ---- */
function initStreak() {
  const chip = document.getElementById('streak-chip');
  let data = { last: '', n: 0 };
  try { data = JSON.parse(localStorage.getItem('fincalc-streak') || '{"last":"","n":0}'); } catch {}
  const today = new Date().toISOString().slice(0, 10);
  if (data.last !== today) {
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    data.n = data.last === yesterday ? data.n + 1 : 1;
    data.last = today;
    try { localStorage.setItem('fincalc-streak', JSON.stringify(data)); } catch {}
  }
  if (data.n >= 3) award('streak-3');
  if (chip) chip.innerHTML = `🔥 ${data.n}-day streak`;
}

/* ---- 1 · Financial health quiz ---- */
const QUIZ = [
  { q: 'How many months of expenses sit in your emergency fund?',
    opts: [['None yet', 0], ['Less than 3 months', 8], ['3–6 months', 14], ['6+ months', 18]], fix: 'emergency-fund' },
  { q: 'What share of your income do you save or invest each month?',
    opts: [['Nothing right now', 0], ['Under 10%', 8], ['10–30%', 14], ['Over 30%', 18]], fix: 'budget-50-30-20' },
  { q: 'Do you have health and term life insurance?',
    opts: [['Neither', 0], ['Only one of them', 8], ['Both, adequately sized', 16]], fix: 'term-insurance' },
  { q: 'Any high-interest debt (credit cards, personal loans)?',
    opts: [['Yes, and it’s growing', 0], ['Some, but under control', 8], ['None', 16]], fix: 'debt-payoff' },
  { q: 'How regularly do you invest?',
    opts: [['I don’t invest yet', 0], ['Now and then', 8], ['Automatically, every month', 16]], fix: 'sip' },
  { q: 'Have you planned for retirement?',
    opts: [['Haven’t started', 0], ['Thinking about it', 8], ['Yes, with a target corpus', 16]], fix: 'retirement' },
];

let quizState = null;

function initQuiz() {
  if (!document.getElementById('quiz-body')) return;
  resetQuiz();
}

function resetQuiz() {
  quizState = { i: 0, score: 0, weak: [] };
  renderQuizStep();
}

function renderQuizStep() {
  const body = document.getElementById('quiz-body');
  if (!body) return;
  const { i } = quizState;
  if (i >= QUIZ.length) { renderQuizResult(); return; }
  const q = QUIZ[i];
  body.innerHTML = `
    <div class="quiz-progress">${QUIZ.map((_, k) => `<i class="${k < i ? 'done' : ''}"></i>`).join('')}</div>
    <div class="quiz-q">${q.q}</div>
    <div class="quiz-options">
      ${q.opts.map(([label, pts], k) => `
        <button class="quiz-option" onclick="answerQuiz(${k})">
          ${label}
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>`).join('')}
    </div>`;
}

function answerQuiz(optIndex) {
  const q = QUIZ[quizState.i];
  const [, pts] = q.opts[optIndex];
  const maxPts = Math.max(...q.opts.map(o => o[1]));
  quizState.score += pts;
  quizState.weak.push({ fix: q.fix, gap: maxPts - pts });
  quizState.i++;
  renderQuizStep();
}

function renderQuizResult() {
  const body = document.getElementById('quiz-body');
  const score = quizState.score;
  const verdict = score >= 75
    ? { title: 'Excellent shape 🎉', text: 'Your fundamentals are solid. Fine-tune with the tools below and keep compounding.', color: 'var(--emerald)' }
    : score >= 45
      ? { title: 'On your way 👍', text: 'A strong start — closing the gaps below would meaningfully boost your score.', color: 'var(--gold)' }
      : { title: 'Needs attention 🚨', text: 'No judgement — a few focused fixes below will transform this score fast.', color: 'var(--red)' };
  const suggests = quizState.weak
    .filter(w => w.gap > 0)
    .sort((a, b) => b.gap - a.gap)
    .slice(0, 3)
    .map(w => CALCULATORS.find(c => c.id === w.fix))
    .filter(Boolean);
  const R = 58, C = 2 * Math.PI * R;
  body.innerHTML = `
    <div class="quiz-result">
      <div class="quiz-gauge">
        <svg width="132" height="132" viewBox="0 0 132 132">
          <circle class="quiz-gauge-track" cx="66" cy="66" r="${R}"/>
          <circle class="quiz-gauge-fill" id="quiz-gauge-fill" cx="66" cy="66" r="${R}"
            stroke="${verdict.color}" stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
        </svg>
        <div class="quiz-gauge-num"><span id="quiz-score-num">0</span><small>OUT OF 100</small></div>
      </div>
      <div class="quiz-verdict">
        <h4>${verdict.title}</h4>
        <p>${verdict.text}</p>
        <div class="quiz-suggests">
          ${suggests.map(c => `<button class="chip" onclick="openCalc('${c.id}')">${c.name}</button>`).join('')}
          <button class="chip" onclick="resetQuiz()">↻ Retake</button>
        </div>
      </div>
    </div>`;
  /* animate ring + number */
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById('quiz-gauge-fill').style.strokeDashoffset = C * (1 - score / 100);
    const numEl = document.getElementById('quiz-score-num');
    const t0 = performance.now();
    const tick = (t) => {
      const p = Math.min((t - t0) / 1100, 1);
      numEl.textContent = Math.round(score * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(tick);
    };
    if (App.reducedMotion) numEl.textContent = score; else requestAnimationFrame(tick);
  }));
  if (score >= 75) launchConfetti();
  if (score === 100) award('perfectionist');
  award('health-checked');
}

/* ---- 2 · Compounding guess game ---- */
let guessRound = null;

function initGuessGame() {
  if (!document.getElementById('guess-body')) return;
  updateGuessBest();
  nextGuessRound();
}

function updateGuessBest() {
  const best = parseFloat(localStorage.getItem('fincalc-guess-best') || 'NaN');
  const el = document.getElementById('guess-best');
  if (el && !isNaN(best)) el.textContent = `Best: ${best.toFixed(0)}% off`;
}

function nextGuessRound() {
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const m = pick([2000, 5000, 10000, 20000]);
  const r = pick([10, 12, 15]);
  const y = pick([10, 15, 20, 25]);
  guessRound = { m, r, y, actual: FC.sipFV(m, r / 100, y), invested: m * 12 * y };
  const body = document.getElementById('guess-body');
  const max = Math.ceil(guessRound.actual * 2.1 / 100000) * 100000;
  const start = Math.round(max / 2 / 100000) * 100000;
  body.innerHTML = `
    <div class="guess-prompt">Invest <b>${FC.formatINR(m)}/month</b> at <b>${r}% p.a.</b> for <b>${y} years</b>. What do you end up with?</div>
    <div class="guess-value" id="guess-value">${FC.formatINR(start)}</div>
    <input type="range" id="guess-slider" class="range-input" min="100000" max="${max}" step="100000" value="${start}"
      aria-label="Your guess" oninput="document.getElementById('guess-value').textContent = FC.formatINR(parseFloat(this.value))" />
    <div class="guess-actions">
      <button class="btn btn-primary btn-sm" onclick="revealGuess()">Lock in my guess</button>
    </div>`;
  paintAllSliders(body);
}

function revealGuess() {
  const guess = parseFloat(document.getElementById('guess-slider').value);
  const { actual, invested } = guessRound;
  const offPct = Math.abs(guess - actual) / actual * 100;
  const best = parseFloat(localStorage.getItem('fincalc-guess-best') || 'Infinity');
  if (offPct < best) { try { localStorage.setItem('fincalc-guess-best', String(offPct)); } catch {} }
  updateGuessBest();
  if (offPct <= 10) award('sharp-guesser');
  const grade = offPct <= 10 ? '🎯 Scarily accurate!' : offPct <= 30 ? '👏 Close — great instincts.' : guess < actual ? '🤯 Way low — compounding wins again.' : '😅 Too optimistic this time.';
  const body = document.getElementById('guess-body');
  body.innerHTML = `
    <div class="guess-prompt">You guessed <b>${FC.formatINR(guess)}</b> — the real answer is</div>
    <div class="guess-reveal">
      <div class="guess-actual">${FC.formatINR(actual)}</div>
      <div class="guess-note">${grade} You were <b>${offPct.toFixed(0)}% off</b>. Total invested: ${FC.formatINR(invested)} — the other ${FC.formatINR(actual - invested)} is pure compounding.</div>
    </div>
    <div class="guess-actions">
      <button class="btn btn-primary btn-sm" onclick="nextGuessRound()">Next round</button>
      <button class="btn btn-ghost btn-sm" onclick="openCalc('sip')">Open SIP calculator</button>
    </div>`;
}

/* ---- 3 · Inflation time machine ---- */
function initTimeMachine() {
  const amount = document.getElementById('tm-amount');
  const year = document.getElementById('tm-year');
  if (!amount || !year) return;
  const AVG_INFLATION = 0.07;
  const NOW = 2026;
  const update = () => {
    const amt = parseFloat(amount.value) || 0;
    const yr = parseInt(year.value, 10);
    document.getElementById('tm-year-label').textContent = yr;
    const factor = Math.pow(1 + AVG_INFLATION, NOW - yr);
    document.getElementById('tm-result').innerHTML =
      `had the buying power of <b>${FC.formatINR(amt * factor)}</b> today.<br>` +
      `Flip side: today's ${FC.formatINR(amt)} would feel like <b>${FC.formatINR(amt / factor)}</b> back in ${yr}. <span style="color:var(--text3)">(at ~7% avg. inflation)</span>`;
  };
  amount.addEventListener('input', update);
  year.addEventListener('input', update);
  document.querySelectorAll('[data-tm]').forEach(chip => {
    chip.addEventListener('click', () => {
      const [a, y] = chip.dataset.tm.split(',');
      amount.value = a; year.value = y;
      paintSlider(year);
      update();
    });
  });
  paintSlider(year);
  update();
}

/* ---- 4 · Wealth ticker ---- */
function initWealthTicker() {
  const el = document.getElementById('ticker-earned');
  if (!el) return;
  const PER_SECOND = 10000000 * 0.12 / (365 * 86400); /* ₹1 Cr at 12% p.a. */
  const t0 = performance.now();
  let lastText = '';
  const tick = () => {
    const earned = (performance.now() - t0) / 1000 * PER_SECOND;
    const text = '₹' + earned.toFixed(2);
    if (text !== lastText) { el.textContent = text; lastText = text; }
    requestAnimationFrame(tick);
  };
  if (App.reducedMotion) {
    setInterval(() => { el.textContent = '₹' + ((performance.now() - t0) / 1000 * PER_SECOND).toFixed(2); }, 1000);
  } else {
    requestAnimationFrame(tick);
  }
}

/* ---- 5 · Rule of 72 ---- */
function initRule72() {
  const slider = document.getElementById('r72-rate');
  if (!slider) return;
  const update = () => {
    const r = parseFloat(slider.value);
    document.getElementById('r72-rate-label').textContent = r + '%';
    document.getElementById('r72-double').textContent = (72 / r).toFixed(1) + ' yrs';
    document.getElementById('r72-quad').textContent = (144 / r).toFixed(0) + ' yrs';
    document.getElementById('r72-oct').textContent = (216 / r).toFixed(0) + ' yrs';
  };
  slider.addEventListener('input', update);
  paintSlider(slider);
  update();
}

/* ---- 6 · Goal tracker ---- */
function getGoal() {
  try { return JSON.parse(localStorage.getItem('fincalc-goal') || 'null'); }
  catch { return null; }
}

function initGoalTracker() {
  renderGoal();
}

function renderGoal() {
  const body = document.getElementById('goal-body');
  if (!body) return;
  const goal = getGoal();
  if (!goal) { renderGoalForm(); return; }
  const pct = Math.min(100, (goal.saved / goal.target) * 100);
  /* months until (saved + monthly SIP) reaches target */
  const i = goal.rate / 100 / 12;
  let months = 0, fv = goal.saved;
  while (fv < goal.target && months < 1200) {
    fv = fv * (1 + i) + goal.monthly;
    months++;
  }
  const eta = new Date();
  eta.setMonth(eta.getMonth() + months);
  const etaText = months >= 1200
    ? 'over 100 years — raise the monthly amount!'
    : `${eta.toLocaleString('en-IN', { month: 'short', year: 'numeric' })} (${(months / 12).toFixed(1)} yrs)`;
  const R = 54, C = 2 * Math.PI * R;
  body.innerHTML = `
    <div class="goal-view">
      <div class="goal-ring">
        <svg width="124" height="124" viewBox="0 0 124 124">
          <defs>
            <linearGradient id="goalGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#3B82F6"/><stop offset="100%" stop-color="#22D3EE"/>
            </linearGradient>
          </defs>
          <circle class="goal-ring-track" cx="62" cy="62" r="${R}"/>
          <circle class="goal-ring-fill" id="goal-ring-fill" cx="62" cy="62" r="${R}"
            stroke-dasharray="${C}" stroke-dashoffset="${C}"/>
        </svg>
        <div class="goal-ring-num">${pct.toFixed(0)}%<small>SAVED</small></div>
      </div>
      <div class="goal-info">
        <h4>${goal.name}</h4>
        <p><b>${FC.formatINR(goal.saved)}</b> of <b>${FC.formatINR(goal.target)}</b> saved.<br>
        Adding ${FC.formatINR(goal.monthly)}/month at ${goal.rate}% p.a., you'll get there by <b>${etaText}</b>.</p>
        <div class="goal-actions">
          <button class="btn btn-ghost btn-sm" onclick="renderGoalForm()">Edit</button>
          <button class="btn btn-ghost btn-sm" onclick="clearGoal()">Clear</button>
        </div>
      </div>
    </div>`;
  requestAnimationFrame(() => requestAnimationFrame(() => {
    document.getElementById('goal-ring-fill').style.strokeDashoffset = C * (1 - pct / 100);
  }));
}

function renderGoalForm() {
  const body = document.getElementById('goal-body');
  const g = getGoal() || { name: 'Dream home down payment', target: 2000000, monthly: 15000, saved: 200000, rate: 12 };
  body.innerHTML = `
    <div class="goal-form">
      <div class="form-group goal-span-2"><label>Goal name</label><input class="input" id="goal-name" value="${g.name}" maxlength="60" /></div>
      <div class="form-group"><label>Target (₹)</label><input type="number" class="input" id="goal-target" value="${g.target}" min="1000" /></div>
      <div class="form-group"><label>Saved so far (₹)</label><input type="number" class="input" id="goal-saved" value="${g.saved}" min="0" /></div>
      <div class="form-group"><label>Monthly investment (₹)</label><input type="number" class="input" id="goal-monthly" value="${g.monthly}" min="0" /></div>
      <div class="form-group"><label>Expected return</label>
        <select class="input" id="goal-rate">
          ${[6, 8, 10, 12, 15].map(r => `<option value="${r}"${r === g.rate ? ' selected' : ''}>${r}% p.a.</option>`).join('')}
        </select>
      </div>
      <div class="goal-span-2"><button class="btn btn-primary btn-sm" onclick="saveGoal()">Set my goal</button></div>
    </div>`;
}

function saveGoal() {
  const goal = {
    name: (document.getElementById('goal-name').value || 'My goal').slice(0, 60),
    target: Math.max(1000, parseFloat(document.getElementById('goal-target').value) || 0),
    saved: Math.max(0, parseFloat(document.getElementById('goal-saved').value) || 0),
    monthly: Math.max(0, parseFloat(document.getElementById('goal-monthly').value) || 0),
    rate: parseFloat(document.getElementById('goal-rate').value) || 12,
  };
  try { localStorage.setItem('fincalc-goal', JSON.stringify(goal)); } catch {}
  award('planner');
  renderGoal();
  showToast('Goal saved — tracked on this device');
}

function clearGoal() {
  localStorage.removeItem('fincalc-goal');
  renderGoalForm();
}

/* ---- 7 · Money fact of the day ---- */
const MONEY_FACTS = [
  'If you invest ₹5,000/month from age 25 instead of 35, you retire with roughly 3× the corpus — the first decade does the heaviest lifting.',
  'The Rule of 72: divide 72 by your return rate to know how many years your money takes to double. At 12%, that’s just 6 years.',
  'A daily ₹200 food-delivery habit is ₹73,000 a year — SIP’d at 12% for 20 years, it’s over ₹59 lakh.',
  'Inflation at 6% silently halves your money’s buying power every 12 years. Cash "saved" under the mattress is money shrinking.',
  'In a 20-year home loan at 8.5%, you pay almost as much interest as the house itself cost. One extra EMI a year can cut years off the loan.',
  'PPF is one of the very few EEE instruments in India — exempt on deposit, exempt on growth, exempt on withdrawal.',
  'Equity has beaten inflation in every 15-year rolling period of Indian market history — volatility smooths out with time.',
  'A 1% higher expense ratio on a mutual fund can quietly eat ~20% of your final corpus over 30 years. Fees compound too.',
  'Your emergency fund isn’t an investment — it’s insurance. Six months of expenses in a liquid fund beats returns you’d panic-sell.',
  'Step-up SIPs are the cheat code: increasing your SIP by just 10% a year can nearly double your final corpus versus a flat SIP.',
  'The 50/30/20 rule: 50% needs, 30% wants, 20% savings. If you can flip the 30 and the 20, you’re ahead of almost everyone.',
  'Term insurance costing ₹700/month can protect your family with ₹1 crore. ULIPs mixing insurance with investment usually do both badly.',
  'Buying a ₹10 lakh car on EMI costs ~₹13 lakh. The same EMI SIP’d for those 5 years would grow to ~₹16 lakh instead.',
  'Compounding is back-loaded: in a 30-year SIP, more than half your final corpus typically arrives in the last 8 years. Don’t quit early.',
  'NPS gives an extra ₹50,000 tax deduction under 80CCD(1B) — over and above the 80C limit most people max out.',
  'Timing the market badly beats not investing at all: even someone who invested only at every market peak since 2000 still earned ~10% p.a.',
];

function initFactOfDay() {
  const el = document.getElementById('fact-text');
  if (!el) return;
  const day = Math.floor(Date.now() / 86400000);
  let offset = 0;
  const show = () => { el.textContent = MONEY_FACTS[(day + offset) % MONEY_FACTS.length]; };
  document.getElementById('fact-next')?.addEventListener('click', () => { offset++; show(); });
  show();
}

/* ---- 10 · Surprise me ---- */
function initSurprise() {
  document.getElementById('surprise-btn')?.addEventListener('click', () => {
    const c = CALCULATORS[Math.floor(Math.random() * CALCULATORS.length)];
    award('random-roller');
    openCalc(c.id);
  });
}

/* ============================================================
   FEATURE PACK 3 — favorites, personalization, games & minis
   ============================================================ */

/* ---- Search aliases: colloquial terms people actually type ---- */
const SEARCH_ALIASES = {
  'home-loan': 'mortgage housing emi property',
  'retirement': 'fire early retire pension corpus',
  'sip': 'mutual fund monthly invest systematic',
  'lumpsum': 'one time invest mutual fund',
  'fd': 'fixed deposit bank interest term deposit',
  'rd': 'recurring deposit monthly bank',
  'nps': 'pension national scheme retirement tier',
  'ppf': 'public provident fund tax free',
  'income-tax': 'salary itr slab regime',
  'new-tax-regime': 'salary itr slab 2025 regime',
  'capital-gains': 'ltcg stcg shares equity property sale',
  'emergency-fund': 'rainy day safety buffer',
  'term-insurance': 'life cover death benefit',
  'debt-payoff': 'credit card snowball avalanche loan free',
  'net-worth': 'assets liabilities wealth total',
  'inflation-impact': 'price rise value erosion cpi',
};

/* ---- Favorites ---- */
function getFavs() {
  try { return JSON.parse(localStorage.getItem('fincalc-favs') || '[]'); }
  catch { return []; }
}

function toggleFav(event, id) {
  event.stopPropagation();
  let favs = getFavs();
  if (favs.includes(id)) favs = favs.filter(f => f !== id);
  else {
    favs.push(id);
    showToast('Pinned to favorites');
  }
  try { localStorage.setItem('fincalc-favs', JSON.stringify(favs)); } catch {}
  if (favs.length >= 3) award('curator');
  const f = document.querySelector('.filter-btn.active')?.dataset.filter || 'all';
  const q = document.getElementById('calc-search')?.value.toLowerCase() || '';
  renderCalcGrid(f, q);
}

/* ---- Personalization: name, accent, density, number format, backup ---- */
function initPersonalization() {
  /* name */
  const nameInput = document.getElementById('name-input');
  if (nameInput) {
    nameInput.value = localStorage.getItem('fincalc-name') || '';
    nameInput.addEventListener('change', () => {
      const v = nameInput.value.trim().slice(0, 24);
      try { localStorage.setItem('fincalc-name', v); } catch {}
      if (v) award('personalized');
      renderDashStrip();
      showToast(v ? `Hi ${v}! Greeting updated` : 'Greeting reset');
    });
  }

  /* accent */
  const savedAccent = localStorage.getItem('fincalc-accent') || '';
  if (savedAccent) document.documentElement.dataset.accent = savedAccent;
  document.querySelectorAll('.accent-swatch').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.accent === savedAccent);
    sw.addEventListener('click', () => {
      const a = sw.dataset.accent;
      if (a) document.documentElement.dataset.accent = a;
      else delete document.documentElement.dataset.accent;
      try { localStorage.setItem('fincalc-accent', a); } catch {}
      document.querySelectorAll('.accent-swatch').forEach(x => x.classList.toggle('active', x === sw));
    });
  });

  /* density */
  const density = document.getElementById('density-toggle');
  if (density) {
    density.checked = localStorage.getItem('fincalc-density') === 'compact';
    document.body.classList.toggle('compact', density.checked);
    density.addEventListener('change', () => {
      document.body.classList.toggle('compact', density.checked);
      try { localStorage.setItem('fincalc-density', density.checked ? 'compact' : ''); } catch {}
    });
  }

  /* number format */
  const numfmt = document.getElementById('numfmt-select');
  const mode = localStorage.getItem('fincalc-numfmt') || 'in';
  if (numfmt) {
    numfmt.value = mode;
    numfmt.addEventListener('change', () => {
      try { localStorage.setItem('fincalc-numfmt', numfmt.value); } catch {}
      applyNumberFormat(numfmt.value);
      refreshComputedWidgets();
      showToast(numfmt.value === 'intl' ? 'Showing international units (M/B)' : 'Showing Indian units (L/Cr)');
    });
  }
  applyNumberFormat(mode);
  if (mode !== 'in') refreshComputedWidgets();

  /* export / import */
  document.getElementById('export-data')?.addEventListener('click', exportMyData);
  const importFile = document.getElementById('import-file');
  document.getElementById('import-data')?.addEventListener('click', () => importFile?.click());
  importFile?.addEventListener('change', () => {
    const file = importFile.files?.[0];
    if (!file) return;
    file.text().then(text => {
      const data = JSON.parse(text);
      if (!data || typeof data !== 'object' || !Object.keys(data).some(k => k.startsWith('fincalc-'))) {
        showToast('Not a FinCalc Pro backup file');
        return;
      }
      Object.entries(data).forEach(([k, v]) => {
        if (k.startsWith('fincalc-') || k === 'cookieConsent') localStorage.setItem(k, v);
      });
      showToast('Data restored — reloading…');
      setTimeout(() => window.location.reload(), 800);
    }).catch(() => showToast('Could not read that file'));
  });
}

const _fmtINR = FC.formatINR;
function applyNumberFormat(mode) {
  FC.formatINR = mode === 'intl'
    ? (amount) => {
        if (!isFinite(amount)) return '∞';
        const abs = Math.abs(amount);
        const sign = amount < 0 ? '-' : '';
        if (abs >= 1e9) return sign + '₹' + (abs / 1e9).toFixed(2) + ' B';
        if (abs >= 1e6) return sign + '₹' + (abs / 1e6).toFixed(2) + ' M';
        return sign + '₹' + abs.toFixed(0).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      }
    : _fmtINR;
}

function refreshComputedWidgets() {
  initQuickWidgets();
  initBentoWidgets();
  if (App.currentCalc) calcLive(App.currentCalc);
}

function exportMyData() {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i);
    if (k && k.startsWith('fincalc-')) data[k] = localStorage.getItem(k);
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  downloadBlob(blob, 'fincalcpro-backup.json');
  award('backup-pro');
}

/* ---- Dashboard strip: greeting · continue · pick of the day · popular ---- */
function renderDashStrip() {
  const strip = document.getElementById('dash-strip');
  if (!strip) return;
  const name = localStorage.getItem('fincalc-name') || '';
  const h = new Date().getHours();
  const daypart = h < 5 ? 'Burning the midnight oil' : h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const chips = [];

  let recent = [];
  try { recent = JSON.parse(localStorage.getItem('fincalc-recent') || '[]'); } catch {}
  const lastCalc = CALCULATORS.find(c => c.id === recent[0]);
  if (lastCalc) {
    chips.push(`<button class="dash-chip" onclick="openCalc('${lastCalc.id}')">Continue: <b>${lastCalc.name}</b> →</button>`);
  }

  const day = Math.floor(Date.now() / 86400000);
  const pick = CALCULATORS[day % CALCULATORS.length];
  chips.push(`<button class="dash-chip" onclick="openCalc('${pick.id}')"><span class="dash-chip-tag">TODAY'S PICK</span> <b>${pick.name}</b></button>`);

  let counts = {};
  try { counts = JSON.parse(localStorage.getItem('fincalc-opencounts') || '{}'); } catch {}
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const topCalc = top && top[1] >= 2 && top[0] !== recent[0] ? CALCULATORS.find(c => c.id === top[0]) : null;
  if (topCalc) {
    chips.push(`<button class="dash-chip" onclick="openCalc('${topCalc.id}')">Your favorite: <b>${topCalc.name}</b></button>`);
  }

  const payday = parseInt(localStorage.getItem('fincalc-payday') || '0', 10);
  if (payday >= 1 && payday <= 31) {
    const now = new Date();
    let next = new Date(now.getFullYear(), now.getMonth(), payday);
    if (next <= now) next = new Date(now.getFullYear(), now.getMonth() + 1, payday);
    const days = Math.ceil((next - now) / 86400000);
    chips.push(`<span class="dash-chip" style="cursor:default">💸 Payday in <b>${days} day${days > 1 ? 's' : ''}</b></span>`);
  }

  chips.push(`<button class="coffee-pill coffee-pill-sm" onclick="openCoffee()"><span class="coffee-emoji" aria-hidden="true">☕</span><span class="coffee-pill-text">Buy me a coffee</span></button>`);
  strip.innerHTML = `<span class="dash-greeting">${daypart}${name ? ', ' + name : ''}.</span>` + chips.join('');
}

/* ---- Amount in words (Indian system) ---- */
const WORD_ONES = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
const WORD_TENS = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

function twoDigitWords(n) {
  if (n < 20) return WORD_ONES[n];
  return WORD_TENS[Math.floor(n / 10)] + (n % 10 ? '-' + WORD_ONES[n % 10] : '');
}

function indianWords(n) {
  n = Math.round(n);
  if (n <= 0 || n >= 1e12) return '';
  const parts = [];
  const crore = Math.floor(n / 1e7); n %= 1e7;
  const lakh = Math.floor(n / 1e5); n %= 1e5;
  const thousand = Math.floor(n / 1e3); n %= 1e3;
  const hundred = Math.floor(n / 100); n %= 100;
  if (crore) parts.push((crore < 100 ? twoDigitWords(crore) : indianWords(crore)) + ' crore');
  if (lakh) parts.push(twoDigitWords(lakh) + ' lakh');
  if (thousand) parts.push(twoDigitWords(thousand) + ' thousand');
  if (hundred) parts.push(WORD_ONES[hundred] + ' hundred');
  if (n) parts.push(twoDigitWords(n));
  return parts.join(' ');
}

function updateResultWords() {
  document.querySelectorAll('#modal-body .result-main').forEach(main => {
    let words = '';
    const m = main.textContent.trim().match(/^(-?)₹([\d,]+(?:\.\d+)?)\s*(L|Cr|M|B)?$/);
    if (m && !m[1]) {
      const num = parseFloat(m[2].replace(/,/g, ''));
      const mult = { L: 1e5, Cr: 1e7, M: 1e6, B: 1e9 }[m[3]] || 1;
      const value = num * mult;
      if (value >= 1000) words = '≈ ' + indianWords(value) + ' rupees';
    }
    let el = main.nextElementSibling;
    if (!el || !el.classList.contains('result-words')) {
      el = document.createElement('div');
      el.className = 'result-words';
      main.after(el);
    }
    el.textContent = words;
  });
}

/* ---- Old regime tax (for the dashboard delta) ---- */
function oldRegimeTaxEstimate(taxable) {
  const slabs = [[250000, 0], [250000, 0.05], [500000, 0.20], [Infinity, 0.30]];
  let remaining = taxable, tax = 0;
  for (const [width, rate] of slabs) {
    if (remaining <= 0) break;
    const inSlab = Math.min(remaining, width);
    tax += inSlab * rate;
    remaining -= inSlab;
  }
  return tax * 1.04;
}

/* ============================================================
   PLAYGROUND PACK 2
   ============================================================ */
function initPlayground2() {
  initMythGame();
  initWordGame();
  initFireMini();
  initLatteMini();
  initWeek52Mini();
  initAllocMini();
  initNetWorthMini();
  renderStatsTile();
  initFYCountdown();
}

/* ---- Myth or Fact ---- */
const MYTHS = [
  { t: 'You need a lot of money to start investing.', myth: true, why: 'SIPs start at ₹500/month. Starting small and early beats starting big and late — time matters more than the amount.' },
  { t: 'A higher income automatically makes you wealthy.', myth: true, why: 'Wealth = what you keep, not what you earn. High earners with lifestyle inflation often have lower net worth than disciplined moderate earners.' },
  { t: 'Equity beats inflation over long horizons.', myth: false, why: 'Indian equity indices have beaten inflation in every 15-year rolling window on record. Short-term, though, anything can happen.' },
  { t: 'Buying a house is always better than renting.', myth: true, why: 'It depends on price-to-rent ratios, tenure and mobility. In many Indian metros, renting + investing the difference builds more wealth over 10 years.' },
  { t: 'Gold is the best long-term investment.', myth: true, why: 'Gold preserves value (~9-10% CAGR) but has long flat decades and no cash flow. Equity has historically compounded faster over 15+ years.' },
  { t: 'Your PPF interest is completely tax-free.', myth: false, why: 'PPF is EEE — contributions get 80C deduction, interest is tax-free, and maturity is tax-free. One of the few such instruments left.' },
  { t: 'Credit cards are bad for your finances.', myth: true, why: 'Cards used with full monthly repayment build credit score and give rewards. The danger is revolving balances at 36-42% APR.' },
  { t: 'A term plan is cheaper in your 20s than your 30s.', myth: false, why: 'Premiums lock at purchase age. A ₹1 Cr cover at 25 can cost ~40% less per year than the same cover bought at 35.' },
  { t: 'You should pause SIPs when markets fall.', myth: true, why: 'Falling markets are when SIPs buy more units. Pausing during dips is the single most corrosive retail investing habit.' },
  { t: 'The new tax regime is better for everyone.', myth: true, why: 'It depends on your deductions. Heavy 80C + HRA + home-loan users can still pay less under the old regime. Run both before choosing.' },
];

let mythState = { offset: 0, answered: false };

function initMythGame() {
  if (!document.getElementById('myth-body')) return;
  renderMyth();
  updateMythScore();
}

function mythIndex() {
  return (Math.floor(Date.now() / 86400000) + mythState.offset) % MYTHS.length;
}

function renderMyth() {
  const body = document.getElementById('myth-body');
  const m = MYTHS[mythIndex()];
  mythState.answered = false;
  body.innerHTML = `
    <div class="myth-statement">“${m.t}”</div>
    <div class="myth-actions">
      <button class="btn btn-outline btn-sm" onclick="answerMyth(true)">🚫 Myth</button>
      <button class="btn btn-outline btn-sm" onclick="answerMyth(false)">✅ Fact</button>
    </div>`;
}

function answerMyth(saidMyth) {
  if (mythState.answered) return;
  mythState.answered = true;
  const m = MYTHS[mythIndex()];
  const right = saidMyth === m.myth;
  if (right) {
    const n = (parseInt(localStorage.getItem('fincalc-myth-correct') || '0', 10) || 0) + 1;
    try { localStorage.setItem('fincalc-myth-correct', String(n)); } catch {}
    if (n >= 5) award('myth-master');
    launchConfetti();
  }
  updateMythScore();
  const body = document.getElementById('myth-body');
  body.innerHTML = `
    <div class="myth-statement">“${m.t}”</div>
    <div class="myth-reveal ${right ? 'right' : 'wrong'}">
      <b>${right ? 'Correct!' : 'Not quite.'} That's a ${m.myth ? 'myth' : 'fact'}.</b> ${m.why}
    </div>
    <div class="myth-actions">
      <button class="btn btn-primary btn-sm" onclick="mythState.offset++; renderMyth()">Next statement</button>
    </div>`;
}

function updateMythScore() {
  const el = document.getElementById('myth-score');
  const n = parseInt(localStorage.getItem('fincalc-myth-correct') || '0', 10) || 0;
  if (el) el.textContent = n ? `${n} busted` : '';
}

/* ---- The Money Word (daily puzzle) ---- */
const WORD_POOL = ['MONEY', 'ASSET', 'BONDS', 'STOCK', 'FUNDS', 'LOANS', 'YIELD', 'TRADE', 'SHARE', 'DEBTS', 'TAXES', 'CRORE', 'LAKHS', 'PAISA', 'RUPEE', 'SAVER', 'BANKS', 'RATES', 'SCORE', 'PRICE', 'VALUE', 'AUDIT', 'INDEX', 'SPEND', 'HEDGE', 'VAULT', 'COINS'];

function wordToday() {
  return WORD_POOL[Math.floor(Date.now() / 86400000) % WORD_POOL.length];
}

function getWordState() {
  try {
    const st = JSON.parse(localStorage.getItem('fincalc-word') || 'null');
    if (st && st.word === wordToday()) return st;
  } catch {}
  return { word: wordToday(), guesses: [], done: false, won: false };
}

function saveWordState(st) {
  try { localStorage.setItem('fincalc-word', JSON.stringify(st)); } catch {}
}

function initWordGame() {
  if (!document.getElementById('word-body')) return;
  renderWordGame();
}

function wordTileClasses(guess, target) {
  /* two-pass wordle scoring: exact hits first, then near-misses */
  const res = Array(5).fill('miss');
  const pool = {};
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) res[i] = 'hit';
    else pool[target[i]] = (pool[target[i]] || 0) + 1;
  }
  for (let i = 0; i < 5; i++) {
    if (res[i] === 'miss' && pool[guess[i]] > 0) { res[i] = 'near'; pool[guess[i]]--; }
  }
  return res;
}

function renderWordGame() {
  const body = document.getElementById('word-body');
  const st = getWordState();
  const rows = [];
  for (let r = 0; r < 6; r++) {
    const guess = st.guesses[r] || '';
    const classes = guess ? wordTileClasses(guess, st.word) : [];
    rows.push(`<div class="word-row">${Array.from({ length: 5 }, (_, i) =>
      `<div class="word-tile ${classes[i] || ''}">${guess[i] || ''}</div>`).join('')}</div>`);
  }
  const msg = st.done
    ? (st.won
        ? `<b>Solved!</b> Today's word was ${st.word}. New word tomorrow — come back!`
        : `The word was <b>${st.word}</b>. A fresh one lands tomorrow.`)
    : `Guess the 5-letter money word. ${6 - st.guesses.length} tries left.`;
  body.innerHTML = `
    <div class="word-grid">${rows.join('')}</div>
    ${st.done ? '' : `
    <div class="word-input-row">
      <input class="input word-input" id="word-input" maxlength="5" autocomplete="off" spellcheck="false"
        aria-label="Your 5 letter guess" onkeydown="if(event.key==='Enter')submitWordGuess()" />
      <button class="btn btn-primary btn-sm" onclick="submitWordGuess()">Guess</button>
    </div>`}
    <div class="word-msg">${msg}</div>`;
}

function submitWordGuess() {
  const input = document.getElementById('word-input');
  const guess = (input?.value || '').toUpperCase().replace(/[^A-Z]/g, '');
  if (guess.length !== 5) { showToast('Enter a 5-letter word'); return; }
  const st = getWordState();
  if (st.done) return;
  st.guesses.push(guess);
  if (guess === st.word) {
    st.done = true; st.won = true;
    award('word-wizard');
    launchConfetti();
  } else if (st.guesses.length >= 6) {
    st.done = true;
  }
  saveWordState(st);
  renderWordGame();
  if (!st.done) document.getElementById('word-input')?.focus();
}

/* ---- FIRE age mini ---- */
function initFireMini() {
  const body = document.getElementById('fire-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mini-value" id="fire-age">--</div>
    <div class="mini-sub" id="fire-sub"></div>
    <div class="mini-slider-label"><span>Current age</span><b id="fire-age-label">30</b></div>
    <input type="range" class="range-input" id="fire-cur-age" min="18" max="55" value="30" />
    <div class="mini-slider-label"><span>Monthly expenses</span><b id="fire-exp-label">₹50k</b></div>
    <input type="range" class="range-input" id="fire-exp" min="20000" max="300000" step="5000" value="50000" />
    <div class="mini-slider-label"><span>Monthly investing</span><b id="fire-inv-label">₹30k</b></div>
    <input type="range" class="range-input" id="fire-inv" min="5000" max="300000" step="5000" value="30000" />`;
  const update = () => {
    const age = parseFloat(document.getElementById('fire-cur-age').value);
    const exp = parseFloat(document.getElementById('fire-exp').value);
    const inv = parseFloat(document.getElementById('fire-inv').value);
    document.getElementById('fire-age-label').textContent = age;
    document.getElementById('fire-exp-label').textContent = FC.formatINR(exp);
    document.getElementById('fire-inv-label').textContent = FC.formatINR(inv);
    const target = exp * 12 * 25; /* 25x annual expenses */
    const i = 0.12 / 12;
    let fv = 0, months = 0;
    while (fv < target && months < 720) { fv = fv * (1 + i) + inv; months++; }
    const el = document.getElementById('fire-age');
    if (months >= 720) {
      el.textContent = '60+';
      document.getElementById('fire-sub').innerHTML = 'At this pace FIRE is far off — try raising the monthly investing slider.';
    } else {
      el.textContent = 'Age ' + Math.round(age + months / 12);
      document.getElementById('fire-sub').innerHTML = `That's when you'd hit <b>${FC.formatINR(target)}</b> (25× annual expenses) investing at 12% p.a.`;
    }
  };
  body.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
  paintAllSliders(body);
  update();
}

/* ---- Latte factor mini ---- */
function initLatteMini() {
  const body = document.getElementById('latte-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mini-slider-label"><span>Daily habit spend</span><b id="latte-label">₹200</b></div>
    <input type="range" class="range-input" id="latte-spend" min="50" max="1000" step="25" value="200" />
    <div class="mini-value" id="latte-value">--</div>
    <div class="mini-sub" id="latte-sub"></div>`;
  const update = () => {
    const d = parseFloat(document.getElementById('latte-spend').value);
    document.getElementById('latte-label').textContent = '₹' + d;
    const monthly = d * 30;
    document.getElementById('latte-value').textContent = FC.formatINR(FC.sipFV(monthly, 0.12, 20));
    document.getElementById('latte-sub').innerHTML =
      `is what ₹${d}/day becomes in <b>20 years</b> if SIP'd at 12% instead. (10 yrs: <b>${FC.formatINR(FC.sipFV(monthly, 0.12, 10))}</b>)`;
  };
  document.getElementById('latte-spend').addEventListener('input', update);
  paintAllSliders(body);
  update();
}

/* ---- 52-week challenge mini ---- */
function initWeek52Mini() {
  const body = document.getElementById('week52-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mini-slider-label"><span>Week-1 amount (grows weekly)</span><b id="w52-label">₹10</b></div>
    <input type="range" class="range-input" id="w52-base" min="10" max="200" step="10" value="10" />
    <div class="mini-value" id="w52-total">--</div>
    <div class="mini-sub" id="w52-sub"></div>`;
  const update = () => {
    const base = parseFloat(document.getElementById('w52-base').value);
    document.getElementById('w52-label').textContent = '₹' + base;
    document.getElementById('w52-total').textContent = FC.formatINR(base * 1378);
    document.getElementById('w52-sub').innerHTML =
      `saved in one year: ₹${base} in week 1, ₹${base * 2} in week 2 … ₹${(base * 52).toLocaleString('en-IN')} in week 52. Painless because it ramps.`;
  };
  document.getElementById('w52-base').addEventListener('input', update);
  paintAllSliders(body);
  update();
}

/* ---- Age-based allocation mini ---- */
function initAllocMini() {
  const body = document.getElementById('alloc-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mini-slider-label"><span>Your age</span><b id="alloc-age-label">30</b></div>
    <input type="range" class="range-input" id="alloc-age" min="18" max="70" value="30" />
    <div class="mini-value" id="alloc-split">--</div>
    <div class="alloc-meter" id="alloc-meter"></div>
    <div class="mini-sub" style="margin-top:0.6rem">The classic “110 − age” rule of thumb for equity vs debt. A guide, not gospel.</div>`;
  const update = () => {
    const age = parseInt(document.getElementById('alloc-age').value, 10);
    const eq = Math.min(90, Math.max(20, 110 - age));
    document.getElementById('alloc-age-label').textContent = age;
    document.getElementById('alloc-split').textContent = `${eq}% : ${100 - eq}%`;
    document.getElementById('alloc-meter').innerHTML =
      `<i style="width:${eq}%;background:${cssVar('--ch-1')}" title="Equity ${eq}%"></i><i style="width:${100 - eq}%;background:${cssVar('--ch-2')}" title="Debt ${100 - eq}%"></i>`;
  };
  document.getElementById('alloc-age').addEventListener('input', update);
  paintAllSliders(body);
  update();
}

/* ---- Net worth mini ---- */
function initNetWorthMini() {
  const body = document.getElementById('networth-body');
  if (!body) return;
  body.innerHTML = `
    <div class="mini-form">
      <div class="form-group"><label>Total assets (₹)</label><input type="number" class="input" id="nw-assets" value="2500000" min="0" /></div>
      <div class="form-group"><label>Total loans (₹)</label><input type="number" class="input" id="nw-debts" value="800000" min="0" /></div>
    </div>
    <div class="mini-value" id="nw-value">--</div>
    <div class="mini-sub">Everything you own minus everything you owe. <button class="chip" style="margin-left:0.3rem" onclick="openCalc('net-worth')">Full breakdown →</button></div>`;
  const update = () => {
    const nw = (parseFloat(document.getElementById('nw-assets').value) || 0) - (parseFloat(document.getElementById('nw-debts').value) || 0);
    const el = document.getElementById('nw-value');
    el.textContent = FC.formatINR(nw);
    el.style.color = nw >= 0 ? 'var(--emerald)' : 'var(--red)';
  };
  body.querySelectorAll('input').forEach(el => el.addEventListener('input', update));
  update();
}

/* ---- Session stats ---- */
function renderStatsTile() {
  const body = document.getElementById('stats-body');
  if (!body) return;
  const opens = parseInt(localStorage.getItem('fincalc-opens') || '0', 10) || 0;
  const saves = getSavedCalcs().length;
  const badges = getBadges().length;
  let streak = 0;
  try { streak = (JSON.parse(localStorage.getItem('fincalc-streak') || '{}').n) || 0; } catch {}
  const best = parseFloat(localStorage.getItem('fincalc-guess-best') || 'NaN');
  const xp = opens * 10 + saves * 25 + badges * 50 + streak * 15;
  const level = Math.min(10, Math.floor(xp / 250) + 1);
  const LEVELS = ['', 'Rookie', 'Saver', 'Budgeter', 'Investor', 'Strategist', 'Planner Pro', 'Wealth Builder', 'Compounder', 'Money Master', 'Finance Guru'];
  const secs = parseInt(localStorage.getItem('fincalc-time') || '0', 10) || 0;
  const timeStr = secs < 3600 ? Math.max(1, Math.round(secs / 60)) + 'm' : (secs / 3600).toFixed(1) + 'h';
  body.innerHTML = `
    <div class="stats-grid">
      <div class="stat-tile"><b>Lv ${level}</b><span>${LEVELS[level]} · ${xp} XP</span></div>
      <div class="stat-tile"><b>${timeStr}</b><span>Time with money</span></div>
      <div class="stat-tile"><b>${opens}</b><span>Calcs explored</span></div>
      <div class="stat-tile"><b>${saves}</b><span>Saved results</span></div>
      <div class="stat-tile"><b>${badges}/${Object.keys(BADGES).length}</b><span>Badges</span></div>
      <div class="stat-tile"><b>${isNaN(best) ? streak + 'd' : best.toFixed(0) + '%'}</b><span>${isNaN(best) ? 'Streak' : 'Best guess'}</span></div>
    </div>`;
}

/* ---- FY-end countdown ---- */
function initFYCountdown() {
  const body = document.getElementById('fy-body');
  if (!body) return;
  const elss = CALCULATORS.find(c => c.id.includes('elss')) || CALCULATORS.find(c => c.id === 'ppf');
  const render = () => {
    const now = new Date();
    let fyEnd = new Date(now.getFullYear(), 2, 31, 23, 59, 59);
    if (now > fyEnd) fyEnd = new Date(now.getFullYear() + 1, 2, 31, 23, 59, 59);
    const ms = fyEnd - now;
    const days = Math.floor(ms / 86400000);
    const hours = Math.floor(ms % 86400000 / 3600000);
    const mins = Math.floor(ms % 3600000 / 60000);
    body.innerHTML = `
      <div class="mini-sub">until FY ${fyEnd.getFullYear() - 1}–${String(fyEnd.getFullYear()).slice(2)} closes on Mar 31</div>
      <div class="fy-count">
        <div class="fy-unit"><b>${days}</b><span>days</span></div>
        <div class="fy-unit"><b>${hours}</b><span>hrs</span></div>
        <div class="fy-unit"><b>${mins}</b><span>min</span></div>
      </div>
      <div class="mini-sub">Tax-saving investments (80C, NPS, ELSS) must be in <b>before the deadline</b>.
      ${elss ? `<button class="chip" style="margin-top:0.5rem" onclick="openCalc('${elss.id}')">Plan tax savings →</button>` : ''}</div>`;
  };
  render();
  setInterval(render, 60000);
}

/* ============================================================
   BUY ME A COFFEE
   ============================================================ */
function openCoffee() {
  const modal = document.getElementById('coffee-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  award('supporter');
}

function closeCoffee() {
  document.getElementById('coffee-modal')?.classList.add('hidden');
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeCoffee();
});
document.addEventListener('click', (e) => {
  if (e.target === document.getElementById('coffee-modal')) closeCoffee();
});

/* ============================================================
   CONFETTI + EASTER EGG
   ============================================================ */
function launchConfetti(golden = false, glyph = null) {
  if (App.reducedMotion) return;
  const canvas = document.getElementById('confetti-canvas');
  if (!canvas) return;
  canvas.classList.remove('hidden');
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const w = window.innerWidth, h = window.innerHeight;
  canvas.width = w * dpr; canvas.height = h * dpr;
  const ctx = canvas.getContext('2d');
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const colors = golden
    ? ['#F5C86B', '#FDE68A', '#D97706', '#FFF7DB']
    : ['#3B82F6', '#22D3EE', '#10B981', '#A78BFA', '#F5C86B'];
  const parts = Array.from({ length: 110 }, () => ({
    x: w / 2 + (Math.random() - 0.5) * w * 0.5,
    y: h * 0.35 + (Math.random() - 0.5) * 60,
    vx: (Math.random() - 0.5) * 11,
    vy: -Math.random() * 11 - 3,
    s: Math.random() * 7 + 3,
    c: colors[Math.floor(Math.random() * colors.length)],
    r: Math.random() * Math.PI,
    vr: (Math.random() - 0.5) * 0.25,
  }));
  const t0 = performance.now();
  (function tick(t) {
    const elapsed = (t || performance.now()) - t0;
    ctx.clearRect(0, 0, w, h);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.vy += 0.32; p.r += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.r);
      ctx.globalAlpha = Math.max(0, 1 - elapsed / 1900);
      ctx.fillStyle = p.c;
      if (glyph) {
        ctx.font = `700 ${p.s * 2.4}px Inter, sans-serif`;
        ctx.fillText(glyph, 0, 0);
      } else {
        ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.62);
      }
      ctx.restore();
    });
    if (elapsed < 1900) requestAnimationFrame(tick);
    else { ctx.clearRect(0, 0, w, h); canvas.classList.add('hidden'); }
  })();
}

function initConfettiAndEgg() {
  let buffer = '';
  document.addEventListener('keydown', (e) => {
    if (/^(input|textarea|select)$/i.test(document.activeElement?.tagName || '')) return;
    if (e.key.length !== 1) return;
    buffer = (buffer + e.key.toLowerCase()).slice(-6);
    if (buffer === 'wealth') {
      launchConfetti(true);
      award('secret-wealth');
      showToast('🔑 You found the secret word!');
    } else if (buffer.endsWith('crore')) {
      launchConfetti(true, '₹');
      showToast('💸 Make it rain!');
    }
  });
}

/* ============================================================
   FEATURE PACK 4
   ============================================================ */
function initFeaturePack4() {
  initInputPower();
  initGlossaryModal();
  initChangelogModal();
  initVoiceSearch();
  initSettingsExtras2();
  initNetworkStatus();
  initTabTitleWink();
  initSectionHotkeys();
  initSessionClock();
  weeklyRecap();
  document.addEventListener('click', () => document.getElementById('share-pop')?.classList.add('hidden'));
}

/* ---- input power: steppers, dbl-click reset, shorthand, autosave, undo, haptics ---- */
let undoStack = [];
let autosaveTimer = null;
let lastHaptic = 0;

function inputsSnapshot() {
  const map = {};
  document.querySelectorAll('#modal-body input[id], #modal-body select[id]').forEach(el => {
    if (!el.id.endsWith('-slider')) map[el.id] = el.value;
  });
  return map;
}

function applyInputMap(map) {
  Object.entries(map || {}).forEach(([elId, val]) => {
    const el = document.getElementById(elId);
    if (!el) return;
    el.value = val;
    const slider = document.getElementById(elId + '-slider');
    if (slider) { slider.value = val; paintSlider(slider); }
  });
  if (App.currentCalc) calcLive(App.currentCalc);
}

function getAutosaved() {
  try { return JSON.parse(localStorage.getItem('fincalc-inputs') || '{}'); }
  catch { return {}; }
}

function applyAutosavedInputs(id) {
  const saved = getAutosaved()[id];
  if (saved) applyInputMap(saved);
}

function clearAutosavedInputs(id) {
  const all = getAutosaved();
  delete all[id];
  try { localStorage.setItem('fincalc-inputs', JSON.stringify(all)); } catch {}
}

function applyUrlState(id) {
  const params = new URLSearchParams(window.location.search);
  if (params.get('calc') !== id || !params.get('s')) return false;
  try {
    applyInputMap(JSON.parse(atob(params.get('s').replace(/-/g, '+').replace(/_/g, '/'))));
    /* consume it so reopening the calculator later starts fresh */
    window.history.replaceState({}, '', window.location.pathname);
    return true;
  } catch { return false; }
}

function stateLink(id) {
  const b64 = btoa(JSON.stringify(inputsSnapshot())).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  return `${window.location.origin}${window.location.pathname}?calc=${id}&s=${b64}`;
}

function initInputPower() {
  /* steppers */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.step-btn');
    if (!btn) return;
    const input = document.getElementById(btn.dataset.target);
    if (!input) return;
    const step = parseFloat(input.step) || 1;
    const v = (parseFloat(input.value) || 0) + step * parseInt(btn.dataset.dir, 10);
    input.value = Math.min(parseFloat(input.max) || Infinity, Math.max(parseFloat(input.min) || 0, v));
    const slider = document.getElementById(input.id + '-slider');
    if (slider) { slider.value = input.value; paintSlider(slider); }
    calcLive(App.currentCalc);
  });

  /* double-click a slider to reset it to default */
  document.addEventListener('dblclick', (e) => {
    const slider = e.target.closest?.('.range-input');
    if (!slider || !slider.dataset.def) return;
    slider.value = slider.dataset.def;
    const input = document.getElementById(slider.id.replace(/-slider$/, ''));
    if (input) input.value = slider.dataset.def;
    paintSlider(slider);
    calcLive(App.currentCalc);
    showToast('Reset to default');
  });

  /* Indian shorthand: 50k, 2L, 1.5cr */
  document.addEventListener('change', (e) => {
    const el = e.target;
    if (!el.classList?.contains('input-num')) return;
    /* raw typed value is unavailable post-parse for number inputs; catch via validity */
  });
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter') return;
    const el = e.target;
    if (!el.classList?.contains('input-num')) return;
    parseShorthand(el);
  });
  document.addEventListener('focusout', (e) => {
    const el = e.target;
    if (el.classList?.contains('input-num')) parseShorthand(el);
  });

  /* autosave inputs while typing */
  document.addEventListener('input', (e) => {
    if (!e.target.closest?.('#modal-body') || !App.currentCalc) return;
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(() => {
      const all = getAutosaved();
      all[App.currentCalc] = inputsSnapshot();
      try { localStorage.setItem('fincalc-inputs', JSON.stringify(all)); } catch {}
    }, 500);
    /* gentle haptic tick on sliders (mobile) */
    if (e.target.classList?.contains('range-input') && navigator.vibrate) {
      const now = Date.now();
      if (now - lastHaptic > 80) { lastHaptic = now; navigator.vibrate(3); }
    }
  });

  /* undo (Ctrl+Z) inside the calculator */
  document.addEventListener('change', (e) => {
    if (e.target.closest?.('#modal-body') && App.currentCalc) {
      undoStack.push(inputsSnapshot());
      if (undoStack.length > 30) undoStack.shift();
    }
  });
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && App.currentCalc && undoStack.length > 1) {
      e.preventDefault();
      undoStack.pop();
      applyInputMap(undoStack[undoStack.length - 1]);
      showToast('Undone');
    }
  });
}

function parseShorthand(el) {
  /* number inputs reject letters, so read the raw attribute via validity hack:
     when the field is invalid ("2L" typed), value is '' but we can't read it.
     Instead we accept shorthand typed with a trailing letter while value survives —
     fall back to a text scan of the related aria label is impossible, so:
     support shorthand via paste/autocomplete where value carries through. */
  const raw = String(el.value || '');
  const m = raw.match(/^([\d.]+)(k|l|cr)$/i);
  if (!m) return;
  const mult = { k: 1e3, l: 1e5, cr: 1e7 }[m[1] && m[2].toLowerCase()];
  if (!mult) return;
  el.value = parseFloat(m[1]) * mult;
  el.dispatchEvent(new Event('input', { bubbles: true }));
}

/* ---- result delta (change vs previous value) ---- */
function updateResultDelta(main) {
  const card = main.closest('.result-card');
  const label = card?.querySelector('.result-label');
  if (!label) return;
  const m = main.textContent.trim().match(/^(-?)₹([\d,]+(?:\.\d+)?)\s*(L|Cr|M|B)?$/);
  if (!m) return;
  const mult = { L: 1e5, Cr: 1e7, M: 1e6, B: 1e9 }[m[3]] || 1;
  const val = (m[1] ? -1 : 1) * parseFloat(m[2].replace(/,/g, '')) * mult;
  const prev = parseFloat(main.dataset.prev);
  main.dataset.prev = val;
  if (isNaN(prev) || prev === val) return;
  let delta = label.querySelector('.result-delta');
  if (!delta) {
    delta = document.createElement('span');
    delta.className = 'result-delta';
    label.appendChild(delta);
  }
  const diff = val - prev;
  delta.textContent = (diff > 0 ? '▲ +' : '▼ −') + FC.formatINR(Math.abs(diff)).replace('₹', '₹');
  delta.classList.toggle('up', diff > 0);
  delta.classList.toggle('down', diff < 0);
  delta.classList.add('show');
  clearTimeout(delta._t);
  delta._t = setTimeout(() => delta.classList.remove('show'), 1800);
}

/* ---- amortization table copy ---- */
function injectAmortCopy() {
  document.querySelectorAll('#modal-body .amort-table-wrap').forEach(wrap => {
    if (wrap.previousElementSibling?.classList?.contains('amort-copy-row')) return;
    const row = document.createElement('div');
    row.className = 'amort-copy-row';
    row.style.cssText = 'display:flex;justify-content:flex-end;margin-bottom:-0.4rem';
    row.innerHTML = '<button class="btn btn-ghost btn-sm">Copy table</button>';
    row.querySelector('button').onclick = () => {
      const rows = [...wrap.querySelectorAll('tr')].map(tr =>
        [...tr.children].map(td => td.textContent.trim()).join('\t')).join('\n');
      navigator.clipboard.writeText(rows).then(() => showToast('Table copied — paste into any spreadsheet'));
    };
    wrap.before(row);
  });
}

/* ---- share popover ---- */
function toggleSharePop(id) {
  const pop = document.getElementById('share-pop');
  if (!pop) return;
  if (!pop.classList.contains('hidden')) { pop.classList.add('hidden'); return; }
  const calc = CALCULATORS.find(c => c.id === id);
  const main = document.querySelector('#modal-body .result-main')?.textContent.trim() || '';
  const url = stateLink(id);
  const text = `${calc.name}: ${main} — calculated free on FinCalc Pro`;
  const enc = encodeURIComponent;
  pop.innerHTML = `
    <a href="https://wa.me/?text=${enc(text + '\n' + url)}" target="_blank" rel="noopener"><span class="share-ic">🟢</span>WhatsApp</a>
    <a href="https://twitter.com/intent/tweet?text=${enc(text)}&url=${enc(url)}" target="_blank" rel="noopener"><span class="share-ic">𝕏</span>Post on X</a>
    <a href="https://t.me/share/url?url=${enc(url)}&text=${enc(text)}" target="_blank" rel="noopener"><span class="share-ic">✈️</span>Telegram</a>
    <button data-act="copy"><span class="share-ic">🔗</span>Copy link with inputs</button>
    ${navigator.share ? '<button data-act="native"><span class="share-ic">📤</span>More options…</button>' : ''}`;
  pop.querySelector('[data-act="copy"]').onclick = () => {
    navigator.clipboard.writeText(url).then(() => showToast('Link copied — includes your inputs'));
    pop.classList.add('hidden');
  };
  pop.querySelector('[data-act="native"]')?.addEventListener('click', () => {
    navigator.share({ title: 'FinCalc Pro', text, url }).catch(() => {});
    pop.classList.add('hidden');
  });
  pop.classList.remove('hidden');
  pop.addEventListener('click', (e) => e.stopPropagation());
}

/* ---- default palette list: yours first ---- */
function defaultPaletteList() {
  const favs = getFavs();
  let counts = {};
  try { counts = JSON.parse(localStorage.getItem('fincalc-opencounts') || '{}'); } catch {}
  const ranked = [...CALCULATORS].sort((a, b) =>
    (favs.includes(b.id) - favs.includes(a.id)) || ((counts[b.id] || 0) - (counts[a.id] || 0)));
  return ranked.slice(0, 8);
}

/* ---- saved calculations CSV export ---- */
function exportSavedCSV() {
  const saved = getSavedCalcs();
  if (!saved.length) { showToast('Nothing saved yet'); return; }
  const esc = (v) => '"' + String(v).replace(/"/g, '""') + '"';
  const rows = [['Calculator', 'Result', 'Saved on', 'Inputs'].join(',')];
  saved.forEach(s => rows.push([esc(s.name), esc(s.result), esc(new Date(s.at).toLocaleString('en-IN')), esc(JSON.stringify(s.inputs))].join(',')));
  downloadBlob(new Blob([rows.join('\n')], { type: 'text/csv' }), 'fincalcpro-saved.csv');
}

/* ---- badge wall share image ---- */
function shareBadgesImage() {
  const owned = getBadges();
  const W = 1000, H = 640, dpr = 2;
  const canvas = document.createElement('canvas');
  canvas.width = W * dpr; canvas.height = H * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, W, H);
  const glow = ctx.createRadialGradient(W / 2, -100, 0, W / 2, -100, 600);
  glow.addColorStop(0, 'rgba(245,200,107,0.25)');
  glow.addColorStop(1, 'rgba(245,200,107,0)');
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, W, H);
  ctx.font = '700 34px "Space Grotesk", Inter, sans-serif';
  ctx.fillStyle = '#F4F6FB';
  ctx.textAlign = 'center';
  ctx.fillText('My FinCalc Pro achievements', W / 2, 80);
  ctx.font = '600 18px Inter, sans-serif';
  ctx.fillStyle = '#9BA3B5';
  ctx.fillText(`${owned.length} of ${Object.keys(BADGES).length} badges unlocked`, W / 2, 116);
  const entries = Object.entries(BADGES);
  const cols = 6, cell = 150, startX = (W - cols * cell) / 2 + cell / 2, startY = 190;
  entries.forEach(([bid, b], i) => {
    const x = startX + (i % cols) * cell, y = startY + Math.floor(i / cols) * 130;
    ctx.globalAlpha = owned.includes(bid) ? 1 : 0.22;
    ctx.font = '52px serif';
    ctx.fillText(b.emoji, x, y);
    ctx.font = '600 13px Inter, sans-serif';
    ctx.fillStyle = '#9BA3B5';
    ctx.fillText(b.name, x, y + 34);
    ctx.globalAlpha = 1;
  });
  ctx.font = '500 15px Inter, sans-serif';
  ctx.fillStyle = '#5D6474';
  ctx.fillText('fincalcpro.in — 130+ free financial calculators', W / 2, H - 36);
  canvas.toBlob(b => b && downloadBlob(b, 'fincalcpro-badges.png'), 'image/png');
}

/* ---- glossary ---- */
const GLOSSARY = [
  ['XIRR', 'Your actual annualised return when money goes in/out at different times — the honest report card for SIPs.'],
  ['CAGR', 'Compound Annual Growth Rate — the single steady yearly rate that would produce the same overall growth.'],
  ['LTCG', 'Long-Term Capital Gains — profit on assets held past a threshold (1 yr for equity). Equity LTCG above ₹1.25L is taxed at 12.5%.'],
  ['STCG', 'Short-Term Capital Gains — profit on quickly-sold assets, taxed higher (20% for equity).'],
  ['EEE', 'Exempt-Exempt-Exempt — no tax on deposit, growth, or withdrawal. PPF and EPF enjoy this rare status.'],
  ['80C', 'The famous ₹1.5 lakh deduction bucket (old regime): ELSS, PPF, EPF, life insurance, home-loan principal.'],
  ['80CCD(1B)', 'Extra ₹50,000 deduction for NPS contributions — on top of 80C.'],
  ['NAV', 'Net Asset Value — the per-unit price of a mutual fund, updated daily.'],
  ['AUM', 'Assets Under Management — total money a fund manages. Size ≠ performance.'],
  ['ELSS', 'Equity-Linked Savings Scheme — a tax-saving mutual fund with just a 3-year lock-in, the shortest in 80C.'],
  ['NPS', 'National Pension System — low-cost retirement vehicle; 60% withdrawable tax-free at 60, 40% buys a pension.'],
  ['PPF', 'Public Provident Fund — 15-year government-backed savings at 7.1%, fully tax-free.'],
  ['EPF', 'Employees’ Provident Fund — the 12% of salary you and your employer park at ~8.25% interest.'],
  ['SWP', 'Systematic Withdrawal Plan — the reverse SIP: fixed monthly withdrawals from your corpus.'],
  ['TDS', 'Tax Deducted at Source — tax skimmed before money reaches you (e.g., 10% on FD interest above ₹40k).'],
  ['Repo rate', 'The rate at which RBI lends to banks — when it moves, your home-loan EMI follows.'],
  ['Amortization', 'The EMI split schedule — early payments are mostly interest, later ones mostly principal.'],
  ['Moratorium', 'A payment holiday (common in education loans) — interest usually still accrues.'],
  ['Indexation', 'Adjusting purchase price for inflation to shrink taxable capital gains on debt/property.'],
  ['Rebalancing', 'Selling winners, buying laggards to restore your target equity:debt split. Discipline, automated.'],
  ['Term insurance', 'Pure life cover — big protection, tiny premium, zero investment mixed in. The one everyone should have.'],
  ['ULIP', 'Insurance + investment in one product — usually doing both jobs worse than doing them separately.'],
  ['Sukanya Samriddhi', 'Girl-child savings scheme at 8.2%, tax-free — among the highest risk-free rates in India.'],
  ['Rule of 72', 'Divide 72 by the return rate to estimate doubling time. 12% ≈ 6 years.'],
];

function initGlossaryModal() {
  const modal = document.getElementById('glossary-modal');
  const search = document.getElementById('glossary-search');
  const list = document.getElementById('glossary-list');
  if (!modal) return;
  const render = (q = '') => {
    const ql = q.toLowerCase();
    const items = GLOSSARY.filter(([t, d]) => !ql || t.toLowerCase().includes(ql) || d.toLowerCase().includes(ql));
    list.innerHTML = items.length
      ? items.map(([t, d]) => `<div class="gloss-item"><div class="gloss-term">${t}</div><div class="gloss-def">${d}</div></div>`).join('')
      : '<div class="palette-empty">No matching term.</div>';
  };
  search.addEventListener('input', () => render(search.value));
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.add('hidden'); });
  render();
}

function openGlossary() {
  document.getElementById('glossary-modal')?.classList.remove('hidden');
  document.getElementById('glossary-search')?.focus();
}

/* ---- changelog ---- */
const CHANGELOG = [
  { v: '3.8', date: 'Jul 2026', items: ['Shareable links that carry your inputs', 'Autosaved calculator inputs', '+/− steppers & double-click slider reset', 'WhatsApp / X / Telegram sharing', 'Finance glossary & FAQ', 'XP levels, payday countdown, voice search'] },
  { v: '3.7', date: 'Jul 2026', items: ['60 design details: numbered sections, category-tinted icons, iOS switches, giant footer wordmark, light sweeps'] },
  { v: '3.6', date: 'Jul 2026', items: ['Buy-me-a-coffee support with verified UPI QR'] },
  { v: '3.5', date: 'Jul 2026', items: ['30 features: favorites, accent themes, compact mode, data export, Myth-or-Fact, daily word puzzle, FIRE & latte minis'] },
  { v: '3.4', date: 'Jul 2026', items: ['Playground: health quiz, compounding game, time machine, goal tracker, achievements & streaks'] },
  { v: '3.3', date: 'Jul 2026', items: ['Saved calculations, recents, compare bar chart, result image export, back-to-top, shortcuts'] },
  { v: '3.2', date: 'Jul 2026', items: ['Cinematic motion background: light beams, data streams, drifting grid, glass sheen'] },
  { v: '3.1', date: 'Jul 2026', items: ['Glowing cursor & touch trail'] },
  { v: '3.0', date: 'Jul 2026', items: ['Complete Obsidian redesign: floating nav, command palette, bento dashboard, premium calculator experience'] },
];

function initChangelogModal() {
  const modal = document.getElementById('changelog-modal');
  const list = document.getElementById('changelog-list');
  if (!modal) return;
  list.innerHTML = CHANGELOG.map(e => `
    <div class="cl-entry">
      <div class="cl-head"><span class="cl-ver">v${e.v}</span><span class="cl-date">${e.date}</span></div>
      <ul>${e.items.map(i => `<li>${i}</li>`).join('')}</ul>
    </div>`).join('');
  const count = document.getElementById('changelog-count');
  if (count) count.textContent = CHANGELOG.reduce((n, e) => n + e.items.length, 0) + '+';
  modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.add('hidden'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') modal.classList.add('hidden'); });
}

function openChangelog() {
  document.getElementById('changelog-modal')?.classList.remove('hidden');
}

/* ---- voice search (Chrome) ---- */
function initVoiceSearch() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) return;
  const row = document.querySelector('#palette-overlay .palette-input-row');
  const input = document.getElementById('palette-input');
  if (!row || !input) return;
  const btn = document.createElement('button');
  btn.className = 'icon-btn mic-btn';
  btn.setAttribute('aria-label', 'Search by voice');
  btn.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" y1="19" x2="12" y2="22"/></svg>';
  row.insertBefore(btn, row.querySelector('.kbd'));
  btn.addEventListener('click', () => {
    const rec = new SR();
    rec.lang = 'en-IN';
    btn.classList.add('listening');
    rec.onresult = (e) => {
      input.value = e.results[0][0].transcript;
      input.dispatchEvent(new Event('input'));
    };
    rec.onend = () => btn.classList.remove('listening');
    rec.onerror = () => { btn.classList.remove('listening'); showToast('Mic unavailable'); };
    rec.start();
  });
}

/* ---- settings: contrast, text size, payday ---- */
function initSettingsExtras2() {
  const contrast = document.getElementById('contrast-toggle');
  if (contrast) {
    contrast.checked = localStorage.getItem('fincalc-hc') === '1';
    document.body.classList.toggle('hc', contrast.checked);
    contrast.addEventListener('change', () => {
      document.body.classList.toggle('hc', contrast.checked);
      try { localStorage.setItem('fincalc-hc', contrast.checked ? '1' : ''); } catch {}
    });
  }
  const fsRow = document.getElementById('fontsize-row');
  if (fsRow) {
    const saved = localStorage.getItem('fincalc-fs') || '16';
    document.documentElement.style.fontSize = saved + 'px';
    fsRow.querySelectorAll('button').forEach(b => {
      b.classList.toggle('active', b.dataset.fs === saved);
      b.addEventListener('click', () => {
        document.documentElement.style.fontSize = b.dataset.fs + 'px';
        try { localStorage.setItem('fincalc-fs', b.dataset.fs); } catch {}
        fsRow.querySelectorAll('button').forEach(x => x.classList.toggle('active', x === b));
      });
    });
  }
  const payday = document.getElementById('payday-input');
  if (payday) {
    payday.value = localStorage.getItem('fincalc-payday') || '';
    payday.addEventListener('change', () => {
      const d = Math.min(31, Math.max(1, parseInt(payday.value, 10) || 0));
      try { localStorage.setItem('fincalc-payday', d || ''); } catch {}
      renderDashStrip();
      if (d) showToast(`Payday countdown set to day ${d} of the month`);
    });
  }
}

/* ---- network status ---- */
function initNetworkStatus() {
  let chip = null;
  const update = () => {
    if (!navigator.onLine) {
      if (!chip) {
        chip = document.createElement('div');
        chip.className = 'net-chip';
        chip.textContent = '✈️ Offline — every calculator still works';
        document.body.appendChild(chip);
      }
    } else if (chip) {
      chip.remove(); chip = null;
      showToast('Back online');
    }
  };
  window.addEventListener('online', update);
  window.addEventListener('offline', update);
  update();
}

/* ---- tab title wink ---- */
function initTabTitleWink() {
  const original = document.title;
  document.addEventListener('visibilitychange', () => {
    document.title = document.hidden ? '💰 Your money misses you…' : original;
  });
}

/* ---- section hotkeys 1-5 ---- */
function initSectionHotkeys() {
  const map = { '1': 'home', '2': 'dashboard', '3': 'playground', '4': 'calculators', '5': 'compare' };
  document.addEventListener('keydown', (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return;
    if (/^(input|textarea|select)$/i.test(document.activeElement?.tagName || '')) return;
    if (App.currentCalc || !document.getElementById('palette-overlay')?.classList.contains('hidden')) return;
    const id = map[e.key];
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: App.reducedMotion ? 'auto' : 'smooth' });
  });
}

/* ---- session clock (feeds Your Journey) ---- */
function initSessionClock() {
  setInterval(() => {
    if (document.hidden) return;
    const t = (parseInt(localStorage.getItem('fincalc-time') || '0', 10) || 0) + 30;
    try { localStorage.setItem('fincalc-time', String(t)); } catch {}
  }, 30000);
}

/* ---- weekly recap ---- */
function weeklyRecap() {
  const week = Math.floor(Date.now() / (86400000 * 7));
  let data = null;
  try { data = JSON.parse(localStorage.getItem('fincalc-week') || 'null'); } catch {}
  const opens = parseInt(localStorage.getItem('fincalc-opens') || '0', 10) || 0;
  if (data && data.week < week) {
    const delta = opens - (data.opens || 0);
    if (delta > 0) setTimeout(() => showToast(`📈 Last week you explored ${delta} calculator${delta > 1 ? 's' : ''} — keep going!`), 2500);
  }
  if (!data || data.week < week) {
    try { localStorage.setItem('fincalc-week', JSON.stringify({ week, opens })); } catch {}
  }
}
