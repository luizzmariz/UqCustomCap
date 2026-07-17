import { useT } from '../../i18n';

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-6 py-8 text-center md:flex-row md:justify-between md:text-left">
        <div>
          <p className="font-bold text-slate-900">UQ Bonés</p>
          <p className="text-sm text-slate-500">{t('footer.tagline')}</p>
        </div>
        <div className="flex flex-col items-center gap-1 md:items-end">
          <a
            href="https://www.instagram.com/uq_bones/"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-brand-blue hover:underline"
          >
            @uq_bones · {t('footer.follow')}
          </a>
          <p className="text-xs text-slate-400">
            © {year} UQ Bonés · {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
}
