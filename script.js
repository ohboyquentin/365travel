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
  document.addEventListener('DOMContentLoaded', () => {
  (function mobileNav(){
    const btn = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    const primaryNav = document.querySelector('nav.primary');
    const header = document.querySelector('header.site-header');

    if (!btn || !drawer || !primaryNav) return;

    // Cloner le menu
    drawer.innerHTML = "";
    drawer.appendChild(primaryNav.cloneNode(true));

    // Forcer l'affichage du nav cloné (nav.primary est display:none sur mobile)
    drawer.querySelectorAll('nav, ul, li').forEach(el => {
      el.style.display = 'block';
    });

    // Styler les liens
    drawer.querySelectorAll('a, button').forEach(el => {
      el.style.cssText = 'display:block; color:var(--text,#fff); padding:10px 0; font-size:1rem; text-decoration:none; background:none; border:none; cursor:pointer; width:100%; text-align:left;';
    });

    // Styles du drawer via JS — indépendant du CSS
    const headerH = header ? header.offsetHeight : 60;
    Object.assign(drawer.style, {
      position: 'fixed',
      top: headerH + 'px',
      left: '0',
      right: '0',
      zIndex: '9999',
      background: 'var(--bg, #0d0d0f)',
      borderBottom: '1px solid var(--border, #21232a)',
      padding: '1rem 1.5rem',
      boxShadow: '0 8px 24px rgba(0,0,0,0.6)',
      display: 'none'
    });

    let isOpen = false;

    const open = () => {
      // Recalculer la position au cas où
      drawer.style.top = (header ? header.offsetHeight : 60) + 'px';
      drawer.style.display = 'block';
      isOpen = true;
      btn.setAttribute('aria-expanded', 'true');
    };

    const close = () => {
      drawer.style.display = 'none';
      isOpen = false;
      btn.setAttribute('aria-expanded', 'false');
    };

    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      isOpen ? close() : open();
    });

    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('click', (e) => {
      if (!isOpen) return;
      if (drawer.contains(e.target) || btn.contains(e.target)) return;
      close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) close();
    });
  })();
  }); // DOMContentLoaded

