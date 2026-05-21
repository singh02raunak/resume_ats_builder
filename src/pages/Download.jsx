import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { generateResumePDF } from '../lib/templates'
import { createDownloadZip, triggerDownload, PLANS } from '../lib/utils'
import ResumePreview from '../components/ResumePreview'
import ATSGauge from '../components/ATSGauge'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {
  Download, FileText, Archive, Upload,
  CheckCircle2, Star, ArrowRight
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function DownloadPage() {
  const navigate = useNavigate()
  const {
    analysis, improvedResume,
    resumeText, selectedPlan, selectedTemplate, paymentDone, resetAll
  } = useResume()

  const [downloading, setDownloading] = useState(null)

  useEffect(() => {
    if (!paymentDone || !improvedResume) navigate('/payment', { replace: true })
  }, [paymentDone, improvedResume])

  if (!paymentDone || !improvedResume) return null

  const plan = PLANS[selectedPlan] || PLANS.standard
  const estimatedScore = improvedResume.estimatedNewScore
    ?? Math.min(100, (analysis?.atsScore ?? 60) + 28)

  async function downloadPDF() {
    setDownloading('pdf')
    try {
      const doc = await generateResumePDF(improvedResume, selectedTemplate)
      const blob = doc.output('blob')
      triggerDownload(blob, `improved_resume_${improvedResume.name?.split(' ')[0] || 'resume'}.pdf`)
      toast.success('Resume PDF downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('PDF download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  async function downloadZip() {
    setDownloading('zip')
    try {
      const zipBlob = await createDownloadZip({
        resumeData: improvedResume,
        plan: selectedPlan,
        originalText: resumeText,
        templateId: selectedTemplate
      })
      triggerDownload(zipBlob, `ResumeATS_Package_${improvedResume.name?.split(' ')[0] || 'resume'}.zip`)
      toast.success('ZIP package downloaded!')
    } catch (err) {
      console.error(err)
      toast.error('ZIP download failed. Please try again.')
    } finally {
      setDownloading(null)
    }
  }

  function copyToClipboard(text, label) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label)
      toast.success(`${label} copied to clipboard!`)
      setTimeout(() => setCopied(null), 2000)
    })
  }

  function handleStartNew() {
    resetAll()
    navigate('/upload')
  }

  // Build a plain-text version of the resume from original text for preview
  const originalPreviewData = resumeText ? {
    name: improvedResume.name,
    contact: improvedResume.contact,
    summary: 'Original resume content (text extracted)',
    experience: [],
    education: [],
    skills: { technical: [], tools: [], soft: [] }
  } : null

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 1000 }}>

          {/* Success banner */}
          <div className="card fade-up" style={{
            background: 'linear-gradient(135deg, var(--emerald-dim), rgba(16,185,129,0.05))',
            border: '1px solid rgba(16,185,129,0.3)',
            marginBottom: 32, padding: '28px 32px',
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap'
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16, flexShrink: 0,
              background: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <CheckCircle2 size={28} color="#000" />
            </div>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: 20, marginBottom: 4 }}>
                Your Resume is Ready! 🎉
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                {plan.name} plan · AI-improved and ATS-optimised · Estimated new score:{' '}
                <strong style={{ color: 'var(--emerald)' }}>{estimatedScore}/100</strong>
              </p>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button onClick={downloadPDF} className="btn btn-primary" disabled={!!downloading}>
                {downloading === 'pdf' ? <><div className="spinner" /> Generating…</> : <><FileText size={15} /> Download PDF</>}
              </button>
              <button onClick={downloadZip} className="btn btn-secondary" disabled={!!downloading}>
                {downloading === 'zip' ? <><div className="spinner" /> Packing…</> : <><Archive size={15} /> Download ZIP</>}
              </button>
            </div>
          </div>

          {/* Score comparison */}
          {analysis && (
            <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.1s' }}>
              <h3 style={{ fontSize: 16, marginBottom: 24 }}>Score Improvement</h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 32, flexWrap: 'wrap' }}>
                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>BEFORE</p>
                  <ATSGauge score={analysis.atsScore} size={140} animate={false} gaugeId="before" />
                </div>

                <div style={{ fontSize: 32, color: 'var(--emerald)', fontWeight: 800 }}>→</div>

                <div style={{ textAlign: 'center' }}>
                  <p style={{ fontSize: 12, color: 'var(--emerald)', marginBottom: 8, fontFamily: 'var(--font-mono)' }}>AFTER (ESTIMATED)</p>
                  <ATSGauge score={estimatedScore} size={140} animate gaugeId="after" />
                </div>
              </div>
            </div>
          )}

          {/* Before / After Preview */}
          <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.15s' }}>
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Resume Preview</h3>
            <ResumePreview
              original={originalPreviewData}
              improved={improvedResume}
            />
          </div>

          {/* Downloads Section */}
          <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.2s' }}>
            <h3 style={{ fontSize: 16, marginBottom: 20 }}>Your Downloads</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>

              {/* PDF Resume */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: 10,
                background: 'var(--bg-muted)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <FileText size={18} color="var(--emerald)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>Improved Resume</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>PDF · ATS-optimised · Ready to submit</p>
                  </div>
                </div>
                <button onClick={downloadPDF} className="btn btn-primary btn-sm" disabled={!!downloading}>
                  {downloading === 'pdf' ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Download size={14} />}
                  Download PDF
                </button>
              </div>

              {/* ZIP Package */}
              <div style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '16px 20px', borderRadius: 10,
                background: 'var(--bg-muted)', border: '1px solid var(--border)', flexWrap: 'wrap', gap: 12
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10,
                    background: 'var(--indigo-dim)', border: '1px solid rgba(99,102,241,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Archive size={18} color="var(--indigo)" />
                  </div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 14 }}>Complete ZIP Package</p>
                    <p style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      Resume PDF · Original backup · README
                    </p>
                  </div>
                </div>
                <button onClick={downloadZip} className="btn btn-secondary btn-sm" disabled={!!downloading}>
                  {downloading === 'zip' ? <div className="spinner" style={{ width: 14, height: 14 }} /> : <Archive size={14} />}
                  Download ZIP
                </button>
              </div>

            </div>
          </div>

          {/* What changed */}
          {improvedResume?.changesMade?.length > 0 && (
            <div className="card fade-up" style={{ marginBottom: 28, animationDelay: '0.25s' }}>
              <h3 style={{ fontSize: 16, marginBottom: 16 }}>
                <Star size={16} color="var(--amber)" style={{ verticalAlign: 'middle', marginRight: 8 }} />
                What the AI Improved
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {improvedResume.changesMade.map((change, i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, fontSize: 13, color: 'var(--text-dim)' }}>
                    <CheckCircle2 size={14} color="var(--emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                    {change}
                  </div>
                ))}
              </div>
              {improvedResume.keywordsAdded?.length > 0 && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--border)' }}>
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 10 }}>
                    KEYWORDS ADDED
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                    {improvedResume.keywordsAdded.map((kw, i) => (
                      <span key={i} style={{
                        padding: '3px 9px', borderRadius: 6, fontSize: 11, fontWeight: 600,
                        fontFamily: 'var(--font-mono)',
                        background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
                        color: 'var(--emerald)'
                      }}>{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Start New */}
          <div style={{ textAlign: 'center' }}>
            <button onClick={handleStartNew} className="btn btn-secondary" style={{ gap: 8 }}>
              <Upload size={15} /> Analyse Another Resume
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
