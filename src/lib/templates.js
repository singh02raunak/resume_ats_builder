// ─── Template Metadata ────────────────────────────────────────

export const TEMPLATES = {
  classic: {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional ATS-safe layout trusted by Fortune 500 recruiters',
    tags: ['ATS-Safe', 'Universal'],
    previewColor: '#10b981',
    badge: null
  },
  modern: {
    id: 'modern',
    name: 'Modern',
    description: 'Clean design with indigo accents, ideal for tech and product roles',
    tags: ['Popular', 'Tech'],
    previewColor: '#6366f1',
    badge: 'Most Popular'
  },
  european: {
    id: 'european',
    name: 'European',
    description: 'Europass-inspired format widely accepted across EU job markets',
    tags: ['EU Jobs', 'International'],
    previewColor: '#0ea5e9',
    badge: null
  },
  executive: {
    id: 'executive',
    name: 'Executive',
    description: 'Bold, authoritative layout for senior management and leadership roles',
    tags: ['Senior', 'Leadership'],
    previewColor: '#1e3a5f',
    badge: null
  },
  minimal: {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean design that lets your content do all the talking',
    tags: ['Clean', 'Universal'],
    previewColor: '#64748b',
    badge: null
  },
  tech: {
    id: 'tech',
    name: 'Tech / Dev',
    description: 'Developer-focused with technical accents for engineering roles',
    tags: ['Engineering', 'Software'],
    previewColor: '#22c55e',
    badge: null
  },
  creative: {
    id: 'creative',
    name: 'Creative',
    description: 'Bold typography with amber accents for design and marketing roles',
    tags: ['Design', 'Marketing'],
    previewColor: '#f59e0b',
    badge: null
  },
  academic: {
    id: 'academic',
    name: 'Academic',
    description: 'Research-ready format for academia, R&D and PhD applications',
    tags: ['Research', 'Academia'],
    previewColor: '#8b5cf6',
    badge: null
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Conservative layout for finance, banking and consulting firms',
    tags: ['Finance', 'Banking'],
    previewColor: '#0369a1',
    badge: null
  },
  impact: {
    id: 'impact',
    name: 'Impact',
    description: 'Metrics-first design that spotlights your quantified achievements',
    tags: ['Metrics', 'Results'],
    previewColor: '#ef4444',
    badge: null
  }
}

// ─── Template Configs ─────────────────────────────────────────

const CONFIGS = {
  classic: {
    primary: [16, 185, 129],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 22, nameAlign: 'center',
    sectionStyle: 'underline',
    bodySize: 9.5, lineH: 5.5, sectionGap: 8,
    ml: 15, mr: 195
  },
  modern: {
    primary: [99, 102, 241],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 24, nameAlign: 'left',
    sectionStyle: 'leftbar',
    bodySize: 9, lineH: 5.2, sectionGap: 7,
    ml: 15, mr: 195
  },
  european: {
    primary: [14, 165, 233],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 20, nameAlign: 'left',
    sectionStyle: 'filled',
    bodySize: 9, lineH: 5.2, sectionGap: 7,
    ml: 15, mr: 195
  },
  executive: {
    primary: [30, 58, 95],
    dark: [15, 23, 42],
    muted: [80, 80, 80],
    nameSize: 26, nameAlign: 'center',
    sectionStyle: 'overline',
    bodySize: 9.5, lineH: 6, sectionGap: 9,
    ml: 20, mr: 190
  },
  minimal: {
    primary: [100, 116, 139],
    dark: [30, 30, 30],
    muted: [160, 160, 160],
    nameSize: 20, nameAlign: 'left',
    sectionStyle: 'minimal',
    bodySize: 9, lineH: 5.5, sectionGap: 10,
    ml: 20, mr: 190
  },
  tech: {
    primary: [34, 197, 94],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 20, nameAlign: 'left',
    sectionStyle: 'code',
    bodySize: 9, lineH: 5.2, sectionGap: 7,
    ml: 15, mr: 195
  },
  creative: {
    primary: [245, 158, 11],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 26, nameAlign: 'center',
    sectionStyle: 'underline',
    bodySize: 9.5, lineH: 5.5, sectionGap: 8,
    ml: 15, mr: 195
  },
  academic: {
    primary: [139, 92, 246],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 20, nameAlign: 'center',
    sectionStyle: 'filled',
    bodySize: 9, lineH: 5.5, sectionGap: 8,
    ml: 15, mr: 195
  },
  corporate: {
    primary: [3, 105, 161],
    dark: [15, 23, 42],
    muted: [80, 80, 80],
    nameSize: 22, nameAlign: 'center',
    sectionStyle: 'doubleunderline',
    bodySize: 9.5, lineH: 5.8, sectionGap: 8,
    ml: 15, mr: 195
  },
  impact: {
    primary: [239, 68, 68],
    dark: [15, 23, 42],
    muted: [100, 116, 139],
    nameSize: 24, nameAlign: 'left',
    sectionStyle: 'leftbar',
    bodySize: 9.5, lineH: 5.5, sectionGap: 8,
    ml: 15, mr: 195
  }
}

