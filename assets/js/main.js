/* Catalyxt Nexus — shared site behaviour */
(function () {
  'use strict';

  var header = document.getElementById('siteHeader');
  var menuToggle = document.getElementById('menuToggle');
  var mobileMenu = document.getElementById('mobileMenu');

  /* Header shadow on scroll */
  var onScroll = function () {
    var y = window.scrollY || document.documentElement.scrollTop;
    if (header) header.classList.toggle('is-scrolled', y > 8);

    var progress = document.getElementById('progressBar');
    if (progress) {
      var h = document.documentElement;
      var total = h.scrollHeight - h.clientHeight;
      progress.style.width = (total > 0 ? (h.scrollTop / total) * 100 : 0) + '%';
    }

    var topBtn = document.getElementById('backToTop');
    if (topBtn) topBtn.classList.toggle('is-visible', y > 500);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Mobile menu */
  if (menuToggle && mobileMenu) {
    menuToggle.addEventListener('click', function () {
      var open = mobileMenu.classList.toggle('is-open');
      menuToggle.classList.toggle('is-open', open);
      menuToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    var mmLinks = mobileMenu.querySelectorAll('a,button');
    Array.prototype.forEach.call(mmLinks, function (link) {
      link.addEventListener('click', function () {
        mobileMenu.classList.remove('is-open');
        menuToggle.classList.remove('is-open');
      });
    });
  }

  /* Back to top */
  var backToTop = document.getElementById('backToTop');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* FAQ accordion (delegated) */
  document.addEventListener('click', function (e) {
    var item = e.target.closest ? e.target.closest('.faq-item') : null;
    if (!item) return;
    var q = item.querySelector('.faq-q');
    var a = item.querySelector('.faq-a');
    if (!q || !a) return;
    var open = item.classList.toggle('is-open');
    a.style.maxHeight = open ? a.scrollHeight + 'px' : '0px';
  });

  var activeFaq = function () {
    document.querySelectorAll('.faq-item.is-open .faq-a').forEach(function (a) {
      a.style.maxHeight = a.scrollHeight + 'px';
    });
  };
  window.addEventListener('load', activeFaq);
  window.addEventListener('resize', activeFaq);

  /* Reveal on scroll */
  var revealEls = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* Set reveal stagger from inline data attribute set on parents */
  document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      if (child.hasAttribute('data-reveal')) {
        child.style.setProperty('--reveal-delay', Math.min(i * 70, 420) + 'ms');
      }
    });
  });

  /* Active nav link based on current page */
  var page = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  if (!page) page = 'index.html';
  document.querySelectorAll('.nav a.nav-link, .mobile-menu a.mm-link').forEach(function (link) {
    if (link.getAttribute('href') === page) link.classList.add('is-current');
  });
})();