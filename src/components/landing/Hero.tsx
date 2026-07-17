import { Button } from '../ui/Button';
import { LanguageToggle } from '../ui/LanguageToggle';
import { useT } from '../../i18n';

export function Hero() {
  const t = useT();
  const logoUrl = `${import.meta.env.BASE_URL}favicon.svg`;

  return (
    <header className="relative overflow-hidden bg-brand-ink text-white">
      <div
        className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-brand-blue/20 blur-3xl"
        aria-hidden
      />
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <img src={logoUrl} className="h-8 w-8" alt="" />
          <span className="text-lg font-bold">UQ Bonés</span>
        </div>
        <LanguageToggle />
      </nav>

      <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-8 md:pb-24 md:pt-14">
        <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
          {t('hero.badge')}
        </span>
        <h1 className="mt-4 max-w-2xl text-4xl font-extrabold leading-tight md:text-6xl">
          {t('hero.title')}
        </h1>
        <p className="mt-4 max-w-xl text-base text-slate-300 md:text-lg">{t('hero.subtitle')}</p>
        <Button
          className="mt-8 px-6 py-3 text-base"
          onClick={() =>
            document.getElementById('customizer')?.scrollIntoView({ behavior: 'smooth' })
          }
        >
          {t('hero.cta')}
        </Button>
      </div>
    </header>
  );
}
