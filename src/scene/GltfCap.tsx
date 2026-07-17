import { useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useGLTF } from '@react-three/drei';
import { useCustomizerStore } from '../store/customizerStore';
import type { CapModel, CapPart, LogoAnchor } from '../config/capModels';
import { LogoDecal } from './LogoDecal';

/**
 * Loads a real cap `.glb` and applies per-part colors + the logo decal.
 *
 * This is the drop-in path for the client's models. When the first real model
 * arrives it will be validated end-to-end; if the GLB uses a nested hierarchy,
 * switch to a gltfjsx-generated component so node transforms are preserved.
 */
export function GltfCap({ model }: { model: CapModel }) {
  const gltf = useGLTF(model.src, true) as unknown as { nodes: Record<string, THREE.Object3D> };

  return (
    <group>
      {model.parts.map((part) => (
        <GltfPart
          key={part.id}
          part={part}
          node={gltf.nodes[part.nodeName] as THREE.Mesh | undefined}
          isLogoTarget={part.id === model.logoAnchor.targetPart}
          anchor={model.logoAnchor}
        />
      ))}
    </group>
  );
}

interface GltfPartProps {
  part: CapPart;
  node: THREE.Mesh | undefined;
  isLogoTarget: boolean;
  anchor: LogoAnchor;
}

function GltfPart({ part, node, isLogoTarget, anchor }: GltfPartProps) {
  const colorHex = useCustomizerStore((s) => s.partColors[part.id]);

  // Clone the material once so recoloring one instance never mutates the
  // shared, cached GLTF material.
  const material = useMemo(() => {
    const base = node?.material as THREE.Material | THREE.Material[] | undefined;
    if (Array.isArray(base)) return base[0]?.clone() ?? new THREE.MeshStandardMaterial();
    return base?.clone() ?? new THREE.MeshStandardMaterial();
  }, [node]);

  useEffect(() => {
    const std = material as THREE.MeshStandardMaterial;
    if (part.recolorable && colorHex && std.color) std.color.set(colorHex);
    material.needsUpdate = true;
  }, [material, colorHex, part.recolorable]);

  if (!node) return null;

  return (
    <mesh
      geometry={node.geometry}
      material={material}
      position={node.position}
      rotation={node.rotation}
      scale={node.scale}
    >
      {isLogoTarget && <LogoDecal anchor={anchor} />}
    </mesh>
  );
}
