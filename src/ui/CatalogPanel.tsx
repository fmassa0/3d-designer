import { useState } from 'react'
import { useStore } from '../store'
import { CATALOG, CATEGORIES } from '../data/catalog'

export function CatalogPanel() {
  const addItem = useStore((s) => s.addItem)
  const [cat, setCat] = useState<string>('Tutti')

  const list = cat === 'Tutti' ? CATALOG : CATALOG.filter((c) => c.category === cat)

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
      </div>
    </div>
  )
}
