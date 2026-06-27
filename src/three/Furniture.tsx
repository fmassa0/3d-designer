import { Suspense, useRef } from 'react'
import * as THREE from 'three'
import { TransformControls } from '@react-three/drei'
import { useStore } from '../store'
import type { FurnitureItem } from '../types'
import { FurnitureModel } from './models'
import { GLBModel } from './GLBModel'
import { ErrorBoundary } from '../ui/ErrorBoundary'

function Placeholder({ size }: { size: number }) {
  return (
    <mesh position={[0, size / 2, 0]} castShadow>
      <boxGeometry args={[size, size, size]} />
      <meshStandardMaterial color="#7c5cff" roughness={0.6} wireframe />
    </mesh>
  )
}

export function Furniture({ item }: { item: FurnitureItem }) {
  const ref = useRef<THREE.Group>(null)
  const selectedId = useStore((s) => s.selectedId)
  const select = useStore((s) => s.select)
  const mode = useStore((s) => s.transformMode)
  const snap = useStore((s) => s.snap)
  const editorMode = useStore((s) => s.editorMode)
  const updateItem = useStore((s) => s.updateItem)

  const selected = selectedId === item.id

  const content =
    item.type === 'model' && item.modelUrl ? (
      <ErrorBoundary fallback={<Placeholder size={item.dimensions.w} />}>
        <Suspense fallback={<Placeholder size={item.dimensions.w} />}>
          <GLBModel url={item.modelUrl} size={item.dimensions.w} />
        </Suspense>
      </ErrorBoundary>
    ) : (
      <FurnitureModel type={item.type} dim={item.dimensions} color={item.color} />
    )

  const body = (
    <group
      ref={ref}
      position={[item.position.x, item.position.y, item.position.z]}
      rotation={[0, item.rotationY, 0]}
      onClick={(e) => {
        e.stopPropagation()
        select(item.id)
      }}
      onPointerOver={(e) => {
        e.stopPropagation()
        document.body.style.cursor = 'pointer'
      }}
      onPointerOut={() => {
        document.body.style.cursor = 'auto'
      }}
    >
      {content}
    </group>
  )

  // No transform gizmo while drawing walls in plan mode
  if (!selected || editorMode === 'plan') return body

  const sync = () => {
    const g = ref.current
    if (!g) return
    updateItem(item.id, {
      position: { x: g.position.x, y: Math.max(0, g.position.y), z: g.position.z },
      rotationY: g.rotation.y,
    })
  }

  return (
    <TransformControls
      mode={mode}
      showX={mode === 'translate'}
      showY={mode === 'rotate'}
      showZ={mode === 'translate'}
      translationSnap={snap ? 0.1 : null}
      rotationSnap={snap ? Math.PI / 12 : null}
      onObjectChange={sync}
    >
      {body}
    </TransformControls>
  )
}
