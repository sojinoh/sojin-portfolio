(function () {
  const timeline = document.querySelector('.timeline-v');
  if (!timeline) return;

  const progress = timeline.querySelector('.timeline-v-progress');
  const stops = [...timeline.querySelectorAll('.timeline-v-stop')];
  const lastNode = stops[stops.length - 1].querySelector('.timeline-v-node');
  const PLAYHEAD_FRACTION = 0.35;

  let ticking = false;

  function update() {
    ticking = false;
    const rect = timeline.getBoundingClientRect();
    const playheadY = window.innerHeight * PLAYHEAD_FRACTION;
    const maxFill = lastNode.getBoundingClientRect().top - rect.top + lastNode.offsetHeight / 2;
    const fillPx = Math.max(0, Math.min(playheadY - rect.top, maxFill));

    progress.style.height = `${fillPx}px`;

    stops.forEach(stop => {
      const node = stop.querySelector('.timeline-v-node');
      const nodeOffset = node.getBoundingClientRect().top - rect.top + node.offsetHeight / 2;
      stop.classList.toggle('active', nodeOffset <= fillPx);
    });
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
})();
