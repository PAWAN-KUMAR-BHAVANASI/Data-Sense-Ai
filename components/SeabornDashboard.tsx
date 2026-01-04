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
  const [selectedX, setSelectedX] = useState<string>('');
  const [selectedY, setSelectedY] = useState<string>('');

  const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

  const numericColumns = schema?.stats?.numeric_columns || [];

  useEffect(() => {
    if (selectedPlot && !plots[selectedPlot]) {
      generatePlot(selectedPlot);
    }
  }, [selectedPlot]);

  const generatePlot = async (plotType: string) => {
    if (!data || data.length === 0) {
      alert('No data available');
      return;
    }

    setLoading(true);
    try {
      let endpoint = '';
      let payload = { data };

      switch (plotType) {
        case 'heatmap':
          endpoint = '/api/plots/heatmap';
          break;
        case 'distribution':
          endpoint = '/api/plots/distribution';
          payload = { ...payload, column: selectedX || numericColumns[0] };
          break;
        case 'scatter':
          endpoint = '/api/plots/scatter';
          payload = {
            ...payload,
            x: selectedX || numericColumns[0],
            y: selectedY || numericColumns[1],
          };
          break;
        case 'pairplot':
          endpoint = '/api/plots/pairplot';
          break;
        case 'violin':
          endpoint = '/api/plots/violin';
          payload = {
            ...payload,
            x: selectedX || schema?.stats?.categorical_columns[0] || 'category',
            y: selectedY || numericColumns[0],
          };
          break;
        default:
          return;
      }

      const response = await fetch(`${API_BASE}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error('Failed to generate plot');

      const result = await response.json();
      setPlots(prev => ({ ...prev, [plotType]: `data:image/png;base64,${result.plot}` }));
    } catch (error) {
      console.error('Plot generation error:', error);
      alert('Failed to generate plot');
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
        {(selectedPlot === 'distribution' || selectedPlot === 'scatter' || selectedPlot === 'violin') && (
          <>
            {(selectedPlot === 'distribution' || selectedPlot === 'scatter' || selectedPlot === 'violin') && (
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
          </>
        )}
        <button
          onClick={() => generatePlot(selectedPlot)}
          disabled={loading}
          className="refresh-button"
        >
          {loading ? 'Generating...' : 'Generate Plot'}
        </button>
      </div>

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
