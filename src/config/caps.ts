// ---------------------------------------------------------------------------
// Vector cap configuration — single source of truth for the SVG customizer.
//
// Each recolorable region in src/caps/*.svg carries a `data-part` attribute and
// its fill is driven by a CSS variable set on the wrapper. Regions:
//   copaFrente     -> --c-copa-frente   (front crown panel; logo goes here)
//   copaLadosTras  -> --c-copa-lados    (side/back panels; the mesh on Trucker)
//   abaCima        -> --c-aba-cima      (top of the visor)
//   abaBaixo       -> --c-aba-baixo     (underside/edge of the visor)
//   botao          -> --c-botao         (top button)
// See tools/tag-caps.mjs for how the tagging is produced.
// ---------------------------------------------------------------------------

export type PartId = 'copaFrente' | 'copaLadosTras' | 'abaCima' | 'abaBaixo' | 'botao';
export type ViewId = 'frente' | 'lado' | 'tras';

export const VIEWS: ViewId[] = ['frente', 'lado', 'tras'];

export interface PartDef {
  id: PartId;
  labelKey: string;
  cssVar: string;
  defaultColor: string;
}

export const PART_ORDER: PartId[] = ['copaFrente', 'copaLadosTras', 'abaCima', 'abaBaixo', 'botao'];

export const PARTS: Record<PartId, PartDef> = {
  copaFrente: { id: 'copaFrente', labelKey: 'part.copaFrente', cssVar: '--c-copa-frente', defaultColor: '#2626b5' },
  copaLadosTras: { id: 'copaLadosTras', labelKey: 'part.copaLadosTras', cssVar: '--c-copa-lados', defaultColor: '#2626b5' },
  abaCima: { id: 'abaCima', labelKey: 'part.abaCima', cssVar: '--c-aba-cima', defaultColor: '#0b1233' },
  abaBaixo: { id: 'abaBaixo', labelKey: 'part.abaBaixo', cssVar: '--c-aba-baixo', defaultColor: '#0b1233' },
  botao: { id: 'botao', labelKey: 'part.botao', cssVar: '--c-botao', defaultColor: '#2626b5' },
};

export interface CapModel {
  id: string;
  name: string;
  parts: PartId[];
  /** Per-model label overrides (e.g. Trucker calls the side/back panels "Tela"). */
  labelOverrides?: Partial<Record<PartId, string>>;
  /** Logo placement on the FRONT panel, normalized to the viewBox (0..1). */
  logoAnchor: { cx: number; cy: number; w: number; h: number };
}

export const MODELS: CapModel[] = [
  {
    id: 'americano',
    name: 'Americano',
    parts: PART_ORDER,
    logoAnchor: { cx: 0.5, cy: 0.4, w: 0.34, h: 0.24 },
  },
  {
    id: 'baseball',
    name: 'Baseball',
    parts: PART_ORDER,
    logoAnchor: { cx: 0.5, cy: 0.42, w: 0.34, h: 0.24 },
  },
  {
    id: 'trucker',
    name: 'Trucker',
    parts: PART_ORDER,
    labelOverrides: { copaLadosTras: 'part.tela' },
    logoAnchor: { cx: 0.5, cy: 0.4, w: 0.34, h: 0.24 },
  },
];

export const DEFAULT_PART_COLORS: Record<PartId, string> = {
  copaFrente: PARTS.copaFrente.defaultColor,
  copaLadosTras: PARTS.copaLadosTras.defaultColor,
  abaCima: PARTS.abaCima.defaultColor,
  abaBaixo: PARTS.abaBaixo.defaultColor,
  botao: PARTS.botao.defaultColor,
};
