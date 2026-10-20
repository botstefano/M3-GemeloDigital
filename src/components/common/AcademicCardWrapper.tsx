import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FileText,
  Info,
  ChevronDown,
  ChevronUp,
  Image as ImageIcon,
  Sparkles,
} from 'lucide-react';
import {
  exportElementToHighDpiPng,
  exportTableDataToExcel,
  exportExplainabilityDoc,
} from '../../utils/academicExport';

interface AcademicCardWrapperProps {
  id: string;
  title: string;
  subtitle?: string;
  type: 'figure' | 'table';
  figureNumber?: string; // e.g. "Figura 1", "Tabla 2"
  tableData?: Record<string, any>[]; // required for table type
  interpretation: string;
  physicalExplainability: string;
  children: React.ReactNode;
  extraHeaderActions?: React.ReactNode;
  className?: string;
  defaultExpandedExplainability?: boolean;
}

export const AcademicCardWrapper: React.FC<AcademicCardWrapperProps> = ({
  id,
  title,
  subtitle,
  type,
  figureNumber,
  tableData,
  interpretation,
  physicalExplainability,
  children,
  extraHeaderActions,
  className = '',
  defaultExpandedExplainability = true,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const [isExplainOpen, setIsExplainOpen] = useState(defaultExpandedExplainability);

  const handleDownload600Dpi = async () => {
    setIsExporting(true);
    try {
      await exportElementToHighDpiPng(
        id,
        `${figureNumber ? figureNumber.replace(/\s+/g, '_') : 'Grafica'}_${title.replace(/\s+/g, '_').substring(0, 30)}`,
        title
      );
    } finally {
      setIsExporting(false);
    }
  };

  const handleDownloadExcel = () => {
    if (!tableData || tableData.length === 0) return;
    exportTableDataToExcel(
      tableData,
      figureNumber || 'Datos',
      `${figureNumber ? figureNumber.replace(/\s+/g, '_') : 'Tabla'}_${title.replace(/\s+/g, '_').substring(0, 30)}`,
      {
        title: `${figureNumber ? figureNumber + ' - ' : ''}${title}`,
        interpretation,
        explainability: physicalExplainability,
      }
    );
  };

  const handleDownloadExplainability = () => {
    exportExplainabilityDoc(
      title,
      figureNumber || id,
      interpretation,
      physicalExplainability
    );
  };

  return (
    <div
      id={id}
      className={`bg-[#0f1115] rounded-xl border border-[#1f2937] shadow-xl p-4 flex flex-col gap-3 transition-all ${className}`}
    >
      {/* Top Header with Identification and Corner Download Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2.5 border-b border-[#1f2937]">
        <div className="flex items-center gap-2">
          {figureNumber && (
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 shadow-[0_0_8px_rgba(0,242,255,0.2)]">
              {figureNumber}
            </span>
          )}
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-white font-tech tracking-wide">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[10px] sm:text-[11px] text-[#9ca3af] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        {/* Corner Download Buttons Action Group (marked no-export so it's not captured in 600 DPI output) */}
        <div className="flex items-center gap-2 self-start sm:self-auto ml-auto no-export">
          {extraHeaderActions}

          {/* Figure: 600 DPI Download */}
          {type === 'figure' && (
            <button
              onClick={handleDownload600Dpi}
              disabled={isExporting}
              className="px-2.5 py-1.5 rounded-lg bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(0,242,255,0.15)] cursor-pointer"
              title="Descargar figura en alta resolución 600 DPI (PNG de grado científico apto para IEEE/Elsevier/Springer)"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isExporting ? 'Procesando 600 DPI...' : 'Descargar 600 DPI'}</span>
            </button>
          )}

          {/* Table or Figure with data: Excel (.xlsx) Download */}
          {(type === 'table' || (tableData && tableData.length > 0)) && (
            <button
              onClick={handleDownloadExcel}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)] cursor-pointer"
              title="Descargar datos tabulares completos en formato Microsoft Excel (.xlsx) con metadatos"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>{type === 'table' ? 'Descargar Excel (.xlsx)' : 'Datos Excel (.xlsx)'}</span>
            </button>
          )}

          {/* Table: 600 DPI Image Download also available */}
          {type === 'table' && (
            <button
              onClick={handleDownload600Dpi}
              disabled={isExporting}
              className="px-2.5 py-1.5 rounded-lg bg-[#00f2ff]/10 hover:bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40 text-[11px] font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
              title="Descargar render de la tabla en alta resolución 600 DPI para inserción en papers"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>{isExporting ? '600 DPI...' : 'Imagen 600 DPI'}</span>
            </button>
          )}

          {/* Download Explainability Document (.md) */}
          <button
            onClick={handleDownloadExplainability}
            className="px-2.5 py-1.5 rounded-lg bg-[#15181e] hover:bg-[#1f2937] text-[#9ca3af] hover:text-[#00f2ff] border border-[#1f2937] hover:border-[#00f2ff]/30 text-[11px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
            title="Descargar documento de interpretabilidad y explicabilidad físico-minera (.md)"
          >
            <FileText className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Explicabilidad (.md)</span>
          </button>
        </div>
      </div>

      {/* Main Content (Figure, Chart or Table) */}
      <div className="w-full overflow-x-auto">{children}</div>

      {/* In-Screen Interpretability & Physical Explainability Section */}
      <div className="bg-[#0a0b0e] rounded-lg border border-[#1f2937] p-3 text-xs mt-1">
        <div
          onClick={() => setIsExplainOpen(!isExplainOpen)}
          className="flex items-center justify-between cursor-pointer select-none pb-1"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span className="text-[11px] font-bold text-white font-tech uppercase tracking-wider">
              Interpretabilidad & Explicabilidad Físico-Minera
            </span>
          </div>
          <div className="flex items-center gap-2 no-export">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDownloadExplainability();
              }}
              className="px-2 py-0.5 rounded text-[10px] font-mono bg-[#15181e] hover:bg-[#1f2937] text-amber-300 border border-amber-500/30 flex items-center gap-1"
              title="Descargar este texto de interpretabilidad"
            >
              <Download className="w-3 h-3" />
              <span>Descargar Explicabilidad</span>
            </button>
            <button className="text-[#9ca3af] hover:text-white p-0.5">
              {isExplainOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {isExplainOpen && (
          <div className="space-y-2 mt-2 pt-2 border-t border-[#1f2937]/80 animate-in fade-in duration-200">
            {/* 1. Technical Interpretation */}
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/30 shrink-0 mt-0.5">
                INTERPRETACIÓN
              </span>
              <p className="text-[11px] leading-relaxed text-[#c3cad4]">{interpretation}</p>
            </div>

            {/* 2. Physical & Mining Operational Explainability */}
            <div className="flex items-start gap-2 text-slate-300">
              <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 shrink-0 mt-0.5">
                EXPLICABILIDAD FÍSICA
              </span>
              <p className="text-[11px] leading-relaxed text-[#c3cad4]">{physicalExplainability}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
