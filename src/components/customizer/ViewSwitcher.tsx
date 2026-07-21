import { VIEWS } from '../../config/caps';
import type { ViewId } from '../../config/caps';
import { useCustomizerStore } from '../../store/customizerStore';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

export function ViewSwitcher() {
  const t = useT();
  const view = useCustomizerStore((s) => s.activeView);
  const setView = useCustomizerStore((s) => s.setView);

  return (
    <div className="inline-flex rounded-full bg-white/80 p-1 shadow-sm backdrop-blur" role="tablist">
      {VIEWS.map((v: ViewId) => (
        <button
          key={v}
          type="button"
          role="tab"
          aria-selected={view === v}
          onClick={() => setView(v)}
          className={cn(
            'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
            view === v ? 'bg-brand-navy text-white' : 'text-slate-600 hover:text-slate-900',
          )}
        >
          {t(`view.${v}`)}
        </button>
      ))}
    </div>
  );
}
