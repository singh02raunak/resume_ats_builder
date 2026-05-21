import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import ATSGauge from '../components/ATSGauge'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { ArrowRight, Lock, TrendingUp, AlertTriangle, AlertCircle, CheckCircle2, Lightbulb, Upload } from 'lucide-react'

const CATEGORY_ICONS = {
  keywords: '🔑',
  formatting: '📐',
  workExperience: '💼',
  education: '🎓',
  skills: '⚡',
  contactInfo: '📇'
}

const CATEGORY_LABELS = {
  keywords: 'Keywords',
  formatting: 'Formatting',
  workExperience: 'Work Experience',
  education: 'Education',
  skills: 'Skills',
  contactInfo: 'Contact Info'
}

function SeverityBadge({ severity }) {
  const map = {
    critical: { bg: 'var(--red-dim)', color: '#f87171', label: 'Critical' },
    high: { bg: '#422006', color: '#fb923c', label: 'High' },
    medium: { bg: '#422006', color: '#fbbf24', label: 'Medium' }
  }
  const s = map[severity] || map.medium
  return (
    <span style={{
      display: 'inline-block', padding: '2px 8px', borderRadius: 999,
      background: s.bg, color: s.color, fontSize: 10,
      fontWeight: 700, fontFamily: 'var(--font-mono)', textTransform: 'uppercase'
    }}>
      {s.label}
    </span>
  )
}

