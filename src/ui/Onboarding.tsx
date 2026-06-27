import { useState } from 'react'

const KEY = 'studio-onboarded'

export function Onboarding() {
  const [open, setOpen] = useState(() => localStorage.getItem(KEY) !== '1')
  if (!open) return null

  const close = () => {
    localStorage.setItem(KEY, '1')
    setOpen(false)
  }

  return (
    <div className="modal-backdrop" onClick={close}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="hero">
          <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: 1, color: 'var(--accent-2)' }}>
            STUDIO · INTERIOR DESIGN 3D
          </div>
          <h1>Progetta i tuoi spazi in 3D</h1>
          <p className="lede">
            Componi stanze, arreda con un catalogo parametrico, ricalca planimetrie reali e raccogli
            ispirazioni. Tutto direttamente nel browser, premium e responsive.
          </p>
        </div>
        <div className="features">
          <div className="feat">
            <span className="fi">🧱</span>
            <div>
              <b>Arreda in 3D</b>
              <span>Trascina mobili dal catalogo, sposta, ruota e personalizza colori e misure.</span>
            </div>
          </div>
          <div className="feat">
            <span className="fi">📐</span>
            <div>
              <b>Da planimetria a 3D</b>
              <span>Carica la piantina e usala come traccia a terra per ricostruire le stanze.</span>
            </div>
          </div>
          <div className="feat">
            <span className="fi">📌</span>
            <div>
              <b>Mood board</b>
              <span>Raccogli ispirazioni stile Pinterest da foto e link.</span>
            </div>
          </div>
          <div className="feat">
            <span className="fi">📷</span>
            <div>
              <b>Render &amp; export</b>
              <span>Salva il progetto ed esporta uno screenshot del render in un click.</span>
            </div>
          </div>
        </div>
        <div className="foot">
          <div style={{ fontSize: 12, color: 'var(--text-faint)' }}>
            Foto&rarr;3D con AI <span className="badge-soon">presto</span>
          </div>
          <button className="btn primary" onClick={close}>
            Inizia a progettare →
          </button>
        </div>
      </div>
    </div>
  )
}
