
import React, { useState, useEffect } from 'react';
import { useProjectStore } from '../../core/store';
import { Project } from '../../types';
import { 
  Plus, Save, ExternalLink, Edit3, Box, Code, Loader2, Database, FileText, Download, RefreshCw, X, Sparkles, Wand2
} from 'lucide-react';
import { CyberButton, CyberInput, CyberTextArea, CyberModal, CyberSelect } from '../../components/ui/CyberComponents';

const NEON_PALETTE: Record<string, string> = {
  'neon-yellow': '#FFFF00',
  'neon-cyan': '#00F0FF',
  'neon-magenta': '#FF00FF',
  'neon-green': '#00FF41',
  'neon-orange': '#FF5F1F',
  'neon-blue': '#1F51FF',
  'neon-white': '#FFFFFF',
};

export const HiveView: React.FC = () => {
  const { projects, fetchProjects, updateProject, generateAllLogos, isLoading } = useProjectStore();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isNeuralSyncing, setIsNeuralSyncing] = useState(false);

  useEffect(() => { 
    fetchProjects(); 
  }, []);

  const handleEdit = (p: Project) => {
    setSelectedProject({ ...p });
    setIsEditModalOpen(true);
  };

  const handleNeuralSync = async () => {
    setIsNeuralSyncing(true);
    await generateAllLogos();
    setIsNeuralSyncing(false);
  };

  const handleSave = async () => {
    if (!selectedProject) return;
    setIsSaving(true);
    try {
      await updateProject(selectedProject.id, selectedProject);
      setIsEditModalOpen(false);
    } catch (e) {
      alert("Falha na sincronização cloud.");
    } finally {
      setIsSaving(false);
    }
  };

  const createNewProject = () => {
    const newId = (projects.length + 1).toString().padStart(3, '0');
    const newPrj: Project = {
      id: newId,
      name: 'NOVO PROJETO NEURAL',
      mission: 'Missão do sistema...',
      description: 'Descrição detalhada...',
      status: 'active',
      progress: 0,
      techStack: ['React'],
      lastUpdated: new Date().toISOString(),
      tags: ['New'],
      color: 'neon-cyan',
      version: 'v1.0'
    };
    setSelectedProject(newPrj);
    setIsEditModalOpen(true);
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-void-dark overflow-hidden">
      {/* HEADER TÁTICO */}
      <div className="flex-shrink-0 p-4 border-b border-white/5 bg-black/60 backdrop-blur-xl flex justify-between items-center z-50">
        <div className="flex items-center gap-4">
          <FileText className="text-neon-yellow" size={20} />
          <div>
            <h1 className="text-lg font-black text-white tracking-[0.2em] font-cyber uppercase flex items-center gap-2">
               GERENCIADOR DE PROJETOS <span className="text-neon-yellow/50 text-xs font-mono">(HIVE GRID)</span>
            </h1>
            <p className="text-[8px] text-gray-500 font-mono uppercase tracking-[0.3em]">Quantum Cluster v4.2 // Cluster Sync Active</p>
          </div>
        </div>

        <div className="flex gap-2">
           <div className="flex gap-1 bg-black/40 p-1 rounded border border-white/5">
              <button onClick={handleNeuralSync} disabled={isNeuralSyncing} className="px-3 py-1 text-[8px] font-bold text-neon-cyan border border-neon-cyan/20 rounded hover:bg-neon-cyan/10 transition-all flex items-center gap-1">
                 {isNeuralSyncing ? <RefreshCw size={8} className="animate-spin" /> : <Sparkles size={8} />} NEURAL SYNC LOGOS
              </button>
              <button className="px-3 py-1 text-[8px] font-bold text-neon-yellow border border-neon-yellow/20 rounded hover:bg-neon-yellow/10 transition-all flex items-center gap-1">
                 <Database size={8} /> BKP DISCO
              </button>
              <button className="px-3 py-1 text-[8px] font-bold text-gray-400 border border-white/10 rounded hover:bg-white/5 transition-all flex items-center gap-1">
                 <Box size={8} /> LER DISCO
              </button>
              <button onClick={() => fetchProjects()} className="p-1 text-gray-500 hover:text-white transition-all">
                 <RefreshCw size={12} className={isLoading ? 'animate-spin' : ''} />
              </button>
           </div>
           <CyberButton variant="primary" className="px-3 py-1 text-[10px] flex items-center gap-1 border-neon-cyan text-neon-cyan" onClick={createNewProject}>
             <Plus size={12} /> NOVO NÓ
           </CyberButton>
        </div>
      </div>

      {/* HONEYCOMB TIGHT GRID */}
      <div className="flex-1 overflow-auto custom-scrollbar p-16 relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.02),transparent_70%)] pointer-events-none"></div>

        {isLoading && projects.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center opacity-40">
             <Loader2 size={48} className="animate-spin text-neon-yellow mb-4" />
             <p className="font-mono text-xs uppercase tracking-widest">Sincronizando Colmeia...</p>
          </div>
        ) : (
          <div className="honeycomb-container">
             {projects.map((p) => (
                <HexNode 
                  key={p.id} 
                  project={p} 
                  onEdit={() => handleEdit(p)} 
                />
             ))}
             
             {/* Interlocking Empty Action Node */}
             <div onClick={createNewProject} className="honeycomb-cell group cursor-pointer">
                <div className="hexagon bg-black/40 border border-dashed border-white/10 flex flex-col items-center justify-center hover:bg-neon-cyan/5 hover:border-neon-cyan/50 transition-all">
                   <Plus size={32} className="text-white/20 group-hover:text-neon-cyan group-hover:scale-125 transition-all" />
                   <span className="text-[8px] font-cyber text-white/20 group-hover:text-neon-cyan uppercase mt-2 tracking-widest">Novo Projeto</span>
                </div>
             </div>
          </div>
        )}
      </div>

      <style>{`
        .honeycomb-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          max-width: 1400px;
          margin: 0 auto;
          padding-bottom: 400px;
          padding-top: 50px;
        }

        .honeycomb-cell {
          position: relative;
          width: 220px;
          height: 250px;
          margin: -25px -1px; 
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), z-index 0.3s;
          z-index: 10;
        }

        .honeycomb-cell:hover {
          transform: scale(1.8); 
          z-index: 100;
        }

        .hexagon {
          position: absolute;
          inset: 0;
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
      `}</style>

      {/* EDIT MODAL */}
      <CyberModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title={`EDITAR PROJETO: ${selectedProject?.id}`}
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar p-2">
          <div className="grid grid-cols-2 gap-4">
             <div className="col-span-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Nome do Sistema</label>
                <CyberInput 
                  value={selectedProject?.name || ''} 
                  onChange={e => setSelectedProject(prev => prev ? {...prev, name: e.target.value} : null)}
                />
             </div>
             <div className="col-span-1">
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Versão</label>
                <CyberInput 
                  value={selectedProject?.version || ''} 
                  onChange={e => setSelectedProject(prev => prev ? {...prev, version: e.target.value} : null)}
                />
             </div>
          </div>
          <div>
             <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Missão Estratégica</label>
             <CyberInput 
               value={selectedProject?.mission || ''} 
               onChange={e => setSelectedProject(prev => prev ? {...prev, mission: e.target.value} : null)}
             />
          </div>
          <div>
             <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Descrição do Logotipo (Prompt)</label>
             <CyberTextArea 
               rows={3}
               placeholder="Ex: Minimalist logo for a data cloud project, neon blue..."
               value={selectedProject?.description || ''} 
               onChange={e => setSelectedProject(prev => prev ? {...prev, description: e.target.value} : null)}
             />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Cor Identidade</label>
                <CyberSelect 
                  value={selectedProject?.color || 'neon-cyan'} 
                  onChange={e => setSelectedProject(prev => prev ? {...prev, color: e.target.value} : null)}
                >
                  {Object.keys(NEON_PALETTE).map(k => <option key={k} value={k}>{k}</option>)}
                </CyberSelect>
             </div>
             <div>
                <label className="text-[10px] font-mono text-gray-500 uppercase mb-1 block">Integridade (%)</label>
                <CyberInput 
                  type="number"
                  value={selectedProject?.progress || 0} 
                  onChange={e => setSelectedProject(prev => prev ? {...prev, progress: parseInt(e.target.value)} : null)}
                />
             </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3 border-t border-white/10 pt-4">
           <CyberButton 
            className="flex-1 bg-neon-yellow/10 text-neon-yellow border-neon-yellow py-2 text-xs" 
            onClick={handleSave}
            disabled={isSaving}
           >
              {isSaving ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'SINCRONIZAR NÓ'}
           </CyberButton>
           <CyberButton variant="secondary" className="py-2 text-xs" onClick={() => setIsEditModalOpen(false)}>FECHAR</CyberButton>
        </div>
      </CyberModal>
    </div>
  );
};

