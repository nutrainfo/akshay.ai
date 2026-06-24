/* FinCalc Pro — PWA install logic
   Handles beforeinstallprompt, appinstalled, and service worker registration. */

const PWA = (() => {
  let deferredPrompt = null;
  let toastTimer = null;

  const installBtn   = document.getElementById('pwa-install-btn');
  const toast        = document.getElementById('pwa-toast');
  const toastInstall = document.getElementById('pwa-toast-install');
  const toastDismiss = document.getElementById('pwa-toast-dismiss');
  const successBadge = document.getElementById('pwa-success');

  /* ---- Service Worker registration ---- */
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').then((reg) => {
        /* Listen for a new SW waiting to activate */
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              showUpdateBanner();
            }
          });
        });
      }).catch((err) => console.warn('SW registration failed:', err));
    });
  }

  /* ---- Capture the install prompt ---- */
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;

    /* Don't show if user already dismissed within 7 days */
    const dismissed = localStorage.getItem('pwaToastDismissed');
    if (dismissed && Date.now() - Number(dismissed) < 7 * 86400000) {
      showInstallBtn();
      return;
    }

    showInstallBtn();

    /* Show toast after a 4-second delay so it doesn't interrupt page load */
    toastTimer = setTimeout(showToast, 4000);
  });

  /* ---- App installed event ---- */
  window.addEventListener('appinstalled', () => {
    hideToast();
    hideInstallBtn();
    deferredPrompt = null;
    showSuccess();
    localStorage.setItem('pwaInstalled', '1');
  });

  /* ---- Header install button ---- */
  installBtn?.addEventListener('click', triggerInstall);

  /* ---- Toast buttons ---- */
  toastInstall?.addEventListener('click', triggerInstall);
  toastDismiss?.addEventListener('click', () => {
    hideToast();
    localStorage.setItem('pwaToastDismissed', String(Date.now()));
  });

  async function triggerInstall() {
    if (!deferredPrompt) return;
    hideToast();
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      hideInstallBtn();
      deferredPrompt = null;
    }
  }

  function showInstallBtn() {
    installBtn?.classList.remove('hidden');
    installBtn?.classList.add('pwa-btn-enter');
  }

  function hideInstallBtn() {
    installBtn?.classList.add('hidden');
  }

  function showToast() {
    toast?.classList.remove('hidden');
    /* Trigger reflow for animation */
    void toast?.offsetWidth;
    toast?.classList.add('pwa-toast-enter');
  }

  function hideToast() {
    clearTimeout(toastTimer);
    toast?.classList.add('pwa-toast-exit');
    setTimeout(() => {
      toast?.classList.add('hidden');
      toast?.classList.remove('pwa-toast-enter', 'pwa-toast-exit');
    }, 300);
  }

  function showSuccess() {
    successBadge?.classList.remove('hidden');
    void successBadge?.offsetWidth;
    successBadge?.classList.add('pwa-success-enter');
    setTimeout(() => {
      successBadge?.classList.add('pwa-success-exit');
      setTimeout(() => successBadge?.classList.add('hidden'), 400);
    }, 3500);
  }

  function showUpdateBanner() {
    const banner = document.createElement('div');
    banner.className = 'pwa-update-banner';
    banner.innerHTML = `
      <span>A new version of FinCalc Pro is available.</span>
      <button class="btn btn-primary btn-sm" onclick="window.location.reload()">Update now</button>
      <button class="btn btn-ghost btn-sm" onclick="this.parentElement.remove()">Later</button>
    `;
    document.body.appendChild(banner);
    void banner.offsetWidth;
    banner.classList.add('pwa-update-enter');
  }

  /* iOS Safari: no beforeinstallprompt — show manual install tip */
  function isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent) && !window.MSStream;
  }

  if (isIOS() && !navigator.standalone && !localStorage.getItem('pwaInstalled')) {
    const dismissed = localStorage.getItem('pwaToastDismissed');
    if (!dismissed || Date.now() - Number(dismissed) > 7 * 86400000) {
      setTimeout(() => {
        if (toast) {
          document.getElementById('pwa-toast-title').textContent = 'Add to Home Screen';
          document.getElementById('pwa-toast-desc').textContent = 'Tap the Share button then "Add to Home Screen" to install FinCalc Pro.';
          toastInstall.textContent = 'Got it';
          toastInstall.onclick = () => {
            hideToast();
            localStorage.setItem('pwaToastDismissed', String(Date.now()));
          };
          showToast();
        }
      }, 5000);
    }
  }
})();
