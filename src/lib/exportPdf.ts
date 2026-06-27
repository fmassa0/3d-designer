import { useStore } from '../store'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('load fail'))
    img.src = url
  })
}

async function imageToJpeg(url: string): Promise<{ data: string; w: number; h: number } | null> {
  try {
    const img = await loadImage(url)
    const c = document.createElement('canvas')
    c.width = img.naturalWidth
    c.height = img.naturalHeight
    const ctx = c.getContext('2d')
    if (!ctx) return null
    ctx.drawImage(img, 0, 0)
    return { data: c.toDataURL('image/jpeg', 0.85), w: c.width, h: c.height }
  } catch {
    return null
  }
}

/** Move the camera to a preset view and grab the WebGL canvas as PNG. */
async function captureViews(canvas: HTMLCanvasElement) {
  const views: { d: 'reset' | 'top' | 'front'; label: string }[] = [
    { d: 'reset', label: 'Vista 3D' },
    { d: 'top', label: 'Pianta' },
    { d: 'front', label: 'Fronte' },
  ]
  const shots: { label: string; data: string; w: number; h: number }[] = []
  for (const v of views) {
    window.dispatchEvent(new CustomEvent('studio-view', { detail: v.d }))
    await delay(450)
    shots.push({ label: v.label, data: canvas.toDataURL('image/png'), w: canvas.width, h: canvas.height })
  }
  window.dispatchEvent(new CustomEvent('studio-view', { detail: 'reset' }))
  return shots
}

export async function exportProjectPdf() {
  const { jsPDF } = await import('jspdf')
  const state = useStore.getState()
  const canvas = document.querySelector('canvas') as HTMLCanvasElement | null
  if (!canvas) throw new Error('Canvas non trovato')

  // Force design mode so 3D angles render correctly during capture.
  const prevMode = state.editorMode
  if (prevMode !== 'design') useStore.setState({ editorMode: 'design' })
  state.select(null)
  await delay(120)

  const renders = await captureViews(canvas)

  // restore previous editor mode
  if (prevMode !== 'design') useStore.setState({ editorMode: prevMode })

  const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const pageW = 210
  const pageH = 297
  const margin = 14
  const contentW = pageW - margin * 2
  let y = margin

  const ensureSpace = (h: number) => {
    if (y + h > pageH - margin) {
      pdf.addPage()
      y = margin
    }
  }

  const addBlock = (title: string, data: string, fmt: 'PNG' | 'JPEG', w: number, h: number) => {
    const dispH = Math.min(contentW * (h / w), pageH - margin * 2 - 10)
    const dispW = dispH * (w / h)
    ensureSpace(8 + dispH)
    pdf.setFont('helvetica', 'bold')
    pdf.setFontSize(12)
    pdf.setTextColor(20)
    pdf.text(title, margin, y + 4)
    y += 7
    const x = margin + (contentW - dispW) / 2
    pdf.addImage(data, fmt, x, y, dispW, dispH, undefined, 'FAST')
    pdf.setDrawColor(210)
    pdf.rect(x, y, dispW, dispH)
    y += dispH + 8
  }

  // Header
  pdf.setFont('helvetica', 'bold')
  pdf.setFontSize(20)
  pdf.setTextColor(20)
  pdf.text('Studio — Report di progetto', margin, y + 4)
  y += 9
  pdf.setFont('helvetica', 'normal')
  pdf.setFontSize(10)
  pdf.setTextColor(120)
  pdf.text(`Generato il ${new Date().toLocaleString('it-IT')}`, margin, y)
  y += 5
  pdf.text(
    `Pareti: ${state.walls.length}  ·  Arredi: ${state.items.length}  ·  Pavimento: ${state.room.floorMaterial}`,
    margin,
    y,
  )
  y += 8
  pdf.setDrawColor(220)
  pdf.line(margin, y, pageW - margin, y)
  y += 8

  // 3D renders
  for (const r of renders) addBlock(r.label, r.data, 'PNG', r.w, r.h)

  // Floor plan
  if (state.floorplan.imageUrl) {
    const fp = await imageToJpeg(state.floorplan.imageUrl)
    if (fp) addBlock('Planimetria', fp.data, 'JPEG', fp.w, fp.h)
  }

  // Mood board
  let i = 1
  for (const m of state.moodboard) {
    const im = await imageToJpeg(m.url)
    if (im) addBlock(`Ispirazione ${i}`, im.data, 'JPEG', im.w, im.h)
    i++
  }

  pdf.save('studio-progetto.pdf')
}
