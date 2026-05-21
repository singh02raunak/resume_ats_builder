import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Check your .env file.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// ─── Resume Analysis DB helpers ───────────────────────────────

export async function saveAnalysis(userId, data) {
  const { data: record, error } = await supabase
    .from('resume_analyses')
    .insert([
      {
        user_id: userId,
        original_filename: data.originalFilename,
        original_text: data.originalText,
        ats_score: data.atsScore,
        analysis: data.analysis,
        improved_resume: data.improvedResume || null,
        payment_status: 'pending',
        payment_amount: null,
        plan: null
      }
    ])
    .select()
    .single()

  if (error) throw error
  return record
}

export async function getLatestAnalysis(userId) {
  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function getAllAnalyses(userId) {
  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function updateAnalysis(id, updates) {
  const { data, error } = await supabase
    .from('resume_analyses')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getAnalysisById(id) {
  const { data, error } = await supabase
    .from('resume_analyses')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}