const HexNode: React.FC<{ project: Project; onEdit: () => void }> = ({ project, onEdit }) => {
  const { generateProjectLogo } = useProjectStore();
  const accentColor = NEON_PALETTE[project.color || 'neon-cyan'];
  const [isHovered, setIsHovered] = useState(false);
  
  const handleGenLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateProjectLogo(project.id);
  };

  return (
    <div 
      className="honeycomb-cell"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
    >
      <div className={`hexagon bg-slate-900 border transition-all duration-300 ${isHovered ? 'shadow-[0_0_50px_rgba(var(--accent-rgb),0.6)]' : 'border-white/10 opacity-90'}`}
           style={{ borderColor: isHovered ? accentColor : 'rgba(255,255,255,0.1)', backgroundColor: isHovered ? '#0a0e1a' : '#0f172a' }}>
        
        {/* Glow inner layer */}
        <div className={`absolute inset-0 bg-gradient-to-b transition-opacity duration-300 ${isHovered ? 'opacity-30' : 'opacity-0'}`}
             style={{ backgroundImage: `linear-gradient(to bottom, ${accentColor}, transparent)` }}></div>

        <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 text-center">
           
           {/* ID TAG */}
           <div className={`absolute top-6 px-2 py-0.5 rounded-full text-[8px] font-mono border transition-all duration-300 ${isHovered ? 'bg-black opacity-100 scale-110' : 'opacity-60'}`}
                style={{ borderColor: accentColor, color: accentColor }}>
              ID: {project.id}
           </div>

           {/* CENTRAL LOGO/ICON */}
           <div className="mb-2 transition-transform duration-500 relative">
              {project.isGeneratingLogo ? (
                <div className="w-14 h-14 rounded-full border border-neon-cyan flex items-center justify-center bg-black/80 animate-pulse">
                   <Wand2 size={24} className="text-neon-cyan animate-spin" />
                </div>
              ) : project.logoUrl ? (
                <div className={`w-14 h-14 rounded-full border border-white/10 overflow-hidden bg-white p-1 transition-all ${isHovered ? 'scale-110' : ''}`}>
                   <img src={project.logoUrl} className="w-full h-full object-contain" alt={project.name} />
                </div>
              ) : (
                <div onClick={handleGenLogo} className={`w-10 h-10 rounded-lg border flex items-center justify-center bg-black/40 transition-all cursor-pointer hover:bg-neon-cyan/20 ${isHovered ? 'scale-110' : ''}`} style={{ borderColor: `${accentColor}40`, color: accentColor }}>
                   <Sparkles size={20} className="hover:animate-spin" />
                </div>
              )}
           </div>

           {/* PROJECT TITLES */}
           <h3 className={`text-xs font-black tracking-widest uppercase mb-1 transition-colors duration-300 ${isHovered ? '' : 'text-white'}`} style={{ color: isHovered ? accentColor : 'white' }}>
             {project.name}
           </h3>
           
           <p className={`text-[7px] text-gray-400 font-mono italic px-4 line-clamp-2 leading-tight min-h-[16px] mb-2 transition-opacity ${isHovered ? 'opacity-100' : 'opacity-60'}`}>
             {project.mission}
           </p>

           {/* EXPANDED CONTENT (HOVER) */}
           <div className={`transition-all duration-500 overflow-hidden flex flex-col items-center w-full px-4 ${isHovered ? 'h-28 opacity-100 mt-2' : 'h-0 opacity-0'}`}>
              <p className="text-[7px] text-gray-400 mb-3 line-clamp-3 leading-tight">{project.description}</p>
              
              {/* Integrity Bar */}
              <div className="w-full mb-3">
                <div className="flex justify-between text-[6px] font-mono text-gray-500 mb-0.5 uppercase">
                   <span>Integrity</span>
                   <span>{project.progress}%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden border border-white/5">
                   <div className="h-full transition-all duration-1000" style={{ width: `${project.progress}%`, backgroundColor: accentColor }}></div>
                </div>
              </div>

              {/* Stack */}
              <div className="flex gap-1 justify-center flex-wrap">
                 {project.techStack?.slice(0, 3).map(t => (
                   <span key={t} className="text-[6px] bg-black/40 px-1.5 py-0.5 rounded text-gray-300 font-mono border border-white/10">{t}</span>
                 ))}
              </div>
           </div>

           {/* VERSION BADGE */}
           <div className={`absolute bottom-6 transition-all duration-300 flex items-center gap-1 ${isHovered ? 'opacity-100 scale-110' : 'opacity-40'}`}>
              <Code size={8} className="text-gray-600" />
              <span className="text-[7px] font-mono text-gray-500 uppercase tracking-tighter">{project.version}</span>
           </div>

        </div>
      </div>
    </div>
  );
};
