
import { createClient } from '@supabase/supabase-js';

// --- CREDENCIAIS PADRÃO DO SISTEMA (SENTHEON CLOUD) ---
const DEFAULT_URL = 'https://ofqypbwiiixesnzbrboo.supabase.co';
const DEFAULT_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9mcXlwYndpaWl4ZXNuemJyYm9vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU4NDQ3MTEsImV4cCI6MjA4MTQyMDcxMX0.58mgUJMOITroVRDrtDfEYJjhYnQ7FTpg9u7q6HyZr1M';

let cachedClient: any = null;
let cachedUrl: string = '';

export const getSupabaseClient = () => {
  const url = localStorage.getItem('SUPABASE_URL') || DEFAULT_URL;
  const key = localStorage.getItem('SUPABASE_KEY') || DEFAULT_KEY;

  if (!cachedClient || cachedUrl !== url) {
    cachedClient = createClient(url, key);
    cachedUrl = url;
  }
  return cachedClient;
};

// Exportando para compatibilidade, mas o ideal é usar getSupabaseClient()
export const supabase = getSupabaseClient();

export const isSupabaseConfigured = () => {
  const url = localStorage.getItem('SUPABASE_URL') || DEFAULT_URL;
  const key = localStorage.getItem('SUPABASE_KEY') || DEFAULT_KEY;
  return url.length > 0 && key.length > 0 && url.includes('supabase.co');
};
