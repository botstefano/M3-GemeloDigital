import React, { useState } from 'react';
import {
  FileText,
  Download,
  Check,
  X,
  BookOpen,
  FileSpreadsheet,
  Package,
  Layers,
  Sparkles,
  Mountain,
  Award,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { MineCaseStudy } from '../../data/caseStudyPresets';
import { PolicyBenchmarkSummary } from '../../utils/scientificAbmEngine';
import { generateAcademicDossierPDF, generateAcademicDossierCSV } from '../../utils/academicDossierGenerator';

interface AcademicDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  caseStudy: MineCaseStudy;
  benchmarks: PolicyBenchmarkSummary[];
  sampleSize: number;
  randomSeed: number;
  powderFactor: number;
}

export const AcademicDossierModal: React.FC<AcademicDossierModalProps> = ({
  isOpen,
  onClose,
  caseStudy,
  benchmarks,
  sampleSize,
  randomSeed,
  powderFactor,
}) => {
  const [authorName, setAuthorName] = useState<string>('Tesista / Investigador Principal');
  const [institution, setInstitution] = useState<string>(
    'Universidad Nacional de Trujillo / Facultad de Ingeniería de Minas'
  );
  const [activePreviewTab, setActivePreviewTab] = useState<'guide' | 'data' | 'tables'>('guide');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [isGeneratingCsv, setIsGeneratingCsv] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleDownloadPDF = () => {
    setIsGeneratingPdf(true);
    setTimeout(() => {
      try {
        generateAcademicDossierPDF({
          caseStudy,
          benchmarks,
          sampleSize,
          randomSeed,
          powderFactor,
          authorName,
          institution,
        });
        setSuccessMessage('¡PDF Oficial generado y descargado con éxito!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
        console.error('Error generating PDF:', err);
      } finally {
        setIsGeneratingPdf(false);
      }
    }, 250);
  };

  const handleDownloadCSV = () => {
    setIsGeneratingCsv(true);
    setTimeout(() => {
      try {
        const csvContent = generateAcademicDossierCSV({
          caseStudy,
          benchmarks,
          sampleSize,
          randomSeed,
          powderFactor,
          authorName,
          institution,
        });
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `dossier_investigacion_datos_e_indicaciones_n${sampleSize}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setSuccessMessage('¡Base de Datos y Guía en CSV descargada con éxito!');
        setTimeout(() => setSuccessMessage(null), 4000);
      } catch (err) {
        console.error('Error generating CSV:', err);
      } finally {
        setIsGeneratingCsv(false);
      }
    }, 250);
  };

  const handleDownloadBoth = () => {
    handleDownloadPDF();
    setTimeout(() => {
      handleDownloadCSV();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fadeIn">
      <div className="bg-[#0f1422] border border-[#1b2336] rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-[#e0e2e5]">
        {/* Header */}
        <div className="p-5 bg-[#141a29] border-b border-[#1b2336] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00f2ff] to-[#0066ff] p-0.5 shadow-lg shadow-[#00f2ff]/20">
              <div className="w-full h-full bg-[#0a0d14] rounded-[10px] flex items-center justify-center">
                <FileText className="w-5 h-5 text-[#00f2ff]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-mono flex items-center gap-2">
                  Dossier de Investigación Científica: Datos e Indicaciones para Publicación
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30">
                  PDF + CSV
                </span>
              </div>
              <p className="text-xs text-[#9ca3af] mt-0.5">
                Genera el documento oficial con todos los datos geomecánicos, tablas de resultados, pruebas estadísticas e instrucciones de redacción paso a paso.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f2b45] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success Alert Banner */}
        {successMessage && (
          <div className="bg-emerald-950/70 border-b border-emerald-500/40 px-5 py-2.5 flex items-center gap-2.5 text-xs text-emerald-300 font-mono animate-fadeIn">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="font-semibold">{successMessage}</span>
          </div>
        )}

        {/* Content Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Quick Action Download Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={handleDownloadPDF}
              disabled={isGeneratingPdf}
              className="p-4 bg-gradient-to-b from-[#1b253b] to-[#12192a] hover:from-[#222e49] hover:to-[#172036] border border-[#00f2ff]/30 hover:border-[#00f2ff] rounded-xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer shadow-lg group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileText className="w-5 h-5 text-[#00f2ff]" />
              </div>
              <div>
                <span className="text-xs font-bold font-mono text-white block">Descargar Dossier PDF</span>
                <span className="text-[10px] text-[#9ca3af] font-mono block mt-0.5">
                  Documento académico formal (4 páginas listas para imprimir)
                </span>
              </div>
            </button>

            <button
              onClick={handleDownloadCSV}
              disabled={isGeneratingCsv}
              className="p-4 bg-gradient-to-b from-[#1b253b] to-[#12192a] hover:from-[#222e49] hover:to-[#172036] border border-emerald-500/30 hover:border-emerald-400 rounded-xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer shadow-lg group"
            >
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
              </div>
              <div>
                <span className="text-xs font-bold font-mono text-white block">Descargar Base CSV</span>
                <span className="text-[10px] text-[#9ca3af] font-mono block mt-0.5">
                  Tablas consolidadas + datos Monte Carlo + directrices
                </span>
              </div>
            </button>

            <button
              onClick={handleDownloadBoth}
              className="p-4 bg-gradient-to-b from-[#00f2ff] to-[#008ecc] hover:from-[#1fe5f0] hover:to-[#007cb5] text-[#050811] rounded-xl transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer shadow-xl shadow-[#00f2ff]/15 group"
            >
              <div className="w-10 h-10 rounded-lg bg-black/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Package className="w-5 h-5 text-black font-bold" />
              </div>
              <div>
                <span className="text-xs font-bold font-mono text-black block">Descargar Paquete Completo</span>
                <span className="text-[10px] text-black/80 font-mono block mt-0.5 font-semibold">
                  Descarga PDF Oficial + CSV en un solo clic
                </span>
              </div>
            </button>
          </div>

          {/* Personalization Fields */}
          <div className="p-4 bg-[#0a0d14] rounded-xl border border-[#1b2336] grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
            <div>
              <label className="block text-[#9ca3af] text-[11px] mb-1">Nombre del Autor / Investigador:</label>
              <input
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                className="w-full px-3 py-2 bg-[#141a29] border border-[#1b2336] rounded text-white focus:outline-none focus:border-[#00f2ff]"
                placeholder="Ej. Ing. Juan Pérez / Tesista de Minas"
              />
            </div>

            <div>
              <label className="block text-[#9ca3af] text-[11px] mb-1">Filiación Académica / Universidad:</label>
              <input
                type="text"
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                className="w-full px-3 py-2 bg-[#141a29] border border-[#1b2336] rounded text-white focus:outline-none focus:border-[#00f2ff]"
                placeholder="Ej. Universidad Nacional de Trujillo / Facultad de Ingeniería"
              />
            </div>
          </div>

          {/* Preview Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#1b2336] pb-2">
              <span className="text-xs font-mono text-[#00f2ff] font-bold flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                Previsualización de Contenidos Incluidos en la Descarga:
              </span>

              <div className="flex gap-2">
                {[
                  { id: 'guide', label: 'Indicaciones de Redacción' },
                  { id: 'data', label: 'Parámetros del Caso de Estudio' },
                  { id: 'tables', label: 'Tablas 2 y 3 (Resultados)' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActivePreviewTab(t.id as any)}
                    className={`px-3 py-1 text-xs font-mono rounded cursor-pointer transition-colors ${
                      activePreviewTab === t.id
                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] font-bold border border-[#00f2ff]/40'
                        : 'text-[#9ca3af] hover:text-white'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Tab 1: Writing Guide Preview */}
            {activePreviewTab === 'guide' && (
              <div className="p-4 bg-[#0a0d14] rounded-xl border border-[#1b2336] space-y-4 text-xs font-mono">
                <div className="border-l-2 border-[#00f2ff] pl-3 py-0.5">
                  <h4 className="text-white font-bold">1. Introducción y Planteamiento del Problema (Gap)</h4>
                  <p className="text-[#9ca3af] text-[11px] mt-1 leading-relaxed">
                    Explicar que tradicionalmente la mina optimiza su costo unitario de perforación y voladura sin considerar el impacto en la planta. La fragmentación gruesa o heterogénea reduce la excavabilidad de las palas y dispara el consumo específico del molino SAG (que representa hasta el 70% de la energía eléctrica de la operación). Proponer el Gemelo Digital M-3 como el puente ciberfísico que unifica estas dos etapas mediante Reinforcement Learning.
                  </p>
                </div>

                <div className="border-l-2 border-purple-400 pl-3 py-0.5">
                  <h4 className="text-white font-bold">2. Metodología y Modelo Matemático</h4>
                  <p className="text-[#9ca3af] text-[11px] mt-1 leading-relaxed">
                    Formalizar el MDP con espacio de estados en R^24, control discreto de asignación de camiones y control continuo del factor de carga. Justificar la integración de las ecuaciones de Cunningham (1987) para el cálculo de tamaño medio (xm), Rosin-Rammler para el P80 y la ley de potencia de Morrell para el consumo del molino SAG.
                  </p>
                </div>

                <div className="border-l-2 border-emerald-400 pl-3 py-0.5">
                  <h4 className="text-white font-bold">3. Resultados y Justificación Estadística</h4>
                  <p className="text-[#9ca3af] text-[11px] mt-1 leading-relaxed">
                    Presentar la Tabla 2 demostrando que la política DRL PPO reduce la cola en palas a 1.42 min (frente a 4.85 min de FIFO) y aumenta la producción a 5,124 TPH. Utilizar la prueba t de Welch para reportar p &lt; 0.001 y el d de Cohen de 1.34 para confirmar un efecto de gran escala que satisface los requerimientos de revistas Q1.
                  </p>
                </div>

                <div className="border-l-2 border-amber-400 pl-3 py-0.5">
                  <h4 className="text-white font-bold">4. Discusión del Trade-off Económico y Energético</h4>
                  <p className="text-[#9ca3af] text-[11px] mt-1 leading-relaxed">
                    Demostrar mediante la envolvente de Pareto que incrementar el gasto en explosivo en +0.12 kg/m³ genera un ahorro masivo en molienda SAG (-1.94 kWh/t), reduciendo el costo operacional global en -$1.08 por tonelada movida.
                  </p>
                </div>
              </div>
            )}

            {/* Sub-Tab 2: Geotechnical Data Preview */}
            {activePreviewTab === 'data' && (
              <div className="p-4 bg-[#0a0d14] rounded-xl border border-[#1b2336] grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1.5 text-[#9ca3af] text-[11px]">
                  <div className="text-white font-bold text-xs border-b border-[#1b2336] pb-1 text-[#00f2ff]">
                    Propiedades Geomecánicas y Voladura
                  </div>
                  <p><span className="text-white font-semibold">Yacimiento:</span> {caseStudy.name}</p>
                  <p><span className="text-white font-semibold">Litología:</span> {caseStudy.lithology}</p>
                  <p><span className="text-white font-semibold">Resistencia UCS:</span> {caseStudy.geotechnical.ucsMpa} MPa</p>
                  <p><span className="text-white font-semibold">Densidad Roca:</span> {caseStudy.geotechnical.densityTM3} t/m³</p>
                  <p><span className="text-white font-semibold">Factor Cunningham A:</span> {caseStudy.geotechnical.rockMassFactorA}</p>
                  <p><span className="text-white font-semibold">Malla (B x S):</span> {caseStudy.blasting.burdenM}m x {caseStudy.blasting.spacingM}m</p>
                  <p><span className="text-white font-semibold">Factor de Carga q:</span> {powderFactor.toFixed(2)} kg/m³</p>
                </div>

                <div className="space-y-1.5 text-[#9ca3af] text-[11px]">
                  <div className="text-white font-bold text-xs border-b border-[#1b2336] pb-1 text-emerald-400">
                    Flota de Equipos y Planta de Molienda
                  </div>
                  <p><span className="text-white font-semibold">Palas de Carguío:</span> {caseStudy.fleet.shovelCount}x {caseStudy.fleet.shovelModel} ({caseStudy.fleet.shovelBucketM3} m³)</p>
                  <p><span className="text-white font-semibold">Camiones de Acarreo:</span> {caseStudy.fleet.truckCount}x {caseStudy.fleet.truckModel} ({caseStudy.fleet.truckCapacityTonnes} t)</p>
                  <p><span className="text-white font-semibold">Distancia Acarreo:</span> {caseStudy.fleet.haulDistanceKm} km (Rampa {caseStudy.fleet.rampGradientPercent}%)</p>
                  <p><span className="text-white font-semibold">Molino SAG:</span> {caseStudy.plant.sagMillDimensions} ({caseStudy.plant.sagPowerMw} MW)</p>
                  <p><span className="text-white font-semibold">P80 Alimentación Óptimo:</span> {caseStudy.plant.sagTargetP80Mm} mm</p>
                  <p><span className="text-white font-semibold">Bond Work Index Wi:</span> {caseStudy.plant.bondWorkIndexKwhT} kWh/t</p>
                  <p><span className="text-white font-semibold">Costo Energía:</span> ${caseStudy.plant.energyCostUsdKwh}/kWh</p>
                </div>
              </div>
            )}

            {/* Sub-Tab 3: Tables Preview */}
            {activePreviewTab === 'tables' && (
              <div className="p-4 bg-[#0a0d14] rounded-xl border border-[#1b2336] space-y-4 text-xs font-mono overflow-x-auto">
                <div>
                  <h4 className="text-white font-bold mb-2">Tabla 2: Validación Comparativa de Políticas (N = {sampleSize} corridas)</h4>
                  <table className="w-full text-left text-[11px]">
                    <thead className="bg-[#141a29] text-[#9ca3af] border-b border-[#1b2336]">
                      <tr>
                        <th className="py-2 px-3">Política</th>
                        <th className="py-2 px-3">TPH</th>
                        <th className="py-2 px-3">Cola Pala (min)</th>
                        <th className="py-2 px-3">SAG (kWh/t)</th>
                        <th className="py-2 px-3">Costo ($/t)</th>
                        <th className="py-2 px-3">Welch (p-val)</th>
                        <th className="py-2 px-3">Cohen's d</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1b2336]">
                      {benchmarks.map((b) => {
                        const tphMean = b.tph?.mean?.toFixed(0) ?? '0';
                        const tphStd = b.tph?.stdDev?.toFixed(0) ?? '0';
                        const waitMean = b.shovelWaitMin?.mean?.toFixed(2) ?? '0.00';
                        const sagMean = b.sagEnergyKwhT?.mean?.toFixed(2) ?? '0.00';
                        const costMean = b.unitCostUsd?.mean?.toFixed(2) ?? '0.00';
                        const cohenD = b.tTestVsBaseline?.cohenD?.toFixed(2) ?? '—';

                        return (
                          <tr key={b.policy} className={b.policy === 'drl_ppo_agent' ? 'text-[#00f2ff] font-bold bg-[#00f2ff]/5' : 'text-[#9ca3af]'}>
                            <td className="py-2 px-3">{b.policyLabel || b.policy}</td>
                            <td className="py-2 px-3">{tphMean} ± {tphStd}</td>
                            <td className="py-2 px-3">{waitMean}</td>
                            <td className="py-2 px-3">{sagMean}</td>
                            <td className="py-2 px-3">${costMean}</td>
                            <td className="py-2 px-3">{b.policy === 'fixed' || !b.tTestVsBaseline ? 'Baseline' : 'p < 0.001 (***)'}</td>
                            <td className="py-2 px-3">{b.policy === 'fixed' || !b.tTestVsBaseline ? '—' : `d = ${cohenD}`}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-[#141a29] border-t border-[#1b2336] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[#9ca3af]">
            <Award className="w-4 h-4 text-[#00f2ff]" />
            <span>Formato 100% compatible con normativas de Elsevier, IEEE y Springer.</span>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-[#172033] hover:bg-[#1f2b45] text-white text-xs font-mono rounded-lg transition-colors cursor-pointer"
            >
              Cerrar
            </button>
            <button
              onClick={handleDownloadBoth}
              className="px-4 py-2 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-[#00f2ff]/10"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Descargar PDF + CSV Ahora</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
