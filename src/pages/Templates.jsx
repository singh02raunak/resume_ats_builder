import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResume } from '../context/ResumeContext'
import { TEMPLATES } from '../lib/templates'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { CheckCircle2, ArrowRight } from 'lucide-react'

function TemplateThumbnail({ template }) {
  const c = template.previewColor
  const isFilledHeader = ['european', 'academic'].includes(template.id)
  const isLeftBar = ['modern', 'impact'].includes(template.id)
  const isCode = template.id === 'tech'
  const isCreative = template.id === 'creative'
  const isCorp = template.id === 'corporate'
  const isExec = template.id === 'executive'
  const isMinimal = template.id === 'minimal'

  return (
    <div style={{
      background: '#ffffff', borderRadius: 4, padding: '10px 10px 8px',
      width: '100%', aspectRatio: '0.707',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      overflow: 'hidden', position: 'relative'
    }}>
      {/* Name area */}
      {isCreative ? (
        <div style={{ background: c, padding: '6px 4px', marginBottom: 5, textAlign: 'center' }}>
          <div style={{ height: 4, background: 'rgba(255,255,255,0.9)', borderRadius: 2, width: '55%', margin: '0 auto 2px' }} />
          <div style={{ height: 2, background: 'rgba(255,255,255,0.5)', borderRadius: 1, width: '80%', margin: '0 auto' }} />
        </div>
      ) : (
        <div style={{ marginBottom: 6, textAlign: isExec || ['classic', 'creative', 'academic', 'corporate'].includes(template.id) ? 'center' : 'left' }}>
          <div style={{
            height: 4, borderRadius: 2, marginBottom: 2,
            width: isExec ? '60%' : '50%',
            background: '#1e293b',
            margin: isExec || ['classic', 'academic', 'corporate'].includes(template.id) ? '0 auto 2px' : '0 0 2px 0'
          }} />
          <div style={{
            height: 2, borderRadius: 1, width: '80%', background: '#94a3b8',
            margin: ['classic', 'academic', 'corporate', 'executive'].includes(template.id) ? '0 auto' : '0'
          }} />
          {isExec && <div style={{ height: 1.5, background: c, marginTop: 3, borderRadius: 1 }} />}
        </div>
      )}

      {/* Accent line (non-creative, non-exec) */}
      {!isCreative && !isExec && (
        <div style={{ height: 1.5, background: c, borderRadius: 1, marginBottom: 6 }} />
      )}

      {/* 3 mock sections */}
      {['EXPERIENCE', 'EDUCATION', 'SKILLS'].map((sec, i) => (
        <div key={sec} style={{ marginBottom: i < 2 ? 8 : 0 }}>
          {/* Section header */}
          {isFilledHeader ? (
            <div style={{ background: c, padding: '2px 3px', marginBottom: 3, borderRadius: 1 }}>
              <div style={{ height: 2, background: 'rgba(255,255,255,0.9)', borderRadius: 1, width: '40%' }} />
            </div>
          ) : isLeftBar ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, marginBottom: 3 }}>
              <div style={{ width: 2.5, height: 8, background: c, borderRadius: 1, flexShrink: 0 }} />
              <div style={{ height: 2, background: '#1e293b', borderRadius: 1, width: '35%' }} />
            </div>
          ) : isCode ? (
            <div style={{ marginBottom: 3 }}>
              <div style={{ height: 2, background: c, borderRadius: 1, width: '45%' }} />
              <div style={{ height: 1, background: c, opacity: 0.3, marginTop: 1 }} />
            </div>
          ) : isCorp ? (
            <div style={{ marginBottom: 3 }}>
              <div style={{ height: 2, background: '#1e293b', borderRadius: 1, width: '40%', marginBottom: 1 }} />
              <div style={{ height: 1, background: c, borderRadius: 1 }} />
              <div style={{ height: 0.5, background: '#94a3b8', borderRadius: 1, marginTop: 0.5 }} />
            </div>
          ) : isMinimal ? (
            <div style={{ marginBottom: 3 }}>
              <div style={{ height: 1.5, background: '#94a3b8', borderRadius: 1, width: '35%', marginBottom: 1 }} />
              <div style={{ height: 0.5, background: '#e2e8f0' }} />
            </div>
          ) : (
            <div style={{ marginBottom: 3 }}>
              <div style={{ height: 2, background: '#1e293b', borderRadius: 1, width: '40%', marginBottom: 1 }} />
              <div style={{ height: 1, background: c, borderRadius: 1 }} />
            </div>
          )}

          {/* Mock content lines */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: isLeftBar ? 4 : 0 }}>
            <div style={{ height: 1.5, background: '#374151', borderRadius: 1, width: '65%' }} />
            <div style={{ height: 1.5, background: '#9ca3af', borderRadius: 1, width: '85%' }} />
            <div style={{ height: 1.5, background: '#9ca3af', borderRadius: 1, width: '75%' }} />
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Templates() {
  const navigate = useNavigate()
  const { analysis, setSelectedTemplate } = useResume()
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  if (!analysis) {
    navigate('/upload', { replace: true })
    return null
  }

  function handleSelect(templateId) {
    setSelected(templateId)
    setSelectedTemplate(templateId)
    setTimeout(() => navigate('/payment'), 300)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg)' }}>
      <Header />

      <main style={{ flex: 1, padding: '48px 0' }}>
        <div className="container" style={{ maxWidth: 1100 }}>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h1 style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', marginBottom: 12 }}>
              Choose Your Resume Template
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 15, maxWidth: 560, margin: '0 auto' }}>
              Your AI-improved resume will be built using the template you select.
              All templates are ATS-compatible.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 20
          }}>
            {Object.values(TEMPLATES).map((tmpl) => {
              const isHovered = hovered === tmpl.id
              const isSelected = selected === tmpl.id

              return (
                <div
                  key={tmpl.id}
                  onMouseEnter={() => setHovered(tmpl.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => handleSelect(tmpl.id)}
                  style={{
                    background: 'var(--bg-card)',
                    border: `1.5px solid ${isSelected ? tmpl.previewColor : isHovered ? 'var(--border-light)' : 'var(--border)'}`,
                    borderRadius: 'var(--radius-lg)',
                    padding: 16,
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s, border-color 0.2s',
                    transform: isHovered || isSelected ? 'translateY(-4px)' : 'translateY(0)',
                    boxShadow: isSelected
                      ? `0 0 32px ${tmpl.previewColor}30`
                      : isHovered
                      ? '0 16px 48px rgba(0,0,0,0.3)'
                      : 'none',
                    position: 'relative'
                  }}
                >
                  {/* Badge */}
                  {tmpl.badge && (
                    <div style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      padding: '3px 12px', borderRadius: 999,
                      background: tmpl.previewColor, color: '#000',
                      fontSize: 9, fontWeight: 800, whiteSpace: 'nowrap'
                    }}>
                      ★ {tmpl.badge}
                    </div>
                  )}

                  {/* Selected check */}
                  {isSelected && (
                    <div style={{
                      position: 'absolute', top: 10, right: 10, zIndex: 2,
                      background: tmpl.previewColor, borderRadius: '50%', padding: 2
                    }}>
                      <CheckCircle2 size={14} color="#000" />
                    </div>
                  )}

                  {/* Thumbnail */}
                  <div style={{ marginBottom: 12 }}>
                    <TemplateThumbnail template={tmpl} />
                  </div>

                  {/* Info */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: tmpl.previewColor, flexShrink: 0 }} />
                      <h3 style={{ fontSize: 14, fontWeight: 700 }}>{tmpl.name}</h3>
                    </div>
                    <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 8 }}>
                      {tmpl.description}
                    </p>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                      {tmpl.tags.map(tag => (
                        <span key={tag} style={{
                          fontSize: 9, padding: '2px 7px', borderRadius: 999,
                          background: 'var(--bg-muted)', border: '1px solid var(--border)',
                          color: 'var(--text-muted)', fontFamily: 'var(--font-mono)'
                        }}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Select button on hover */}
                  {isHovered && !isSelected && (
                    <div style={{
                      position: 'absolute', inset: 0, borderRadius: 'var(--radius-lg)',
                      background: 'rgba(0,0,0,0.5)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <div style={{
                        background: tmpl.previewColor, color: '#000',
                        padding: '8px 18px', borderRadius: 8,
                        fontSize: 13, fontWeight: 700,
                        display: 'flex', alignItems: 'center', gap: 6
                      }}>
                        Select <ArrowRight size={13} />
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
