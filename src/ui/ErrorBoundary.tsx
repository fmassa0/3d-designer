import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}
interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error) {
    // eslint-disable-next-line no-console
    console.error('[Studio] runtime error:', error)
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            padding: 24,
            textAlign: 'center',
            color: '#eef1f7',
            fontFamily: 'Inter, system-ui, sans-serif',
          }}
        >
          <div style={{ maxWidth: 420 }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🛠️</div>
            <h2 style={{ margin: '0 0 8px', fontWeight: 700 }}>Qualcosa è andato storto</h2>
            <p style={{ color: '#9aa3b2', fontSize: 14, lineHeight: 1.6, margin: '0 0 18px' }}>
              {this.state.error.message || 'Errore imprevisto.'}
            </p>
            <button
              onClick={() => {
                this.setState({ error: null })
                location.reload()
              }}
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                border: 'none',
                fontWeight: 700,
                cursor: 'pointer',
                color: '#0b0d12',
                background: 'linear-gradient(135deg, #7c5cff, #22d3ee)',
              }}
            >
              Ricarica l'app
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
