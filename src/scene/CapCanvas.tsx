import { Suspense, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { Bounds, Html, OrbitControls, useProgress } from '@react-three/drei';
import { useActiveModel, useCustomizerStore } from '../store/customizerStore';
import { useIsMobile } from '../hooks/useIsMobile';
import { useT } from '../i18n';
import { CapModel } from './CapModel';
import { SceneLighting } from './SceneLighting';

function Loader() {
  const { progress } = useProgress();
  const t = useT();
  return (
    <Html center>
      <div className="whitespace-nowrap rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-slate-600">
        {t('canvas.loading')} {Math.round(progress)}%
      </div>
    </Html>
  );
}

/** Renders a frame whenever the customization state changes (demand loop). */
function InvalidateBridge() {
  const invalidate = useThree((s) => s.invalidate);
  const version = useCustomizerStore((s) => s.renderVersion);
  useEffect(() => {
    invalidate();
  }, [version, invalidate]);
  return null;
}

export function CapCanvas() {
  const model = useActiveModel();
  const isMobile = useIsMobile();

  return (
    <Canvas
      frameloop="demand"
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{
        antialias: !isMobile,
        powerPreference: 'high-performance',
        preserveDrawingBuffer: true, // enables "download image" in a later phase
      }}
      camera={{ position: model.camera.position, fov: model.camera.fov }}
    >
      <color attach="background" args={['#eef2f7']} />
      <SceneLighting />
      <Suspense fallback={<Loader />}>
        <Bounds fit clip observe margin={1.15}>
          <CapModel model={model} />
        </Bounds>
      </Suspense>
      <OrbitControls
        makeDefault
        enablePan={false}
        enableDamping
        minDistance={1.8}
        maxDistance={6}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 1.9}
      />
      <InvalidateBridge />
    </Canvas>
  );
}
