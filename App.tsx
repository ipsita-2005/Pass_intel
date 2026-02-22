import { useState, useRef } from 'react'
import { analyzePassword, AnalysisResult } from './services/api'
import ResultCard from './components/ResultCard'

export default function App() {
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleAnalyze = async () => {
    if (!password.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzePassword(password)
      setResult(data)
    } catch (e: any) {
      setError(e?.response?.data?.detail || 'Failed to reach the API. Is the backend running?')
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleAnalyze()
  }

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-accent/30"
          style={{ background: 'rgba(0,245,212,0.06)' }}>
          <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: 'var(--accent)' }} />
          <span className="font-mono text-xs text-accent tracking-widest uppercase">AI-Powered Analysis</span>
        </div>
        <h1 className="font-display font-black text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4">
          PASSWORD<br />
          <span style={{ color: 'var(--accent)' }}>INTELLIGENCE</span>
        </h1>
        <p className="text-muted font-body text-sm sm:text-base leading-relaxed max-w-md mx-auto">
          ML-powered strength analysis, breach detection, entropy scoring, and intelligent suggestions.
        </p>
      </div>

      {/* Input card */}
      <div className="glow-border rounded-2xl p-6 sm:p-8 space-y-5 mb-6"
        style={{ background: 'var(--panel)' }}>
        <label className="block font-mono text-xs text-muted uppercase tracking-widest">
          Enter Password
        </label>

        {/* Password field */}
        <div className="relative flex items-center glow-border rounded-lg overflow-hidden"
          style={{ background: 'var(--void)' }}>
          <span className="pl-4 text-muted font-mono text-sm select-none">$</span>
          <input
            ref={inputRef}
            type={showPass ? 'text' : 'password'}
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="enter your password…"
            className="flex-1 bg-transparent px-3 py-4 font-mono text-sm text-white outline-none placeholder:text-muted/40"
            autoComplete="new-password"
          />
          <button
            onClick={() => setShowPass(v => !v)}
            className="px-4 py-2 font-mono text-xs text-muted hover:text-accent transition-colors"
            tabIndex={-1}
          >
            {showPass ? 'HIDE' : 'SHOW'}
          </button>
        </div>

        {/* Char count hint */}
        {password.length > 0 && (
          <div className="flex justify-between font-mono text-xs text-muted">
            <span>{password.length} characters</span>
            <span className={password.length >= 12 ? 'text-safe' : password.length >= 8 ? 'text-warn' : 'text-danger'}>
              {password.length >= 12 ? '✓ Good length' : password.length >= 8 ? '⚠ Minimum length' : '✗ Too short'}
            </span>
          </div>
        )}

        <button
          onClick={handleAnalyze}
          disabled={!password || loading}
          className="btn-primary w-full flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-void/40 border-t-void rounded-full animate-spin" />
              Analyzing…
            </>
          ) : (
            <>
              <span>⚡</span> Run Analysis
            </>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg p-4 mb-6 font-mono text-sm border"
          style={{ background: 'rgba(255,59,92,0.1)', color: 'var(--danger)', borderColor: 'rgba(255,59,92,0.3)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Results */}
      {result && (
        <div className="glow-border rounded-2xl p-6 sm:p-8" style={{ background: 'var(--panel)' }}>
          <ResultCard result={result} />
        </div>
      )}
    </div>
  )
}
