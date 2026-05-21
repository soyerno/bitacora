/* Erno × MODO · nav counters
 *
 * Populates `.nav-count` spans across all top-level pages with the live count
 * of decks/RFCs/postmans. Works from any depth because it resolves the data URLs
 * from its own <script src> attribute (which always points at /assets/nav-counts.js).
 *
 * Counter elements expected: #nav-count-decks, #nav-count-rfcs, #nav-count-postmans
 * Data: <site-root>/decks/decks.json, <site-root>/rfcs/rfcs.json,
 *       <site-root>/postmans/postmans.json
 */
(function () {
  'use strict';

  function baseFromOwnSrc() {
    var scripts = document.getElementsByTagName('script');
    for (var i = scripts.length - 1; i >= 0; i--) {
      var src = scripts[i].src || '';
      var m = src.match(/(.*\/)assets\/nav-counts\.js(?:\?|$)/);
      if (m) return m[1];
    }
    return './';
  }

  var BASE = baseFromOwnSrc();

  var targets = [
    { id: 'nav-count-decks',    url: BASE + 'decks/decks.json',       key: 'decks'    },
    { id: 'nav-count-rfcs',     url: BASE + 'rfcs/rfcs.json',         key: 'rfcs'     },
    { id: 'nav-count-postmans', url: BASE + 'postmans/postmans.json', key: 'postmans' }
  ];

  targets.forEach(function (t) {
    var el = document.getElementById(t.id);
    if (!el) return;
    fetch(t.url, { cache: 'force-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (data) {
        if (!data) return;
        var list = data[t.key];
        if (!Array.isArray(list)) return;
        el.textContent = list.length;
      })
      .catch(function () { /* keep placeholder */ });
  });
})();
