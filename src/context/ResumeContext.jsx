import { createContext, useContext, useState, useEffect } from 'react'
import { useAuth } from './AuthContext'
import { getLatestAnalysis } from '../lib/supabase'

const ResumeContext = createContext(null)

export function ResumeProvider({ children }) {
  const { user } = useAuth()

  const [resumeFile, setResumeFile] = useState(null)
  const [resumeText, setResumeText] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [improvedResume, setImprovedResume] = useState(null)
  const [coverLetter, setCoverLetter] = useState(null)
  const [linkedInBio, setLinkedInBio] = useState(null)
  const [analysisId, setAnalysisId] = useState(null)
  const [paymentDone, setPaymentDone] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [selectedTemplate, setSelectedTemplate] = useState('classic')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isImproving, setIsImproving] = useState(false)

  // Restore session from Supabase on login
  useEffect(() => {
    if (user && !analysis) {
      getLatestAnalysis(user.id)
        .then((record) => {
          if (record) {
            setAnalysis(record.analysis)
            setResumeText(record.original_text || '')
            setAnalysisId(record.id)
            if (record.payment_status === 'paid') {
              setPaymentDone(true)
              setSelectedPlan(record.plan)
              setImprovedResume(record.improved_resume)
            }
          }
        })
        .catch(() => {}) // silent — user may not have any previous session
    }
  }, [user])

  function resetAll() {
    setResumeFile(null)
    setResumeText('')
    setJobDescription('')
    setAnalysis(null)
    setImprovedResume(null)
    setCoverLetter(null)
    setLinkedInBio(null)
    setAnalysisId(null)
    setPaymentDone(false)
    setSelectedPlan(null)
    setSelectedTemplate('classic')
  }

  return (
    <ResumeContext.Provider value={{
      resumeFile, setResumeFile,
      resumeText, setResumeText,
      jobDescription, setJobDescription,
      analysis, setAnalysis,
      improvedResume, setImprovedResume,
      coverLetter, setCoverLetter,
      linkedInBio, setLinkedInBio,
      analysisId, setAnalysisId,
      paymentDone, setPaymentDone,
      selectedPlan, setSelectedPlan,
      selectedTemplate, setSelectedTemplate,
      isAnalyzing, setIsAnalyzing,
      isImproving, setIsImproving,
      resetAll
    }}>
      {children}
    </ResumeContext.Provider>
  )
}

export function useResume() {
  const ctx = useContext(ResumeContext)
  if (!ctx) throw new Error('useResume must be used within ResumeProvider')
  return ctx
}
