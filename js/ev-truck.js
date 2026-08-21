/* ==========================================================================
   ENERGY IN MOTION (EIM) — LANDING PAGE INTERACTION SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
  initHeaderScroll();
  initPillSelectors();
  initSmoothScroll();
  initFormHandlers();
  initModals();
  initTestimonialsSlider();
  initCoverflowSlider();
});

/**
 * 7. 3D Curved Coverflow Carousel (Apple TV / Lucid style)
 */
function initCoverflowSlider() {
  const container = document.querySelector('.eim-coverflow-slider');
  if (!container || typeof Swiper === 'undefined') return;

  new Swiper('.eim-coverflow-slider', {
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    slidesPerView: 'auto',
    initialSlide: 1,
    speed: 600,
    coverflowEffect: {
      rotate: 18,
      stretch: 0,
      depth: 200,
      modifier: 1,
      slideShadows: false,
    },
    navigation: {
      prevEl: '.eim-coverflow-prev',
      nextEl: '.eim-coverflow-next',
    },
    pagination: {
      el: '.eim-coverflow-pagination',
      clickable: true,
    },
    keyboard: {
      enabled: true,
    },
  });
}

/**
 * 1. Header scroll effect
 */
function initHeaderScroll() {
  const header = document.querySelector('.eim-landing-header');
  if (!header) return;

  function onScroll() {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/**
 * 2. Interest Pill Checkboxes / Tags Sync
 */
function initPillSelectors() {
  const formCards = document.querySelectorAll('.eim-lead-form-card, .eim-console-form');
  
  formCards.forEach(formCard => {
    const pills = formCard.querySelectorAll('.eim-interest-pill');
    pills.forEach(pill => {
      const input = pill.querySelector('input');
      if (!input) return;

      input.addEventListener('change', function () {
        // Active visual styling handled by CSS :checked selector
      });
    });
  });
}

/**
 * 3. Smooth scrolling for anchor CTAs
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');
  
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 90;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });

        // If target is a form, focus on first input
        const firstInput = targetEl.querySelector('input:not([type="hidden"])');
        if (firstInput) {
          setTimeout(() => firstInput.focus(), 600);
        }
      }
    });
  });
}

/**
 * 4. Form Submit Handling
 */
function initFormHandlers() {
  const forms = document.querySelectorAll('.eim-lead-form');
  
  forms.forEach(form => {
    form.addEventListener('submit', function (e) {
      const checkedPills = form.querySelectorAll('.eim-interest-pill input:checked');
      const selectedInterests = Array.from(checkedPills).map(cb => cb.value).join(', ');
      
      let interestInput = form.querySelector('input[name="frminterest"]');
      if (!interestInput) {
        interestInput = document.createElement('input');
        interestInput.type = 'hidden';
        interestInput.name = 'frminterest';
        form.appendChild(interestInput);
      }
      interestInput.value = selectedInterests || 'General Fleet Electrification';

      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) {
        submitBtn.innerHTML = '<span>Processing Requirement...</span> <i class="bi bi-arrow-repeat spin"></i>';
        submitBtn.style.pointerEvents = 'none';
        submitBtn.style.opacity = '0.85';
      }
    });
  });
}

/**
 * 5. Modals (Privacy Policy & Thank-You Modal)
 */
function initModals() {
  const privacyTriggers = document.querySelectorAll('[data-open-modal="privacy"]');
  const privacyModal = document.getElementById('privacyModal');
  const thankYouModal = document.getElementById('thankYouModal');
  const closeBtns = document.querySelectorAll('.eim-modal-close-btn, [data-close-modal]');

  privacyTriggers.forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      if (privacyModal) {
        privacyModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });

  closeBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      if (privacyModal) privacyModal.classList.remove('active');
      if (thankYouModal) thankYouModal.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  document.querySelectorAll('.eim-modal-backdrop').forEach(modal => {
    modal.addEventListener('click', function (e) {
      if (e.target === this) {
        this.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('status') === 'thankyou' && thankYouModal) {
    thankYouModal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

/**
 * 6. Testimonials Swiper Slider Initialization
 */
function initTestimonialsSlider() {
  if (typeof Swiper === 'undefined') return;
  const sliderEl = document.querySelector('.eim-testimonials-swiper');
  if (!sliderEl) return;

  new Swiper('.eim-testimonials-swiper', {
    slidesPerView: 1,
    spaceBetween: 20,
    loop: true,
    speed: 600,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    pagination: {
      el: '.eim-testimonials-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.eim-swiper-next',
      prevEl: '.eim-swiper-prev',
    },
    breakpoints: {
      320: {
        slidesPerView: 1,
        spaceBetween: 16,
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 24,
      },
      1200: {
        slidesPerView: 2,
        spaceBetween: 30,
      }
    }
  });
}
