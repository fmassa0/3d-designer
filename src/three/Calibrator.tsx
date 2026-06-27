import { useState } from 'react'
import { Line } from '@react-three/drei'
import type { ThreeEvent } from '@react-three/fiber'
import { useStore } from '../store'

const Y = 0.05

export function Calibrator() {
  const calibrating = useStore((s) => s.calibrating)
  const calibPoints = useStore((s) => s.calibPoints)
  const addCalibPoint = useStore((s) => s.addCalibPoint)
  const [hover, setHover] = useState<{ x: number; z: number } | null>(null)

  if (!calibrating) return null

  const onMove = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation()
    setHover({ x: e.point.x, z: e.point.z })
  }
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    if (e.button !== 0) return
    e.stopPropagation()
    addCalibPoint({ x: e.point.x, z: e.point.z })
  }

  const pts: [number, number, number][] = [
    ...calibPoints.map((p) => [p.x, Y, p.z] as [number, number, number]),
    ...(hover && calibPoints.length === 1 ? [[hover.x, Y, hover.z] as [number, number, number]] : []),
  ]

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]} onPointerMove={onMove} onPointerDown={onDown}>
        <planeGeometry args={[200, 200]} />
        <meshBasicMaterial transparent opacity={0} depthWrite={false} />
      </mesh>

      {pts.length >= 2 && <Line points={pts} color="#22d3ee" lineWidth={5} dashed dashSize={0.2} gapSize={0.1} />}

      {calibPoints.map((p, i) => (
        <mesh key={i} position={[p.x, Y, p.z]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      ))}

      {hover && (
        <mesh position={[hover.x, Y, hover.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.12, 0.2, 24]} />
          <meshBasicMaterial color="#22d3ee" transparent opacity={0.8} />
        </mesh>
      )}
    </group>
  )
}
