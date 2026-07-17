import type { CapModel as CapModelType } from '../config/capModels';
import { PlaceholderCap } from './PlaceholderCap';
import { GltfCap } from './GltfCap';

/**
 * The swap point between the temporary placeholder cap and a real `.glb`.
 * Set a model's `src` to a `.glb` URL in `capModels.ts` to switch it over.
 */
export function CapModel({ model }: { model: CapModelType }) {
  if (model.src === 'placeholder') return <PlaceholderCap model={model} />;
  return <GltfCap model={model} />;
}
