import { useEffect } from 'react'
import { Canvas, useThree } from '@react-three/fiber'
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
  ContactShadows,
  SoftShadows,
} from '@react-three/drei'
import * as THREE from 'three'
import { useStore } from '../store'
import { Room } from './Room'
import { Floorplan } from './Floorplan'
import { Furniture } from './Furniture'
import { Walls } from './Walls'
import { WallBuilder } from './WallBuilder'

type ViewDetail = 'top' | 'reset' | 'front'

function CameraController() {
  const camera = useThree((s) => s.camera)
  const controls = useThree((s) => s.controls) as any

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<ViewDetail>).detail
      const target = new THREE.Vector3(0, 0.6, 0)
      const pos =
        detail === 'top'
          ? new THREE.Vector3(0, 12, 0.001)
          : detail === 'front'
            ? new THREE.Vector3(0, 2.2, 9)
            : new THREE.Vector3(6.5, 5.5, 7)
      camera.position.copy(pos)
      camera.lookAt(target)
      if (controls) {
        controls.target.copy(target)
        controls.update()
      }
    }
    window.addEventListener('studio-view', handler)
    return () => window.removeEventListener('studio-view', handler)
  }, [camera, controls])

  return null
}

export function Scene() {
  const items = useStore((s) => s.items)
  const editorMode = useStore((s) => s.editorMode)

  return (
    <div className="canvas-wrap">
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [6.5, 5.5, 7], fov: 45, near: 0.1, far: 100 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.05
        }}
      >
        <color attach="background" args={['#0e1118']} />
        <fog attach="fog" args={['#0e1118', 22, 45]} />

        <SoftShadows size={28} samples={12} focus={0.6} />

        <hemisphereLight args={['#ffffff', '#3a3f4b', 0.55]} />
        <ambientLight intensity={0.35} />
        <directionalLight
          position={[8, 12, 6]}
          intensity={2.1}
          castShadow
          shadow-mapSize={[2048, 2048]}
          shadow-bias={-0.0002}
        >
          <orthographicCamera attach="shadow-camera" args={[-12, 12, 12, -12, 0.1, 40]} />
        </directionalLight>
        <directionalLight position={[-6, 5, -4]} intensity={0.4} />

        <Room />
        <Walls />
        <Floorplan />
        <WallBuilder />
        {items.map((it) => (
          <Furniture key={it.id} item={it} />
        ))}

        <ContactShadows position={[0, 0.005, 0]} opacity={0.45} scale={30} blur={2.2} far={8} resolution={1024} color="#000000" />

        <Grid
          position={[0, 0.004, 0]}
          args={[60, 60]}
          cellSize={0.5}
          cellThickness={0.6}
          cellColor="#2a3142"
          sectionSize={2}
          sectionThickness={1}
          sectionColor="#4a5573"
          fadeDistance={34}
          fadeStrength={1.4}
          infiniteGrid
        />

        <OrbitControls
          makeDefault
          minDistance={2}
          maxDistance={28}
          maxPolarAngle={editorMode === 'plan' ? 0.2 : Math.PI / 2.05}
          enableRotate={editorMode === 'design'}
          enableDamping
          dampingFactor={0.08}
        />
        <CameraController />

        <GizmoHelper alignment="bottom-right" margin={[70, 80]}>
          <GizmoViewport axisColors={['#ff6b81', '#36d399', '#5c8bff']} labelColor="#0b0d12" />
        </GizmoHelper>
      </Canvas>
    </div>
  )
}
