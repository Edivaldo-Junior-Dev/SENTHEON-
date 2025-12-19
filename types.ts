
export interface Project {
  id: string;
  name: string;
  mission: string;
  description: string;
  status: 'active' | 'archived' | 'completed';
  progress: number;
  techStack: string[];
  lastUpdated: string;
  tags: string[];
  color?: string;
  version?: string;
  company?: string;
  siteUrl?: string;
  logoUrl?: string;
  isGeneratingLogo?: boolean;
}

export interface Lead {
  id: string;
  name: string;
  company: string;
  value: number;
  status: 'Lead' | 'Proposta' | 'Negociação' | 'Fechado';
  probability: number;
  lastContact: string;
}

export interface GitHubConfig {
  token: string;
  repo: string;
  branch: string;
  lastSync?: string;
}

export interface BrandResult {
  name: string;
  tagline: string;
  category: string;
  reasoning: string;
  score: number;
  domainAvailable: boolean;
  type?: 'brand' | 'acronym';
  acronymBreakdown?: { letter: string; word: string }[];
  searchAnalysis?: string;
}

export interface LogoRequest {
  brandName: string;
  context: string;
  industry: string;
  style: string;
  colors: string;
  removeBackground: boolean;
  essence: string;
  emotion: string;
  symbolType: string;
  typography: string;
  composition: string;
  referenceImage?: string;
}

export interface LogoResult {
  id: string;
  imageUrl: string;
  promptUsed: string;
  timestamp: string;
  params: LogoRequest;
}

export type ConsultantPersona = 'ARCHITECT' | 'DEVOPS' | 'SECURITY' | 'DATA_SCIENTIST' | 'GENERAL_ASSISTANT';
export type AgentPersonality = 'EXECUTIVE' | 'ANALYTICAL' | 'PROACTIVE' | 'INSTRUCTOR';

export type ImpactLevel = 'low' | 'medium' | 'high' | 'critical';

export interface AIAnalysis {
  summary: string;
  impact: ImpactLevel;
  suggestions: string[];
  analyzedAt: string;
}

export interface AgentConfig {
  personality: AgentPersonality;
  voiceVolume: number;
  voiceRate: number;
  voicePitch: number;
  language: 'pt-BR' | 'en-US' | 'es-ES' | 'it-IT';
  isActive: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: string;
  persona?: ConsultantPersona;
}

export enum ModuleName {
  HIVE = 'PORTFÓLIO.DEV',
  FORGE = 'FORGE (Nomes)',
  CHRONICLE = 'GERENCIADOR NO TEMPO',
  SETTINGS = 'SETTINGS (Config)'
}

export enum EventType {
  CREATED = 'CRIADO',
  UPDATED = 'ATUALIZADO',
  DELETED = 'DELETADO',
  GENERATED = 'IA GEROU',
  RESTORED = 'RESTAURADO',
  SNAPSHOT = 'SNAPSHOT MANUAL'
}

