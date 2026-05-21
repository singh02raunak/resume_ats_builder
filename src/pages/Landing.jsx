import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { ArrowRight, CheckCircle2, Zap, Lock, BarChart2, FileText, Star, Users, TrendingUp } from 'lucide-react'
import Footer from '../components/Footer'

const PRICING = [
  {
    name: 'ATS Rewrite',
    price: '₹2,000',
    desc: 'Fix your resume, beat ATS filters',
    features: ['Full ATS score breakdown', 'AI resume rewrite & keyword fix', '80+ ATS score target', 'Formatting & structure fix', 'Download as PDF + ZIP'],
    color: '#10b981',
    tag: null
  },
  {
    name: 'Premium Rewrite',
    price: '₹2,500',
    desc: 'Deep optimisation, highest score',
    features: ['Everything in ATS Rewrite', '90+ ATS score guarantee', 'Metrics-enhanced bullet points', 'Complete resume restructure', 'Job-targeted keyword injection'],
    color: '#6366f1',
    tag: 'Best Value'
  }
]

const HOW_IT_WORKS = [
  { icon: FileText, step: '01', title: 'Upload Your Resume', desc: 'Upload your existing PDF or DOCX resume. Optionally paste a job description for targeted analysis.' },
  { icon: BarChart2, step: '02', title: 'Get ATS Score', desc: 'Our AI instantly analyses your resume across 6 key categories and gives you a score out of 100.' },
  { icon: Zap, step: '03', title: 'Download Improved Resume', desc: 'Choose a plan, pay once, and receive an AI-rewritten resume ready to beat ATS filters.' }
]