// ─── PDF Generator ────────────────────────────────────────────

export async function generateResumePDF(resumeData, templateId = 'classic') {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const cfg = CONFIGS[templateId] || CONFIGS.classic
  const pageW = 210
  let y = 20

  const checkBreak = (needed = 15) => {
    if (y + needed > 280) { doc.addPage(); y = 20 }
  }

  // ── Section Header ──
  const sectionHeader = (title) => {
    checkBreak(14)
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')

    switch (cfg.sectionStyle) {
      case 'underline':
        doc.setTextColor(...cfg.dark)
        doc.text(title, cfg.ml, y)
        y += 4
        doc.setDrawColor(...cfg.primary)
        doc.setLineWidth(0.6)
        doc.line(cfg.ml, y, cfg.mr, y)
        y += 5
        break

      case 'filled':
        doc.setFillColor(...cfg.primary)
        doc.rect(cfg.ml - 2, y - 5.5, cfg.mr - cfg.ml + 4, 7.5, 'F')
        doc.setTextColor(255, 255, 255)
        doc.text(title, cfg.ml, y)
        y += 6
        break

      case 'leftbar':
        doc.setFillColor(...cfg.primary)
        doc.rect(cfg.ml - 2, y - 5.5, 3, 8, 'F')
        doc.setTextColor(...cfg.dark)
        doc.text(title, cfg.ml + 5, y)
        y += 3
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.3)
        doc.line(cfg.ml, y, cfg.mr, y)
        y += 5
        break

      case 'overline':
        doc.setDrawColor(...cfg.primary)
        doc.setLineWidth(1.5)
        doc.line(cfg.ml, y - 4, cfg.mr, y - 4)
        doc.setLineWidth(0.3)
        doc.setTextColor(...cfg.dark)
        doc.text(title, cfg.ml, y)
        y += 3
        doc.setDrawColor(180, 180, 180)
        doc.line(cfg.ml, y, cfg.mr, y)
        y += 5
        break

      case 'minimal':
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(...cfg.muted)
        doc.text(title.toUpperCase(), cfg.ml, y)
        y += 3
        doc.setDrawColor(220, 220, 220)
        doc.setLineWidth(0.3)
        doc.line(cfg.ml, y, cfg.mr, y)
        y += 5
        break

      case 'code':
        doc.setFont('courier', 'bold')
        doc.setTextColor(...cfg.primary)
        doc.text('// ' + title, cfg.ml, y)
        doc.setFont('helvetica', 'normal')
        y += 3
        doc.setDrawColor(...cfg.primary)
        doc.setLineWidth(0.3)
        doc.line(cfg.ml, y, cfg.mr, y)
        y += 5
        break

      case 'doubleunderline':
        doc.setTextColor(...cfg.dark)
        doc.text(title, cfg.ml, y)
        y += 3.5
        doc.setDrawColor(...cfg.primary)
        doc.setLineWidth(1)
        doc.line(cfg.ml, y, cfg.mr, y)
        doc.setLineWidth(0.3)
        doc.line(cfg.ml, y + 1.8, cfg.mr, y + 1.8)
        y += 6
        break

      default:
        doc.setTextColor(...cfg.dark)
        doc.text(title, cfg.ml, y)
        y += 6
    }
  }

  // ── Header: Name ──
  doc.setFontSize(cfg.nameSize)
  doc.setFont('helvetica', 'bold')

  if (templateId === 'creative') {
    // Amber banner header
    doc.setFillColor(...cfg.primary)
    doc.rect(0, 0, pageW, 30, 'F')
    doc.setTextColor(255, 255, 255)
    doc.text(resumeData.name || 'Full Name', pageW / 2, 16, { align: 'center' })
    y = 24
  } else if (templateId === 'executive') {
    // Large centered name with thick primary line below
    doc.setTextColor(...cfg.dark)
    doc.text(resumeData.name || 'Full Name', pageW / 2, y, { align: 'center' })
    y += 6
    doc.setDrawColor(...cfg.primary)
    doc.setLineWidth(2)
    doc.line(cfg.ml, y, cfg.mr, y)
    y += 4
  } else if (cfg.nameAlign === 'center') {
    doc.setTextColor(...cfg.dark)
    doc.text(resumeData.name || 'Full Name', pageW / 2, y, { align: 'center' })
    y += 7
  } else {
    doc.setTextColor(...cfg.dark)
    doc.text(resumeData.name || 'Full Name', cfg.ml, y)
    y += 7
  }

  // ── Contact Info ──
  const contact = resumeData.contact || {}
  const parts = [contact.email, contact.phone, contact.location, contact.linkedin].filter(Boolean)
  doc.setFontSize(8.5)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(...cfg.muted)

  if (cfg.nameAlign === 'center' || templateId === 'creative') {
    const line = parts.join('  |  ')
    doc.text(line, pageW / 2, y, { align: 'center' })
  } else {
    const line = parts.join('  ·  ')
    doc.text(line, cfg.ml, y)
  }
  y += 5

  // Accent line below contact for classic/modern/tech/impact/minimal/corporate/academic
  if (!['creative', 'executive'].includes(templateId)) {
    doc.setDrawColor(...cfg.primary)
    doc.setLineWidth(0.6)
    doc.line(cfg.ml, y, cfg.mr, y)
    y += 6
  } else {
    y += 3
  }

  // ── Summary ──
  if (resumeData.summary) {
    sectionHeader('PROFESSIONAL SUMMARY')
    doc.setFontSize(cfg.bodySize)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const lines = doc.splitTextToSize(resumeData.summary, cfg.mr - cfg.ml)
    doc.text(lines, cfg.ml, y)
    y += lines.length * (cfg.lineH - 0.5) + cfg.sectionGap
  }

  // ── Experience ──
  if (resumeData.experience?.length) {
    sectionHeader('EXPERIENCE')
    for (const exp of resumeData.experience) {
      checkBreak(20)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cfg.dark)
      doc.text(exp.title || '', cfg.ml, y)
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cfg.muted)
      doc.text(exp.duration || '', cfg.mr, y, { align: 'right' })
      y += cfg.lineH - 1

      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(60, 60, 60)
      doc.text(`${exp.company || ''}${exp.location ? '  ·  ' + exp.location : ''}`, cfg.ml, y)
      y += cfg.lineH

      for (const bullet of (exp.bullets || [])) {
        checkBreak(8)
        doc.setFontSize(cfg.bodySize - 0.5)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(40, 40, 40)
        const bLines = doc.splitTextToSize('• ' + bullet, cfg.mr - cfg.ml - 3)
        doc.text(bLines, cfg.ml + 2, y)
        y += bLines.length * (cfg.lineH - 1)
      }
      y += 4
    }
    y += cfg.sectionGap - 4
  }

  // ── Education ──
  if (resumeData.education?.length) {
    sectionHeader('EDUCATION')
    for (const edu of resumeData.education) {
      checkBreak(12)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cfg.dark)
      doc.text(`${edu.degree || ''} in ${edu.field || ''}`, cfg.ml, y)
      doc.setFontSize(8.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(...cfg.muted)
      doc.text(edu.year || '', cfg.mr, y, { align: 'right' })
      y += cfg.lineH - 1
      doc.setFontSize(9)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(60, 60, 60)
      doc.text(`${edu.institution || ''}${edu.gpa ? '  ·  GPA: ' + edu.gpa : ''}`, cfg.ml, y)
      y += cfg.lineH + 2
    }
    y += cfg.sectionGap - 4
  }

  // ── Skills ──
  if (resumeData.skills) {
    sectionHeader('SKILLS')
    const rows = [
      resumeData.skills.technical?.length && { label: 'Technical', items: resumeData.skills.technical },
      resumeData.skills.tools?.length && { label: 'Tools', items: resumeData.skills.tools },
      resumeData.skills.soft?.length && { label: 'Soft Skills', items: resumeData.skills.soft }
    ].filter(Boolean)

    for (const row of rows) {
      checkBreak(8)
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cfg.dark)
      doc.text(`${row.label}: `, cfg.ml, y)
      const lw = doc.getTextWidth(`${row.label}: `)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      const skillLines = doc.splitTextToSize(row.items.join(' · '), cfg.mr - cfg.ml - lw)
      doc.text(skillLines, cfg.ml + lw, y)
      y += skillLines.length * cfg.lineH
    }
    y += cfg.sectionGap - 2
  }

  // ── Certifications ──
  if (resumeData.certifications?.length) {
    sectionHeader('CERTIFICATIONS')
    for (const cert of resumeData.certifications) {
      checkBreak(6)
      doc.setFontSize(cfg.bodySize - 0.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      doc.text('• ' + cert, cfg.ml + 2, y)
      y += cfg.lineH
    }
    y += cfg.sectionGap - 2
  }

  // ── Projects ──
  if (resumeData.projects?.length) {
    sectionHeader('PROJECTS')
    for (const proj of resumeData.projects) {
      checkBreak(12)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(...cfg.dark)
      doc.text(proj.name || '', cfg.ml, y)
      y += cfg.lineH - 1
      doc.setFontSize(cfg.bodySize - 0.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      const dLines = doc.splitTextToSize(proj.description || '', cfg.mr - cfg.ml)
      doc.text(dLines, cfg.ml, y)
      y += dLines.length * (cfg.lineH - 1)
      if (proj.tech?.length) {
        doc.setTextColor(...cfg.muted)
        doc.text('Tech: ' + proj.tech.join(', '), cfg.ml, y)
        y += cfg.lineH
      }
      y += 3
    }
  }

  return doc
}
