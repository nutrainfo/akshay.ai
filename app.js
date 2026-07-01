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
  initSettings();
  initCookieBanner();
  initHeader();
  renderCalcGrid();
  initCalcFilters();
  initCompare();
  initRevealAnimations();
  initHeroCanvas();
});

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
    dmToggle.checked = true;
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

/* ---- Header: sticky compact + mobile menu ---- */
function initHeader() {
  const header = document.getElementById('header');
  const toggle = document.getElementById('menu-toggle');
  const nav = document.getElementById('main-nav');

  window.addEventListener('scroll', () => {
    header.style.borderBottomColor = window.scrollY > 40 ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.06)';
  }, { passive: true });

  toggle?.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });

  document.addEventListener('click', (e) => {
    if (!header.contains(e.target)) nav.classList.remove('open');
  });

  /* highlight active nav on scroll */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        const link = document.querySelector(`.nav-link[href="#${e.target.id}"]`);
        link?.classList.add('active');
      }
    });
  }, { threshold: 0.4 });
  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   CALCULATOR GRID
   ============================================================ */
function renderCalcGrid(filter = 'all', search = '') {
  const grid = document.getElementById('calc-grid');
  if (!grid) return;
  const filtered = CALCULATORS.filter(c =>
    (filter === 'all' || c.cat === filter) &&
    (c.name.toLowerCase().includes(search) || c.desc.toLowerCase().includes(search))
  );
  grid.innerHTML = filtered.map(c => `
    <div class="calc-card reveal" role="listitem" tabindex="0" data-cat="${c.cat}"
         onclick="openCalc('${c.id}')" onkeydown="if(event.key==='Enter')openCalc('${c.id}')"
         aria-label="${c.name}">
      <div class="calc-icon">${getIcon(c.id)}</div>
      <span class="calc-tag tag-${c.cat}">${c.cat}</span>
      <h3>${c.name}</h3>
      <p>${c.desc}</p>
    </div>
  `).join('');
  observeReveal();
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
  const firstInput = body.querySelector('input, select');
  firstInput?.focus();
  calcLive(id);

  document.getElementById('modal-close').onclick = closeModal;
  document.getElementById('modal-export-csv').onclick = () => exportCSV(id);
  document.getElementById('modal-share').onclick = () => shareCalc(id);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', modalEscHandler);
}

function closeModal() {
  const modal = document.getElementById('calc-modal');
  modal.classList.add('hidden');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', modalEscHandler);
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
    </div>
    <div class="calc-output">
      <div class="result-card"><div class="result-label">Corpus Lasts For</div><div class="result-main" id="swp-duration">-- months</div>
        <div class="result-grid">
          <div class="result-item"><div class="result-item-val" id="swp-total-withdrawn">--</div><div class="result-item-label">Total Withdrawn</div></div>
          <div class="result-item"><div class="result-item-val" id="swp-last-corpus">--</div><div class="result-item-label">Remaining Corpus</div></div>
        </div>
      </div>
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
      <input type="range" class="range-input" id="${id}-slider" min="${min}" max="${max}" step="${step}" value="${defaultVal}"
        oninput="document.getElementById('${id}').value=this.value;calcLive(App.currentCalc)" aria-label="${label} slider" />
      <input type="number" class="input input-num" id="${id}" value="${defaultVal}" min="${min}" max="${max}" step="${step}"
        oninput="document.getElementById('${id}-slider').value=this.value;calcLive(App.currentCalc)" aria-label="${label}" />
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
      const corpus = get('swp-corpus',1000000), withdrawal = get('swp-withdrawal',10000), rate = get('swp-rate',8)/100;
      const months = FC.swpLongevity(corpus, withdrawal, rate);
      set('swp-duration', months === Infinity ? 'Forever (sustainable)' : `${months} months (${(months/12).toFixed(1)} yrs)`);
      set('swp-total-withdrawn', months === Infinity ? '∞' : fmt(withdrawal * months));
      set('swp-last-corpus', months === Infinity ? fmt(corpus) : '₹0');
      set('swp-explain', months === Infinity
        ? `At ${(rate*100).toFixed(1)}% p.a., your ${fmt(corpus)} corpus earns enough to sustain ${fmt(withdrawal)}/month withdrawals indefinitely.`
        : `Your corpus of ${fmt(corpus)} will support ${fmt(withdrawal)}/month withdrawals for about ${(months/12).toFixed(1)} years.`);
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
function drawGrowthChart(canvasId, fvFn, years, invested, label) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth || 380, h = canvas.offsetHeight || 160;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const points = [];
  for (let yr = 0; yr <= years; yr++) { points.push({ yr, fv: fvFn(yr), inv: invested / years * yr }); }
  const maxVal = Math.max(...points.map(p => p.fv));
  const toX = (yr) => (yr / years) * (w - 40) + 20;
  const toY = (val) => h - 20 - (val / maxVal) * (h - 30);

  /* gradient area for fv */
  const grad = ctx.createLinearGradient(0, 0, 0, h);
  grad.addColorStop(0, 'rgba(99,102,241,0.3)');
  grad.addColorStop(1, 'rgba(99,102,241,0)');
  ctx.beginPath();
  ctx.moveTo(toX(0), h - 20);
  points.forEach(p => ctx.lineTo(toX(p.yr), toY(p.fv)));
  ctx.lineTo(toX(years), h - 20);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  /* fv line */
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.yr), toY(p.fv)) : ctx.lineTo(toX(p.yr), toY(p.fv)));
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2.5;
  ctx.stroke();

  /* invested line */
  ctx.beginPath();
  points.forEach((p, i) => i === 0 ? ctx.moveTo(toX(p.yr), toY(p.inv)) : ctx.lineTo(toX(p.yr), toY(p.inv)));
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([4, 4]);
  ctx.stroke();
  ctx.setLineDash([]);

  /* legend */
  ctx.font = '10px Inter, sans-serif';
  ctx.fillStyle = '#6366f1';
  ctx.fillText(label, 24, 16);
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillText('Invested', 24, 30);
}

