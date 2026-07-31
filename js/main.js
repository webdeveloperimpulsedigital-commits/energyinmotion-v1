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
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    const removePreloader = () => {
      if (preloader.classList.contains('preloader-removed')) return;
      preloader.classList.add('preloader-removed');
      preloader.style.opacity = '0';
      setTimeout(() => {
        preloader.remove();
      }, 600); // matches the 0.6s transition in CSS
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(removePreloader, 300);
      });
    } else {
      setTimeout(removePreloader, 300);
    }

    window.addEventListener('load', removePreloader);
    setTimeout(removePreloader, 1500); // 1.5s safety fallback
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



    // Initialize Swiper for "Testimonials"
    if (document.querySelector('.testimonials-swiper')) {
      new Swiper('.testimonials-swiper', {
        slidesPerView: 1.1,
        spaceBetween: 16,
        loop: true,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false,
        },
        pagination: {
          el: '.testimonials-swiper-pagination',
          clickable: true,
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
        pagination: {
          el: '.awards-swiper-pagination',
          clickable: true,
        },
        breakpoints: {
          576: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          992: {
            slidesPerView: 3,
            spaceBetween: 30,
            allowTouchMove: false, // Static grid display on desktop
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