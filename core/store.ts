
import { create } from 'zustand';
import { Project, BrandResult, MOCK_PROJECTS, AgentConfig, GitHubConfig, ChronicleEvent, Lead, LogoRequest } from '../types';
import { getSupabaseClient, isSupabaseConfigured } from './supabase';
import { generateLogo } from '../services/geminiService';

interface ProjectStore {
  projects: Project[];
  isLoading: boolean;
  fetchProjects: () => Promise<void>;
  addProject: (project: Project) => Promise<void>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  uploadMockData: () => Promise<void>;
  generateProjectLogo: (projectId: string) => Promise<void>;
  generateAllLogos: () => Promise<void>;
}

export const useProjectStore = create<ProjectStore>((set, get) => ({
  projects: [],
  isLoading: false,
  fetchProjects: async () => {
    set({ isLoading: true });
    if (!isSupabaseConfigured()) {
      set({ projects: MOCK_PROJECTS, isLoading: false });
      return;
    }
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.from('projects').select('*').order('lastUpdated', { ascending: false });
      if (error) throw error;
      set({ projects: data && data.length > 0 ? (data as any) : MOCK_PROJECTS, isLoading: false });
    } catch (e) {
      set({ projects: MOCK_PROJECTS, isLoading: false });
    }
  },
  addProject: async (p) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('projects').insert([p]);
    }
    set(s => ({ projects: [p, ...s.projects] }));
  },
  updateProject: async (id, up) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('projects').update(up).eq('id', id);
    }
    set(s => ({ 
      projects: s.projects.map(p => p.id === id ? {...p, ...up, lastUpdated: new Date().toISOString()} : p) 
    }));
  },
  deleteProject: async (id) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('projects').delete().eq('id', id);
    }
    set(s => ({ projects: s.projects.filter(p => p.id !== id) }));
  },
  uploadMockData: async () => {
    if (!isSupabaseConfigured()) return;
    set({ isLoading: true });
    try {
      const client = getSupabaseClient();
      await client.from('projects').upsert(MOCK_PROJECTS);
      await get().fetchProjects();
    } catch (e) {
      set({ isLoading: false });
    }
  },
  generateProjectLogo: async (projectId: string) => {
    const p = get().projects.find(x => x.id === projectId);
    if (!p) return;

    set(s => ({ projects: s.projects.map(item => item.id === projectId ? { ...item, isGeneratingLogo: true } : item) }));

    try {
      const logoReq: LogoRequest = {
        brandName: p.name,
        context: p.mission,
        industry: p.tags?.[0] || 'Technology',
        style: 'Minimalist Digital Vector',
        colors: p.color || 'Neon Cyan',
        removeBackground: true,
        essence: p.mission,
        emotion: 'Professional',
        symbolType: 'Abstract Mark',
        typography: 'Sans Serif',
        composition: 'Symbol Center'
      };

      const logoRes = await generateLogo(logoReq);
      await get().updateProject(projectId, { logoUrl: logoRes.imageUrl });
    } catch (e) {
      console.error("Neural Synthesis Failed for", p.name, e);
    } finally {
      set(s => ({ projects: s.projects.map(item => item.id === projectId ? { ...item, isGeneratingLogo: false } : item) }));
    }
  },
  generateAllLogos: async () => {
    const targets = get().projects.filter(p => !p.logoUrl);
    for (const p of targets) {
      await get().generateProjectLogo(p.id);
    }
  }
}));

interface LeadStore {
  leads: Lead[];
  isLoading: boolean;
  fetchLeads: () => Promise<void>;
  addLead: (lead: Lead) => Promise<void>;
  updateLead: (id: string, updates: Partial<Lead>) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
}

