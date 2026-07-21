import { useEffect, useMemo, useRef } from 'react';
import type { CSSProperties } from 'react';
import { capSvg } from '../caps';
import { PARTS, PART_ORDER } from '../config/caps';
import { useActiveModel, useCustomizerStore } from '../store/customizerStore';
import { LogoHandles } from './LogoHandles';

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
 * - Part colors come from CSS variables on the wrapper.
 * - The logo (front view only) is injected as an <image> clipped to the front
 *   panel (#frontPanel), with a light shear/scale distortion as it moves
 *   sideways. It can be dragged/resized directly via <LogoHandles/>.
 */
export function CapView() {
  const model = useActiveModel();
  const view = useCustomizerStore((s) => s.activeView);
  const colors = useCustomizerStore((s) => s.partColors);
  const logo = useCustomizerStore((s) => s.logo);
  const canvasRef = useRef<HTMLDivElement>(null);

  const svg = capSvg(model.id, view);
  const vb = useMemo(() => parseViewBox(svg), [svg]);
  const baseHtml = useMemo(() => svg, [svg]);

  const wrapperStyle: CSSProperties = { aspectRatio: `${vb.w} / ${vb.h}` };
  for (const part of PART_ORDER) {
    (wrapperStyle as Record<string, string>)[PARTS[part].cssVar] = colors[part];
  }

  useEffect(() => {
    const svgEl = canvasRef.current?.querySelector('svg');
    if (!svgEl) return;

    if (view !== 'frente' || !logo.url) {
      svgEl.querySelector('#logo-layer')?.remove();
      return;
    }

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

    // Create the layer/image once; afterwards only update geometry so dragging
    // never re-loads the image.
    let layer = svgEl.querySelector<SVGGElement>('#logo-layer');
    let inner: SVGGElement;
    let img: SVGImageElement;
    if (!layer) {
      layer = document.createElementNS(SVG_NS, 'g');
      layer.setAttribute('id', 'logo-layer');
      if (hasPanel) layer.setAttribute('clip-path', 'url(#frontPanelClip)');
      inner = document.createElementNS(SVG_NS, 'g');
      img = document.createElementNS(SVG_NS, 'image');
      img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      inner.appendChild(img);
      layer.appendChild(inner);
      svgEl.appendChild(layer);
    } else {
      inner = layer.firstChild as SVGGElement;
      img = inner.firstChild as SVGImageElement;
    }

    if (img.getAttribute('href') !== logo.url) {
      img.setAttribute('href', logo.url);
      img.setAttributeNS(XLINK_NS, 'xlink:href', logo.url);
    }

    const a = model.logoAnchor;
    const w = a.w * vb.w * logo.scale;
    const h = a.h * vb.h * logo.scale;
    const cx = (a.cx + logo.offset[0]) * vb.w;
    const cy = (a.cy + logo.offset[1]) * vb.h;
    const rot = (logo.rotation * 180) / Math.PI;
    const nx = Math.max(-1, Math.min(1, logo.offset[0] / 0.25));
    const sx = 1 - 0.22 * Math.abs(nx);
    const shear = -11 * nx;

    img.setAttribute('x', String(-w / 2));
    img.setAttribute('y', String(-h / 2));
    img.setAttribute('width', String(w));
    img.setAttribute('height', String(h));
    inner.setAttribute(
      'transform',
      `translate(${cx} ${cy}) rotate(${rot}) scale(${sx} 1) skewX(${shear})`,
    );
  }, [view, logo, model, vb, baseHtml]);

  return (
    <div className="cap-view" style={wrapperStyle}>
      <div className="cap-canvas" ref={canvasRef} dangerouslySetInnerHTML={{ __html: baseHtml }} />
      {view === 'frente' && logo.url && <LogoHandles />}
    </div>
  );
}
