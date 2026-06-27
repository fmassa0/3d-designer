import { useEffect, useState } from 'react'
import { Line } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../store'
import type { WallSegment } from '../types'

const GRID = 0.25
const Y = 0.04

type P = { x: number; z: number }

const uid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : Math.random().toString(36).slice(2)

export function WallBuilder() {
  const editorMode = useStore((s) => s.editorMode)
  const calibrating = useStore((s) => s.calibrating)
  const snap = useStore((s) => s.snap)
  const addWalls = useStore((s) => s.addWalls)
  const [draft, setDraft] = useState<P[]>([])
  const [hover, setHover] = useState<P | null>(null)

  const snapP = (x: number, z: number): P =>
    snap ? { x: Math.round(x / GRID) * GRID, z: Math.round(z / GRID) * GRID } : { x: Math.round(x * 100) / 100, z: Math.round(z * 100) / 100 }

  const commit = (close: boolean) => {
    setDraft((d) => {
      if (d.length >= 2) {
        const segs: WallSegment[] = []
        for (let i = 0; i < d.length - 1; i++) {
          segs.push({ id: uid(), ax: d[i].x, az: d[i].z, bx: d[i + 1].x, bz: d[i + 1].z })
        }
        if (close && d.length >= 3) {
          segs.push({ id: uid(), ax: d[d.length - 1].x, az: d[d.length - 1].z, bx: d[0].x, bz: d[0].z })
        }
        addWalls(segs)
      }
      return []
    })
    setHover(null)
  }

  // keyboard: Enter = finish, Esc = cancel current chain
  useEffect(() => {
    if (editorMode !== 'plan') return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Enter') commit(false)
      else if (e.key === 'Escape') {
        setDraft([])
        setHover(null)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editorMode])

  if (editorMode !== 'plan' || calibrating) return null

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHover(snapP(e.point.x, e.point.z))
  }

  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    const p = snapP(e.point.x, e.point.z)
    setDraft((d) => {
      if (d.length >= 3) {
        const first = d[0]
        if (Math.hypot(p.x - first.x, p.z - first.z) < 0.3) {
          // close loop
          const segs: WallSegment[] = []
          for (let i = 0; i < d.length - 1; i++) segs.push({ id: uid(), ax: d[i].x, az: d[i].z, bx: d[i + 1].x, bz: d[i + 1].z })
          segs.push({ id: uid(), ax: d[d.length - 1].x, az: d[d.length - 1].z, bx: first.x, bz: first.z })
          addWalls(segs)
          return []
        }
      }
      return [...d, p]
    })
  }

  const linePts: [number, number, number][] = [
    ...draft.map((p) => [p.x, Y, p.z] as [number, number, number]),
    ...(hover && draft.length > 0 ? [[hover.x, Y, hover.z] as [number, number, number]] : []),
  ]

  return (
    <group>
      {/* invisible interaction ground */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0.005, 0]}
        onPointerMove={onMove}
        onPointerDown={onDown}
        onContextMenu={(e) => {
          e.stopPropagation()
          e.nativeEvent.preventDefault()
          commit(false)
        }}
      >
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {linePts.length >= 2 && <Line points={linePts} color="#7c5cff" lineWidth={4} />}

      {draft.map((p, i) => (
        <mesh key={i} position={[p.x, Y, p.z]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshBasicMaterial color={i === 0 ? '#22d3ee' : '#7c5cff'} />
        </mesh>
      ))}

      {hover && (
        <mesh position={[hover.x, Y, hover.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.1, 0.16, 24]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  )
}
