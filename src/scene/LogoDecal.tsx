import { useEffect } from 'react';
import * as THREE from 'three';
import { Decal, useTexture } from '@react-three/drei';
import { useCustomizerStore } from '../store/customizerStore';
import type { LogoAnchor } from '../config/capModels';

/**
 * Projects the uploaded logo onto the parent mesh as a decal.
 * Must be rendered as a child of a <mesh> (it uses the parent geometry).
 * Renders nothing until a logo is uploaded.
 */
export function LogoDecal({ anchor }: { anchor: LogoAnchor }) {
  const logo = useCustomizerStore((s) => s.logo);
  if (!logo.url) return null;
  return (
    <DecalInner
      key={logo.url}
      url={logo.url}
      anchor={anchor}
      scale={logo.scale}
      rotation={logo.rotation}
      offset={logo.offset}
    />
  );
}

interface DecalInnerProps {
  url: string;
  anchor: LogoAnchor;
  scale: number;
  rotation: number;
  offset: [number, number];
}

function DecalInner({ url, anchor, scale, rotation, offset }: DecalInnerProps) {
  const texture = useTexture(url);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  const position: [number, number, number] = [
    anchor.position[0] + offset[0],
    anchor.position[1] + offset[1],
    anchor.position[2],
  ];
  const rot: [number, number, number] = [
    anchor.rotation[0],
    anchor.rotation[1],
    anchor.rotation[2] + rotation,
  ];
  const scl: [number, number, number] = [
    anchor.scale[0] * scale,
    anchor.scale[1] * scale,
    anchor.scale[2],
  ];

  return (
    <Decal position={position} rotation={rot} scale={scl}>
      <meshStandardMaterial
        map={texture}
        transparent
        polygonOffset
        polygonOffsetFactor={-10}
        roughness={0.55}
        toneMapped={false}
      />
    </Decal>
  );
}