export const useLeadStore = create<LeadStore>((set, get) => ({
  leads: [],
  isLoading: false,
  fetchLeads: async () => {
    set({ isLoading: true });
    if (!isSupabaseConfigured()) {
      set({ leads: [], isLoading: false });
      return;
    }
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.from('leads').select('*').order('value', { ascending: false });
      if (error) throw error;
      set({ leads: (data as any) || [], isLoading: false });
    } catch (e) {
      set({ leads: [], isLoading: false });
    }
  },
  addLead: async (l) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('leads').insert([l]);
    }
    set(s => ({ leads: [l, ...s.leads] }));
  },
  updateLead: async (id, up) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('leads').update(up).eq('id', id);
    }
    set(s => ({ leads: s.leads.map(l => l.id === id ? {...l, ...up} : l) }));
  },
  deleteLead: async (id) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('leads').delete().eq('id', id);
    }
    set(s => ({ leads: s.leads.filter(l => l.id !== id) }));
  }
}));

interface ChronicleStore {
  events: ChronicleEvent[];
  isLoading: boolean;
  fetchEvents: () => Promise<void>;
  addEvent: (event: ChronicleEvent) => Promise<void>;
  clearEvents: () => Promise<void>;
}

export const useChronicleStore = create<ChronicleStore>((set) => ({
  events: [],
  isLoading: false,
  fetchEvents: async () => {
    set({ isLoading: true });
    if (!isSupabaseConfigured()) {
      const local = localStorage.getItem('sentheon_chronicle_events_v4');
      set({ events: local ? JSON.parse(local) : [], isLoading: false });
      return;
    }
    try {
      const client = getSupabaseClient();
      const { data, error } = await client.from('chronicle_events').select('*').order('timestamp', { ascending: false });
      if (error) throw error;
      set({ events: (data as any) || [], isLoading: false });
    } catch (e) {
      set({ isLoading: false });
    }
  },
  addEvent: async (e) => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('chronicle_events').insert([e]);
    }
    set(s => {
      const updated = [e, ...s.events];
      localStorage.setItem('sentheon_chronicle_events_v4', JSON.stringify(updated));
      return { events: updated };
    });
  },
  clearEvents: async () => {
    if (isSupabaseConfigured()) {
      const client = getSupabaseClient();
      await client.from('chronicle_events').delete().neq('id', '');
    }
    localStorage.removeItem('sentheon_chronicle_events_v4');
    set({ events: [] });
  }
}));

interface SystemStore {
  version: string;
  github: GitHubConfig;
  setGitHub: (config: GitHubConfig) => void;
  calculateDynamicVersion: (events: ChronicleEvent[]) => void;
}

export const useSystemStore = create<SystemStore>((set) => ({
  version: 'v4.0.0',
  github: {
    token: localStorage.getItem('GITHUB_TOKEN') || '',
    repo: localStorage.getItem('GITHUB_REPO') || '',
    branch: 'main'
  },
  setGitHub: (config) => {
    localStorage.setItem('GITHUB_TOKEN', config.token);
    localStorage.setItem('GITHUB_REPO', config.repo);
    set({ github: config });
  },
  calculateDynamicVersion: (events) => {
    const bootDate = new Date('2025-12-16');
    const today = new Date();
    const daysSinceBoot = Math.floor((today.getTime() - bootDate.getTime()) / (1000 * 60 * 60 * 24));
    const mutations = events.length;
    const newVersion = `v4.${mutations}.${daysSinceBoot}`;
    set({ version: newVersion });
  }
}));

interface AgentStore {
  config: AgentConfig;
  agentState: 'idle' | 'listening' | 'processing' | 'speaking';
  position: { x: number; y: number };
  setConfig: (updates: Partial<AgentConfig>) => void;
  setAgentState: (state: 'idle' | 'listening' | 'processing' | 'speaking') => void;
  setPosition: (x: number, y: number) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  config: {
    personality: 'EXECUTIVE',
    voiceVolume: 1,
    voiceRate: 1,
    voicePitch: 1,
    language: 'pt-BR',
    isActive: true
  },
  agentState: 'idle',
  position: { x: window.innerWidth - 180, y: window.innerHeight - 180 },
  setConfig: (updates) => set((s) => ({ config: { ...s.config, ...updates } })),
  setAgentState: (state) => set({ agentState: state }),
  setPosition: (x, y) => set({ position: { x, y } })
}));

interface ForgeStore {
  results: BrandResult[];
  setResults: (results: BrandResult[]) => void;
}

export const useForgeStore = create<ForgeStore>((set) => ({
  results: [],
  setResults: (results) => set({ results })
}));
