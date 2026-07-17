import { create } from 'zustand';
import { CAP_MODELS } from '../config/capModels';
import type { CapModel, Hex } from '../config/capModels';
import type { Locale } from '../i18n';

export interface LogoState {
  /** Object URL of the uploaded image, or null when no logo is set. */
  url: string | null;
  fileName: string | null;
  /** Multiplier applied to the model's base logo scale (0.3–2). */
  scale: number;
  /** In-plane nudge of the logo, in model units. */
  offset: [number, number];
  /** In-plane rotation, in radians. */
  rotation: number;
}

const INITIAL_LOGO: LogoState = {
  url: null,
  fileName: null,
  scale: 1,
  offset: [0, 0],
  rotation: 0,
};

function defaultColors(model: CapModel): Record<string, Hex> {
  return Object.fromEntries(model.parts.map((p) => [p.id, p.defaultColor]));
}

const FIRST_MODEL = CAP_MODELS[0];

interface CustomizerState {
  locale: Locale;
  activeModelId: string;
  partColors: Record<string, Hex>;
  logo: LogoState;
  /** Bumped on every change so the demand-loop canvas re-renders. */
  renderVersion: number;

  setLocale: (locale: Locale) => void;
  setModel: (id: string) => void;
  setPartColor: (partId: string, hex: Hex) => void;
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
  partColors: defaultColors(FIRST_MODEL),
  logo: INITIAL_LOGO,
  renderVersion: 0,

  setLocale: (locale) => set((s) => ({ locale, renderVersion: s.renderVersion + 1 })),

  setModel: (id) => {
    const model = CAP_MODELS.find((m) => m.id === id) ?? FIRST_MODEL;
    set((s) => ({
      activeModelId: model.id,
      partColors: defaultColors(model),
      renderVersion: s.renderVersion + 1,
    }));
  },

  setPartColor: (partId, hex) =>
    set((s) => ({
      partColors: { ...s.partColors, [partId]: hex },
      renderVersion: s.renderVersion + 1,
    })),

  setLogoFile: (file) => {
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    const url = URL.createObjectURL(file);
    set((s) => ({
      logo: { ...INITIAL_LOGO, url, fileName: file.name },
      renderVersion: s.renderVersion + 1,
    }));
  },

  setLogoScale: (scale) =>
    set((s) => ({ logo: { ...s.logo, scale }, renderVersion: s.renderVersion + 1 })),

  setLogoRotation: (rotation) =>
    set((s) => ({ logo: { ...s.logo, rotation }, renderVersion: s.renderVersion + 1 })),

  setLogoOffset: (offset) =>
    set((s) => ({ logo: { ...s.logo, offset }, renderVersion: s.renderVersion + 1 })),

  clearLogo: () => {
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    set((s) => ({ logo: INITIAL_LOGO, renderVersion: s.renderVersion + 1 }));
  },

  reset: () => {
    const model = CAP_MODELS.find((m) => m.id === get().activeModelId) ?? FIRST_MODEL;
    const previous = get().logo.url;
    if (previous) URL.revokeObjectURL(previous);
    set((s) => ({
      partColors: defaultColors(model),
      logo: INITIAL_LOGO,
      renderVersion: s.renderVersion + 1,
    }));
  },
}));

/** Convenience hook: the currently selected cap model object. */
export function useActiveModel(): CapModel {
  const id = useCustomizerStore((s) => s.activeModelId);
  return CAP_MODELS.find((m) => m.id === id) ?? FIRST_MODEL;
}
