import { useEffect } from 'react'
import { useStore } from './store'
import { Scene } from './three/Scene'
import { TopBar } from './ui/TopBar'
import { CatalogPanel } from './ui/CatalogPanel'
import { PropertiesPanel } from './ui/PropertiesPanel'
import { MoodBoard } from './ui/MoodBoard'
import { Onboarding } from './ui/Onboarding'

export default function App() {
  const activePanel = useStore((s) => s.activePanel)
  const selectedId = useStore((s) => s.selectedId)
  const setPanel = useStore((s) => s.setPanel)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return
      const s = useStore.getState()
      if ((e.key === 'Delete' || e.key === 'Backspace') && s.selectedId) {
        e.preventDefault()
        s.removeItem(s.selectedId)
      } else if (e.key === 'Escape') {
        s.select(null)
      } else if (e.key === 'g' || e.key === 'G') {
        s.setTransformMode('translate')
      } else if (e.key === 'r' || e.key === 'R') {
        s.setTransformMode('rotate')
      } else if ((e.key === 'd' || e.key === 'D') && s.selectedId) {
        s.duplicateItem(s.selectedId)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // When an item is selected, surface the properties panel automatically.
  useEffect(() => {
    if (selectedId && activePanel !== 'properties') {
      useStore.setState({ activePanel: 'properties' })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  return (
    <div className="app">
      <Scene />
      <TopBar />

      {activePanel === 'catalog' && <CatalogPanel />}
      {activePanel === 'moodboard' && <MoodBoard />}
      {(activePanel === 'properties' || selectedId) && activePanel !== 'catalog' && activePanel !== 'moodboard' && (
        <PropertiesPanel />
      )}

      <div className="viewport-hint">
        <span>
          <kbd>Click</kbd> seleziona
        </span>
        <span>
          <kbd>G</kbd> sposta · <kbd>R</kbd> ruota
        </span>
        <span>
          <kbd>D</kbd> duplica · <kbd>Canc</kbd> elimina
        </span>
      </div>

      <nav className="mobile-nav">
        <button className={activePanel === 'catalog' ? 'active' : ''} onClick={() => setPanel('catalog')}>
          <span className="mi">🧱</span> Arredi
        </button>
        <button
          className={activePanel === 'properties' ? 'active' : ''}
          onClick={() => useStore.setState({ activePanel: 'properties' })}
        >
          <span className="mi">⚙️</span> Progetto
        </button>
        <button className={activePanel === 'moodboard' ? 'active' : ''} onClick={() => setPanel('moodboard')}>
          <span className="mi">📌</span> Mood
        </button>
      </nav>

      <Onboarding />
    </div>
  )
}
