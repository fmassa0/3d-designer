import { useMemo } from 'react'
import { useGLTF } from '@react-three/drei'
import * as THREE from 'three'

export function GLBModel({ url, size }: { url: string; size: number }) {
  const { scene } = useGLTF(url)

  const object = useMemo(() => {
    const clone = scene.clone(true)
    clone.traverse((o) => {
      const mesh = o as THREE.Mesh
      if (mesh.isMesh) {
        mesh.castShadow = true
        mesh.receiveShadow = true
      }
    })
    const box = new THREE.Box3().setFromObject(clone)
    const dims = new THREE.Vector3()
    const center = new THREE.Vector3()
    box.getSize(dims)
    box.getCenter(center)
    const maxDim = Math.max(dims.x, dims.y, dims.z) || 1
    const scale = size / maxDim
    clone.scale.setScalar(scale)
    // center on X/Z, sit on the floor (Y)
    clone.position.set(-center.x * scale, -box.min.y * scale, -center.z * scale)
    return clone
  }, [scene, size])

  return <primitive object={object} />
}
