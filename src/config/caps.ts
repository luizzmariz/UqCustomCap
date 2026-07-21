// ---------------------------------------------------------------------------
// Vector cap configuration — single source of truth for the SVG customizer.
//
// The tagged SVGs live in src/caps/*.svg. Each recolorable region carries a
// `data-part` attribute (crown | brim | button | mesh) and its fill is driven
// by a CSS variable (--c-crown, --c-brim, --c-button, --c-mesh) set on the
// wrapper. See tools/tag-caps.mjs for how the tagging is produced.
// ---------------------------------------------------------------------------

export type PartId = 'crown' | 'brim' | 'button' | 'mesh';
export type ViewId = 'frente' | 'lado' | 'tras';

export const VIEWS: ViewId[] = ['frente', 'lado', 'tras'];

export interface PartDef {
  id: PartId;
  labelKey: string;
  defaultColor: string;
}

/** Order used when listing color controls. */
export const PART_ORDER: PartId[] = ['crown', 'brim', 'mesh', 'button'];

export const PARTS: Record<PartId, PartDef> = {
  crown: { id: 'crown', labelKey: 'part.crown', defaultColor: '#1e3a8a' },
  brim: { id: 'brim', labelKey: 'part.brim', defaultColor: '#1e3a8a' },
  mesh: { id: 'mesh', labelKey: 'part.mesh', defaultColor: '#f3f4f6' },
  button: { id: 'button', labelKey: 'part.button', defaultColor: '#1e3a8a' },
};

export interface CapModel {
  id: string;
  name: string;
  /** Recolorable parts available on this model. */
  parts: PartId[];
  /** Logo placement on the FRONT panel, normalized to the viewBox (0..1). */
  logoAnchor: { cx: number; cy: number; w: number; h: number };
}

export const MODELS: CapModel[] = [
  {
    id: 'americano',
    name: 'Americano',
    parts: ['crown', 'brim', 'button'],
    logoAnchor: { cx: 0.5, cy: 0.4, w: 0.34, h: 0.24 },
  },
  {
    id: 'baseball',
    name: 'Baseball',
    parts: ['crown', 'brim', 'button'],
    logoAnchor: { cx: 0.5, cy: 0.42, w: 0.34, h: 0.24 },
  },
  {
    id: 'trucker',
    name: 'Trucker',
    parts: ['crown', 'brim', 'button', 'mesh'],
    logoAnchor: { cx: 0.5, cy: 0.4, w: 0.34, h: 0.24 },
  },
];

export const DEFAULT_PART_COLORS: Record<PartId, string> = {
  crown: PARTS.crown.defaultColor,
  brim: PARTS.brim.defaultColor,
  button: PARTS.button.defaultColor,
  mesh: PARTS.mesh.defaultColor,
};
