/* FinCalc Pro — PWA
   Button is always visible. Behaviour depends on platform:
   - Chrome/Edge/Android: native beforeinstallprompt → one-tap install
   - iOS Safari:          show "Share → Add to Home Screen" instructions
   - Firefox/other:       show generic instructions modal
   - Already installed (standalone): button hidden via CSS media query
*/

const PWA = (() => {
  let deferredPrompt = null;
  let toastTimer     = null;

  const installBtn   = document.getElementById('pwa-install-btn');
  const toast        = document.getElementById('pwa-toast');
  const toastInstall = document.getElementById('pwa-toast-install');
  const toastDismiss = document.getElementById('pwa-toast-dismiss');
  const successBadge = document.getElementById('pwa-success');
  const instModal    = document.getElementById('pwa-instructions-modal');
  const instBody     = document.getElementById('pwa-inst-body');

  /* ---- Platform detection ---- */
  const ua         = navigator.userAgent;
  const isIOS      = /iphone|ipad|ipod/i.test(ua) && !window.MSStream;
  const isSafari   = /^((?!chrome|android).)*safari/i.test(ua);
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches
                    || navigator.standalone === true;

  /* ---- If already installed as standalone, keep button hidden (CSS handles it) ---- */
  if (isStandalone) return;

  /* ---- Service Worker registration ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        reg.addEventListener('updatefound', () => {
          const nw = reg.installing;
          nw?.addEventListener('statechange', () => {
            if (nw.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner();
            }
          });
        });
      }).catch((err) => console.warn('SW registration failed:', err));
    });
  }

  /* ---- Capture native install prompt (Chrome / Edge / Android) ---- */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    /* Upgrade button visual to show native install is available */
    installBtn?.classList.add('pwa-native-ready');

    /* Auto-show toast once per session (skip if dismissed within 7 days) */
    const dismissed = localStorage.getItem('pwaToastDismissed');
    if (!dismissed || Date.now() - Number(dismissed) > 7 * 86400000) {
      toastTimer = setTimeout(showToast, 4000);
    }
  });

  /* ---- App installed ---- */
  window.addEventListener('appinstalled', () => {
    hideToast();
    deferredPrompt = null;
    showSuccess();
    localStorage.setItem('pwaInstalled', '1');
    /* Button hidden by CSS @media standalone once reopened */
  });

  /* ---- Install button click ---- */
  installBtn?.addEventListener('click', handleInstallClick);
  toastInstall?.addEventListener('click', handleInstallClick);
  toastDismiss?.addEventListener('click', () => {
    hideToast();
    localStorage.setItem('pwaToastDismissed', String(Date.now()));
  });

  async function handleInstallClick() {
    if (deferredPrompt) {
      /* Native Chrome/Edge/Android install */
      hideToast();
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        deferredPrompt = null;
        installBtn?.classList.remove('pwa-native-ready');
      }
    } else {
      /* Fallback: show platform-specific instructions */
      hideToast();
      showInstructionsModal();
    }
  }

  /* ---- Instructions modal ---- */
  function showInstructionsModal() {
    if (!instModal || !instBody) return;

    if (isIOS && isSafari) {
      instBody.innerHTML = `
        <div class="pwa-inst-steps">
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">1</div>
            <div>
              <strong>Tap the Share button</strong>
              <p>Find the <span class="pwa-inline-icon">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
              </span> Share icon in the Safari toolbar at the bottom of the screen.</p>
            </div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">2</div>
            <div>
              <strong>Tap "Add to Home Screen"</strong>
              <p>Scroll down in the share sheet and tap <em>Add to Home Screen</em>.</p>
            </div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">3</div>
            <div>
              <strong>Tap "Add"</strong>
              <p>Confirm the name and tap <em>Add</em> in the top-right corner. FinCalc Pro will appear on your home screen.</p>
            </div>
          </div>
        </div>
        <p class="pwa-inst-note">Works on iPhone, iPad and iPod Touch with iOS 14+.</p>`;
    } else if (/android/i.test(ua)) {
      instBody.innerHTML = `
        <div class="pwa-inst-steps">
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">1</div>
            <div><strong>Open in Chrome</strong><p>For the best experience, open this page in <strong>Google Chrome</strong> on Android.</p></div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">2</div>
            <div><strong>Tap the menu (⋮)</strong><p>Tap the three-dot menu in the top-right corner of Chrome.</p></div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">3</div>
            <div><strong>Tap "Add to Home screen"</strong><p>Select <em>Add to Home screen</em> and confirm. FinCalc Pro installs instantly.</p></div>
          </div>
        </div>`;
    } else {
      instBody.innerHTML = `
        <div class="pwa-inst-steps">
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">1</div>
            <div>
              <strong>Use Chrome or Edge</strong>
              <p>Open this site in <strong>Google Chrome</strong> or <strong>Microsoft Edge</strong> on desktop for the easiest one-click install.</p>
            </div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">2</div>
            <div>
              <strong>Click the install icon</strong>
              <p>Look for the <strong>⊕</strong> or computer icon in the browser address bar and click <em>Install</em>.</p>
            </div>
          </div>
          <div class="pwa-inst-step">
            <div class="pwa-inst-num">3</div>
            <div>
              <strong>Launch from desktop</strong>
              <p>FinCalc Pro opens as a standalone app — no browser chrome, works offline.</p>
            </div>
          </div>
        </div>
        <p class="pwa-inst-note">On Firefox: type <code>about:config</code>, enable <code>dom.manifest.enabled</code>, then use the URL bar install icon.</p>`;
    }

    instModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    instModal.addEventListener('click', (e) => {
      if (e.target === instModal) {
        instModal.classList.add('hidden');
        document.body.style.overflow = '';
      }
    }, { once: true });
  }

  /* ---- Toast ---- */
  function showToast() {
    if (!toast) return;
    toast.classList.remove('hidden');
    void toast.offsetWidth;
    toast.classList.add('pwa-toast-enter');
  }

  function hideToast() {
    if (!toast) return;
    clearTimeout(toastTimer);
    toast.classList.add('pwa-toast-exit');
    setTimeout(() => {
      toast.classList.add('hidden');
      toast.classList.remove('pwa-toast-enter', 'pwa-toast-exit');
    }, 300);
  }

  /* ---- Success badge ---- */
  function showSuccess() {
    if (!successBadge) return;
    successBadge.classList.remove('hidden');
    void successBadge.offsetWidth;
    successBadge.classList.add('pwa-success-enter');
    setTimeout(() => {
      successBadge.classList.add('pwa-success-exit');
      setTimeout(() => successBadge.classList.add('hidden'), 400);
    }, 3500);
  }

  /* ---- Update banner ---- */
  function showUpdateBanner() {
    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <span>A new version of FinCalc Pro is available.</span>
      <button class="btn btn-primary btn-sm" onclick="window.location.reload()">Update now</button>
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">Later</button>`;
    document.body.appendChild(banner);
    void banner.offsetWidth;
    banner.classList.add('pwa-update-enter');
  }
})();