export default function Results() {
  const navigate = useNavigate()
  const { analysis, resumeFile, paymentDone } = useResume()

  useEffect(() => {
    if (!analysis) navigate('/upload', { replace: true })
  }, [analysis])

  if (!analysis) return null

  const { atsScore, scoreBreakdown, topIssues, allSuggestions, missingKeywords, strengths, summary } = analysis

  // Free users see first 3 suggestions
  const freeSuggestions = allSuggestions?.slice(0, 3) || []
  const lockedCount = (allSuggestions?.length || 0) - 3

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 860 }}>

          {/* Score Hero */}
          <div className="card fade-up" style={{
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            textAlign: 'center', marginBottom: 28, padding: '48px 32px',
            position: 'relative', overflow: 'hidden'
          }}>
            {/* bg glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
              width: 400, height: 200,
              background: `radial-gradient(ellipse, ${atsScore >= 80 ? 'rgba(16,185,129,0.12)' : atsScore >= 60 ? 'rgba(245,158,11,0.12)' : 'rgba(239,68,68,0.12)'} 0%, transparent 70%)`,
              pointerEvents: 'none'
            }} />

            <ATSGauge score={atsScore} size={200} animate />

            <h2 style={{ fontSize: 'clamp(1.2rem, 3vw, 1.8rem)', marginTop: 24, marginBottom: 12 }}>
              Your ATS Score
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 500, lineHeight: 1.7 }}>
              {summary}
            </p>

            {!paymentDone && (
              <button
                onClick={() => navigate('/templates')}
                className="btn btn-primary btn-lg"
                style={{ marginTop: 24 }}
              >
                Get Improved Resume <ArrowRight size={18} />
              </button>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>

            {/* Score Breakdown */}
            <div className="card fade-up" style={{ animationDelay: '0.1s', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <TrendingUp size={18} color="var(--emerald)" /> Score Breakdown
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {Object.entries(scoreBreakdown || {}).map(([key, val], idx) => {
                  const pct = Math.round((val.score / val.max) * 100)
                  const color = pct >= 80 ? '#10b981' : pct >= 60 ? '#f59e0b' : '#ef4444'
                  const isLocked = !paymentDone && idx >= 3
                  return (
                    <div key={key} style={{ filter: isLocked ? 'blur(4px)' : 'none', userSelect: isLocked ? 'none' : 'auto', transition: 'filter 0.3s' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                          <span>{CATEGORY_ICONS[key]}</span>
                          {CATEGORY_LABELS[key]}
                        </div>
                        <span style={{ fontFamily: 'var(--font-mono)', fontSize: 12, color, fontWeight: 700 }}>
                          {val.score}/{val.max}
                        </span>
                      </div>
                      <div className="progress-track" style={{ height: 6 }}>
                        <div style={{
                          height: '100%', borderRadius: 999,
                          width: `${pct}%`, background: color,
                          transition: 'width 1.2s cubic-bezier(0.34,1.56,0.64,1)'
                        }} />
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{val.feedback}</p>
                    </div>
                  )
                })}
              </div>

              {/* Lock overlay for score breakdown */}
              {!paymentDone && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '48%',
                  background: 'linear-gradient(180deg, transparent, var(--bg-card) 60%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  padding: '16px', gap: 6
                }}>
                  <Lock size={18} color="var(--text-muted)" />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    3 more categories locked
                  </p>
                  <button onClick={() => navigate('/templates')} className="btn btn-primary" style={{ fontSize: 12, padding: '6px 16px' }}>
                    Unlock Full Report
                  </button>
                </div>
              )}
            </div>

            {/* Right column: strengths + keywords */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {/* Strengths */}
              {strengths?.length > 0 && (
                <div className="card fade-up" style={{ animationDelay: '0.2s' }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <CheckCircle2 size={18} color="var(--emerald)" /> Strengths
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {strengths.map((s, i) => (
                      <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--text-dim)' }}>
                        <span style={{ color: 'var(--emerald)', flexShrink: 0 }}>✓</span> {s}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Missing Keywords */}
              {missingKeywords?.length > 0 && (
                <div className="card fade-up" style={{ animationDelay: '0.25s' }}>
                  <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                    <AlertCircle size={18} color="var(--amber)" /> Missing Keywords
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                    {missingKeywords.map((kw, i) => (
                      <span key={i} style={{
                        padding: '4px 10px', borderRadius: 6,
                        background: 'var(--amber-dim)', border: '1px solid rgba(245,158,11,0.3)',
                        color: '#fbbf24', fontSize: 12, fontFamily: 'var(--font-mono)', fontWeight: 600
                      }}>
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Top Issues */}
          {topIssues?.length > 0 && (
            <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.3s', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
                <AlertTriangle size={18} color="#f97316" /> Critical Issues to Fix
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {topIssues.map((issue, i) => {
                  const isLocked = !paymentDone && i >= 1
                  return (
                    <div key={i} style={{
                      padding: '14px 18px', borderRadius: 10,
                      background: 'var(--bg-muted)', border: '1px solid var(--border)',
                      display: 'flex', flexDirection: 'column', gap: 8,
                      filter: isLocked ? 'blur(4px)' : 'none',
                      userSelect: isLocked ? 'none' : 'auto',
                      transition: 'filter 0.3s'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <SeverityBadge severity={issue.severity} />
                        <span style={{ fontWeight: 600, fontSize: 14 }}>{issue.issue}</span>
                      </div>
                      <p style={{ fontSize: 13, color: 'var(--text-muted)', paddingLeft: 4 }}>
                        <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>Fix: </span>{issue.fix}
                      </p>
                    </div>
                  )
                })}
              </div>

              {/* Lock overlay for issues */}
              {!paymentDone && topIssues.length > 1 && (
                <div style={{
                  position: 'absolute', bottom: 0, left: 0, right: 0, height: '55%',
                  background: 'linear-gradient(180deg, transparent, var(--bg-card) 55%)',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                  padding: '16px', gap: 6
                }}>
                  <Lock size={18} color="var(--text-muted)" />
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
                    {topIssues.length - 1} more issue{topIssues.length - 1 > 1 ? 's' : ''} locked — unlock to see all fixes
                  </p>
                  <button onClick={() => navigate('/templates')} className="btn btn-primary" style={{ fontSize: 12, padding: '6px 16px' }}>
                    Unlock All Issues
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Suggestions — Free preview + Locked */}
          <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.35s' }}>
            <h3 style={{ fontSize: 16, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Lightbulb size={18} color="var(--emerald)" /> Improvement Suggestions
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {freeSuggestions.map((s, i) => (
                <div key={i} style={{
                  padding: '14px 18px', borderRadius: 10,
                  background: 'var(--bg-muted)', border: '1px solid var(--border)',
                  display: 'flex', gap: 12
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: s.impact === 'high' ? 'var(--emerald-dim)' : 'var(--bg-card)',
                    border: `1px solid ${s.impact === 'high' ? 'var(--emerald)' : 'var(--border)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 700, color: s.impact === 'high' ? 'var(--emerald)' : 'var(--text-muted)',
                    fontFamily: 'var(--font-mono)'
                  }}>
                    {i + 1}
                  </div>
                  <div>
                    <span style={{
                      display: 'inline-block', padding: '1px 7px', borderRadius: 999, marginBottom: 4,
                      background: 'var(--border)', fontSize: 10, fontFamily: 'var(--font-mono)',
                      color: 'var(--text-muted)'
                    }}>{s.category}</span>
                    <p style={{ fontSize: 13, color: 'var(--text-dim)' }}>{s.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Locked suggestions teaser */}
            {!paymentDone && lockedCount > 0 && (
              <div style={{
                marginTop: 20, padding: '24px',
                borderRadius: 12, textAlign: 'center',
                background: 'linear-gradient(180deg, transparent, var(--bg-card))',
                border: '1px solid var(--border)',
                position: 'relative'
              }}>
                <Lock size={28} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 16, marginBottom: 8 }}>
                  +{lockedCount} More Suggestions Locked
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20 }}>
                  Unlock all suggestions, get your AI-rewritten resume, and download your complete package.
                </p>
                <button onClick={() => navigate('/templates')} className="btn btn-primary">
                  Unlock Full Report + Improved Resume <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>

          {/* Locked Resume Preview */}
          {!paymentDone && (
            <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.38s', position: 'relative', overflow: 'hidden' }}>
              <h3 style={{ fontSize: 16, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Lock size={18} color="var(--text-muted)" /> Your Improved Resume Preview
              </h3>

              {/* Blurred fake resume content */}
              <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none', opacity: 0.6 }}>
                <div style={{ padding: '20px', background: 'var(--bg-muted)', borderRadius: 8 }}>
                  <div style={{ textAlign: 'center', marginBottom: 16 }}>
                    <div style={{ height: 12, background: 'var(--border-light)', borderRadius: 4, width: '40%', margin: '0 auto 8px' }} />
                    <div style={{ height: 8, background: 'var(--border)', borderRadius: 4, width: '70%', margin: '0 auto' }} />
                    <div style={{ height: 2, background: 'var(--emerald)', borderRadius: 1, marginTop: 10 }} />
                  </div>
                  {['PROFESSIONAL SUMMARY', 'EXPERIENCE', 'SKILLS'].map((sec) => (
                    <div key={sec} style={{ marginBottom: 16 }}>
                      <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 3, width: '30%', marginBottom: 8 }} />
                      <div style={{ height: 1, background: 'var(--emerald)', marginBottom: 8 }} />
                      {[90, 75, 85, 60].map((w, i) => (
                        <div key={i} style={{ height: 6, background: 'var(--border)', borderRadius: 3, width: `${w}%`, marginBottom: 5 }} />
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Lock overlay */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.7) 40%)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                padding: '28px'
              }}>
                <Lock size={32} color="var(--text-muted)" style={{ marginBottom: 12 }} />
                <h4 style={{ fontSize: 18, marginBottom: 8, textAlign: 'center' }}>
                  Your Improved Resume is Locked
                </h4>
                <p style={{ color: 'var(--text-muted)', fontSize: 13, marginBottom: 20, textAlign: 'center', maxWidth: 400 }}>
                  Choose a template and complete payment to unlock your AI-rewritten, ATS-optimised resume.
                </p>
                <button onClick={() => navigate('/templates')} className="btn btn-primary btn-lg">
                  Choose Template & Unlock <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          {/* Bottom CTA */}
          {!paymentDone && (
            <div className="card fade-up" style={{
              background: 'linear-gradient(135deg, var(--emerald-dim), var(--bg-card))',
              border: '1px solid rgba(16,185,129,0.3)',
              textAlign: 'center', padding: '40px 32px',
              animationDelay: '0.4s'
            }}>
              <h3 style={{ fontSize: 20, marginBottom: 12 }}>
                Ready to land more interviews?
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 24, maxWidth: 440, margin: '0 auto 24px' }}>
                Our AI will rewrite your resume, fix every issue, add missing keywords, and deliver a recruiter-ready PDF — starting at just ₹2,000.
              </p>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => navigate('/templates')} className="btn btn-primary btn-lg">
                  Get Improved Resume — from ₹2,000 <ArrowRight size={18} />
                </button>
                <button onClick={() => navigate('/upload')} className="btn btn-secondary">
                  <Upload size={16} /> Upload Different Resume
                </button>
              </div>
            </div>
          )}

          {paymentDone && (
            <div style={{ textAlign: 'center' }}>
              <button onClick={() => navigate('/download')} className="btn btn-primary btn-lg">
                Go to Download Page <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
