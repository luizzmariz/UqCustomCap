import { MODELS } from '../../config/caps';
import { useCustomizerStore } from '../../store/customizerStore';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

export function ModelPicker() {
  const t = useT();
  const activeId = useCustomizerStore((s) => s.activeModelId);
  const setModel = useCustomizerStore((s) => s.setModel);

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{t('model.chooseTitle')}</h3>
      <div className="mt-3 grid grid-cols-1 gap-2">
        {MODELS.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setModel(m.id)}
            className={cn(
              'flex items-center justify-between rounded-xl border p-3 text-left transition-colors',
              activeId === m.id
                ? 'border-brand-blue bg-blue-50'
                : 'border-slate-200 hover:border-slate-300',
            )}
          >
            <span className="text-sm font-medium text-slate-800">
              {t(`model.${m.id}`)}
              <span className="ml-2 text-xs font-normal text-slate-400">{m.name}</span>
            </span>
            {activeId === m.id && <span className="text-xs font-bold text-brand-blue">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}
