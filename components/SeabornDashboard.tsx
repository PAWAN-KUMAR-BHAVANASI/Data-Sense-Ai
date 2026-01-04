import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface SeabornDashboardProps {
  data: any[];
  schema: any;
}

export const SeabornDashboard: React.FC<SeabornDashboardProps> = ({ data, schema }) => {
  const [selectedPlot, setSelectedPlot] = useState<string>('heatmap');
  const [plots, setPlots] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');

  const API_BASE = (import.meta.env?.VITE_BACKEND_URL as string) || 'http://127.0.0.1:5000';

  const numericColumns = schema?.stats?.numeric_columns || [];
  const categoricalColumns = schema?.stats?.categorical_columns || [];

  useEffect(() => {
    if (selectedPlot && !plots[selectedPlot]) {
      generatePlot(selectedPlot);
    }
  }, [selectedPlot]);

  const generatePlot = async (plotType: string) => {
    if (!data || data.length === 0) {
      setError('No data available. Please upload a CSV file first.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let endpoint = '';
      let payload: any = { data };

      switch (plotType) {
        case 'heatmap':
          endpoint = '/api/plots/heatmap';
          break;
        case 'distribution':
          if (!selectedX && numericColumns.length === 0) {
            throw new Error('No numeric columns available for distribution plot');
          }
          endpoint = '/api/plots/distribution';
          payload.column = selectedX || numericColumns[0];
          break;
        case 'scatter':
          if (numericColumns.length < 2) {
            throw new Error('Need at least 2 numeric columns for scatter plot');
          }
          endpoint = '/api/plots/scatter';
          payload.x = selectedX || numericColumns[0];
          payload.y = selectedY || numericColumns[1];
          break;
        case 'pairplot':
          endpoint = '/api/plots/pairplot';
          break;
        case 'violin':
          if (numericColumns.length === 0) {
            throw new Error('No numeric columns available for violin plot');
          }
          endpoint = '/api/plots/violin';
          payload.x = selectedX || categoricalColumns[0] || 'category';
          payload.y = selectedY || numericColumns[0];
          break;
        default:
          throw new Error('Unknown plot type');
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `HTTP ${response.status}: Failed to generate plot`);
      }

      const result = await response.json();
      if (!result.plot) {
        throw new Error('No plot data received from server');
      }
      setPlots(prev => ({ ...prev, [plotType]: `data:image/png;base64,${result.plot}` }));
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error('Plot generation error:', errorMsg);
      setError(`Failed to generate plot: ${errorMsg}`);
    } finally {
      setLoading(false);
    }
  };

  const plotTabs = [
    { id: 'heatmap', label: '🔥 Heatmap', icon: <BarChart3 size={18} /> },
    { id: 'distribution', label: '📊 Distribution', icon: <Activity size={18} /> },
    { id: 'scatter', label: '📈 Scatter', icon: <TrendingUp size={18} /> },
    { id: 'pairplot', label: '🔗 Pair Plot', icon: <BarChart3 size={18} /> },
    { id: 'violin', label: '🎻 Violin', icon: <Activity size={18} /> },
  ];

  return (
    <div className="seaborn-dashboard">
      <div className="dashboard-header">
        <h2>📊 Seaborn Analysis Dashboard</h2>
        <p className="text-gray-600">Advanced Statistical Visualizations</p>
      </div>

      {/* Plot Type Selector */}
      <div className="plot-tabs">
        {plotTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedPlot(tab.id)}
            className={`tab-button ${selectedPlot === tab.id ? 'active' : ''}`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Column Selectors */}
      <div className="column-selectors">
        {(selectedPlot === 'distribution' || selectedPlot === 'scatter') && (
          <select
            value={selectedX}
            onChange={e => setSelectedX(e.target.value)}
            className="selector-input"
          >
            <option value="">Select X Column</option>
            {numericColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        )}
        {selectedPlot === 'violin' && (
          <select
            value={selectedX}
            onChange={e => setSelectedX(e.target.value)}
            className="selector-input"
          >
            <option value="">Select Category Column</option>
            {categoricalColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        )}
        {(selectedPlot === 'scatter' || selectedPlot === 'violin') && (
          <select
            value={selectedY}
            onChange={e => setSelectedY(e.target.value)}
            className="selector-input"
          >
            <option value="">Select Y Column</option>
            {numericColumns.map(col => (
              <option key={col} value={col}>{col}</option>
            ))}
          </select>
        )}
        <button
          onClick={() => generatePlot(selectedPlot)}
          disabled={loading}
          className="refresh-button"
        >
          {loading ? 'Generating...' : 'Generate Plot'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div style={{
          background: '#fee',
          border: '1px solid #f88',
          color: '#c00',
          padding: '12px',
          borderRadius: '6px',
          marginBottom: '15px',
          fontSize: '14px'
        }}>
          {error}
        </div>
      )}

      {/* Plot Display */}
      <div className="plot-container">
        {plots[selectedPlot] ? (
          <img
            src={plots[selectedPlot]}
            alt={selectedPlot}
            className="plot-image"
          />
        ) : loading ? (
          <div className="loading">Loading plot...</div>
        ) : (
          <div className="no-plot">
            Click "Generate Plot" to create visualization
          </div>
        )}
      </div>

      <style>{`
        .seaborn-dashboard {
          padding: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          color: white;
        }

        .dashboard-header {
          margin-bottom: 20px;
        }

        .dashboard-header h2 {
          font-size: 24px;
          margin: 0 0 8px 0;
          font-weight: bold;
        }

        .dashboard-header p {
          margin: 0;
          opacity: 0.9;
        }

        .plot-tabs {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          border-radius: 8px;
          color: white;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .tab-button.active {
          background: white;
          color: #667eea;
          border-color: white;
        }

        .column-selectors {
          display: flex;
          gap: 10px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .selector-input {
          padding: 10px 12px;
          border: none;
          border-radius: 6px;
          background: white;
          color: #333;
          font-size: 14px;
          cursor: pointer;
          flex: 1;
          min-width: 150px;
        }

        .refresh-button {
          padding: 10px 20px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s;
        }

        .refresh-button:hover:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .plot-container {
          background: white;
          border-radius: 12px;
          padding: 20px;
          min-height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .plot-image {
          max-width: 100%;
          height: auto;
        }

        .loading {
          color: #667eea;
          font-size: 18px;
          font-weight: bold;
        }

        .no-plot {
          color: #999;
          font-size: 16px;
        }
      `}</style>
    </div>
  );
};
