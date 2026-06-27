export type FurnitureType =
  | 'sofa'
  | 'bed'
  | 'chair'
  | 'table'
  | 'wardrobe'
  | 'bookshelf'
  | 'rug'
  | 'lamp'
  | 'plant'
  | 'tv'
  | 'model'

export type MaterialPreset = 'tinta' | 'parquet' | 'marmo' | 'piastrelle' | 'cemento' | 'moquette'

export type EditorMode = 'design' | 'plan'

export interface WallSegment {
  id: string
  ax: number
  az: number
  bx: number
  bz: number
}

export interface Dimensions {
  w: number
  h: number
  d: number
}

export interface Vec3 {
  x: number
  y: number
  z: number
}

export interface FurnitureItem {
  id: string
  type: FurnitureType
  name: string
  position: Vec3
  rotationY: number
  dimensions: Dimensions
  color: string
  /** for type === 'model': object URL of an imported .glb */
  modelUrl?: string
}

export interface Room {
  width: number
  depth: number
  height: number
  wallColor: string
  floorColor: string
  floorMaterial: MaterialPreset
  /** show the default parametric room (floor + 2 walls). Off = blank slate. */
  shell: boolean
}

export interface FloorPlan {
  imageUrl: string | null
  /** real-world size of the plan footprint in meters */
  width: number
  depth: number
  opacity: number
  /** offset on the floor plane (meters) */
  x: number
  z: number
  rotationDeg: number
  visible: boolean
}

export interface MoodImage {
  id: string
  url: string
  note: string
}

export type TransformMode = 'translate' | 'rotate'
