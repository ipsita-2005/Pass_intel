import { useState } from 'react'
import { AnalysisResult } from '../services/api'
import StrengthMeter from './StrengthMeter'

interface Props {
  result: AnalysisResult
}

const BADGE_CLASS = {
  Weak: 'badge badge-weak',
  Medium: 'badge badge-medium',
  Strong: 'badge badge-strong',
}

export default function ResultCard({ result }: Props) {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(result.suggested_password)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="animate-slide-up space-y-5">
      {/* Header row */}
      <div className="flex flex-wrap items-center gap-3">
        <span className={BADGE_CLASS[result.strength]}>
          ● {result.strength}
        </span>
        {result.breached && (
          <span className="badge" style={{
            background: 'rgba(255,59,92,0.2)',
            color: 'var(--danger)',
            border: '1px solid rgba(255,59,92,0.4)',
            animation: 'pulseGlow 1.5s ease-in-out infinite',
          }}>
            🚨 BREACHED
          </span>
        )}
      </div>

      {/* Strength meter */}
      <StrengthMeter score={result.score} strength={result.strength} />

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Entropy', value: `${result.entropy.toFixed(1)} bits` },
          { label: 'Breach Status', value: result.breached ? '⚠ Found' : '✓ Clear' },
        ].map(({ label, value }) => (
          <div key={label} className="glow-border rounded-lg p-4 text-center"
            style={{ background: 'var(--panel)' }}>
            <div className="font-mono text-xs text-muted uppercase tracking-widest mb-1">{label}</div>
            <div className="font-mono text-sm font-semibold"
              style={{ color: label === 'Breach Status' && result.breached ? 'var(--danger)' : 'var(--accent)' }}>
              {value}
            </div>
          </div>
        ))}
      </div>

      {/* Reasons */}
      <div className="glow-border rounded-lg p-4 space-y-2" style={{ background: 'var(--panel)' }}>
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Analysis</div>
        {result.reasons.map((r, i) => (
          <div key={i} className="font-mono text-sm leading-relaxed"
            style={{
              color: r.startsWith('✓') ? 'var(--safe)' : r.startsWith('✗') ? 'var(--danger)' : 'var(--warn)'
            }}>
            {r}
          </div>
        ))}
      </div>

      {/* Suggested password */}
      <div className="glow-border rounded-lg p-4" style={{ background: 'var(--panel)' }}>
        <div className="font-mono text-xs text-muted uppercase tracking-widest mb-3">Suggested Strong Password</div>
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <code className="font-mono text-sm break-all" style={{ color: 'var(--accent)' }}>
            {result.suggested_password}
          </code>
          <button
            onClick={handleCopy}
            className="shrink-0 px-4 py-2 rounded text-xs font-mono font-semibold uppercase tracking-wider transition-all"
            style={{
              background: copied ? 'rgba(0,200,150,0.2)' : 'rgba(0,245,212,0.1)',
              color: copied ? 'var(--safe)' : 'var(--accent)',
              border: `1px solid ${copied ? 'rgba(0,200,150,0.4)' : 'rgba(0,245,212,0.3)'}`,
            }}
          >
            {copied ? '✓ Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  )
}
