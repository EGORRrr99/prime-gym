(function () {
  'use strict';

  // ─── STICKY HEADER ───────────────────────────────────────
  var header = document.getElementById('header');
  window.addEventListener('scroll', function () {
    if (window.scrollY > 40) {
      header.classList.add('header--scrolled');
    } else {
      header.classList.remove('header--scrolled');
    }
  }, { passive: true });

  // ─── MOBILE MENU ─────────────────────────────────────────
  var burger = document.getElementById('burger');
  var overlay = document.getElementById('overlay');
  var overlayClose = document.getElementById('overlayClose');
  var overlayLinks = overlay.querySelectorAll('.overlay__link');

  function openOverlay() {
    overlay.classList.add('overlay--open');
    document.body.style.overflow = 'hidden';
  }
  function closeOverlay() {
    overlay.classList.remove('overlay--open');
    document.body.style.overflow = '';
  }

  burger.addEventListener('click', openOverlay);
  overlayClose.addEventListener('click', closeOverlay);
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeOverlay();
  });
  overlayLinks.forEach(function (link) {
    link.addEventListener('click', closeOverlay);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('overlay--open')) {
      closeOverlay();
    }
  });

  // ─── SCROLL REVEAL ───────────────────────────────────────
  var revealSections = document.querySelectorAll('.section--dark, .hero, .trust');
  revealSections.forEach(function (el) {
    el.classList.add('fade-in-up');
  });

  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in-up--visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    revealSections.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealSections.forEach(function (el) {
      el.classList.add('fade-in-up--visible');
    });
  }

  // ─── PHONE MASK ──────────────────────────────────────────
  var phoneInput = document.getElementById('formPhone');
  if (phoneInput) {
    phoneInput.addEventListener('input', function () {
      var digits = this.value.replace(/\D/g, '');
      if (digits.length === 0) { this.value = ''; return; }
      if (digits[0] === '7' || digits[0] === '8') {
        digits = digits.substring(1);
      }
      var formatted = '+7';
      if (digits.length > 0) formatted += ' (' + digits.substring(0, 3);
      if (digits.length >= 4) formatted += ') ' + digits.substring(3, 6);
      if (digits.length >= 7) formatted += '-' + digits.substring(6, 8);
      if (digits.length >= 9) formatted += '-' + digits.substring(8, 10);
      this.value = formatted;
    });
  }

  // ─── FORM VALIDATION ─────────────────────────────────────
  var form = document.getElementById('form');
  var nameInput = document.getElementById('formName');
  var successMsg = document.getElementById('formSuccess');

  function isValidPhone(val) {
    var digits = val.replace(/\D/g, '');
    return digits.length === 12;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var valid = true;

      if (!nameInput.value.trim()) {
        nameInput.classList.add('form__input--error');
        valid = false;
      } else {
        nameInput.classList.remove('form__input--error');
      }

      if (!isValidPhone(phoneInput.value)) {
        phoneInput.classList.add('form__input--error');
        valid = false;
      } else {
        phoneInput.classList.remove('form__input--error');
      }

      if (valid) {
        form.reset();
        successMsg.classList.add('form__success--visible');
        setTimeout(function () {
          successMsg.classList.remove('form__success--visible');
        }, 4000);
      }
    });

    nameInput.addEventListener('input', function () {
      this.classList.remove('form__input--error');
    });
    phoneInput.addEventListener('input', function () {
      this.classList.remove('form__input--error');
    });
  }

  // ─── REVIEWS SLIDER ──────────────────────────────────────
  var track = document.getElementById('reviewsTrack');
  var prevBtn = document.getElementById('reviewsPrev');
  var nextBtn = document.getElementById('reviewsNext');
  var dotsContainer = document.getElementById('reviewsDots');

  if (track && prevBtn && nextBtn) {
    var cards = track.querySelectorAll('.review-card');
    var totalSlides = cards.length;
    var currentSlide = 0;
    var slidesPerView = 1;

    function calcSlidesPerView() {
      if (window.innerWidth > 760) return 3;
      return 1;
    }

    function getMaxSlide() {
      var spv = calcSlidesPerView();
      return Math.max(0, totalSlides - spv);
    }

    function updateSlider() {
      var spv = calcSlidesPerView();
      var gap = spv > 1 ? 24 : 16;
      var cardWidth = track.querySelector('.review-card').offsetWidth;
      var offset = currentSlide * (cardWidth + gap);
      track.style.transform = 'translateX(-' + offset + 'px)';
      updateDots();
    }

    function updateDots() {
      var spv = calcSlidesPerView();
      var dotCount = Math.max(1, totalSlides - spv + 1);
      dotsContainer.innerHTML = '';
      for (var i = 0; i < dotCount; i++) {
        var dot = document.createElement('button');
        dot.className = 'reviews__dot' + (i === currentSlide ? ' reviews__dot--active' : '');
        dot.setAttribute('aria-label', 'Отзыв ' + (i + 1));
        dot.addEventListener('click', function (idx) {
          return function () { currentSlide = idx; updateSlider(); };
        }(i));
        dotsContainer.appendChild(dot);
      }
    }

    prevBtn.addEventListener('click', function () {
      if (currentSlide > 0) currentSlide--;
      updateSlider();
    });
    nextBtn.addEventListener('click', function () {
      var max = getMaxSlide();
      if (currentSlide < max) currentSlide++;
      updateSlider();
    });

    updateDots();
    updateSlider();

    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(function () {
        var max = getMaxSlide();
        if (currentSlide > max) currentSlide = max;
        updateSlider();
      }, 200);
    });
  }

  // ─── FAQ ACCORDION ───────────────────────────────────────
  var faqItems = document.querySelectorAll('.faq__item');
  faqItems.forEach(function (item) {
    var question = item.querySelector('.faq__question');
    question.addEventListener('click', function () {
      var isOpen = item.classList.contains('faq__item--open');
      faqItems.forEach(function (el) {
        el.classList.remove('faq__item--open');
        el.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
      });
      if (!isOpen) {
        item.classList.add('faq__item--open');
        item.querySelector('.faq__question').setAttribute('aria-expanded', 'true');
      }
    });
  });

})();