function drawCompareChart(canvasId, fn1, fn2, years, label1, label2) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth || 380, h = 160;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const pts1 = Array.from({length: years+1}, (_,i) => fn1(i));
  const pts2 = Array.from({length: years+1}, (_,i) => fn2(i));
  const maxVal = Math.max(...pts1, ...pts2);
  const toX = (yr) => (yr / years) * (w - 40) + 20;
  const toY = (val) => h - 20 - (val / maxVal) * (h - 30);

  [['#6366f1', pts1, label1], ['#10b981', pts2, label2]].forEach(([color, pts, lbl], li) => {
    ctx.beginPath();
    pts.forEach((v, i) => i === 0 ? ctx.moveTo(toX(i), toY(v)) : ctx.lineTo(toX(i), toY(v)));
    ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.stroke();
    ctx.font = '10px Inter'; ctx.fillStyle = color;
    ctx.fillText(lbl, 24, 16 + li * 14);
  });
}

function drawAmortChart(canvasId, schedule) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.offsetWidth || 380, h = 160;
  canvas.width = w; canvas.height = h;
  ctx.clearRect(0, 0, w, h);

  const step = Math.max(1, Math.floor(schedule.length / 30));
  const sampled = schedule.filter((_, i) => i % step === 0);
  const barW = (w - 40) / sampled.length;
  const maxEMI = sampled[0]?.emi || 1;

  sampled.forEach((r, i) => {
    const x = 20 + i * barW;
    const principalH = (r.principalPaid / maxEMI) * (h - 30);
    const interestH = (r.interest / maxEMI) * (h - 30);
    ctx.fillStyle = '#6366f1';
    ctx.fillRect(x, h - 20 - principalH - interestH, barW - 2, interestH);
    ctx.fillStyle = '#10b981';
    ctx.fillRect(x, h - 20 - principalH, barW - 2, principalH);
  });

  ctx.font = '9px Inter'; ctx.fillStyle = '#6366f1'; ctx.fillText('Interest', 24, 14);
  ctx.fillStyle = '#10b981'; ctx.fillText('Principal', 24, 26);
}

/* ============================================================
   EXPORT / SHARE
   ============================================================ */
function exportCSV(calcId) {
  const data = getCalcExportData(calcId);
  if (!data) { alert('No data to export for this calculator yet.'); return; }
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
    navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!'));
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
    ctx.strokeStyle = 'rgba(99,102,241,0.06)';
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
      ctx.fillStyle = `rgba(139,92,246,${p.alpha})`;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(99,102,241,${0.08 * (1 - dist / 120)})`;
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
