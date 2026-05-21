import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDropzone } from 'react-dropzone'
import { useResume } from '../context/ResumeContext'
import { useAuth } from '../context/AuthContext'
import { analyzeResume } from '../lib/claude'
import { saveAnalysis } from '../lib/supabase'
import { extractTextFromFile } from '../lib/utils'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { Upload as UploadIcon, FileText, X, Zap, CheckCircle2, Briefcase, ChevronDown, ChevronUp } from 'lucide-react'
import toast from 'react-hot-toast'

const ANALYZE_STEPS = [
  'Extracting text from resume…',
  'Scanning for ATS compatibility…',
  'Checking keyword density…',
  'Analysing formatting & structure…',
  'Scoring experience section…',
  'Generating recommendations…',
  'Finalising your report…'
]

export default function Upload() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const {
    resumeFile, setResumeFile,
    resumeText, setResumeText,
    jobDescription, setJobDescription,
    setAnalysis, setAnalysisId,
    isAnalyzing, setIsAnalyzing
  } = useResume()

  const [showJD, setShowJD] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)

  const onDrop = useCallback((accepted, rejected) => {
    if (rejected.length > 0) {
      toast.error('Please upload a PDF, DOCX, or TXT file (max 5MB)')
      return
    }
    if (accepted.length > 0) {
      setResumeFile(accepted[0])
      toast.success(`"${accepted[0].name}" ready to analyse`)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
      'text/plain': ['.txt']
    },
    maxSize: 5 * 1024 * 1024,
    multiple: false
  })

  async function handleAnalyze() {
    if (!resumeFile) {
      toast.error('Please upload your resume first')
      return
    }

    setIsAnalyzing(true)
    setAnalyzeStep(0)

    try {
      // Step 1: Extract text
      setAnalyzeStep(0)
      const text = await extractTextFromFile(resumeFile)
      if (!text || text.length < 100) {
        throw new Error('Could not extract text from your resume. Please try a different file format.')
      }
      setResumeText(text)

      // Simulate progress steps while Claude analyses
      let step = 1
      const stepInterval = setInterval(() => {
        step = Math.min(step + 1, ANALYZE_STEPS.length - 1)
        setAnalyzeStep(step)
      }, 1800)

      // Step 2: Analyse with Claude
      const analysisResult = await analyzeResume(text, jobDescription)
      clearInterval(stepInterval)
      setAnalyzeStep(ANALYZE_STEPS.length - 1)

      // Step 3: Save to Supabase
      const record = await saveAnalysis(user.id, {
        originalFilename: resumeFile.name,
        originalText: text,
        atsScore: analysisResult.atsScore,
        analysis: analysisResult
      })

      setAnalysis(analysisResult)
      setAnalysisId(record.id)

      toast.success('Analysis complete!')
      navigate('/results')

    } catch (err) {
      console.error(err)
      toast.error(err.message || 'Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
      setAnalyzeStep(0)
    }
  }

  function removeFile() {
    setResumeFile(null)
    setResumeText('')
  }

  if (isAnalyzing) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
        <Header />
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            {/* Pulsing logo */}
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

            <h2 style={{ fontSize: 22, marginBottom: 8 }}>Analysing Your Resume</h2>
            <p style={{ color: 'var(--emerald)', fontFamily: 'var(--font-mono)', fontSize: 13, marginBottom: 32 }}>
              {ANALYZE_STEPS[analyzeStep]}
            </p>

            {/* Steps list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' }}>
              {ANALYZE_STEPS.map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 10, fontSize: 13,
                  color: i < analyzeStep ? 'var(--emerald)' : i === analyzeStep ? 'var(--text)' : 'var(--text-muted)',
                  transition: 'color 0.3s'
                }}>
                  {i < analyzeStep ? (
                    <CheckCircle2 size={14} color="var(--emerald)" />
                  ) : i === analyzeStep ? (
                    <div className="spinner" style={{ width: 14, height: 14 }} />
                  ) : (
                    <div style={{ width: 14, height: 14, borderRadius: '50%', border: '1.5px solid var(--border-light)' }} />
                  )}
                  {s}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="progress-track" style={{ marginTop: 28 }}>
              <div className="progress-fill" style={{ width: `${((analyzeStep + 1) / ANALYZE_STEPS.length) * 100}%` }} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 720 }}>

          {/* Header */}
          <div style={{ marginBottom: 36 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: 10 }}>
              Upload Your Resume
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>
              Upload your current resume and get a free ATS score instantly. No payment required for the analysis.
            </p>
          </div>

          {/* Drop Zone */}
          {!resumeFile ? (
            <div
              {...getRootProps()}
              style={{
                border: `2px dashed ${isDragActive ? 'var(--emerald)' : 'var(--border-light)'}`,
                borderRadius: 'var(--radius-lg)',
                padding: '56px 32px',
                textAlign: 'center',
                cursor: 'pointer',
                background: isDragActive ? 'var(--emerald-dim)' : 'var(--bg-card)',
                transition: 'all 0.2s',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <input {...getInputProps()} />

              <div style={{
                width: 64, height: 64, borderRadius: 20,
                background: isDragActive ? 'rgba(16,185,129,0.2)' : 'var(--bg-muted)',
                border: `1px solid ${isDragActive ? 'var(--emerald)' : 'var(--border)'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 20px',
                transition: 'all 0.2s'
              }}>
                <UploadIcon size={28} color={isDragActive ? 'var(--emerald)' : 'var(--text-muted)'} />
              </div>

              <h3 style={{ fontSize: 18, marginBottom: 8, color: isDragActive ? 'var(--emerald)' : 'var(--text)' }}>
                {isDragActive ? 'Drop your resume here' : 'Drag & drop your resume'}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: 14, marginBottom: 16 }}>
                or <span style={{ color: 'var(--emerald)', fontWeight: 600 }}>browse files</span>
              </p>
              <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                PDF, DOCX, TXT · Max 5MB
              </p>
            </div>
          ) : (
            /* File Preview */
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--emerald)',
              borderRadius: 'var(--radius-lg)',
              padding: '20px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              gap: 16,
              boxShadow: '0 0 30px rgba(16,185,129,0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 12,
                  background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <FileText size={22} color="var(--emerald)" />
                </div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 2 }}>{resumeFile.name}</p>
                  <p style={{ color: 'var(--text-muted)', fontSize: 12, fontFamily: 'var(--font-mono)' }}>
                    {(resumeFile.size / 1024).toFixed(1)} KB · {resumeFile.name.split('.').pop().toUpperCase()}
                  </p>
                </div>
              </div>
              <button onClick={removeFile} style={{
                background: 'none', border: 'none', color: 'var(--text-muted)',
                cursor: 'pointer', padding: 4
              }}>
                <X size={18} />
              </button>
            </div>
          )}

          {/* Job Description Toggle */}
          <div style={{ marginTop: 20 }}>
            <button
              onClick={() => setShowJD(!showJD)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                background: 'none', border: 'none',
                color: showJD ? 'var(--emerald)' : 'var(--text-muted)',
                cursor: 'pointer', fontSize: 14, fontWeight: 500,
                fontFamily: 'var(--font-body)', padding: '8px 0'
              }}
            >
              <Briefcase size={15} />
              Add Job Description for targeted analysis (recommended)
              {showJD ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>

            {showJD && (
              <div className="fade-up" style={{ marginTop: 12 }}>
                <label style={{ display: 'block', fontSize: 13, color: 'var(--text-muted)', marginBottom: 8 }}>
                  Paste the job description you're applying for — the AI will optimise your resume specifically for it
                </label>
                <textarea
                  className="input"
                  placeholder="Paste job description here…"
                  value={jobDescription}
                  onChange={e => setJobDescription(e.target.value)}
                  style={{ minHeight: 120, lineHeight: 1.6 }}
                />
              </div>
            )}
          </div>

          {/* Tips */}
          <div className="card" style={{ marginTop: 28, background: 'var(--bg-muted)', borderColor: 'var(--border)' }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-dim)', marginBottom: 10, fontFamily: 'var(--font-mono)' }}>
              ✦ TIPS FOR BEST RESULTS
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {[
                'Upload your most recent resume — older versions score lower',
                'PDF format gives the most accurate text extraction',
                'Paste the job description for a job-specific ATS score',
                'The free score covers all 6 categories — no payment needed'
              ].map(tip => (
                <p key={tip} style={{ fontSize: 13, color: 'var(--text-muted)', display: 'flex', gap: 8 }}>
                  <CheckCircle2 size={13} color="var(--emerald)" style={{ flexShrink: 0, marginTop: 2 }} />
                  {tip}
                </p>
              ))}
            </div>
          </div>

          {/* Analyse Button */}
          <button
            onClick={handleAnalyze}
            className="btn btn-primary btn-lg"
            disabled={!resumeFile || isAnalyzing}
            style={{ width: '100%', justifyContent: 'center', marginTop: 28 }}
          >
            <Zap size={18} fill="currentColor" />
            Analyse My Resume Free
          </button>
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12, marginTop: 12 }}>
            Free ATS score · Pay only to download the improved version
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
