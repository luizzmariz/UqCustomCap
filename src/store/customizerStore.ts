import { create } from 'zustand';
import { MODELS, DEFAULT_PART_COLORS } from '../config/caps';
import type { CapModel, PartId, ViewId } from '../config/caps';
import type { Locale } from '../i18n';

export interface LogoState {
  url: string | null;
  fileName: string | null;
  /** Multiplier on the model's base logo size (0.3–2). */
  scale: number;
  /** In-plane nudge, as a fraction of the viewBox (−0.25..0.25). */
  offset: [number, number];
  /** In-plane rotation, radians. */
  rotation: number;
}

const INITIAL_LOGO: LogoState = {
  url: null,
  fileName: null,
  scale: 1,
  offset: [0, 0],
  rotation: 0,
};

const FIRST_MODEL = MODELS[0];

interface CustomizerState {
  locale: Locale;
  activeModelId: string;
  activeView: ViewId;
  partColors: Record<PartId, string>;
  logo: LogoState;

  setLocale: (locale: Locale) => void;
  setModel: (id: string) => void;
  setView: (view: ViewId) => void;
  setPartColor: (part: PartId, hex: string) => void;
  setLogoFile: (file: File) => void;
  setLogoScale: (scale: number) => void;
  setLogoRotation: (rotation: number) => void;
  setLogoOffset: (offset: [number, number]) => void;
  clearLogo: () => void;
  reset: () => void;
}

export const useCustomizerStore = create<CustomizerState>((set, get) => ({
  locale: 'pt',
  activeModelId: FIRST_MODEL.id,
  activeView: 'frente',
  partColors: { ...DEFAULT_PART_COLORS },
  logo: INITIAL_LOGO,

  setLocale: (locale) => set({ locale }),
  setModel: (id) => set({ activeModelId: MODELS.find((m) => m.id === id)?.id ?? FIRST_MODEL.id }),
  setView: (view) => set({ activeView: view }),
  setPartColor: (part, hex) => set((s) => ({ partColors: { ...s.partColors, [part]: hex } })),

  setLogoFile: (file) => {
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    const url = URL.createObjectURL(file);
    set({ logo: { ...INITIAL_LOGO, url, fileName: file.name } });
  },
  setLogoScale: (scale) => set((s) => ({ logo: { ...s.logo, scale } })),
  setLogoRotation: (rotation) => set((s) => ({ logo: { ...s.logo, rotation } })),
  setLogoOffset: (offset) => set((s) => ({ logo: { ...s.logo, offset } })),
  clearLogo: () => {
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    set({ logo: INITIAL_LOGO });
  },

  reset: () => {
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    set({ partColors: { ...DEFAULT_PART_COLORS }, logo: INITIAL_LOGO });
  },
}));

export function useActiveModel(): CapModel {
  const id = useCustomizerStore((s) => s.activeModelId);
  return MODELS.find((m) => m.id === id) ?? FIRST_MODEL;
}
