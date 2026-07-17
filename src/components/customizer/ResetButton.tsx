import { useCustomizerStore } from '../../store/customizerStore';
import { Button } from '../ui/Button';
import { useT } from '../../i18n';

export function ResetButton() {
  const t = useT();
  const reset = useCustomizerStore((s) => s.reset);
  return (
    <Button variant="outline" className="w-full" onClick={reset}>
      {t('actions.reset')}
    </Button>
  );
}
