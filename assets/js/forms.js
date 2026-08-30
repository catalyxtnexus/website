/* Catalyxt Nexus — modals + enquiry forms.
   Submissions keep the existing Google Apps Script endpoint and field names. */
(function () {
  'use strict';

  var ENDPOINT = 'https://script.google.com/macros/s/AKfycbzdDmvwxZ6iTMN6g6Mi_C20b8_DX5dPHjitaASbkan0KRzobGp56MYUFWzGl3TCHXxT/exec';

  var lastFocused = null;

  function setModal(modal, open) {
    if (!modal) return;
    if (open) {
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('modal-open');
      var closeBtn = modal.querySelector('.modal-close');
      if (closeBtn) closeBtn.focus();
    } else {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('modal-open');
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }
  }

  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(function (m) { setModal(m, false); });
  }

  /* Open/close triggers — delegated so any .open-plans / .open-join button works */
  document.addEventListener('click', function (e) {
    var t = e.target;
    var plansTrigger = t.closest ? t.closest('.open-plans') : null;
    var joinTrigger = t.closest ? t.closest('.open-join') : null;
    var closeBtn = t.closest ? t.closest('.modal-close') : null;
    var overlay = t.closest ? t.closest('.modal-overlay') : null;

    if (plansTrigger) {
      e.preventDefault();
      setModal(document.getElementById('plansModal'), true);
      var pf = document.getElementById('planForm');
      if (pf) setTimeout(function () { pf.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 120);
      return;
    }
    if (joinTrigger) {
      e.preventDefault();
      setModal(document.getElementById('joinModal'), true);
      var jf = document.getElementById('joinForm');
      if (jf) setTimeout(function () {
        var first = jf.querySelector('input[name="name"]');
        if (first) first.focus();
      }, 120);
      return;
    }
    if (closeBtn) { setModal(closeBtn.closest('.modal'), false); return; }
    if (overlay) { setModal(overlay.closest('.modal'), false); return; }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeAllModals();
  });

  /* ----- Plan selection (modal + pricing page) ----- */
  function initPlanTabs() {
    document.querySelectorAll('.plan-tab[data-plan], .price-card[data-plan]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.closest('.modal-tabs') || tab.parentNode;
        group.querySelectorAll('.plan-tab, .price-card').forEach(function (t) { t.classList.remove('is-selected'); });
        tab.classList.add('is-selected');
        var targetId = tab.getAttribute('data-plan-select');
        var select = targetId ? document.getElementById(targetId) : document.getElementById('preferredPlan');
        if (select) {
          select.value = tab.getAttribute('data-plan');
          select.dispatchEvent(new Event('change'));
        }
        var form = select ? select.closest('form') : null;
        form && setTimeout(function () { form.scrollIntoView({ behavior: 'smooth', block: 'center' }); }, 80);
      });
    });
  }

  /* ----- Platform selection (join modal) -----
     Platform tabs are also links; the default link behaviour is kept. */
  function initPlatformTabs() {
    document.querySelectorAll('.plan-tab[data-platform]').forEach(function (tab) {
      tab.addEventListener('click', function () {
        var group = tab.closest('.modal-tabs');
        if (group) group.querySelectorAll('.plan-tab').forEach(function (t) { t.classList.remove('is-selected'); });
        tab.classList.add('is-selected');
        var platformInput = document.getElementById('joinPlatform');
        if (platformInput) platformInput.value = tab.getAttribute('data-platform');
      });
    });
  }

  /* Pricing page: keep the selected-plan label in sync */
  var pricingSelect = document.getElementById('pricingPlan');
  var planLabel = document.getElementById('planLabel');
  if (pricingSelect && planLabel) {
    pricingSelect.addEventListener('change', function () {
      planLabel.textContent = pricingSelect.value;
    });
  }
  function submitForm(form, type, onSuccess, onError) {
    var btn = form.querySelector('button[type="submit"]');
    var original = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.textContent = 'Sending...';
    }
    var data = new FormData(form);
    data.append('type', type);

    fetch(ENDPOINT, { method: 'POST', body: data })
      .then(function (response) { return response.json(); })
      .then(function () { onSuccess(); })
      .catch(function (err) { onError(err); })
      .then(function () {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = original;
        }
      });
  }

  /* ----- Wire every enquiry form (driven by data-form attribute) ----- */
  function initForms() {
    document.querySelectorAll('form[data-form]').forEach(function (form) {
      var type = form.getAttribute('data-form');
      var isBrand = type === 'brand';
      var successMsg = isBrand
        ? '✅ Thanks! Your enquiry has been submitted successfully.'
        : type === 'creator'
          ? "✅ Thank you for joining Catalyxt Nexus! We'll contact you soon."
          : '✅ Thanks for reaching out! We\u2019ll get back to you shortly.';

      form.addEventListener('submit', function (e) {
        e.preventDefault();
        submitForm(form, type, function () {
          alert(successMsg);
          form.reset();
          var modal = form.closest('.modal');
          if (modal) {
            modal.querySelectorAll('.plan-tab').forEach(function (t) { t.classList.remove('is-selected'); });
            setModal(modal, false);
          } else {
            var group = form.previousElementSibling;
            if (group && group.querySelector) {
              group.querySelectorAll('.price-card.is-selected').forEach(function (t) { t.classList.remove('is-selected'); });
            }
          }
        }, function () {
          alert(isBrand
            ? '❌ Failed to send enquiry. Please try again.'
            : '❌ Something went wrong. Please try again.');
        });
      });
    });
  }

  initPlanTabs();
  initPlatformTabs();
  initForms();
})();