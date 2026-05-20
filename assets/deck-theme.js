/* MODO decks · theme toggle (auto → light → dark) */
(function () {
  'use strict';

  var STORAGE_KEY = 'modo-decks-theme';
  var THEMES = ['auto', 'light', 'dark'];
  var LABELS = { auto: 'auto', light: 'claro', dark: 'oscuro' };

  function readStored() {
    try {
      var v = localStorage.getItem(STORAGE_KEY);
      return THEMES.indexOf(v) >= 0 ? v : 'auto';
    } catch (_) {
      return 'auto';
    }
  }

  function apply(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    var label = document.querySelector('.deck-theme-toggle .label');
    if (label) label.textContent = LABELS[theme] || theme;
  }

  function next(current) {
    var i = THEMES.indexOf(current);
    return THEMES[(i + 1) % THEMES.length];
  }

  function mountToggle() {
    if (document.querySelector('.deck-theme-toggle')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'deck-theme-toggle';
    btn.setAttribute('aria-label', 'Cambiar tema');
    btn.title = 'Cambiar tema (auto / claro / oscuro)';
    btn.innerHTML =
      '<span data-icon="auto" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 3v18"/></svg></span>' +
      '<span data-icon="light" aria-hidden="true"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg></span>' +
      '<span data-icon="dark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg></span>' +
      '<span class="label">' + LABELS[readStored()] + '</span>';
    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'auto';
      var n = next(current);
      apply(n);
      try { localStorage.setItem(STORAGE_KEY, n); } catch (_) {}
    });
    document.body.appendChild(btn);
  }

  // Bootstrap: applies stored theme as early as possible (head inline script
  // also does this; this is a belt-and-suspenders for decks without the inline).
  apply(readStored());

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountToggle);
  } else {
    mountToggle();
  }
})();
