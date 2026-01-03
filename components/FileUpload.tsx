
import React, { useState, useCallback } from 'react';
import { Upload, FileText, AlertCircle, Loader2, Sparkles, Database } from 'lucide-react';
import { Logo } from './Logo';
import { SchemaInfo, DataRow } from '../types';
import { calculateDataHealth, calculateStats } from '../services/geminiService';

interface FileUploadProps {
  onDataLoaded: (data: DataRow[], schema: SchemaInfo) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onDataLoaded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processFile = (file: File) => {
    if (!file.name.endsWith('.csv')) {
      setError('System restricted: Only CSV supported.');
      return;
    }

    setLoading(true);
    setError(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim());
        if (lines.length < 2) throw new Error("Dataset nodes missing content");

        const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
        const rows: DataRow[] = [];

        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
          const row: DataRow = {};
          headers.forEach((h, idx) => {
            const val = values[idx];
            const num = Number(val);
            row[h] = isNaN(num) || val === "" ? val : num;
          });
          rows.push(row);
        }

        const types: Record<string, 'string' | 'number' | 'date'> = {};
        headers.forEach(h => {
          const sample = rows.find(r => r[h] !== null && r[h] !== "")?.[h];
          if (typeof sample === 'number') types[h] = 'number';
          else if (sample && !isNaN(Date.parse(sample)) && String(sample).includes('-')) types[h] = 'date';
          else types[h] = 'string';
        });

        const quality = calculateDataHealth(rows, headers);
        const stats = calculateStats(rows, types);

        const schema: SchemaInfo = {
          columns: headers,
          types,
          sampleRows: rows.slice(0, 3),
          totalRows: rows.length,
          quality,
          stats
        };

        onDataLoaded(rows, schema);
      } catch (err) {
        setError('Extraction failed: Ensure valid comma-delimited structure.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsText(file);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-[600px] w-full max-w-5xl mx-auto">
      <div className="text-center mb-12 space-y-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-2 border border-blue-100">
          Neural Ingest System
        </div>
        <h2 className="text-5xl font-[900] text-slate-900 tracking-tight leading-tight">Sync Your <span className="sense-text-gradient">Intelligence.</span></h2>
        <p className="text-slate-500 max-w-xl mx-auto text-xl font-medium leading-relaxed">Drop your structured records into our neural engine to begin automated cleaning, profiling, and insight generation.</p>
      </div>

      <label
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
        className={`relative w-full border-[3px] border-dashed rounded-[60px] transition-all duration-500 flex flex-col items-center justify-center cursor-pointer group bg-white shadow-2xl shadow-slate-200/50 overflow-hidden py-24
          ${isDragging ? 'border-blue-500 bg-blue-50/20 scale-[1.02]' : 'border-slate-200 hover:border-blue-400 hover:bg-slate-50/30'}
          ${loading ? 'pointer-events-none' : ''}
        `}
      >
        <input type="file" className="hidden" accept=".csv" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
        
        {loading ? (
          <div className="flex flex-col items-center gap-8">
            <div className="relative">
              <div className="w-24 h-24 border-4 border-blue-100 rounded-full animate-ping absolute inset-0"></div>
              <Loader2 className="w-24 h-24 text-blue-600 animate-spin relative z-10" />
            </div>
            <div className="space-y-2 text-center">
              <p className="text-2xl font-black text-slate-900 tracking-tight">Processing Lifecycle</p>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Step 2: Cleaning & Validation...</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center px-12">
            <div className={`w-32 h-32 rounded-[40px] mb-10 transition-all transform group-hover:scale-110 group-hover:-rotate-3 flex items-center justify-center shadow-2xl ${isDragging ? 'sense-gradient rotate-6' : 'bg-slate-900'}`}>
              <Logo className="w-20 h-20" />
            </div>
            <p className="text-3xl font-[900] text-slate-900 tracking-tight">Deploy CSV Files</p>
            <p className="text-slate-400 mt-4 font-bold text-lg">Click to browse or drag records here</p>
            
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center text-slate-400">
                    <Database className="w-4 h-4" />
                  </div>
                ))}
              </div>
              <p className="text-sm font-bold text-slate-400">Trusted by data teams worldwide</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 px-6 py-3 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-3 text-red-600 font-bold text-sm shadow-lg animate-in slide-in-from-bottom duration-300">
            <AlertCircle className="w-5 h-5" />
            {error}
          </div>
        )}
      </label>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-10 w-full">
        {[
          { icon: Sparkles, title: 'Data Cleaning', desc: 'Step 2: Automated outlier and duplicate remediation.' },
          { icon: FileText, title: 'Smart Profiling', desc: 'Step 9: High-fidelity statistical distribution modeling.' },
          { icon: Database, title: 'Neural Storage', desc: 'Step 4: Vector-optimized indexing for rapid chat retrieval.' },
        ].map((feat, i) => (
          <div key={i} className="bg-white/50 backdrop-blur-sm p-8 rounded-[36px] border border-slate-200/50 shadow-sm flex flex-col gap-5 hover:border-blue-200 hover:bg-white transition-all duration-300 group">
            <div className={`w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
              <feat.icon className="w-7 h-7" />
            </div>
            <div>
              <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">{feat.title}</h4>
              <p className="text-sm text-slate-500 mt-2 font-semibold leading-relaxed">{feat.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
