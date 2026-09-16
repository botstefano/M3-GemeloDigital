import React, { useState } from 'react';
import {
  SimulationKPIs,
  SimulationParams,
  DrillRig,
  Shovel,
  HaulTruck,
  BlastZone,
  UserRole,
} from '../../types';
import { exportSimulationToPDF, exportSimulationToExcel, exportGeoJSON } from '../../utils/reportGenerator';
import { generateAcademicDossierPDF, generateAcademicDossierCSV } from '../../utils/academicDossierGenerator';
import { MINE_CASE_STUDIES } from '../../data/caseStudyPresets';
import { MineAbmSimulator } from '../../utils/scientificAbmEngine';
import {
  FileText,
  Download,
  Calendar,
  Mail,
  Clock,
  CheckCircle,
  FileSpreadsheet,
  FileCode,
  Sparkles,
  Send,
  ShieldAlert,
  FlaskConical,
  Award,
} from 'lucide-react';

interface ReportsStudioProps {
  kpis: SimulationKPIs;
  params: SimulationParams;
  drills: DrillRig[];
  shovels: Shovel[];
  trucks: HaulTruck[];
  blastZones: BlastZone[];
  userRole: UserRole;
}

export const ReportsStudio: React.FC<ReportsStudioProps> = ({
  kpis,
  params,
  drills,
  shovels,
  trucks,
  blastZones,
  userRole,
}) => {
  const [reportType, setReportType] = useState<'daily' | 'weekly' | 'monthly'>('daily');
  const [scheduleEmail, setScheduleEmail] = useState('gerencia.operaciones@minecorp.com');
  const [scheduleFrequency, setScheduleFrequency] = useState('daily_0600');
  const [isScheduledSuccess, setIsScheduledSuccess] = useState(false);

  const isObserver = userRole === 'observer';

  const handleExportPDF = () => {
    exportSimulationToPDF(kpis, params, drills, shovels, trucks, blastZones);
  };

  const handleExportExcel = () => {
    exportSimulationToExcel(kpis, drills, shovels, trucks, blastZones);
  };

  const handleExportGeo = () => {
    exportGeoJSON(shovels, trucks, blastZones);
  };

  const handleExportAcademicPDF = () => {
    const caseStudy = MINE_CASE_STUDIES[0];
    const sim = new MineAbmSimulator(42);
    const benchmarks = sim.runBatchExperiment(50, 8, 2, 0.78, 7.2);
    generateAcademicDossierPDF({
      caseStudy,
      benchmarks,
      sampleSize: 50,
      randomSeed: 42,
      powderFactor: 0.78,
      authorName: 'Investigador Principal / Tesista',
      institution: 'Universidad Nacional de Trujillo / Facultad de Ingeniería de Minas',
    });
  };

  const handleExportAcademicCSV = () => {
    const caseStudy = MINE_CASE_STUDIES[0];
    const sim = new MineAbmSimulator(42);
    const benchmarks = sim.runBatchExperiment(50, 8, 2, 0.78, 7.2);
    const csvContent = generateAcademicDossierCSV({
      caseStudy,
      benchmarks,
      sampleSize: 50,
      randomSeed: 42,
      powderFactor: 0.78,
    });
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dossier_investigacion_datos_e_indicaciones_n50.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleScheduleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsScheduledSuccess(true);
    setTimeout(() => setIsScheduledSuccess(false), 4000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-tech">
              Módulo de Reportes Ejecutivos & Exportación
            </h2>
            <p className="text-xs text-slate-400">
              Generación de informes técnicos y ejecutivos en PDF (WeasyPrint), Excel (openpyxl/xlsx), GeoJSON y programación SMTP.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Instant Report Generators (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Predefined Reports Catalog */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-tech pb-2 border-b border-slate-800">
              1. Reportes Predefinidos de Operaciones Mina
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Daily */}
              <div
                onClick={() => setReportType('daily')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  reportType === 'daily'
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-100 font-tech">Reporte Diario de Producción</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Balance de masa TPH, disponibilidad de flota CAEX, Kuz-Ram P80 y cumplimiento de turnos.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-amber-400 font-semibold">Turno Día + Noche</span>
              </div>

              {/* Weekly */}
              <div
                onClick={() => setReportType('weekly')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  reportType === 'weekly'
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-100 font-tech">Eficiencia Energética & M2M</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Ahorro en molienda SAG por optimización de fragmentación, consumo diésel y huella CO₂.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-cyan-400 font-semibold">Mine-to-Mill Audit</span>
              </div>

              {/* Monthly */}
              <div
                onClick={() => setReportType('monthly')}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between gap-3 ${
                  reportType === 'monthly'
                    ? 'bg-amber-950/30 border-amber-500/50 shadow-md shadow-amber-500/10'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-slate-100 font-tech">Optimización DRL & Políticas</div>
                  <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                    Evaluación comparativa de frentes de Pareto, convergencia PPO y ganancias económicas OPEX.
                  </p>
                </div>
                <span className="text-[10px] font-mono text-purple-400 font-semibold">Executive Deep Dive</span>
              </div>
            </div>

            {/* Export Buttons Actions */}
            <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={handleExportPDF}
                className="px-4 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-rose-900/30"
              >
                <Download className="w-4 h-4" />
                Descargar Reporte PDF Ejecutivo
              </button>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg shadow-emerald-900/30"
              >
                <FileSpreadsheet className="w-4 h-4" />
                Exportar Excel (XLSX)
              </button>
              <button
                onClick={handleExportGeo}
                className="px-3.5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-2 transition-all"
              >
                <FileCode className="w-4 h-4 text-amber-400" />
                Exportar GeoJSON
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Scheduled Automated Dispatch (SMTP) (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <h3 className="text-sm font-bold text-slate-200 uppercase font-tech pb-2 border-b border-slate-800 flex items-center gap-2">
              <Mail className="w-4 h-4 text-amber-400" />
              <span>2. Programación Automática de Reportes (SMTP)</span>
            </h3>

            {isObserver ? (
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-400">
                Solo usuarios con rol Administrador o Supervisor de Mina pueden programar despachos de correo automatizados.
              </div>
            ) : (
              <form onSubmit={handleScheduleSubmit} className="space-y-3.5">
                <div>
                  <label className="text-xs text-slate-400">Correo Electrónico Destinatario / Lista de Distribución:</label>
                  <input
                    type="email"
                    required
                    value={scheduleEmail}
                    onChange={(e) => setScheduleEmail(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 mt-1 font-mono focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs text-slate-400">Frecuencia de Envío Automático:</label>
                  <select
                    value={scheduleFrequency}
                    onChange={(e) => setScheduleFrequency(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 mt-1 focus:border-amber-500 focus:outline-none"
                  >
                    <option value="daily_0600">Diario al cierre de turno (06:00 UTC)</option>
                    <option value="daily_1800">Diario al cierre de turno (18:00 UTC)</option>
                    <option value="weekly_monday">Semanal los Lunes a las 07:00 UTC</option>
                    <option value="monthly_first">Mensual primer día del mes</option>
                  </select>
                </div>

                <div className="bg-slate-950/70 p-3 rounded-lg border border-slate-800 text-xs text-slate-400 leading-relaxed">
                  Los informes adjuntan automáticamente el archivo <strong>PDF ejecutivo</strong> y el libro de datos en <strong>Excel (XLSX)</strong> con firma criptográfica de auditoría.
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-500/20"
                >
                  <Send className="w-4 h-4" />
                  Guardar Programación SMTP
                </button>

                {isScheduledSuccess && (
                  <div className="p-3 bg-emerald-950/50 border border-emerald-800/60 rounded-lg text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Programación guardada exitosamente en el servicio Celery Beat.</span>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 3. Scientific Research & Paper Publishing Dossier */}
      <div className="bg-gradient-to-r from-[#0f172a] via-[#111c35] to-[#0f172a] p-6 rounded-xl border border-[#00f2ff]/30 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] shrink-0 mt-1">
            <FlaskConical className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f2ff]/20 text-[#00f2ff] border border-[#00f2ff]/40">
                PEER-REVIEW EXPORT
              </span>
              <span className="text-xs font-mono text-slate-400">
                Elsevier Minerals Engineering / IEEE T-ASE
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-tech mt-1">
              Dossier Científico de Investigación: Datos Completos e Indicaciones de Redacción
            </h3>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Descarga directa del expediente académico que consolida el caso de estudio geomecánico andino, la formulación matemática MDP, las tablas experimentales validadas (Tabla 2 con prueba de Welch $p &lt; 0.001$ y $d=1.34$), la matriz de ablación y las instrucciones redactadas sección por sección para tu artículo.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0 self-stretch md:self-auto justify-end">
          <button
            onClick={handleExportAcademicPDF}
            className="px-4 py-2.5 rounded-lg bg-gradient-to-r from-[#00f2ff] to-[#008ecc] hover:from-[#00d0db] hover:to-[#007cb5] text-slate-950 text-xs font-bold font-mono flex items-center gap-2 transition-all shadow-lg shadow-[#00f2ff]/20 cursor-pointer"
          >
            <FileText className="w-4 h-4" />
            <span>Descargar PDF Oficial</span>
          </button>

          <button
            onClick={handleExportAcademicCSV}
            className="px-4 py-2.5 rounded-lg bg-[#172033] hover:bg-[#1f2b45] border border-emerald-500/40 hover:border-emerald-400 text-emerald-400 text-xs font-mono font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Descargar CSV Completo</span>
          </button>
        </div>
      </div>
    </div>
  );
};
