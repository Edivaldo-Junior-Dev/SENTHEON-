
import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { HiveView } from './modules/hive/HiveView';
import { ForgeView } from './modules/forge/ForgeView';
import { SettingsView } from './modules/settings/SettingsView';
import { ChronicleView } from './modules/chronicle/ChronicleView';
import { ConsultantView } from './modules/consultant/ConsultantView';
import { CodexView } from './modules/codex/CodexView';
import { ProfileView } from './modules/profile/ProfileView';
import { CRMView } from './modules/crm/CRMView';
import { SentheonAvatar } from './components/SentheonAvatar'; 
import { SentheonLogo } from './components/SentheonLogo';
import { Hexagon, Hammer, History, Settings, User, ChevronLeft, ChevronRight, Bot, BookOpen, Home, TrendingUp } from 'lucide-react';

interface SidebarItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isCollapsed: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ to, icon, label, isCollapsed }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link to={to} className="w-full group relative block my-1">
      <div className={`flex items-center transition-all duration-300 min-h-[50px] ${isCollapsed ? 'justify-center px-0' : 'px-6 gap-4'} ${isActive ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/5'}`}>
        {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-neon-yellow shadow-[0_0_10px_rgba(255,255,0,0.8)]"></div>}
        <div className={`flex items-center justify-center transition-all duration-300 ${isActive ? 'text-neon-yellow scale-110' : 'group-hover:text-gray-300'}`}>
          {icon}
        </div>
        <div className={`overflow-hidden transition-all duration-300 whitespace-nowrap origin-left ${isCollapsed ? 'w-0 opacity-0' : 'w-auto opacity-100'}`}>
          <span className="font-cyber tracking-wider text-sm uppercase">{label}</span>
        </div>
      </div>
    </Link>
  );
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-void-dark">
      <SentheonAvatar />
      <aside className={`relative bg-black/95 border-r border-white/10 flex flex-col z-20 transition-all duration-500 ${isCollapsed ? 'w-[80px]' : 'w-[280px]'}`}>
        <button onClick={() => setIsCollapsed(!isCollapsed)} className="absolute -right-3 top-12 bg-black border border-white/20 text-neon-yellow rounded-full p-1.5 z-50">
          {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
        <div className="py-8 flex flex-col items-center border-b border-white/5">
           <Link to="/">
             <SentheonLogo size={isCollapsed ? 'sm' : 'md'} animated />
           </Link>
        </div>
        <nav className="flex-1 mt-6 overflow-y-auto custom-scrollbar">
          <SidebarItem isCollapsed={isCollapsed} to="/" icon={<Home size={24} />} label="Início" />
          <SidebarItem isCollapsed={isCollapsed} to="/hive" icon={<Hexagon size={24} />} label="Portfólio.dev" />
          <SidebarItem isCollapsed={isCollapsed} to="/crm" icon={<TrendingUp size={24} />} label="Nexus CRM" />
          <SidebarItem isCollapsed={isCollapsed} to="/forge" icon={<Hammer size={24} />} label="A Forja" />
          <SidebarItem isCollapsed={isCollapsed} to="/consultant" icon={<Bot size={24} />} label="Consultor IA" />
          <SidebarItem isCollapsed={isCollapsed} to="/chronicle" icon={<History size={24} />} label="Crônica" />
        </nav>
        <div className="p-4 border-t border-white/10">
           <SidebarItem isCollapsed={isCollapsed} to="/settings" icon={<Settings size={24} />} label="Sistema" />
        </div>
      </aside>
      <main className="flex-1 relative overflow-hidden bg-cyber-grid">{children}</main>
    </div>
  );
};

const App: React.FC = () => (
  <Router>
    <Layout>
      <Routes>
        <Route path="/" element={<ProfileView />} />
        <Route path="/hive" element={<HiveView />} />
        <Route path="/crm" element={<CRMView />} />
        <Route path="/forge" element={<ForgeView />} />
        <Route path="/chronicle" element={<ChronicleView />} />
        <Route path="/consultant" element={<ConsultantView />} />
        <Route path="/codex" element={<CodexView />} />
        <Route path="/settings" element={<SettingsView />} />
      </Routes>
    </Layout>
  </Router>
);
export default App;
