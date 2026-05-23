const CLAUDE_API_URL = 'https://api.anthropic.com/v1/messages'
const CLAUDE_MODEL = 'claude-sonnet-4-5'
const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY

async function callClaude(messages, systemPrompt, maxTokens = 4000) {
  const response = await fetch(CLAUDE_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
      'anthropic-dangerous-direct-browser-access': 'true'
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: maxTokens,
      system: systemPrompt,
      messages
    })
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(err?.error?.message || 'Claude API error')
  }

  const data = await response.json()
  return data.content[0].text
}

// ─── ATS Analysis ─────────────────────────────────────────────

export async function analyzeResume(resumeText, jobDescription = '') {
  const jdContext = jobDescription
    ? `\n\nJob Description to match against:\n${jobDescription}`
    : ''

  const systemPrompt = `You are a strict ATS (Applicant Tracking System) scoring engine. Score resumes exactly as a real ATS would — harshly and consistently.

STRICT SCORING RULES:
- Most resumes score 40-72. A score above 85 requires near-perfect formatting, keywords, and content.
- A score of 90+ is extremely rare and only for flawless resumes. 100 is impossible.
- YOUR atsScore MUST exactly equal the sum of all scoreBreakdown scores. Never inflate.

Deduction rules per category:
- keywords (0-20): -3 if no job description provided (max 14/20), -2 per missing industry keyword, -3 for generic/vague language
- formatting (0-20): -5 for tables/columns/graphics, -3 for special characters in headers, -2 for non-standard bullets, -4 for creative layouts
- workExperience (0-20): -3 per role with no quantified achievement, -2 for vague bullets, -4 for unexplained gaps, -2 for no action verbs
- education (0-15): -3 for missing year, -2 for vague degree name, -2 for missing institution location
- skills (0-15): -3 for no categorization, -2 for missing proficiency context, -3 for no technical skills in tech roles
- contactInfo (0-10): -2 for missing LinkedIn, -2 for missing location, -3 for missing phone, -2 for unprofessional email

Calculate each category score first, sum them up, that sum IS the atsScore. No rounding up.

You must respond ONLY with a valid JSON object — no markdown, no explanation, no code fences. The JSON must exactly match this structure:

{
  "atsScore": <number 0-100>,
  "scoreBreakdown": {
    "keywords": { "score": <0-20>, "max": 20, "feedback": "<string>" },
    "formatting": { "score": <0-20>, "max": 20, "feedback": "<string>" },
    "workExperience": { "score": <0-20>, "max": 20, "feedback": "<string>" },
    "education": { "score": <0-15>, "max": 15, "feedback": "<string>" },
    "skills": { "score": <0-15>, "max": 15, "feedback": "<string>" },
    "contactInfo": { "score": <0-10>, "max": 10, "feedback": "<string>" }
  },
  "topIssues": [
    { "severity": "critical|high|medium", "issue": "<string>", "fix": "<string>" }
  ],
  "allSuggestions": [
    { "category": "<string>", "suggestion": "<string>", "impact": "high|medium|low" }
  ],
  "missingKeywords": ["<keyword>"],
  "strengths": ["<string>"],
  "summary": "<2-3 sentence overall assessment>"
}`

  const text = await callClaude(
    [{ role: 'user', content: `Analyze this resume for ATS compatibility:${jdContext}\n\nRESUME:\n${resumeText}` }],
    systemPrompt,
    4000
  )

  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    const match = cleaned.match(/\{[\s\S]*\}/)
    if (!match) throw new Error('No JSON found')
    return JSON.parse(match[0])
  } catch (e) {
    console.error('Raw Claude response:', text)
    throw new Error('Failed to parse ATS analysis. Please try again.')
  }
}

// ─── Resume Improvement ───────────────────────────────────────

