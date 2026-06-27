import * as THREE from 'three'
import { useStore } from '../store'

const WALL_T = 0.1

export function Room() {
  const room = useStore((s) => s.room)
  const select = useStore((s) => s.select)
  const { width: w, depth: d, height: h, wallColor, floorColor } = room

  return (
    <group onPointerMissed={() => select(null)}>
      {/* Floor */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, 0, 0]}
        receiveShadow
        onClick={(e) => {
          e.stopPropagation()
          select(null)
        }}
      >
        <planeGeometry args={[w, d]} />
        <meshStandardMaterial color={floorColor} roughness={0.85} metalness={0.02} side={THREE.DoubleSide} />
      </mesh>

      {/* Back wall (-z) */}
      <mesh position={[0, h / 2, -d / 2]} receiveShadow castShadow>
        <boxGeometry args={[w + WALL_T, h, WALL_T]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Left wall (-x) */}
      <mesh position={[-w / 2, h / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[WALL_T, h, d]} />
        <meshStandardMaterial color={wallColor} roughness={0.95} />
      </mesh>

      {/* Baseboards for a finished look */}
      <mesh position={[0, 0.05, -d / 2 + WALL_T / 2 + 0.005]}>
        <boxGeometry args={[w, 0.1, 0.02]} />
        <meshStandardMaterial color="#f6f4ef" roughness={0.6} />
      </mesh>
      <mesh position={[-w / 2 + WALL_T / 2 + 0.005, 0.05, 0]}>
        <boxGeometry args={[0.02, 0.1, d]} />
        <meshStandardMaterial color="#f6f4ef" roughness={0.6} />
      </mesh>
    </group>
  )
}
