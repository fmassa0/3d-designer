import { useStore } from '../store'

const WALL_T = 0.1

export function Walls() {
  const walls = useStore((s) => s.walls)
  const h = useStore((s) => s.room.height)
  const wallColor = useStore((s) => s.room.wallColor)

  return (
    <group>
      {walls.map((w) => {
        const dx = w.bx - w.ax
        const dz = w.bz - w.az
        const len = Math.hypot(dx, dz)
        if (len < 0.01) return null
        const angle = Math.atan2(dz, dx)
        return (
          <mesh
            key={w.id}
            position={[(w.ax + w.bx) / 2, h / 2, (w.az + w.bz) / 2]}
            rotation={[0, -angle, 0]}
            castShadow
            receiveShadow
          >
            <boxGeometry args={[len + WALL_T, h, WALL_T]} />
            <meshStandardMaterial color={wallColor} roughness={0.95} />
          </mesh>
        )
      })}
    </group>
  )
}
