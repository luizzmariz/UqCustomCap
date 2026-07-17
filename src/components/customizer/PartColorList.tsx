import { useActiveModel } from '../../store/customizerStore';
import { ColorSwatchRow } from './ColorSwatchRow';
import { useT } from '../../i18n';

export function PartColorList() {
  const model = useActiveModel();
  const t = useT();

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{t('controls.colorsTitle')}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{t('controls.colorsHint')}</p>
      <div className="mt-1 divide-y divide-slate-100">
        {model.parts
          .filter((part) => part.recolorable)
          .map((part) => (
            <ColorSwatchRow key={part.id} part={part} />
          ))}
      </div>
    </div>
  );
}
