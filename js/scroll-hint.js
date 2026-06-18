(function () {
  const hint = document.getElementById('scroll-hint');
  if (!hint) return;

  function isScrollable() {
    return document.documentElement.scrollHeight > window.innerHeight + 40;
  }

  function isNearBottom() {
    return window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60;
  }

  function update() {
    if (isScrollable() && !isNearBottom()) {
      hint.classList.remove('hidden');
    } else {
      hint.classList.add('hidden');
    }
  }

  hint.addEventListener('click', () => {
    window.scrollBy({ top: window.innerHeight * 0.8, behavior: 'smooth' });
  });

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
