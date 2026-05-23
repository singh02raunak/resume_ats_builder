import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { PLANS } from '../lib/utils'
import { TEMPLATES } from '../lib/templates'
import { improveResume as claudeImproveResume } from '../lib/claude'
import { updateAnalysis } from '../lib/supabase'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CheckCircle2, ArrowRight, Shield, Zap, Lock, FileText } from 'lucide-react'
import toast from 'react-hot-toast'

const IMPROVE_STEPS = [
  'Rewriting resume with AI…',
  'Adding missing keywords…',
  'Enhancing bullet points…',
  'Optimising for ATS…',
  'Packaging your files…'
]

export default function Payment() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const {
    analysis, resumeText, jobDescription, analysisId,
    selectedTemplate,
    setImprovedResume,
    setPaymentDone, setSelectedPlan, isImproving, setIsImproving
  } = useResume()

  const templateInfo = TEMPLATES[selectedTemplate] || TEMPLATES.classic

  const [hoveredPlan, setHoveredPlan] = useState(null)
  const [processingPlan, setProcessingPlan] = useState(null)
  const [improveStep, setImproveStep] = useState(0)

  async function handleSelectPlan(planId) {
    if (!analysis) {
      toast.error('No analysis found. Please upload your resume first.')
      navigate('/upload')
      return
    }
    setProcessingPlan(planId)
    toast.success('Generating your improved resume…')
    await generateImprovedResume(planId, {})
  }

  async function generateImprovedResume(planId, paymentData) {
    setIsImproving(true)
    setImproveStep(0)

    try {
      const stepInterval = setInterval(() => {
        setImproveStep(s => Math.min(s + 1, IMPROVE_STEPS.length - 1))
      }, 2000)

      // Generate improved resume
      const result = await claudeImproveResume(resumeText, analysis, jobDescription, planId, selectedTemplate)

      clearInterval(stepInterval)
      setImproveStep(IMPROVE_STEPS.length - 1)

      // Update Supabase record
      if (analysisId) {
        await updateAnalysis(analysisId, {
          payment_status: 'paid',
          payment_amount: PLANS[planId].price,
          plan: planId,
          payment_id: paymentData.paymentId,
          improved_resume: result.improvedResume
        })
      }

      // Update context
      setImprovedResume(result.improvedResume)
      setPaymentDone(true)
      setSelectedPlan(planId)

      navigate('/download')
    } catch (err) {
      console.error(err)
      toast.error('Failed to generate improved resume. Please contact support.')
    } finally {
      setIsImproving(false)
      setProcessingPlan(null)
    }
  }

  if (isImproving) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{
              width: 80, height: 80, borderRadius: 24,
              background: 'var(--emerald-dim)', border: '2px solid var(--emerald)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 28px',
              animation: 'pulse 1.5s ease-in-out infinite',
              boxShadow: '0 0 40px rgba(16,185,129,0.3)'
            }}>
              <Zap size={36} color="var(--emerald)" />
            </div>

            <h2 style={{ fontSize: 22, marginBottom: 8 }}>Improving Your Resume</h2>
            <p style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 32 }}>
              {IMPROVE_STEPS[improveStep]}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {IMPROVE_STEPS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                  color: i < improveStep ? 'var(--emerald)' : i === improveStep ? 'var(--text)' : 'var(--text-muted)',
                  transition: 'color 0.3s'
                }}>
                  {i < improveStep ? <CheckCircle2 size={14} color="var(--emerald)" />
                    : i === improveStep ? <div className="spinner" style={{ width: 14, height: 14 }} />
                    : <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border-light)' }} />}
                  {s}
                </div>
              ))}
            </div>

            <div className="progress-track" style={{ marginTop: 28 }}>
              <div className="progress-fill" style={{ width: `${((improveStep + 1) / IMPROVE_STEPS.length) * 100}%` }} />
            </div>
            <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 12 }}>
              This may take 30-60 seconds. Please don't close this tab.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 960 }}>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: 12 }}>
              Choose Your Plan
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              One-time payment. No subscription. Instant download after payment.
            </p>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: 20, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
              {[
                { icon: Shield, text: 'Secure & encrypted' },
                { icon: Lock, text: 'Your data is encrypted' },
                { icon: CheckCircle2, text: '7-day refund on Career Edge plan' }
              ].map(({ icon: Icon, text }) => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-muted)' }}>
                  <Icon size={13} color="var(--emerald)" /> {text}
                </div>
              ))}
            </div>
          </div>

          {/* Selected template banner */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            padding: '14px 20px', borderRadius: 10, marginBottom: 28,
            background: 'var(--bg-card)', border: `1px solid ${templateInfo.previewColor}40`,
            flexWrap: 'wrap', gap: 10
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: templateInfo.previewColor, flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: 13, fontWeight: 600 }}>Template: {templateInfo.name}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', marginLeft: 10 }}>{templateInfo.description}</span>
              </div>
            </div>
            <button onClick={() => navigate('/templates')} className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
              Change Template
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, maxWidth: 960 }}>
            {Object.values(PLANS).map((plan) => {
              const isHovered = hoveredPlan === plan.id
              const isProcessing = processingPlan === plan.id

              return (
                <div key={plan.id}
                  onMouseEnter={() => setHoveredPlan(plan.id)}
                  onMouseLeave={() => setHoveredPlan(null)}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1px solid ${plan.popular ? plan.color : isHovered ? 'var(--border-light)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 28,
                    position: 'relative',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    transform: isHovered || plan.popular ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: plan.popular ? `0 0 40px ${plan.color}20` : isHovered ? `0 20px 60px rgba(0,0,0,0.3)` : 'none',
                    cursor: 'pointer'
                  }}
                  onClick={() => !processingPlan && handleSelectPlan(plan.id)}
                >
                  {plan.popular && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      padding: '4px 16px', borderRadius: 999,
                      background: plan.color, color: '#000',
                      fontSize: 11, fontWeight: 800, whiteSpace: 'nowrap',
                      letterSpacing: '0.04em'
                    }}>
                      ★ MOST POPULAR
                    </div>
                  )}

                  {/* Plan header */}
                  <div style={{ marginBottom: 8 }}>
                    <h3 style={{ fontSize: 20, marginBottom: 4 }}>{plan.name}</h3>
                    <p style={{ fontSize: 13, color: 'var(--text-muted)' }}>{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div style={{ margin: '20px 0 24px', paddingBottom: 20, borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 40, color: plan.color }}>
                      {plan.priceDisplay}
                    </span>
                    <span style={{ color: 'var(--text-muted)', fontSize: 13, marginLeft: 4 }}>one-time</span>
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14 }}>
                        <CheckCircle2 size={15} color={plan.color} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ color: 'var(--text-dim)' }}>{f}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button
                    className="btn"
                    disabled={!!processingPlan}
                    style={{
                      width: '100%', justifyContent: 'center',
                      background: plan.popular ? plan.color : 'transparent',
                      color: plan.popular ? '#000' : plan.color,
                      border: `1.5px solid ${plan.color}`,
                      opacity: processingPlan && !isProcessing ? 0.5 : 1,
                      gap: 8
                    }}
                    onClick={(e) => { e.stopPropagation(); !processingPlan && handleSelectPlan(plan.id) }}
                  >
                    {isProcessing ? (
                      <><div className="spinner" style={{ borderTopColor: plan.color }} /> Opening payment…</>
                    ) : (
                      <>Pay {plan.priceDisplay} <ArrowRight size={15} /></>
                    )}
                  </button>
                </div>
              )
            })}
          </div>

          {/* FAQ */}
          <div style={{ marginTop: 56, maxWidth: 640, margin: '56px auto 0' }}>
            <h3 style={{ fontSize: 18, marginBottom: 24, textAlign: 'center' }}>Common Questions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {[
                { q: 'How quickly will I get my improved resume?', a: 'Instantly after payment. The AI generates your improved resume in 30-60 seconds, then you can download it.' },
                { q: 'What if I\'m not happy with the result?', a: 'Career Edge plan comes with a 7-day revision window. For other plans, contact us and we\'ll do our best to help.' },
                { q: 'Is my resume data safe?', a: 'Yes. Your resume is stored encrypted in our database and never shared with third parties. You can delete your data anytime.' },
                { q: 'Can I use the improved resume for any job?', a: 'Yes. If you added a job description, it\'s optimised for that role. Without a JD, it\'s optimised for general ATS compatibility.' }
              ].map(({ q, a }) => (
                <div key={q} style={{
                  padding: '18px 20px', borderRadius: 10,
                  background: 'var(--bg-card)', border: '1px solid var(--border)'
                }}>
                  <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>{q}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>{a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
