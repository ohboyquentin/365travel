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
(function() {
  function initDrawer() {
    const hamburger = document.getElementById('hamburger');
    const primaryNav = document.querySelector('nav.primary');
    if (!hamburger || !primaryNav) return;

    // Créer le drawer from scratch
    let drawer = document.getElementById('drawer');
    if (!drawer) {
      drawer = document.createElement('div');
      drawer.id = 'drawer';
      document.body.insertBefore(drawer, document.body.firstChild.nextSibling);
    }

    // Remplir avec le menu
    drawer.innerHTML = primaryNav.outerHTML;

    // Styler le drawer directement
    drawer.style.cssText = `
      display: none;
      position: fixed;
      left: 0;
      right: 0;
      z-index: 9999;
      background: #0d0d0f;
      padding: 1.5rem;
      border-bottom: 2px solid #333;
      box-shadow: 0 8px 24px rgba(0,0,0,0.8);
    `;

    // Positionner sous le header
    const header = document.querySelector('header.site-header');
    if (header) {
      drawer.style.top = header.offsetHeight + 'px';
    } else {
      drawer.style.top = '60px';
    }

    // Styler les liens
    drawer.querySelectorAll('a, button').forEach(el => {
      el.style.cssText = 'display:block; color:#fff; padding:12px 0; font-size:1.1rem; text-decoration:none; border:none; background:none; cursor:pointer; width:100%;';
    });
    drawer.querySelectorAll('ul').forEach(ul => {
      ul.style.cssText = 'list-style:none; margin:0; padding:0;';
    });
    drawer.querySelectorAll('.submenu').forEach(sub => {
      sub.style.cssText = 'display:block; padding-left:1rem;';
    });

    // Toggle
    let isOpen = false;

    hamburger.addEventListener('click', () => {
      isOpen = !isOpen;
      drawer.style.display = isOpen ? 'block' : 'none';
      hamburger.setAttribute('aria-expanded', String(isOpen));
    });

    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        isOpen = false;
        drawer.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen) {
        isOpen = false;
        drawer.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880 && isOpen) {
        isOpen = false;
        drawer.style.display = 'none';
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initDrawer);
  } else {
    initDrawer();
  }
})();
