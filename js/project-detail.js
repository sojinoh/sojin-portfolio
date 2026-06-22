// Shared renderer for the "actual content" project case studies, used by
// both work.html (the full Projects grid) and glance.html (the At a Glance
// highlight cards), so the two pages can never drift out of sync.

function pdDividerSection(label, body) {
  return `<div class="pd-section"><div class="pd-divider"><span>${label}</span></div><div class="pd-section-body">${body}</div></div>`;
}

function pdProblemBody(lead, sub) {
  return `<p class="pd-problem-lead">${lead}</p>` + (sub ? `<p class="pd-problem-sub">${sub}</p>` : '');
}

function pdStepsBody(content, inlineMedia) {
  const items = content.split('||');
  return `<div class="pd-steps">${items.map((item, i) => {
    const stepNum = i + 1;
    const media = (inlineMedia && inlineMedia[stepNum]) || '';
    return `<div class="pd-step"><div class="pd-step-num">${String(stepNum).padStart(2, '0')}</div><div class="pd-step-text">${item}${media}</div></div>`;
  }).join('')}</div>`;
}

function pdStatsBody(content) {
  const items = content.split('||').map(i => i.split('|'));
  return `<div class="pd-stats">${items.map(([num, caption]) =>
    `<div class="pd-stat"><span class="pd-stat-num">${num}</span><span class="pd-stat-caption">${caption}</span></div>`
  ).join('')}</div>`;
}

function pdImageFigure(src, alt, extraClass) {
  const label = alt || 'Screenshot';
  const cls = extraClass ? `pd-figure ${extraClass}` : 'pd-figure';
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const media = isVideo
    ? `<video controls playsinline src="${src}"></video>`
    : `<img src="${src}" alt="${alt || ''}">`;
  const videoCls = isVideo ? `${cls} pd-figure-video` : cls;
  return `<div class="${videoCls}">${media}<div class="pd-figure-caption">${label}</div></div>`;
}

function pdVideoFigure(card) {
  if (card.dataset.videoBefore && card.dataset.videoAfter) {
    return `<div class="pd-figure-pair">
      <div class="pd-figure-block"><video controls playsinline src="${card.dataset.videoBefore}"></video><div class="pd-figure-caption">Before</div></div>
      <div class="pd-figure-block"><video controls playsinline src="${card.dataset.videoAfter}"></video><div class="pd-figure-caption">After</div></div>
    </div>`;
  }
  if (card.dataset.video) {
    const label = card.dataset.videoLabel || 'Demo';
    return `<div class="pd-figure"><video controls playsinline src="${card.dataset.video}"></video><div class="pd-figure-caption">${label}</div></div>`;
  }
  return '';
}

function pdExtraImageFigure(card) {
  if (!card.dataset.extraImage) return '';
  const label = card.dataset.extraImageLabel || 'Screenshot';
  return `<div class="pd-figure"><img src="${card.dataset.extraImage}" alt="${card.dataset.extraImageLabel || ''}"><div class="pd-figure-caption">${label}</div></div>`;
}

function pdSWEDesc(card) {
  const mainImageAlt = card.querySelector('.work-card-image')?.alt || '';
  const problemMedia = card.dataset.image ? pdImageFigure(card.dataset.image, mainImageAlt) : '';
  const extraImageStep = parseInt(card.dataset.extraImageStep) || 0;
  const extraImageHtml = pdExtraImageFigure(card);
  const inlineStepMedia = extraImageStep ? { [extraImageStep]: extraImageHtml } : null;
  const workMedia = pdVideoFigure(card) + (extraImageStep ? '' : extraImageHtml);

  return pdDividerSection('The Problem', pdProblemBody(card.dataset.problem, card.dataset.problemSub) + problemMedia) +
         pdDividerSection('What I Did', pdStepsBody(card.dataset.approach, inlineStepMedia) + workMedia) +
         pdDividerSection('Result', pdStatsBody(card.dataset.impact));
}

// ── UX framework template: Empathize / Define / Ideate / Prototype / Share & Iterate ──
function pdQuadrantsBody(says, thinks, does, feels) {
  const mk = (label, content) => `<div class="pd-quadrant"><div class="pd-quadrant-label">${label}</div><ul class="pd-quadrant-list">${
    content.split(';').map(i => `<li>${i.trim()}</li>`).join('')
  }</ul></div>`;
  return `<div class="pd-quadrants">${mk('Says', says)}${mk('Thinks', thinks)}${mk('Does', does)}${mk('Feels', feels)}</div>`;
}

