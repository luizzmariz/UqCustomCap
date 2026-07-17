import { useState } from 'react';
import { Tabs } from '../ui/Tabs';
import type { TabItem } from '../ui/Tabs';
import { PartColorList } from './PartColorList';
import { LogoUploader } from './LogoUploader';
import { ModelPicker } from './ModelPicker';
import { ResetButton } from './ResetButton';
import { useT } from '../../i18n';

type TabId = 'color' | 'logo' | 'model';

export function ControlsPanel() {
  const t = useT();
  const [tab, setTab] = useState<TabId>('color');

  const items: TabItem[] = [
    { id: 'color', label: t('tab.color') },
    { id: 'logo', label: t('tab.logo') },
    { id: 'model', label: t('tab.model') },
  ];

  return (
    <div className="flex h-full flex-col">
      <Tabs items={items} active={tab} onChange={(id) => setTab(id as TabId)} />
      <div className="mt-4 flex-1">
        {tab === 'color' && <PartColorList />}
        {tab === 'logo' && <LogoUploader />}
        {tab === 'model' && <ModelPicker />}
      </div>
      <div className="mt-4 border-t border-slate-100 pt-4">
        <ResetButton />
      </div>
    </div>
  );
}
