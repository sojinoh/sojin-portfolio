
// ── DOM refs ──────────────────────────────────────────────────
const chatScroll    = document.getElementById('chatScroll');
const chatFade      = document.getElementById('chatFade');
const choicesAnchor = document.querySelector('.choices-anchor');

chatFade.style.opacity = '0';

// ── Session ID — increments on thread switch to cancel stale sequences
let sessionId = 0;

// ── Busy flag ──────────────────────────────────────────────────
let isBusy = false;

// ── Scroll helpers ────────────────────────────────────────────
function updateFade() {
  const atBottom = chatScroll.scrollHeight - chatScroll.scrollTop - chatScroll.clientHeight < 16;
  chatFade.style.opacity = atBottom ? '0' : '1';
}

chatScroll.addEventListener('scroll', updateFade);

function scrollToBottom() {
  chatScroll.scrollTop = chatScroll.scrollHeight;
  setTimeout(updateFade, 50);
}

// ── Message builders ──────────────────────────────────────────
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
  el.innerHTML = '<div class="typing-dots"><div class="dot"></div><div class="dot"></div><div class="dot"></div></div>';
  chatScroll.insertBefore(el, choicesAnchor);
  requestAnimationFrame(() => requestAnimationFrame(() => { el.classList.add('show'); scrollToBottom(); }));
  return el;
}

function removeTyping(el) {
  if (el && el.parentNode) el.remove();
}

function addInBubble(html) {
  const row = document.createElement('div');
  row.className = 'bubble-in-row';
  row.innerHTML = '<div class="bubble bubble-in">' + html + '</div>';
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

// ── Sequencer ─────────────────────────────────────────────────
function runSequence(steps, onDone) {
  const mySession = sessionId;
  function run(i) {
    if (sessionId !== mySession) return;
    if (i >= steps.length) { if (onDone) onDone(); return; }
    const step = steps[i];
    const prev = steps[i - 1];
    setTimeout(() => {
      if (sessionId !== mySession) return;
      if (prev && prev._el && step.type !== 'typing') {
        removeTyping(prev._el);
        prev._el = null;
      }
      if      (step.type === 'note')   addSystemNote(step.text);
      else if (step.type === 'typing') step._el = addTyping();
      else if (step.type === 'in')     addInBubble(step.text);
      else if (step.type === 'in-')    addInBubble(step.text);
      run(i + 1);
    }, step.delay != null ? step.delay : 600);
  }
  run(0);
}

// ── Clear chat ────────────────────────────────────────────────
function clearChat() {
  sessionId++;
  isBusy = false;
  chatFade.style.opacity = '0';

  while (chatScroll.firstChild && chatScroll.firstChild !== choicesAnchor) {
    chatScroll.removeChild(chatScroll.firstChild);
  }

  choicesAnchor.style.display = '';
  const row   = document.getElementById('choices');
  const label = document.getElementById('choicesLabel');
  row.innerHTML = '';
  row.classList.remove('show');
  row.style.opacity = '0';
  label.classList.remove('show');

  remaining = ALL_QUESTIONS.slice();
}

// ── Chips ─────────────────────────────────────────────────────
let remaining = ALL_QUESTIONS.slice();

function renderChips() {
  const row = document.getElementById('choices');
  row.innerHTML = '';
  remaining.slice(0, 3).forEach(item => {
    const btn = document.createElement('button');
    btn.className = 'choice-chip';
    btn.textContent = item.q;
    btn.onclick = () => { if (!isBusy) handleChoice(item); };
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

function hideChips() {
  const cr    = document.getElementById('choices');
  const label = document.getElementById('choicesLabel');
  cr.classList.remove('show');
  cr.style.opacity = '0';
  label.classList.remove('show');
}

// ── Thread switching ──────────────────────────────────────────
let currentThread = 'sojin';

function switchThread(threadId) {
  if (threadId === currentThread) return;
  currentThread = threadId;

  document.querySelectorAll('.thread-item').forEach(el => {
    el.classList.toggle('thread-item--active', el.dataset.thread === threadId);
  });

  const item = document.querySelector(`[data-thread="${threadId}"]`);
  if (item) {
    const badge = item.querySelector('.thread-badge');
    if (badge) badge.style.display = 'none';
  }

  clearChat();

  if (threadId === 'sojin')  initChat();
  else if (threadId === 'work')  initWorkThread();
  else if (threadId === 'about') initAboutThread();
}

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.thread-item').forEach(el => {
    el.addEventListener('click', () => switchThread(el.dataset.thread));
  });
});

