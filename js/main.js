/**
* Template Name: Restaurantly
* Template URL: https://bootstrapmade.com/restaurantly-restaurant-template/
* Updated: Aug 07 2024 with Bootstrap v5.3.3
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    if (mobileNavToggleBtn) {
      mobileNavToggleBtn.classList.toggle('bi-list');
      mobileNavToggleBtn.classList.toggle('bi-x');
    }
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Smooth scroll to same-page/hash links and hide hash from the URL
   */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId && targetId !== '#') {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          
          // Close mobile menu if active
          if (document.querySelector('.mobile-nav-active')) {
            mobileNavToogle();
          }

          // Calculate correct scroll position taking header offset into account
          const headerOffset = 90; // Header height
          const elementPosition = targetElement.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.scrollY - headerOffset;

          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          });
        }
      }
    });
  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader - Fast Instant Fade Out
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    const removePreloader = () => {
      if (preloader.classList.contains('preloader-removed')) return;
      preloader.classList.add('preloader-removed');
      preloader.style.opacity = '0';
      preloader.style.pointerEvents = 'none';
      setTimeout(() => {
        if (preloader.parentNode) preloader.remove();
      }, 250);
    };

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      removePreloader();
    } else {
      document.addEventListener('DOMContentLoaded', removePreloader);
    }

    window.addEventListener('load', removePreloader);
    setTimeout(removePreloader, 500);
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  if (scrollTop) {
    scrollTop.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);



/**
 * Animation on scroll function and init
 */
function aos_init() {
    AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,
        mirror: false,
        offset: 80
    });
}
window.addEventListener('load', () => {
    aos_init();
});


  

  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);
  
  if (typeof jQuery !== 'undefined' && typeof jQuery.fn.easyResponsiveTabs === 'function') {
    $('#horizontalTab').easyResponsiveTabs({
      type: 'default', //Types: default, vertical, accordion
      width: 'auto', //auto or any width like 600px
      fit: true, // 100% fit in a container
      closed: 'accordion', // Start closed if in accordion view
      tabidentify: 'hor_1', // The tab groups identifier
      activate: function(event) { // Callback function if tab is switched
        var $tab = $(this);
        var $info = $('#nested-tabInfo');
        var $name = $('span', $info);
        $name.text($tab.text());
        $info.show();
      }
    });
  }

  if (typeof jQuery !== 'undefined') {
    $(window).scroll(function() {
      if ($(this).scrollTop() > 800) {
        $('.hide-desk svg').addClass('active');
      }
    });
  }

  // Initialize Swiper Sliders
  if (typeof Swiper !== 'undefined') {
    // Initialize Swiper for "Life at EIM"
    if (document.querySelector('.life-swiper')) {
      new Swiper('.life-swiper', {
        loop: true,
        centeredSlides: true,
        slidesPerView: 1.15,
        spaceBetween: 16,
        autoplay: {
          delay: 3500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.life-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          768: {
            slidesPerView: 1.6,
            spaceBetween: 24,
          },
          1024: {
            slidesPerView: 1.5,
            spaceBetween: 32,
          }
        }
      });
    }

    // Initialize Swiper for "News / Press"
    if (document.querySelector('.news-swiper')) {
      new Swiper('.news-swiper', {
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        autoHeight: false,
        autoplay: {
          delay: 6500,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: '.press-swiper-next',
          prevEl: '.press-swiper-prev',
        },
      });
    }

    // Initialize Swiper for "Testimonials"
    if (document.querySelector('.testimonials-swiper')) {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1,
        spaceBetween: 24,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.testimonials-swiper-pagination',
          clickable: true,
        },
        navigation: {
          nextEl: '.testimonials-swiper-next',
          prevEl: '.testimonials-swiper-prev',
        },
        breakpoints: {
          992: {
            slidesPerView: 2,
            spaceBetween: 32,
            allowTouchMove: true,
          }
        }
      });
    }

    // Initialize Swiper for "Careers / Current Openings"
    if (document.querySelector('.careers-swiper')) {
      new Swiper('.careers-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 16,
        loop: false,
        pagination: {
          el: '.careers-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 24,
            allowTouchMove: false,
          }
        }
      });
    }

    // Initialize Swiper for "Awards & Recognition"
    if (document.querySelector('.awards-swiper')) {
      new Swiper('.awards-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 16,
        loop: false,
        autoplay: {
          delay: 4500,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.awards-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
            allowTouchMove: true,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
            allowTouchMove: true,
          }
        }
      });
    }
  }

  // Aceternity-Style Vertical Timeline Progress Line Handler
  const timelineWrapper = document.querySelector('.timeline-track-wrapper');
  const progressLine = document.querySelector('.timeline-active-progress-line');
  const entries = document.querySelectorAll('.timeline-entry');
  
  if (timelineWrapper && progressLine) {
    const handleTimelineScroll = () => {
      const rect = timelineWrapper.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      
      // Calculate active progress relative to screen offset
      const startPoint = viewHeight * 0.8; // Starts when top reaches 80% of screen height
      const endPoint = viewHeight * 0.5;   // Ends when bottom reaches 50% of screen height
      
      const totalDist = rect.height;
      const currentDist = startPoint - rect.top;
      
      let progress = currentDist / totalDist;
      progress = Math.max(0, Math.min(1, progress));
      
      // Update glowing line height
      progressLine.style.height = `${progress * 100}%`;
      
      // Highlight active dot nodes and dates
      entries.forEach(entry => {
        const entryRect = entry.getBoundingClientRect();
        // Highlight node if its top is above 60% of viewport
        if (entryRect.top <= viewHeight * 0.6) {
          entry.classList.add('active-node');
        } else {
          entry.classList.remove('active-node');
        }
      });
    };
    
    window.addEventListener('scroll', handleTimelineScroll);
    window.addEventListener('resize', handleTimelineScroll);
    handleTimelineScroll(); // Run once on load
  }
})();

