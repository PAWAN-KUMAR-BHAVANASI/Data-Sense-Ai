
import React, { useMemo, useState } from 'react';
import { SchemaInfo, DataRow, SavedInsight, ColorPalette } from '../types';
import { 
  TrendingUp, Users, DollarSign, Activity, FileText, ChevronRight, Layout, Trash2, 
  Calendar, ShieldCheck, BarChart3, Info, Lightbulb, Wand2, ArrowRight, Settings2,
  Filter, X, MousePointer2, Clock, Globe, BarChart, Table as TableIcon, PieChart,
  HelpCircle, MoreHorizontal, Search
} from 'lucide-react';
import { ChartRenderer } from './ChartRenderer';

interface DashboardProps {
  data: DataRow[];
  schema: SchemaInfo;
  onSwitchToChat: () => void;
  triggerChatQuery: (query: string) => void;
  savedInsights: SavedInsight[];
  onRemoveInsight: (id: string) => void;
  palette: ColorPalette;
}

export const Dashboard: React.FC<DashboardProps> = ({ data, schema, onSwitchToChat, triggerChatQuery, savedInsights, onRemoveInsight, palette }) => {
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'explorer'>('overview');
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  
  // Slicers / Filters State
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [histogramBinCount, setHistogramBinCount] = useState(10);

  // Identify categorical columns for Slicers (Power BI style)
  const slicerColumns = useMemo(() => {
    return schema.columns.filter(col => {
      if (schema.types[col] !== 'string') return false;
      const uniqueValues = new Set(data.map(r => r[col])).size;
      return uniqueValues > 1 && uniqueValues <= 15; // Only columns with manageable unique values
    });
  }, [schema, data]);

  // Apply Global Filters
  const filteredData = useMemo(() => {
    return data.filter(row => {
      return Object.entries(filters).every(([col, val]) => {
        if (!val) return true;
        return String(row[col]) === val;
      });
    });
  }, [data, filters]);

  // Derived Analytics from Filtered Data
  const categoricalInsights = useMemo(() => {
    const catCol = schema.columns.find(c => schema.types[c] === 'string');
    const numCol = schema.columns.find(c => schema.types[c] === 'number');
    if (!catCol || !numCol) return null;

    const counts: Record<string, number> = {};
    filteredData.forEach(row => {
      const key = row[catCol] || 'Other';
      counts[key] = (counts[key] || 0) + (parseFloat(row[numCol]) || 0);
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [filteredData, schema]);

  const distributionData = useMemo(() => {
    const numCol = schema.columns.find(c => schema.types[c] === 'number');
    if (!numCol) return null;

    const vals = filteredData.map(r => parseFloat(r[numCol])).filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (vals.length === 0) return null;
    
    const minVal = vals[0];
    const maxVal = vals[vals.length - 1];
    const range = maxVal - minVal;
    const binSize = range === 0 ? 1 : range / histogramBinCount;
    
    const bins = [];
    for (let i = 0; i < histogramBinCount; i++) {
      const start = minVal + i * binSize;
      const end = start + binSize;
      const label = `${start.toFixed(0)}-${end.toFixed(0)}`;
      const count = vals.filter(v => v >= start && (i === histogramBinCount - 1 ? v <= end : v < end)).length;
      bins.push({ name: label, value: count });
    }
    return { col: numCol, bins };
  }, [filteredData, schema, histogramBinCount]);

  // Explorer Tab View Logic
  const explorerData = useMemo(() => {
    let result = [...filteredData];
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      result = result.filter(row => 
        Object.values(row).some(val => String(val).toLowerCase().includes(lowerQuery))
      );
    }
    if (sortConfig) {
      result.sort((a, b) => {
        const valA = a[sortConfig.key];
        const valB = b[sortConfig.key];
        if (valA === valB) return 0;
        const comp = valA < valB ? -1 : 1;
        return sortConfig.direction === 'asc' ? comp : -comp;
      });
    }
    return result;
  }, [filteredData, searchQuery, sortConfig]);

  const numCols = schema.columns.filter(c => schema.types[c] === 'number').slice(0, 4);

  const handleKPIClick = (col: string) => triggerChatQuery(`Deep dive into ${col} metrics.`);
  const handleSegmentClick = (item: any) => {
    setSearchQuery(item.name);
    setActiveSubTab('explorer');
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Power BI Styled Header */}
      <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Enterprise Analytics Dashboard</h2>
            <div className="px-2 py-0.5 bg-indigo-600 text-[10px] text-white font-black rounded uppercase">v2.0</div>
          </div>
          <p className="text-slate-500 font-medium">Interactive reporting and business intelligence suite.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onSwitchToChat} 
            className="px-6 py-3 bg-slate-900 text-white font-bold rounded-2xl flex items-center gap-2 hover:bg-black transition-all shadow-lg"
          >
            <Lightbulb className="w-5 h-5" /> Generate AI Insight
          </button>
        </div>
      </div>

      {/* Slicers / Global Filters Panel */}
      {slicerColumns.length > 0 && (
        <div className="bg-slate-100/50 p-6 rounded-[32px] border border-slate-200/60 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 mr-4 text-slate-500 font-black text-[10px] uppercase tracking-widest">
            <Filter className="w-4 h-4" /> Global Slicers:
          </div>
          {slicerColumns.map(col => {
            const uniqueVals = Array.from(new Set(data.map(r => String(r[col]))));
            return (
              <div key={col} className="flex flex-col gap-1.5">
                <select 
                  value={filters[col] || ''} 
                  onChange={(e) => setFilters(prev => ({...prev, [col]: e.target.value}))}
                  className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-xs font-bold text-slate-700 focus:ring-2 focus:ring-indigo-100 outline-none min-w-[140px]"
                >
                  <option value="">All {col}s</option>
                  {uniqueVals.map(val => <option key={val} value={val}>{val}</option>)}
                </select>
              </div>
            );
          })}
          {Object.keys(filters).some(k => filters[k]) && (
            <button 
              onClick={() => setFilters({})} 
              className="px-4 py-2 text-xs font-black text-red-600 hover:bg-red-50 rounded-xl transition-all flex items-center gap-2"
            >
              <X className="w-4 h-4" /> Clear Filters
            </button>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex bg-slate-200/50 p-1.5 rounded-[20px] w-fit">
        <button 
          onClick={() => setActiveSubTab('overview')}
          className={`px-6 py-2.5 rounded-[14px] text-sm font-black transition-all flex items-center gap-2 ${activeSubTab === 'overview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <BarChart className="w-4 h-4" /> Report Canvas
        </button>
        <button 
          onClick={() => setActiveSubTab('explorer')}
          className={`px-6 py-2.5 rounded-[14px] text-sm font-black transition-all flex items-center gap-2 ${activeSubTab === 'explorer' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          <TableIcon className="w-4 h-4" /> Data Matrix
        </button>
      </div>

      {activeSubTab === 'overview' ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {numCols.map((col, idx) => {
              const vals = filteredData.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
              const total = vals.reduce((a, b) => a + b, 0);
              const avg = total / (vals.length || 1);
              return (
                <div 
                  key={col} 
                  onClick={() => handleKPIClick(col)}
                  className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm hover:shadow-xl transition-all cursor-pointer group hover:-translate-y-1"
                >
                  <div className="flex justify-between items-start mb-6">
                    <div className="p-3 rounded-2xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                      {idx === 0 ? <Users className="w-6 h-6" /> : idx === 1 ? <DollarSign className="w-6 h-6" /> : idx === 2 ? <TrendingUp className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <MoreHorizontal className="text-slate-300 w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{col}</p>
                    <h3 className="text-3xl font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {total > 1000000 ? `${(total/1000000).toFixed(1)}M` : total.toLocaleString()}
                    </h3>
                  </div>
                  <div className="mt-6 pt-6 border-t border-slate-50 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[9px] font-black text-slate-400 uppercase">Average</p>
                      <p className="text-sm font-bold text-slate-700">{avg.toLocaleString(undefined, { maximumFractionDigits: 1 })}</p>
                    </div>
                    <span className="text-emerald-500 text-[10px] font-black flex items-center gap-1">
                       <TrendingUp className="w-3 h-3" /> ROI Focus
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-10 py-8 border-b border-slate-50 flex items-center justify-between">
                <div className="space-y-1">
                  <h3 className="font-black text-xl text-slate-800">Time Series Analysis</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-indigo-500" /> Progression of {numCols[0]}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <HelpCircle className="w-3.5 h-3.5" /> Trend Logic
                  </div>
                </div>
              </div>
              <div className="p-10 flex-1 min-h-[400px]">
                {numCols.length > 0 ? (
                  <ChartRenderer 
                    palette={palette} 
                    type="area" 
                    data={filteredData.slice(0, 30).map((r, i) => ({ name: i, value: parseFloat(r[numCols[0]]) }))} 
                    xAxis="name" 
                    yAxis={numCols[0]} 
                  />
                ) : <div className="h-full flex items-center justify-center text-slate-300">Data required</div>}
              </div>
            </div>

            <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="px-10 py-8 border-b border-slate-50">
                <h3 className="font-black text-xl text-slate-800">Market Segmentation</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                   <PieChart className="w-3 h-3 text-indigo-500" /> Share of Distribution
                </p>
              </div>
              <div className="p-10 flex-1 flex flex-col items-center">
                <div className="h-[280px] w-full">
                  {categoricalInsights ? (
                    <ChartRenderer palette={palette} type="pie" data={categoricalInsights} xAxis="name" yAxis="value" onItemClick={handleSegmentClick} />
                  ) : <div className="h-full flex items-center justify-center text-slate-300 italic">No segments</div>}
                </div>
                <div className="w-full space-y-4 mt-8">
                  {categoricalInsights?.slice(0, 4).map((item, i) => (
                    <div key={item.name} className="flex items-center justify-between w-full p-4 bg-slate-50 rounded-2xl group cursor-pointer hover:bg-indigo-50 transition-all" onClick={() => handleSegmentClick(item)}>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full" style={{ background: palette.colors[i % palette.colors.length] }} />
                        <span className="text-xs font-black text-slate-600 group-hover:text-indigo-600 transition-colors truncate max-w-[140px]">{item.name}</span>
                      </div>
                      <span className="text-sm font-black text-slate-900">{((item.value / (categoricalInsights.reduce((a, b) => a + b.value, 0) || 1)) * 100).toFixed(0)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
             {/* Distribution Widget */}
            <div className="lg:col-span-1 bg-white p-10 rounded-[48px] border border-slate-100 shadow-sm space-y-8 flex flex-col">
              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-800">Frequency Analysis</h3>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Step 8: Statistical Spread</p>
              </div>
              
              {distributionData ? (
                <div className="space-y-6 flex-1 flex flex-col">
                  <div className="h-[240px]">
                    <ChartRenderer palette={palette} type="histogram" data={distributionData.bins} xAxis="name" yAxis="Frequency" />
                  </div>
                  
                  <div className="space-y-3 pt-4 border-t border-slate-50">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Settings2 className="w-3.5 h-3.5" />
                      Bin Sensitivity: {histogramBinCount}
                    </label>
                    <input 
                      type="range" min="5" max="30" step="1" 
                      value={histogramBinCount} 
                      onChange={(e) => setHistogramBinCount(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                    />
                  </div>
                </div>
              ) : null}
            </div>

            {/* Custom Saved Reports Matrix */}
            <div className="lg:col-span-2 bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden p-10 flex flex-col justify-center space-y-8">
               <div className="space-y-2">
                 <h3 className="text-2xl font-black text-slate-900 tracking-tight">Enterprise Reporting Summary</h3>
                 <p className="text-slate-500 font-medium leading-relaxed">Filtered data subset includes {filteredData.length.toLocaleString()} records representing {((filteredData.length/data.length)*100).toFixed(1)}% of total universe.</p>
               </div>
               
               <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Dimensions</p>
                   <p className="text-xl font-black text-slate-800">{schema.columns.length}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Health</p>
                   <p className="text-xl font-black text-emerald-500">{schema.quality?.healthScore}%</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Pinned</p>
                   <p className="text-xl font-black text-indigo-500">{savedInsights.length}</p>
                 </div>
                 <div className="space-y-1">
                   <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Calculations</p>
                   <p className="text-xl font-black text-slate-800">Active</p>
                 </div>
               </div>

               <div className="p-6 bg-indigo-50 rounded-[32px] border border-indigo-100 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
                     <Wand2 className="w-6 h-6" />
                   </div>
                   <div>
                     <p className="font-black text-slate-900">AI Data Concierge</p>
                     <p className="text-xs font-bold text-slate-500">Transform your reporting into actionable strategy.</p>
                   </div>
                 </div>
                 <button onClick={onSwitchToChat} className="bg-white text-indigo-600 font-black text-xs px-6 py-3 rounded-xl border border-indigo-100 shadow-sm hover:shadow-md transition-all">
                    Launch Chat
                 </button>
               </div>
            </div>
          </div>
        </div>
      ) : (
        /* Data Explorer Sub-View (Power BI Matrix Table Style) */
        <div className="bg-white rounded-[48px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-[600px] animate-in slide-in-from-bottom duration-500">
          <div className="px-10 py-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <h3 className="font-black text-slate-800 text-xl">Full Data Matrix</h3>
              <div className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-full uppercase">Row Context: {explorerData.length}</div>
            </div>
            <div className="relative max-w-sm w-full">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search across columns..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-3.5 pl-12 pr-6 focus:ring-4 focus:ring-indigo-100 outline-none transition-all text-sm font-bold"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 sticky top-0 z-10">
                <tr>
                  <th className="px-10 py-5 font-black text-slate-400 uppercase tracking-widest text-[9px] border-b border-slate-100">Index</th>
                  {schema.columns.map(col => (
                    <th 
                      key={col} 
                      onClick={() => setSortConfig(s => ({ key: col, direction: s?.key === col && s.direction === 'asc' ? 'desc' : 'asc' }))}
                      className="px-8 py-5 font-black text-slate-500 uppercase tracking-widest text-[9px] border-b border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        {col}
                        <TrendingUp className={`w-3 h-3 ${sortConfig?.key === col ? 'text-indigo-600 opacity-100' : 'opacity-0 group-hover:opacity-40'}`} />
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {explorerData.map((row, i) => (
                  <tr 
                    key={i} 
                    onClick={() => setSelectedRowIndex(data.indexOf(row))}
                    className="hover:bg-indigo-50/40 cursor-pointer transition-colors"
                  >
                    <td className="px-10 py-5 text-slate-300 font-mono text-xs">{data.indexOf(row) + 1}</td>
                    {schema.columns.map(col => (
                      <td key={col} className="px-8 py-5 text-slate-600 font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px]">
                        {String(row[col])}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
