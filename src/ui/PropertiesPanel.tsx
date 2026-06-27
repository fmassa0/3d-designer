import { useRef } from 'react'
import { useStore } from '../store'
import type { FurnitureItem } from '../types'

const SWATCHES = [
  '#6b7a8f', '#2c2f36', '#8d6e63', '#a1887f', '#7e6b5a',
  '#b0a08f', '#c98a8a', '#4caf50', '#e8d49a', '#d8d3c8',
  '#3f6cc0', '#cf6f9e',
]

function Slider({
  label,
  unit,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string
  unit?: string
  min: number
  max: number
  step: number
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div className="field">
      <label>
        {label}
        <span className="val">
          {value.toFixed(unit === '°' ? 0 : 2)}
          {unit ?? ' m'}
        </span>
      </label>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(parseFloat(e.target.value))} />
    </div>
  )
}

function ItemProps({ item }: { item: FurnitureItem }) {
  const updateItem = useStore((s) => s.updateItem)
  const removeItem = useStore((s) => s.removeItem)
  const duplicateItem = useStore((s) => s.duplicateItem)
  const d = item.dimensions

  return (
    <>
      <div className="selected-tag">
        ✦ {item.name}
      </div>

      <div className="section-title">Dimensioni</div>
      <Slider label="Larghezza" min={0.2} max={4} step={0.05} value={d.w} onChange={(w) => updateItem(item.id, { dimensions: { ...d, w } })} />
      <Slider label="Altezza" min={0.02} max={3} step={0.05} value={d.h} onChange={(h) => updateItem(item.id, { dimensions: { ...d, h } })} />
      <Slider label="Profondità" min={0.2} max={4} step={0.05} value={d.d} onChange={(dd) => updateItem(item.id, { dimensions: { ...d, d: dd } })} />

      <div className="section-title">Rotazione</div>
      <Slider
        label="Orientamento"
        unit="°"
        min={0}
        max={360}
        step={1}
        value={(((item.rotationY * 180) / Math.PI) % 360 + 360) % 360}
        onChange={(deg) => updateItem(item.id, { rotationY: (deg * Math.PI) / 180 })}
      />

      <div className="section-title">Colore</div>
      <div className="swatches">
        {SWATCHES.map((c) => (
          <button
            key={c}
            className={'swatch' + (item.color.toLowerCase() === c ? ' active' : '')}
            style={{ background: c }}
            onClick={() => updateItem(item.id, { color: c })}
          />
        ))}
        <input type="color" value={item.color} onChange={(e) => updateItem(item.id, { color: e.target.value })} />
      </div>

      <div className="row" style={{ marginTop: 18 }}>
        <button className="btn ghost" onClick={() => duplicateItem(item.id)}>
          <span className="ico">⧉</span> Duplica
        </button>
        <button className="btn ghost danger" onClick={() => removeItem(item.id)}>
          <span className="ico">🗑</span> Elimina
        </button>
      </div>
    </>
  )
}

function RoomProps() {
  const room = useStore((s) => s.room)
  const updateRoom = useStore((s) => s.updateRoom)
  const fp = useStore((s) => s.floorplan)
  const setFloorplan = useStore((s) => s.setFloorplan)
  const clearFloorplan = useStore((s) => s.clearFloorplan)
  const fileRef = useRef<HTMLInputElement>(null)

  const onFile = (files: FileList | null) => {
    const f = files?.[0]
    if (!f || !f.type.startsWith('image/')) return
    setFloorplan({ imageUrl: URL.createObjectURL(f), visible: true })
  }

  return (
    <>
      <div className="section-title">Stanza</div>
      <Slider label="Larghezza" min={2} max={14} step={0.1} value={room.width} onChange={(width) => updateRoom({ width })} />
      <Slider label="Profondità" min={2} max={14} step={0.1} value={room.depth} onChange={(depth) => updateRoom({ depth })} />
      <Slider label="Altezza soffitto" min={2.2} max={4} step={0.05} value={room.height} onChange={(height) => updateRoom({ height })} />

      <div className="field">
        <label>Pavimento &amp; pareti</label>
        <div className="row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={room.floorColor} onChange={(e) => updateRoom({ floorColor: e.target.value })} />
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Pavimento</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input type="color" value={room.wallColor} onChange={(e) => updateRoom({ wallColor: e.target.value })} />
            <span style={{ fontSize: 12, color: 'var(--text-dim)' }}>Pareti</span>
          </div>
        </div>
      </div>

      <div className="section-title">Planimetria</div>
      {!fp.imageUrl ? (
        <div className="uploader" onClick={() => fileRef.current?.click()}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>📐</div>
          Carica una <b>planimetria</b> da ricalcare a terra
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={(e) => onFile(e.target.files)} />
        </div>
      ) : (
        <>
          <Slider label="Larghezza piano" min={1} max={20} step={0.1} value={fp.width} onChange={(width) => setFloorplan({ width })} />
          <Slider label="Profondità piano" min={1} max={20} step={0.1} value={fp.depth} onChange={(depth) => setFloorplan({ depth })} />
          <Slider label="Opacità" unit="" min={0.05} max={1} step={0.05} value={fp.opacity} onChange={(opacity) => setFloorplan({ opacity })} />
          <Slider label="Rotazione" unit="°" min={0} max={360} step={1} value={fp.rotationDeg} onChange={(rotationDeg) => setFloorplan({ rotationDeg })} />
          <Slider label="Posizione X" min={-8} max={8} step={0.1} value={fp.x} onChange={(x) => setFloorplan({ x })} />
          <Slider label="Posizione Z" min={-8} max={8} step={0.1} value={fp.z} onChange={(z) => setFloorplan({ z })} />
          <div className="row" style={{ marginTop: 6 }}>
            <button className="btn ghost" onClick={() => setFloorplan({ visible: !fp.visible })}>
              {fp.visible ? '👁 Nascondi' : '👁 Mostra'}
            </button>
            <button className="btn ghost danger" onClick={clearFloorplan}>
              🗑 Rimuovi
            </button>
          </div>
        </>
      )}
    </>
  )
}

export function PropertiesPanel() {
  const selectedId = useStore((s) => s.selectedId)
  const item = useStore((s) => s.items.find((it) => it.id === s.selectedId) || null)

  return (
    <div className="panel right">
      <div className="panel-head">
        <div>
          <h3>{selectedId && item ? 'Proprietà' : 'Progetto'}</h3>
          <div className="hint">{selectedId && item ? 'Modifica elemento' : 'Stanza e planimetria'}</div>
        </div>
      </div>
      <div className="panel-body">{item ? <ItemProps item={item} /> : <RoomProps />}</div>
    </div>
  )
}
