import { createClient, SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | undefined

// Inicializar somente quando o webhook for usado, não durante o build.
export function getSupabase(): SupabaseClient {
  if (!client) {
    const url = process.env.SUPABASE_URL
    const key = process.env.SUPABASE_SERVICE_KEY
    if (!url || !key) throw new Error('Supabase server-side não configurado')
    client = createClient(url, key)
  }
  return client
}
