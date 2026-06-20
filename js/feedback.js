(function () {
  const toggleWrap = document.querySelector('.feedback-toggle-wrap');
  const toggle    = document.getElementById('feedback-toggle');
  const dismissBtn = document.getElementById('feedback-dismiss');
  const card      = document.getElementById('feedback-card');
  const closeBtn  = document.getElementById('feedback-close');
  const emojiRow  = document.getElementById('feedback-emojis');
  const quickRow  = document.getElementById('feedback-quick-replies');
  const textArea  = document.getElementById('feedback-text');
  const submitBtn = document.getElementById('feedback-submit');

  const HIDE_FOREVER_KEY = 'feedbackHiddenForever';

  if (localStorage.getItem(HIDE_FOREVER_KEY)) {
    toggleWrap.classList.add('hidden');
    return;
  }

  let selectedRating = null;

  function showCard() {
    card.classList.remove('hidden');
    toggle.classList.add('hidden');
  }

  function hideCard() {
    card.classList.add('hidden');
    toggle.classList.remove('hidden');
  }

  function dismissForSession() {
    sessionStorage.setItem('feedbackDismissed', '1');
  }

  toggle.addEventListener('click', showCard);

  dismissBtn.addEventListener('click', e => {
    e.stopPropagation();
    if (confirm('Hide the feedback button for good? You won\'t see it again on this site.')) {
      localStorage.setItem(HIDE_FOREVER_KEY, '1');
      toggleWrap.classList.add('hidden');
      card.classList.add('hidden');
    }
  });

  closeBtn.addEventListener('click', () => {
    hideCard();
    dismissForSession();
  });

  emojiRow.querySelectorAll('.feedback-emoji').forEach(btn => {
    btn.addEventListener('click', () => {
      emojiRow.querySelectorAll('.feedback-emoji').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedRating = btn.dataset.label;
      submitBtn.disabled = false;
    });
  });

  quickRow.querySelectorAll('.feedback-quick-reply').forEach(btn => {
    btn.addEventListener('click', () => {
      textArea.value = btn.textContent;
      textArea.focus();
    });
  });

  const WEB3FORMS_ACCESS_KEY = '45920915-ddf2-4afe-9697-1083c00e2e3a';

  submitBtn.addEventListener('click', () => {
    const note = textArea.value.trim();

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: 'Portfolio feedback: ' + (selectedRating || 'no rating'),
        from_name: 'Portfolio Feedback Widget',
        page: window.location.href,
        satisfaction: selectedRating || 'Not answered',
        message: note || '(nothing — just the rating!)',
      }),
    }).catch(err => console.error('Feedback submission failed:', err));

    card.innerHTML = '<div class="feedback-thanks">Thanks so much for sharing! 🙏💛</div>';
    dismissForSession();
    setTimeout(hideCard, 1800);
  });

  // ── Auto-trigger 30s into the visit, tracked site-wide across pages ──
  const VISIT_KEY   = 'feedbackVisitStart';
  const DISMISS_KEY = 'feedbackDismissed';
  const DELAY_MS    = 30 * 1000;

  let visitStart = parseInt(sessionStorage.getItem(VISIT_KEY), 10);
  if (!visitStart) {
    visitStart = Date.now();
    sessionStorage.setItem(VISIT_KEY, String(visitStart));
  }

  if (sessionStorage.getItem(DISMISS_KEY)) {
    // Already seen the prompt this session — leave the bubble available to reopen anytime.
    toggle.classList.remove('hidden');
  } else {
    const remaining = DELAY_MS - (Date.now() - visitStart);
    if (remaining <= 0) {
      showCard();
    } else {
      setTimeout(() => {
        if (!sessionStorage.getItem(DISMISS_KEY)) showCard();
      }, remaining);
    }
  }
})();
