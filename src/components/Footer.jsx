import { FileText } from 'lucide-react'

export default function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid var(--border)',
      padding: '32px 0',
      marginTop: 'auto'
    }}>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--emerald)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={13} color="#000" />
          </div>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 15, color: 'var(--text)' }}>
            Resume<span style={{ color: 'var(--emerald)' }}>ATS</span>
          </span>
        </div>
        <p style={{ color: 'var(--text-muted)', fontSize: 13 }}>
          © {new Date().getFullYear()} ResumeATS · Built with ♥ for Indian job seekers
        </p>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Refunds', 'Contact'].map(item => (
            <a key={item} href="#" style={{ color: 'var(--text-muted)', fontSize: 13, transition: 'color 0.2s' }}
               onMouseEnter={e => e.target.style.color = 'var(--text)'}
               onMouseLeave={e => e.target.style.color = 'var(--text-muted)'}>
              {item}
            </a>
          ))}
        </div>
      </div>
    </footer>
  )
}
