import { useCustomizerStore } from '../../store/customizerStore';
import type { Locale } from '../../i18n';
import { cn } from '../../lib/cn';

const LOCALES: Locale[] = ['pt', 'en'];

export function LanguageToggle() {
  const locale = useCustomizerStore((s) => s.locale);
  const setLocale = useCustomizerStore((s) => s.setLocale);

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-white/25 text-xs font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLocale(l)}
          aria-pressed={locale === l}
          className={cn(
            'px-2.5 py-1 uppercase transition-colors',
            locale === l ? 'bg-white text-brand-ink' : 'text-white/80 hover:bg-white/10',
          )}
        >
          {l}
        </button>
      ))}
    </div>
  );
}
