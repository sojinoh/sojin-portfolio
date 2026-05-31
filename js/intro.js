(function () {
  // ── State ──────────────────────────────────────────────────
  let hi   = '';
  let rest = '';
  let tag  = '';
  let cur  = 'hi'; // which segment the cursor sits after

  // ── Render ─────────────────────────────────────────────────
  function render() {
    const c    = '<span class="intro-cursor">|</span>';
    const hiHtml   = `<span class="hi">${hi}</span>`;
    const hiBlock  = cur === 'hi'   ? `<span class="hi">${hi}</span>${c}` : hiHtml;
    const restBlock = cur === 'rest' ? `${rest}${c}` : rest;
    const tagBlock  = (tag || cur === 'tag')
      ? `<p class="intro-tag">${tag}${cur === 'tag' ? c : ''}</p>`
      : '';
    document.getElementById('intro-typed').innerHTML =
      `<h1>${hiBlock}${restBlock}</h1>${tagBlock}`;
  }

  // ── Helpers ─────────────────────────────────────────────────
  function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

  function typeInto(get, set, text, speed) {
    return new Promise(resolve => {
      let i = get().length;
      (function tick() {
        if (i <= text.length) {
          set(text.slice(0, i++));
          render();
          setTimeout(tick, speed + (Math.random() * 22 - 11));
        } else {
          resolve();
        }
      })();
    });
  }

  function eraseFrom(get, set, speed) {
    return new Promise(resolve => {
      (function tick() {
        const v = get();
        if (v.length > 0) {
          set(v.slice(0, -1));
          render();
          setTimeout(tick, speed + (Math.random() * 12 - 6));
        } else {
          resolve();
        }
      })();
    });
  }

  // ── Settle ──────────────────────────────────────────────────
  function settle() {
    document.getElementById('intro').classList.add('intro--exit');
    document.getElementById('hero').classList.add('hero--visible');
    document.getElementById('nav').classList.add('nav--visible');
    setTimeout(initChat, 450);
  }

  // ── Sequence ─────────────────────────────────────────────────
  async function runIntro() {
    render();                                         // show blinking cursor
    await wait(150);

    cur = 'hi';
    await typeInto(() => hi, v => { hi = v; }, 'Hi,', 50);
    await wait(30);
    cur = 'rest';
    render();
    await typeInto(() => rest, v => { rest = v; }, " I'm Sojin.", 45);
    await wait(200);

    cur = '';
    tag = 'chat with me — i\'d love to tell you more 💛';
    render();
    await wait(1300);
    settle();
  }

  window.addEventListener('DOMContentLoaded', runIntro);
})();
