// ─── Razorpay Payment ─────────────────────────────────────────

export const PLANS = {
  standard: {
    id: 'standard',
    name: 'ATS Rewrite',
    price: 2000,
    priceDisplay: '₹2,000',
    description: 'AI-rewritten resume optimised for 80+ ATS score',
    features: [
      'Full ATS score breakdown',
      'AI resume rewrite & keyword fix',
      '80+ ATS score target',
      'Formatting & structure fix',
      'Download as PDF + ZIP'
    ],
    color: '#10b981',
    popular: false
  },
  premium: {
    id: 'premium',
    name: 'Premium Rewrite',
    price: 2500,
    priceDisplay: '₹2,500',
    description: 'Deep optimisation with 90+ ATS score guarantee',
    features: [
      'Everything in ATS Rewrite',
      '90+ ATS score guarantee',
      'Metrics-enhanced bullet points',
      'Complete resume restructure',
      'Job-targeted keyword injection'
    ],
    color: '#6366f1',
    popular: true
  }
}

export function loadRazorpay() {
  return new Promise((resolve) => {
    if (window.Razorpay) return resolve(true)
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function initiatePayment({ plan, userEmail, userName, analysisId, onSuccess, onFailure }) {
  const loaded = await loadRazorpay()
  if (!loaded) {
    onFailure?.('Failed to load payment gateway. Please check your connection.')
    return
  }

  const selectedPlan = PLANS[plan]

  const options = {
    key: import.meta.env.VITE_RAZORPAY_KEY_ID,
    amount: selectedPlan.price * 100, // paise
    currency: 'INR',
    name: 'ResumeATS',
    description: selectedPlan.name,
    image: '/favicon.svg',
    prefill: {
      email: userEmail || '',
      name: userName || ''
    },
    theme: { color: selectedPlan.color },
    handler: function (response) {
      onSuccess?.({
        paymentId: response.razorpay_payment_id,
        plan,
        amount: selectedPlan.price,
        analysisId
      })
    },
    modal: {
      ondismiss: () => onFailure?.('Payment cancelled')
    }
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    onFailure?.(response.error.description)
  })
  rzp.open()
}

// ─── Resume Text Extraction ────────────────────────────────────

export async function extractTextFromFile(file) {
  const ext = file.name.split('.').pop().toLowerCase()

  if (ext === 'pdf') {
    return extractFromPDF(file)
  } else if (ext === 'docx' || ext === 'doc') {
    return extractFromDOCX(file)
  } else if (ext === 'txt') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = (e) => resolve(e.target.result)
      reader.onerror = () => reject(new Error('Failed to read text file'))
      reader.readAsText(file)
    })
  }
  throw new Error('Unsupported file format. Please upload PDF, DOCX, or TXT.')
}

async function extractFromPDF(file) {
  const { getDocument, GlobalWorkerOptions } = await import('pdfjs-dist')
  GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise
  let fullText = ''

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map((item) => item.str).join(' ')
    fullText += pageText + '\n'
  }

  return fullText.trim()
}

async function extractFromDOCX(file) {
  const mammoth = await import('mammoth')
  const arrayBuffer = await file.arrayBuffer()
  const result = await mammoth.extractRawText({ arrayBuffer })
  return result.value.trim()
}

// ─── PDF Generation (delegated to templates.js) ──────────────
export { generateResumePDF } from './templates'

// (old generateResumePDF removed — now lives in templates.js)

