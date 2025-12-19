
import { createClient } from '@supabase/supabase-js';

// Tenta pegar do ambiente (build) ou do armazenamento local (runtime)
const getEnv = (key: string) => {
  // @ts-ignore - process might not exist in browser without polyfill
  const envVar = typeof process !== 'undefined' && process.env ? process.env[key] : undefined;
  const localVar = localStorage.getItem(key);
  return envVar || localVar || '';
};

// --- CREDENCIAIS PADRÃO DO SISTEMA (SENTHEON CLOUD) ---
const DEFAULT_URL = 'https://ofqypbwiiixesnzbrboo.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcXlwYndpaWl4ZXNuemJyYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ3MTEsImV4cCI6MjA4MTQyMDcxMX0.58mgUJMOITroVRDrtDfEYJjhYnQ7FTpg9u7q6HyZr1M';

// Usa a configuração local/env se existir, senão usa o padrão hardcoded
const SUPABASE_URL = getEnv('SUPABASE_URL') || DEFAULT_URL;
const SUPABASE_KEY = getEnv('SUPABASE_KEY') || DEFAULT_KEY;

// Cria o cliente Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const isSupabaseConfigured = () => {
  // Verifica se as chaves existem e parecem válidas
  return SUPABASE_URL.length > 0 && SUPABASE_KEY.length > 0 && SUPABASE_URL.includes('supabase.co');
};
