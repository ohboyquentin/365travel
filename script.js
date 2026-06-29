  // =========================
// THEME TOGGLE (robuste)
// =========================
(function themeToggle() {
  const root = document.documentElement;
    const btn = document.getElementById('themeToggle');
    const icon = document.getElementById('themeIcon');
    const key = 'theme-preference'; // 'light' | 'dark' | 'auto'

    if (!btn) {
      console.warn('[themeToggle] bouton #themeToggle introuvable — vérifie ton HTML.');
      return;
    }
    if (!icon) {
      console.warn('[themeToggle] élément #themeIcon introuvable — vérifie ton HTML.');
    }

    // Détection du thème système (utilisé si valeur 'auto')
    const getPreferredScheme = () =>
      window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

    // Appliquer le thème demandé (finalMode = 'light' | 'dark')
    const applyThemeFinal = (finalMode) => {
      root.setAttribute('data-theme', finalMode);
      btn.setAttribute('aria-pressed', finalMode === 'dark' ? 'true' : 'false');
      if (icon) icon.textContent = finalMode === 'dark' ? '🌙' : '🌞';
      // transition douce
      document.body.style.transition = 'background-color .35s ease, color .35s ease';
    };

    // Appliquer un mode (mode peut être 'auto'|'light'|'dark')
    const applyTheme = (mode) => {
      if (mode === 'auto') {
        applyThemeFinal(getPreferredScheme());
      } else {
        applyThemeFinal(mode);
      }
    };

    // Lecture du localStorage (si absent -> 'light' par défaut)
    let stored = localStorage.getItem(key);
    if (!stored) {
      stored = 'light';
      localStorage.setItem(key, stored);
    }

    // Appliquer au chargement
    try {
      applyTheme(stored);
    } catch (err) {
      console.error('[themeToggle] erreur applyTheme:', err);
    }

    // Si on veut supporter 'auto' : réagir aux changements système
    const mm = window.matchMedia('(prefers-color-scheme: dark)');
    if (typeof mm.addEventListener === 'function') {
      mm.addEventListener('change', (e) => {
        if (localStorage.getItem(key) === 'auto') applyTheme('auto');
      });
    } else if (typeof mm.addListener === 'function') {
      mm.addListener(() => {
        if (localStorage.getItem(key) === 'auto') applyTheme('auto');
      });
    }

    // Toggle au clic : on alterne light <-> dark (si tu veux 'auto' inclue, on peut changer la logique)
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const current = localStorage.getItem(key) || 'light';
      const next = current === 'light' ? 'dark' : 'light';
      localStorage.setItem(key, next);
      applyTheme(next);
    });

    // Ajout d'une petite aide au clavier (Enter / Space)
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        btn.click();
      }
    });

    // DEBUG helper (affiche l'état au chargement)
    console.info('[themeToggle] initialisé — mode stocké:', stored, 'theme appliqué:', root.getAttribute('data-theme'));
})();


  // =========================
  // MOBILE NAV DRAWER
  // =========================
  (function mobileNav(){
    const btn = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const primaryNav = document.querySelector('nav.primary');

    if (!btn || !drawer || !primaryNav) return;

    drawer.innerHTML = "";
    drawer.appendChild(primaryNav.cloneNode(true));

    const toggle = () => {
      const open = !drawer.classList.contains('open');
      drawer.classList.toggle('open', open);
      btn.setAttribute('aria-expanded', String(open));
    };

    btn.addEventListener('click', toggle);
    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') toggle();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) toggle();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880 && drawer.classList.contains('open')) {
        drawer.classList.remove('open');
        btn.setAttribute('aria-expanded', "false");
      }
    });
  })();

