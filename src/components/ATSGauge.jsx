import { useEffect, useState } from 'react'

function getScoreColor(score) {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  if (score >= 40) return '#f97316'
  return '#ef4444'
}

function getScoreLabel(score) {
  if (score >= 80) return { label: 'Excellent', sub: 'Likely to pass ATS filters' }
  if (score >= 65) return { label: 'Good', sub: 'Minor improvements needed' }
  if (score >= 50) return { label: 'Fair', sub: 'Significant gaps to fix' }
  if (score >= 30) return { label: 'Poor', sub: 'Major rework required' }
  return { label: 'Critical', sub: 'Resume needs complete overhaul' }
}

export default function ATSGauge({ score = 0, size = 220, animate = true, gaugeId = 'main' }) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score)
  const color = getScoreColor(score)
  const { label, sub } = getScoreLabel(score)

  const cx = size / 2
  const cy = size / 2
  const r = (size / 2) - 18
  const circumference = 2 * Math.PI * r
  const dashOffset = circumference - (displayScore / 100) * circumference

  useEffect(() => {
    if (!animate) { setDisplayScore(score); return }
    let start = 0
    const duration = 1400
    const startTime = performance.now()

    function step(now) {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / duration, 1)
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress)
      setDisplayScore(Math.round(eased * score))
      if (progress < 1) requestAnimationFrame(step)
    }

    requestAnimationFrame(step)
  }, [score, animate])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Glow filter */}
          <defs>
            <filter id={`gauge-glow-${gaugeId}`} x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle cx={cx} cy={cy} r={r}
            fill="none"
            stroke="var(--border)"
            strokeWidth={12}
          />

          {/* Score arc */}
          <circle cx={cx} cy={cy} r={r}
            fill="none"
            stroke={color}
            strokeWidth={12}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            style={{ transition: 'stroke 0.5s', filter: `drop-shadow(0 0 8px ${color}60)` }}
          />

          {/* Tick marks */}
          {[0, 25, 50, 75].map(pct => {
            const angle = (pct / 100) * 2 * Math.PI
            const x1 = cx + (r - 18) * Math.cos(angle)
            const y1 = cy + (r - 18) * Math.sin(angle)
            const x2 = cx + (r - 8) * Math.cos(angle)
            const y2 = cy + (r - 8) * Math.sin(angle)
            return <line key={pct} x1={x1} y1={y1} x2={x2} y2={y2} stroke="var(--border-light)" strokeWidth={2} />
          })}
        </svg>

        {/* Center text */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          gap: 2
        }}>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 800,
            fontSize: size * 0.22,
            color,
            lineHeight: 1,
            transition: 'color 0.5s'
          }}>
            {displayScore}
          </span>
          <span style={{
            fontSize: size * 0.07,
            color: 'var(--text-muted)',
            fontFamily: 'var(--font-mono)',
            fontWeight: 500
          }}>/ 100</span>
        </div>
      </div>

      {/* Labels */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-block',
          padding: '4px 14px',
          borderRadius: 999,
          background: `${color}15`,
          border: `1px solid ${color}40`,
          color,
          fontWeight: 700,
          fontSize: 14,
          fontFamily: 'var(--font-display)',
          marginBottom: 6
        }}>
          {label}
        </div>
        <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{sub}</p>
      </div>
    </div>
  )
}
