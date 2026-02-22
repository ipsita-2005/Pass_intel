import { useEffect, useState } from 'react'
import { getHistory, HistoryRecord } from '../services/api'

const BADGE: Record<string, string> = {
  Weak: 'badge badge-weak',
  Medium: 'badge badge-medium',
  Strong: 'badge badge-strong',
}

type SortOption = 'date' | 'strength' | 'score'

export default function HistoryPage() {
  const [records, setRecords] = useState<HistoryRecord[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<SortOption>('date')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const PAGE_SIZE = 10

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const data = await getHistory(page, PAGE_SIZE, sortBy)
        setRecords(data.records)
        setTotal(data.total)
      } catch {
        setError('Could not load history. Is the backend running?')
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [page, sortBy])

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    })

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
      {/* Header */}
      <div className="mb-10">
        <h1 className="font-display font-black text-2xl sm:text-4xl text-white tracking-tight mb-2">
          Analysis <span style={{ color: 'var(--accent)' }}>History</span>
        </h1>
        <p className="text-muted font-mono text-sm">
          {total} records — no plaintext passwords stored
        </p>
      </div>

      {/* Sort controls */}
      <div className="flex flex-wrap gap-2 mb-6">
        {(['date', 'strength', 'score'] as SortOption[]).map(opt => (
          <button
            key={opt}
            onClick={() => { setSortBy(opt); setPage(1) }}
            className="px-4 py-1.5 rounded font-mono text-xs uppercase tracking-wider transition-all"
            style={{
              background: sortBy === opt ? 'rgba(0,245,212,0.15)' : 'var(--panel)',
              color: sortBy === opt ? 'var(--accent)' : 'var(--muted)',
              border: `1px solid ${sortBy === opt ? 'rgba(0,245,212,0.4)' : 'var(--border)'}`,
            }}
          >
            Sort: {opt}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg p-4 mb-6 font-mono text-sm border"
          style={{ background: 'rgba(255,59,92,0.1)', color: 'var(--danger)', borderColor: 'rgba(255,59,92,0.3)' }}>
          ⚠ {error}
        </div>
      )}

      {/* Table */}
      <div className="glow-border rounded-xl overflow-hidden" style={{ background: 'var(--panel)' }}>
        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <div className="w-8 h-8 border-2 rounded-full animate-spin"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--accent)' }} />
          </div>
        ) : records.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full border-2 border-border flex items-center justify-center text-2xl">📭</div>
            <p className="font-mono text-sm text-muted">No analyses yet. Run your first analysis!</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  {['#', 'Strength', 'Score', 'Entropy', 'Breached', 'Date'].map(h => (
                    <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-widest">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {records.map((r, i) => (
                  <tr key={r.id}
                    className="border-b border-border/40 hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {(page - 1) * PAGE_SIZE + i + 1}
                    </td>
                    <td className="px-4 py-3">
                      <span className={BADGE[r.strength] ?? 'badge'}>● {r.strength}</span>
                    </td>
                    <td className="px-4 py-3 font-mono text-sm" style={{
                      color: r.score >= 70 ? 'var(--safe)' : r.score >= 40 ? 'var(--warn)' : 'var(--danger)'
                    }}>
                      {r.score}/100
                    </td>
                    <td className="px-4 py-3 font-mono text-sm text-accent">
                      {r.entropy.toFixed(1)} bits
                    </td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {r.breached
                        ? <span style={{ color: 'var(--danger)' }}>🚨 Yes</span>
                        : <span style={{ color: 'var(--safe)' }}>✓ No</span>}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-muted">
                      {formatDate(r.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <span className="font-mono text-xs text-muted">
            Page {page} of {totalPages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded font-mono text-xs border border-border text-muted hover:text-white hover:border-accent/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 rounded font-mono text-xs border border-border text-muted hover:text-white hover:border-accent/50 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
