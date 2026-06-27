<div align="center">

# ◆ Studio — Interior Design 3D

**App premium di interior design e render 3D, nel browser.**
Progetta stanze, arreda con un catalogo parametrico, ricalca planimetrie reali e raccogli ispirazioni stile Pinterest.

</div>

---

## ✨ Cosa fa oggi

| | Funzione | Descrizione |
|---|---|---|
| 🧱 | **Editor 3D** | Stanza parametrica (dimensioni, pareti, pavimento) con luci, ombre soft e controlli orbitali. |
| 🪑 | **Catalogo arredi** | Mobili parametrici (divano, letto, tavolo, sedie, armadio, libreria, tappeto, lampada, pianta, TV). Aggiungi, sposta, ruota, scala, colora. |
| 📐 | **Da planimetria a 3D** | Carica la piantina dell'appartamento e usala come **traccia a terra** per ricostruire gli ambienti in scala. |
| 📌 | **Mood board** | Raccogli ispirazioni stile **Pinterest** da foto caricate o URL. |
| 💾 | **Progetti** | Salvataggio automatico in locale, import/export `.json`. |
| 📷 | **Render & export** | Esporta uno screenshot del render in PNG con un click. |
| 📱 | **Premium & responsive** | UI in vetro, tema scuro, ottimizzata per desktop e mobile. |

### Scorciatoie
`Click` seleziona · `G` sposta · `R` ruota · `D` duplica · `Canc` elimina · `Esc` deseleziona

---

## 🚀 Avvio

```bash
npm install
npm run dev
```

Apri l'URL mostrato (default `http://localhost:5173`).

**Build di produzione:**
```bash
npm run build
npm run preview
```

---

## 🧰 Stack tecnico

- **React 18** + **TypeScript** + **Vite**
- **three.js** via **@react-three/fiber** + **@react-three/drei**
- **Zustand** per lo stato (con persistenza localStorage)

```
src/
├─ three/         # Scena, stanza, planimetria, arredi, modelli 3D
├─ ui/            # Top bar, pannelli, mood board, onboarding
├─ data/          # Catalogo arredi
├─ store.ts       # Stato globale (Zustand)
└─ types.ts
```

---

## 🗺️ Roadmap

Questa è la **base premium funzionante**. Le funzioni AI richiedono un backend dedicato e arriveranno per fasi:

- [ ] **Tracciamento pareti** sopra la planimetria (disegno freeform di muri e stanze).
- [ ] **Foto → 3D con AI**: ricostruzione automatica della stanza da foto reali (richiede pipeline di computer vision / fotogrammetria lato server).
- [ ] **Riconoscimento planimetrie**: rilevamento automatico di muri, porte e finestre dall'immagine.
- [ ] **Suggerimenti d'arredo AI** a partire dalle mood board.
- [ ] **Libreria modelli GLTF/GLB** reali + import modelli.
- [ ] **Materiali PBR e texture** (parquet, marmo, tessuti).
- [ ] **Export** verso glTF / immagini ad alta risoluzione / walkthrough.
- [ ] **Cloud sync** e collaborazione.

> Nota: planimetria e mood board attualmente vivono in memoria nella sessione (le immagini non vengono salvate in localStorage per non superarne i limiti). La persistenza su IndexedDB/cloud è in roadmap.

---

<div align="center">
<sub>Costruito con ◆ — un cantiere aperto. I contributi e le idee sono benvenuti.</sub>
</div>