function pdQuoteBody(label, text) {
  return `<div class="pd-quote"><div class="pd-quote-label">${label}</div><p>${text}</p></div>`;
}

function pdBulletsBody(content) {
  return `<ul class="pd-bullets">${content.split(';').map(i => `<li>${i.trim()}</li>`).join('')}</ul>`;
}

function pdAuditBody(content) {
  const items = content.split('||').map(i => i.split('|'));
  return `<div class="pd-audit-list">${items.map(([site, note, url]) => {
    const siteHtml = url ? `<a href="${url}" target="_blank" rel="noopener">${site}</a>` : site;
    return `<div class="pd-audit-row"><span class="pd-audit-site">${siteHtml}</span><span class="pd-audit-note">${note}</span></div>`;
  }).join('')}</div>`;
}

function pdSubhead(label) {
  return `<div class="pd-subhead">${label}</div>`;
}

function pdReasonStepsBody(content) {
  const items = content.split('||').map(i => i.split('|'));
  return `<div class="pd-steps">${items.map(([action, reason], i) => {
    const stepNum = i + 1;
    return `<div class="pd-step"><div class="pd-step-num">${String(stepNum).padStart(2, '0')}</div><div class="pd-step-text">${action}${reason ? `<span class="pd-step-reason">Why: ${reason}</span>` : ''}</div></div>`;
  }).join('')}</div>`;
}

function pdParsePairs(content) {
  return content.split('||').map(pair => {
    const [src, label] = pair.split('|');
    return { src, label };
  });
}

function pdImageGridBody(content, cols) {
  const items = pdParsePairs(content);
  return `<div class="pd-image-grid" style="--pd-grid-cols:${cols}">${items.map(({ src, label }) =>
    `<figure class="pd-image-grid-item"><img src="${src}" alt="${label || ''}"><figcaption>${label || ''}</figcaption></figure>`
  ).join('')}</div>`;
}

function pdImageRowBody(content) {
  const items = pdParsePairs(content);
  return `<div class="pd-image-row">${items.map(({ src, label }) =>
    `<figure class="pd-image-row-item"><img src="${src}" alt="${label || ''}"><figcaption>${label || ''}</figcaption></figure>`
  ).join('')}</div>`;
}

function pdUXDesc(card) {
  const d = card.dataset;

  const motivationBody =
    `<p class="pd-problem-sub">${d.motivationHook}</p>` +
    `<p class="pd-problem-sub">${d.motivationText}</p>` +
    pdImageRowBody(d.motivationImages) +
    `<p class="pd-problem-sub">${d.motivationRealization}</p>`;

  const empathizeBody =
    `<p class="pd-problem-sub">${d.empathizeHook}</p>` +
    pdSubhead('Persona') +
    `<p class="pd-problem-sub">${d.empathizePersona}</p>` +
    pdSubhead('Empathy Map') +
    pdQuadrantsBody(d.empathizeSays, d.empathizeThinks, d.empathizeDoes, d.empathizeFeels) +
    pdSubhead('User Journey Map') +
    (d.empathizeJourneyImage ? pdImageFigure(d.empathizeJourneyImage, d.empathizeJourneyImageLabel) : '');

  const defineBody =
    pdQuoteBody('Problem Statement', d.defineProblem) +
    `<p class="pd-problem-sub">${d.defineMeasure}</p>` +
    pdQuoteBody('User Story', d.defineStory);

  const ideateBody =
    `<p class="pd-problem-sub">${d.ideateHook}</p>` +
    pdQuoteBody('Goal Statement', d.ideateGoal) +
    pdSubhead('Competitive Audit') +
    pdAuditBody(d.ideateAudit) +
    `<p class="pd-problem-sub">${d.ideateSketches}</p>` +
    pdSubhead('Crazy 8s') +
    (d.ideateCrazy8 ? pdImageGridBody(d.ideateCrazy8, 4) : '') +
    `<p class="pd-problem-sub">${d.ideateDecision}</p>`;

  const prototypeBody =
    pdSubhead('User Flow') +
    `<p class="pd-problem-sub">${d.prototypeFlow}</p>` +
    (d.prototypeFlowImage ? pdImageFigure(d.prototypeFlowImage, d.prototypeFlowImageLabel, 'pd-figure-small') : '') +
    pdSubhead('Paper Wireframes') +
    `<p class="pd-problem-sub">${d.prototypeWireframes}</p>` +
    (d.prototypeWireframesImages ? pdImageRowBody(d.prototypeWireframesImages) : '') +
    pdSubhead('Digital Wireframe') +
    `<p class="pd-problem-sub">${d.prototypeDigital}</p>` +
    (d.prototypeDigitalImages ? pdImageGridBody(d.prototypeDigitalImages, 3) : '');

  const shareBody =
    `<p class="pd-problem-sub">${d.shareHook}</p>` +
    pdReasonStepsBody(d.shareSteps) +
    pdStatsBody(d.shareStats);

  return pdDividerSection('Motivation', motivationBody) +
         pdDividerSection('Empathize', empathizeBody) +
         pdDividerSection('Define', defineBody) +
         pdDividerSection('Ideate', ideateBody) +
         pdDividerSection('Prototype', prototypeBody) +
         pdDividerSection('Share & Iterate', shareBody);
}

