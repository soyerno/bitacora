/* MODO presentaciones · shared helpers */

window.MODO = window.MODO || {};

MODO.STATUS_LABELS = {
  draft: 'Draft',
  rfc: 'RFC',
  completo: 'Completo',
  archivado: 'Archivado',
  local: 'Local',
  qa: 'QA',
  prod: 'Prod'
};

MODO.escapeHTML = function (s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[c];
  });
};

/* Theme toggle: cycles auto → claro → oscuro, persists in localStorage. */
MODO.initThemeToggle = function () {
  var THEMES = ['auto', 'light', 'dark'];
  var LABEL = { auto: 'auto', light: 'claro', dark: 'oscuro' };
  var btn = document.getElementById('theme-toggle');
  var label = document.getElementById('theme-label');
  function refresh() {
    var t = document.documentElement.getAttribute('data-theme') || 'auto';
    if (label) label.textContent = LABEL[t] || t;
  }
  refresh();
  if (!btn) return;
  btn.addEventListener('click', function () {
    var current = document.documentElement.getAttribute('data-theme') || 'auto';
    var next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('modo-decks-theme', next); } catch (e) { /* ignore */ }
    refresh();
  });
};

document.addEventListener('DOMContentLoaded', MODO.initThemeToggle);
