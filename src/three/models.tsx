import { RoundedBox } from '@react-three/drei'
import * as THREE from 'three'
import type { Dimensions, FurnitureType } from '../types'

const LEG = '#3a2e26'

function shade(hex: string, t: number) {
  const c = new THREE.Color(hex)
  if (t < 0) c.lerp(new THREE.Color('#000000'), -t)
  else c.lerp(new THREE.Color('#ffffff'), t)
  return '#' + c.getHexString()
}

interface PartProps {
  args: [number, number, number]
  position: [number, number, number]
  color: string
  radius?: number
  rough?: number
}

function Part({ args, position, color, radius = 0.025, rough = 0.75 }: PartProps) {
  const minDim = Math.min(args[0], args[1], args[2])
  const r = Math.max(0.004, Math.min(radius, minDim / 2 - 0.004))
  return (
    <RoundedBox args={args} radius={r} smoothness={3} position={position} castShadow receiveShadow>
      <meshStandardMaterial color={color} roughness={rough} metalness={0.04} />
    </RoundedBox>
  )
}

function Cyl({
  rt,
  rb,
  h,
  position,
  color,
  rough = 0.6,
}: {
  rt: number
  rb: number
  h: number
  position: [number, number, number]
  color: string
  rough?: number
}) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <cylinderGeometry args={[rt, rb, h, 28]} />
      <meshStandardMaterial color={color} roughness={rough} metalness={0.05} />
    </mesh>
  )
}

function Sofa({ w, h, d, color }: Dimensions & { color: string }) {
  const legY = 0.07
  const baseH = h * 0.4
  const armW = w * 0.12
  return (
    <group>
      {[
        [-w / 2 + 0.09, -d / 2 + 0.09],
        [w / 2 - 0.09, -d / 2 + 0.09],
        [-w / 2 + 0.09, d / 2 - 0.09],
        [w / 2 - 0.09, d / 2 - 0.09],
      ].map(([x, z], i) => (
        <Part key={i} args={[0.07, legY, 0.07]} position={[x, legY / 2, z]} color={LEG} />
      ))}
      <Part args={[w, baseH, d]} position={[0, legY + baseH / 2, 0]} color={color} />
      <Part args={[w, h * 0.6, d * 0.2]} position={[0, legY + baseH + h * 0.25, -d / 2 + d * 0.1]} color={color} />
      <Part args={[armW, h * 0.55, d]} position={[-w / 2 + armW / 2, legY + baseH / 2 + h * 0.07, 0]} color={color} />
      <Part args={[armW, h * 0.55, d]} position={[w / 2 - armW / 2, legY + baseH / 2 + h * 0.07, 0]} color={color} />
      {[-1, 1].map((s) => (
        <Part
          key={s}
          args={[w * 0.42, h * 0.16, d * 0.8]}
          position={[s * w * 0.23, legY + baseH + h * 0.06, d * 0.04]}
          color={shade(color, 0.12)}
          radius={0.06}
        />
      ))}
    </group>
  )
}

function Bed({ w, h, d, color }: Dimensions & { color: string }) {
  const legY = 0.1
  const frameH = h * 0.32
  const mattY = legY + frameH
  return (
    <group>
      {[
        [-w / 2 + 0.08, -d / 2 + 0.08],
        [w / 2 - 0.08, -d / 2 + 0.08],
        [-w / 2 + 0.08, d / 2 - 0.08],
        [w / 2 - 0.08, d / 2 - 0.08],
      ].map(([x, z], i) => (
        <Part key={i} args={[0.08, legY, 0.08]} position={[x, legY / 2, z]} color={LEG} />
      ))}
      <Part args={[w, frameH, d]} position={[0, legY + frameH / 2, 0]} color={color} />
      <Part args={[w, h * 0.95, 0.1]} position={[0, legY + h * 0.45, -d / 2 + 0.05]} color={color} />
      <Part args={[w * 0.94, h * 0.34, d * 0.96]} position={[0, mattY + h * 0.17, 0]} color="#f3f1ea" radius={0.05} />
      <Part args={[w * 0.9, h * 0.1, d * 0.42]} position={[0, mattY + h * 0.36, d * 0.18]} color={shade(color, 0.2)} radius={0.04} />
      {[-1, 1].map((s) => (
        <Part
          key={s}
          args={[w * 0.4, h * 0.13, d * 0.13]}
          position={[s * w * 0.23, mattY + h * 0.38, -d / 2 + d * 0.16]}
          color="#ffffff"
          radius={0.05}
        />
      ))}
    </group>
  )
}

