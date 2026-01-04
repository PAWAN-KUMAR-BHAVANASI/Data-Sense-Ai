
import React from 'react';
import { LayoutDashboard, FileSpreadsheet, MessageSquare, LogOut, GraduationCap, ChevronRight } from 'lucide-react';
import { ColorPalette } from '../types';

interface SidebarProps {
  activeTab: 'upload' | 'dashboard' | 'chat' | 'guide';
  setActiveTab: (tab: 'upload' | 'dashboard' | 'chat' | 'guide') => void;
  hasData: boolean;
  resetData: () => void;
  palette: ColorPalette;
  isDarkMode?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, hasData, resetData, palette, isDarkMode = false }) => {
  const mainColor = palette.colors[0];
  
  const navItems = [
    { id: 'upload', icon: FileSpreadsheet, label: 'Data Ingest' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Control Center' },
    { id: 'chat', icon: MessageSquare, label: 'Neural Chat' },
    { id: 'guide', icon: GraduationCap, label: 'Logic Hub' },
  ];

  return (
    <aside className={`w-72 border-r flex flex-col shrink-0 transition-colors ${isDarkMode ? 'border-slate-700/50 bg-slate-800' : 'border-slate-200/60 bg-white'}`}>
      <div className="flex-1 px-4 py-8">
        <div className="space-y-2">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const isDisabled = !hasData && (item.id === 'dashboard' || item.id === 'chat');
            
            return (
              <button
                key={item.id}
                disabled={isDisabled}
                onClick={() => setActiveTab(item.id as any)}
                className={`w-full group flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${
                  isActive 
                    ? isDarkMode ? 'bg-blue-900 text-white shadow-xl shadow-blue-900/30' : 'bg-slate-900 text-white shadow-xl shadow-slate-200' 
                    : isDisabled
                    ? isDarkMode ? 'text-slate-600 cursor-not-allowed grayscale' : 'text-slate-300 cursor-not-allowed grayscale'
                    : isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-xl transition-colors ${isActive ? 'bg-white/10' : 'bg-transparent'}`}>
                    <item.icon className={`w-5 h-5 ${isActive ? 'text-blue-400' : 'group-hover:text-blue-500 transition-colors'}`} />
                  </div>
                  <span className={`text-sm tracking-tight ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-400" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className={`p-6 border-t mt-auto transition-colors ${isDarkMode ? 'border-slate-700 ' : 'border-slate-100 '}`}>
        <div className={`rounded-[28px] p-5 mb-8 border transition-colors ${isDarkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
          <p className={`text-[10px] font-black uppercase tracking-[0.2em] mb-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-400'}`}>Operator</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl sense-gradient flex items-center justify-center text-white text-sm font-black shadow-lg shadow-blue-100">JD</div>
            <div>
              <p className={`text-sm font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>John Doe</p>
              <p className={`text-[10px] font-semibold px-2 py-0.5 rounded-full inline-block mt-0.5 transition-colors ${isDarkMode ? 'text-slate-300 bg-slate-800 border-slate-600' : 'text-slate-500 bg-white border-slate-100'} border`}>Enterprise</p>
            </div>
          </div>
        </div>
        
        <button 
          onClick={resetData}
          className={`w-full flex items-center gap-3 p-4 rounded-2xl transition-all font-bold text-sm ${isDarkMode ? 'text-slate-400 hover:text-red-400 hover:bg-red-900/30' : 'text-slate-400 hover:text-red-600 hover:bg-red-50'}`}
        >
          <LogOut className="w-5 h-5" />
          <span>Purge Workspace</span>
        </button>
      </div>
    </aside>
  );
};
