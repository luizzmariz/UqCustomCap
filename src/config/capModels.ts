// ---------------------------------------------------------------------------
// Data-driven cap configuration — the single source of truth.
//
// The 3D scene, the color controls and the logo anchor are all generated from
// these objects. To add the client's real cap: drop the `.glb` in
// `public/models/`, set `src` to `${import.meta.env.BASE_URL}models/<file>.glb`
// and update each part's `nodeName` to match the mesh names inside the file.
// No component code needs to change.
// ---------------------------------------------------------------------------

export type Hex = string;

export interface CapPart {
  /** Stable id used as the store key, e.g. 'crown'. */
  id: string;
  /** i18n key for the UI label, e.g. 'part.crown'. */
  labelKey: string;
  /** Mesh name inside the GLB (the client must name meshes accordingly). */
  nodeName: string;
  /** Optional: recolor by material name instead of by mesh. */
  materialName?: string;
  defaultColor: Hex;
  recolorable: boolean;
}

export interface LogoAnchor {
  /** Which part the logo is projected onto (its mesh hosts the decal). */
  targetPart: string;
  /** Decal center in model space. */
  position: [number, number, number];
  /** Decal orientation (Euler radians). */
  rotation: [number, number, number];
  /** Base decal size; the user multiplies this via the size slider. */
  scale: [number, number, number];
}

export interface CapModel {
  id: string;
  name: string;
  /** 'placeholder' for the procedural cap, or a URL to a `.glb`. */
  src: 'placeholder' | string;
  parts: CapPart[];
  logoAnchor: LogoAnchor;
  camera: { position: [number, number, number]; fov: number };
}

export const CAP_MODELS: CapModel[] = [
  {
    id: 'americano',
    name: 'Modelo Americano',
    src: 'placeholder',
    camera: { position: [0, 0.25, 3.4], fov: 40 },
    parts: [
      { id: 'crown', labelKey: 'part.crown', nodeName: 'Crown', defaultColor: '#2563eb', recolorable: true },
      { id: 'brim', labelKey: 'part.brim', nodeName: 'Brim', defaultColor: '#dc2626', recolorable: true },
      { id: 'button', labelKey: 'part.button', nodeName: 'Button', defaultColor: '#2563eb', recolorable: true },
      { id: 'eyelets', labelKey: 'part.eyelets', nodeName: 'Eyelets', defaultColor: '#1e3a8a', recolorable: true },
      { id: 'sweatband', labelKey: 'part.sweatband', nodeName: 'Sweatband', defaultColor: '#f8fafc', recolorable: true },
    ],
    logoAnchor: {
      targetPart: 'crown',
      position: [0, 0.26, 0.9],
      rotation: [0, 0, 0],
      scale: [0.6, 0.6, 0.55],
    },
  },
];