/**
 * Global Contact Form Validation
 */
function validate_form(form) {
  let isValid = true;
  const requiredInputs = form.querySelectorAll('[required]');
  
  // Reset previous validation states
  form.querySelectorAll('.floating-group').forEach(group => {
    group.classList.remove('has-error');
    const errorMsg = group.querySelector('.error-message');
    if (errorMsg) errorMsg.remove();
  });

  requiredInputs.forEach(input => {
    let value = input.value.trim();
    let group = input.closest('.floating-group');
    let errorText = '';

    if (!value) {
      isValid = false;
      errorText = 'This field is required';
    } else if (input.type === 'email') {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        isValid = false;
        errorText = 'Please enter a valid email address';
      }
    } else if (input.name === 'frmcontact') {
      const phonePattern = /^\d{10}$/; // Basic 10-digit validation
      if (!phonePattern.test(value.replace(/[-+()\s]/g, ''))) {
        isValid = false;
        errorText = 'Please enter a valid 10-digit mobile number';
      }
    }

    if (errorText) {
      isValid = false;
      if (group) {
        group.classList.add('has-error');
        const errorElement = document.createElement('span');
        errorElement.className = 'error-message';
        errorElement.textContent = errorText;
        group.appendChild(errorElement);
      }
    }
  });

  return isValid;
}

/* ==========================================================================
   TALEGAON PLANT INAUGURATION — 3D SCROLL-DRIVEN ANIMATED GALLERY ENGINE
   ========================================================================== */
