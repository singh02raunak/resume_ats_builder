import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { FileText, Mail, ArrowRight, ChevronLeft, RefreshCw } from 'lucide-react'
import toast from 'react-hot-toast'
import Footer from '../components/Footer'

export default function Login() {
  const { user, sendOTP, verifyOTP } = useAuth()
  const navigate = useNavigate()

  const [step, setStep] = useState('email') // 'email' | 'otp'
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [resendTimer, setResendTimer] = useState(0)
  const inputRefs = useRef([])

  // Redirect if already logged in
  useEffect(() => {
    if (user) navigate('/upload', { replace: true })
  }, [user])

  // Resend countdown
  useEffect(() => {
    if (resendTimer <= 0) return
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendTimer])

  async function handleSendOTP(e) {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    setLoading(true)
    try {
      await sendOTP(email.trim())
      setStep('otp')
      setResendTimer(60)
      toast.success('OTP sent! Check your email inbox.')
      setTimeout(() => inputRefs.current[0]?.focus(), 100)
    } catch (err) {
      toast.error(err.message || 'Failed to send OTP')
    } finally {
      setLoading(false)
    }
  }

  function handleOtpChange(idx, val) {
    if (!/^\d*$/.test(val)) return
    const next = [...otp]
    next[idx] = val.slice(-1)
    setOtp(next)
    if (val && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handleOtpKeyDown(idx, e) {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus()
    }
    if (e.key === 'ArrowLeft' && idx > 0) inputRefs.current[idx - 1]?.focus()
    if (e.key === 'ArrowRight' && idx < 5) inputRefs.current[idx + 1]?.focus()
  }

  function handleOtpPaste(e) {
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleVerifyOTP(e) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length < 6) {
      toast.error('Please enter the full 6-digit code')
      return
    }
    setLoading(true)
    try {
      await verifyOTP(email, code)
      toast.success('Welcome! Redirecting…')
      navigate('/upload')
    } catch (err) {
      toast.error(err.message || 'Invalid or expired OTP. Please try again.')
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  async function handleResend() {
    if (resendTimer > 0) return
    setLoading(true)
    try {
      await sendOTP(email)
      setResendTimer(60)
      setOtp(['', '', '', '', '', ''])
      toast.success('New OTP sent!')
      inputRefs.current[0]?.focus()
    } catch (err) {
      toast.error(err.message || 'Failed to resend OTP')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)', position: 'relative', overflow: 'hidden' }}>
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '30%', left: '50%', transform: 'translateX(-50%)',
        width: 500, height: 300,
        background: 'radial-gradient(ellipse, rgba(16,185,129,0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Logo bar */}
      <div style={{ padding: '20px 0', borderBottom: '1px solid var(--border)' }}>
        <div className="container">
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <FileText size={18} color="#000" strokeWidth={2.5} />
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18 }}>
              Resume<span style={{ color: 'var(--emerald)' }}>ATS</span>
            </span>
          </Link>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 16px' }}>
        <div className="card fade-up" style={{ width: '100%', maxWidth: 440 }}>

          {step === 'email' ? (
            <>
              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <Mail size={24} color="var(--emerald)" />
                </div>
                <h1 style={{ fontSize: 24, marginBottom: 8 }}>Sign in to ResumeATS</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  Enter your email and we'll send a one-time code. No password needed.
                </p>
              </div>

              <form onSubmit={handleSendOTP} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 600, marginBottom: 6, color: 'var(--text-dim)' }}>
                    Email address
                  </label>
                  <input
                    type="email"
                    className="input"
                    placeholder="you@example.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    autoFocus
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <><div className="spinner" /> Sending…</> : <>Send OTP <ArrowRight size={16} /></>}
                </button>
              </form>

              <p style={{ textAlign: 'center', marginTop: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                By continuing, you agree to our terms. We'll never spam you.
              </p>
            </>
          ) : (
            <>
              <button
                onClick={() => { setStep('email'); setOtp(['', '', '', '', '', '']) }}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  background: 'none', border: 'none', color: 'var(--text-muted)',
                  fontSize: 13, marginBottom: 24, cursor: 'pointer'
                }}
              >
                <ChevronLeft size={14} /> Back
              </button>

              <div style={{ textAlign: 'center', marginBottom: 32 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: 16,
                  background: 'var(--emerald-dim)', border: '1px solid rgba(16,185,129,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <span style={{ fontSize: 24 }}>📬</span>
                </div>
                <h1 style={{ fontSize: 24, marginBottom: 8 }}>Check your inbox</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>
                  We sent a 6-digit code to<br />
                  <strong style={{ color: 'var(--text)' }}>{email}</strong>
                </p>
              </div>

              <form onSubmit={handleVerifyOTP}>
                {/* OTP Input */}
                <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={el => inputRefs.current[idx] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(idx, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(idx, e)}
                      onPaste={handleOtpPaste}
                      style={{
                        width: 48, height: 56,
                        textAlign: 'center',
                        fontSize: 22, fontWeight: 700,
                        fontFamily: 'var(--font-mono)',
                        background: digit ? 'var(--emerald-dim)' : 'var(--bg-muted)',
                        border: `2px solid ${digit ? 'var(--emerald)' : 'var(--border)'}`,
                        borderRadius: 10,
                        color: digit ? 'var(--emerald)' : 'var(--text)',
                        outline: 'none',
                        transition: 'all 0.15s',
                        cursor: 'text'
                      }}
                      onFocus={e => e.target.style.borderColor = 'var(--emerald)'}
                      onBlur={e => e.target.style.borderColor = digit ? 'var(--emerald)' : 'var(--border)'}
                    />
                  ))}
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading || otp.join('').length < 6}
                  style={{ width: '100%', justifyContent: 'center' }}>
                  {loading ? <><div className="spinner" /> Verifying…</> : <>Verify & Continue <ArrowRight size={16} /></>}
                </button>
              </form>

              <div style={{ textAlign: 'center', marginTop: 20 }}>
                <button
                  onClick={handleResend}
                  disabled={resendTimer > 0}
                  style={{
                    background: 'none', border: 'none', cursor: resendTimer > 0 ? 'default' : 'pointer',
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    color: resendTimer > 0 ? 'var(--text-muted)' : 'var(--emerald)',
                    fontSize: 13, fontFamily: 'var(--font-body)'
                  }}
                >
                  <RefreshCw size={12} />
                  {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
