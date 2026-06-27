import { Suspense } from 'react'
import { useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../store'

function Plane({ url }: { url: string }) {
  const fp = useStore((s) => s.floorplan)
  const texture = useLoader(THREE.TextureLoader, url)

  return (
    <mesh
      rotation={[-Math.PI / 2, 0, (fp.rotationDeg * Math.PI) / 180]}
      position={[fp.x, 0.012, fp.z]}
    >
      <planeGeometry args={[fp.width, fp.depth]} />
      <meshBasicMaterial
        map={texture}
        transparent
        opacity={fp.opacity}
        depthWrite={false}
        side={THREE.DoubleSide}
        toneMapped={false}
      />
    </mesh>
  )
}

export function Floorplan() {
  const fp = useStore((s) => s.floorplan)
  if (!fp.imageUrl || !fp.visible) return null
  return (
    <Suspense fallback={null}>
      <Plane url={fp.imageUrl} key={fp.imageUrl} />
    </Suspense>
  )
}
