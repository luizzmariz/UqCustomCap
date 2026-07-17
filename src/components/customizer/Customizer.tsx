import { Suspense, lazy } from 'react';
import { ControlsPanel } from './ControlsPanel';
import { BottomSheet } from '../ui/BottomSheet';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useT } from '../../i18n';

// Code-split the heavy Three.js bundle so it loads with the customizer only.
const CapCanvas = lazy(() =>
  import('../../scene/CapCanvas').then((m) => ({ default: m.CapCanvas })),
);

function CanvasArea() {
  const t = useT();
  return (
    <div className="relative h-full w-full">
      <Suspense
        fallback={
          <div className="grid h-full place-items-center text-sm text-slate-400">
            {t('canvas.loading')}…
          </div>
        }
      >
        <CapCanvas />
      </Suspense>
      <p className="pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-black/40 px-3 py-1 text-[11px] text-white">
        {t('canvas.hint')}
      </p>
    </div>
  );
}

export function Customizer() {
  const isMobile = useIsMobile();
  const t = useT();

  if (isMobile) {
    return (
      <section id="customizer" className="relative">
        <div className="h-[58vh] w-full bg-gradient-to-b from-slate-100 to-slate-200">
          <CanvasArea />
        </div>
        <BottomSheet>
          <ControlsPanel />
        </BottomSheet>
      </section>
    );
  }

  return (
    <section
      id="customizer"
      className="mx-auto grid max-w-7xl grid-cols-[1fr_380px] gap-6 px-6 py-8"
    >
      <div className="h-[70vh] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200">
        <CanvasArea />
      </div>
      <aside className="flex h-[70vh] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-4">
          <h2 className="text-lg font-bold text-slate-900">{t('customizer.title')}</h2>
          <p className="text-xs text-slate-500">{t('customizer.subtitle')}</p>
        </div>
        <div className="flex-1">
          <ControlsPanel />
        </div>
      </aside>
    </section>
  );
}
