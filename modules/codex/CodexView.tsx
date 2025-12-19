
import React, { useState } from 'react';
import { BookOpen, Server, Cpu, Layers, GitBranch, Database, Shield, Terminal, Code, Activity, Network } from 'lucide-react';
import { CyberCard } from '../../components/ui/CyberComponents';

type CodexTab = 'architecture' | 'modules' | 'roadmap' | 'devmode';

export const CodexView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<CodexTab>('architecture');

  const renderTabButton = (id: CodexTab, label: string, icon: React.ReactNode) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 font-cyber tracking-wider transition-all duration-300 ${
        activeTab === id 
          ? 'border-neon-lime text-neon-lime bg-neon-lime/5' 
          : 'border-transparent text-gray-500 hover:text-white'
      }`}
    >
      {icon}
      {label}
    </button>
  );

  // Lista dinâmica de módulos reais do sistema
  const systemModules = [
      { id: 1, code: 'NEXUS', name: 'PORTFÓLIO.DEV', desc: 'Catálogo de projetos, status e integrações.', status: 'ONLINE' },
      { id: 2, code: 'FORGE', name: 'A FORJA', desc: 'Gerador de Naming e Branding (IA Multimodal).', status: 'ONLINE' },
      { id: 3, code: 'CHRONICLE', name: 'CRÔNICA', desc: 'Gerenciador no Tempo e Logs de Auditoria.', status: 'ONLINE' },
      { id: 4, code: 'CONSULTANT', name: 'AGENTE CONSULTOR', desc: 'IA Conversacional (Arquitetura/DevOps).', status: 'ONLINE' },
      { id: 5, code: 'CODEX', name: 'O CÓDICE', desc: 'Documentação Viva e Especificações.', status: 'ONLINE' },
      { id: 6, code: 'SYSTEM', name: 'SISTEMA', desc: 'Configurações de API e Chaves.', status: 'ONLINE' },
  ];

  return (
    <div className="flex flex-col h-full p-8 overflow-hidden">
      {/* Header */}
      <div className="flex-shrink-0 mb-8 text-center">
        <h1 className="text-4xl font-black text-white tracking-widest mb-2 flex items-center justify-center gap-4">
          <BookOpen className="text-neon-lime" size={40} />
          O CÓDICE
        </h1>
        <p className="text-neon-lime font-mono text-sm tracking-wider">DOCUMENTAÇÃO TÉCNICA V1.0</p>
      </div>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mb-8 flex-shrink-0 flex-wrap">
        {renderTabButton('architecture', 'ARQUITETURA', <Server size={18} />)}
        {renderTabButton('modules', 'MÓDULOS', <Layers size={18} />)}
        {renderTabButton('devmode', 'MODO DEV', <Terminal size={18} />)}
        {renderTabButton('roadmap', 'ROADMAP', <GitBranch size={18} />)}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar max-w-7xl mx-auto w-full pr-4">
        
        {/* ARQUITETURA TAB */}
        {activeTab === 'architecture' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <CyberCard className="border-l-4 border-neon-blue">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Cpu className="text-neon-blue"/> CÉREBRO (Neural Layer)
                  </h3>
                  <ul className="space-y-3 font-mono text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-neon-blue">▸</span> <strong>Modelo Principal:</strong> Gemini 2.5 Flash (Texto/Lógica).</li>
                    <li className="flex gap-2"><span className="text-neon-blue">▸</span> <strong>Modelo Visual:</strong> Gemini 2.5 Flash Image (Logotipos).</li>
                    <li className="flex gap-2"><span className="text-neon-blue">▸</span> <strong>Fallback:</strong> Sistema de redundância para modo offline e geração sintética.</li>
                  </ul>
               </CyberCard>

               <CyberCard className="border-l-4 border-neon-green">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Database className="text-neon-green"/> DADOS (Persistence Layer)
                  </h3>
                  <ul className="space-y-3 font-mono text-sm text-gray-300">
                    <li className="flex gap-2"><span className="text-neon-green">▸</span> <strong>Supabase:</strong> PostgreSQL para persistência de Projetos (Nuvem).</li>
                    <li className="flex gap-2"><span className="text-neon-green">▸</span> <strong>LocalStorage:</strong> Armazenamento seguro de Chaves de API.</li>
                    <li className="flex gap-2"><span className="text-neon-green">▸</span> <strong>Zustand:</strong> Gerenciamento de estado global.</li>
                  </ul>
               </CyberCard>
            </div>

            <CyberCard className="border-l-4 border-neon-yellow">
               <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                 <Shield className="text-neon-yellow"/> PROTOCOLOS DE SEGURANÇA
               </h3>
               <div className="text-sm font-mono text-gray-300 space-y-2">
                 <p>1. <strong>Client-Side Only:</strong> Nenhuma chave de API é enviada para servidores intermediários.</p>
                 <p>2. <strong>Isolamento:</strong> O ambiente de execução é isolado no navegador.</p>
                 <p>3. <strong>Audit Trail:</strong> Alterações críticas são logadas no módulo Crônica.</p>
               </div>
            </CyberCard>
          </div>
        )}

        {/* MÓDULOS TAB (ATUALIZADO E NUMERADO) */}
        {activeTab === 'modules' && (
          <div className="grid grid-cols-1 gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {systemModules.map((mod) => (
              <div key={mod.id} className="group relative bg-white/5 border border-white/10 p-6 rounded hover:bg-white/10 transition-colors flex items-center gap-6 overflow-hidden">
                {/* Number Background */}
                <span className="absolute -right-4 -bottom-8 text-[120px] font-black text-white/5 group-hover:text-neon-lime/10 transition-colors select-none font-cyber">
                    {mod.id}
                </span>
                
                <div className="flex items-center justify-center w-12 h-12 bg-black border border-white/20 rounded-full shrink-0 font-bold text-neon-lime">
                    {mod.id}
                </div>
                
                <div className="relative z-10">
                    <h3 className="text-xl font-bold text-white flex items-center gap-3">
                        {mod.name}
                        <span className="text-[10px] bg-neon-lime/20 text-neon-lime px-2 py-0.5 rounded border border-neon-lime/30 tracking-widest">
                            {mod.status}
                        </span>
                    </h3>
                    <p className="text-neon-blue font-mono text-xs mb-1 tracking-wider">{mod.code}_MODULE_V1</p>
                    <p className="text-gray-400 text-sm">{mod.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* DEV MODE TAB (NOVO) */}
        {activeTab === 'devmode' && (
            <div className="space-y-6 animate-in zoom-in duration-300">
                <div className="bg-black border border-green-500/50 p-6 rounded font-mono text-sm text-green-500 shadow-[0_0_20px_rgba(0,255,0,0.1)]">
                    <div className="flex items-center gap-2 mb-4 border-b border-green-500/30 pb-2">
                        <Terminal size={18} />
                        <span className="font-bold">TERMINAL DE SISTEMA - ACESSO ROOT</span>
                    </div>
                    <div className="space-y-2 opacity-90">
                        <p>> inicializando sentheon_v4.0.exe...</p>
                        <p>> carregando react_core... <span className="text-white">OK</span></p>
                        <p>> conectando supabase_client... <span className="text-white">OK</span></p>
                        <p>> verificando gemini_api_bridge... <span className="text-white">CONNECTED</span></p>
                        <p>> renderizando interface_neural... <span className="text-white">DONE</span></p>
                        <p className="animate-pulse">> sistema pronto. aguardando comando_</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Tech Stack Visualizer */}
                    <div className="col-span-2 bg-white/5 p-6 rounded border border-white/10">
                        <h3 className="text-white font-bold mb-6 flex items-center gap-2">
                            <Network className="text-neon-cyan" /> FLUXO DE DADOS
                        </h3>
                        <div className="flex justify-between items-center text-center relative">
                            {/* Connecting Line */}
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-gray-600 to-transparent -z-10"></div>
                            
                            <div className="bg-black p-4 border border-blue-500 rounded-lg z-10 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                                <Code className="mx-auto text-blue-500 mb-2" />
                                <span className="text-xs font-bold text-white">FRONTEND</span>
                                <p className="text-[9px] text-gray-500">React + Vite</p>
                            </div>

                            <div className="bg-black p-4 border border-yellow-500 rounded-full z-10 w-24 h-24 flex flex-col justify-center items-center shadow-[0_0_15px_rgba(234,179,8,0.5)] animate-pulse">
                                <Activity className="mx-auto text-yellow-500 mb-1" />
                                <span className="text-[10px] font-bold text-white">STATE</span>
                            </div>

                            <div className="bg-black p-4 border border-purple-500 rounded-lg z-10 shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                                <Database className="mx-auto text-purple-500 mb-2" />
                                <span className="text-xs font-bold text-white">BACKEND</span>
                                <p className="text-[9px] text-gray-500">Supabase + AI</p>
                            </div>
                        </div>
                    </div>

                    {/* Performance / Stats */}
                    <div className="bg-white/5 p-6 rounded border border-white/10">
                        <h3 className="text-white font-bold mb-4">MÉTRICAS</h3>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>USO DE MEMÓRIA</span>
                                    <span>24%</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1 rounded">
                                    <div className="bg-neon-lime h-full w-[24%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>LATÊNCIA DA REDE</span>
                                    <span>45ms</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1 rounded">
                                    <div className="bg-neon-cyan h-full w-[10%]"></div>
                                </div>
                            </div>
                             <div>
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>IA TOKENS (Sessão)</span>
                                    <span>1.2K</span>
                                </div>
                                <div className="w-full bg-gray-800 h-1 rounded">
                                    <div className="bg-neon-magenta h-full w-[60%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* ROADMAP TAB (LIMPO V1.0) */}
        {activeTab === 'roadmap' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="bg-neon-lime/10 border border-neon-lime/30 p-6 rounded-lg text-center">
               <h2 className="text-2xl font-black text-white mb-2">ROADMAP DE DESENVOLVIMENTO</h2>
               <p className="text-neon-lime font-mono text-sm">VERSÃO ATUAL: 1.0 (ESTÁVEL)</p>
            </div>

            <div className="space-y-6">
               <div className="p-8 text-center border-2 border-dashed border-gray-700 rounded-lg opacity-50">
                   <GitBranch size={48} className="mx-auto text-gray-500 mb-4" />
                   <h3 className="text-xl font-bold text-white">BACKLOG VAZIO</h3>
                   <p className="text-sm text-gray-400 mt-2 font-mono">
                       O sistema foi inicializado na versão 1.0.
                       <br/>
                       Aguardando novas especificações do Arquiteto para o ciclo 1.1.
                   </p>
               </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
