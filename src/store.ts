import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type {
  EditorMode,
  FloorPlan,
  FurnitureItem,
  FurnitureType,
  MaterialPreset,
  MoodImage,
  Room,
  TransformMode,
  Vec3,
  WallSegment,
} from './types'
import { CATALOG } from './data/catalog'

type Panel = 'catalog' | 'properties' | 'moodboard' | null

interface DesignState {
  room: Room
  items: FurnitureItem[]
  walls: WallSegment[]
  floorplan: FloorPlan
  moodboard: MoodImage[]

  selectedId: string | null
  transformMode: TransformMode
  snap: boolean
  activePanel: Panel
  editorMode: EditorMode

  // room
  updateRoom: (patch: Partial<Room>) => void
  setFloorMaterial: (m: MaterialPreset) => void

  // items
  addItem: (type: FurnitureType) => void
  addModelItem: (url: string, name: string) => void
  updateItem: (id: string, patch: Partial<FurnitureItem>) => void
  removeItem: (id: string) => void
  duplicateItem: (id: string) => void
  select: (id: string | null) => void

  // walls
  addWalls: (segments: WallSegment[]) => void
  removeWall: (id: string) => void
  clearWalls: () => void

  // tools
  setTransformMode: (m: TransformMode) => void
  toggleSnap: () => void
  setPanel: (p: Panel) => void
  setEditorMode: (m: EditorMode) => void

  // floor plan
  setFloorplan: (patch: Partial<FloorPlan>) => void
  clearFloorplan: () => void

  // mood board
  addMoodImage: (url: string) => void
  updateMoodImage: (id: string, patch: Partial<MoodImage>) => void
  removeMoodImage: (id: string) => void

  // project
  clearAll: () => void
  loadProject: (data: { room: Room; items: FurnitureItem[]; walls?: WallSegment[] }) => void
}

const DEFAULT_ROOM: Room = {
  width: 6,
  depth: 5,
  height: 2.7,
  wallColor: '#e9e4db',
  floorColor: '#c9a37a',
  floorMaterial: 'parquet',
  shell: true,
}

const DEFAULT_FLOORPLAN: FloorPlan = {
  imageUrl: null,
  width: 6,
  depth: 5,
  opacity: 0.65,
  x: 0,
  z: 0,
  rotationDeg: 0,
  visible: true,
}

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2)

export const useStore = create<DesignState>()(
  persist(
    (set, get) => ({
      room: DEFAULT_ROOM,
      items: [],
      walls: [],
      floorplan: DEFAULT_FLOORPLAN,
      moodboard: [],

      selectedId: null,
      transformMode: 'translate',
      snap: true,
      activePanel: 'catalog',
      editorMode: 'design',

      updateRoom: (patch) => set((s) => ({ room: { ...s.room, ...patch } })),
      setFloorMaterial: (m) => set((s) => ({ room: { ...s.room, floorMaterial: m } })),

      addItem: (type) => {
        const entry = CATALOG.find((c) => c.type === type)
        if (!entry) return
        const count = get().items.length
        const offset = (count % 4) * 0.4 - 0.6
        const position: Vec3 = { x: offset, y: 0, z: offset * 0.5 }
        const item: FurnitureItem = {
          id: uid(),
          type,
          name: entry.name,
          position,
          rotationY: 0,
          dimensions: { ...entry.dimensions },
          color: entry.color,
        }
        set((s) => ({ items: [...s.items, item], selectedId: item.id }))
      },

      addModelItem: (url, name) => {
        const item: FurnitureItem = {
          id: uid(),
          type: 'model',
          name,
          position: { x: 0, y: 0, z: 0 },
          rotationY: 0,
          dimensions: { w: 1.2, h: 1.2, d: 1.2 },
          color: '#cccccc',
          modelUrl: url,
        }
        set((s) => ({ items: [...s.items, item], selectedId: item.id }))
      },

      updateItem: (id, patch) =>
        set((s) => ({
          items: s.items.map((it) => (it.id === id ? { ...it, ...patch } : it)),
        })),

      removeItem: (id) =>
        set((s) => ({
          items: s.items.filter((it) => it.id !== id),
          selectedId: s.selectedId === id ? null : s.selectedId,
        })),

      duplicateItem: (id) => {
        const src = get().items.find((it) => it.id === id)
        if (!src) return
        const copy: FurnitureItem = {
          ...src,
          id: uid(),
          position: { ...src.position, x: src.position.x + 0.4, z: src.position.z + 0.4 },
          dimensions: { ...src.dimensions },
        }
        set((s) => ({ items: [...s.items, copy], selectedId: copy.id }))
      },

      select: (id) => set({ selectedId: id }),

      addWalls: (segments) => set((s) => ({ walls: [...s.walls, ...segments] })),
      removeWall: (id) => set((s) => ({ walls: s.walls.filter((w) => w.id !== id) })),
      clearWalls: () => set({ walls: [] }),

      setTransformMode: (m) => set({ transformMode: m }),
      toggleSnap: () => set((s) => ({ snap: !s.snap })),
      setPanel: (p) => set((s) => ({ activePanel: s.activePanel === p ? null : p })),
      setEditorMode: (m) => set({ editorMode: m, selectedId: null }),

      setFloorplan: (patch) => set((s) => ({ floorplan: { ...s.floorplan, ...patch } })),
      clearFloorplan: () => set((s) => ({ floorplan: { ...DEFAULT_FLOORPLAN } })),

      addMoodImage: (url) =>
        set((s) => ({ moodboard: [{ id: uid(), url, note: '' }, ...s.moodboard] })),
      updateMoodImage: (id, patch) =>
        set((s) => ({
          moodboard: s.moodboard.map((m) => (m.id === id ? { ...m, ...patch } : m)),
        })),
      removeMoodImage: (id) =>
        set((s) => ({ moodboard: s.moodboard.filter((m) => m.id !== id) })),

      clearAll: () => set({ items: [], walls: [], selectedId: null }),
      loadProject: (data) =>
        set({ room: data.room, items: data.items, walls: data.walls ?? [], selectedId: null }),
    }),
    {
      name: 'studio-3d-designer',
      // Persist only serialisable project data. Blob/object URLs (floor plan,
      // mood board, imported .glb models) are kept in-memory and reset on
      // reload by design — so imported models are excluded from persistence.
      partialize: (s) => ({
        room: s.room,
        items: s.items.filter((it) => it.type !== 'model'),
        walls: s.walls,
      }),
      // Deep-merge so saved projects from older versions still receive any
      // newly added defaults (e.g. floorMaterial, shell) instead of undefined.
      merge: (persisted, current) => {
        const p = (persisted ?? {}) as Partial<DesignState>
        return {
          ...current,
          ...p,
          room: { ...current.room, ...(p.room ?? {}) },
        }
      },
    },
  ),
)
