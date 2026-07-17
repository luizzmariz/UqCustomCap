import { useCustomizerStore } from '../store/customizerStore';
import { pt } from './pt';
import { en } from './en';

export type Locale = 'pt' | 'en';

const dicts: Record<Locale, Record<string, string>> = { pt, en };

/**
 * Returns a translate function bound to the current locale.
 * Unknown keys fall back to the key itself (handy during development).
 */
export function useT() {
  const locale = useCustomizerStore((s) => s.locale);
  return (key: string): string => dicts[locale][key] ?? key;
}
