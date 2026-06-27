// Loads a floor-plan source (PDF or image/photo) into a usable texture URL.
// PDFs are rendered (first page) to a PNG data URL via pdf.js.

export interface LoadedPlan {
  /** data URL or object URL usable as a texture */
  url: string
  /** width / height ratio of the source */
  aspect: number
}

function imageAspect(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(img.naturalWidth / img.naturalHeight || 1)
    img.onerror = () => resolve(1)
    img.src = url
  })
}

let workerReady = false

async function ensureWorker(pdfjs: typeof import('pdfjs-dist')) {
  if (workerReady) return
  try {
    // Vite bundles the worker correctly (right MIME, hashed asset). This avoids
    // GitHub Pages serving raw .mjs with a MIME type the browser rejects.
    const PdfWorker = (await import('pdfjs-dist/build/pdf.worker.min.mjs?worker')).default
    pdfjs.GlobalWorkerOptions.workerPort = new PdfWorker()
  } catch (e) {
    // Fallback: run on the main thread (slower but always works).
    console.warn('[plan] worker non disponibile, uso il thread principale', e)
    pdfjs.GlobalWorkerOptions.workerSrc = ''
  }
  workerReady = true
}

async function pdfToPlan(file: File): Promise<LoadedPlan> {
  const pdfjs = await import('pdfjs-dist')
  await ensureWorker(pdfjs)

  const data = await file.arrayBuffer()
  const pdf = await pdfjs.getDocument({ data }).promise
  const page = await pdf.getPage(1)
  const viewport = page.getViewport({ scale: 2 })

  const canvas = document.createElement('canvas')
  canvas.width = Math.floor(viewport.width)
  canvas.height = Math.floor(viewport.height)
  const ctx = canvas.getContext('2d')
  if (!ctx) throw new Error('Canvas non disponibile')

  // white background so transparent PDFs render readable
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({ canvasContext: ctx, viewport }).promise

  return { url: canvas.toDataURL('image/png'), aspect: canvas.width / canvas.height }
}

export async function fileToPlan(file: File): Promise<LoadedPlan> {
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  if (isPdf) return pdfToPlan(file)

  if (!file.type.startsWith('image/')) {
    throw new Error('Formato non supportato. Usa PDF o immagine.')
  }
  const url = URL.createObjectURL(file)
  const aspect = await imageAspect(url)
  return { url, aspect }
}

/** Given a source aspect ratio, return floor-plan footprint sizing ~8m on the long side. */
export function planSize(aspect: number): { width: number; depth: number } {
  const LONG = 8
  if (aspect >= 1) return { width: LONG, depth: LONG / aspect }
  return { width: LONG * aspect, depth: LONG }
}
