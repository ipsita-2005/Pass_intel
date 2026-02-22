interface Props {
  score: number
  strength: 'Weak' | 'Medium' | 'Strong'
}

const COLORS = {
  Weak: 'var(--danger)',
  Medium: 'var(--warn)',
  Strong: 'var(--safe)',
}

const SEGMENTS = [
  { label: 'Weak', min: 0, max: 40 },
  { label: 'Medium', min: 40, max: 70 },
  { label: 'Strong', min: 70, max: 100 },
]

export default function StrengthMeter({ score, strength }: Props) {
  const color = COLORS[strength]

  return (
    <div className="space-y-2">
      {/* Score number */}
      <div className="flex items-baseline justify-between">
        <span className="font-mono text-xs text-muted uppercase tracking-widest">Risk Score</span>
        <span className="font-display text-2xl font-bold" style={{ color }}>
          {score}
          <span className="text-sm font-mono text-muted">/100</span>
        </span>
      </div>

      {/* Bar */}
      <div className="strength-bar">
        <div
          className="strength-bar-fill"
          style={{
            width: `${score}%`,
            background: `linear-gradient(90deg, ${color}88, ${color})`,
            boxShadow: `0 0 8px ${color}60`,
          }}
        />
      </div>

      {/* Segment labels */}
      <div className="flex justify-between font-mono text-xs text-muted">
        <span>WEAK</span>
        <span>MEDIUM</span>
        <span>STRONG</span>
      </div>
    </div>
  )
}