async function _unusedPDFGenerator(resumeData) {
  const { jsPDF } = await import('jspdf')
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })

  const marginL = 15
  const marginR = 195
  const pageW = 210
  let y = 20

  const lineH = 6
  const sectionGap = 8

  // Helper functions
  const addText = (text, x, fontSize, style = 'normal', color = [20, 20, 20]) => {
    doc.setFontSize(fontSize)
    doc.setFont('helvetica', style)
    doc.setTextColor(...color)
    doc.text(text || '', x, y)
  }

  const addLine = (color = [200, 200, 200]) => {
    doc.setDrawColor(...color)
    doc.line(marginL, y, marginR, y)
    y += 3
  }

  const checkPageBreak = (needed = 15) => {
    if (y + needed > 280) {
      doc.addPage()
      y = 20
    }
  }

  // ── Header ──
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(15, 23, 42)
  doc.text(resumeData.name || 'Full Name', pageW / 2, y, { align: 'center' })
  y += 8

  const contactParts = [
    resumeData.contact?.email,
    resumeData.contact?.phone,
    resumeData.contact?.location,
    resumeData.contact?.linkedin
  ].filter(Boolean)

  doc.setFontSize(9)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(80, 80, 80)
  doc.text(contactParts.join('  |  '), pageW / 2, y, { align: 'center' })
  y += 6

  addLine([16, 185, 129]) // emerald line
  y += 2

  // ── Summary ──
  if (resumeData.summary) {
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('PROFESSIONAL SUMMARY', marginL, y)
    y += 5
    addLine()

    doc.setFontSize(9.5)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(40, 40, 40)
    const summaryLines = doc.splitTextToSize(resumeData.summary, marginR - marginL)
    doc.text(summaryLines, marginL, y)
    y += summaryLines.length * 5 + sectionGap
  }

  // ── Experience ──
  if (resumeData.experience?.length) {
    checkPageBreak()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('EXPERIENCE', marginL, y)
    y += 5
    addLine()

    for (const exp of resumeData.experience) {
      checkPageBreak(20)
      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(exp.title || '', marginL, y)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(exp.duration || '', marginR, y, { align: 'right' })
      y += lineH - 1

      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(60, 60, 60)
      doc.text(`${exp.company || ''}${exp.location ? '  ·  ' + exp.location : ''}`, marginL, y)
      y += lineH

      for (const bullet of (exp.bullets || [])) {
        checkPageBreak(8)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        doc.setTextColor(40, 40, 40)
        const bulletLines = doc.splitTextToSize('• ' + bullet, marginR - marginL - 3)
        doc.text(bulletLines, marginL + 2, y)
        y += bulletLines.length * 4.5
      }
      y += 4
    }
    y += sectionGap - 4
  }

  // ── Education ──
  if (resumeData.education?.length) {
    checkPageBreak()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('EDUCATION', marginL, y)
    y += 5
    addLine()

    for (const edu of resumeData.education) {
      checkPageBreak(12)
      doc.setFontSize(10.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(`${edu.degree || ''} in ${edu.field || ''}`, marginL, y)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(100, 100, 100)
      doc.text(edu.year || '', marginR, y, { align: 'right' })
      y += lineH - 1
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'italic')
      doc.setTextColor(60, 60, 60)
      doc.text(`${edu.institution || ''}${edu.gpa ? '  ·  GPA: ' + edu.gpa : ''}`, marginL, y)
      y += lineH + 2
    }
    y += sectionGap - 4
  }

  // ── Skills ──
  if (resumeData.skills) {
    checkPageBreak()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('SKILLS', marginL, y)
    y += 5
    addLine()

    const skillRows = [
      resumeData.skills.technical?.length && { label: 'Technical', items: resumeData.skills.technical },
      resumeData.skills.tools?.length && { label: 'Tools', items: resumeData.skills.tools },
      resumeData.skills.soft?.length && { label: 'Soft Skills', items: resumeData.skills.soft }
    ].filter(Boolean)

    for (const row of skillRows) {
      checkPageBreak(8)
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(`${row.label}: `, marginL, y)
      const labelW = doc.getTextWidth(`${row.label}: `)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      const skillText = row.items.join(' · ')
      const skillLines = doc.splitTextToSize(skillText, marginR - marginL - labelW)
      doc.text(skillLines, marginL + labelW, y)
      y += skillLines.length * 5
    }
    y += sectionGap - 2
  }

  // ── Certifications ──
  if (resumeData.certifications?.length) {
    checkPageBreak()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('CERTIFICATIONS', marginL, y)
    y += 5
    addLine()

    for (const cert of resumeData.certifications) {
      checkPageBreak(6)
      doc.setFontSize(9.5)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      doc.text('• ' + cert, marginL + 2, y)
      y += lineH
    }
    y += sectionGap - 2
  }

  // ── Projects ──
  if (resumeData.projects?.length) {
    checkPageBreak()
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(15, 23, 42)
    doc.text('PROJECTS', marginL, y)
    y += 5
    addLine()

    for (const project of resumeData.projects) {
      checkPageBreak(12)
      doc.setFontSize(10)
      doc.setFont('helvetica', 'bold')
      doc.setTextColor(15, 23, 42)
      doc.text(project.name || '', marginL, y)
      y += lineH - 1
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(40, 40, 40)
      const desc = doc.splitTextToSize(project.description || '', marginR - marginL)
      doc.text(desc, marginL, y)
      y += desc.length * 4.5
      if (project.tech?.length) {
        doc.setTextColor(80, 80, 80)
        doc.text('Tech: ' + project.tech.join(', '), marginL, y)
        y += lineH
      }
      y += 3
    }
  }

  return doc
}

// ─── ZIP File Creator ─────────────────────────────────────────

export async function createDownloadZip({ resumeData, coverLetter, linkedInBio, plan, originalText, templateId = 'classic' }) {
  const JSZip = (await import('jszip')).default

  const zip = new JSZip()
  const folder = zip.folder('ResumeATS_Package')

  const { generateResumePDF } = await import('./templates')
  const doc = await generateResumePDF(resumeData, templateId)
  const pdfBlob = doc.output('blob')
  folder.file('improved_resume.pdf', pdfBlob)

  // Add cover letter if available
  if (coverLetter) {
    folder.file('cover_letter.txt', coverLetter)
  }

  // Add LinkedIn bio if available
  if (linkedInBio) {
    folder.file('linkedin_bio.txt', linkedInBio)
  }

  // Add original resume text
  if (originalText) {
    folder.file('original_resume_text.txt', originalText)
  }

  // Add a README
  const readmeContent = `ResumeATS Package
=================
Generated by ResumeATS (https://resumeats.in)
Plan: ${plan.toUpperCase()}
Date: ${new Date().toLocaleDateString('en-IN')}

Files in this package:
- improved_resume.pdf      → Your ATS-optimized resume
${coverLetter ? '- cover_letter.txt         → Tailored cover letter\n' : ''}${linkedInBio ? '- linkedin_bio.txt          → LinkedIn About section\n' : ''}- original_resume_text.txt → Original resume (plain text backup)

Tips for using your improved resume:
1. Upload to job portals as PDF
2. Paste plain text version when copy-paste is required
3. Customize the cover letter for each application
4. Update LinkedIn About section with the provided bio

Good luck with your applications! 🚀
`
  folder.file('README.txt', readmeContent)

  const zipBlob = await zip.generateAsync({ type: 'blob', compression: 'DEFLATE' })
  return zipBlob
}

// ─── Download Trigger ─────────────────────────────────────────

export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
