export interface ColorPreset {
  /** i18n key for the color name. */
  key: string;
  hex: string;
}

/** Quick-pick brand palette shown under each part's color control. */
export const COLOR_PRESETS: ColorPreset[] = [
  { key: 'color.royal', hex: '#2563eb' },
  { key: 'color.navy', hex: '#1e3a8a' },
  { key: 'color.red', hex: '#dc2626' },
  { key: 'color.black', hex: '#111827' },
  { key: 'color.white', hex: '#f8fafc' },
  { key: 'color.gray', hex: '#6b7280' },
  { key: 'color.green', hex: '#4b5320' },
  { key: 'color.beige', hex: '#d6c7a1' },
  { key: 'color.yellow', hex: '#f59e0b' },
  { key: 'color.pink', hex: '#ec4899' },
];
