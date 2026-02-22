import { Outlet, NavLink } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="min-h-screen grid-bg flex flex-col">
      {/* NAV */}
      <header className="border-b border-border/60 backdrop-blur-sm sticky top-0 z-50"
        style={{ background: 'rgba(5,8,16,0.92)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded" style={{
              background: 'linear-gradient(135deg, #00f5d4, #0057ff)',
              boxShadow: '0 0 16px rgba(0,245,212,0.4)',
            }} />
            <span className="font-display font-bold text-lg tracking-widest text-white">
              PASS<span style={{ color: 'var(--accent)' }}>INTEL</span>
            </span>
          </div>

          <nav className="flex gap-1">
            {[
              { to: '/', label: 'Analyze' },
              { to: '/history', label: 'History' },
            ].map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `px-4 py-2 rounded text-sm font-mono tracking-wider transition-all ${
                    isActive
                      ? 'text-accent bg-accent/10 border border-accent/30'
                      : 'text-muted hover:text-white hover:bg-white/5'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      {/* MAIN */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/40 py-6 text-center">
        <p className="font-mono text-xs text-muted">
          PassIntel • AI-Powered Password Intelligence • Zero passwords stored in plaintext
        </p>
      </footer>
    </div>
  )
}
