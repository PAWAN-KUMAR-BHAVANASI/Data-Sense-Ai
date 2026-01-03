
import React from 'react';
import { 
  BarChart3, LineChart, PieChart, Activity, 
  Lightbulb, BookOpen, Zap 
} from 'lucide-react';

export const GuideSection: React.FC = () => {
  const chartTypes = [
    {
      title: "Bar Matrix",
      icon: BarChart3,
      desc: "Comparative magnitude analysis across discrete categorical groups.",
      example: "Scenario: Sales volume comparison between Global Regions.",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Temporal Line",
      icon: LineChart,
      desc: "Visualizes momentum and trends across a time-series dimension.",
      example: "Scenario: Quarterly revenue acceleration tracking.",
      color: "bg-cyan-50 text-cyan-600"
    },
    {
      title: "Segment Pie",
      icon: PieChart,
      desc: "Proportional composition within a single logical universe.",
      example: "Scenario: Market share distribution among competitors.",
      color: "bg-slate-900 text-white"
    },
    {
      title: "Histogram",
      icon: Activity,
      desc: "Statistical distribution mapping frequency across value ranges.",
      example: "Scenario: Analysis of user session duration frequency.",
      color: "bg-blue-500 text-white shadow-lg shadow-blue-200"
    }
  ];

  const lifecycleSteps = [
    { id: 1, name: "Collection", desc: "Strategic gathering of raw data nodes from siloed environments." },
    { id: 2, name: "Cleaning", desc: "Remediating anomalies, duplicates, and inconsistent data points." },
    { id: 3, name: "Transformation", desc: "Normalization and type-conversion for analytical consistency." },
    { id: 4, name: "Integration", desc: "Synthesizing disparate inputs into a unified intelligence layer." },
    { id: 5, name: "Exploration (EDA)", desc: "Pattern recognition and trend scouting within the refined data." },
    { id: 6, name: "Filtering", desc: "Precision isolation of relevant nodes for targeted queries." },
    { id: 7, name: "Aggregation", desc: "Computational summarization across multi-dimensional axes." },
    { id: 8, name: "Visualization", desc: "Transforming tabular records into strategic visual narratives." },
    { id: 9, name: "Statistics", desc: "Mathematical verification of findings and distribution health." },
    { id: 10, name: "Insight Generation", desc: "Translating computational results into tactical business logic." },
    { id: 11, name: "Reporting", desc: "Deploying finalized visuals to executive control centers." },
    { id: 12, name: "Decision Support", desc: "Leveraging refined intelligence for high-impact strategic shifts." },
  ];

  return (
    <div className="space-y-20 pb-24 max-w-6xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center gap-3 px-5 py-2 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-[0.25em] mb-4 border border-blue-100 shadow-sm">
          <BookOpen className="w-4 h-4" />
          Neural Literacy Hub
        </div>
        <h2 className="text-5xl font-[900] text-slate-900 tracking-tight leading-tight">Mastering Data <span className="sense-text-gradient">Sense.</span></h2>
        <p className="text-slate-500 text-xl max-w-2xl mx-auto font-medium leading-relaxed">
          The tactical guide to converting raw signals into refined strategic intelligence.
        </p>
      </div>

      {/* Meaning & Importance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="bg-white p-10 rounded-[48px] border border-slate-200/60 shadow-xl shadow-slate-200/20 space-y-6 group hover:border-blue-200 transition-all">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Intelligence Architecture</h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            DataSense AI treats information as architecture. We decode complex numerical structures into clear visual pathways, allowing your brain to process market shifts 60,000x faster than text.
          </p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[48px] border border-slate-800 shadow-2xl space-y-6 group">
          <div className="w-16 h-16 bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-blue-500/20">
            <Lightbulb className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-black text-white tracking-tight">The Competitive Edge</h3>
          <p className="text-slate-400 leading-relaxed font-medium">
            Visualization is more than aesthetics; it is a strategic decision weapon. Spotting an outlier 2 seconds before a competitor can mean millions in operational efficiency.
          </p>
        </div>
      </div>

      {/* Common Chart Types */}
      <div className="space-y-10">
        <div className="flex items-center gap-4">
          <h3 className="text-3xl font-[900] text-slate-900 tracking-tight">Visual Frameworks</h3>
          <div className="h-px flex-1 bg-slate-100"></div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {chartTypes.map((chart) => (
            <div key={chart.title} className="bg-white p-8 rounded-[40px] border border-slate-200/60 shadow-sm group hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500">
              <div className={`w-14 h-14 ${chart.color} rounded-2xl flex items-center justify-center mb-8 transition-transform group-hover:scale-110 group-hover:rotate-3`}>
                <chart.icon className="w-7 h-7" />
              </div>
              <h4 className="text-lg font-black text-slate-900 mb-3">{chart.title}</h4>
              <p className="text-sm text-slate-500 mb-6 font-semibold leading-relaxed">{chart.desc}</p>
              <div className="p-4 bg-slate-50 rounded-2xl text-[11px] font-bold text-slate-600 border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                {chart.example}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 12-Step Lifecycle */}
      <div className="space-y-12 bg-white rounded-[60px] border border-slate-200/60 p-12 md:p-16 shadow-2xl shadow-slate-200/30">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 border-b border-slate-100 pb-10">
          <div className="space-y-2">
            <h3 className="text-3xl font-[900] text-slate-900 tracking-tight">The Data Lifecycle</h3>
            <p className="text-slate-500 font-bold text-lg">Standard Protocol for Intelligence Maturity</p>
          </div>
          <div className="px-6 py-3 bg-slate-900 text-blue-400 rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl">
            12 Tactical Milestones
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
          {lifecycleSteps.map((step) => (
            <div key={step.id} className="flex gap-6 group">
              <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 text-slate-400 flex items-center justify-center text-sm font-[900] group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-blue-200">
                {step.id}
              </div>
              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-lg group-hover:text-blue-700 transition-colors flex items-center gap-2">
                  {step.name}
                  {step.id === 12 && <Zap className="w-4 h-4 text-blue-500" />}
                </h4>
                <p className="text-sm text-slate-500 font-semibold leading-relaxed">
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
