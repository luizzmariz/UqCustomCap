export interface ColorPreset {
  /** i18n key for the color name. */
  key: string;
  hex: string;
}

/** UQ Bonés brand palette (fixed set of available colors). */
export const COLOR_PRESETS: ColorPreset[] = [
  { key: 'color.branco', hex: '#eaeaea' },
  { key: 'color.cinza', hex: '#727272' },
  { key: 'color.preto', hex: '#111111' },
  { key: 'color.vermelho', hex: '#c12121' },
  { key: 'color.rosa', hex: '#d884c8' },
  { key: 'color.vinho', hex: '#51132c' },
  { key: 'color.marrom', hex: '#3a2919' },
  { key: 'color.laranja', hex: '#c6722e' },
  { key: 'color.bege', hex: '#cebf9d' },
  { key: 'color.verde', hex: '#48b539' },
  { key: 'color.verdeMusgo', hex: '#253312' },
  { key: 'color.verdeEscuro', hex: '#0c300c' },
  { key: 'color.verdeAzulado', hex: '#2e514d' },
  { key: 'color.azulClaro', hex: '#3660a3' },
  { key: 'color.azulEscuro', hex: '#0b1233' },
  { key: 'color.azulRoyal', hex: '#2626b5' },
  { key: 'color.amarelo', hex: '#c4af33' },
  { key: 'color.roxo', hex: '#5a28a3' },
];
