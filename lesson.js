/* ============================================================
   Академия операторов — lesson/methodичка page logic
   Ported from the per-lesson DCLogic component.
   - "Отметить пройденным" writes localStorage['tegridy_academy_done'][pageId]
   - Generic style-hover handler reproduces the DC runtime's hover behaviour
   Works together with app.js (theme, mobile menu, sidebar progress).
   ============================================================ */
(function () {
  'use strict';

  var DONE_KEY = 'tegridy_academy_done';
  var article = document.querySelector('article[data-page-id]');
  var pageId = article ? article.getAttribute('data-page-id') : null;

  function readDone() {
    try {
      return JSON.parse(localStorage.getItem(DONE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function render() {
    var done = !!readDone()[pageId];
    document.querySelectorAll('[data-when-done]').forEach(function (el) { el.hidden = !done; });
    document.querySelectorAll('[data-when-not-done]').forEach(function (el) { el.hidden = done; });
  }

  function toggleDone() {
    var map = readDone();
    if (map[pageId]) { delete map[pageId]; } else { map[pageId] = true; }
    try { localStorage.setItem(DONE_KEY, JSON.stringify(map)); } catch (e) {}
    render();
    window.dispatchEvent(new Event('acad-progress'));
  }

  // Reproduce DC's `style-hover`: swap inline style on hover/focus.
  function wireHover() {
    document.querySelectorAll('[style-hover]').forEach(function (el) {
      if (el.__hoverWired) return;
      el.__hoverWired = true;
      var base = el.getAttribute('style') || '';
      var hover = el.getAttribute('style-hover') || '';
      var on = function () { el.setAttribute('style', base + ';' + hover); };
      var off = function () { el.setAttribute('style', base); };
      el.addEventListener('mouseenter', on);
      el.addEventListener('mouseleave', off);
      el.addEventListener('focus', on);
      el.addEventListener('blur', off);
    });
  }

  function init() {
    wireHover();
    if (!pageId) return;
    render();
    document.querySelectorAll('[data-toggle-done]').forEach(function (b) {
      b.addEventListener('click', toggleDone);
    });
    window.addEventListener('storage', render);
    window.addEventListener('acad-progress', render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
