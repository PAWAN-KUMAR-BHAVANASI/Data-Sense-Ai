import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export interface ExportOptions {
  filename: string;
  title?: string;
  description?: string;
}

/**
 * Export data to Excel (.xlsx)
 */
export const exportToExcel = (data: any[], filename: string, sheetName: string = 'Data') => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    return true;
  } catch (error) {
    console.error('Excel export failed:', error);
    return false;
  }
};

/**
 * Export data to PDF
 */
export const exportToPDF = (
  data: any[],
  options: ExportOptions & { columns?: string[] }
) => {
  try {
    const pdf = new jsPDF();
    const columns = options.columns || (data.length > 0 ? Object.keys(data[0]) : []);
    
    // Add title
    if (options.title) {
      pdf.setFontSize(16);
      pdf.text(options.title, 14, 15);
    }
    
    // Add description
    if (options.description) {
      pdf.setFontSize(10);
      pdf.setTextColor(100);
      pdf.text(options.description, 14, options.title ? 25 : 15);
    }
    
    // Add timestamp
    pdf.setFontSize(8);
    pdf.setTextColor(150);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, pdf.lastAutoTable?.finalY ? pdf.lastAutoTable.finalY + 5 : (options.description ? 35 : 25));
    
    // Convert data for table
    const tableData = data.map(row =>
      columns.map(col => {
        const val = row[col];
        if (val === null || val === undefined) return '';
        if (typeof val === 'object') return JSON.stringify(val);
        return String(val).substring(0, 50); // Truncate long values
      })
    );
    
    // Add table
    (pdf as any).autoTable({
      head: [columns],
      body: tableData,
      startY: options.description ? 40 : (options.title ? 30 : 20),
      theme: 'grid',
      styles: { fontSize: 9, cellPadding: 3 },
      headStyles: { fillColor: [0, 100, 200], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [240, 245, 250] },
      margin: 10,
      didDrawPage: (data: any) => {
        const pageSize = pdf.internal.pageSize;
        const pageHeight = pageSize.getHeight();
        const pageWidth = pageSize.getWidth();
        
        // Footer
        pdf.setFontSize(8);
        pdf.setTextColor(150);
        pdf.text(
          `Page ${pdf.internal.getNumberOfPages()}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
    });
    
    pdf.save(`${options.filename}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    return false;
  }
};

/**
 * Export data to CSV
 */
export const exportToCSV = (data: any[], filename: string) => {
  try {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}.csv`;
    link.click();
    
    return true;
  } catch (error) {
    console.error('CSV export failed:', error);
    return false;
  }
};

/**
 * Export data summary statistics to PDF
 */
export const exportSummaryToPDF = (
  schema: any,
  stats: any,
  filename: string
) => {
  try {
    const pdf = new jsPDF();
    let yPosition = 20;
    const lineHeight = 8;
    const pageHeight = pdf.internal.pageSize.getHeight();
    
    // Title
    pdf.setFontSize(18);
    pdf.setTextColor(0, 100, 200);
    pdf.text('Data Summary Report', 14, yPosition);
    yPosition += lineHeight * 2;
    
    // Generated date
    pdf.setFontSize(9);
    pdf.setTextColor(100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, 14, yPosition);
    yPosition += lineHeight * 1.5;
    
    // Dataset info
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text('Dataset Information', 14, yPosition);
    yPosition += lineHeight;
    
    pdf.setFontSize(10);
    const datasetInfo = [
      `Total Records: ${schema.totalRows}`,
      `Total Columns: ${schema.columns.length}`,
      `Data Quality Score: ${schema.quality?.healthScore || 'N/A'}%`,
    ];
    
    datasetInfo.forEach(info => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(info, 20, yPosition);
      yPosition += lineHeight;
    });
    
    yPosition += lineHeight;
    
    // Columns
    pdf.setFontSize(12);
    pdf.setTextColor(0);
    pdf.text('Columns', 14, yPosition);
    yPosition += lineHeight;
    
    pdf.setFontSize(9);
    schema.columns.forEach((col: string) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = 20;
      }
      pdf.text(`• ${col}`, 20, yPosition);
      yPosition += lineHeight * 0.8;
    });
    
    yPosition += lineHeight;
    
    // Statistics
    if (stats && Object.keys(stats).length > 0) {
      pdf.setFontSize(12);
      pdf.setTextColor(0);
      pdf.text('Statistics', 14, yPosition);
      yPosition += lineHeight;
      
      pdf.setFontSize(9);
      Object.entries(stats).forEach(([key, value]: [string, any]) => {
        if (yPosition > pageHeight - 20) {
          pdf.addPage();
          yPosition = 20;
        }
        const displayValue = typeof value === 'object' ? JSON.stringify(value).substring(0, 40) : String(value).substring(0, 50);
        pdf.text(`${key}: ${displayValue}`, 20, yPosition);
        yPosition += lineHeight * 0.8;
      });
    }
    
    pdf.save(`${filename}.pdf`);
    return true;
  } catch (error) {
    console.error('Summary PDF export failed:', error);
    return false;
  }
};
