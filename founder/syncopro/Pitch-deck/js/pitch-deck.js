/* app.js — SyncoPro Investor Deck (Scroll Edition) + Password Gate */

(function () {
  'use strict';

  /* ─────────────────────────────────────────────
     ACCESS CONFIG
     Slides 1-4 (index 0-3) = public
     Slides 5-14 (index 4-13) = locked
  ───────────────────────────────────────────── */
  var PASSWORD   = 'SyncoPro2025';
  var PUBLIC_MAX = 4;   // last free index (0-based), inclusive — slides 1-5 are public
  var unlocked   = false;
  var gateOpen   = false;

  /* ─────────────────────────────────────────────
     SLIDE / NAV DOM
  ───────────────────────────────────────────── */
  var slides   = Array.from(document.querySelectorAll('.slide'));
  var counter  = document.getElementById('nav-counter');
  var btnPrev  = document.getElementById('btn-prev');
  var btnNext  = document.getElementById('btn-next');
  var btnMenu  = document.getElementById('btn-menu');
  var navMenu  = document.getElementById('nav-menu');
  var menuList = document.getElementById('nav-menu-list');

  var total        = slides.length;
  var currentIndex = 0;
  var menuOpen     = false;

  /* ─────────────────────────────────────────────
     GATE DOM
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

  /* ─────────────────────────────────────────────
     BUILD NAV MENU
  ───────────────────────────────────────────── */
  slides.forEach(function (slide, i) {
    var label = slide.getAttribute('data-label') || ('Section ' + (i + 1));
    var id    = slide.id;

    var li = document.createElement('li');
    var a  = document.createElement('a');
    a.href = '#' + id;

    var numSpan = document.createElement('span');
    numSpan.className   = 'menu-num';
    numSpan.textContent = String(i + 1).padStart(2, '0');

    a.appendChild(numSpan);
    a.appendChild(document.createTextNode(label));

    if (isLocked(i)) {
      a.classList.add('is-locked');
    }

    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (isLocked(i)) {
        closeMenu();
        openGate();
      } else {
        scrollToSlide(i);
        closeMenu();
      }
    });

    li.appendChild(a);
    menuList.appendChild(li);
  });

  function getMenuLinks() {
    return Array.from(menuList.querySelectorAll('a'));
  }

  /* ─────────────────────────────────────────────
     SCROLL HELPERS
  ───────────────────────────────────────────── */
  function scrollToSlide(index) {
    if (index < 0 || index >= total) return;

    // If target is locked and not unlocked, open gate and stay put
    if (isLocked(index)) {
      openGate();
      return;
    }

    slides[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function updateCounter(index) {
    currentIndex = index;
    counter.textContent = (index + 1) + ' / ' + total;

    var links = getMenuLinks();
    links.forEach(function (a, i) {
      a.classList.toggle('is-active', i === index);
    });

    btnPrev.style.opacity = index === 0 ? '0.3' : '1';
    btnNext.style.opacity = index === total - 1 ? '0.3' : '1';
  }

  /* ─────────────────────────────────────────────
     INTERSECTION OBSERVER
     Intercept when user scrolls into a locked slide
  ───────────────────────────────────────────── */
  var scrollBlocked = false;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          var idx = slides.indexOf(entry.target);
          if (idx === -1) return;

          if (isLocked(idx)) {
            // Bounce back to last free slide and open gate
            if (!scrollBlocked) {
              scrollBlocked = true;
              slides[PUBLIC_MAX].scrollIntoView({ behavior: 'smooth', block: 'start' });
              setTimeout(function () { scrollBlocked = false; }, 800);
              openGate();
            }
          } else {
            updateCounter(idx);
          }
        }
      });
    },
    { threshold: 0.45 }
  );

  slides.forEach(function (slide) {
    observer.observe(slide);
  });

  /* ─────────────────────────────────────────────
     NAV BUTTONS
  ───────────────────────────────────────────── */
  btnPrev.addEventListener('click', function () {
    scrollToSlide(currentIndex - 1);
  });

  btnNext.addEventListener('click', function () {
    scrollToSlide(currentIndex + 1);
  });

  /* ─────────────────────────────────────────────
     MENU
  ───────────────────────────────────────────── */
  function openMenu() {
    menuOpen = true;
    navMenu.classList.add('is-open');
    navMenu.setAttribute('aria-hidden', 'false');
    btnMenu.setAttribute('aria-expanded', 'true');
  }

  function closeMenu() {
    menuOpen = false;
    navMenu.classList.remove('is-open');
    navMenu.setAttribute('aria-hidden', 'true');
    btnMenu.setAttribute('aria-expanded', 'false');
  }

  btnMenu.addEventListener('click', function (e) {
    e.stopPropagation();
    menuOpen ? closeMenu() : openMenu();
  });

  document.addEventListener('click', function (e) {
    if (menuOpen && !navMenu.contains(e.target) && e.target !== btnMenu) {
      closeMenu();
    }
  });

  /* ─────────────────────────────────────────────
     GATE — open / close / submit
  ───────────────────────────────────────────── */
  function openGate() {
    if (unlocked) return;
    gateOpen = true;
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

      // Unlock all locked slides
      slides.forEach(function (slide) {
        if (slide.classList.contains('slide--locked')) {
          slide.classList.add('slide--unlocked');
        }
      });

      // Update nav menu — remove lock styling
      getMenuLinks().forEach(function (a) {
        a.classList.remove('is-locked');
      });

      // Scroll to first previously locked slide (slide 5, index 4)
      slides[PUBLIC_MAX + 1].scrollIntoView({ behavior: 'smooth', block: 'start' });

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

  /* Gate button wiring */
  if (gateSubmit) gateSubmit.addEventListener('click', submitGate);
  if (gateClose)  gateClose.addEventListener('click', closeGate);

  if (gateToggle) gateToggle.addEventListener('click', function () {
    if (!gateInput) return;
    var isHidden = gateInput.type === 'password';
    gateInput.type = isHidden ? 'text' : 'password';
    var eyeHide = gateToggle.querySelector('.eye-hide');
    var eyeShow = gateToggle.querySelector('.eye-show');
    if (eyeHide) eyeHide.style.display = isHidden ? 'none' : '';
    if (eyeShow) eyeShow.style.display = isHidden ? '' : 'none';
    gateToggle.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');
    gateInput.focus();
  });

  if (gateInput) gateInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') { e.preventDefault(); submitGate(); }
    if (gateError) gateError.classList.remove('show');
  });

  // Wire "Unlock slides" button on the first locked slide overlay
  document.querySelectorAll('[data-gate-trigger]').forEach(function (btn) {
    btn.addEventListener('click', openGate);
  });

  /* ─────────────────────────────────────────────
     KEYBOARD
  ───────────────────────────────────────────── */
  document.addEventListener('keydown', function (e) {
    // Gate takes priority
    if (gateOpen) {
      if (e.key === 'Escape') { closeGate(); return; }
      return; // block all other keys while gate is open
    }

    if (e.key === 'Escape' && menuOpen) { closeMenu(); return; }

    // Don't intercept if user is typing
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      scrollToSlide(currentIndex + 1);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollToSlide(currentIndex - 1);
    }
  });

  /* ─────────────────────────────────────────────
     TOUCH SWIPE
  ───────────────────────────────────────────── */
  var touchStartY = 0;

  document.addEventListener('touchstart', function (e) {
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  document.addEventListener('touchend', function (e) {
    var delta = touchStartY - e.changedTouches[0].clientY;
    if (Math.abs(delta) > 60) {
      delta > 0 ? scrollToSlide(currentIndex + 1) : scrollToSlide(currentIndex - 1);
    }
  }, { passive: true });

  /* ─────────────────────────────────────────────
     INIT
  ───────────────────────────────────────────── */
  updateCounter(0);

})();
