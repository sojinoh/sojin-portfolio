(function () {
  // Auto-stagger sibling .sr elements within the same parent
  const groups = new Map();
  document.querySelectorAll('.sr').forEach(el => {
    const parent = el.parentElement;
    if (!groups.has(parent)) groups.set(parent, []);
    groups.get(parent).push(el);
  });
  groups.forEach(siblings => {
    siblings.forEach((el, i) => {
      if (i > 0) el.style.transitionDelay = `${i * 0.08}s`;
    });
  });

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('sr-show');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  document.querySelectorAll('.sr').forEach(el => observer.observe(el));
})();
