/* Bóveda — feed unificado.
   Ingiere los 7 manifests, normaliza a `{type,title,desc,tags[],maturity,date,href}`,
   renderiza cards text-only y filtra client-side por tipo+madurez+search.
   Back-links v1: tag-overlap >= 2 entre items. */

(function () {
  'use strict';

  var TYPE_LABELS = {
    deck: 'DECK', rfc: 'RFC', rd: 'R&D', postman: 'POSTMAN',
    skill: 'SKILL', proyecto: 'PROYECTO', bitacora: 'BITÁCORA'
  };

  var MATURITY_LABELS = {
    draft: 'Draft', 'en-curso': 'En curso', shipped: 'Shipped', archivado: 'Archivado'
  };

  function mapDeckStatus(s) {
    if (s === 'draft') return 'draft';
    if (s === 'rfc') return 'en-curso';
    if (s === 'completo') return 'shipped';
    if (s === 'archivado') return 'archivado';
    return 'shipped';
  }
  function mapRfcStatus(s) {
    if (!s) return 'shipped';
    s = String(s).toLowerCase();
    if (s.indexOf('draft') >= 0) return 'draft';
    if (s.indexOf('rfc') >= 0 || s.indexOf('review') >= 0) return 'en-curso';
    if (s.indexOf('archiv') >= 0 || s.indexOf('superseded') >= 0) return 'archivado';
    return 'shipped';
  }
  function mapRdStatus(s) {
    if (s === 'exploración' || s === 'exploracion') return 'draft';
    if (s === 'síntesis' || s === 'sintesis') return 'en-curso';
    if (s === 'completo') return 'shipped';
    if (s === 'archivado') return 'archivado';
    return 'shipped';
  }
  function mapPostmanEnv(e) {
    if (e === 'local') return 'draft';
    if (e === 'qa' || e === 'preprod') return 'en-curso';
    if (e === 'prod') return 'shipped';
    return 'shipped';
  }
  function mapProyectoActivity(last) {
    if (!last) return 'archivado';
    var d = new Date(last);
    var days = (Date.now() - d.getTime()) / 86400000;
    if (days < 60) return 'shipped';
    if (days < 180) return 'en-curso';
    return 'archivado';
  }

  function normalizeDecks(d) {
    return (d && d.decks ? d.decks : []).map(function (x) {
      return {
        type: 'deck',
        title: x.title,
        desc: x.desc,
        tags: x.topics || [],
        maturity: mapDeckStatus(x.status),
        date: x.date,
        href: '../' + x.href.replace(/^\.\//, ''),
        meta: (x.audience || '') + (x.slides ? ' · ' + x.slides + ' slides' : '')
      };
    });
  }
  function normalizeRfcs(d) {
    return (d && d.rfcs ? d.rfcs : []).map(function (x) {
      var href = x.href || x.gdoc || x.url || '#';
      return {
        type: 'rfc',
        title: (x.number ? x.number + ' · ' : '') + x.title,
        desc: x.summary,
        tags: x.topics || x.tags || [],
        maturity: mapRfcStatus(x.status),
        date: x.date,
        href: href,
        meta: x.audience || ''
      };
    });
  }
  function normalizePostmans(d) {
    return (d && d.postmans ? d.postmans : []).map(function (x) {
      return {
        type: 'postman',
        title: x.title,
        desc: x.desc,
        tags: x.tags || [],
        maturity: mapPostmanEnv(x.env),
        date: x.date,
        href: x.url,
        meta: (x.category || '') + (x.env ? ' · ' + x.env : '')
      };
    });
  }
  function normalizeRd(d) {
    return (d && d.items ? d.items : []).map(function (x) {
      return {
        type: 'rd',
        title: (x.number ? x.number + ' · ' : '') + x.title,
        desc: x.summary,
        tags: x.tags || [],
        maturity: mapRdStatus(x.status),
        date: x.date,
        href: '../rd/' + x.href,
        meta: (x.area || '') + (x.reading_minutes ? ' · ' + x.reading_minutes + ' min' : '')
      };
    });
  }
  function normalizeSkills(d) {
    return (d && d.skills ? d.skills : []).map(function (x) {
      var first = (x.description || '').split(/[\.\n]/)[0] + (x.description && x.description.length > 90 ? '.' : '');
      return {
        type: 'skill',
        title: x.name,
        desc: x.description || '',
        tags: deriveTagsFromName(x.name),
        maturity: 'shipped',
        date: null,
        href: '../skills/' + x.filename,
        meta: x.size_kb ? Math.round(x.size_kb) + ' kB' : ''
      };
    });
  }
  function normalizeProyectos(d) {
    var out = [];
    (d && d.categories ? d.categories : []).forEach(function (cat) {
      (cat.projects || []).forEach(function (p) {
        out.push({
          type: 'proyecto',
          title: p.repo,
          desc: p.summary,
          tags: [cat.id, p.language ? p.language.toLowerCase() : null].filter(Boolean),
          maturity: mapProyectoActivity(p.last),
          date: p.last ? p.last.slice(0, 10) : null,
          href: 'https://github.com/' + p.repo,
          meta: (p.merged || 0) + ' merged · ' + (p.open || 0) + ' open'
        });
      });
    });
    return out;
  }
  function normalizeBitacora(d) {
    return (d && d.items ? d.items : []).map(function (x) {
      var tagSet = {};
      (x.stories || []).forEach(function (s) { (s.tags || []).forEach(function (t) { tagSet[t] = 1; }); });
      return {
        type: 'bitacora',
        title: x.title,
        desc: x.tldr,
        tags: Object.keys(tagSet).slice(0, 5),
        maturity: 'shipped',
        date: x.date,
        href: '../bitacora/' + x.slug + '.html',
        meta: (x.stories ? x.stories.length + ' historias' : '')
      };
    });
  }

  function deriveTagsFromName(name) {
    var s = String(name).toLowerCase();
    var tags = [];
    if (s.indexOf('modo-') === 0) tags.push('modo');
    if (s.indexOf('seo') >= 0 || s.indexOf('geo') >= 0) tags.push('seo');
    if (s.indexOf('deck') >= 0) tags.push('decks');
    if (s.indexOf('pr-') >= 0) tags.push('prs');
    if (s.indexOf('promos') >= 0) tags.push('promos');
    if (s.indexOf('jsm') >= 0) tags.push('jira');
    if (s.indexOf('whatsapp') >= 0 || s.indexOf('cx') >= 0) tags.push('cx');
    if (s.indexOf('design') >= 0) tags.push('design-system');
    tags.push('claude-skill');
    return tags;
  }

  function fetchJson(path) {
    return fetch(path, { cache: 'no-cache' })
      .then(function (r) { return r.ok ? r.json() : null; })
      .catch(function () { return null; });
  }

  function computeBacklinks(items) {
    // For each item, find up to 3 related items from a different type, scored by tag overlap.
    var byId = items.map(function (it) { return new Set(it.tags || []); });
    items.forEach(function (it, i) {
      if (!it.tags || !it.tags.length) { it._related = []; return; }
      var scored = [];
      for (var j = 0; j < byId.length; j++) {
        if (j === i || items[j].type === it.type) continue;
        var overlap = 0;
        byId[j].forEach(function (t) { if (byId[i].has(t)) overlap++; });
        if (overlap >= 1) scored.push({ s: overlap, item: items[j] });
      }
      scored.sort(function (a, b) { return b.s - a.s; });
      it._related = scored.slice(0, 3).map(function (x) { return x.item; });
    });
  }

  function fmtDate(d) {
    if (!d) return '';
    return d.length >= 10 ? d.slice(0, 10) : d;
  }

  function renderCard(it) {
    var typeLabel = TYPE_LABELS[it.type] || it.type;
    var matLabel = MATURITY_LABELS[it.maturity] || it.maturity;
    var tagsHtml = (it.tags || []).slice(0, 3).map(function (t) {
      return '<span class="vault-item-tag">' + MODO.escapeHTML(t) + '</span>';
    }).join('');
    var metaBits = [];
    if (it.date) metaBits.push('<span>' + MODO.escapeHTML(fmtDate(it.date)) + '</span>');
    if (it.meta) metaBits.push('<span>' + MODO.escapeHTML(it.meta) + '</span>');
    if (tagsHtml) metaBits.push(tagsHtml);
    var metaHtml = metaBits.join('<span class="sep" aria-hidden="true">·</span>');

    var relatedHtml = '';
    if (it._related && it._related.length) {
      relatedHtml = '<div class="vault-related"><span class="vault-related-label">Aparece en:</span>' +
        it._related.map(function (r) {
          return '<a href="' + MODO.escapeHTML(r.href) + '">' +
            MODO.escapeHTML((TYPE_LABELS[r.type] || r.type) + ' · ' + r.title) + '</a>';
        }).join('<span class="sep" aria-hidden="true"> · </span>') + '</div>';
    }

    var isExternal = /^https?:/.test(it.href);
    var attrs = isExternal ? 'target="_blank" rel="noopener noreferrer"' : '';

    return (
      '<article class="vault-item">' +
        '<a class="vault-item-link" href="' + MODO.escapeHTML(it.href) + '" ' + attrs + '>' +
          '<div class="vault-item-head">' +
            '<span class="vault-badge type-' + it.type + '">' + typeLabel + '</span>' +
            '<span class="status-badge ' + (it.maturity === 'en-curso' ? 'rfc' : (it.maturity === 'shipped' ? 'completo' : (it.maturity === 'draft' ? 'draft' : 'archivado'))) + '">' + matLabel + '</span>' +
          '</div>' +
          '<h2 class="vault-item-title">' + MODO.escapeHTML(it.title) + '</h2>' +
          '<p class="vault-item-desc">' + MODO.escapeHTML(it.desc || '') + '</p>' +
          '<div class="vault-item-meta">' + metaHtml + '</div>' +
        '</a>' +
        relatedHtml +
      '</article>'
    );
  }

  function sortByRecency(items) {
    return items.slice().sort(function (a, b) {
      var da = a.date || '0000-00-00';
      var db = b.date || '0000-00-00';
      return db.localeCompare(da);
    });
  }

  function init() {
    var $feed = document.getElementById('vault-feed');
    var $count = document.getElementById('vault-count');
    var $search = document.getElementById('vault-search');
    var $pillsType = document.getElementById('vault-pills-type');
    var $pillsMaturity = document.getElementById('vault-pills-maturity');

    var state = {
      all: [],
      type: 'all',
      maturity: 'all',
      q: ''
    };

    function filterAndRender() {
      var q = state.q.trim().toLowerCase();
      var filtered = state.all.filter(function (it) {
        if (state.type !== 'all' && it.type !== state.type) return false;
        if (state.maturity !== 'all' && it.maturity !== state.maturity) return false;
        if (!q) return true;
        var hay = (it.title + ' ' + (it.desc || '') + ' ' + (it.tags || []).join(' ')).toLowerCase();
        return hay.indexOf(q) >= 0;
      });
      $count.textContent = filtered.length + ' elementos';
      if (!filtered.length) {
        $feed.innerHTML = '<div class="vault-empty">Sin resultados para los filtros activos. Probá quitar uno o cambiar la búsqueda.</div>';
        return;
      }
      $feed.innerHTML = filtered.map(renderCard).join('');
    }

    function bindPills(group, key) {
      group.addEventListener('click', function (e) {
        var btn = e.target.closest('.vault-pill');
        if (!btn) return;
        var v = btn.getAttribute('data-value');
        state[key] = v;
        Array.prototype.forEach.call(group.querySelectorAll('.vault-pill'), function (b) {
          b.classList.toggle('is-active', b === btn);
        });
        filterAndRender();
      });
    }

    bindPills($pillsType, 'type');
    bindPills($pillsMaturity, 'maturity');

    $search.addEventListener('input', function (e) {
      state.q = e.target.value;
      filterAndRender();
    });

    Promise.all([
      fetchJson('../decks/decks.json'),
      fetchJson('../rfcs/rfcs.json'),
      fetchJson('../postmans/postmans.json'),
      fetchJson('../rd/rd.json'),
      fetchJson('../skills/skills.json'),
      fetchJson('../proyectos/proyectos.json'),
      fetchJson('../bitacora/bitacora.json')
    ]).then(function (rs) {
      var items = []
        .concat(normalizeDecks(rs[0]))
        .concat(normalizeRfcs(rs[1]))
        .concat(normalizePostmans(rs[2]))
        .concat(normalizeRd(rs[3]))
        .concat(normalizeSkills(rs[4]))
        .concat(normalizeProyectos(rs[5]))
        .concat(normalizeBitacora(rs[6]));

      items = sortByRecency(items);
      computeBacklinks(items);
      state.all = items;
      filterAndRender();
    }).catch(function (err) {
      $feed.innerHTML = '<div class="vault-empty">No se pudo cargar la bóveda. Probá recargar.</div>';
      console.error(err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
