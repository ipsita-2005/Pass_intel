/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        mono: ['"JetBrains Mono"', 'monospace'],
        display: ['"Orbitron"', 'sans-serif'],
        body: ['"Sora"', 'sans-serif'],
      },
      colors: {
        void: '#050810',
        panel: '#0c1120',
        border: '#1a2540',
        accent: '#00f5d4',
        warn: '#f5a623',
        danger: '#ff3b5c',
        safe: '#00c896',
        muted: '#4a5980',
      },
      animation: {
        'scan': 'scan 3s linear infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
        'slide-up': 'slideUp 0.4s ease-out',
        'bar-fill': 'barFill 0.8s ease-out forwards',
      },
      keyframes: {
        scan: { '0%': { top: '0%' }, '100%': { top: '100%' } },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 8px #00f5d440' },
          '50%': { boxShadow: '0 0 24px #00f5d4a0' },
        },
        slideUp: { from: { opacity: 0, transform: 'translateY(16px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        barFill: { from: { width: '0%' }, to: { width: 'var(--target-width)' } },
      },
    },
  },
  plugins: [],
}
