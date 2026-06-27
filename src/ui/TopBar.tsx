import { useRef } from 'react'
import { useStore } from '../store'

function emitView(detail: 'top' | 'reset' | 'front') {
  window.dispatchEvent(new CustomEvent('studio-view', { detail }))
}

export function TopBar() {
  const transformMode = useStore((s) => s.transformMode)
  const setTransformMode = useStore((s) => s.setTransformMode)
  const snap = useStore((s) => s.snap)
  const toggleSnap = useStore((s) => s.toggleSnap)
  const activePanel = useStore((s) => s.activePanel)
  const setPanel = useStore((s) => s.setPanel)
  const clearAll = useStore((s) => s.clearAll)
  const importRef = useRef<HTMLInputElement>(null)

  const exportJSON = () => {
    const { room, items } = useStore.getState()
    const blob = new Blob([JSON.stringify({ room, items, version: 1 }, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'progetto-studio.json'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const importJSON = (files: FileList | null) => {
    const f = files?.[0]
    if (!f) return
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const data = JSON.parse(String(reader.result))
        if (data.room && Array.isArray(data.items)) {
          useStore.getState().loadProject({ room: data.room, items: data.items })
        }
      } catch {
        alert('File non valido')
      }
    }
    reader.readAsText(f)
  }

  const exportPNG = () => {
    const canvas = document.querySelector('canvas')
    if (!canvas) return
    const a = document.createElement('a')
    a.href = canvas.toDataURL('image/png')
    a.download = 'render-studio.png'
    a.click()
  }

  return (
    <header className="topbar">
      <div className="brand">
        <div className="logo">◆</div>
        <div>
          <div className="name">Studio</div>
          <div className="sub">Interior Design 3D</div>
        </div>
      </div>

      <div className="toolgroup desktop-only">
        <button
          className={'btn icon' + (transformMode === 'translate' ? ' active' : '')}
          onClick={() => setTransformMode('translate')}
          title="Sposta (G)"
        >
          <span className="ico">✥</span> Sposta
        </button>
        <button
          className={'btn icon' + (transformMode === 'rotate' ? ' active' : '')}
          onClick={() => setTransformMode('rotate')}
          title="Ruota (R)"
        >
          <span className="ico">⟳</span> Ruota
        </button>
        <button className={'btn icon' + (snap ? ' active' : '')} onClick={toggleSnap} title="Aggancio alla griglia">
          <span className="ico">⌗</span> Snap
        </button>
      </div>

      <div className="toolgroup desktop-only">
        <button className="btn icon" onClick={() => emitView('reset')} title="Vista 3/4">3D</button>
        <button className="btn icon" onClick={() => emitView('top')} title="Vista dall'alto">Alto</button>
        <button className="btn icon" onClick={() => emitView('front')} title="Vista frontale">Fronte</button>
      </div>

      <div className="spacer" />

      <div className="save-pill desktop-only">
        <span className="dot" /> Salvato in locale
      </div>

      <div className="toolgroup">
        <button
          className={'btn icon' + (activePanel === 'catalog' ? ' active' : '')}
          onClick={() => setPanel('catalog')}
          title="Catalogo"
        >
          <span className="ico">🧱</span> <span className="desktop-only">Catalogo</span>
        </button>
        <button
          className={'btn icon' + (activePanel === 'moodboard' ? ' active' : '')}
          onClick={() => setPanel('moodboard')}
          title="Mood board"
        >
          <span className="ico">📌</span> <span className="desktop-only">Mood</span>
        </button>
      </div>

      <div className="toolgroup desktop-only">
        <button className="btn icon" onClick={() => importRef.current?.click()} title="Importa progetto">⤓ Importa</button>
        <button className="btn icon" onClick={exportJSON} title="Esporta progetto">⤴ Esporta</button>
        <button className="btn primary" onClick={exportPNG} title="Esporta render PNG">
          <span className="ico">📷</span> Render
        </button>
      </div>

      <button className="btn icon danger desktop-only" onClick={() => confirm('Svuotare la scena?') && clearAll()} title="Svuota scena">
        🗑
      </button>

      <input ref={importRef} type="file" accept="application/json" hidden onChange={(e) => importJSON(e.target.files)} />
    </header>
  )
}
