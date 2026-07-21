import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { capSvg } from '../caps';
import { PARTS, PART_ORDER } from '../config/caps';
import { useActiveModel, useCustomizerStore } from '../store/customizerStore';

const SVG_NS = 'http://www.w3.org/2000/svg';
const XLINK_NS = 'http://www.w3.org/1999/xlink';

function parseViewBox(svg: string): { w: number; h: number } {
  const m = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!m) return { w: 1, h: 1 };
  const [, , w, h] = m[1].trim().split(/\s+/).map(Number);
  return { w: w || 1, h: h || 1 };
}

/**
 * Renders the tagged cap SVG for the active model + view.
 * - Part colors are applied through CSS variables on the wrapper.
 * - The uploaded logo is injected into the SVG (front view only) as an <image>
 *   clipped to the front panel (#frontPanel) so it never spills outside the
 *   crown, with a light shear/scale distortion as it moves sideways to hint at
 *   the curve of the cap.
 */
export function CapView() {
  const model = useActiveModel();
  const view = useCustomizerStore((s) => s.activeView);
  const colors = useCustomizerStore((s) => s.partColors);
  const logo = useCustomizerStore((s) => s.logo);
  const hostRef = useRef<HTMLDivElement>(null);

  const svg = capSvg(model.id, view);
  const vb = useMemo(() => parseViewBox(svg), [svg]);

  // Base SVG is injected once per (model, view); the logo layer is managed
  // imperatively so dragging the sliders doesn't re-parse the whole SVG.
  const baseHtml = useMemo(() => svg, [svg]);

  const wrapperStyle: CSSProperties = { aspectRatio: `${vb.w} / ${vb.h}` };
  for (const part of PART_ORDER) {
    let value = colors[part];
    // Trucker's mesh (copa lados/trás) is always shown black on the back view.
    if (model.id === 'trucker' && view === 'tras' && part === 'copaLadosTras') {
      value = '#111111';
    }
    (wrapperStyle as Record<string, string>)[PARTS[part].cssVar] = value;
  }

  useEffect(() => {
    const host = hostRef.current;
    const svgEl = host?.querySelector('svg');
    if (!svgEl) return;

    svgEl.querySelector('#logo-layer')?.remove();
    if (view !== 'frente' || !logo.url) return;

    const hasPanel = !!svgEl.querySelector('#frontPanel');
    if (hasPanel && !svgEl.querySelector('#frontPanelClip')) {
      const clip = document.createElementNS(SVG_NS, 'clipPath');
      clip.setAttribute('id', 'frontPanelClip');
      const use = document.createElementNS(SVG_NS, 'use');
      use.setAttribute('href', '#frontPanel');
      use.setAttributeNS(XLINK_NS, 'xlink:href', '#frontPanel');
      clip.appendChild(use);
      svgEl.appendChild(clip);
    }

    const a = model.logoAnchor;
    const w = a.w * vb.w * logo.scale;
    const h = a.h * vb.h * logo.scale;
    const cx = (a.cx + logo.offset[0]) * vb.w;
    const cy = (a.cy + logo.offset[1]) * vb.h;
    const rot = (logo.rotation * 180) / Math.PI;
    // Distortion grows with horizontal offset: compress horizontally + shear.
    const nx = Math.max(-1, Math.min(1, logo.offset[0] / 0.25));
    const sx = 1 - 0.22 * Math.abs(nx);
    const shear = -11 * nx;

    const layer = document.createElementNS(SVG_NS, 'g');
    layer.setAttribute('id', 'logo-layer');
    if (hasPanel) layer.setAttribute('clip-path', 'url(#frontPanelClip)');

    const inner = document.createElementNS(SVG_NS, 'g');
    inner.setAttribute(
      'transform',
      `translate(${cx} ${cy}) rotate(${rot}) scale(${sx} 1) skewX(${shear}) translate(${-w / 2} ${-h / 2})`,
    );
    const img = document.createElementNS(SVG_NS, 'image');
    img.setAttribute('href', logo.url);
    img.setAttributeNS(XLINK_NS, 'xlink:href', logo.url);
    img.setAttribute('x', '0');
    img.setAttribute('y', '0');
    img.setAttribute('width', String(w));
    img.setAttribute('height', String(h));
    img.setAttribute('preserveAspectRatio', 'xMidYMid meet');

    inner.appendChild(img);
    layer.appendChild(inner);
    svgEl.appendChild(layer);
  }, [view, logo, model, vb, baseHtml]);

  return (
    <div
      className="cap-view"
      style={wrapperStyle}
      ref={hostRef}
      dangerouslySetInnerHTML={{ __html: baseHtml }}
    />
  );
}
