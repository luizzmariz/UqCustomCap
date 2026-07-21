import { chromium } from 'playwright-core';
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const EXE = '/opt/pw-browsers/chromium_headless_shell-1194/chrome-linux/headless_shell';
const dir = fileURLToPath(new URL('./projeto/Projeto CustomCap/', import.meta.url));
const outDir = fileURLToPath(new URL('./tagged2/', import.meta.url));
mkdirSync(outDir, { recursive: true });
const files = readdirSync(dir).filter((f) => f.endsWith('.svg')).sort();

const PART_CSS = `
    [data-part="crown"]{fill:var(--c-crown,#d7dade) !important}
    [data-part="brim"]{fill:var(--c-brim,#c7cace) !important}
    [data-part="button"]{fill:var(--c-button,#d7dade) !important}
    [data-part="mesh"]{fill:var(--c-mesh,#eef0f2) !important}
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
    function classify(cx, cy, ra, bot, texture) {
      const trucker = model === 'Trucker';
      // button: a small structural fill near the very top (never a texture dot)
      if (!texture && ra < 0.006 && cy < 0.06) return 'button';
      if (view === 'Frente') return cy > 0.58 || bot > 0.80 ? 'brim' : 'crown';
      if (view === 'Lado') {
        if (cy > 0.62 && cx > 0.46) return 'brim';
        if (trucker && cx < 0.47) return 'mesh';
        return 'crown';
      }
      // Tras
      if (cy > 0.85) return null; // closure strap -> keep original
      return trucker ? 'mesh' : 'crown';
    }
    for (const el of svg.querySelectorAll('path, polygon, polyline, rect, circle, ellipse')) {
      const fill = getComputedStyle(el).fill;
      if (!fill || fill === 'none' || fill === 'rgba(0, 0, 0, 0)') continue;
      const b = el.getBBox();
      if (b.width === 0 || b.height === 0) continue;
      const cx = (b.x + b.width / 2) / vb.width;
      const cy = (b.y + b.height / 2) / vb.height;
      const ra = (b.width * b.height) / (vb.width * vb.height);
      const bot = (b.y + b.height) / vb.height;
      const part = classify(cx, cy, ra, bot, isTexture(el));
      if (part) el.setAttribute('data-part', part);
    }
    return svg.outerHTML;
  }, { model, view });
  const withCss = tagged.replace('</style>', PART_CSS + '</style>');
  writeFileSync(outDir + name, withCss);
  const n = (withCss.match(/data-part=/g) || []).length;
  console.log(name, '->', n, 'colored paths');
}
await browser.close();
