import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useResume } from '../context/ResumeContext'
import { LogOut, FileText, Upload, BarChart2, CreditCard, Download } from 'lucide-react'
import toast from 'react-hot-toast'

const steps = [
  { path: '/upload', label: 'Upload', icon: Upload },
  { path: '/results', label: 'Analysis', icon: BarChart2 },
  { path: '/payment', label: 'Payment', icon: CreditCard },
  { path: '/download', label: 'Download', icon: Download }
]

export default function Header() {
  const { user, signOut } = useAuth()
  const { resetAll } = useResume()
  const navigate = useNavigate()
  const location = useLocation()

  const isAppPage = steps.some(s => location.pathname === s.path)

  async function handleSignOut() {
    await signOut()
    resetAll()
    navigate('/')
    toast.success('Signed out successfully')
  }

  const currentStepIdx = steps.findIndex(s => s.path === location.pathname)

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      borderBottom: '1px solid var(--border)',
      background: 'rgba(8,13,20,0.85)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>

        {/* Logo */}
        <Link to={user ? '/upload' : '/'} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: 'var(--emerald)',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <FileText size={18} color="#000" strokeWidth={2.5} />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--text)' }}>
            Resume<span style={{ color: 'var(--emerald)' }}>ATS</span>
          </span>
        </Link>

        {/* Progress Steps — only on app pages */}
        {isAppPage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            {steps.map((step, idx) => {
              const Icon = step.icon
              const done = idx < currentStepIdx
              const active = idx === currentStepIdx
              return (
                <div key={step.path} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <div style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '4px 10px', borderRadius: 999,
                    fontSize: 12, fontWeight: 600,
                    fontFamily: 'var(--font-mono)',
                    background: active ? 'var(--emerald-dim)' : done ? 'rgba(16,185,129,0.08)' : 'transparent',
                    color: active ? 'var(--emerald)' : done ? 'var(--emerald-light)' : 'var(--text-muted)',
                    border: active ? '1px solid var(--emerald)' : '1px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    <Icon size={12} />
                    <span className="hide-mobile">{step.label}</span>
                  </div>
                  {idx < steps.length - 1 && (
                    <div style={{
                      width: 16, height: 1,
                      background: done ? 'var(--emerald)' : 'var(--border)',
                      transition: 'background 0.3s'
                    }} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Right actions */}
        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {user.email?.split('@')[0]}
            </span>
            <button
              onClick={handleSignOut}
              className="btn btn-ghost btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)' }}
            >
              <LogOut size={14} />
              <span className="hide-mobile">Sign out</span>
            </button>
          </div>
        ) : (
          <Link to="/login" className="btn btn-secondary btn-sm">Sign in</Link>
        )}
      </div>

      <style>{`.hide-mobile { } @media (max-width: 600px) { .hide-mobile { display: none; } }`}</style>
    </header>
  )
}
