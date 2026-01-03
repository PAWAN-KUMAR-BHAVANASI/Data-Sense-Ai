
import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, PieChart, Pie, Cell, LineChart, Line, ScatterChart, Scatter
} from 'recharts';
import { ColorPalette } from '../types';

interface ChartRendererProps {
  type: 'bar' | 'line' | 'pie' | 'area' | 'scatter' | 'histogram' | 'none';
  data: any[];
  xAxis: string;
  yAxis: string;
  palette: ColorPalette;
  onItemClick?: (data: any) => void;
}

export const ChartRenderer: React.FC<ChartRendererProps> = ({ type, data, xAxis, yAxis, palette, onItemClick }) => {
  if (type === 'none' || !data.length) return null;

  const mainColor = palette.colors[0];
  const colors = palette.colors;

  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 10, bottom: 20 },
    onClick: (state: any) => {
      if (state && state.activePayload && onItemClick) {
        onItemClick(state.activePayload[0].payload);
      }
    }
  };

  const renderTooltip = () => (
    <Tooltip 
      contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }}
      itemStyle={{ fontWeight: 600, color: '#1e293b', fontSize: '12px' }}
      cursor={{ fill: 'rgba(0,0,0,0.02)' }}
    />
  );

  const renderStandardXAxis = () => (
    <XAxis 
      dataKey="name" 
      axisLine={false} 
      tickLine={false} 
      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
      dy={10} 
      interval="preserveStartEnd"
    />
  );

  const renderStandardYAxis = () => (
    <YAxis 
      axisLine={false} 
      tickLine={false} 
      tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 700 }} 
    />
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      {(() => {
        switch (type) {
          case 'bar':
            return (
              <BarChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {renderStandardXAxis()}
                {renderStandardYAxis()}
                {renderTooltip()}
                <Bar 
                  dataKey="value" 
                  fill={mainColor} 
                  radius={[6, 6, 0, 0]} 
                  barSize={32} 
                  onClick={(entry) => onItemClick?.(entry)}
                />
              </BarChart>
            );
          case 'histogram':
            return (
              <BarChart {...commonProps} barCategoryGap={1}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {renderStandardXAxis()}
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 10 }}
                  label={{ value: 'Freq', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 9, fontWeight: 800 }}
                />
                {renderTooltip()}
                <Bar 
                  dataKey="value" 
                  fill={mainColor} 
                  radius={[4, 4, 0, 0]}
                  onClick={(entry) => onItemClick?.(entry)}
                />
              </BarChart>
            );
          case 'line':
            return (
              <LineChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {renderStandardXAxis()}
                {renderStandardYAxis()}
                {renderTooltip()}
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={mainColor} 
                  strokeWidth={4} 
                  dot={{ r: 5, fill: mainColor, strokeWidth: 3, stroke: '#fff' }} 
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            );
          case 'area':
            return (
              <AreaChart {...commonProps}>
                <defs>
                  <linearGradient id={`grad-${palette.name}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={mainColor} stopOpacity={0.4}/>
                    <stop offset="95%" stopColor={mainColor} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {renderStandardXAxis()}
                {renderStandardYAxis()}
                {renderTooltip()}
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke={mainColor} 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill={`url(#grad-${palette.name})`} 
                  onClick={(entry) => onItemClick?.(entry)}
                />
              </AreaChart>
            );
          case 'pie':
            return (
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                  onClick={(entry) => onItemClick?.(entry)}
                >
                  {data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={colors[index % colors.length]} 
                      className="cursor-pointer hover:opacity-80 transition-opacity"
                    />
                  ))}
                </Pie>
                {renderTooltip()}
              </PieChart>
            );
          case 'scatter':
            return (
              <ScatterChart {...commonProps}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                {renderStandardXAxis()}
                {renderStandardYAxis()}
                {renderTooltip()}
                <Scatter name="Data" data={data} fill={mainColor} />
              </ScatterChart>
            );
          default:
            return <div className="h-full flex items-center justify-center text-slate-300 italic">Unsupported visual type</div>;
        }
      })()}
    </ResponsiveContainer>
  );
};
