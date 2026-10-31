(function () {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  function isScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight + 40;
  }

  // Flip once the visitor has scrolled about one screen down.
  function hasStartedReading() {
    return window.scrollY > window.innerHeight * 0.8;
  }

  // One button, two jobs. A down chevron at the top to show there's more,
  // then a back-to-top arrow once you've started reading.
  function update() {
    const toTop = hasStartedReading();
    hint.classList.toggle('hidden', !isScrollable());
    hint.classList.toggle('to-top', toTop);
    const label = toTop ? 'Back to top' : 'Scroll down';
    hint.setAttribute('aria-label', label);
    hint.title = label;
  }

  hint.addEventListener('click', () => {
    if (hint.classList.contains('to-top')) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
    }
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  // Project pages load their content after the page opens, so re-check when it grows.
  // Body is fixed at 100% height, so watch the page sections inside it.
  if ('ResizeObserver' in window) {
    const ro = new ResizeObserver(update);
    [...document.body.children].forEach(el => ro.observe(el));
  }
  update();
})();
