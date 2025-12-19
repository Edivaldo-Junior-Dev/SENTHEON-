
import React, { useState, useEffect } from 'react';
import { CyberCard, CyberInput, CyberButton } from '../../components/ui/CyberComponents';
import { Save, Database, Cpu, ShieldCheck, AlertTriangle, UploadCloud, Terminal, Copy, Github, Globe, RefreshCw, Cloud, CheckCircle2, Code } from 'lucide-react';
import { isSupabaseConfigured, getSupabaseClient } from '../../core/supabase';
import { useProjectStore, useSystemStore, useLeadStore, useChronicleStore } from '../../core/store';
import { fetchGitHubStatus } from '../../services/githubService';

export const SettingsView: React.FC = () => {
  const [sbUrl, setSbUrl] = useState('');
  const [sbKey, setSbKey] = useState('');
  const [ghToken, setGhToken] = useState('');
  const [ghRepo, setGhRepo] = useState('');
  const [ghStatus, setGhStatus] = useState<any>(null);
  const [status, setStatus] = useState<'idle' | 'saved'>('idle');
  const [syncing, setSyncing] = useState(false);
  const [showSql, setShowSql] = useState(false);

  const { uploadMockData, fetchProjects } = useProjectStore();
  const { fetchLeads } = useLeadStore();
  const { fetchEvents } = useChronicleStore();
  const { github, setGitHub } = useSystemStore();

  useEffect(() => {
    setSbUrl(localStorage.getItem('SUPABASE_URL') || '');
    setSbKey(localStorage.getItem('SUPABASE_KEY') || '');
    setGhToken(localStorage.getItem('GITHUB_TOKEN') || '');
    setGhRepo(localStorage.getItem('GITHUB_REPO') || '');
    
    if (github.token && github.repo) {
        fetchGitHubStatus(github.token, github.repo).then(setGhStatus);
    }
  }, [github]);

  const handleSave = async () => {
    localStorage.setItem('SUPABASE_URL', sbUrl);
    localStorage.setItem('SUPABASE_KEY', sbKey);
    setGitHub({ token: ghToken, repo: ghRepo, branch: 'main' });
    
    // Forçar atualização do cliente Supabase no cache dinâmico
    getSupabaseClient();
    
    setStatus('saved');
    
    // Em vez de reload(), re-sincronizamos os dados
    try {
      await fetchProjects();
      await fetchLeads();
      await fetchEvents();
    } catch (e) {
      console.error("Erro na re-sincronização automática.");
    }

    setTimeout(() => {
        setStatus('idle');
    }, 2000);
  };

  const handleFullSync = async () => {
    if (!isSupabaseConfigured()) {
        alert("Supabase não configurado. Verifique as chaves.");
        return;
    }
    setSyncing(true);
    try {
        await uploadMockData(); 
        await fetchProjects();
        await fetchLeads();
        await fetchEvents();
        alert("SINCRO: Sincronização total concluída com sucesso.");
    } catch (e) {
        console.error(e);
        alert("Erro na sincronização neural. Verifique se as tabelas existem no Supabase.");
    } finally {
        setSyncing(false);
    }
  };

  const sqlSchema = `-- Execute isso no SQL Editor do Supabase:

create table projects (
  id text primary key,
  name text,
  mission text,
  description text,
  status text,
  progress integer,
  "techStack" text[],
  "lastUpdated" timestamp with time zone default now(),
  tags text[],
  color text,
  version text,
  "siteUrl" text,
  "logoUrl" text
);

create table leads (
  id text primary key,
  name text,
  company text,
  value numeric,
  status text,
  probability integer,
  "lastContact" timestamp with time zone default now()
);

create table chronicle_events (
  id text primary key,
  timestamp timestamp with time zone default now(),
  type text,
  module text,
  "entityId" text,
  "entityName" text,
  actor jsonb,
  snapshot jsonb,
  "aiAnalysis" jsonb
);`;

  return (
    <div className="p-8 h-full overflow-y-auto max-w-5xl mx-auto custom-scrollbar pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white tracking-widest mb-2 flex items-center justify-center gap-4 font-cyber">
          <Terminal className="text-neon-orange" size={40} />
          CONFIGURAÇÃO DE NÚCLEO
        </h1>
        <p className="text-neon-orange font-mono text-sm tracking-wider uppercase">Sincronização Cloud & Versionamento</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Supabase Config */}
        <div className="space-y-6">
          <CyberCard className={`border-l-4 border-neon-cyan h-full`}>
            <div className="flex items-center justify-between mb-6">
               <div className="flex items-center gap-3">
                  <Database className="text-neon-cyan" />
                  <h2 className="text-xl font-bold text-white uppercase">Cloud Persistence</h2>
               </div>
               {isSupabaseConfigured() && <CheckCircle2 className="text-neon-green" size={20} />}
            </div>
            
            <div className="space-y-4">
              <div>
                 <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Supabase Project URL</label>
                 <CyberInput placeholder="https://xyz.supabase.co" value={sbUrl} onChange={e => setSbUrl(e.target.value)} />
              </div>
              <div>
                 <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Anon / Public API Key</label>
                 <CyberInput type="password" placeholder="eyJhbGci..." value={sbKey} onChange={e => setSbKey(e.target.value)} />
              </div>
              
              <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                  <CyberButton onClick={handleSave} glow className="w-full bg-neon-cyan/10 border-neon-cyan text-neon-cyan">
                     {status === 'saved' ? 'SISTEMA ATUALIZADO!' : 'SALVAR E SINCRONIZAR'}
                  </CyberButton>

                  <div className="flex items-center gap-3 p-4 bg-neon-yellow/5 border border-neon-yellow/20 rounded">
                      <AlertTriangle className="text-neon-yellow" size={16} />
                      <p className="text-[9px] text-gray-400 font-mono leading-tight">Certifique-se de que as tabelas existem no Supabase antes de forçar a sincronização.</p>
                  </div>

                  <CyberButton onClick={handleFullSync} disabled={syncing} className="w-full border-neon-yellow text-neon-yellow bg-neon-yellow/10 text-xs">
                      {syncing ? <RefreshCw className="animate-spin mx-auto"/> : <><Cloud size={14} className="inline mr-2"/> SUBIR DADOS PARA NUVEM AGORA</>}
                  </CyberButton>
              </div>
            </div>
          </CyberCard>
        </div>

        {/* SQL Guide & GitHub */}
        <div className="space-y-6">
          <CyberCard className="border-l-4 border-neon-green bg-black/60">
             <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                   <Code className="text-neon-green" />
                   <h2 className="text-sm font-bold text-white uppercase">Guia SQL Supabase</h2>
                </div>
                <button onClick={() => setShowSql(!showSql)} className="text-[10px] text-neon-green border border-neon-green/30 px-2 py-1 rounded">
                   {showSql ? 'FECHAR' : 'VER CÓDIGO'}
                </button>
             </div>
             
             {showSql ? (
                <div className="relative animate-in slide-in-from-top-2 duration-300">
                   <pre className="bg-black/80 p-3 rounded text-[9px] font-mono text-gray-400 overflow-x-auto border border-white/10 max-h-[300px] custom-scrollbar">
                      {sqlSchema}
                   </pre>
                   <button 
                     onClick={() => navigator.clipboard.writeText(sqlSchema)}
                     className="absolute top-2 right-2 p-1.5 bg-neon-green/10 text-neon-green rounded hover:bg-neon-green hover:text-black transition-all"
                   >
                      <Copy size={12} />
                   </button>
                </div>
             ) : (
                <p className="text-xs text-gray-500 font-mono italic">
                   Clique em "VER CÓDIGO" para obter as instruções SQL necessárias para criar as tabelas 'projects', 'leads' e 'chronicle_events' no seu projeto.
                </p>
             )}
          </CyberCard>

          <CyberCard className={`border-l-4 ${ghStatus ? 'border-neon-green' : 'border-neon-orange'}`}>
             <div className="flex items-center gap-3 mb-6">
               <Github className="text-neon-orange" />
               <h2 className="text-sm font-bold text-white uppercase">GitHub Versioning</h2>
             </div>

             <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4">
                   <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Repositório (usuário/repo)</label>
                      <CyberInput placeholder="ex: edivaldo/sentheon-v4" value={ghRepo} onChange={e => setGhRepo(e.target.value)} />
                   </div>
                   <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-1">Personal Access Token</label>
                      <CyberInput type="password" placeholder="ghp_..." value={ghToken} onChange={e => setGhToken(e.target.value)} />
                   </div>
                </div>
                {ghStatus && (
                   <div className="p-3 bg-neon-green/5 border border-neon-green/20 rounded flex justify-between items-center">
                      <span className="text-[10px] text-neon-green font-mono uppercase tracking-widest">Ativo: {ghStatus.sha}</span>
                      <span className="text-[9px] text-gray-500">{ghStatus.count} Commits</span>
                   </div>
                )}
             </div>
          </CyberCard>
        </div>
      </div>
      
      <div className="mt-12 text-center opacity-30 flex flex-col items-center gap-2">
         <ShieldCheck size={24} className="text-neon-cyan" />
         <span className="text-[9px] font-mono uppercase tracking-[0.5em]">Sentheon Security Protocol v4.0 Active</span>
      </div>
    </div>
  );
};
