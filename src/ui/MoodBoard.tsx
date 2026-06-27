import { useRef, useState } from 'react'
import { useStore } from '../store'

export function MoodBoard() {
  const moodboard = useStore((s) => s.moodboard)
  const addMoodImage = useStore((s) => s.addMoodImage)
  const removeMoodImage = useStore((s) => s.removeMoodImage)
  const fileRef = useRef<HTMLInputElement>(null)
  const [url, setUrl] = useState('')

  const onFiles = (files: FileList | null) => {
    if (!files) return
    Array.from(files).forEach((f) => {
      if (!f.type.startsWith('image/')) return
      addMoodImage(URL.createObjectURL(f))
    })
  }

  const addUrl = () => {
    const u = url.trim()
    if (!u) return
    addMoodImage(u)
    setUrl('')
  }

  return (
    <div className="panel right">
      <div className="panel-head">
        <div>
          <h3>Mood board</h3>
          <div className="hint">Ispirazioni stile Pinterest</div>
        </div>
      </div>
      <div className="panel-body">
        <div
          className="uploader"
          onClick={() => fileRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault()
            onFiles(e.dataTransfer.files)
          }}
        >
          <div style={{ fontSize: 22, marginBottom: 6 }}>🖼️</div>
          Trascina foto qui o <b>sfoglia</b>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            multiple
            hidden
            onChange={(e) => onFiles(e.target.files)}
          />
        </div>

        <div className="field" style={{ marginTop: 14 }}>
          <label>Incolla URL immagine (Pinterest, web…)</label>
          <div className="row">
            <input
              className="text-input"
              placeholder="https://…/foto.jpg"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addUrl()}
            />
            <button className="btn primary" style={{ flex: '0 0 auto' }} onClick={addUrl}>
              Aggiungi
            </button>
          </div>
        </div>

        {moodboard.length === 0 ? (
          <div className="empty">
            <span className="big">📌</span>
            Raccogli le tue ispirazioni.
            <br />
            Foto di stanze, palette, materiali…
          </div>
        ) : (
          <div className="mood-grid">
            {moodboard.map((m) => (
              <div className="mood-item" key={m.id}>
                <img src={m.url} alt="ispirazione" loading="lazy" />
                <button className="del" onClick={() => removeMoodImage(m.id)} title="Rimuovi">
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
