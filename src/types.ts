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
}

export interface Room {
  width: number
  depth: number
  height: number
  wallColor: string
  floorColor: string
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
