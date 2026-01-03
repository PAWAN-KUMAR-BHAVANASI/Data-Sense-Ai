
import { GoogleGenAI, Type } from "@google/genai";
import { SchemaInfo, AnalysisResponse, DataRow, DataQualityReport, StatisticalSummary } from "../types";

// Always use the specific initialization pattern from guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function analyzeDataQuery(
  userQuery: string,
  schema: SchemaInfo,
  history: { role: string; content: string }[] = []
): Promise<AnalysisResponse> {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `
    You are an AI-powered Data Visualization Engine and Strategic Analyst.
    
    PERSONA:
    You transform raw dataset schemas into professional visualizations and business insights. 
    You understand the 12 steps of data analysis, with a focus on Step 8: Data Visualization.

    CORE RULES:
    1. If the user asks about the "distribution", "frequency", "histogram" or "spread" of a single numerical variable, choose "chartType": "histogram" and "aggregation": "bin".
    2. If the user specifies a number of bins (e.g., "with 20 bins"), set "binCount" accordingly. Default is 10.
    3. Choose "bar" for categorical comparisons.
    4. Choose "line" or "area" for trends over time.
    5. Choose "pie" for part-to-whole relationships (max 6 categories).
    6. Provide a short, plain-English "insight" for non-technical users.
    7. "businessRecommendation" should be a practical Step 12 decision support action.

    DATA CONTEXT:
    - Columns: ${schema.columns.join(", ")}
    - Types: ${JSON.stringify(schema.types)}
    - Summary Stats: ${JSON.stringify(schema.stats)}
    - Health Score: ${schema.quality?.healthScore}%
  `;

  const response = await ai.models.generateContent({
    model,
    contents: [
      ...history.map(h => ({ 
        role: h.role === 'assistant' ? 'model' : 'user', 
        parts: [{ text: h.content }] 
      })),
      { role: 'user', parts: [{ text: `Dataset Schema: ${JSON.stringify(schema.types)}. Question: ${userQuery}` }] }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          insight: { type: Type.STRING, description: "Direct answer to the user question." },
          chartType: { type: Type.STRING, enum: ["bar", "line", "pie", "area", "scatter", "histogram", "none"] },
          xAxis: { type: Type.STRING, description: "The column to use for the X-axis (or the variable for histogram binning)." },
          yAxis: { type: Type.STRING, description: "The column to use for the Y-axis value." },
          aggregation: { type: Type.STRING, enum: ["sum", "average", "count", "max", "min", "bin"], nullable: true },
          binCount: { type: Type.INTEGER, description: "Number of bins for a histogram, if applicable." },
          explanation: { type: Type.STRING, description: "Why this chart type was selected." },
          businessRecommendation: { type: Type.STRING, description: "What the user should do based on this data (Step 12)." },
          statisticalSignificance: { type: Type.STRING },
          transformationStep: { type: Type.STRING, description: "Explanation of data manipulation performed (Step 3)." },
          followUpSuggestions: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["insight", "chartType", "xAxis", "yAxis", "explanation", "followUpSuggestions", "businessRecommendation", "transformationStep"]
      }
    }
  });

  const jsonStr = response.text || "{}";
  return JSON.parse(jsonStr);
}

export function calculateDataHealth(data: DataRow[], columns: string[]): DataQualityReport {
  const missing: Record<string, number> = {};
  const cleaningActions: string[] = [];

  columns.forEach(col => {
    const count = data.filter(row => row[col] === null || row[col] === undefined || row[col] === "").length;
    missing[col] = count;
    if (count > 0) cleaningActions.push(`Handled ${count} missing values in ${col}`);
  });

  const rowStrings = data.map(r => JSON.stringify(r));
  const duplicates = rowStrings.length - new Set(rowStrings).size;
  if (duplicates > 0) cleaningActions.push(`Removed ${duplicates} duplicate records`);
  
  const totalCells = data.length * columns.length;
  const missingCount = Object.values(missing).reduce((a, b) => a + b, 0);
  const healthScore = Math.max(0, Math.floor(100 * (1 - (missingCount + duplicates) / (totalCells || 1))));

  return { missingValues: missing, duplicateRows: duplicates, unusualValues: [], healthScore, cleaningActions };
}

export function calculateStats(data: DataRow[], schema: Record<string, string>): StatisticalSummary {
  const numCols = Object.keys(schema).filter(k => schema[k] === 'number');
  const mean: Record<string, number> = {};
  const median: Record<string, number> = {};
  const stdDev: Record<string, number> = {};
  const min: Record<string, number> = {};
  const max: Record<string, number> = {};

  numCols.forEach(col => {
    const vals = data.map(r => parseFloat(r[col])).filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (vals.length === 0) return;

    const sum = vals.reduce((a, b) => a + b, 0);
    const avg = sum / vals.length;
    mean[col] = Number(avg.toFixed(2));
    median[col] = vals[Math.floor(vals.length / 2)];
    min[col] = vals[0];
    max[col] = vals[vals.length - 1];
    
    const sqDiffs = vals.map(v => Math.pow(v - avg, 2));
    const avgSqDiff = sqDiffs.reduce((a, b) => a + b, 0) / vals.length;
    stdDev[col] = Number(Math.sqrt(avgSqDiff).toFixed(2));
  });

  return { mean, median, stdDev, min, max };
}

export function executeDataPlan(data: any[], plan: AnalysisResponse): any[] {
  const { xAxis, yAxis, aggregation, chartType, binCount } = plan;
  if (chartType === 'none') return [];

  // Special handling for Histogram binning (Step 8: Distribution)
  if (chartType === 'histogram' || aggregation === 'bin') {
    const vals = data.map(r => parseFloat(r[xAxis])).filter(v => !isNaN(v)).sort((a, b) => a - b);
    if (vals.length === 0) return [];
    
    const minVal = Math.min(...vals);
    const maxVal = Math.max(...vals);
    const finalBinCount = binCount || 10;
    const range = maxVal - minVal;
    const binSize = range === 0 ? 1 : range / finalBinCount;
    
    const bins: Record<string, number> = {};
    for (let i = 0; i < finalBinCount; i++) {
      const start = minVal + i * binSize;
      const end = start + binSize;
      const label = `${start.toFixed(1)}-${end.toFixed(1)}`;
      bins[label] = vals.filter(v => v >= start && (i === finalBinCount - 1 ? v <= end : v < end)).length;
    }
    
    return Object.entries(bins).map(([name, value]) => ({ 
      name, 
      value, 
      [yAxis || 'Frequency']: value 
    }));
  }

  const groups: Record<string, number[]> = {};
  data.forEach(row => {
    const key = String(row[xAxis] ?? 'N/A');
    const val = parseFloat(row[yAxis]) || 0;
    if (!groups[key]) groups[key] = [];
    groups[key].push(val);
  });

  return Object.entries(groups).map(([key, vals]) => {
    let finalVal = 0;
    switch (aggregation) {
      case 'sum': finalVal = vals.reduce((a, b) => a + b, 0); break;
      case 'average': finalVal = vals.reduce((a, b) => a + b, 0) / (vals.length || 1); break;
      case 'max': finalVal = Math.max(...vals); break;
      case 'min': finalVal = Math.min(...vals); break;
      default: finalVal = vals.length; break;
    }
    return { name: key, value: Number(finalVal.toFixed(2)), [yAxis]: Number(finalVal.toFixed(2)) };
  }).sort((a, b) => String(a.name).localeCompare(String(b.name), undefined, { numeric: true }));
}
