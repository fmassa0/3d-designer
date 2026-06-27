import type { Dimensions, FurnitureType } from '../types'

export interface CatalogEntry {
  type: FurnitureType
  name: string
  icon: string
  category: 'Soggiorno' | 'Camera' | 'Cucina' | 'Decoro'
  dimensions: Dimensions
  color: string
}

export const CATALOG: CatalogEntry[] = [
  { type: 'sofa', name: 'Divano', icon: '🛋️', category: 'Soggiorno', dimensions: { w: 2.1, h: 0.85, d: 0.95 }, color: '#6b7a8f' },
  { type: 'tv', name: 'Mobile TV', icon: '📺', category: 'Soggiorno', dimensions: { w: 1.6, h: 0.5, d: 0.4 }, color: '#2c2f36' },
  { type: 'table', name: 'Tavolo', icon: '🍽️', category: 'Cucina', dimensions: { w: 1.4, h: 0.75, d: 0.85 }, color: '#8d6e63' },
  { type: 'chair', name: 'Sedia', icon: '🪑', category: 'Cucina', dimensions: { w: 0.5, h: 0.9, d: 0.52 }, color: '#a1887f' },
  { type: 'bed', name: 'Letto', icon: '🛏️', category: 'Camera', dimensions: { w: 1.6, h: 0.5, d: 2.0 }, color: '#7e6b5a' },
  { type: 'wardrobe', name: 'Armadio', icon: '🚪', category: 'Camera', dimensions: { w: 1.2, h: 2.0, d: 0.6 }, color: '#b0a08f' },
  { type: 'bookshelf', name: 'Libreria', icon: '📚', category: 'Soggiorno', dimensions: { w: 0.9, h: 1.8, d: 0.32 }, color: '#9e7b53' },
  { type: 'rug', name: 'Tappeto', icon: '🟫', category: 'Decoro', dimensions: { w: 2.2, h: 0.02, d: 1.5 }, color: '#c98a8a' },
  { type: 'lamp', name: 'Lampada', icon: '💡', category: 'Decoro', dimensions: { w: 0.4, h: 1.6, d: 0.4 }, color: '#e8d49a' },
  { type: 'plant', name: 'Pianta', icon: '🪴', category: 'Decoro', dimensions: { w: 0.6, h: 1.25, d: 0.6 }, color: '#4caf50' },
]

export const CATEGORIES = ['Soggiorno', 'Camera', 'Cucina', 'Decoro'] as const
