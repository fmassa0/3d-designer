import { useState } from 'react'
import { useStore } from '../store'

export function CalibrationBar() {
  const calibrating = useStore((s) => s.calibrating)
  const calibPoints = useStore((s) => s.calibPoints)
  const resetCalibration = useStore((s) => s.resetCalibration)
  const cancelCalibration = useStore((s) => s.cancelCalibration)
  const applyCalibration = useStore((s) => s.applyCalibration)
  const [real, setReal] = useState('3')

  if (!calibrating) return null

  const ready = calibPoints.length >= 2
  const measured = ready ? Math.hypot(calibPoints[1].x - calibPoints[0].x, calibPoints[1].z - calibPoints[0].z) : 0

  return (
    <div className="calib-bar">
      <span className="calib-title">📏 Calibrazione scala</span>

      {!ready ? (
        <span className="calib-hint">
          Clicca <b>2 punti</b> su una misura nota della planimetria (es. una parete)
          {calibPoints.length === 1 && ' · ora il secondo punto'}
        </span>
      ) : (
        <>
          <span className="calib-meas">misurato: {measured.toFixed(2)} m</span>
          <span className="calib-eq">→ reale</span>
          <input
            className="calib-input"
            type="number"
            min={0.1}
            step={0.1}
            value={real}
            onChange={(e) => setReal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && applyCalibration(parseFloat(real))}
            autoFocus
          />
          <span className="calib-unit">m</span>
          <button className="btn primary" onClick={() => applyCalibration(parseFloat(real))}>
            Applica
          </button>
          <button className="btn ghost" onClick={resetCalibration}>
            Ricomincia
          </button>
        </>
      )}

      <button className="btn ghost" onClick={cancelCalibration} title="Annulla">
        ✕
      </button>
    </div>
  )
}
