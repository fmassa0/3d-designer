import * as THREE from 'three'
import type { MaterialPreset } from '../types'

export const MATERIALS: { key: MaterialPreset; label: string; icon: string }[] = [
  { key: 'parquet', label: 'Parquet', icon: '🪵' },
  { key: 'marmo', label: 'Marmo', icon: '🏛️' },
  { key: 'piastrelle', label: 'Piastrelle', icon: '🔲' },
  { key: 'cemento', label: 'Cemento', icon: '⬜' },
  { key: 'moquette', label: 'Moquette', icon: '🟫' },
  { key: 'tinta', label: 'Tinta', icon: '🎨' },
]

// Real-world size (meters) covered by one texture tile, used to set repeat.
export const MATERIAL_SCALE: Record<MaterialPreset, number> = {
  tinta: 1,
  parquet: 1.6,
  marmo: 3,
  piastrelle: 1.2,
  cemento: 3,
  moquette: 1.5,
}

const cache = new Map<string, THREE.Texture>()

function canvas(size = 512) {
  const c = document.createElement('canvas')
  c.width = c.height = size
  return c
}

function shade(hex: string, t: number) {
  const c = new THREE.Color(hex)
  if (t < 0) c.lerp(new THREE.Color('#000'), -t)
  else c.lerp(new THREE.Color('#fff'), t)
  return '#' + c.getHexString()
}

function drawParquet(ctx: CanvasRenderingContext2D, S: number) {
  const woods = ['#b5793f', '#a86a35', '#c0894f', '#9c6230', '#b07a46']
  ctx.fillStyle = '#8a5a2b'
  ctx.fillRect(0, 0, S, S)
  const rows = 5
  const plankH = S / rows
  const plankW = S / 2.2
  for (let r = 0; r < rows; r++) {
    const y = r * plankH
    const off = (r % 2) * (plankW / 2)
    for (let x = -plankW; x < S + plankW; x += plankW) {
      const px = x + off
      ctx.fillStyle = woods[Math.floor(Math.random() * woods.length)]
      ctx.fillRect(px + 1, y + 1, plankW - 2, plankH - 2)
      // subtle grain
      ctx.strokeStyle = 'rgba(0,0,0,0.06)'
      ctx.lineWidth = 1
      for (let g = 0; g < 4; g++) {
        const gy = y + 4 + Math.random() * (plankH - 8)
        ctx.beginPath()
        ctx.moveTo(px + 2, gy)
        ctx.lineTo(px + plankW - 2, gy + (Math.random() - 0.5) * 3)
        ctx.stroke()
      }
      ctx.strokeStyle = 'rgba(0,0,0,0.28)'
      ctx.strokeRect(px + 1, y + 1, plankW - 2, plankH - 2)
    }
  }
}

function drawMarmo(ctx: CanvasRenderingContext2D, S: number) {
  ctx.fillStyle = '#efece6'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 22; i++) {
    ctx.strokeStyle = `rgba(120,120,130,${0.05 + Math.random() * 0.16})`
    ctx.lineWidth = 0.5 + Math.random() * 2.5
    ctx.beginPath()
    let x = Math.random() * S
    let y = Math.random() * S
    ctx.moveTo(x, y)
    for (let s = 0; s < 6; s++) {
      x += (Math.random() - 0.5) * S * 0.4
      y += (Math.random() - 0.5) * S * 0.4
      ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

function drawPiastrelle(ctx: CanvasRenderingContext2D, S: number) {
  const n = 4
  const tile = S / n
  ctx.fillStyle = '#c7c1b4' // grout
  ctx.fillRect(0, 0, S, S)
  const gap = Math.max(2, tile * 0.04)
  const base = ['#e9e5dd', '#e3ded4', '#eeeae2']
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      ctx.fillStyle = base[(i + j) % base.length]
      ctx.fillRect(i * tile + gap, j * tile + gap, tile - gap * 2, tile - gap * 2)
    }
  }
}

function drawCemento(ctx: CanvasRenderingContext2D, S: number) {
  ctx.fillStyle = '#9a9b98'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 6000; i++) {
    const v = Math.random()
    ctx.fillStyle = `rgba(${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${v > 0.5 ? 255 : 0},${Math.random() * 0.05})`
    ctx.fillRect(Math.random() * S, Math.random() * S, 2, 2)
  }
}

function drawMoquette(ctx: CanvasRenderingContext2D, S: number) {
  ctx.fillStyle = '#b29a78'
  ctx.fillRect(0, 0, S, S)
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = `rgba(0,0,0,${Math.random() * 0.07})`
    ctx.fillRect(Math.random() * S, Math.random() * S, 1.5, 1.5)
    ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.05})`
    ctx.fillRect(Math.random() * S, Math.random() * S, 1.5, 1.5)
  }
}

/** Returns a tiling texture for the given preset, or null for solid color. */
export function getFloorTexture(preset: MaterialPreset, color: string): THREE.Texture | null {
  if (preset === 'tinta') return null
  const key = preset + '|' + color
  const hit = cache.get(key)
  if (hit) return hit
  try {
    const c = canvas(512)
    const ctx = c.getContext('2d')
    if (!ctx) return null
    switch (preset) {
      case 'parquet':
        drawParquet(ctx, 512)
        break
      case 'marmo':
        drawMarmo(ctx, 512)
        break
      case 'piastrelle':
        drawPiastrelle(ctx, 512)
        break
      case 'cemento':
        drawCemento(ctx, 512)
        break
      case 'moquette':
        drawMoquette(ctx, 512)
        break
    }
    const tex = new THREE.CanvasTexture(c)
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping
    tex.anisotropy = 8
    tex.colorSpace = THREE.SRGBColorSpace
    cache.set(key, tex)
    return tex
  } catch {
    return null
  }
}

// keep `shade` referenced for potential tinting use
void shade
