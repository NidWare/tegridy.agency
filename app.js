/* ============================================================
   Академия операторов — client logic
   Ported from the Claude Design DCLogic components to vanilla JS.
   - Theme:    localStorage['tegridy_academy_theme']  ('dark' | 'light')
   - Progress: localStorage['tegridy_academy_done']   ({ l1:true, ... })
   Cross-page/tab sync via the 'storage' + 'acad-progress' events.
   ============================================================ */
(function () {
  'use strict';

  var THEME_KEY = 'tegridy_academy_theme';
  var DONE_KEY = 'tegridy_academy_done';
  var TOTAL = 9;

  var LESSONS = [
    { id: 'l1', file: 'lesson-1.html', title: '1 урок. Знакомство с командой' },
    { id: 'l2', file: 'lesson-2.html', title: '2 урок. Рабочие задачи и условия сотрудничества' },
    { id: 'l3', file: 'lesson-3.html', title: '3 урок. Изучение платформы' },
    { id: 'l4', file: 'lesson-4.html', title: '4 урок. Важные правила агенства + тест' },
    { id: 'l5', file: 'lesson-5.html', title: '5 урок. Психология продаж' },
    { id: 'l6', file: 'lesson-6.html', title: '6 урок. Плавный чаттинг и правила продаж' },
    { id: 'l7', file: 'lesson-7.html', title: '7 урок. Правила платформы + тест' },
    { id: 'l8', file: 'lesson-8.html', title: '8 урок. Продажа кастомных видео' },
    { id: 'l9', file: 'lesson-9.html', title: '9 урок. Чек-лист рабочего дня + тест' }
  ];

  function readDone() {
    try {
      return JSON.parse(localStorage.getItem(DONE_KEY) || '{}') || {};
    } catch (e) {
      return {};
    }
  }

  function readTheme() {
    try {
      return localStorage.getItem(THEME_KEY) || 'dark';
    } catch (e) {
      return 'dark';
    }
  }

  /* ---------- Progress rendering ---------- */
  function renderProgress() {
    var done = readDone();
    var n = LESSONS.filter(function (l) { return done[l.id]; }).length;
    var pct = Math.round((n / TOTAL) * 100) + '%';

    document.querySelectorAll('[data-done-count]').forEach(function (el) {
      el.textContent = String(n);
    });
    document.querySelectorAll('[data-progress-fill]').forEach(function (el) {
      el.style.width = pct;
    });
    document.querySelectorAll('[data-lesson]').forEach(function (el) {
      el.classList.toggle('is-done', !!done[el.getAttribute('data-lesson')]);
    });

    // "Продолжить" — first uncompleted lesson (only when some progress exists)
    var next = LESSONS.filter(function (l) { return !done[l.id]; })[0];
    var hasProgress = n > 0 && !!next;
    document.querySelectorAll('[data-resume]').forEach(function (el) {
      if (hasProgress) {
        el.setAttribute('href', next.file);
        var t = el.querySelector('[data-resume-title]');
        if (t) t.textContent = next.title;
        el.hidden = false;
      } else {
        el.hidden = true;
      }
    });
  }

  /* ---------- Theme ---------- */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-acad-theme', theme);
  }

  function toggleTheme() {
    var next = readTheme() === 'light' ? 'dark' : 'light';
    try { localStorage.setItem(THEME_KEY, next); } catch (e) {}
    applyTheme(next);
    window.dispatchEvent(new Event('acad-progress'));
  }

  /* ---------- Mobile menu ---------- */
  var sideEl, overlayEl;

  function openMenu() {
    if (sideEl) sideEl.setAttribute('data-open', 'true');
    if (overlayEl) overlayEl.hidden = false;
  }
  function closeMenu() {
    if (sideEl) sideEl.setAttribute('data-open', 'false');
    if (overlayEl) overlayEl.hidden = true;
  }

  /* ---------- Wire up ---------- */
  function init() {
    sideEl = document.querySelector('.acad-side');
    overlayEl = document.querySelector('.acad-overlay');

    applyTheme(readTheme());
    renderProgress();

    document.querySelectorAll('[data-theme-toggle]').forEach(function (btn) {
      btn.addEventListener('click', toggleTheme);
    });
    document.querySelectorAll('[data-menu-open]').forEach(function (btn) {
      btn.addEventListener('click', openMenu);
    });
    document.querySelectorAll('[data-menu-close]').forEach(function (btn) {
      btn.addEventListener('click', closeMenu);
    });

    // Close the drawer when a sidebar link is tapped on mobile.
    if (sideEl) {
      sideEl.querySelectorAll('a[href]').forEach(function (a) {
        a.addEventListener('click', closeMenu);
      });
    }
    // Esc closes the drawer.
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeMenu();
    });

    // Keep in sync with other tabs / pages.
    window.addEventListener('storage', function () {
      applyTheme(readTheme());
      renderProgress();
    });
    window.addEventListener('acad-progress', renderProgress);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
