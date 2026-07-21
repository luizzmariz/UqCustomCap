import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const EXE = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const dir = fileURLToPath(new URL('./projeto/Projeto CustomCap/', import.meta.url));
const outDir = fileURLToPath(new URL('./tagged2/', import.meta.url));
mkdirSync(outDir, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();

const PART_CSS = `
    [data-part="copaFrente"]{fill:var(--c-copa-frente,#d7dade) !important}
    [data-part="copaLadosTras"]{fill:var(--c-copa-lados,#c9ccd1) !important}
    [data-part="abaCima"]{fill:var(--c-aba-cima,#c7cace) !important}
    [data-part="abaBaixo"]{fill:var(--c-aba-baixo,#b7bac0) !important}
    [data-part="botao"]{fill:var(--c-botao,#d7dade) !important}
  `;

const browser = await chromium.launch({ executablePath: EXE, args: ['--no-sandbox'] });
const page = await browser.newPage();

for (const name of files) {
  const model = name.replace(/(Frente|Lado|Tras)\.svg$/, '');
  const view = name.match(/(Frente|Lado|Tras)\.svg$/)[1];
  const raw = readFileSync(dir + name, 'utf8').replace(/<\?xml[^>]*\?>/, '');
  await page.setContent(`<!doctype html><div id="host">${raw}</div>`, { waitUntil: 'load' });
  const tagged = await page.evaluate(({ model, view }) => {
    const svg = document.querySelector('#host svg');
    const vb = svg.viewBox.baseVal;
    // count how many paths use each class token (texture classes are huge)
    const classCount = {};
    for (const el of svg.querySelectorAll('path, polygon, polyline, rect, circle, ellipse')) {
      for (const c of (el.getAttribute('class') || '').split(/\s+/).filter(Boolean))
        classCount[c] = (classCount[c] || 0) + 1;
    }
    function isTexture(el) {
      return (el.getAttribute('class') || '').split(/\s+/).some((c) => classCount[c] > 40);
    }
    // Regions: copaFrente | copaLadosTras (= Tela on Trucker) | abaCima | abaBaixo | botao
    function classify(cx, cy, ra, rw, texture) {
      // button: a small structural fill near the very top (never a texture dot)
      if (!texture && ra < 0.006 && cy < 0.06) return 'botao';
      if (view === 'Frente') {
        if (cy < 0.58) {
          // wide full-silhouette shape = the side/back panels peeking behind;
          // everything else (front panel + its texture) = front crown.
          if (rw > 0.92 && ra > 0.5) return 'copaLadosTras';
          return 'copaFrente';
        }
        return cy > 0.82 ? 'abaBaixo' : 'abaCima';
      }
      if (view === 'Lado') {
        if (cy > 0.62 && cx > 0.46) return cy > 0.9 ? 'abaBaixo' : 'abaCima'; // visor
        return cx >= 0.45 ? 'copaFrente' : 'copaLadosTras'; // front dome vs back/mesh
      }
      // Tras: whole back crown + strap = sides/back; sweatband/closure kept
      if (ra > 0.4 || cy > 0.88) return 'copaLadosTras';
      return null;
    }
    for (const el of svg.querySelectorAll('path, polygon, polyline, rect, circle, ellipse')) {
      const fill = getComputedStyle(el).fill;
      if (!fill || fill === 'none' || fill === 'rgba(0, 0, 0, 0)') continue;
      const b = el.getBBox();
      if (b.width === 0 || b.height === 0) continue;
      const cx = (b.x + b.width / 2) / vb.width;
      const cy = (b.y + b.height / 2) / vb.height;
      const ra = (b.width * b.height) / (vb.width * vb.height);
      const rw = b.width / vb.width;
      const part = classify(cx, cy, ra, rw, isTexture(el));
      if (part) el.setAttribute('data-part', part);
    }
    // Mark the largest front-panel shape so the logo can be clipped to it.
    if (view === 'Frente') {
      let best = null;
      let bestArea = 0;
      for (const el of svg.querySelectorAll('[data-part="copaFrente"]')) {
        const b = el.getBBox();
        const area = b.width * b.height;
        if (area > bestArea) {
          bestArea = area;
          best = el;
        }
      }
      if (best) best.setAttribute('id', 'frontPanel');
    }
    return svg.outerHTML;
  }, { model, view });
  const withCss = tagged.replace('</style>', PART_CSS + '</style>');
  writeFileSync(outDir + name, withCss);
  const n = (withCss.match(/data-part=/g) || []).length;
  console.log(name, '->', n, 'colored paths');
}
await browser.close();
