// Raw tagged SVG strings, keyed by `${modelId}-${viewId}`.
import americanoFrente from './AmericanoFrente.svg?raw';
import americanoLado from './AmericanoLado.svg?raw';
import americanoTras from './AmericanoTras.svg?raw';
import baseballFrente from './BaseballFrente.svg?raw';
import baseballLado from './BaseballLado.svg?raw';
import baseballTras from './BaseballTras.svg?raw';
import truckerFrente from './TruckerFrente.svg?raw';
import truckerLado from './TruckerLado.svg?raw';
import truckerTras from './TruckerTras.svg?raw';

export const CAP_SVG: Record<string, string> = {
  'americano-frente': americanoFrente,
  'americano-lado': americanoLado,
  'americano-tras': americanoTras,
  'baseball-frente': baseballFrente,
  'baseball-lado': baseballLado,
  'baseball-tras': baseballTras,
  'trucker-frente': truckerFrente,
  'trucker-lado': truckerLado,
  'trucker-tras': truckerTras,
};

export function capSvg(modelId: string, viewId: string): string {
  return CAP_SVG[`${modelId}-${viewId}`] ?? '';
}
