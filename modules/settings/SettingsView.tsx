
import React, { useState, useEffect } from 'react';
import { CyberCard, CyberInput, CyberButton } from '../../components/ui/CyberComponents';
import { Save, Database, Cpu, ShieldCheck, AlertTriangle, UploadCloud, Terminal, Copy, Github, Globe, RefreshCw, Cloud } from 'lucide-react';
import { isSupabaseConfigured } from '../../core/supabase';
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

  const handleSave = () => {
    localStorage.setItem('SUPABASE_URL', sbUrl);
    localStorage.setItem('SUPABASE_KEY', sbKey);
    setGitHub({ token: ghToken, repo: ghRepo, branch: 'main' });
    
    setStatus('saved');
    setTimeout(() => {
        window.location.reload();
    }, 1000);
  };

  const handleFullSync = async () => {
    if (!isSupabaseConfigured()) {
        alert("Supabase não configurado. Verifique as chaves.");
        return;
    }
    setSyncing(true);
    try {
        await uploadMockData(); // Sobe projetos MOCK
        await fetchProjects();
        await fetchLeads();
        await fetchEvents();
        alert("SINCRONIZAÇÃO TOTAL CONCLUÍDA: Todos os dados agora residem na nuvem.");
    } catch (e) {
        console.error(e);
        alert("Erro na sincronização neural.");
    } finally {
        setSyncing(false);
    }
  };

  return (
    <div className="p-8 h-full overflow-y-auto max-w-4xl mx-auto custom-scrollbar pb-24">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-black text-white tracking-widest mb-2 flex items-center justify-center gap-4 font-cyber">
          <Github className="text-neon-orange" size={40} />
          COMANDO DE SISTEMA
        </h1>
        <p className="text-neon-orange font-mono text-sm tracking-wider">VERSIONAMENTO & REPOSITÓRIO</p>
      </div>

      <div className="grid gap-8">
        
        {/* GitHub Integration Card */}
        <CyberCard className={`border-l-4 ${ghStatus ? 'border-neon-green' : 'border-neon-orange'}`}>
           <div className="flex items-center gap-3 mb-6">
             <Github className="text-neon-orange" />
             <h2 className="text-xl font-bold text-white uppercase">Sincronização GitHub</h2>
             {ghStatus && (
                 <span className="ml-auto text-[9px] bg-neon-green/10 text-neon-green border border-neon-green/30 px-2 py-1 rounded-full animate-pulse">
                    CONNECTED: {ghStatus.sha}
                 </span>
             )}
           </div>

           <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Repositório (usuario/repo)</label>
                    <CyberInput placeholder="ex: edivaldo/sentheon-v4" value={ghRepo} onChange={e => setGhRepo(e.target.value)} />
                 </div>
                 <div>
                    <label className="block text-[10px] font-mono text-gray-400 uppercase mb-2">Access Token (PAT)</label>
                    <CyberInput type="password" placeholder="ghp_..." value={ghToken} onChange={e => setGhToken(e.target.value)} />
                 </div>
              </div>
           </div>
        </CyberCard>

        {/* Database Config */}
        <CyberCard className={`border-l-4 border-neon-cyan`}>
          <div className="flex items-center gap-3 mb-6">
             <Database className="text-neon-cyan" />
             <h2 className="text-xl font-bold text-white uppercase">Cloud Persistence (Supabase)</h2>
          </div>
          <div className="space-y-4">
            <CyberInput placeholder="SUPABASE URL" value={sbUrl} onChange={e => setSbUrl(e.target.value)} />
            <CyberInput type="password" placeholder="SUPABASE KEY" value={sbKey} onChange={e => setSbKey(e.target.value)} />
            
            <div className="mt-6 pt-6 border-t border-white/5 flex flex-col gap-4">
                <div className="flex items-center gap-3 p-4 bg-neon-yellow/5 border border-neon-yellow/20 rounded">
                    <AlertTriangle className="text-neon-yellow" size={20} />
                    <p className="text-[10px] text-gray-400 font-mono uppercase">Atenção: A sincronização total enviará todos os dados locais para as tabelas 'projects', 'leads' e 'chronicle_events'.</p>
                </div>
                <CyberButton onClick={handleFullSync} disabled={syncing} className="border-neon-yellow text-neon-yellow bg-neon-yellow/10">
                    {syncing ? <RefreshCw className="animate-spin mx-auto"/> : <><Cloud size={18} className="inline mr-2"/> FORÇAR SINCRONIZAÇÃO TOTAL (NUVEM)</>}
                </CyberButton>
            </div>
          </div>
        </CyberCard>

        <div className="flex justify-end gap-4">
            <CyberButton onClick={handleSave} glow className="bg-neon-orange/10 border-neon-orange text-neon-orange">
               <Save size={18} className="inline mr-2"/> {status === 'saved' ? 'SINCROIZANDO...' : 'SALVAR CONFIGURAÇÕES'}
            </CyberButton>
        </div>
      </div>
    </div>
  );
};
