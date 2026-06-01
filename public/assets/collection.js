/* MODO presentaciones · data-driven collection controller
 *
 * Renders a filterable list with: search, status tabs (with arrow-key nav),
 * topic chips, sort, live result count, empty state, and "Limpiar filtros".
 *
 * Usage:
 *   MODO.createCollection({
 *     name: 'decks',           // matches [data-collection="..."] root
 *     items: [...],            // array of objects with at least { status }
 *     stages: ['draft', ...],  // tabs to render in order
 *     labels: { topic: 'Display' },
 *     getTopics: (item) => [...],
 *     noun: 'decks',           // for the result counter
 *     searchHaystack: (item) => string,
 *     sortFn: (mode) => (a, b) => number,
 *     itemTpl: (item) => HTML string
 *   });
 */

window.MODO = window.MODO || {};

MODO.createCollection = function (opts) {
  var root = document.querySelector('[data-collection="' + opts.name + '"]');
  if (!root) return null;

  var $search = root.querySelector('[data-search]');
  var $sort = root.querySelector('[data-sort]');
  var $tabs = root.querySelector('[data-tabs]');
  var $chips = root.querySelector('[data-chips]');
  var $list = root.querySelector('[data-list]');
  var $empty = root.querySelector('[data-empty]');
  var $count = root.querySelector('[data-result-count]');
  var $clear = root.querySelector('[data-clear]');

  var state = {
    stage: 'all',
    topics: new Set(),
    search: '',
    sort: $sort ? $sort.value : 'recent'
  };

  /* Tabs */
  var stageCounts = { all: opts.items.length };
  opts.items.forEach(function (it) { stageCounts[it.status] = (stageCounts[it.status] || 0) + 1; });
  opts.stages.forEach(function (s) { if (!(s in stageCounts)) stageCounts[s] = 0; });

  var allTabs = [{ key: 'all', label: 'Todos' }].concat(
    opts.stages.map(function (s) { return { key: s, label: MODO.STATUS_LABELS[s] || s }; })
  );
  $tabs.innerHTML = allTabs.map(function (t, i) {
    var disabled = (stageCounts[t.key] === 0 && t.key !== 'all') ? ' disabled' : '';
    return '<button class="tab" role="tab" data-stage="' + t.key + '" aria-selected="' + (i === 0 ? 'true' : 'false') + '"' + disabled + '>' +
      t.label + ' <span class="count">' + (stageCounts[t.key] || 0) + '</span></button>';
  }).join('');
  var tabEls = Array.prototype.slice.call($tabs.querySelectorAll('.tab'));
  tabEls.forEach(function (tab, i) {
    tab.addEventListener('click', function () {
      if (tab.hasAttribute('disabled')) return;
      tabEls.forEach(function (t) { t.setAttribute('aria-selected', 'false'); });
      tab.setAttribute('aria-selected', 'true');
      state.stage = tab.dataset.stage;
      apply();
    });
    tab.addEventListener('keydown', function (e) {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      var dir = e.key === 'ArrowRight' ? 1 : -1;
      var next = i;
      for (var step = 0; step < tabEls.length; step++) {
        next = (next + dir + tabEls.length) % tabEls.length;
        if (!tabEls[next].hasAttribute('disabled')) break;
      }
      tabEls[next].focus();
      tabEls[next].click();
    });
  });

  /* Chips */
  var topicCounts = {};
  opts.items.forEach(function (it) {
    opts.getTopics(it).forEach(function (t) { topicCounts[t] = (topicCounts[t] || 0) + 1; });
  });
  var topicOrder = Object.keys(opts.labels).filter(function (t) { return topicCounts[t]; });
  $chips.innerHTML = topicOrder.map(function (t) {
    return '<button class="chip" type="button" data-topic="' + t + '" aria-pressed="false">' +
      MODO.escapeHTML(opts.labels[t]) + ' <span aria-hidden="true">·</span> ' + topicCounts[t] + '</button>';
  }).join('');
  $chips.querySelectorAll('.chip').forEach(function (chip) {
    chip.addEventListener('click', function () {
      var topic = chip.dataset.topic;
      var pressed = chip.getAttribute('aria-pressed') === 'true';
      chip.setAttribute('aria-pressed', String(!pressed));
      if (pressed) state.topics.delete(topic);
      else state.topics.add(topic);
      apply();
    });
  });

  /* Search / sort / clear */
  $search.addEventListener('input', function () { state.search = $search.value; apply(); });
  $sort.addEventListener('change', function () { state.sort = $sort.value; apply(); });
  $clear.addEventListener('click', function () {
    state.search = ''; $search.value = '';
    state.stage = 'all';
    state.topics.clear();
    tabEls.forEach(function (t) { t.setAttribute('aria-selected', String(t.dataset.stage === 'all')); });
    $chips.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', 'false'); });
    apply();
  });

  function apply() {
    var q = state.search.trim().toLowerCase();
    var filtered = opts.items.filter(function (it) {
      if (state.stage !== 'all' && it.status !== state.stage) return false;
      if (state.topics.size > 0 && !opts.getTopics(it).some(function (t) { return state.topics.has(t); })) return false;
      if (q && opts.searchHaystack(it).toLowerCase().indexOf(q) === -1) return false;
      return true;
    });

    filtered.sort(opts.sortFn(state.sort));
    $list.innerHTML = filtered.map(opts.itemTpl).join('');

    var total = opts.items.length;
    $count.textContent = filtered.length === total
      ? total + ' ' + opts.noun
      : filtered.length + ' de ' + total + ' ' + opts.noun;

    $empty.hidden = filtered.length > 0;
    $list.hidden = filtered.length === 0;

    var filtersActive = !!state.search || state.stage !== 'all' || state.topics.size > 0;
    $clear.hidden = !filtersActive;

    /* Wire version toggles after render (RFC saga) */
    $list.querySelectorAll('.versions-toggle').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var panel = document.getElementById(btn.dataset.target);
        if (!panel) return;
        var open = panel.classList.toggle('open');
        btn.dataset.open = String(open);
        var text = btn.textContent;
        btn.textContent = text.replace(/^[+−]\s*/, '').replace(/^/, open ? '− ' : '+ ');
      });
    });
  }

  apply();
  return { apply: apply };
};
