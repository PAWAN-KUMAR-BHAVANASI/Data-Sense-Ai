import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';

interface SeabornDashboardProps {
  data: any[];
  schema: any;
  isDarkMode?: boolean;
}

export const SeabornDashboard: React.FC<SeabornDashboardProps> = ({ data, schema, isDarkMode = false }) => {
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
    // Inform backend whether dark mode is active so plots can match UI
    payload.dark = isDarkMode;

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
    <div className={`seaborn-dashboard ${isDarkMode ? 'dark-mode' : ''}`}>
      <div className="dashboard-header">
        <h2>📊 Seaborn Analysis Dashboard</h2>
        <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>Advanced Statistical Visualizations</p>
      </div>

      {/* Plot Type Selector */}
      <div className="plot-tabs">
        {plotTabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedPlot(tab.id)}
            className={`tab-button ${selectedPlot === tab.id ? 'active' : ''} ${isDarkMode ? 'dark' : ''}`}
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
            className={`selector-input ${isDarkMode ? 'dark' : ''}`}
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
            className={`selector-input ${isDarkMode ? 'dark' : ''}`}
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
            className={`selector-input ${isDarkMode ? 'dark' : ''}`}
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
          className={`refresh-button ${isDarkMode ? 'dark' : ''}`}
        >
          {loading ? 'Generating...' : 'Generate Plot'}
        </button>
      </div>

      {/* Error Display */}
      {error && (
        <div className={isDarkMode ? 'error-display dark' : 'error-display'}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* Plot Display */}
      <div className={`plot-container ${isDarkMode ? 'dark' : ''}`}>
        {plots[selectedPlot] ? (
          <img
            src={plots[selectedPlot]}
            alt={selectedPlot}
            className="plot-image"
          />
        ) : loading ? (
          <div className={`loading ${isDarkMode ? 'dark' : ''}`}>Loading plot...</div>
        ) : (
          <div className="no-plot">
            Click "Generate Plot" to create visualization
          </div>
        )}
      </div>

      <style>{`
        .seaborn-dashboard {
          padding: 24px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          color: white;
          box-shadow: 0 10px 40px rgba(0,0,0,0.1);
        }

        .seaborn-dashboard.dark-mode {
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          border: 1px solid #2d3561;
        }

        .dashboard-header {
          margin-bottom: 24px;
        }

        .dashboard-header h2 {
          font-size: 26px;
          margin: 0 0 8px 0;
          font-weight: bold;
          color: white;
        }

        .dashboard-header p {
          margin: 0;
          opacity: 0.9;
          font-size: 14px;
        }

        .plot-tabs {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }

        .tab-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 12px 18px;
          background: rgba(255, 255, 255, 0.2);
          border: 2px solid transparent;
          border-radius: 10px;
          color: white;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 600;
          font-size: 14px;
        }

        .tab-button:hover {
          background: rgba(255, 255, 255, 0.35);
          transform: translateY(-2px);
        }

        .tab-button.active {
          background: white;
          color: #667eea;
          border-color: white;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }

        .tab-button.dark {
          background: rgba(255, 255, 255, 0.08);
          border-color: rgba(255, 255, 255, 0.15);
        }

        .tab-button.dark:hover {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .tab-button.dark.active {
          background: #2d3561;
          color: #60a5fa;
          border-color: #60a5fa;
        }

        .column-selectors {
          display: flex;
          gap: 12px;
          margin-bottom: 20px;
          flex-wrap: wrap;
          align-items: center;
        }

        .selector-input {
          padding: 11px 14px;
          border: none;
          border-radius: 8px;
          background: white;
          color: #333;
          font-size: 14px;
          cursor: pointer;
          flex: 1;
          min-width: 160px;
          transition: all 0.3s ease;
          font-weight: 500;
        }

        .selector-input:hover {
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }

        .selector-input.dark {
          background: #2d3561;
          color: #e5e7eb;
          border: 1px solid #475569;
        }

        .selector-input.dark:hover {
          border-color: #60a5fa;
          box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }

        .refresh-button {
          padding: 11px 24px;
          background: white;
          color: #667eea;
          border: none;
          border-radius: 8px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 14px;
        }

        .refresh-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
          color: #764ba2;
        }

        .refresh-button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .refresh-button.dark {
          background: #2d3561;
          color: #60a5fa;
          border: 1px solid #475569;
        }

        .refresh-button.dark:hover:not(:disabled) {
          background: #3d4671;
          border-color: #60a5fa;
          box-shadow: 0 0 16px rgba(96, 165, 250, 0.3);
          transform: translateY(-2px);
        }

        .error-display {
          background: #fecaca;
          border: 2px solid #f87171;
          color: #7f1d1d;
          padding: 14px 16px;
          border-radius: 10px;
          margin-bottom: 16px;
          font-size: 14px;
          font-weight: 500;
        }

        .error-display.dark {
          background: #7f2f2f;
          border-color: #f87171;
          color: #fecaca;
        }

        .plot-container {
          background: white;
          border-radius: 14px;
          padding: 24px;
          min-height: 450px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 24px rgba(0,0,0,0.1);
        }

        .plot-container.dark {
          background: #1f2937;
          border: 1px solid #374151;
          box-shadow: 0 8px 24px rgba(0,0,0,0.3);
        }

        .plot-image {
          max-width: 100%;
          height: auto;
          border-radius: 10px;
        }

        .loading {
          color: #667eea;
          font-size: 18px;
          font-weight: bold;
        }

        .loading.dark {
          color: #60a5fa;
        }

        .no-plot {
          color: #999;
          font-size: 16px;
        }

        .seaborn-dashboard.dark-mode .no-plot {
          color: #9ca3af;
        }
      `}</style>
    </div>
  );
};
