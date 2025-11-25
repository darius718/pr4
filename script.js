/* Basic interactions: burger, modal, accordion, tabs, theme toggle, accessibility */
document.addEventListener('DOMContentLoaded', () => {
  // Burger -> toggles mobile menu
  const burger = document.getElementById('burger');
  const mobileMenu = document.getElementById('mobileMenu');

  burger.addEventListener('click', () => {
    const expanded = burger.getAttribute('aria-expanded') === 'true';
    burger.setAttribute('aria-expanded', String(!expanded));
    if (mobileMenu.hasAttribute('hidden')) {
      mobileMenu.hidden = false;
      mobileMenu.querySelector('a')?.focus();
    } else {
      mobileMenu.hidden = true;
      burger.focus();
    }
  });

  // Accordion behavior
  const accToggles = document.querySelectorAll('.accordion-toggle');
  accToggles.forEach(btn => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const expanded = btn.getAttribute('aria-expanded') === 'true';
      if (expanded) {
        btn.setAttribute('aria-expanded', 'false');
        panel.style.maxHeight = null;
      } else {
        // close others for single-open accordion
        accToggles.forEach(other => {
          const p = document.getElementById(other.getAttribute('aria-controls'));
          other.setAttribute('aria-expanded', 'false');
          if (p) p.style.maxHeight = null;
        });
        btn.setAttribute('aria-expanded', 'true');
        panel.style.maxHeight = panel.scrollHeight + 'px';
      }
    });

    // allow keyboard toggle
    btn.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); btn.click(); }
    });
  });

  // Tabs
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('aria-controls');

      tabButtons.forEach(b => {
        b.setAttribute('aria-selected', 'false');
      });
      btn.setAttribute('aria-selected', 'true');

      document.querySelectorAll('.tab-panel').forEach(panel => {
        panel.classList.remove('active');
      });
      const target = document.getElementById(tabId);
      if (target) target.classList.add('active');
    });
  });

  // Modal open/close
  const modal = document.getElementById('signupModal');
  const openButtons = document.querySelectorAll('[data-open-modal]');
  const closeButtons = document.querySelectorAll('[data-close-modal]');
  let lastFocused = null;

  openButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      lastFocused = document.activeElement;
      const targetId = btn.getAttribute('data-open-modal');
      const target = document.getElementById(targetId);
      if (target) openModal(target);
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const ancestorModal = btn.closest('.modal');
      if (ancestorModal) closeModal(ancestorModal);
    });
  });

  function openModal(el) {
    el.removeAttribute('hidden');
    el.setAttribute('aria-hidden','false');
    // trap focus: focus first form element
    const focusable = el.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    focusable?.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(el) {
    el.setAttribute('aria-hidden','true');
    el.hidden = true;
    document.body.style.overflow = '';
    lastFocused?.focus();
  }

  // click on backdrop closes modal
  document.addEventListener('click', (e) => {
    if (e.target.matches('.modal-backdrop')) {
      const m = e.target.closest('.modal');
      if (m) closeModal(m);
    }
  });

  // Escape to close modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal[aria-hidden="false"]').forEach(m => closeModal(m));
    }
  });

  // Form submit (demo)
  const signupForm = document.getElementById('signupForm');
  signupForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    // simplistic feedback
    alert('Спасибо! Ваша заявка отправлена.');
    const modal = document.getElementById('signupModal');
    if (modal) closeModal(modal);
    signupForm.reset();
  });

  // Theme toggle: dark / light with localStorage
  const themeToggle = document.getElementById('themeToggle');
  const currentTheme = localStorage.getItem('zf-theme') || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  setTheme(currentTheme);

  themeToggle.addEventListener('click', () => {
    const newTheme = document.body.classList.contains('theme-dark') ? 'light' : 'dark';
    setTheme(newTheme);
  });

  function setTheme(mode) {
    if (mode === 'dark') {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
      themeToggle.textContent = '☾';
      localStorage.setItem('zf-theme','dark');
    } else {
      document.body.classList.remove('theme-dark');
      document.body.classList.add('theme-light');
      themeToggle.textContent = '☼';
      localStorage.setItem('zf-theme','light');
    }
  }

  // Small progressive enhancement: animate visible hero image when scrolled into view
  const heroImg = document.querySelector('.hero-figure img');
  if ('IntersectionObserver' in window && heroImg) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          heroImg.style.transform = 'translateY(0)';
          heroImg.style.opacity = '1';
          io.disconnect();
        }
      });
    }, {threshold:0.2});
    heroImg.style.transform = 'translateY(12px) scale(.99)';
    heroImg.style.opacity = '0';
    io.observe(heroImg);
  }
});
