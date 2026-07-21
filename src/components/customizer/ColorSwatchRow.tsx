import { useCustomizerStore } from '../../store/customizerStore';
import { PARTS } from '../../config/caps';
import type { PartId } from '../../config/caps';
import { COLOR_PRESETS } from '../../lib/colors';
import { useT } from '../../i18n';
import { cn } from '../../lib/cn';

export function ColorSwatchRow({ part, labelKey }: { part: PartId; labelKey?: string }) {
  const t = useT();
  const color = useCustomizerStore((s) => s.partColors[part]);
  const setPartColor = useCustomizerStore((s) => s.setPartColor);
  const label = labelKey ?? PARTS[part].labelKey;

  return (
    <div className="py-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{t(label)}</span>
        <label
          className="relative flex h-7 w-7 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-slate-300 shadow-sm"
          style={{ backgroundColor: color }}
        >
          <input
            type="color"
            value={color}
            onChange={(e) => setPartColor(part, e.target.value)}
            className="absolute inset-0 cursor-pointer opacity-0"
            aria-label={t(label)}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {COLOR_PRESETS.map((preset) => (
          <button
            key={preset.hex}
            type="button"
            onClick={() => setPartColor(part, preset.hex)}
            title={t(preset.key)}
            aria-label={t(preset.key)}
            className={cn(
              'h-7 w-7 rounded-full border transition-transform hover:scale-110',
              color.toLowerCase() === preset.hex.toLowerCase()
                ? 'border-brand-blue ring-2 ring-brand-blue/40'
                : 'border-slate-300',
            )}
            style={{ backgroundColor: preset.hex }}
          />
        ))}
      </div>
    </div>
  );
}
