// ── Avatar SVG ──────────────────────────────────────────────
const AVATAR_SVG = `<svg class="avatar" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="M32 52 C32 52, 9 37, 9 22 C9 14.5, 15 9, 21 9 C26 9, 30 12.5, 32 16 C34 12.5, 38 9, 43 9 C49 9, 55 14.5, 55 22 C55 37, 32 52, 32 52Z" fill="#FEFFAF" opacity="0.85"/>
  <circle cx="26" cy="25" r="2" fill="#4E7AB5"/>
  <circle cx="38" cy="25" r="2" fill="#4E7AB5"/>
  <path d="M26 33 Q32 38.5 38 33" stroke="#4E7AB5" stroke-width="2.5" fill="none" stroke-linecap="round"/>
</svg>`;

// ── DOM refs ─────────────────────────────────────────────────
const chatScroll    = document.getElementById('chatScroll');
const chatFade      = document.getElementById('chatFade');
const choicesAnchor = document.querySelector('.choices-anchor');

chatFade.style.opacity = '0';

// ── Scroll helpers ───────────────────────────────────────────
function updateFade() {
  const atBottom = chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 16;
  chatFade.style.opacity = atBottom ? '0' : '1';
}

chatScroll.addEventListener('scroll', updateFade);

function scrollToBottom() {
  chatScroll.scrollTop = chatScroll.scrollHeight;
  setTimeout(updateFade, 50);
}

// ── Message builders ─────────────────────────────────────────
function addSystemNote(text) {
  const el = document.createElement('div');
  el.className = 'msg-time';
  el.style.opacity = '0';
  el.textContent = text;
  chatScroll.insertBefore(el, choicesAnchor);
  requestAnimationFrame(() => requestAnimationFrame(() => {
    el.style.transition = 'opacity 0.5s';
    el.style.opacity = '1';
    scrollToBottom();
  }));
}

function addTyping() {
  const el = document.createElement('div');
  el.className = 'typing';
  el.innerHTML = AVATAR_SVG + '<div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  chatScroll.insertBefore(el, choicesAnchor);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('show'); scrollToBottom(); }));
  return el;
}

function removeTyping(el) {
  if (el && el.parentNode) el.remove();
}

function addInBubble(html, showAvatar) {
  const row = document.createElement('div');
  row.className = 'bubble-in-row';
  row.innerHTML = (showAvatar ? AVATAR_SVG : '<div class="bubble-spacer"></div>') +
    '<div class="bubble bubble-in">' + html + '</div>';
  chatScroll.insertBefore(row, choicesAnchor);
  requestAnimationFrame(() => requestAnimationFrame(() => { row.classList.add('show'); scrollToBottom(); }));
  return row;
}

function addOutBubble(text) {
  const el = document.createElement('div');
  el.className = 'bubble bubble-out';
  el.textContent = text;
  chatScroll.insertBefore(el, choicesAnchor);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('show'); }));

  const receipt = document.createElement('div');
  receipt.className = 'read-receipt';
  receipt.textContent = 'Delivered';
  chatScroll.insertBefore(receipt, choicesAnchor);
  setTimeout(() => { receipt.classList.add('show'); }, 400);

  scrollToBottom();
  return { bubble: el, receipt };
}

// ── Sequencer ────────────────────────────────────────────────
// Runs an array of steps in order, each after its own delay.
// Typing steps store their DOM node on step._el so the next
// content step can remove the indicator before appearing.
function runSequence(steps, onDone) {
  function run(i) {
    if (i >= steps.length) { if (onDone) onDone(); return; }
    const step = steps[i];
    const prev = steps[i - 1];
    setTimeout(() => {
      if (prev && prev._el && step.type !== 'typing') {
        removeTyping(prev._el);
        prev._el = null;
      }
      if      (step.type === 'note')   addSystemNote(step.text);
      else if (step.type === 'typing') step._el = addTyping();
      else if (step.type === 'in')     addInBubble(step.text, true);
      else if (step.type === 'in-')    addInBubble(step.text, false);
      else if (step.type === 'out')    addOutBubble(step.text);
      run(i + 1);
    }, step.delay != null ? step.delay : 600);
  }
  run(0);
}

// ── Chips ────────────────────────────────────────────────────
let remaining = ALL_QUESTIONS.slice();

function renderChips() {
  const row = document.getElementById('choices');
  row.innerHTML = '';
  remaining.slice(0, 3).forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'choice-chip';
    btn.textContent = item.q;
    btn.onclick = () => handleChoice(item);
    row.appendChild(btn);
  });
}

function showChips() {
  renderChips();
  document.getElementById('choicesLabel').classList.add('show');
  const cr = document.getElementById('choices');
  cr.classList.add('show');
  cr.style.opacity = '1';
  scrollToBottom();
}

// ── Opening sequence ─────────────────────────────────────────
runSequence([
  { type: 'note',   text: 'Sojin has entered the chat', delay: 500 },
  { type: 'typing', delay: 800 },
  { type: 'in',     text: 'hi! 👋', delay: 900 },
  { type: 'typing', delay: 500 },
  { type: 'in-',    text: "I spent 6 years as a software engineer at Amazon, shipping features for millions of Fire TV users. 🔥", delay: 700 },
  { type: 'typing', delay: 400 },
  { type: 'in-',    text: "This fall I'm starting my Master's at UW HCDE — learning to build technology that actually serves people, not just metrics. 📊", delay: 700 },
], showChips);

// ── Handle chip selection ────────────────────────────────────
function handleChoice(item) {
  const choicesRow   = document.getElementById('choices');
  const choicesLabel = document.getElementById('choicesLabel');

  choicesRow.classList.remove('show');
  choicesRow.style.opacity = '0';
  choicesLabel.classList.remove('show');
  remaining = remaining.filter(r => r.q !== item.q);

  const { receipt } = addOutBubble(item.q);

  const steps = [{ type: 'typing', delay: 500 }];
  item.parts.forEach((part, i) => {
    steps.push({ type: i === 0 ? 'in' : 'in-', text: part, delay: i === 0 ? 1000 : 550 });
    if (i < item.parts.length - 1) steps.push({ type: 'typing', delay: 300 });
  });

  const isLast = remaining.length === 0;

  runSequence(steps, () => {
    receipt.textContent = 'Read';
    if (isLast) {
      setTimeout(() => {
        const t = addTyping();
        setTimeout(() => {
          removeTyping(t);
          addInBubble("Anyway, I've loved chatting! 🥰", true);
          setTimeout(() => {
            const t2 = addTyping();
            setTimeout(() => {
              removeTyping(t2);
              addInBubble('Feel free to look around and check out my work below ✨', false);
              choicesAnchor.style.display = 'none';
            }, 1000);
          }, 700);
        }, 900);
      }, 400);
    } else {
      setTimeout(() => { showChips(); scrollToBottom(); }, 500);
    }
  });
}