export interface ChronicleEvent {
  id: string;
  timestamp: string;
  type: EventType;
  module: ModuleName;
  entityId: string;
  entityName?: string;
  actor: { type: 'user' | 'system' | 'ai'; name: string };
  snapshot: { before?: any; after?: any };
  aiAnalysis?: AIAnalysis;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: '001',
    name: 'AGILEXUS',
    mission: 'Documentação do Sistema Automatizada',
    description: 'A professional technical documentation logo, green and white colors, minimalist vector style, symbolizing agility and code.',
    status: 'active',
    progress: 100,
    techStack: ['Markdown', 'Gemini'],
    lastUpdated: new Date().toISOString(),
    tags: ['DevTools'],
    color: 'neon-green',
    version: 'v1.0'
  },
  {
    id: '002',
    name: 'SCREEN DEV',
    mission: 'Sistema de Gravação de Tela e Resumo Automático',
    description: 'A modern video and AI logo, magenta and white, featuring a screen or lens icon, digital abstract style.',
    status: 'active',
    progress: 85,
    techStack: ['Electron', 'Gemini API'],
    lastUpdated: new Date().toISOString(),
    tags: ['Tool'],
    color: 'neon-magenta',
    version: 'v1.0'
  },
  {
    id: '003',
    name: 'A.I.R.A.',
    mission: 'Artificial Intelligence Recruitment Agent',
    description: 'A neural network head logo, cyan and dark grey, tech corporate style, symbolizing recruitment and intelligence.',
    status: 'active',
    progress: 90,
    techStack: ['Python', 'OpenAI', 'Next.js'],
    lastUpdated: new Date().toISOString(),
    tags: ['HR'],
    color: 'neon-cyan',
    version: 'v2.4'
  },
  {
    id: '004',
    name: 'M.A.I.A.',
    mission: 'Multi-Agent Intelligent Architecture',
    description: 'Abstract geometric agents logo, magenta and purple, interconnected nodes, futuristic architecture style.',
    status: 'active',
    progress: 70,
    techStack: ['LangChain', 'TypeScript'],
    lastUpdated: new Date().toISOString(),
    tags: ['Framework'],
    color: 'neon-magenta',
    version: 'v0.8'
  },
  {
    id: '005',
    name: 'SENTHEON CORE',
    mission: 'Neural Interface System',
    description: 'Cyberpunk core reactor logo, neon yellow and black, glowing energy center, high-tech interface style.',
    status: 'active',
    progress: 95,
    techStack: ['React', 'TypeScript', 'Gemini'],
    lastUpdated: new Date().toISOString(),
    tags: ['Core'],
    color: 'neon-yellow',
    version: 'v4.0'
  },
  {
    id: '006',
    name: 'FRETES BAHIA',
    mission: 'Logística e Transporte Regional',
    description: 'A logistics truck and map pin logo, orange and white, dynamic motion lines, regional delivery style.',
    status: 'active',
    progress: 45,
    techStack: ['Node.js', 'Google Maps API'],
    lastUpdated: new Date().toISOString(),
    tags: ['Logistics'],
    color: 'neon-orange',
    version: 'v1.0'
  },
  {
    id: '007',
    name: 'OBRAMETRIC',
    mission: 'Gestão Métrica de Obras Civis',
    description: 'A blueprint and ruler logo, blue and white, engineering precision style, clean lines.',
    status: 'active',
    progress: 82,
    techStack: ['React', 'Supabase'],
    lastUpdated: new Date().toISOString(),
    tags: ['Engineering'],
    color: 'neon-blue',
    version: 'v2.1'
  },
  {
    id: '008',
    name: 'THE INTERPRET',
    mission: 'Sistema de Tradução e Interpretação Contextual',
    description: 'Two speech bubbles merging, white and grey, communication and translation icon, modern minimal style.',
    status: 'active',
    progress: 30,
    techStack: ['TensorFlow', 'Python'],
    lastUpdated: new Date().toISOString(),
    tags: ['Accessibility'],
    color: 'neon-white',
    version: 'v0.2'
  },
  {
    id: '009',
    name: 'D.I.A.S.',
    mission: 'Data Intelligence & Analytics System',
    description: 'Abstract data bars and pie charts logo, magenta and black, data analytics professional style.',
    status: 'active',
    progress: 88,
    techStack: ['Python', 'Tableau'],
    lastUpdated: new Date().toISOString(),
    tags: ['BI'],
    color: 'neon-magenta',
    version: 'v3.5'
  },
  {
    id: '010',
    name: 'AG.M.D-APVO',
    mission: 'Agente de Mídia e Comunicação (APVO)',
    description: 'A broadcast tower and megaphone logo, green and black, communication and media style.',
    status: 'active',
    progress: 92,
    techStack: ['Automation', 'Marketing'],
    lastUpdated: new Date().toISOString(),
    tags: ['Media'],
    color: 'neon-green',
    version: 'v1.5'
  },
  {
    id: '011',
    name: 'MEU PORTFÓLIO NA NUVEM',
    mission: 'Hospedagem e Vitrine Digital',
    description: 'A cloud and browser window logo, blue and white, cloud hosting modern style.',
    status: 'active',
    progress: 100,
    techStack: ['Vercel', 'Next.js'],
    lastUpdated: new Date().toISOString(),
    tags: ['Deployment'],
    color: 'neon-blue',
    version: 'v1.0'
  },
  {
    id: '012',
    name: 'C.E.C.I.L.',
    mission: 'Centralized Entity for Computational Intelligence',
    description: 'A sophisticated AI brain within a circle, white and chrome, premium computational intelligence style.',
    status: 'active',
    progress: 98,
    techStack: ['Node.js', 'PostgreSQL'],
    lastUpdated: new Date().toISOString(),
    tags: ['Core'],
    color: 'neon-white',
    version: 'v1.1'
  }
];
