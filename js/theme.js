// Light/dark mode. Loaded in <head> so the saved choice applies before the
// page paints. Dark is the default until the visitor picks light.
(function () {
  var KEY = 'theme';
  var root = document.documentElement;

  try {
    var saved = localStorage.getItem(KEY);
    root.setAttribute('data-theme', saved === 'light' ? 'light' : 'dark');
  } catch (e) {
    root.setAttribute('data-theme', 'dark');
  }

  function isDark() {
    return root.getAttribute('data-theme') !== 'light';
  }

  var SUN = '<svg class="icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>';
  var MOON = '<svg class="icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>';

  function label(btn) {
    btn.setAttribute('aria-label', isDark() ? 'Switch to light mode' : 'Switch to dark mode');
  }

  function addToggle() {
    var links = document.querySelector('.nav-links');
    if (!links || links.querySelector('.theme-toggle')) return;

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'theme-toggle';
    btn.innerHTML = SUN + MOON;
    label(btn);

    btn.addEventListener('click', function () {
      var next = isDark() ? 'light' : 'dark';
      root.classList.add('theme-switching');
      root.setAttribute('data-theme', next);
      try { localStorage.setItem(KEY, next); } catch (e) {}
      label(btn);
      setTimeout(function () { root.classList.remove('theme-switching'); }, 350);
    });

    links.appendChild(btn);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addToggle);
  } else {
    addToggle();
  }
})();
