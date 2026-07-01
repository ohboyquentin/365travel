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

    if (!btn || !drawer || !primaryNav) return;

    // Cloner le menu dans le drawer
    drawer.innerHTML = "";
    drawer.appendChild(primaryNav.cloneNode(true));

    // Styles de base du drawer via JS (indépendant du CSS/cache)
    const headerH = document.querySelector('header.site-header')
      ? document.querySelector('header.site-header').getBoundingClientRect().height
      : 60;

    Object.assign(drawer.style, {
      position: 'fixed',
      top: Math.round(headerH) + 'px',
      left: '0',
      right: '0',
      zIndex: '9999',
      background: 'var(--bg, #0d0d0f)',
      borderBottom: '1px solid var(--border, #21232a)',
      padding: '1rem',
      display: 'none',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
    });

    // Styles des liens dans le drawer
    const styleLinks = () => {
      drawer.querySelectorAll('a, button').forEach(el => {
        el.style.color = 'var(--text, #f3f4f5)';
        el.style.display = 'block';
        el.style.padding = '0.8rem 0';
        el.style.textDecoration = 'none';
        el.style.fontSize = '1rem';
      });
      drawer.querySelectorAll('ul').forEach(ul => {
        ul.style.listStyle = 'none';
        ul.style.margin = '0';
        ul.style.padding = '0';
      });
      // Sous-menu Destinations toujours visible dans le drawer
      drawer.querySelectorAll('.submenu').forEach(sub => {
        sub.style.display = 'block';
        sub.style.paddingLeft = '1rem';
      });
    };

    const open = () => {
      drawer.style.display = 'block';
      styleLinks();
      btn.setAttribute('aria-expanded', 'true');
      drawer.classList.add('open');
    };

    const close = () => {
      drawer.style.display = 'none';
      btn.setAttribute('aria-expanded', 'false');
      drawer.classList.remove('open');
    };

    const toggle = () => {
      drawer.style.display === 'block' ? close() : open();
    };

    btn.addEventListener('click', toggle);
    drawer.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') close();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > 880) close();
    });
  })();
  }); // DOMContentLoaded

