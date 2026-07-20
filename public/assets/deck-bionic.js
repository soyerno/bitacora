/* MODO decks · bionic reading toggle (focus aid, ADHD-friendly)
 * - Walks the DOM once, wraps the prefix (~50%) of each word in <b class="bionic">.
 * - CSS controls whether those <b> render bold (body.bionic-on).
 * - Persists state in localStorage.
 * - Mounts both the bionic toggle and the existing theme toggle inside a
 *   single header dropdown (.deck-controls) so they sit at the same level.
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'modo-decks-bionic';
  var SKIP_TAGS = {
    SCRIPT: 1, STYLE: 1, NOSCRIPT: 1, CODE: 1, PRE: 1, KBD: 1, SAMP: 1,
    TEXTAREA: 1, INPUT: 1, SELECT: 1, BUTTON: 1, SVG: 1,
  };
  var SKIP_CLASSES = ['mono', 'theme-toggle', 'deck-bionic-toggle', 'deck-controls', 'bionic'];
  var bionifiedFlag = '__bionicProcessed';

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY) === 'on'; }
    catch (_) { return false; }
  }

  function writeStored(on) {
    try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); }
    catch (_) {}
  }

  function shouldSkip(el) {
    if (!el || el.nodeType !== 1) return false;
    if (SKIP_TAGS[el.tagName]) return true;
    if (el.getAttribute && el.getAttribute('data-bionic') === 'skip') return true;
    if (el.classList) {
      for (var i = 0; i < SKIP_CLASSES.length; i++) {
        if (el.classList.contains(SKIP_CLASSES[i])) return true;
      }
    }
    return false;
  }

  function bionifyTextNode(node) {
    var text = node.nodeValue;
    if (!text || !/\S/.test(text)) return;
    if (!/[A-Za-zÀ-ÿ]/.test(text)) return;

    var parts = text.split(/(\s+)/);
    var frag = document.createDocumentFragment();
    var changed = false;

    for (var i = 0; i < parts.length; i++) {
      var part = parts[i];
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        frag.appendChild(document.createTextNode(part));
        continue;
      }
      var m = part.match(/^([^A-Za-zÀ-ÿ0-9]*)([A-Za-zÀ-ÿ0-9]+)([\s\S]*)$/);
      if (!m) {
        frag.appendChild(document.createTextNode(part));
        continue;
      }
      var prefix = m[1];
      var word = m[2];
      var suffix = m[3];
      if (prefix) frag.appendChild(document.createTextNode(prefix));

      var len = word.length;
      var boldLen;
      if (len <= 1) boldLen = 1;
      else if (len <= 3) boldLen = 1;
      else boldLen = Math.ceil(len / 2);

      var b = document.createElement('b');
      b.className = 'bionic';
      b.textContent = word.slice(0, boldLen);
      frag.appendChild(b);
      var rest = word.slice(boldLen);
      if (rest) frag.appendChild(document.createTextNode(rest));
      if (suffix) frag.appendChild(document.createTextNode(suffix));
      changed = true;
    }

    if (changed && node.parentNode) {
      node.parentNode.replaceChild(frag, node);
    }
  }

  function walk(node) {
    if (shouldSkip(node)) return;
    var child = node.firstChild;
    while (child) {
      var next = child.nextSibling;
      if (child.nodeType === 1) walk(child);
      else if (child.nodeType === 3) bionifyTextNode(child);
      child = next;
    }
  }

  function bionifyDocument() {
    if (document[bionifiedFlag]) return;
    document[bionifiedFlag] = true;
    if (document.body) walk(document.body);
  }

  function applyState(on) {
    if (on) {
      bionifyDocument();
      document.body.classList.add('bionic-on');
    } else {
      document.body.classList.remove('bionic-on');
    }
    var btn = document.querySelector('.deck-bionic-toggle');
    if (btn) {
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      var label = btn.querySelector('.label');
      if (label) label.textContent = on ? 'on' : 'off';
    }
  }

  function buildBionicToggle() {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'deck-bionic-toggle';
    btn.setAttribute('aria-label', 'Lectura biónica (foco TDAH)');
    btn.title = 'Lectura biónica · resalta el inicio de cada palabra';
    btn.setAttribute('data-bionic', 'skip');
    var initial = readStored();
    btn.setAttribute('aria-pressed', initial ? 'true' : 'false');
    btn.innerHTML =
      '<span class="icon" aria-hidden="true"><b>Bi</b>o</span>' +
      '<span class="label">' + (initial ? 'on' : 'off') + '</span>';
    btn.addEventListener('click', function () {
      var next = !document.body.classList.contains('bionic-on');
      applyState(next);
      writeStored(next);
    });
    return btn;
  }

  function mountControls() {
    if (document.querySelector('.deck-controls')) return;

    var themeToggle = document.getElementById('theme-toggle')
      || document.querySelector('.theme-toggle');
    var bionicToggle = buildBionicToggle();

    // Fallback: no theme toggle in this page — append bionic toggle inline at
    // the end of <header> so it isn't a floating element.
    if (!themeToggle) {
      var header = document.querySelector('header > .container') || document.body;
      bionicToggle.classList.add('deck-bionic-toggle--standalone');
      header.appendChild(bionicToggle);
      return;
    }

    // Native <details>/<summary>: open/close handled by the browser via CSS+HTML,
    // no JS state, no click-outside listeners, no aria juggling.
    var wrap = document.createElement('details');
    wrap.className = 'deck-controls';
    wrap.setAttribute('data-bionic', 'skip');

    var summary = document.createElement('summary');
    summary.className = 'deck-controls__trigger';
    summary.setAttribute('aria-label', 'Preferencias de lectura · tema y lectura biónica');
    summary.title = 'Preferencias de lectura';
    summary.innerHTML =
      '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">' +
        '<circle cx="12" cy="12" r="3"/>' +
        '<path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/>' +
      '</svg>' +
      '<span class="deck-controls__caret" aria-hidden="true">▾</span>';

    var panel = document.createElement('div');
    panel.className = 'deck-controls__panel';

    var rowTheme = document.createElement('div');
    rowTheme.className = 'deck-controls__row';
    var labelTheme = document.createElement('span');
    labelTheme.className = 'deck-controls__label';
    labelTheme.textContent = 'Tema';
    rowTheme.appendChild(labelTheme);

    var rowBionic = document.createElement('div');
    rowBionic.className = 'deck-controls__row';
    var labelBionic = document.createElement('span');
    labelBionic.className = 'deck-controls__label';
    labelBionic.textContent = 'Lectura biónica';
    rowBionic.appendChild(labelBionic);

    var themeParent = themeToggle.parentNode;
    if (themeParent) themeParent.replaceChild(wrap, themeToggle);
    rowTheme.appendChild(themeToggle);
    rowBionic.appendChild(bionicToggle);

    panel.appendChild(rowTheme);
    panel.appendChild(rowBionic);
    wrap.appendChild(summary);
    wrap.appendChild(panel);
  }

  function init() {
    mountControls();
    if (readStored()) applyState(true);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