// ── Opening sequence ──────────────────────────────────────────
function initChat() {
  runSequence([
    { type: 'note',   text: 'Sojin has entered the chat', delay: 600 },
    { type: 'typing', delay: 1200 },
    { type: 'in',     text: 'hi!&nbsp;👋', delay: 1200 },
    { type: 'typing', delay: 900 },
    { type: 'in-',    text: "I spent 6 years building software at Amazon — and realized what I really cared about was the people behind the screen.", delay: 1200 },
    { type: 'typing', delay: 700 },
    { type: 'in-',    text: "Ask me anything ✨ or pick something below.", delay: 1100 },
  ], showChips);
}

// ── My Work thread ────────────────────────────────────────────
function initWorkThread() {
  choicesAnchor.style.display = 'none';
  runSequence([
    { type: 'note',   text: 'My Work', delay: 400 },
    { type: 'typing', delay: 1000 },
    { type: 'in',     text: "here's what I've been building 💻", delay: 1100 },
    { type: 'typing', delay: 800 },
    { type: 'in-',    text: "📺 Amazon Silk Browser (2018–2024)\nThe built-in browser on Fire TV and Fire tablets. I shipped search recommendations, home screen redesigns, and video playback improvements for millions of users.", delay: 1200 },
    { type: 'typing', delay: 800 },
    { type: 'in-',    text: "🍱 Cafeteria Menu Site (high school)\nBuilt a photo menu website for English-speaking teachers who couldn't read Korean menus — they'd been packing lunch every day just to avoid the uncertainty.", delay: 1200 },
    { type: 'typing', delay: 700 },
    { type: 'in-',    text: "🎓 More coming — starting my Master's at UW HCDE this fall. I can't wait to share what I build there.", delay: 1100 },
  ]);
}

// ── About Me thread ───────────────────────────────────────────
function initAboutThread() {
  choicesAnchor.style.display = 'none';
  runSequence([
    { type: 'note',   text: 'About Me', delay: 400 },
    { type: 'typing', delay: 1000 },
    { type: 'in',     text: "the quick version ✨", delay: 1100 },
    { type: 'typing', delay: 800 },
    { type: 'in-',    text: "Software engineer turned human-centered designer. 6 years building at Amazon, now starting a Master's at UW HCDE this fall 🎓", delay: 1200 },
    { type: 'typing', delay: 700 },
    { type: 'in-',    text: "Based in Seattle ☁️, originally from Korea 🇰🇷. I care about the gap between what technology promises and what it actually delivers to real people.", delay: 1200 },
    { type: 'typing', delay: 700 },
    { type: 'in-',    text: "Outside work: long walks, matcha, and convincing myself I'll finish that book I started 😄", delay: 1100 },
  ]);
}

// ── Handle chip selection ──────────────────────────────────────
function handleChoice(item) {
  isBusy = true;
  hideChips();
  remaining = remaining.filter(r => r.q !== item.q);

  const { receipt } = addOutBubble(item.q);
  const isLast = remaining.length === 0;

  const steps = [{ type: 'typing', delay: 800 }];
  item.parts.forEach((part, i) => {
    steps.push({ type: i === 0 ? 'in' : 'in-', text: part, delay: i === 0 ? 1300 : 800 });
    if (i < item.parts.length - 1) steps.push({ type: 'typing', delay: 500 });
  });

  runSequence(steps, () => {
    receipt.textContent = 'Read';
    isBusy = false;
    if (isLast) {
      showFarewell();
    } else {
      setTimeout(() => { showChips(); scrollToBottom(); }, 500);
    }
  });
}

// ── Farewell ──────────────────────────────────────────────────
function showFarewell() {
  setTimeout(() => {
    const t = addTyping();
    setTimeout(() => {
      removeTyping(t);
      addInBubble("Anyway, I've loved chatting! 🥰");
      setTimeout(() => {
        const t2 = addTyping();
        setTimeout(() => {
          removeTyping(t2);
          addInBubble('Feel free to reach out directly 💌');
          choicesAnchor.style.display = 'none';
        }, 1000);
      }, 700);
    }, 900);
  }, 400);
}