(function initTalegaonAnimatedGallery() {
  document.addEventListener("DOMContentLoaded", function () {
    const section = document.getElementById("talegaon-inauguration");
    const track = document.getElementById("talegaon-scroll-track");
    const gallery3d = document.getElementById("talegaon-gallery-3d");
    const col1 = document.getElementById("talegaon-col-1");
    const col2 = document.getElementById("talegaon-col-2");
    const col3 = document.getElementById("talegaon-col-3");
    const openGalleryBtn = document.getElementById("talegaon-open-gallery");

    if (!section || !track || !gallery3d) return;

    // 1. Staggered Blur-Reveal for Header
    const revealItems = section.querySelectorAll(".talegaon-blur-reveal");
    if ("IntersectionObserver" in window) {
      const revealObs = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            revealItems.forEach(function (el) { el.classList.add("is-visible"); });
            revealObs.disconnect();
          }
        });
      }, { threshold: 0.05 });
      revealObs.observe(section.querySelector(".talegaon-header-wrap") || section);
    } else {
      revealItems.forEach(function (el) { el.classList.add("is-visible"); });
    }

    // 2. "View Event Gallery" button triggers Fancybox on first image
    if (openGalleryBtn) {
      openGalleryBtn.addEventListener("click", function () {
        const firstCard = section.querySelector(".talegaon-gallery-card");
        if (firstCard) firstCard.click();
      });
    }

    // Respect reduced motion preference
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    // 3. Smooth 60fps Scroll-Driven 3D Perspective + Opposing Parallax Engine
    function clamp(val, min, max) {
      return Math.min(Math.max(val, min), max);
    }

    function mapRange(val, inMin, inMax, outMin, outMax) {
      const t = clamp((val - inMin) / (inMax - inMin), 0, 1);
      return outMin + t * (outMax - outMin);
    }

    let currentProgress = 0;
    let targetProgress = 0;
    let rafId = null;

    function getTargetProgress() {
      const rect = track.getBoundingClientRect();
      const stickyEl = track.querySelector(".talegaon-scroll-sticky");
      const stickyTop = stickyEl ? parseFloat(window.getComputedStyle(stickyEl).top) || 0 : 0;
      const stickyHeight = stickyEl ? stickyEl.offsetHeight : window.innerHeight;
      const scrollable = track.offsetHeight - stickyHeight;
      if (scrollable <= 0) return 0;
      const scrolled = stickyTop - rect.top;
      return clamp(scrolled / scrollable, 0, 1);
    }

    function applyTransforms(p) {
      if (window.innerWidth <= 767) {
        gallery3d.style.transform = "";
        if (col1) col1.style.transform = "";
        if (col2) col2.style.transform = "";
        if (col3) col3.style.transform = "";
        return;
      }

      const isTablet = window.innerWidth <= 991;
      const maxRotate = isTablet ? 14 : 22;
      const maxScale = isTablet ? 1.02 : 1.03;

      // Stage 1 (0 -> 0.22): Straighten the 3D tilt first while Row 1 stays locked at y = 0px
      const rotateX = mapRange(p, 0, 0.22, maxRotate, 0);
      const scale = mapRange(p, 0, 0.22, maxScale, 1);

      // Dynamically measure each column overflow so EVERY photo scrolls completely into view
      const stickyEl = track.querySelector(".talegaon-scroll-sticky");
      const visibleH = stickyEl ? (stickyEl.clientHeight - 36) : (window.innerHeight - 156);

      const overflow1 = col1 ? Math.max(0, col1.offsetHeight - visibleH) : 0;
      const overflow2 = col2 ? Math.max(0, col2.offsetHeight - visibleH) : 0;
      const overflow3 = col3 ? Math.max(0, col3.offsetHeight - visibleH) : 0;

      // Stage 2 (0.28 -> 1.0): Begin scrolling columns ONLY after gallery is completely straight & Row 1 is fully seen
      const y1 = mapRange(p, 0.28, 1, 0, -overflow1);
      const y2 = mapRange(p, 0.28, 1, 0, -overflow2);
      const y3 = mapRange(p, 0.28, 1, 0, -overflow3);

      gallery3d.style.transform = "perspective(1000px) rotateX(" + rotateX.toFixed(2) + "deg) scale(" + scale.toFixed(4) + ")";
      if (col1) col1.style.transform = "translate3d(0, " + y1.toFixed(1) + "px, 0)";
      if (col2) col2.style.transform = "translate3d(0, " + y2.toFixed(1) + "px, 0)";
      if (col3) col3.style.transform = "translate3d(0, " + y3.toFixed(1) + "px, 0)";
    }

    function tick() {
      targetProgress = getTargetProgress();
      const diff = targetProgress - currentProgress;
      if (Math.abs(diff) > 0.0005) {
        currentProgress += diff * 0.14;
        applyTransforms(currentProgress);
        rafId = requestAnimationFrame(tick);
      } else {
        currentProgress = targetProgress;
        applyTransforms(currentProgress);
        rafId = null;
      }
    }

    function requestTick() {
      if (!rafId) {
        rafId = requestAnimationFrame(tick);
      }
    }

    // Initial pose
    currentProgress = getTargetProgress();
    applyTransforms(currentProgress);

    window.addEventListener("scroll", requestTick, { passive: true });
    window.addEventListener("resize", requestTick, { passive: true });
  });
})();
