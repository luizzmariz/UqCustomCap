import { ContactShadows } from '@react-three/drei';

/**
 * Simple three-point-ish lighting plus a fake contact shadow.
 * Intentionally uses no external HDR/Environment so the bundle stays small
 * and everything works offline under the GitHub Pages base path.
 */
export function SceneLighting() {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 8, 5]} intensity={1.15} />
      <directionalLight position={[-5, 3, -4]} intensity={0.35} />
      <ContactShadows position={[0, -0.85, 0]} opacity={0.35} scale={9} blur={2.6} far={3.2} />
    </>
  );
}
