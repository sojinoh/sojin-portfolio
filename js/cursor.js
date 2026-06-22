// ── DOM refs ─────────────────────────────────────────────────
const cursorHeart   = document.getElementById('cursor-heart');
const sparkleCanvas = document.getElementById('cursor-sparkle-canvas');
const sCtx          = sparkleCanvas.getContext('2d');
const CW            = sparkleCanvas.width;
const CH            = sparkleCanvas.height;

// ── State ────────────────────────────────────────────────────
let mx = -200, my = -200;
let lastMx = 0, lastMy = 0;
let isHovering = false, isClicking = false;

// ── Position ─────────────────────────────────────────────────
function updateCursorPos(x, y) {
  cursorHeart.style.left      = x + 'px';
  cursorHeart.style.top       = y + 'px';
  sparkleCanvas.style.left    = x + 'px';
  sparkleCanvas.style.top     = y + 'px';
}

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  updateCursorPos(mx, my);

  const dx = mx - lastMx, dy = my - lastMy;
  const speed = Math.sqrt(dx * dx + dy * dy);
  lastMx = mx; lastMy = my;

  if (speed > 3) {
    const count = Math.min(Math.floor(speed / 5), 6);
    for (let i = 0; i < count; i++) spawnSparkle(isHovering || isClicking);
  }
});

document.addEventListener('mouseleave', () => updateCursorPos(-200, -200));

// ── Hover / click states ─────────────────────────────────────
const HOVER_SELECTORS = 'a, button, [role="button"], .choice-chip, .nav-links span, .sdot, .cta, .work-card-image';

document.addEventListener('mouseover', e => {
  if (e.target.closest(HOVER_SELECTORS)) {
    isHovering = true;
    cursorHeart.classList.add('hovering');
  }
});

document.addEventListener('mouseout', e => {
  if (e.target.closest(HOVER_SELECTORS)) {
    isHovering = false;
    cursorHeart.classList.remove('hovering');
  }
});

document.addEventListener('mousedown', () => {
  isClicking = true;
  cursorHeart.classList.remove('hovering');
  cursorHeart.classList.add('clicking');
  for (let i = 0; i < 10; i++) spawnSparkle(true);
});

document.addEventListener('mouseup', () => {
  isClicking = false;
  cursorHeart.classList.remove('clicking');
  if (isHovering) cursorHeart.classList.add('hovering');
});

// ── Sparkles ─────────────────────────────────────────────────
const SPARKLE_COLORS = ['#C1502E', '#221A14', '#C9A227', '#A8754A', '#C1502E'];
let sparkles = [];

function spawnSparkle(burst) {
  const angle = Math.random() * Math.PI * 2;
  const dist  = burst ? (2 + Math.random() * 8) : (6 + Math.random() * 14);
  sparkles.push({
    x:     CW / 2 + Math.cos(angle) * dist,
    y:     CH / 2 + Math.sin(angle) * dist,
    vx:    (Math.random() - 0.5) * (burst ? 1.4 : 0.7),
    vy:    -0.5 - Math.random() * (burst ? 1.2 : 0.7),
    size:  1.2 + Math.random() * (burst ? 2.5 : 1.8),
    life:  1,
    decay: 0.024 + Math.random() * 0.018,
    color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)],
    type:  Math.random() > 0.5 ? 'star' : 'dot',
  });
}

function drawStar(ctx, x, y, size, alpha, color) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth   = size * 0.4;
  ctx.translate(x, y);
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(0, -size * 2.2);
    ctx.stroke();
    ctx.rotate(Math.PI / 2);
  }
  ctx.restore();
}

function tickSparkles() {
  sCtx.clearRect(0, 0, CW, CH);
  sparkles = sparkles.filter(s => s.life > 0);
  for (const s of sparkles) {
    s.x += s.vx;
    s.y += s.vy;
    s.life -= s.decay;
    const a = Math.max(0, s.life);
    if (s.type === 'star') {
      drawStar(sCtx, s.x, s.y, s.size, a, s.color);
    } else {
      sCtx.save();
      sCtx.globalAlpha = a;
      sCtx.fillStyle = s.color;
      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      sCtx.fill();
      sCtx.restore();
    }
  }
  requestAnimationFrame(tickSparkles);
}

updateCursorPos(mx, my);
tickSparkles();
