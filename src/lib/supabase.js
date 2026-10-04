import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

let supabase = null
let supabaseError = ''

if (!supabaseUrl) {
  supabaseError = 'VITE_SUPABASE_URL не найден'
} else if (!supabaseAnonKey) {
  supabaseError = 'VITE_SUPABASE_ANON_KEY не найден'
} else {
  try {
    supabase = createClient(
      supabaseUrl,
      supabaseAnonKey,
    )
  } catch (error) {
    supabaseError = error?.message || 'Неизвестная ошибка Supabase'
    console.error('Supabase:', error)
  }
}

export { supabase, supabaseError }