export async function improveResume(resumeText, analysis, jobDescription = '', plan = 'standard', templateId = 'classic') {
  const jdContext = jobDescription
    ? `\n\nTarget Job Description:\n${jobDescription}`
    : ''

  const templateAtsNote = ['creative', 'academic'].includes(templateId)
    ? 'Note: the selected template uses structured section headers — ensure content is plain text with no special characters or tables.'
    : templateId === 'minimal'
    ? 'Note: the selected template is minimal — keep content concise and impactful.'
    : 'Note: the selected template is ATS-safe single-column — optimise freely.'

  const planInstructions = {
    standard: `Rewrite the resume targeting a final ATS score of 80-89 (not 90+, not 100). Fix the identified issues, add missing keywords naturally, improve bullet points with action verbs and 1-2 quantified achievements per role. ${templateAtsNote}`,
    premium: `Do a complete professional overhaul targeting a final ATS score of 90-95 (never 96+). Fix ALL issues, inject keywords strategically throughout, rewrite every bullet with strong action verbs and quantified achievements, craft a compelling summary, restructure sections for maximum ATS impact. ${templateAtsNote}`
  }

  const systemPrompt = `You are an expert resume writer and ATS optimization specialist. ${planInstructions[plan]}

Respond ONLY with a valid JSON object with this exact structure — no markdown, no code fences:

{
  "improvedResume": {
    "name": "<full name>",
    "contact": {
      "email": "<email>",
      "phone": "<phone>",
      "location": "<city, state>",
      "linkedin": "<linkedin url or empty string>",
      "portfolio": "<portfolio url or empty string>"
    },
    "summary": "<professional summary paragraph>",
    "experience": [
      {
        "company": "<company name>",
        "title": "<job title>",
        "duration": "<start - end>",
        "location": "<city, state>",
        "bullets": ["<achievement bullet>", "..."]
      }
    ],
    "education": [
      {
        "institution": "<name>",
        "degree": "<degree>",
        "field": "<field of study>",
        "year": "<graduation year>",
        "gpa": "<gpa or empty string>"
      }
    ],
    "skills": {
      "technical": ["<skill>"],
      "soft": ["<skill>"],
      "tools": ["<tool>"]
    },
    "certifications": ["<cert name and year>"],
    "projects": [
      {
        "name": "<project name>",
        "description": "<one line description>",
        "tech": ["<tech used>"]
      }
    ]
  },
  "changesMade": ["<description of change made>"],
  "keywordsAdded": ["<keyword>"],
  "estimatedNewScore": <number 0-100>
}`

  const issuesList = analysis.topIssues.map(i => `- ${i.issue}: ${i.fix}`).join('\n')
  const keywordsList = analysis.missingKeywords.join(', ')

  const text = await callClaude(
    [{
      role: 'user',
      content: `Improve this resume. Key issues to fix:\n${issuesList}\n\nMissing keywords to add: ${keywordsList}${jdContext}\n\nORIGINAL RESUME:\n${resumeText}`
    }],
    systemPrompt,
    4000
  )

  try {
    const cleaned = text.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned)
  } catch (e) {
    throw new Error('Failed to generate improved resume. Please try again.')
  }
}

// ─── Cover Letter Generator (Premium plan) ────────────────────

export async function generateCoverLetter(resumeData, jobDescription, companyName = '') {
  const systemPrompt = `You are an expert cover letter writer. Write a compelling, personalized cover letter. 
Respond with ONLY the cover letter text — no JSON, no markdown formatting, no explanation.
Keep it to 3-4 paragraphs. Make it genuine, not generic.`

  const text = await callClaude(
    [{
      role: 'user',
      content: `Write a cover letter for this candidate applying to ${companyName || 'this company'}.\n\nCandidate: ${resumeData.name}\nSummary: ${resumeData.summary}\nKey Skills: ${[...(resumeData.skills?.technical || []), ...(resumeData.skills?.soft || [])].join(', ')}\n\nJob Description:\n${jobDescription || 'Not provided — write a general cover letter'}`
    }],
    systemPrompt,
    1200
  )

  return text
}

// ─── LinkedIn Bio Generator (Professional + Premium) ──────────

export async function generateLinkedInBio(resumeData) {
  const systemPrompt = `You are a LinkedIn optimization expert. Write a compelling LinkedIn "About" section.
Respond with ONLY the bio text — no JSON, no markdown, no explanation.
Max 2000 characters. Use first person. Include relevant keywords. End with a CTA.`

  const text = await callClaude(
    [{
      role: 'user',
      content: `Write a LinkedIn About section for: ${resumeData.name}\n\nSummary: ${resumeData.summary}\nExperience: ${resumeData.experience?.map(e => `${e.title} at ${e.company}`).join(', ')}\nSkills: ${[...(resumeData.skills?.technical || []), ...(resumeData.skills?.tools || [])].join(', ')}`
    }],
    systemPrompt,
    800
  )

  return text
}
