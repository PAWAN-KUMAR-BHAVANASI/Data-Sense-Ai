import React, { useState } from 'react';
import { Download, X } from 'lucide-react';
import { exportToExcel, exportToPDF, exportToCSV, exportSummaryToPDF } from '../services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any[];
  filename: string;
  isDarkMode: boolean;
  schema?: any;
  stats?: any;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  data,
  filename,
  isDarkMode,
  schema,
  stats,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [exportMessage, setExportMessage] = useState('');

  if (!isOpen) return null;

  const handleExport = async (format: 'pdf' | 'excel' | 'csv' | 'summary') => {
    setIsExporting(true);
    setExportMessage('');

    try {
      let success = false;
      const timestamp = new Date().toISOString().split('T')[0];
      const exportFilename = `${filename}-${timestamp}`;

      switch (format) {
        case 'pdf':
          success = exportToPDF(data, {
            filename: exportFilename,
            title: 'Cleaned Data Export',
            description: `Dataset contains ${data.length} records`,
            columns: data.length > 0 ? Object.keys(data[0]) : [],
          });
          break;
        case 'excel':
          success = exportToExcel(data, exportFilename);
          break;
        case 'csv':
          success = exportToCSV(data, exportFilename);
          break;
        case 'summary':
          if (schema && stats) {
            success = exportSummaryToPDF(schema, stats, `${exportFilename}-summary`);
          } else {
            setExportMessage('Summary data not available');
            setIsExporting(false);
            return;
          }
          break;
      }

      if (success) {
        setExportMessage(`✓ Successfully exported to ${format.toUpperCase()}`);
        setTimeout(() => {
          onClose();
          setExportMessage('');
        }, 1500);
      } else {
        setExportMessage(`✗ Failed to export to ${format.toUpperCase()}`);
      }
    } catch (error) {
      console.error('Export error:', error);
      setExportMessage('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  const bgClass = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textClass = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const borderClass = isDarkMode ? 'border-gray-700' : 'border-gray-200';
  const hoverClass = isDarkMode
    ? 'hover:bg-gray-800 hover:border-gray-600'
    : 'hover:bg-gray-50 hover:border-gray-300';
  const buttonClass = isDarkMode
    ? 'bg-blue-600 hover:bg-blue-700 text-white'
    : 'bg-blue-500 hover:bg-blue-600 text-white';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div
        className={`${bgClass} ${textClass} rounded-lg shadow-2xl max-w-md w-full mx-4 border ${borderClass}`}
      >
        {/* Header */}
        <div className={`flex items-center justify-between p-6 border-b ${borderClass}`}>
          <div className="flex items-center gap-3">
            <Download size={24} className="text-blue-500" />
            <h2 className="text-xl font-bold">Export Data</h2>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* PDF Export */}
          <button
            onClick={() => handleExport('pdf')}
            disabled={isExporting || data.length === 0}
            className={`w-full p-4 rounded-lg border ${borderClass} ${hoverClass} transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-semibold flex items-center gap-2">
              <Download size={18} />
              Export as PDF
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Professional formatted document
            </p>
          </button>

          {/* Excel Export */}
          <button
            onClick={() => handleExport('excel')}
            disabled={isExporting || data.length === 0}
            className={`w-full p-4 rounded-lg border ${borderClass} ${hoverClass} transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-semibold flex items-center gap-2">
              <Download size={18} />
              Export as Excel
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Spreadsheet format with formatting
            </p>
          </button>

          {/* CSV Export */}
          <button
            onClick={() => handleExport('csv')}
            disabled={isExporting || data.length === 0}
            className={`w-full p-4 rounded-lg border ${borderClass} ${hoverClass} transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-semibold flex items-center gap-2">
              <Download size={18} />
              Export as CSV
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Lightweight comma-separated format
            </p>
          </button>

          {/* Summary PDF */}
          <button
            onClick={() => handleExport('summary')}
            disabled={isExporting || !schema}
            className={`w-full p-4 rounded-lg border ${borderClass} ${hoverClass} transition-all text-left disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            <div className="font-semibold flex items-center gap-2">
              <Download size={18} />
              Export Summary Report
            </div>
            <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
              Data statistics and summary
            </p>
          </button>
        </div>

        {/* Footer */}
        {exportMessage && (
          <div
            className={`px-6 py-3 rounded-b-lg border-t ${borderClass} ${
              exportMessage.startsWith('✓')
                ? isDarkMode
                  ? 'bg-green-900 text-green-100'
                  : 'bg-green-50 text-green-800'
                : isDarkMode
                  ? 'bg-red-900 text-red-100'
                  : 'bg-red-50 text-red-800'
            }`}
          >
            {exportMessage}
          </div>
        )}

        {isExporting && (
          <div
            className={`px-6 py-3 border-t ${borderClass} ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} text-center`}
          >
            <p className="text-sm">Preparing export...</p>
          </div>
        )}

        {data.length === 0 && (
          <div
            className={`px-6 py-3 border-t ${borderClass} ${isDarkMode ? 'bg-yellow-900 text-yellow-100' : 'bg-yellow-50 text-yellow-800'} text-center text-sm`}
          >
            No data available to export
          </div>
        )}
      </div>
    </div>
  );
};
