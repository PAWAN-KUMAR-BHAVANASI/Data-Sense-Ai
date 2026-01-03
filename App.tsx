
import React, { useState, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { FileUpload } from './components/FileUpload';
import { ChatInterface } from './components/ChatInterface';
import { GuideSection } from './components/GuideSection';
import { Logo } from './components/Logo';
import { SchemaInfo, DataRow, ChatMessage, SavedInsight, PALETTES, ColorPalette } from './types';
import { Database, Settings, Palette } from 'lucide-react';

const App: React.FC = () => {
  const [data, setData] = useState<DataRow[] | null>(null);
  const [schema, setSchema] = useState<SchemaInfo | null>(null);
  const [activeTab, setActiveTab] = useState<'upload' | 'dashboard' | 'chat' | 'guide'>('upload');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedInsights, setSavedInsights] = useState<SavedInsight[]>([]);
  const [currentPalette, setCurrentPalette] = useState<ColorPalette>(PALETTES[0]);
  const [showPalettePicker, setShowPalettePicker] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const handleDataLoaded = useCallback((rawData: DataRow[], schemaInfo: SchemaInfo) => {
    setData(rawData);
    setSchema(schemaInfo);
    setActiveTab('dashboard');
    
    const initialMsg: ChatMessage = {
      id: 'init',
      role: 'assistant',
      content: `Welcome to DataSense AI. I've successfully mapped your dataset with ${schemaInfo.totalRows} records. I'm ready to extract intelligence. What business logic shall we explore first?`,
      timestamp: Date.now()
    };
    setMessages([initialMsg]);
  }, []);

  const resetData = () => {
    setData(null);
    setSchema(null);
    setMessages([]);
    setSavedInsights([]);
    setActiveTab('upload');
  };

  const onSaveInsight = (insight: SavedInsight) => {
    setSavedInsights(prev => [insight, ...prev]);
  };

  const onRemoveInsight = (id: string) => {
    setSavedInsights(prev => prev.filter(i => i.id !== id));
  };

  const triggerChatQuery = useCallback((query: string) => {
    setPendingQuery(query);
    setActiveTab('chat');
  }, []);

  return (
    <div className="flex h-screen bg-[#f8fafc] overflow-hidden">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        hasData={!!data}
        resetData={resetData}
        palette={currentPalette}
      />

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 border-b border-slate-200/60 bg-white/80 backdrop-blur-md flex items-center justify-between px-10 shrink-0 z-20">
          <div className="flex items-center gap-4 group cursor-pointer" onClick={() => setActiveTab('upload')}>
            <Logo className="w-12 h-12 transition-transform duration-500 group-hover:scale-110" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none">DataSense <span className="sense-text-gradient">AI</span></h1>
              <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.3em] mt-1">Intelligence Refined</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
             {schema && (
               <div className="px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-xs font-bold flex items-center gap-2 border border-blue-100/50 shadow-sm">
                 <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                 {schema.totalRows.toLocaleString()} Records Active
               </div>
             )}
             
             <div className="h-6 w-px bg-slate-200"></div>

             <div className="relative">
               <button 
                onClick={() => setShowPalettePicker(!showPalettePicker)}
                className="flex items-center gap-2.5 px-3 py-2 hover:bg-slate-50 rounded-xl transition-all text-slate-600 border border-transparent hover:border-slate-100"
               >
                  <Palette className="w-5 h-5" />
                  <span className="text-sm font-semibold">{currentPalette.name}</span>
               </button>
               {showPalettePicker && (
                 <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 p-2 z-50 ring-4 ring-slate-900/5">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest p-3">Style Engine</p>
                   {PALETTES.map(p => (
                     <button
                       key={p.name}
                       onClick={() => { setCurrentPalette(p); setShowPalettePicker(false); }}
                       className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${currentPalette.name === p.name ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-600 font-medium'}`}
                     >
                       <div className="flex -space-x-1.5">
                         {p.colors.slice(0, 3).map((c, i) => (
                           <div key={i} className="w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ background: c }} />
                         ))}
                       </div>
                       <span className="text-sm">{p.name}</span>
                     </button>
                   ))}
                 </div>
               )}
             </div>

             <button className="p-2.5 hover:bg-slate-50 rounded-xl transition-all text-slate-400 hover:text-slate-600 border border-transparent hover:border-slate-100">
                <Settings className="w-5 h-5" />
             </button>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto bg-[#f8fafc]">
          <div className="max-w-[1600px] mx-auto h-full p-8 md:p-12">
            {activeTab === 'upload' && !data && (
              <FileUpload onDataLoaded={handleDataLoaded} />
            )}

            {activeTab === 'dashboard' && data && schema && (
              <Dashboard 
                data={data} 
                schema={schema} 
                onSwitchToChat={() => setActiveTab('chat')} 
                triggerChatQuery={triggerChatQuery}
                savedInsights={savedInsights}
                onRemoveInsight={onRemoveInsight}
                palette={currentPalette}
              />
            )}

            {activeTab === 'chat' && data && schema && (
              <ChatInterface 
                data={data} 
                schema={schema} 
                messages={messages}
                setMessages={setMessages}
                onSaveInsight={onSaveInsight}
                palette={currentPalette}
                savedInsightsCount={savedInsights.length}
                pendingQuery={pendingQuery}
                onClearPendingQuery={() => setPendingQuery(null)}
              />
            )}

            {activeTab === 'guide' && (
              <GuideSection />
            )}

            {activeTab === 'upload' && data && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="p-10 bg-white rounded-[48px] border border-slate-200/60 shadow-2xl flex flex-col items-center max-w-md animate-in fade-in zoom-in duration-500">
                  <div className="w-24 h-24 sense-gradient rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200/50 mb-8">
                    <Logo className="w-16 h-16" />
                  </div>
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight">System Ready</h2>
                  <p className="text-slate-500 mt-4 mb-10 text-lg font-medium">Your dataset is fully indexed and profiled. {schema?.totalRows} nodes available for analysis.</p>
                  <button 
                    onClick={() => setActiveTab('dashboard')}
                    className="w-full px-8 py-5 sense-gradient text-white font-extrabold rounded-2xl hover:opacity-90 transition-all shadow-xl shadow-blue-100 text-lg"
                  >
                    Enter Control Center
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