function Chair({ w, h, d, color }: Dimensions & { color: string }) {
  const seatY = h * 0.5
  return (
    <group>
      {[
        [-w / 2 + 0.05, -d / 2 + 0.05],
        [w / 2 - 0.05, -d / 2 + 0.05],
        [-w / 2 + 0.05, d / 2 - 0.05],
        [w / 2 - 0.05, d / 2 - 0.05],
      ].map(([x, z], i) => (
        <Part key={i} args={[0.05, seatY, 0.05]} position={[x, seatY / 2, z]} color={shade(color, -0.2)} radius={0.015} />
      ))}
      <Part args={[w, h * 0.08, d]} position={[0, seatY, 0]} color={color} />
      <Part args={[w, h * 0.45, 0.06]} position={[0, seatY + h * 0.24, -d / 2 + 0.03]} color={color} />
    </group>
  )
}

function Table({ w, h, d, color }: Dimensions & { color: string }) {
  const topH = 0.06
  const legH = h - topH
  return (
    <group>
      {[
        [-w / 2 + 0.08, -d / 2 + 0.08],
        [w / 2 - 0.08, -d / 2 + 0.08],
        [-w / 2 + 0.08, d / 2 - 0.08],
        [w / 2 - 0.08, d / 2 - 0.08],
      ].map(([x, z], i) => (
        <Part key={i} args={[0.07, legH, 0.07]} position={[x, legH / 2, z]} color={shade(color, -0.25)} radius={0.015} />
      ))}
      <Part args={[w, topH, d]} position={[0, h - topH / 2, 0]} color={color} radius={0.02} />
    </group>
  )
}

function Wardrobe({ w, h, d, color }: Dimensions & { color: string }) {
  return (
    <group>
      <Part args={[w, h, d]} position={[0, h / 2, 0]} color={color} radius={0.03} />
      {[-1, 1].map((s) => (
        <Part
          key={s}
          args={[w / 2 - 0.05, h - 0.1, 0.03]}
          position={[s * (w / 4 - 0.005), h / 2, d / 2 + 0.01]}
          color={shade(color, -0.08)}
          radius={0.01}
        />
      ))}
      {[-1, 1].map((s) => (
        <Part key={'h' + s} args={[0.025, 0.18, 0.04]} position={[s * 0.04, h / 2, d / 2 + 0.04]} color={LEG} radius={0.01} />
      ))}
    </group>
  )
}

function Bookshelf({ w, h, d, color }: Dimensions & { color: string }) {
  const shelves = 4
  const books = ['#c0563f', '#3f6cc0', '#3fae8c', '#d6a93f', '#9c5cc0', '#cf6f9e']
  return (
    <group>
      <Part args={[w, h, d]} position={[0, h / 2, 0]} color={color} radius={0.02} />
      {Array.from({ length: shelves }).map((_, i) => {
        const y = ((i + 1) / (shelves + 1)) * h
        return (
          <group key={i}>
            <Part args={[w * 0.94, 0.03, d * 0.9]} position={[0, y, 0]} color={shade(color, 0.12)} radius={0.005} />
            {Array.from({ length: 4 }).map((__, j) => (
              <Part
                key={j}
                args={[w * 0.12, h * 0.11, d * 0.6]}
                position={[(-w * 0.34) + j * (w * 0.22), y + h * 0.06, 0]}
                color={books[(i * 4 + j) % books.length]}
                radius={0.004}
              />
            ))}
          </group>
        )
      })}
    </group>
  )
}

