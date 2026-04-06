/* ==========================================================================
   KATE JIE YU - STRATEGIC PRODUCT UX DESIGNER
   Staff Portfolio JavaScript - Clean, Modern, Performance-Optimized
   No jQuery dependencies, vanilla JS only
   ========================================================================== */

(function() {
  'use strict';

  // Global state
  let nav, navToggle, navMenu;
  let isKeyboardUser = false;

  /* ==========================================================================
     INITIALIZATION
     ========================================================================== */

  function init() {
    cacheDOM();
    bindEvents();
    setupAccessibility();
    setupProgressiveEnhancement();
  }

  function cacheDOM() {
    nav = document.getElementById('nav');
    navToggle = document.getElementById('nav-toggle');
    navMenu = document.getElementById('nav-menu');
  }

  function bindEvents() {
    // Mobile navigation
    if (navToggle && navMenu) {
      navToggle.addEventListener('click', handleMobileNavToggle);
    }

    // Close mobile menu when clicking nav links
    if (navMenu) {
      navMenu.addEventListener('click', handleNavLinkClick);
    }

    // Close mobile menu when clicking outside
    document.addEventListener('click', handleOutsideClick);

    // Close mobile menu on window resize
    window.addEventListener('resize', handleResize);

    // Smooth scrolling for anchor links
    document.addEventListener('click', handleSmoothScroll);

    // Scroll effects
    window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
  }

  /* ==========================================================================
     MOBILE NAVIGATION
     ========================================================================== */

  function handleMobileNavToggle() {
    if (!navToggle || !navMenu) return;

    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;

    // Update ARIA attributes
    navToggle.setAttribute('aria-expanded', newState);

    // Toggle classes
    navMenu.classList.toggle('nav__menu--active', newState);

    // Prevent body scrolling when menu is open
    document.body.style.overflow = newState ? 'hidden' : '';
  }

  function handleNavLinkClick(e) {
    // Only close menu if clicking on a nav link
    if (e.target.classList.contains('nav__link')) {
      closeMobileNav();
    }
  }

  function handleOutsideClick(e) {
    if (!nav || !navMenu) return;
    
    if (!nav.contains(e.target) && navMenu.classList.contains('nav__menu--active')) {
      closeMobileNav();
    }
  }

  function handleResize() {
    // Close mobile nav if window is resized to desktop size
    if (window.innerWidth > 768) {
      closeMobileNav();
    }
  }

  function closeMobileNav() {
    if (!navToggle || !navMenu) return;

    navToggle.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('nav__menu--active');
    document.body.style.overflow = '';
  }

  /* ==========================================================================
     SMOOTH SCROLLING
     ========================================================================== */

  function handleSmoothScroll(e) {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const targetId = link.getAttribute('href');
    if (!targetId || targetId === '#') return;
    const targetElement = document.querySelector(targetId);

    if (!targetElement) return;

    e.preventDefault();

    // Close mobile menu if open
    closeMobileNav();

    // Account for fixed header
    const headerOffset = 80;
    const elementPosition = targetElement.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

  /* ==========================================================================
     SCROLL EFFECTS
     ========================================================================== */

  function handleScroll() {
    const currentScrollY = window.scrollY;
    
    // Add/remove scrolled class for styling
    if (nav) {
      nav.classList.toggle('nav--scrolled', currentScrollY > 10);
    }
  }

  /* ==========================================================================
     ACCESSIBILITY
     ========================================================================== */

  function setupAccessibility() {
    // Track keyboard usage
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleMouseDown);

    // Initialize proper ARIA states
    if (navToggle) {
      navToggle.setAttribute('aria-expanded', 'false');
    }
  }

  function handleKeyDown(e) {
    isKeyboardUser = true;
    document.body.classList.add('keyboard-navigation');
    
    // Close mobile menu with Escape key
    if (e.key === 'Escape' && navMenu && navMenu.classList.contains('nav__menu--active')) {
      closeMobileNav();
      
      // Return focus to toggle button
      if (navToggle) {
        navToggle.focus();
      }
    }
  }

  function handleMouseDown() {
    isKeyboardUser = false;
    document.body.classList.remove('keyboard-navigation');
  }

  /* ==========================================================================
     PROGRESSIVE ENHANCEMENT
     ========================================================================== */

  function setupProgressiveEnhancement() {
    // Only add animations if motion is not reduced
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return;
    }

    // Set up intersection observer for scroll animations
    if ('IntersectionObserver' in window) {
      setupScrollAnimations();
    }
  }

  function setupScrollAnimations() {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          // Stop observing once animated
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Set up elements for animation — grouped by parent for stagger
    const animateElements = document.querySelectorAll(
      '.impact__card, .work__card, .arch__cell, .arch__loop-step, .adl__card, .adl__exec-band,' +
      '.venture__card, .da__card, .leadership__item, .contact__link,' +
      '.cs-diag-cell, .cs-impact-card, .cs-decision-cell, .cs-outcome-cell'
    );

    // Group siblings so items in the same parent stagger
    const parentSeen = new Map();
    animateElements.forEach(el => {
      const parent = el.parentElement;
      const siblingIndex = parentSeen.has(parent) ? parentSeen.get(parent) + 1 : 0;
      parentSeen.set(parent, siblingIndex);

      const staggerDelay = Math.min(siblingIndex * 0.08, 0.4); // cap at 400ms
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.6s ease-out ${staggerDelay}s, transform 0.6s ease-out ${staggerDelay}s`;
      observer.observe(el);
    });
  }

  /* ==========================================================================
     UTILITIES
     ========================================================================== */

  function throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    }
  }

  function safeSetInnerHTML(element, html) {
    if (!element) {
      console.warn('Element not found when trying to set innerHTML');
      return;
    }
    element.innerHTML = html;
  }

  function safeQuerySelector(selector) {
    try {
      return document.querySelector(selector);
    } catch (error) {
      console.warn('Invalid selector:', selector, error);
      return null;
    }
  }

  /* ==========================================================================
     ERROR HANDLING
     ========================================================================== */

  function handleError(error, context) {
    // Only log in development
    if (window.location.hostname === 'localhost' || window.location.hostname.includes('127.0.0.1')) {
      console.error(`Portfolio Error in ${context}:`, error);
    }
  }

  // Global error handler
  window.addEventListener('error', function(e) {
    handleError(e.error, 'Global error handler');
  });

  // Unhandled promise rejection handler
  window.addEventListener('unhandledrejection', function(e) {
    handleError(e.reason, 'Unhandled promise rejection');
  });

  /* ==========================================================================
     PUBLIC API
     ========================================================================== */

  // Expose minimal API for debugging
  window.StaffPortfolio = {
    version: '1.0.0',
    closeMobileNav: closeMobileNav,
    init: init
  };

  /* ==========================================================================
     STARTUP
     ========================================================================== */

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();

/* ==========================================================================
   LAZY LOADING ENHANCEMENT
   ========================================================================== */

// Progressive enhancement for image lazy loading
(function() {
  'use strict';

  if (!('IntersectionObserver' in window)) {
    // Fallback: load all images immediately if no IntersectionObserver
    return;
  }

  const imageObserver = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        
        // Replace data-src with src if it exists
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        
        // Remove loading placeholder class
        img.classList.remove('loading');
        
        // Stop observing
        imageObserver.unobserve(img);
      }
    });
  });

  // Observe all images with loading="lazy"
  document.addEventListener('DOMContentLoaded', function() {
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');
    lazyImages.forEach(img => {
      img.classList.add('loading');
      imageObserver.observe(img);
    });
  });
})();

/* ==========================================================================
   MIGHTY COUPONS — PLATFORM ARCHITECTURE TOOLTIP
   Handles .arch__cell hover/focus tooltips using data-tip-* attributes.
   Separate from the existing cs-tooltip system (data-desc) on this page.
   ========================================================================== */

(function () {
  'use strict';

  var tip, tipTitle, tipFn, tipPurpose, tipImpact;
  var current = null;
  var OX = 16, OY = 20;

  function init() {
    tip       = document.getElementById('arch-tip');
    tipTitle  = document.getElementById('arch-tip-title');
    tipFn     = document.getElementById('arch-tip-fn');
    tipPurpose= document.getElementById('arch-tip-purpose');
    tipImpact = document.getElementById('arch-tip-impact');
    if (!tip) return;

    document.addEventListener('mousemove', onMove);
    document.documentElement.addEventListener('mouseleave', hide);
    document.addEventListener('focusin', onFocus);
    document.addEventListener('focusout', onBlur);
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && current) hide();
    });
  }

  function show(el, x, y) {
    tipTitle.textContent   = el.dataset.tipTitle   || '';
    tipFn.textContent      = el.dataset.tipFn      || '';
    tipPurpose.textContent = el.dataset.tipPurpose || '';
    tipImpact.textContent  = el.dataset.tipImpact  || '';
    position(x, y);
    tip.classList.add('is-visible');
    tip.setAttribute('aria-hidden', 'false');
  }

  function hide() {
    tip.classList.remove('is-visible');
    tip.setAttribute('aria-hidden', 'true');
    current = null;
  }

  function position(x, y) {
    var tw = tip.offsetWidth  || 280;
    var th = tip.offsetHeight || 100;
    var left = x + OX;
    var top  = y + OY;
    if (left + tw > window.innerWidth  - 12) left = x - tw - OX;
    if (top  + th > window.innerHeight - 12) top  = y - th - OY;
    tip.style.left = left + 'px';
    tip.style.top  = top  + 'px';
  }

  function onMove(e) {
    var el = e.target.closest('[data-tip-title]');
    if (!el) {
      if (current) hide();
      return;
    }
    if (el !== current) {
      current = el;
      show(el, e.clientX, e.clientY);
    } else {
      position(e.clientX, e.clientY);
    }
  }

  function onFocus(e) {
    var el = e.target.closest('[data-tip-title]');
    if (!el) return;
    current = el;
    var r = el.getBoundingClientRect();
    show(el, r.left, r.bottom + 6);
  }

  function onBlur(e) {
    if (!e.relatedTarget || !e.relatedTarget.closest('[data-tip-title]')) hide();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
}());
