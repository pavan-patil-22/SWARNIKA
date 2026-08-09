import React, { useState } from 'react';
import { FileSpreadsheet, FileText, FileCode } from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { toast } from 'react-toastify';

export default function AdminReports() {
  const { exportReport } = useAdmin();
  const [reportType, setReportType] = useState('orders');
  const [period, setPeriod] = useState('all');
  const [selectedYear, setSelectedYear] = useState('2026');
  const [selectedMonth, setSelectedMonth] = useState('08');

  const handleExport = (format) => {
    exportReport(reportType, format, { period, year: selectedYear, month: selectedMonth });
    toast.success(`Exporting ${reportType.toUpperCase()} report as ${format.toUpperCase()}...`, {
      style: { background: '#FFF', color: '#D4AF37', border: '1px solid #D4AF37' }
    });
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-200 pb-4">
        <h2 className="font-luxury font-bold text-2xl text-gold-gradient">Reports Exporter</h2>
        <p className="text-xs text-gray-500">Generate and export business intelligence reports in PDF, Excel (XLSX), and CSV formats</p>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 text-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Report Target Selection */}
          <div>
            <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2">
              1. Select Module / Data Target
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-gray-50 border border-gold/40 text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
            >
              <option value="orders">Orders & Fulfilment Report</option>
              <option value="products">Products & Stock Inventory Report</option>
              <option value="revenue">Financial Revenue & Tax (3% GST) Report</option>
            </select>
          </div>

          {/* Time Filter Selection */}
          <div>
            <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2">
              2. Filter Period
            </label>
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="w-full bg-gray-50 border border-gold/40 text-slate-900 text-xs rounded-xl p-3 focus:outline-none"
            >
              <option value="all">All Time Records</option>
              <option value="year">Filter by Year</option>
              <option value="month">Filter by Month & Year</option>
            </select>
          </div>

          {/* Sub Date Filter */}
          {period !== 'all' && (
            <div>
              <label className="block text-xs font-bold text-gold uppercase tracking-wider mb-2">
                3. Year / Month Parameters
              </label>
              <div className="flex gap-2">
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full bg-gray-50 border border-gold/40 text-slate-900 text-xs rounded-xl p-3"
                >
                  <option value="2026">2026</option>
                  <option value="2025">2025</option>
                </select>

                {period === 'month' && (
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-full bg-gray-50 border border-gold/40 text-slate-900 text-xs rounded-xl p-3"
                  >
                    <option value="08">August</option>
                    <option value="07">July</option>
                    <option value="06">June</option>
                  </select>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Export Buttons Bar */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <span className="text-xs text-gray-500 block font-bold">Choose Export Format:</span>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => handleExport('pdf')}
              className="p-4 bg-amber-50 hover:bg-gold hover:text-slate-900 border border-gold/40 text-amber-900 rounded-xl font-luxury font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileText className="w-5 h-5 text-gold" /> Export PDF Document
            </button>

            <button
              onClick={() => handleExport('excel')}
              className="p-4 bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-300 text-emerald-800 rounded-xl font-luxury font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600" /> Export Excel (.xlsx)
            </button>

            <button
              onClick={() => handleExport('csv')}
              className="p-4 bg-amber-50/70 hover:bg-amber-600 hover:text-white border border-amber-300 text-amber-900 rounded-xl font-luxury font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
            >
              <FileCode className="w-5 h-5 text-amber-700" /> Export CSV Spreadsheet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
