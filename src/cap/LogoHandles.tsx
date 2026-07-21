import { useRef } from 'react';
import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useActiveModel, useCustomizerStore } from '../store/customizerStore';

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

/**
 * Interactive overlay to move/resize the logo directly on the cap (front view).
 * The dashed box mirrors the logo footprint; drag it to move, drag the corner
 * handle to resize. Coordinates are fractions of the cap-view box, which matches
 * the SVG viewBox (the wrapper keeps the SVG aspect ratio).
 */
export function LogoHandles() {
  const model = useActiveModel();
  const logo = useCustomizerStore((s) => s.logo);
  const setLogoOffset = useCustomizerStore((s) => s.setLogoOffset);
  const setLogoScale = useCustomizerStore((s) => s.setLogoScale);
  const overlayRef = useRef<HTMLDivElement>(null);
  const a = model.logoAnchor;

  const beginDrag = (e: ReactPointerEvent) => {
    e.preventDefault();
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const startX = e.clientX;
    const startY = e.clientY;
    const [ox, oy] = logo.offset;
    const move = (ev: PointerEvent) => {
      setLogoOffset([
        clamp(ox + (ev.clientX - startX) / rect.width, -0.45, 0.45),
        clamp(oy + (ev.clientY - startY) / rect.height, -0.45, 0.45),
      ]);
    };
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };

  const beginResize = (e: ReactPointerEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const rect = overlayRef.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + (a.cx + logo.offset[0]) * rect.width;
    const cy = rect.top + (a.cy + logo.offset[1]) * rect.height;
    const startDist = Math.hypot(e.clientX - cx, e.clientY - cy) || 1;
    const startScale = logo.scale;
    const move = (ev: PointerEvent) => {
      const dist = Math.hypot(ev.clientX - cx, ev.clientY - cy);
      setLogoScale(clamp((startScale * dist) / startDist, 0.3, 3));
    };
    const end = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', end);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', end);
  };

  const boxStyle: CSSProperties = {
    left: `${(a.cx + logo.offset[0]) * 100}%`,
    top: `${(a.cy + logo.offset[1]) * 100}%`,
    width: `${a.w * logo.scale * 100}%`,
    height: `${a.h * logo.scale * 100}%`,
    transform: `translate(-50%, -50%) rotate(${logo.rotation}rad)`,
  };

  return (
    <div className="cap-overlay" ref={overlayRef}>
      <div className="logo-box" style={boxStyle} onPointerDown={beginDrag}>
        <span className="logo-handle logo-handle-br" onPointerDown={beginResize} />
      </div>
    </div>
  );
}
