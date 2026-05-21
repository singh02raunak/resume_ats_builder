import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function ResumeCard({ data, label, highlight }) {
  if (!data) return null

  return (
    <div style={{
      background: 'var(--bg)',
      border: `1px solid ${highlight ? 'var(--emerald)' : 'var(--border)'}`,
      borderRadius: 'var(--radius)',
      padding: '24px',
      flex: 1,
      minWidth: 0,
      position: 'relative',
      overflow: 'hidden'
    }}>
      {highlight && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: 'linear-gradient(90deg, var(--emerald), var(--emerald-light))'
        }} />
      )}
      <div style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '3px 10px', borderRadius: 999, marginBottom: 16,
        background: highlight ? 'var(--emerald-dim)' : 'var(--bg-muted)',
        border: `1px solid ${highlight ? 'var(--emerald)' : 'var(--border)'}`,
        fontSize: 11, fontWeight: 700, fontFamily: 'var(--font-mono)',
        color: highlight ? 'var(--emerald)' : 'var(--text-muted)',
        textTransform: 'uppercase', letterSpacing: '0.06em'
      }}>
        {highlight ? '✦ ' : ''}{label}
      </div>

      {/* Resume Preview Render */}
      <div style={{
        fontFamily: 'Georgia, serif',
        fontSize: 11,
        lineHeight: 1.5,
        color: '#1a1a1a',
        background: '#ffffff',
        borderRadius: 8,
        padding: '20px 18px',
        maxHeight: 480,
        overflowY: 'auto',
        boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
      }}>
        {/* Name */}
        <div style={{ textAlign: 'center', borderBottom: '2px solid #10b981', paddingBottom: 10, marginBottom: 10 }}>
          <h2 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 17, fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>
            {data.name || 'Full Name'}
          </h2>
          <p style={{ fontSize: 9.5, color: '#475569' }}>
            {[data.contact?.email, data.contact?.phone, data.contact?.location, data.contact?.linkedin]
              .filter(Boolean).join('  ·  ')}
          </p>
        </div>

        {/* Summary */}
        {data.summary && (
          <section style={{ marginBottom: 10 }}>
            <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 5 }}>
              Summary
            </h3>
            <p style={{ fontSize: 10, color: '#334155' }}>{data.summary}</p>
          </section>
        )}

        {/* Experience */}
        {data.experience?.length > 0 && (
          <section style={{ marginBottom: 10 }}>
            <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 5 }}>
              Experience
            </h3>
            {data.experience.map((exp, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <strong style={{ fontSize: 10.5, color: '#0f172a' }}>{exp.title}</strong>
                    <div style={{ fontSize: 9.5, color: '#475569', fontStyle: 'italic' }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                  </div>
                  <span style={{ fontSize: 9, color: '#94a3b8', whiteSpace: 'nowrap', marginLeft: 8 }}>{exp.duration}</span>
                </div>
                <ul style={{ paddingLeft: 14, marginTop: 3 }}>
                  {exp.bullets?.slice(0, 3).map((b, j) => (
                    <li key={j} style={{ fontSize: 9.5, color: '#334155', marginBottom: 2 }}>{b}</li>
                  ))}
                </ul>
              </div>
            ))}
          </section>
        )}

        {/* Skills */}
        {data.skills && (
          <section style={{ marginBottom: 10 }}>
            <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 5 }}>
              Skills
            </h3>
            {data.skills.technical?.length > 0 && (
              <p style={{ fontSize: 9.5, color: '#334155', marginBottom: 3 }}>
                <strong>Technical:</strong> {data.skills.technical.join(', ')}
              </p>
            )}
            {data.skills.tools?.length > 0 && (
              <p style={{ fontSize: 9.5, color: '#334155', marginBottom: 3 }}>
                <strong>Tools:</strong> {data.skills.tools.join(', ')}
              </p>
            )}
          </section>
        )}

        {/* Education */}
        {data.education?.length > 0 && (
          <section>
            <h3 style={{ fontFamily: 'Helvetica, Arial, sans-serif', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#0f172a', borderBottom: '1px solid #e2e8f0', paddingBottom: 3, marginBottom: 5 }}>
              Education
            </h3>
            {data.education.map((edu, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  <strong style={{ fontSize: 10, color: '#0f172a' }}>{edu.degree} in {edu.field}</strong>
                  <div style={{ fontSize: 9.5, color: '#475569', fontStyle: 'italic' }}>{edu.institution}</div>
                </div>
                <span style={{ fontSize: 9, color: '#94a3b8' }}>{edu.year}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  )
}

export default function ResumePreview({ original, improved }) {
  const [view, setView] = useState('both') // 'both' | 'original' | 'improved'

  return (
    <div>
      {/* View Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, justifyContent: 'center' }}>
        {[
          { key: 'original', label: 'Original' },
          { key: 'both', label: 'Side by Side' },
          { key: 'improved', label: 'Improved' }
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)}
            className="btn btn-sm"
            style={{
              background: view === key ? 'var(--emerald)' : 'var(--bg-card)',
              color: view === key ? '#000' : 'var(--text-muted)',
              border: '1px solid',
              borderColor: view === key ? 'var(--emerald)' : 'var(--border)'
            }}>
            {label}
          </button>
        ))}
      </div>

      {/* Preview Area */}
      <div style={{
        display: 'flex',
        gap: 16,
        alignItems: 'flex-start'
      }}>
        {(view === 'original' || view === 'both') && (
          <ResumeCard data={original} label="Original" highlight={false} />
        )}
        {(view === 'improved' || view === 'both') && (
          <ResumeCard data={improved} label="AI Improved" highlight={true} />
        )}
      </div>
    </div>
  )
}