// Renders a work-card's full case study into descEl and sets up its video playback rate.
function mountProjectDesc(descEl, card) {
  descEl.innerHTML = (card.dataset.category === 'ux' && card.dataset.empathizeSays)
    ? pdUXDesc(card)
    : pdSWEDesc(card);

  descEl.querySelectorAll('video').forEach(v => {
    v.playbackRate = 2;
    v.addEventListener('loadedmetadata', () => { v.playbackRate = 2; });
  });
}

// Wires up the zoomable image popup. Expects the standard #lightbox markup
// (lightbox, lightbox-img, lightbox-stage, lightbox-zoom-in/out/close) to
// already be present on the page. Returns { wireContainer, close } so each
// page can attach it to its own project-detail-desc element.
function createLightbox() {
  const lightbox      = document.getElementById('lightbox');
  const lightboxImg   = document.getElementById('lightbox-img');
  const lightboxStage = document.getElementById('lightbox-stage');
  let lightboxZoom = 1;

  function setLightboxZoom(zoom) {
    lightboxZoom = Math.min(3, Math.max(1, zoom));
    lightboxImg.style.width = lightboxZoom > 1 ? `${lightboxZoom * 90}vw` : '';
    lightboxImg.classList.toggle('zoomed', lightboxZoom > 1);
    requestAnimationFrame(() => {
      lightboxStage.scrollLeft = (lightboxStage.scrollWidth - lightboxStage.clientWidth) / 2;
      lightboxStage.scrollTop = (lightboxStage.scrollHeight - lightboxStage.clientHeight) / 2;
    });
  }

  function open(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt || '';
    setLightboxZoom(1);
    lightbox.classList.remove('hidden');
  }

  function close() {
    lightbox.classList.add('hidden');
    lightboxImg.src = '';
  }

  function wireContainer(descEl) {
    descEl.addEventListener('click', e => {
      const img = e.target.closest('img');
      if (img) open(img.src, img.alt);
    });
  }

  // Drag to pan when zoomed in
  let isPanning = false, panMoved = false, panStartX, panStartY, scrollStartX, scrollStartY;

  lightboxImg.addEventListener('mousedown', e => {
    if (lightboxZoom <= 1) return;
    isPanning = true;
    panMoved = false;
    panStartX = e.clientX;
    panStartY = e.clientY;
    scrollStartX = lightboxStage.scrollLeft;
    scrollStartY = lightboxStage.scrollTop;
    e.preventDefault();
  });

  window.addEventListener('mousemove', e => {
    if (!isPanning) return;
    const dx = e.clientX - panStartX;
    const dy = e.clientY - panStartY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) panMoved = true;
    lightboxStage.scrollLeft = scrollStartX - dx;
    lightboxStage.scrollTop = scrollStartY - dy;
  });

  window.addEventListener('mouseup', () => { isPanning = false; });

  lightboxImg.addEventListener('click', () => {
    if (panMoved) return;
    setLightboxZoom(lightboxZoom > 1 ? 1 : 2);
  });

  document.getElementById('lightbox-zoom-in').addEventListener('click', () => setLightboxZoom(lightboxZoom + 0.5));
  document.getElementById('lightbox-zoom-out').addEventListener('click', () => setLightboxZoom(lightboxZoom - 0.5));
  document.getElementById('lightbox-close').addEventListener('click', close);

  lightbox.addEventListener('click', e => {
    if (e.target === lightbox || e.target === lightboxStage) close();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !lightbox.classList.contains('hidden')) close();
  });

  return { wireContainer, close };
}
