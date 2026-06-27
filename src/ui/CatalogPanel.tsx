import { useRef, useState } from 'react'
import { useStore } from '../store'
import { CATALOG, CATEGORIES } from '../data/catalog'

export function CatalogPanel() {
  const addItem = useStore((s) => s.addItem)
  const addModelItem = useStore((s) => s.addModelItem)
  const [cat, setCat] = useState<string>('Tutti')
  const glbRef = useRef<HTMLInputElement>(null)

  const list = cat === 'Tutti' ? CATALOG : CATALOG.filter((c) => c.category === cat)

  const onGLB = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    if (!f.name.toLowerCase().endsWith('.glb') && !f.name.toLowerCase().endsWith('.gltf')) {
      alert('Carica un file .glb o .gltf')
      return
    }
    addModelItem(URL.createObjectURL(f), f.name.replace(/\.(glb|gltf)$/i, ''))
  }

  return (
    <div className="panel left">
      <div className="panel-head">
        <div>
          <h3>Catalogo arredi</h3>
          <div className="hint">Tocca per aggiungere alla scena</div>
        </div>
      </div>
      <div className="panel-body">
        <div className="cat-tabs">
          {['Tutti', ...CATEGORIES].map((c) => (
            <button key={c} className={'cat-tab' + (cat === c ? ' active' : '')} onClick={() => setCat(c)}>
              {c}
            </button>
          ))}
        </div>
        <div className="cat-grid">
          {list.map((c) => (
            <button key={c.type} className="cat-card" onClick={() => addItem(c.type)} title={`Aggiungi ${c.name}`}>
              <span className="emoji">{c.icon}</span>
              <span className="label">{c.name}</span>
            </button>
          ))}
        </div>

        <div className="section-title" style={{ marginTop: 18 }}>Modelli 3D</div>
        <div className="uploader" onClick={() => glbRef.current?.click()}>
          <div style={{ fontSize: 22, marginBottom: 6 }}>📦</div>
          Importa un modello <b>.glb / .gltf</b>
          <input ref={glbRef} type="file" accept=".glb,.gltf,model/gltf-binary" hidden onChange={(e) => onGLB(e.target.files)} />
        </div>
      </div>
    </div>
  )
}
