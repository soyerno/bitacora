/* Curso interactivo Storyblok modo-landing — engine.
   Depende de: window.LESSONS (array {id,num,title,eyebrow,file,md}) + marked (CDN). */
(function () {
  'use strict';
  var LESSONS = window.LESSONS || [];
  var LS = 'course:storyblok:';
  var fileToId = {};
  LESSONS.forEach(function (l) { if (l.file) fileToId[l.file] = l.id; });

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var store = {
    get: function (k, d) { try { var v = localStorage.getItem(LS + k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } },
    set: function (k, v) { try { localStorage.setItem(LS + k, JSON.stringify(v)); } catch (e) {} }
  };

  function lessonDone(id) { return store.get('done:' + id, false); }
  function setLessonDone(id, v) { store.set('done:' + id, v); renderSidebar(); renderProgress(); }

  function renderProgress() {
    var done = LESSONS.filter(function (l) { return lessonDone(l.id); }).length;
    var pct = LESSONS.length ? Math.round((done / LESSONS.length) * 100) : 0;
    var fill = $('#progress-fill'); var label = $('#progress-label');
    if (fill) fill.style.width = pct + '%';
    if (label) label.textContent = done + '/' + LESSONS.length + ' lecciones · ' + pct + '%';
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
      a.innerHTML = '<span class="ln-num">' + (lessonDone(l.id) ? '✓' : l.num) + '</span><span class="ln-title">' + l.title + '</span>';
      li.appendChild(a); nav.appendChild(li);
    });
  }

  function currentId() {
    var h = (location.hash || '').replace('#', '');
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
  }

  function render() {
    var id = currentId();
    var lesson = LESSONS.filter(function (l) { return l.id === id; })[0] || LESSONS[0];
    var idx = LESSONS.indexOf(lesson);
    var inner = $('#content-inner');
    var html = '<span class="lesson-eyebrow">' + (lesson.eyebrow || ('Lección ' + lesson.num)) + '</span>';
    html += window.marked ? marked.parse(lesson.md) : '<pre>' + lesson.md + '</pre>';
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
      (prev ? '<a class="foot-btn prev" href="#' + prev.id + '"><span class="foot-dir">← Anterior</span><span class="foot-name">' + prev.title + '</span></a>' : '<span class="foot-btn" hidden></span>') +
      (next ? '<a class="foot-btn next" href="#' + next.id + '"><span class="foot-dir">Siguiente →</span><span class="foot-name">' + next.title + '</span></a>' : '<span class="foot-btn" hidden></span>');
    inner.appendChild(foot);

    renderSidebar(); renderProgress();
    document.title = lesson.title + ' · Capacitación Storyblok MODO';
    window.scrollTo(0, 0);
  }

  // Theme
  function initTheme() {
    var saved = store.get('theme', null);
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    var btn = $('#theme-toggle');
    if (btn) btn.addEventListener('click', function () {
      var cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur); store.set('theme', cur);
      btn.textContent = cur === 'dark' ? '☀ Tema claro' : '🌙 Tema oscuro';
    });
    if (btn) btn.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀ Tema claro' : '🌙 Tema oscuro';
  }

  window.addEventListener('hashchange', render);
  document.addEventListener('DOMContentLoaded', function () { initTheme(); render(); });
})();
