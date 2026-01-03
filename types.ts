
export interface DataRow {
  [key: string]: any;
}

export interface DataQualityReport {
  missingValues: Record<string, number>;
  duplicateRows: number;
  unusualValues: string[];
  healthScore: number;
  cleaningActions: string[];
}

export interface StatisticalSummary {
  mean: Record<string, number>;
  median: Record<string, number>;
  stdDev: Record<string, number>;
  min: Record<string, number>;
  max: Record<string, number>;
}

export interface SchemaInfo {
  columns: string[];
  types: Record<string, 'string' | 'number' | 'date'>;
  sampleRows: DataRow[];
  totalRows: number;
  quality?: DataQualityReport;
  stats?: StatisticalSummary;
}

export interface AnalysisResponse {
  insight: string;
  chartType: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'histogram' | 'none';
  xAxis: string;
  yAxis: string;
  aggregation?: 'sum' | 'average' | 'count' | 'max' | 'min' | 'bin';
  binCount?: number;
  explanation: string;
  followUpSuggestions: string[];
  businessRecommendation?: string;
  statisticalSignificance?: string;
  transformationStep?: string;
}

export interface SavedInsight {
  id: string;
  title: string;
  analysis: AnalysisResponse;
  data: any[];
  timestamp: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  analysis?: AnalysisResponse;
  data?: any[];
  timestamp: number;
}

export type ColorPalette = {
  name: string;
  colors: string[];
};

export const PALETTES: ColorPalette[] = [
  { name: 'Sense Azure', colors: ['#00d2ff', '#3a7bd5', '#1cb5e0', '#000046', '#0072ff'] },
  { name: 'Deep Space', colors: ['#0f172a', '#1e293b', '#334155', '#475569', '#64748b'] },
  { name: 'Cyber Teal', colors: ['#00f2fe', '#4facfe', '#00c6ff', '#0072ff', '#30cfd0'] },
  { name: 'Midnight', colors: ['#232526', '#414345', '#485563', '#29323c', '#000000'] },
];
