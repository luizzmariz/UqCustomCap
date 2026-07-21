import { useRef } from 'react';
import type { ChangeEvent } from 'react';
import { useCustomizerStore } from '../../store/customizerStore';
import { Button } from '../ui/Button';
import { Slider } from '../ui/Slider';
import { useT } from '../../i18n';

export function LogoUploader() {
  const t = useT();
  const inputRef = useRef<HTMLInputElement>(null);
  const logo = useCustomizerStore((s) => s.logo);
  const setLogoFile = useCustomizerStore((s) => s.setLogoFile);
  const setLogoScale = useCustomizerStore((s) => s.setLogoScale);
  const setLogoRotation = useCustomizerStore((s) => s.setLogoRotation);
  const setLogoOffset = useCustomizerStore((s) => s.setLogoOffset);
  const clearLogo = useCustomizerStore((s) => s.clearLogo);
  const setView = useCustomizerStore((s) => s.setView);

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setView('frente'); // the logo is shown on the front panel
    }
    e.target.value = '';
  };

  const toDeg = (rad: number) => `${Math.round((rad * 180) / Math.PI)}°`;
  const toPct = (n: number) => `${Math.round(n * 100)}%`;

  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-900">{t('logo.title')}</h3>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        className="hidden"
        onChange={onPick}
      />

      {logo.url ? (
        <div className="mt-3 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-16 w-16 shrink-0 rounded-lg border border-slate-200 bg-slate-100 p-1">
              <img src={logo.url} alt={logo.fileName ?? 'logo'} className="h-full w-full object-contain" />
            </div>
            <div className="flex flex-1 flex-wrap gap-2">
              <Button variant="outline" onClick={() => inputRef.current?.click()}>
                {t('logo.change')}
              </Button>
              <Button variant="ghost" onClick={clearLogo}>
                {t('logo.remove')}
              </Button>
            </div>
          </div>

          <Slider
            label={t('logo.size')}
            min={0.3}
            max={2}
            step={0.01}
            value={logo.scale}
            onChange={setLogoScale}
            format={toPct}
          />
          <Slider
            label={t('logo.rotation')}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={logo.rotation}
            onChange={setLogoRotation}
            format={toDeg}
          />
          <Slider
            label={t('logo.offsetX')}
            min={-0.25}
            max={0.25}
            step={0.005}
            value={logo.offset[0]}
            onChange={(v) => setLogoOffset([v, logo.offset[1]])}
          />
          <Slider
            label={t('logo.offsetY')}
            min={-0.25}
            max={0.25}
            step={0.005}
            value={logo.offset[1]}
            onChange={(v) => setLogoOffset([logo.offset[0], v])}
          />
        </div>
      ) : (
        <div className="mt-3 rounded-xl border-2 border-dashed border-slate-200 p-6 text-center">
          <p className="text-sm text-slate-500">{t('logo.empty')}</p>
          <Button className="mt-3" onClick={() => inputRef.current?.click()}>
            {t('logo.upload')}
          </Button>
        </div>
      )}

      <p className="mt-3 text-xs text-slate-400">{t('logo.frontOnly')}</p>
    </div>
  );
}
