/* Curso interactivo MODO — engine genérico.
   Depende de: window.LESSONS (array {id,num,title,eyebrow,file,md}) + marked (CDN).
   window.COURSE_LS define el namespace de localStorage por curso. */
(function () {
  'use strict';
  var LESSONS = window.LESSONS || [];
  var LS = window.COURSE_LS || 'course:storyblok:';
  var fileToId = {};
  LESSONS.forEach(function (l) { if (l.file) fileToId[l.file] = l.id; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var esc = function (s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); };
  var slug = function (s) {
    return String(s).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-').replace(/-+/g, '-');
  };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(LS + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {} }
  };

  // Glosario de tooltips: siglas/términos que piden interpretación → definición corta.
  // La primera aparición de cada término en una lección se envuelve en <abbr class="term">.
  var GLOSSARY = {
    'JSON-LD': 'Datos estructurados que le explican a Google y a los buscadores con IA de qué trata la página.',
    'modo-landing': 'El repo del sitio modo.com.ar (la landing principal de MODO).',
    'Storyblok': 'El CMS donde vive el contenido del sitio. No se edita a mano: Claude lo actualiza por MCP.',
    'WCAG': 'Estándar de accesibilidad web (Web Content Accessibility Guidelines).',
    'a11y': 'Accesibilidad: que la página la pueda usar todo el mundo, incluida gente con discapacidad.',
    'SEO': 'Search Engine Optimization: que Google encuentre y muestre la página.',
    'GEO': 'Generative Engine Optimization: que los buscadores con IA encuentren y citen la página.',
    'CSP': 'Content Security Policy: reglas que limitan de dónde puede cargar contenido la página (seguridad).',
    'MCP': 'La conexión que enchufa a Claude con herramientas externas (como Storyblok) para que actúe por vos.',
    'CMS': 'Gestor de contenido: la herramienta donde vive el contenido del sitio (acá, Storyblok).',
    'SDD': 'Spec-Driven Development: definir la especificación verificable antes de escribir código.',
    'TDD': 'Test-Driven Development: escribir el test que falla antes que el código que lo hace pasar.',
    'RTL': 'React Testing Library: testear componentes como los usa la persona, no por detalles internos.',
    'SSR': 'Server-Side Rendering: la página llega ya armada desde el servidor (mejor para SEO).',
    'ISR': 'Incremental Static Regeneration: regenerar páginas estáticas cada cierto tiempo.',
    'LCP': 'Largest Contentful Paint: cuánto tarda en aparecer lo principal de la página.',
    'CLS': 'Cumulative Layout Shift: cuánto se mueve la página sola mientras carga.',
    'GRC': 'Governance, Risk & Compliance: gobierno, riesgo y cumplimiento.',
    'alpha': 'Un ambiente de prueba interno, idéntico al real pero no público.',
    'blok': 'Un bloque reutilizable de una página en Storyblok.',
    'story': 'Una página en Storyblok.',
    'slug': 'La parte de la URL que identifica la página (lo que va después de la barra).',
    'token': 'Una llave de acceso: el permiso para que una herramienta actúe en tu nombre.',
    'marketplace': 'La tienda de skills/plugins de Claude — desde ahí instalás y actualizás las herramientas MODO.',
    'skill': 'Una herramienta o conocimiento reutilizable que Claude usa cuando aplica.',
    'plugin': 'Un paquete de skills/herramientas que instalás de una vez desde el marketplace.'
  };
  var GLOSS_TERMS = Object.keys(GLOSSARY).sort(function (a, b) { return b.length - a.length; });
  var GLOSS_RX = '(?<![\\w-])(' + GLOSS_TERMS.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')(?![\\w-])';

  function glossify(root) {
    if (!('createTreeWalker' in document)) return;
    var used = {};
    var walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue || !n.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
        var p = n.parentNode;
        while (p && p !== root) {
          if (p.tagName && /^(PRE|CODE|A|ABBR|H1|H2|H3|BUTTON)$/.test(p.tagName)) return NodeFilter.FILTER_REJECT;
          p = p.parentNode;
        }
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    var nodes = [], n;
    while ((n = walker.nextNode())) nodes.push(n);
    nodes.forEach(function (node) {
      var text = node.nodeValue, rx = new RegExp(GLOSS_RX, 'g'), m, last = 0, frag = null;
      while ((m = rx.exec(text))) {
        var term = m[1];
        if (used[term]) continue;
        used[term] = true;
        frag = frag || document.createDocumentFragment();
        frag.appendChild(document.createTextNode(text.slice(last, m.index)));
        var ab = document.createElement('abbr');
        ab.className = 'term';
        ab.setAttribute('data-tip', GLOSSARY[term]);
        ab.setAttribute('aria-label', term + ': ' + GLOSSARY[term]);
        ab.setAttribute('tabindex', '0');
        ab.textContent = term;
        frag.appendChild(ab);
        last = m.index + term.length;
      }
      if (frag) {
        frag.appendChild(document.createTextNode(text.slice(last)));
        node.parentNode.replaceChild(frag, node);
      }
    });
  }

  function lessonDone(id) { return store.get('done:' + id, false); }
  function setLessonDone(id, v) { store.set('done:' + id, v); renderSidebar(); renderProgress(); }

  function renderProgress() {
    var done = LESSONS.filter(function (l) { return lessonDone(l.id); }).length;
    var pct = LESSONS.length ? Math.round((done / LESSONS.length) * 100) : 0;
    var fill = $('#progress-fill'); var label = $('#progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + '/' + LESSONS.length + ' lecciones · ' + pct + '%';
    var bar = $('.progress-bar');
    if (bar) {
      bar.setAttribute('role', 'progressbar');
      bar.setAttribute('aria-valuemin', '0');
      bar.setAttribute('aria-valuemax', '100');
      bar.setAttribute('aria-valuenow', String(pct));
      bar.setAttribute('aria-label', 'Progreso del curso: ' + pct + '%');
    }
  }

  function renderSidebar() {
    var nav = $('#lesson-nav'); if (!nav) return;
    var cur = currentId();
    nav.innerHTML = '';
    LESSONS.forEach(function (l) {
      var li = document.createElement('li');
      var a = document.createElement('a');
      a.href = '#' + l.id;
      a.className = (l.id === cur ? 'active ' : '') + (lessonDone(l.id) ? 'ln-done' : '');
      if (l.id === cur) a.setAttribute('aria-current', 'page');
      var state = lessonDone(l.id) ? ' (completada)' : '';
      a.setAttribute('aria-label', l.title + state);
      a.innerHTML = '<span class="ln-num" aria-hidden="true">' + (lessonDone(l.id) ? '✓' : l.num) + '</span><span class="ln-title">' + esc(l.title) + '</span>';
      li.appendChild(a); nav.appendChild(li);
    });
    var active = nav.querySelector('a.active');
    if (active && active.scrollIntoView) active.scrollIntoView({ block: 'nearest' });
  }

  // hash puede ser '#<lessonId>' o '#<lessonId>::<seccion>'. El lessonId es la parte previa a '::'.
  function hashLessonPart() { return (location.hash || '').replace('#', '').split('::')[0]; }
  function currentId() {
    var h = hashLessonPart();
    return fileToId[h] ? fileToId[h] : (LESSONS.some(function (l) { return l.id === h; }) ? h : LESSONS[0].id);
  }

  function enhance(root, lessonId) {
    // Copy buttons on code blocks
    root.querySelectorAll('pre').forEach(function (pre) {
      var wrap = document.createElement('div'); wrap.className = 'code-block';
      pre.parentNode.insertBefore(wrap, pre); wrap.appendChild(pre);
      var btn = document.createElement('button'); btn.className = 'copy-btn'; btn.type = 'button'; btn.textContent = 'copiar';
      btn.addEventListener('click', function () {
        var code = pre.innerText;
        navigator.clipboard.writeText(code).then(function () {
          btn.textContent = '✓ copiado'; btn.classList.add('ok');
          setTimeout(function () { btn.textContent = 'copiar'; btn.classList.remove('ok'); }, 1500);
        });
      });
      wrap.appendChild(btn);
    });
    // Interactive task lists (persisted)
    root.querySelectorAll('li').forEach(function (li, i) {
      var cb = li.querySelector('input[type="checkbox"]');
      if (!cb) return;
      li.parentElement.classList.add('task-list');
      cb.disabled = false;
      var key = 'task:' + lessonId + ':' + i;
      var saved = store.get(key, null);
      if (saved !== null) cb.checked = saved;
      if (cb.checked) li.classList.add('checked');
      cb.addEventListener('change', function () {
        store.set(key, cb.checked);
        li.classList.toggle('checked', cb.checked);
      });
    });
    // Heading anchors — secciones deep-linkables y copiables (#lesson::heading)
    var seen = {};
    root.querySelectorAll('h2, h3').forEach(function (h) {
      var base = slug(h.textContent) || 'sec';
      seen[base] = (seen[base] || 0) + 1;
      var hid = lessonId + '::' + base + (seen[base] > 1 ? '-' + seen[base] : '');
      h.id = hid;
      var a = document.createElement('a');
      a.className = 'heading-anchor';
      a.href = '#' + hid;
      a.setAttribute('aria-label', 'Enlace a esta sección');
      a.textContent = '#';
      h.insertBefore(a, h.firstChild);
    });
    // Rewrite internal lesson links (.md → hash) + neutralize repo placeholders
    root.querySelectorAll('a[href]').forEach(function (a) {
      var href = a.getAttribute('href');
      var base = href.split('/').pop();
      if (fileToId[base]) { a.setAttribute('href', '#' + fileToId[base]); return; }
      if (/solution/.test(href)) { a.setAttribute('href', '#solucion'); return; }
      if (/README\.md$/i.test(href) && /exercises/.test(href)) { a.setAttribute('href', '#lab'); return; }
      if (/harness\/gates\.md$/.test(href)) { a.setAttribute('href', '#gates'); return; }
      if (href === '../../../' || href.indexOf('..') === 0) {
        a.removeAttribute('href'); a.style.borderBottom = '1px dotted var(--text-soft)'; a.title = 'Ruta en el repo modo-landing';
      }
    });
    // Tooltips de glosario (primera aparición de cada sigla/término)
    glossify(root);
  }

  var lastId = null;
  function scrollToSection() {
    var h = (location.hash || '').replace('#', '');
    if (h.indexOf('::') === -1) { window.scrollTo(0, 0); return; }
    var el = document.getElementById(h);
    if (el && el.scrollIntoView) el.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }

  function render() {
    var id = currentId();
    // Salto dentro de la misma lección (deep-link a sección): no re-render, solo scroll.
    if (id === lastId) { renderSidebar(); scrollToSection(); return; }
    lastId = id;
    var lesson = LESSONS.filter(function (l) { return l.id === id; })[0] || LESSONS[0];
    var idx = LESSONS.indexOf(lesson);
    var inner = $('#content-inner');
    var html = '<span class="lesson-eyebrow">' + esc(lesson.eyebrow || ('Lección ' + lesson.num)) + '</span>';
    html += window.marked ? marked.parse(lesson.md) : '<pre class="md-fallback">' + esc(lesson.md) + '</pre>';
    inner.innerHTML = html;
    enhance(inner, lesson.id);

    // Mark-done button
    var mark = document.createElement('button');
    mark.className = 'mark-done' + (lessonDone(lesson.id) ? ' done' : '');
    mark.type = 'button';
    mark.textContent = lessonDone(lesson.id) ? '✓ Lección completada' : 'Marcar lección como completada';
    mark.addEventListener('click', function () {
      var nv = !lessonDone(lesson.id); setLessonDone(lesson.id, nv);
      mark.classList.toggle('done', nv);
      mark.textContent = nv ? '✓ Lección completada' : 'Marcar lección como completada';
    });
    inner.appendChild(mark);

    // Prev/next
    var foot = document.createElement('div'); foot.className = 'lesson-foot';
    var prev = LESSONS[idx - 1], next = LESSONS[idx + 1];
    foot.innerHTML =
      (prev ? '<a class="foot-btn prev" href="#' + prev.id + '" rel="prev"><span class="foot-dir">← Anterior</span><span class="foot-name">' + esc(prev.title) + '</span></a>' : '<span class="foot-btn" hidden></span>') +
      (next ? '<a class="foot-btn next" href="#' + next.id + '" rel="next"><span class="foot-dir">Siguiente →</span><span class="foot-name">' + esc(next.title) + '</span></a>' : '<span class="foot-btn" hidden></span>');
    inner.appendChild(foot);

    renderSidebar(); renderProgress();
    document.title = lesson.title + ' · ' + (document.querySelector('.brand-title')?.textContent || 'Capacitación MODO');
    scrollToSection();
  }

  // Theme
  function syncThemeBtn(btn) {
    var dark = document.documentElement.getAttribute('data-theme') === 'dark';
    btn.textContent = dark ? '☀ Tema claro' : '🌙 Tema oscuro';
    btn.setAttribute('aria-pressed', String(dark));
    btn.setAttribute('aria-label', dark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro');
  }
  function initTheme() {
    var saved = store.get('theme', null);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    var btn = $('#theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur); store.set('theme', cur);
      syncThemeBtn(btn);
    });
    syncThemeBtn(btn);
  }

  // Navegación por teclado: ← / → entre lecciones (ignora si el foco está en un campo).
  function initKeyboardNav() {
    document.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      var t = e.target;
      if (t && (/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) || t.isContentEditable)) return;
      if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return;
      var idx = LESSONS.indexOf(LESSONS.filter(function (l) { return l.id === currentId(); })[0]);
      var dest = e.key === 'ArrowLeft' ? LESSONS[idx - 1] : LESSONS[idx + 1];
      if (dest) { e.preventDefault(); location.hash = '#' + dest.id; }
    });
  }

  // Si marked no llegó a cargar (CDN/asset caído), avisar y degradar a texto plano legible.
  function noteIfNoMarked() {
    if (window.marked) return;
    var inner = $('#content-inner');
    if (!inner) return;
    var n = document.createElement('p');
    n.className = 'md-warn';
    n.textContent = 'No se pudo cargar el renderizador Markdown — mostrando texto plano.';
    inner.insertBefore(n, inner.firstChild);
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () {
    initTheme(); render(); initKeyboardNav(); noteIfNoMarked();
  });
})();
