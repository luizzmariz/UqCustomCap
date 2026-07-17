import { useMemo } from 'react';
import * as THREE from 'three';
import { useCustomizerStore } from '../store/customizerStore';
import type { CapModel } from '../config/capModels';
import { LogoDecal } from './LogoDecal';

// Baked crown proportions (scale is applied to the geometry, not the mesh,
// so the logo decal on the crown is not distorted).
const CROWN_SCALE_Y = 0.82;
const CROWN_SCALE_Z = 1.02;
const CROWN_SHIFT_Y = -0.02;

/** A point on the crown surface for a given azimuth/polar angle (degrees). */
function onCrown(azDeg: number, polDeg: number): [number, number, number] {
  const az = (azDeg * Math.PI) / 180;
  const pol = (polDeg * Math.PI) / 180;
  return [
    Math.sin(pol) * Math.cos(az),
    Math.cos(pol) * CROWN_SCALE_Y + CROWN_SHIFT_Y,
    Math.sin(pol) * Math.sin(az) * CROWN_SCALE_Z,
  ];
}

/**
 * Deliberately simple, procedurally-built cap used as a temporary stand-in
 * until the real `.glb` models arrive. Each part is a named mesh whose color
 * comes straight from the store, matching the ids in `capModels.ts`.
 */
export function PlaceholderCap({ model }: { model: CapModel }) {
  const partColors = useCustomizerStore((s) => s.partColors);
  const color = (id: string) => partColors[id] ?? '#ffffff';

  const crownGeo = useMemo(() => {
    const g = new THREE.SphereGeometry(1, 48, 32, 0, Math.PI * 2, 0, Math.PI / 2);
    g.scale(1, CROWN_SCALE_Y, CROWN_SCALE_Z);
    g.translate(0, CROWN_SHIFT_Y, 0);
    return g;
  }, []);

  const brimGeo = useMemo(() => {
    // Front visor: a half-ellipse that projects forward, wider than it is deep.
    const shape = new THREE.Shape();
    shape.absellipse(0, 0, 1.0, 0.92, 0, Math.PI, false, 0);
    const g = new THREE.ExtrudeGeometry(shape, { depth: 0.05, bevelEnabled: false });
    g.rotateX(Math.PI / 2); // lay flat, projecting forward (+Z), thickness downward
    // Gently curve the visor tip downward at the sides for a baseball-cap look.
    const pos = g.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getZ(i);
      pos.setY(i, pos.getY(i) - 0.12 * (z / 0.92) - 0.06 * (x / 1.0) ** 2);
    }
    pos.needsUpdate = true;
    g.computeVertexNormals();
    return g;
  }, []);

  const sweatbandGeo = useMemo(() => new THREE.TorusGeometry(0.985, 0.05, 16, 48), []);
  const buttonGeo = useMemo(() => new THREE.SphereGeometry(0.09, 24, 16), []);
  const eyeletGeo = useMemo(() => new THREE.SphereGeometry(0.05, 16, 12), []);

  const eyeletPositions = useMemo<[number, number, number][]>(
    () => [onCrown(40, 62), onCrown(140, 62), onCrown(220, 62), onCrown(320, 62)],
    [],
  );

  return (
    <group name="americano-placeholder">
      {/* Copa — hosts the logo decal on its front */}
      <mesh name="Crown" geometry={crownGeo}>
        <meshStandardMaterial color={color('crown')} roughness={0.72} metalness={0.02} />
        <LogoDecal anchor={model.logoAnchor} />
      </mesh>

      {/* Aba */}
      <group position={[0, -0.08, 0.06]} rotation={[0.16, 0, 0]}>
        <mesh name="Brim" geometry={brimGeo}>
          <meshStandardMaterial
            color={color('brim')}
            roughness={0.6}
            metalness={0.02}
            side={THREE.DoubleSide}
          />
        </mesh>
      </group>

      {/* Botão */}
      <mesh name="Button" geometry={buttonGeo} position={[0, 0.8, 0]}>
        <meshStandardMaterial color={color('button')} roughness={0.6} />
      </mesh>

      {/* Ilhoses */}
      {eyeletPositions.map((p, i) => (
        <mesh name="Eyelets" key={i} geometry={eyeletGeo} position={p}>
          <meshStandardMaterial color={color('eyelets')} roughness={0.5} />
        </mesh>
      ))}

      {/* Faixa interna */}
      <mesh name="Sweatband" geometry={sweatbandGeo} position={[0, -0.05, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color={color('sweatband')} roughness={0.85} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}
