import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { capSvg } from '../caps';
import { useActiveModel, useCustomizerStore } from '../store/customizerStore';

function parseViewBox(svg: string): { w: number; h: number } {
  const m = svg.match(/viewBox="([\d.\s-]+)"/);
  if (!m) return { w: 1, h: 1 };
  const [, , w, h] = m[1].trim().split(/\s+/).map(Number);
  return { w: w || 1, h: h || 1 };
}

/**
 * Renders the tagged cap SVG for the active model + view.
 * Part colors are applied through CSS variables on the wrapper; the uploaded
 * logo is overlaid (front view only) as an absolutely-positioned image whose
 * percentage coordinates line up with the viewBox thanks to `aspect-ratio`.
 */
export function CapView() {
  const model = useActiveModel();
  const view = useCustomizerStore((s) => s.activeView);
  const colors = useCustomizerStore((s) => s.partColors);
  const logo = useCustomizerStore((s) => s.logo);

  const svg = capSvg(model.id, view);
  const vb = useMemo(() => parseViewBox(svg), [svg]);

  const wrapperStyle: CSSProperties = {
    // CSS variables drive the [data-part] fills inside the SVG.
    ['--c-crown' as string]: colors.crown,
    ['--c-brim' as string]: colors.brim,
    ['--c-button' as string]: colors.button,
    ['--c-mesh' as string]: colors.mesh,
    aspectRatio: `${vb.w} / ${vb.h}`,
  };

  const showLogo = view === 'frente' && logo.url;
  const a = model.logoAnchor;
  const logoStyle: CSSProperties = {
    left: `${(a.cx + logo.offset[0]) * 100}%`,
    top: `${(a.cy + logo.offset[1]) * 100}%`,
    width: `${a.w * logo.scale * 100}%`,
    transform: `translate(-50%, -50%) rotate(${logo.rotation}rad)`,
  };

  return (
    <div className="cap-view" style={wrapperStyle}>
      <div className="cap-svg" dangerouslySetInnerHTML={{ __html: svg }} />
      {showLogo && <img className="cap-logo" src={logo.url ?? ''} alt="logo" style={logoStyle} />}
    </div>
  );
}
