/* ============================================================
   PREMIUM GLASSMORPHISM NAVBAR - JavaScript
   Handles scroll effects, mobile menu, and smooth interactions
   ============================================================ */

(function() {
  'use strict';

  // ── DOM ELEMENTS ──────────────────────────────────────────
  const navbar = document.querySelector('.premium-nav');
  const hamburger = document.querySelector('.premium-nav__hamburger');
  const mobileMenu = document.querySelector('.premium-nav__mobile-menu');
  const mobileOverlay = document.querySelector('.premium-nav__mobile-overlay');
  const mobileDropdownToggles = document.querySelectorAll('.premium-nav__mobile-link[data-dropdown]');
  
  // ── SCROLL EFFECT ─────────────────────────────────────────
  let lastScrollY = window.scrollY;
  let ticking = false;

  function updateNavbarOnScroll() {
    const scrollY = window.scrollY;
    
    if (scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    lastScrollY = scrollY;
    ticking = false;
  }

  function requestScrollUpdate() {
    if (!ticking) {
      window.requestAnimationFrame(updateNavbarOnScroll);
      ticking = true;
    }
  }

  window.addEventListener('scroll', requestScrollUpdate, { passive: true });

  // ── MOBILE MENU TOGGLE ────────────────────────────────────
  function toggleMobileMenu() {
    const isActive = mobileMenu.classList.contains('active');
    
    if (isActive) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }

  function openMobileMenu() {
    hamburger.classList.add('active');
    mobileMenu.classList.add('active');
    mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', closeMobileMenu);
  }

  // ── MOBILE DROPDOWN TOGGLE ───────────────────────────────
  mobileDropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e) {
      e.preventDefault();
      
      const dropdownId = this.getAttribute('data-dropdown');
      const dropdown = document.getElementById(dropdownId);
      
      if (dropdown) {
        const isActive = dropdown.classList.contains('active');
        
        // Close all other dropdowns
        document.querySelectorAll('.premium-nav__mobile-dropdown').forEach(dd => {
          if (dd !== dropdown) {
            dd.classList.remove('active');
          }
        });
        
        // Toggle current dropdown
        if (isActive) {
          dropdown.classList.remove('active');
        } else {
          dropdown.classList.add('active');
        }
      }
    });
  });

  // ── CLOSE MOBILE MENU ON LINK CLICK ──────────────────────
  const mobileLinks = document.querySelectorAll('.premium-nav__mobile-dropdown-item');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
    });
  });

  // ── SMOOTH SCROLL FOR ANCHOR LINKS ───────────────────────
  const anchorLinks = document.querySelectorAll('a[href^="#"]');
  anchorLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      
      if (href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        
        if (target) {
          e.preventDefault();
          
          const navHeight = navbar.offsetHeight;
          const targetPosition = target.getBoundingClientRect().top + window.scrollY - navHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
          
          closeMobileMenu();
        }
      }
    });
  });

  // ── CLOSE DROPDOWN ON OUTSIDE CLICK ──────────────────────
  document.addEventListener('click', function(e) {
    const isDropdownClick = e.target.closest('.premium-nav__item--dropdown');
    
    if (!isDropdownClick) {
      document.querySelectorAll('.premium-nav__dropdown').forEach(dropdown => {
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
      });
    }
  });

  // ── KEYBOARD NAVIGATION ──────────────────────────────────
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileMenu();
    }
  });

  // ── PREVENT SCROLL RESTORATION ───────────────────────────
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }

  // ── INITIALIZE ON LOAD ───────────────────────────────────
  window.addEventListener('load', () => {
    updateNavbarOnScroll();
  });

  // ── RESIZE HANDLER ───────────────────────────────────────
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (window.innerWidth > 768) {
        closeMobileMenu();
      }
    }, 250);
  });

})();
