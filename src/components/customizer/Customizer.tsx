import { ControlsPanel } from './ControlsPanel';
import { ViewSwitcher } from './ViewSwitcher';
import { BottomSheet } from '../ui/BottomSheet';
import { CapView } from '../../cap/CapView';
import { useIsMobile } from '../../hooks/useIsMobile';
import { useT } from '../../i18n';

function Stage() {
  return (
    <div className="relative h-full w-full">
      <div className="cap-stage">
        <CapView />
      </div>
      <div className="absolute inset-x-0 bottom-3 flex justify-center">
        <ViewSwitcher />
      </div>
    </div>
  );
}

export function Customizer() {
  const isMobile = useIsMobile();
  const t = useT();

  if (isMobile) {
    return (
      <section id="customizer" className="relative">
        <div className="h-[56vh] w-full bg-gradient-to-b from-slate-100 to-slate-200">
          <Stage />
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
      <div className="h-[72vh] overflow-hidden rounded-2xl bg-gradient-to-b from-slate-100 to-slate-200">
        <Stage />
      </div>
      <aside className="flex h-[72vh] flex-col overflow-y-auto rounded-2xl border border-slate-200 bg-white p-5">
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
