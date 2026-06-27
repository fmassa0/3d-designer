import { useMemo } from 'react'
import * as THREE from 'three'
import { useStore } from '../store'
import { getFloorTexture, MATERIAL_SCALE } from './materials'

const WALL_T = 0.1

export function Room() {
  const room = useStore((s) => s.room)
  const walls = useStore((s) => s.walls)
  const select = useStore((s) => s.select)
  const { height: h, wallColor, floorColor, floorMaterial, shell } = room

  const hasCustom = walls.length > 0
  // Show a floor when: there's a custom layout, OR the default shell is on.
  const showFloor = hasCustom || shell
  // Show the default parametric walls only when shell is on and no custom walls.
  const showParametric = shell && !hasCustom

  // Floor footprint: bounding box of custom walls, else the parametric room.
  const { fw, fd, cx, cz } = useMemo(() => {
    if (!hasCustom) return { fw: room.width, fd: room.depth, cx: 0, cz: 0 }
    let minX = Infinity, maxX = -Infinity, minZ = Infinity, maxZ = -Infinity
    for (const w of walls) {
      minX = Math.min(minX, w.ax, w.bx)
      maxX = Math.max(maxX, w.ax, w.bx)
      minZ = Math.min(minZ, w.az, w.bz)
      maxZ = Math.max(maxZ, w.az, w.bz)
    }
    const pad = 0.3
    return {
      fw: Math.max(1, maxX - minX) + pad,
      fd: Math.max(1, maxZ - minZ) + pad,
      cx: (minX + maxX) / 2,
      cz: (minZ + maxZ) / 2,
    }
  }, [hasCustom, walls, room.width, room.depth])

  const texture = useMemo(() => getFloorTexture(floorMaterial, floorColor), [floorMaterial, floorColor])

  const floorMat = useMemo(() => {
    if (texture) {
      texture.repeat.set(fw / MATERIAL_SCALE[floorMaterial], fd / MATERIAL_SCALE[floorMaterial])
      return new THREE.MeshStandardMaterial({ map: texture, roughness: 0.82, metalness: 0.02 })
    }
    return new THREE.MeshStandardMaterial({ color: floorColor, roughness: 0.85, metalness: 0.02 })
  }, [texture, floorMaterial, floorColor, fw, fd])

  return (
    <group onPointerMissed={() => select(null)}>
      {/* Floor */}
      {showFloor && (
        <mesh
          rotation={[-Math.PI / 2, 0, 0]}
          position={[cx, 0, cz]}
          receiveShadow
          material={floorMat}
          onClick={(e) => {
            e.stopPropagation()
            select(null)
          }}
        >
          <planeGeometry args={[fw, fd]} />
        </mesh>
      )}

      {/* Parametric walls only when shell is on and no custom walls were drawn */}
      {showParametric && (
        <>
          <mesh position={[0, h / 2, -room.depth / 2]} receiveShadow castShadow>
            <boxGeometry args={[room.width + WALL_T, h, WALL_T]} />
            <meshStandardMaterial color={wallColor} roughness={0.95} />
          </mesh>
          <mesh position={[-room.width / 2, h / 2, 0]} receiveShadow castShadow>
            <boxGeometry args={[WALL_T, h, room.depth]} />
            <meshStandardMaterial color={wallColor} roughness={0.95} />
          </mesh>
          <mesh position={[0, 0.05, -room.depth / 2 + WALL_T / 2 + 0.005]}>
            <boxGeometry args={[room.width, 0.1, 0.02]} />
            <meshStandardMaterial color="#f6f4ef" roughness={0.6} />
          </mesh>
          <mesh position={[-room.width / 2 + WALL_T / 2 + 0.005, 0.05, 0]}>
            <boxGeometry args={[0.02, 0.1, room.depth]} />
            <meshStandardMaterial color="#f6f4ef" roughness={0.6} />
          </mesh>
        </>
      )}
    </group>
  )
}