export default function Landing() {
  const { user } = useAuth()
  const navigate = useNavigate()

  function handleCTA() {
    navigate(user ? '/upload' : '/login')
  }

  return (
    <div className="page-wrapper">
      {/* Nav */}
      <nav style={{
        borderBottom: '1px solid var(--border)',
        background: 'rgba(8,13,20,0.9)',
        backdropFilter: 'blur(20px)',
        position: 'sticky', top: 0, zIndex: 100
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
              Resume<span style={{ color: 'var(--emerald)' }}>ATS</span>
            </span>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <a href="#pricing" className="btn btn-ghost btn-sm">Pricing</a>
            <button onClick={handleCTA} className="btn btn-primary btn-sm">
              {user ? 'Go to Dashboard' : 'Get Started'}
            </button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '100px 0 80px', position: 'relative', overflow: 'hidden' }}>
        {/* Grid background */}
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'linear-gradient(var(--border) 1px, transparent 1px), linear-gradient(90deg, var(--border) 1px, transparent 1px)',
          backgroundSize: '56px 56px',
          opacity: 0.4
        }} />
        {/* Glow */}
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 300,
          background: 'radial-gradient(ellipse, rgba(16,185,129,0.12) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div className="container" style={{ position: 'relative', textAlign: 'center' }}>
          <div className="fade-up" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            padding: '6px 14px', borderRadius: 999, marginBottom: 28,
            background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
            color: 'var(--emerald)', fontSize: 13, fontWeight: 600, fontFamily: 'var(--font-mono)'
          }}>
            <Zap size={12} fill="currentColor" /> 500+ resumes improved this month
          </div>

          <h1 className="fade-up" style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.2rem)',
            fontWeight: 800, marginBottom: 24,
            background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            animationDelay: '0.1s'
          }}>
            Stop Getting Rejected<br />
            <span style={{ background: 'linear-gradient(135deg, var(--emerald), var(--emerald-light))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              by ATS Robots
            </span>
          </h1>

          <p className="fade-up" style={{
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: 'var(--text-dim)', maxWidth: 560, margin: '0 auto 40px',
            lineHeight: 1.7, animationDelay: '0.2s'
          }}>
            75% of resumes never reach a human. Upload yours, get an ATS score instantly,
            and download an AI-improved version that gets you to interviews.
          </p>

          <div className="fade-up" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
            <button onClick={handleCTA} className="btn btn-primary btn-lg" style={{ fontSize: 16 }}>
              Analyse My Resume Free <ArrowRight size={18} />
            </button>
            <a href="#how" className="btn btn-secondary btn-lg" style={{ fontSize: 16 }}>
              See How It Works
            </a>
          </div>

          <div className="fade-up" style={{ display: 'flex', gap: 24, justifyContent: 'center', marginTop: 40, flexWrap: 'wrap', animationDelay: '0.4s' }}>
            {[
              { icon: Lock, text: 'No account needed for preview' },
              { icon: CheckCircle2, text: 'ATS score in under 30 seconds' },
              { icon: Star, text: 'One-time payment, no subscription' }
            ].map(({ icon: Icon, text }) => (
              <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 8, color: 'var(--text-muted)', fontSize: 13 }}>
                <Icon size={14} color="var(--emerald)" />
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '28px 0', background: 'var(--bg-card)' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 5vw, 80px)', flexWrap: 'wrap' }}>
          {[
            { value: '75%', label: 'of resumes filtered by ATS' },
            { value: '85+', label: 'average improved score' },
            { value: '30s', label: 'to get your ATS report' },
            { value: '₹2,000', label: 'starting price, pay once' }
          ].map(({ value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(1.5rem, 4vw, 2.2rem)', color: 'var(--emerald)' }}>{value}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" style={{ padding: '80px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', marginBottom: 12 }}>How It Works</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>Three steps to a resume that lands interviews</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 24 }}>
            {HOW_IT_WORKS.map(({ icon: Icon, step, title, desc }, idx) => (
              <div key={step} className="card" style={{ position: 'relative', animationDelay: `${idx * 0.1}s` }}>
                <div style={{
                  position: 'absolute', top: -1, left: -1, right: -1, height: 2,
                  background: `linear-gradient(90deg, var(--emerald), transparent)`,
                  borderRadius: '20px 20px 0 0',
                  opacity: idx === 0 ? 1 : idx === 1 ? 0.6 : 0.3
                }} />
                <div style={{
                  fontFamily: 'var(--font-mono)', fontSize: 11, fontWeight: 700,
                  color: 'var(--emerald)', letterSpacing: '0.1em', marginBottom: 16
                }}>STEP {step}</div>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16
                }}>
                  <Icon size={22} color="var(--emerald)" />
                </div>
                <h3 style={{ fontSize: 18, marginBottom: 8 }}>{title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: 14, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{ padding: '80px 0', background: 'var(--bg-card)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: 56 }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.6rem)', marginBottom: 12 }}>One-Time Pricing</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: 16 }}>No subscriptions. Pay once, download instantly.</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 960, margin: '0 auto' }}>
            {PRICING.map((plan) => (
              <div key={plan.name} style={{
                background: 'var(--bg)',
                border: `1px solid ${plan.tag === 'Most Popular' ? plan.color : 'var(--border)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: 28,
                position: 'relative',
                transition: 'transform 0.2s, box-shadow 0.2s',
                boxShadow: plan.tag === 'Most Popular' ? `0 0 40px ${plan.color}18` : 'none'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${plan.color}20` }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = plan.tag === 'Most Popular' ? `0 0 40px ${plan.color}18` : 'none' }}
              >
                {plan.tag && (
                  <div style={{
                    position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                    padding: '4px 14px', borderRadius: 999,
                    background: plan.color, color: '#000',
                    fontSize: 11, fontWeight: 700, whiteSpace: 'nowrap'
                  }}>{plan.tag}</div>
                )}

                <div style={{ marginBottom: 20 }}>
                  <h3 style={{ fontSize: 18, marginBottom: 4 }}>{plan.name}</h3>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>{plan.desc}</p>
                </div>

                <div style={{ marginBottom: 24 }}>
                  <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 36, color: plan.color }}>{plan.price}</span>
                  <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 4 }}>one-time</span>
                </div>

                <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                  {plan.features.map(f => (
                    <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                      <CheckCircle2 size={15} color={plan.color} style={{ flexShrink: 0, marginTop: 2 }} />
                      <span style={{ color: 'var(--text-dim)' }}>{f}</span>
                    </li>
                  ))}
                </ul>

                <button onClick={handleCTA} className="btn" style={{
                  width: '100%', justifyContent: 'center',
                  background: plan.tag === 'Most Popular' ? plan.color : 'transparent',
                  color: plan.tag === 'Most Popular' ? '#000' : plan.color,
                  border: `1px solid ${plan.color}`
                }}>
                  Get Started <ArrowRight size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <div style={{ maxWidth: 560, margin: '0 auto' }}>
            <h2 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: 16 }}>
              Your dream job is waiting.<br />Your resume shouldn't hold you back.
            </h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 32, fontSize: 16 }}>
              Get your ATS score free. Pay only when you're ready to improve.
            </p>
            <button onClick={handleCTA} className="btn btn-primary btn-lg">
              Analyse My Resume — It's Free <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
