/* SyncoPro – Investor Presentation
   Slide nav · Sidebar · Theme · Print modal · Password gate */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     SLIDE DATA
  ───────────────────────────────────────────── */
  var SLIDES = [
    { num: '01', label: 'Cover' },
    { num: '02', label: 'The Structural Problem' },
    { num: '03', label: 'Why It Matters' },
    { num: '04', label: 'Existing Tools' },
    { num: '05', label: 'Core Insight' },
    { num: '06', label: 'Why Now' },
    { num: '07', label: 'MVP Focus' },
    { num: '08', label: 'Product Flow' },
    { num: '09', label: 'Observed Patterns' },
    { num: '10', label: 'Validation Plan' },
    { num: '11', label: 'Failure Modes' },
    { num: '12', label: 'Risk Mitigation' },
    { num: '13', label: 'Beachhead Market' },
    { num: '14', label: 'Business Model' },
    { num: '15', label: 'Roadmap' },
    { num: '16', label: 'Team' },
    { num: '17', label: 'The Ask' }
  ];
  var TOTAL = SLIDES.length;

  /* ─────────────────────────────────────────────
     ACCESS CONFIG
     Slides 01-04 (index 0-3) = "Context" - public
     Slides 05-17 (index 4-16) = restricted
  ───────────────────────────────────────────── */
  var PASSWORD   = 'SyncoPro2025';
  var PUBLIC_MAX = 3;       // last free index (0-based), inclusive
  var unlocked   = false;
  var gateTarget = null;    // slide user was trying to reach

  /* ─────────────────────────────────────────────
     STATE
  ───────────────────────────────────────────── */
  var current     = 0;
  var isDark      = false;
  var sidebarOpen = false;
  var modalOpen   = false;
  var gateOpen    = false;

  var printSelected = new Set();
  for (var _i = 0; _i < TOTAL; _i++) { printSelected.add(_i); }

  /* ─────────────────────────────────────────────
     DOM — PRESENTATION
  ───────────────────────────────────────────── */
  var slidePages    = document.querySelectorAll('.slide-page');
  var sidebar       = document.querySelector('.sidebar');
  var sidebarBdrop  = document.querySelector('.backdrop');
  var navItems      = document.querySelectorAll('.slide-nav-item');
  var progressFill  = document.querySelector('.progress-bar-fill');
  var slideNumEl    = document.querySelector('.slide-num-display');
  var slideLabelEl  = document.querySelector('.slide-label-display');
  var counterEl     = document.querySelector('.slide-counter');
  var mainContent   = document.querySelector('.main-content');
  var prevBtns      = document.querySelectorAll('.btn-prev');
  var nextBtns      = document.querySelectorAll('.btn-next');
  var printBtns     = document.querySelectorAll('.btn-print');
  var themeBtns     = document.querySelectorAll('.btn-theme');
  var menuBtn       = document.querySelector('.menu-btn');
  var hoverZone     = document.querySelector('.hover-zone');
  var floatBar      = document.querySelector('.float-bar');
  var floatControls = document.querySelector('.float-controls');

  /* ─────────────────────────────────────────────
     DOM — PRINT MODAL
  ───────────────────────────────────────────── */
  var pmBackdrop = document.getElementById('pmBackdrop');
  var pmModal    = document.getElementById('pmModal');
  var pmClose    = document.getElementById('pmClose');
  var pmCancel   = document.getElementById('pmCancel');
  var pmConfirm  = document.getElementById('pmConfirm');
  var pmGrid     = document.getElementById('pmGrid');
  var pmCount    = document.getElementById('pmCount');
  var pmAll      = document.getElementById('pmAll');
  var pmNone     = document.getElementById('pmNone');
  var pmCurrent  = document.getElementById('pmCurrent');

  /* ─────────────────────────────────────────────
     DOM — PASSWORD GATE
  ───────────────────────────────────────────── */
  var gateBackdrop = document.getElementById('gateBackdrop');
  var gateModal    = document.getElementById('gateModal');
  var gateInput    = document.getElementById('gateInput');
  var gateSubmit   = document.getElementById('gateSubmit');
  var gateClose    = document.getElementById('gateClose');
  var gateToggle   = document.getElementById('gateToggle');
  var gateError    = document.getElementById('gateError');

  /* ─────────────────────────────────────────────
     ACCESS HELPERS
  ───────────────────────────────────────────── */
  function isLocked(idx) {
    return idx > PUBLIC_MAX && !unlocked;
  }

  function applyLockUI() {
    navItems.forEach(function (item, i) {
      item.classList.remove('locked', 'locked-clickable');
      if (isLocked(i)) {
        item.classList.add('locked-clickable');
      }
    });
  }

  /* ─────────────────────────────────────────────
     GATE — open / close / submit
  ───────────────────────────────────────────── */
  function openGate(targetIdx) {
    gateOpen   = true;
    gateTarget = (targetIdx !== undefined) ? targetIdx : PUBLIC_MAX + 1;
    if (gateBackdrop) gateBackdrop.classList.add('open');
    if (gateModal)    gateModal.classList.add('open');
    if (gateError)    gateError.classList.remove('show');
    if (gateInput) {
      gateInput.value = '';
      gateInput.classList.remove('shake');
      setTimeout(function () { gateInput.focus(); }, 60);
    }
  }

  function closeGate() {
    gateOpen = false;
    if (gateBackdrop) gateBackdrop.classList.remove('open');
    if (gateModal)    gateModal.classList.remove('open');
    if (gateInput)    gateInput.classList.remove('shake');
    if (gateError)    gateError.classList.remove('show');
  }

  function submitGate() {
    if (!gateInput) return;
    var val = gateInput.value.trim();
    if (val === PASSWORD) {
      unlocked = true;
      closeGate();
      applyLockUI();
      var dest = (gateTarget !== null) ? gateTarget : PUBLIC_MAX + 1;
      current = dest;
      updateView();
      closeSidebar();
    } else {
      gateInput.value = '';
      gateInput.classList.remove('shake');
      void gateInput.offsetWidth; // reflow for animation restart
      gateInput.classList.add('shake');
      setTimeout(function () {
        gateInput.classList.remove('shake');
        gateInput.focus();
      }, 380);
      if (gateError) gateError.classList.add('show');
    }
  }

  /* ─────────────────────────────────────────────
     SLIDE NAVIGATION
  ───────────────────────────────────────────── */
  function updateView() {
    slidePages.forEach(function (page, i) {
      page.style.display = (i === current) ? 'block' : 'none';
    });
    navItems.forEach(function (item, i) {
      item.classList.toggle('active', i === current);
    });
    var pct = ((current + 1) / TOTAL) * 100;
    if (progressFill)  progressFill.style.width  = pct + '%';
    if (slideNumEl)    slideNumEl.textContent     = SLIDES[current].num;
    if (slideLabelEl)  slideLabelEl.textContent   = SLIDES[current].label;
    if (counterEl)     counterEl.textContent      = (current + 1) + ' / ' + TOTAL;
    prevBtns.forEach(function (b) { b.disabled = (current === 0); });
    nextBtns.forEach(function (b) { b.disabled = (current === TOTAL - 1); });
    if (mainContent) mainContent.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function goNext() {
    if (current >= TOTAL - 1) return;
    var next = current + 1;
    if (isLocked(next)) { openGate(next); }
    else { current = next; updateView(); }
  }

  function goPrev() {
    if (current > 0) { current--; updateView(); }
  }

  function goTo(i) {
    if (isLocked(i)) { openGate(i); return; }
    current = i;
    updateView();
    closeSidebar();
  }

  /* ─────────────────────────────────────────────
     SIDEBAR
  ───────────────────────────────────────────── */
  function openSidebar() {
    sidebarOpen = true;
    if (sidebar)       sidebar.classList.add('open');
    if (sidebarBdrop)  sidebarBdrop.classList.add('visible');
    if (floatBar)      floatBar.classList.add('hidden');
    if (floatControls) {
      floatControls.style.opacity       = '0';
      floatControls.style.pointerEvents = 'none';
    }
  }

  function closeSidebar() {
    sidebarOpen = false;
    if (sidebar)       sidebar.classList.remove('open');
    if (sidebarBdrop)  sidebarBdrop.classList.remove('visible');
    if (floatBar)      floatBar.classList.remove('hidden');
    if (floatControls) {
      floatControls.style.opacity       = '1';
      floatControls.style.pointerEvents = 'auto';
    }
  }

  /* ─────────────────────────────────────────────
     THEME TOGGLE
  ───────────────────────────────────────────── */
  var SUN_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>';
  var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>';

  function toggleTheme() {
    isDark = !isDark;
    document.documentElement.classList.toggle('dark', isDark);
    themeBtns.forEach(function (b) {
      b.innerHTML = isDark ? SUN_SVG : MOON_SVG;
    });
  }

  /* ─────────────────────────────────────────────
     PRINT MODAL — grid
  ───────────────────────────────────────────── */
  function buildGrid() {
    if (!pmGrid) return;
    pmGrid.innerHTML = '';
    SLIDES.forEach(function (s, idx) {
      var card = document.createElement('div');
      var locked = isLocked(idx);
      card.className   = 'pm-card' + (locked ? ' pm-locked' : ' sel');
      card.dataset.idx = String(idx);
      card.innerHTML =
        (locked ? '' : '<div class="pm-chk"></div>') +
        '<div class="pm-num">' + s.num + '</div>' +
        '<div class="pm-label">' + s.label + (locked ? ' 🔒' : '') + '</div>';
      if (!locked) {
        card.addEventListener('click', function () { toggleCard(idx, card); });
      }
      pmGrid.appendChild(card);
    });
  }

  function toggleCard(idx, card) {
    if (printSelected.has(idx)) {
      printSelected.delete(idx);
      card.classList.remove('sel');
    } else {
      printSelected.add(idx);
      card.classList.add('sel');
    }
    refreshCount();
  }

  function setAll(state) {
    if (!pmGrid) return;
    pmGrid.querySelectorAll('.pm-card:not(.pm-locked)').forEach(function (card) {
      var idx = parseInt(card.dataset.idx, 10);
      if (state) { printSelected.add(idx);    card.classList.add('sel'); }
      else        { printSelected.delete(idx); card.classList.remove('sel'); }
    });
    refreshCount();
  }

  function selectCurrentOnly() {
    if (!pmGrid) return;
    printSelected.clear();
    pmGrid.querySelectorAll('.pm-card').forEach(function (card) {
      var idx = parseInt(card.dataset.idx, 10);
      if (idx === current && !isLocked(idx)) {
        printSelected.add(idx);
        card.classList.add('sel');
      } else {
        card.classList.remove('sel');
      }
    });
    refreshCount();
  }

  function refreshCount() {
    var n = printSelected.size;
    if (pmCount)   pmCount.textContent = n + ' of ' + TOTAL + ' selected';
    if (pmConfirm) pmConfirm.disabled  = (n === 0);
  }

  /* ─────────────────────────────────────────────
     PRINT MODAL — open / close
  ───────────────────────────────────────────── */
  function openModal() {
    if (!pmModal || !pmBackdrop) return;
    modalOpen = true;
    buildGrid();
    // Default: select only accessible slides
    printSelected.clear();
    pmGrid.querySelectorAll('.pm-card:not(.pm-locked)').forEach(function (card) {
      var idx = parseInt(card.dataset.idx, 10);
      printSelected.add(idx);
      card.classList.add('sel');
    });
    refreshCount();
    if (pmGrid) pmGrid.scrollTop = 0;
    pmBackdrop.classList.add('open');
    pmModal.classList.add('open');
    pmModal.setAttribute('aria-hidden', 'false');
    if (pmClose) pmClose.focus();
  }

  function closeModal() {
    if (!pmModal || !pmBackdrop) return;
    modalOpen = false;
    pmBackdrop.classList.remove('open');
    pmModal.classList.remove('open');
    pmModal.setAttribute('aria-hidden', 'true');
  }

  /* ─────────────────────────────────────────────
     PRINT MODAL — execute print
  ───────────────────────────────────────────── */
  function executePrint() {
    var lastSelectedIdx = -1;
    slidePages.forEach(function (page, i) {
      if (printSelected.has(i)) { lastSelectedIdx = i; }
    });
    slidePages.forEach(function (page, i) {
      page.removeAttribute('data-print-last');
      if (printSelected.has(i)) {
        page.classList.add('print-selected');
        if (i === lastSelectedIdx) { page.setAttribute('data-print-last', ''); }
      } else {
        page.classList.remove('print-selected');
      }
    });
    closeModal();
    setTimeout(function () {
      window.print();
      function cleanup() {
        slidePages.forEach(function (p) {
          p.classList.remove('print-selected');
          p.removeAttribute('data-print-last');
        });
        window.removeEventListener('afterprint', cleanup);
      }
      if ('onafterprint' in window) {
        window.addEventListener('afterprint', cleanup);
        setTimeout(cleanup, 30000);
      } else {
        setTimeout(cleanup, 3000);
      }
    }, 220);
  }

  /* ─────────────────────────────────────────────
     KEYBOARD
  ───────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    if (gateOpen) {
      if (e.key === 'Enter')  { e.preventDefault(); submitGate(); }
      if (e.key === 'Escape') { closeGate(); }
      return;
    }
    if (e.key === 'Escape') {
      if (modalOpen)   { closeModal();   return; }
      if (sidebarOpen) { closeSidebar(); return; }
    }
    if (modalOpen) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') { e.preventDefault(); goNext(); }
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   { e.preventDefault(); goPrev(); }
  });

  /* ─────────────────────────────────────────────
     WIRE UP ALL BUTTONS
  ───────────────────────────────────────────── */
  prevBtns.forEach(function (b) { b.addEventListener('click', goPrev); });
  nextBtns.forEach(function (b) { b.addEventListener('click', goNext); });
  printBtns.forEach(function (b) { b.addEventListener('click', openModal); });
  themeBtns.forEach(function (b) { b.addEventListener('click', toggleTheme); });

  if (menuBtn)      menuBtn.addEventListener('click', openSidebar);
  if (sidebarBdrop) sidebarBdrop.addEventListener('click', closeSidebar);
  if (hoverZone)    hoverZone.addEventListener('mouseenter', function () {
    if (!modalOpen && !gateOpen) openSidebar();
  });
  if (sidebar) sidebar.addEventListener('mouseleave', closeSidebar);

  navItems.forEach(function (item, i) {
    item.addEventListener('click', function () {
      if (isLocked(i)) {
        closeSidebar();
        openGate(i);
      } else {
        goTo(i);
      }
    });
  });

  if (pmClose)    pmClose.addEventListener('click', closeModal);
  if (pmCancel)   pmCancel.addEventListener('click', closeModal);
  if (pmConfirm)  pmConfirm.addEventListener('click', executePrint);
  if (pmBackdrop) pmBackdrop.addEventListener('click', closeModal);
  if (pmAll)      pmAll.addEventListener('click', function () { setAll(true); });
  if (pmNone)     pmNone.addEventListener('click', function () { setAll(false); });
  if (pmCurrent)  pmCurrent.addEventListener('click', selectCurrentOnly);

  if (gateSubmit) gateSubmit.addEventListener('click', submitGate);
  if (gateClose)  gateClose.addEventListener('click', closeGate);
  if (gateToggle) gateToggle.addEventListener('click', function () {
    if (!gateInput) return;
    var isHidden = gateInput.type === 'password';
    gateInput.type = isHidden ? 'text' : 'password';
    var eyeShow = gateToggle.querySelector('.eye-show');
    var eyeHide = gateToggle.querySelector('.eye-hide');
    if (eyeShow) eyeShow.style.display = isHidden ? 'none' : '';
    if (eyeHide) eyeHide.style.display = isHidden ? '' : 'none';
    gateToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    gateInput.focus();
  });
  if (gateInput)  gateInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); submitGate(); }
    if (gateError) gateError.classList.remove('show');
  });

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  applyLockUI();
  buildGrid();
  updateView();

})();
