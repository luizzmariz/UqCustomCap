import { useActiveModel } from '../../store/customizerStore';
import { PART_ORDER } from '../../config/caps';
import { ColorSwatchRow } from './ColorSwatchRow';
import { useT } from '../../i18n';

export function PartColorList() {
  const model = useActiveModel();
  const t = useT();
  const parts = PART_ORDER.filter((p) => model.parts.includes(p));

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{t('controls.colorsTitle')}</h3>
      <p className="mt-0.5 text-xs text-slate-500">{t('controls.colorsHint')}</p>
      <div className="mt-1 divide-y divide-slate-100">
        {parts.map((part) => (
          <ColorSwatchRow key={part} part={part} />
        ))}
      </div>
    </div>
  );
}
