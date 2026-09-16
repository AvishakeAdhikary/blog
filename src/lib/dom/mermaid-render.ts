let seq = 0;

interface Chrome {
  root: HTMLElement;
  canvas: HTMLElement;
  fallback: HTMLElement;
  zoomLabel: HTMLElement;
  fullscreenBtn: HTMLButtonElement;
  sourceBtn: HTMLButtonElement;
  scale: number;
  showingSource: boolean;
}

const MIN_SCALE = 0.5;
const MAX_SCALE = 3;
const SCALE_STEP = 0.25;

function currentMermaidTheme(): 'dark' | 'default' {
  return document.documentElement.dataset.theme === 'light' ? 'default' : 'dark';
}

function applyScale(chrome: Chrome) {
  chrome.canvas.style.transform = `scale(${chrome.scale})`;
  chrome.zoomLabel.textContent = `${Math.round(chrome.scale * 100)}%`;
}

function buildChrome(root: HTMLElement): Chrome {
  const fallback = root.querySelector<HTMLElement>('.mermaid-fallback')!;

  const toolbar = document.createElement('div');
  toolbar.className = 'mermaid-toolbar';

  const zoomOut = document.createElement('button');
  zoomOut.type = 'button';
  zoomOut.className = 'mermaid-toolbar-btn';
  zoomOut.textContent = '−';
  zoomOut.setAttribute('aria-label', 'zoom out');

  const zoomLabel = document.createElement('span');
  zoomLabel.className = 'mermaid-zoom-level';
  zoomLabel.textContent = '100%';

  const zoomIn = document.createElement('button');
  zoomIn.type = 'button';
  zoomIn.className = 'mermaid-toolbar-btn';
  zoomIn.textContent = '+';
  zoomIn.setAttribute('aria-label', 'zoom in');

  const reset = document.createElement('button');
  reset.type = 'button';
  reset.className = 'mermaid-toolbar-btn';
  reset.textContent = 'reset';
  reset.setAttribute('aria-label', 'reset zoom');

  const sourceBtn = document.createElement('button');
  sourceBtn.type = 'button';
  sourceBtn.className = 'mermaid-toolbar-btn';
  sourceBtn.textContent = 'source';
  sourceBtn.setAttribute('aria-pressed', 'false');
  sourceBtn.setAttribute('aria-label', 'view diagram source');

  const fullscreenBtn = document.createElement('button');
  fullscreenBtn.type = 'button';
  fullscreenBtn.className = 'mermaid-toolbar-btn mermaid-toolbar-btn--fullscreen';
  fullscreenBtn.textContent = '⛶';
  fullscreenBtn.setAttribute('aria-label', 'toggle fullscreen');

  toolbar.append(zoomOut, zoomLabel, zoomIn, reset, sourceBtn, fullscreenBtn);

  const viewport = document.createElement('div');
  viewport.className = 'mermaid-viewport';
  const canvas = document.createElement('div');
  canvas.className = 'mermaid-canvas';
  viewport.appendChild(canvas);

  root.insertBefore(toolbar, fallback);
  root.insertBefore(viewport, fallback);
  fallback.hidden = true;

  const chrome: Chrome = {
    root,
    canvas,
    fallback,
    zoomLabel,
    fullscreenBtn,
    sourceBtn,
    scale: 1,
    showingSource: false
  };

  zoomOut.addEventListener('click', () => {
    chrome.scale = Math.max(MIN_SCALE, chrome.scale - SCALE_STEP);
    applyScale(chrome);
  });
  zoomIn.addEventListener('click', () => {
    chrome.scale = Math.min(MAX_SCALE, chrome.scale + SCALE_STEP);
    applyScale(chrome);
  });
  reset.addEventListener('click', () => {
    chrome.scale = 1;
    applyScale(chrome);
  });
  sourceBtn.addEventListener('click', () => {
    chrome.showingSource = !chrome.showingSource;
    viewport.hidden = chrome.showingSource;
    fallback.hidden = !chrome.showingSource;
    sourceBtn.setAttribute('aria-pressed', String(chrome.showingSource));
    sourceBtn.classList.toggle('active', chrome.showingSource);
  });
  // Uses the native Fullscreen API (not a CSS `position: fixed` overlay): the
  // `<article>` ancestor sets `contain: layout` for perf, which makes itself
  // the containing block for any `position: fixed` descendant instead of the
  // viewport. requestFullscreen() renders in the browser's top layer, so it
  // is unaffected by that (or by any other ancestor stacking/containment).
  const syncFullscreenUI = () => {
    const isFullscreen = document.fullscreenElement === root;
    fullscreenBtn.textContent = isFullscreen ? '✕' : '⛶';
    fullscreenBtn.setAttribute(
      'aria-label',
      isFullscreen ? 'exit fullscreen' : 'toggle fullscreen'
    );
  };
  fullscreenBtn.addEventListener('click', () => {
    if (document.fullscreenElement === root) {
      void document.exitFullscreen();
    } else {
      void root.requestFullscreen?.();
    }
  });
  root.addEventListener('fullscreenchange', syncFullscreenUI);

  return chrome;
}

/**
 * Renders every `div.mermaid-diagram[data-mermaid-source]` under `root` into
 * an SVG diagram with a GitHub-style toolbar (zoom, fullscreen, view source),
 * and keeps re-rendering on theme toggles. Returns a cleanup function.
 */
export function enhanceMermaidDiagrams(root: HTMLElement): () => void {
  const diagrams = Array.from(
    root.querySelectorAll<HTMLElement>('div.mermaid-diagram[data-mermaid-source]')
  );
  if (diagrams.length === 0) return () => {};

  let disposed = false;
  const chromes: Chrome[] = [];
  let observer: MutationObserver | null = null;

  (async () => {
    const mod = await import('mermaid');
    if (disposed) return;
    const mermaid = mod.default;

    for (const el of diagrams) {
      chromes.push(buildChrome(el));
    }

    async function renderAll() {
      mermaid.initialize({
        startOnLoad: false,
        securityLevel: 'strict',
        theme: currentMermaidTheme(),
        fontFamily: 'var(--font-mono)'
      });
      for (const chrome of chromes) {
        if (disposed) return;
        const source = chrome.root.dataset.mermaidSource;
        if (!source) continue;
        try {
          const id = `mermaid-svg-${++seq}`;
          const { svg } = await mermaid.render(id, source);
          if (disposed) return;
          chrome.canvas.innerHTML = svg;
        } catch {
          chrome.canvas.innerHTML = '';
          chrome.sourceBtn.click();
          chrome.sourceBtn.disabled = true;
        }
      }
    }

    await renderAll();

    observer = new MutationObserver((mutations) => {
      if (mutations.some((m) => m.attributeName === 'data-theme')) {
        void renderAll();
      }
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme']
    });
  })();

  return () => {
    disposed = true;
    observer?.disconnect();
    for (const chrome of chromes) {
      if (document.fullscreenElement === chrome.root) void document.exitFullscreen();
    }
  };
}
