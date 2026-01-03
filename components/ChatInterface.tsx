
import React, { useState, useRef, useEffect } from 'react';
import { SchemaInfo, DataRow, ChatMessage, SavedInsight, ColorPalette } from '../types';
import { analyzeDataQuery, executeDataPlan } from '../services/geminiService';
import { Send, Sparkles, Loader2, User, BarChart3, Info, BookmarkPlus, CheckCircle, Lightbulb, Wand2 } from 'lucide-react';
import { ChartRenderer } from './ChartRenderer';

interface ChatInterfaceProps {
  data: DataRow[];
  schema: SchemaInfo;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  onSaveInsight: (insight: SavedInsight) => void;
  palette: ColorPalette;
  savedInsightsCount: number;
  pendingQuery?: string | null;
  onClearPendingQuery?: () => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  data, schema, messages, setMessages, onSaveInsight, palette, savedInsightsCount, 
  pendingQuery, onClearPendingQuery 
}) => {
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, isLoading]);

  const handleSend = async (text: string = input) => {
    if (!text.trim() || isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text, timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(m => ({ role: m.role, content: m.content }));
      const analysis = await analyzeDataQuery(text, schema, history);
      const processedData = executeDataPlan(data, analysis);
      const aiMsg: ChatMessage = { id: (Date.now() + 1).toString(), role: 'assistant', content: analysis.insight, analysis, data: processedData, timestamp: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'assistant', content: "Failed to process data. Ensure the query is valid.", timestamp: Date.now() }]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (pendingQuery && !isLoading) {
      handleSend(pendingQuery);
      onClearPendingQuery?.();
    }
  }, [pendingQuery, isLoading, onClearPendingQuery]);

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] bg-white rounded-[48px] border border-slate-100 overflow-hidden shadow-2xl relative">
      <div className="absolute top-6 right-10 z-20">
        <div className="flex items-center gap-3 px-4 py-2 bg-slate-900 text-white rounded-2xl shadow-xl shadow-slate-100">
          <BookmarkPlus className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-black uppercase tracking-widest">{savedInsightsCount} Pinned Insights</span>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-12 pt-20">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-6 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'assistant' && (
              <div className="w-12 h-12 rounded-2xl sense-gradient flex items-center justify-center shrink-0 shadow-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
            )}
            
            <div className={`max-w-[85%] space-y-6 ${msg.role === 'user' ? 'order-first' : ''}`}>
              <div className={`p-6 rounded-[32px] ${msg.role === 'user' ? 'bg-slate-900 text-white shadow-xl' : 'bg-slate-50 text-slate-800 border border-slate-100'}`}>
                <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{msg.content}</p>
              </div>

              {msg.analysis && msg.data && msg.analysis.chartType !== 'none' && (
                <div className="bg-white p-8 rounded-[48px] border border-slate-100 shadow-2xl space-y-8 group relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
                        <BarChart3 className="w-6 h-6" />
                      </div>
                      <h4 className="font-black text-slate-800 text-xl capitalize">{msg.analysis.chartType} Visual</h4>
                    </div>
                    <button onClick={() => !savedIds.has(msg.id) && (onSaveInsight({ id: msg.id, title: msg.analysis!.xAxis + ' vs ' + msg.analysis!.yAxis, analysis: msg.analysis!, data: msg.data!, timestamp: Date.now() }), setSavedIds(prev => new Set(prev).add(msg.id)))} className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-sm font-black transition-all ${savedIds.has(msg.id) ? 'bg-blue-100 text-blue-700 cursor-default' : 'bg-slate-100 text-slate-800 hover:bg-slate-200'}`}>
                      {savedIds.has(msg.id) ? <><CheckCircle className="w-4 h-4" />Pinned</> : <><BookmarkPlus className="w-4 h-4" />Pin to Dashboard</>}
                    </button>
                  </div>

                  {msg.analysis.transformationStep && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 uppercase tracking-widest px-2">
                       <Wand2 className="w-3.5 h-3.5" />
                       Step 3 Transformation: {msg.analysis.transformationStep}
                    </div>
                  )}

                  <div className="h-[340px]">
                    <ChartRenderer palette={palette} type={msg.analysis.chartType} data={msg.data} xAxis={msg.analysis.xAxis} yAxis={msg.analysis.yAxis} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-6 rounded-[32px] border border-slate-100">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Info className="w-3.5 h-3.5 text-blue-500" /> Statistical Significance
                      </p>
                      <p className="text-sm text-slate-700 font-medium leading-relaxed italic">
                        {msg.analysis.statisticalSignificance || "Step 9 identifies consistent data patterns in this range."}
                      </p>
                    </div>
                    <div className="bg-blue-50/50 p-6 rounded-[32px] border border-blue-100/50">
                      <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                         <Lightbulb className="w-3.5 h-3.5" /> Step 12: Decision Support
                      </p>
                      <p className="text-sm text-slate-800 font-bold leading-relaxed">
                        {msg.analysis.businessRecommendation}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {msg.analysis?.followUpSuggestions && (
                <div className="flex flex-wrap gap-3">
                  {msg.analysis.followUpSuggestions.map((s, idx) => (
                    <button key={idx} onClick={() => handleSend(s)} className="px-6 py-3 bg-white border border-slate-100 text-slate-700 text-sm font-black rounded-2xl hover:bg-slate-50 hover:border-blue-200 transition-all shadow-sm">
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0 border border-blue-100 shadow-sm">
                <User className="w-6 h-6 text-blue-600" />
              </div>
            )}
          </div>
        ))}
        {isLoading && <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />}
      </div>

      <div className="p-10 bg-slate-50 border-t border-slate-100">
        <div className="max-w-4xl mx-auto relative group">
          <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Ask for distributions, correlations, or trends..." className="w-full bg-white border-2 border-slate-100 rounded-3xl py-6 pl-10 pr-24 focus:ring-4 focus:ring-blue-100 focus:border-blue-400 outline-none transition-all shadow-xl font-medium text-lg placeholder:text-slate-300" />
          <button onClick={() => handleSend()} disabled={!input.trim() || isLoading} className="absolute right-4 top-1/2 -translate-y-1/2 p-4 sense-gradient text-white rounded-2xl hover:opacity-90 transition-all shadow-2xl shadow-blue-200">
            <Send className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};