function Rug({ w, h, d, color }: Dimensions & { color: string }) {
  return (
    <group>
      <Part args={[w, h, d]} position={[0, h / 2, 0]} color={color} radius={0.01} rough={0.95} />
      <Part args={[w * 0.82, h + 0.004, d * 0.82]} position={[0, h / 2 + 0.003, 0]} color={shade(color, 0.16)} radius={0.01} rough={0.95} />
    </group>
  )
}

function Lamp({ w, h, color }: Dimensions & { color: string }) {
  return (
    <group>
      <Cyl rt={w * 0.28} rb={w * 0.3} h={0.05} position={[0, 0.025, 0]} color={LEG} />
      <Cyl rt={0.022} rb={0.022} h={h * 0.82} position={[0, h * 0.45, 0]} color="#8a8f99" />
      <mesh position={[0, h * 0.9, 0]} castShadow>
        <cylinderGeometry args={[w * 0.2, w * 0.34, h * 0.2, 28, 1, true]} />
        <meshStandardMaterial color={color} roughness={0.6} side={THREE.DoubleSide} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <pointLight position={[0, h * 0.85, 0]} intensity={6} distance={4} color="#ffe7b0" />
    </group>
  )
}

function Plant({ w, h, color }: Dimensions & { color: string }) {
  const potH = h * 0.32
  return (
    <group>
      <Cyl rt={w * 0.3} rb={w * 0.22} h={potH} position={[0, potH / 2, 0]} color="#b06a4a" rough={0.85} />
      {[
        [0, h * 0.55, 0, w * 0.34],
        [w * 0.16, h * 0.72, w * 0.05, w * 0.27],
        [-w * 0.15, h * 0.7, -w * 0.06, w * 0.25],
        [w * 0.02, h * 0.86, -w * 0.02, w * 0.2],
      ].map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 18, 16]} />
          <meshStandardMaterial color={shade(color, i % 2 ? -0.1 : 0.08)} roughness={0.85} />
        </mesh>
      ))}
    </group>
  )
}

function Tv({ w, h, d, color }: Dimensions & { color: string }) {
  const screenH = w * 0.52
  const screenY = h + screenH / 2 + 0.08
  return (
    <group>
      <Part args={[w, h, d]} position={[0, h / 2, 0]} color={color} radius={0.02} />
      <Part args={[w * 0.5, 0.02, d * 0.7]} position={[0, h * 0.55, 0]} color={shade(color, 0.1)} radius={0.004} />
      <Part args={[w * 0.92, screenH, 0.05]} position={[0, screenY, -d / 2 + 0.04]} color="#15171c" radius={0.01} />
      <mesh position={[0, screenY, -d / 2 + 0.07]}>
        <planeGeometry args={[w * 0.86, screenH * 0.86]} />
        <meshStandardMaterial color="#0c1422" emissive="#1e4f7a" emissiveIntensity={0.5} roughness={0.3} />
      </mesh>
    </group>
  )
}

export function FurnitureModel({
  type,
  dim,
  color,
}: {
  type: FurnitureType
  dim: Dimensions
  color: string
}) {
  const p = { ...dim, color }
  switch (type) {
    case 'sofa':
      return <Sofa {...p} />
    case 'bed':
      return <Bed {...p} />
    case 'chair':
      return <Chair {...p} />
    case 'table':
      return <Table {...p} />
    case 'wardrobe':
      return <Wardrobe {...p} />
    case 'bookshelf':
      return <Bookshelf {...p} />
    case 'rug':
      return <Rug {...p} />
    case 'lamp':
      return <Lamp {...p} />
    case 'plant':
      return <Plant {...p} />
    case 'tv':
      return <Tv {...p} />
    default:
      return null
  }
}
