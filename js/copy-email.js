document.querySelectorAll('.copy-email-btn').forEach(btn => {
  const label = btn.querySelector('.copy-email-label');
  const original = label.textContent;
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(btn.dataset.email).then(() => {
      label.textContent = 'Copied!';
      btn.classList.add('copied');
      setTimeout(() => {
        label.textContent = original;
        btn.classList.remove('copied');
      }, 1500);
    });
  });
});
