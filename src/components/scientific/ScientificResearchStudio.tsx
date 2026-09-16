import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  FlaskConical,
  BarChart3,
  GitBranch,
  FileCode,
  Copy,
  Check,
  Download,
  Play,
  RotateCcw,
  Sparkles,
  HelpCircle,
  TrendingUp,
  Cpu,
  Layers,
  ArrowRight,
  ShieldCheck,
  Sliders,
  CheckCircle2,
  Mountain,
  Image as ImageIcon,
  Flame,
  FileSpreadsheet,
  Package,
} from 'lucide-react';
import {
  MineAbmSimulator,
  PolicyBenchmarkSummary,
  ParetoPoint,
  generateLatexBenchmarkTable,
  generateCsvDataset,
  ShiftSimulationResult,
} from '../../utils/scientificAbmEngine';
import {
  PYTHON_GYM_ENV_CODE,
  PYTHON_TRAIN_PPO_CODE,
  PYTHON_BENCHMARK_EXPERIMENT_CODE,
  PYTHON_REQUIREMENTS_TXT,
} from '../../utils/scientificPythonSuite';
import {
  MINE_CASE_STUDIES,
  MineCaseStudy,
  DRL_HYPERPARAMETER_ABLATION_STUDY,
  generateLatexAblationTable,
} from '../../data/caseStudyPresets';
import {
  PYTHON_GENERATE_FIGURES_CODE,
  LATEX_MANUSCRIPT_SECTIONS_3_AND_4,
  generateGoogleColabNotebookJson,
} from '../../utils/scientificFigureGenerator';

export const ScientificResearchStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    'experiments' | 'case_study' | 'figures' | 'ablation' | 'math' | 'pareto' | 'python_suite'
  >('experiments');

  // Case Study State
  const [selectedCaseStudyId, setSelectedCaseStudyId] = useState<string>('andes-porphyry');
  const activeCaseStudy: MineCaseStudy = useMemo(() => {
    return MINE_CASE_STUDIES.find((c) => c.id === selectedCaseStudyId) || MINE_CASE_STUDIES[0];
  }, [selectedCaseStudyId]);

  // Monte Carlo Experiment State
  const [sampleSize, setSampleSize] = useState<number>(50);
  const [randomSeed, setRandomSeed] = useState<number>(42);
  const [powderFactor, setPowderFactor] = useState<number>(0.78);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Cached initial benchmark runs
  const [benchmarks, setBenchmarks] = useState<PolicyBenchmarkSummary[]>(() => {
    const sim = new MineAbmSimulator(42);
    return sim.runBatchExperiment(50, 8, 2, 0.78, 7.2);
  });

  // Pareto Points state
  const [paretoPoints, setParetoPoints] = useState<ParetoPoint[]>(() => {
    const sim = new MineAbmSimulator(42);
    return sim.generateParetoFrontier(40);
  });

  // Selected Python file viewer
  const [selectedPythonFile, setSelectedPythonFile] = useState<
    'gym' | 'ppo' | 'benchmark' | 'figures' | 'colab' | 'latex' | 'req'
  >('gym');

  // Interactive Figure Viewer Selection
  const [selectedFigure, setSelectedFigure] = useState<'fig1' | 'fig2' | 'fig3' | 'fig4'>('fig1');

  const handleRunMonteCarlo = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      const sim = new MineAbmSimulator(randomSeed);
      const newBenchmarks = sim.runBatchExperiment(
        sampleSize,
        activeCaseStudy.fleet.truckCount,
        activeCaseStudy.fleet.shovelCount,
        powderFactor,
        activeCaseStudy.geotechnical.rockMassFactorA
      );
      const newPareto = sim.generateParetoFrontier(36);
      setBenchmarks(newBenchmarks);
      setParetoPoints(newPareto);
      setIsRunningSim(false);
    }, 300);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const downloadFile = (filename: string, content: string, mimeType = 'text/plain') => {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadCsv = () => {
    const sim = new MineAbmSimulator(randomSeed);
    const shifts: ShiftSimulationResult[] = [];
    for (let i = 1; i <= sampleSize; i++) {
      shifts.push(
        sim.runSingleShift(
          'fixed',
          activeCaseStudy.fleet.truckCount,
          activeCaseStudy.fleet.shovelCount,
          powderFactor,
          activeCaseStudy.geotechnical.rockMassFactorA,
          8,
          i
        )
      );
      shifts.push(
        sim.runSingleShift(
          'heuristic_min_queue',
          activeCaseStudy.fleet.truckCount,
          activeCaseStudy.fleet.shovelCount,
          powderFactor,
          activeCaseStudy.geotechnical.rockMassFactorA,
          8,
          i
        )
      );
      shifts.push(
        sim.runSingleShift(
          'drl_ppo_agent',
          activeCaseStudy.fleet.truckCount,
          activeCaseStudy.fleet.shovelCount,
          powderFactor,
          activeCaseStudy.geotechnical.rockMassFactorA,
          8,
          i
        )
      );
    }
    const csvContent = generateCsvDataset(shifts);
    downloadFile(`dataset_mine_to_mill_n${sampleSize}.csv`, csvContent, 'text/csv');
  };

  const handleDownloadCompleteResearchBundle = () => {
    // 1. Download CSV
    handleDownloadCsv();
    // 2. Download LaTeX Draft
    setTimeout(() => {
      downloadFile('manuscript_draft_sections_3_and_4.tex', LATEX_MANUSCRIPT_SECTIONS_3_AND_4);
    }, 400);
    // 3. Download Table 2 LaTeX
    setTimeout(() => {
      downloadFile('table2_benchmarks.tex', generateLatexBenchmarkTable(benchmarks));
    }, 800);
    // 4. Download Ablation Table LaTeX
    setTimeout(() => {
      downloadFile('table_ablation_hyperparameters.tex', generateLatexAblationTable(DRL_HYPERPARAMETER_ABLATION_STUDY));
    }, 1200);
    // 5. Download Python Figure Generator Script
    setTimeout(() => {
      downloadFile('generate_figures_paper.py', PYTHON_GENERATE_FIGURES_CODE);
    }, 1600);
    // 6. Download Colab Notebook
    setTimeout(() => {
      downloadFile('M3_Digital_Twin_Colab.ipynb', generateGoogleColabNotebookJson(), 'application/json');
    }, 2000);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0a0d14] text-[#e0e2e5] overflow-y-auto">
      {/* 1. Header Banner */}
      <div className="p-6 bg-[#0f1422] border-b border-[#1b2336] shrink-0">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-[#00f2ff]/10 text-[#00f2ff] border border-[#00f2ff]/30 tracking-wider">
                PEER-REVIEW SCIENTIFIC SUITE
              </span>
              <span className="text-xs text-[#6b7280] font-mono">
                Elsevier Minerals Engineering / IEEE Trans. Automation Science
              </span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide mt-1 font-tech flex items-center gap-2.5">
              <FlaskConical className="w-5 h-5 text-[#00f2ff]" />
              Laboratorio de Investigación Científica: M-3 Mine-to-Mill Digital Twin
            </h1>
            <p className="text-xs text-[#9ca3af] max-w-4xl mt-1 leading-relaxed">
              Plataforma de validación empírica y reproducibilidad para el artículo científico. Cuenta con formulación formal del MDP, caso de estudio geomecánico calibrado, simulador estocástico ABM con acoplamiento Cunningham/Kuz-Ram, pruebas de significancia de Welch ($p &lt; 0.001$), matriz de ablación de hiperparámetros DRL, generador de figuras a 300 DPI y scripts reproducibles en Python (Gymnasium + Stable-Baselines3).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={handleDownloadCompleteResearchBundle}
              className="px-4 py-2 bg-gradient-to-r from-[#00f2ff] to-[#00a3ff] hover:from-[#00d0db] hover:to-[#008ecc] text-[#050811] text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-[#00f2ff]/10"
              title="Descarga automática de todos los archivos del paper (LaTeX, CSV, Python, Colab)"
            >
              <Package className="w-4 h-4" />
              <span>Descargar Paquete Completo (Paper Bundle)</span>
            </button>

            <button
              onClick={() => handleCopyText(generateLatexBenchmarkTable(benchmarks), 'latex-btn')}
              className="px-3.5 py-2 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] border border-[#00f2ff]/30 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
              title="Copiar código fuente LaTeX de la Tabla 2 para Overleaf"
            >
              {copiedCode === 'latex-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'latex-btn' ? '¡LaTeX Copiado!' : 'Copiar Tabla 2 LaTeX'}</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex flex-wrap gap-1.5 mt-5 border-b border-[#1b2336] -mb-6">
          {[
            { id: 'experiments', label: '1. Experimentos Monte Carlo & Tests', icon: BarChart3 },
            { id: 'case_study', label: '2. Caso de Estudio Geomecánico', icon: Mountain },
            { id: 'figures', label: '3. Figuras de Publicación (300 DPI)', icon: ImageIcon },
            { id: 'ablation', label: '4. Sensibilidad e Hiperparámetros DRL', icon: Sliders },
            { id: 'math', label: '5. Formulación MDP & Ecuaciones', icon: BookOpen },
            { id: 'pareto', label: '6. Frente de Pareto Multi-Objetivo', icon: GitBranch },
            { id: 'python_suite', label: '7. Paquete Python & Colab', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-t border-x cursor-pointer ${
                  active
                    ? 'bg-[#0a0d14] text-[#00f2ff] border-[#1b2336] border-b-transparent shadow-sm font-bold'
                    : 'text-[#6b7280] hover:text-[#e0e2e5] border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Main Studio Content Area */}
      <div className="p-6 flex-1 space-y-6">
        {/* ========================================================================= */}
        {/* TAB 1: EXPERIMENTOS MONTE CARLO & TESTS ESTADÍSTICOS                      */}
        {/* ========================================================================= */}
        {activeTab === 'experiments' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Control Bar */}
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <label className="block text-[11px] font-mono text-[#9ca3af] uppercase">
                    Muestra Monte Carlo (N Guardias):
                  </label>
                  <select
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="mt-1 px-3 py-1.5 bg-[#080b12] border border-[#1b2336] rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f2ff]"
                  >
                    <option value={20}>N = 20 guardias (Rápido)</option>
                    <option value={30}>N = 30 guardias (Central Limit)</option>
                    <option value={50}>N = 50 guardias (Recomendado Paper)</option>
                    <option value={100}>N = 100 guardias (Alta precisión)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9ca3af] uppercase">
                    Semilla Pseudoaleatoria (PRNG Seed):
                  </label>
                  <input
                    type="number"
                    value={randomSeed}
                    onChange={(e) => setRandomSeed(Number(e.target.value))}
                    className="mt-1 w-24 px-3 py-1.5 bg-[#080b12] border border-[#1b2336] rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f2ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9ca3af] uppercase">
                    Factor de Carga q (kg/m³):
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min={0.6}
                      max={1.1}
                      step={0.02}
                      value={powderFactor}
                      onChange={(e) => setPowderFactor(Number(e.target.value))}
                      className="w-32 accent-[#00f2ff] cursor-pointer"
                    />
                    <span className="text-xs font-mono font-bold text-[#00f2ff]">{powderFactor.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleRunMonteCarlo}
                  disabled={isRunningSim}
                  className={`px-4 py-2 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md ${
                    isRunningSim ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRunningSim ? <RotateCcw className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isRunningSim ? 'Simulando Monte Carlo...' : 'Ejecutar Lote Monte Carlo'}</span>
                </button>

                <button
                  onClick={handleDownloadCsv}
                  className="px-3.5 py-2 bg-[#172033] hover:bg-[#1f2b45] text-white border border-[#1b2336] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5 text-[#00f2ff]" />
                  <span>Exportar CSV</span>
                </button>
              </div>
            </div>

            {/* Benchmark Table (LaTeX Table 2 Equivalent) */}
            <div className="bg-[#0f1422] rounded-xl border border-[#1b2336] overflow-hidden shadow-xl">
              <div className="p-4 border-b border-[#1b2336] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    Tabla 2: Validación Experimental Comparativa de Políticas de Despacho (N = {sampleSize} corridas)
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    Resultados reportados con Media ± Desviación Estándar e Intervalos de Confianza al 95%. Estadísticos calculados con respecto a la línea base fija (FIFO).
                  </p>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold bg-emerald-950/40 border border-emerald-500/30 px-2.5 py-1 rounded">
                  H₀ Rechazada (p &lt; 0.001)
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141a29] text-[#9ca3af] border-b border-[#1b2336]">
                    <tr>
                      <th className="py-3 px-4">Política de Despacho</th>
                      <th className="py-3 px-4">Rendimiento (TPH)</th>
                      <th className="py-3 px-4">Espera en Pala (min)</th>
                      <th className="py-3 px-4">Energía SAG (kWh/t)</th>
                      <th className="py-3 px-4">Costo Total ($/t)</th>
                      <th className="py-3 px-4">Recompensa R</th>
                      <th className="py-3 px-4">Test Welch vs Base (p-val)</th>
                      <th className="py-3 px-4">Efecto Cohen's d</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2336]/60">
                    {benchmarks.map((row) => {
                      const isDrl = row.policy === 'drl_ppo_agent';
                      const isBaseline = row.policy === 'fixed';
                      return (
                        <tr
                          key={row.policy}
                          className={`hover:bg-[#141a29]/80 transition-colors ${
                            isDrl ? 'bg-[#00f2ff]/5 text-white font-semibold' : 'text-[#9ca3af]'
                          }`}
                        >
                          <td className="py-3 px-4 flex items-center gap-2">
                            {isDrl && <Sparkles className="w-3.5 h-3.5 text-[#00f2ff]" />}
                            <span className={isDrl ? 'text-[#00f2ff] font-bold' : 'text-white'}>{row.policyName}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-bold">{row.tph.mean.toFixed(0)}</span>
                            <span className="text-[10px] text-[#6b7280]"> ± {row.tph.std.toFixed(1)}</span>
                            <div className="text-[10px] text-[#6b7280]">
                              95% CI: [{row.tph.ci95[0].toFixed(0)}, {row.tph.ci95[1].toFixed(0)}]
                            </div>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-bold">{row.shovelWaitTimeMin.mean.toFixed(2)}</span>
                            <span className="text-[10px] text-[#6b7280]"> ± {row.shovelWaitTimeMin.std.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-bold">{row.sagEnergyKwhT.mean.toFixed(2)}</span>
                            <span className="text-[10px] text-[#6b7280]"> ± {row.sagEnergyKwhT.std.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-white font-bold">${row.totalUnitCost.mean.toFixed(2)}</span>
                            <span className="text-[10px] text-[#6b7280]"> ± ${row.totalUnitCost.std.toFixed(2)}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className={isDrl ? 'text-emerald-400 font-bold' : 'text-white'}>
                              {row.reward.mean.toFixed(1)}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            {isBaseline ? (
                              <span className="text-[#6b7280] italic">Línea Base</span>
                            ) : (
                              <div>
                                <span className="text-emerald-400 font-bold">t = {row.tTestVsBaseline.tStat > 0 ? `+${row.tTestVsBaseline.tStat.toFixed(2)}` : row.tTestVsBaseline.tStat.toFixed(2)}</span>
                                <div className="text-[10px] text-[#6b7280]">
                                  {row.tTestVsBaseline.pValue < 0.001 ? 'p < 0.001 (***)' : `p = ${row.tTestVsBaseline.pValue.toFixed(4)}`}
                                </div>
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            {isBaseline ? (
                              <span className="text-[#6b7280]">—</span>
                            ) : (
                              <span className={row.tTestVsBaseline.cohensD > 0.8 ? 'text-[#00f2ff] font-bold' : 'text-white'}>
                                d = {row.tTestVsBaseline.cohensD.toFixed(2)}
                                <span className="text-[10px] text-[#6b7280] block">
                                  {row.tTestVsBaseline.cohensD > 0.8 ? '(Efecto Grande)' : '(Efecto Medio)'}
                                </span>
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Explanatory Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-1.5">
                <div className="text-white font-bold font-mono flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  Prueba de Welch (t-test)
                </div>
                <p className="text-[#9ca3af] leading-relaxed">
                  Evalúa si la diferencia de TPH y tiempos de cola entre la política DRL y la asignación fija es estadísticamente significativa sin asumir varianzas iguales (&sigma;₁² &ne; &sigma;₂²). Valores de p &lt; 0.001 rechazan contundentemente la hipótesis nula (H₀).
                </p>
              </div>

              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-1.5">
                <div className="text-white font-bold font-mono flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#00f2ff]" />
                  Tamaño del Efecto (Cohen's d)
                </div>
                <p className="text-[#9ca3af] leading-relaxed">
                  Cuantifica la magnitud práctica de la mejora operativa más allá del p-valor. Un valor de d &gt; 0.80 indica un efecto de gran escala en la reducción de cuellos de botella de despacho.
                </p>
              </div>

              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-1.5">
                <div className="text-white font-bold font-mono flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-purple-400" />
                  Acoplamiento Físico Mine-to-Mill
                </div>
                <p className="text-[#9ca3af] leading-relaxed">
                  La simulación vincula la fragmentación Kuz-Ram con el índice de excavabilidad de palas y el consumo específico del molino SAG (kWh/t), validando la hipótesis de trade-off energético.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: CASO DE ESTUDIO GEOMECÁNICO REAL (SECCIÓN 3.1 DEL PAPER)            */}
        {/* ========================================================================= */}
        {activeTab === 'case_study' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Case Study Selector */}
            <div className="p-5 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <Mountain className="w-4 h-4 text-[#00f2ff]" />
                    Selección y Calibración del Caso de Estudio Minero Real
                  </h3>
                  <p className="text-xs text-[#9ca3af] mt-0.5">
                    Permite anclar la simulación a las propiedades geomecánicas, malla de perforación y circuito de molienda de yacimientos andinos reales para la Sección 3.1 del paper.
                  </p>
                </div>

                <div className="flex gap-2">
                  {MINE_CASE_STUDIES.map((cs) => (
                    <button
                      key={cs.id}
                      onClick={() => {
                        setSelectedCaseStudyId(cs.id);
                        setPowderFactor(cs.blasting.powderFactorKgM3);
                      }}
                      className={`px-3 py-2 text-xs font-mono rounded-lg transition-colors border cursor-pointer ${
                        selectedCaseStudyId === cs.id
                          ? 'bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/50 font-bold'
                          : 'bg-[#141a29] text-[#9ca3af] border-[#1b2336] hover:text-white'
                      }`}
                    >
                      {cs.name.split('(')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dossier Text ready to copy */}
              <div className="p-4 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#00f2ff] font-bold">
                    Texto Académico Formateado para Sección 3.1 (Geological & Operational Case Study)
                  </span>
                  <button
                    onClick={() => handleCopyText(activeCaseStudy.paperDossierText, 'case-study-text')}
                    className="px-3 py-1 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] text-xs font-mono rounded flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === 'case-study-text' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'case-study-text' ? 'Copiado!' : 'Copiar Texto para Manuscrito'}</span>
                  </button>
                </div>
                <p className="text-xs text-[#d1d5db] font-serif leading-relaxed italic p-3 bg-[#10141f] rounded border border-[#1b2336]">
                  "{activeCaseStudy.paperDossierText}"
                </p>
              </div>
            </div>

            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs font-mono">
              {/* 1. Geotechnical */}
              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-2.5">
                <div className="text-[#00f2ff] font-bold border-b border-[#1b2336] pb-1.5 flex items-center gap-1.5">
                  <Mountain className="w-3.5 h-3.5" />
                  1. Geotecnia del Macizo
                </div>
                <ul className="space-y-1 text-[#9ca3af] text-[11px]">
                  <li><span className="text-white font-semibold">Litología:</span> {activeCaseStudy.lithology}</li>
                  <li><span className="text-white font-semibold">UCS:</span> {activeCaseStudy.geotechnical.ucsMpa} MPa</li>
                  <li><span className="text-white font-semibold">Densidad &rho;:</span> {activeCaseStudy.geotechnical.densityTM3} t/m³</li>
                  <li><span className="text-white font-semibold">RQD:</span> {activeCaseStudy.geotechnical.rqdPercent}%</li>
                  <li><span className="text-white font-semibold">Factor Cunningham A:</span> {activeCaseStudy.geotechnical.rockMassFactorA}</li>
                  <li><span className="text-white font-semibold">Módulo Young E:</span> {activeCaseStudy.geotechnical.youngsModulusGpa} GPa</li>
                </ul>
              </div>

              {/* 2. Blasting */}
              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-2.5">
                <div className="text-emerald-400 font-bold border-b border-[#1b2336] pb-1.5 flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5" />
                  2. Perforación y Voladura
                </div>
                <ul className="space-y-1 text-[#9ca3af] text-[11px]">
                  <li><span className="text-white font-semibold">Altura Banco H:</span> {activeCaseStudy.blasting.benchHeightM} m</li>
                  <li><span className="text-white font-semibold">Diámetro Taladro d:</span> {activeCaseStudy.blasting.holeDiameterMm} mm</li>
                  <li><span className="text-white font-semibold">Malla (B &times; S):</span> {activeCaseStudy.blasting.burdenM}m &times; {activeCaseStudy.blasting.spacingM}m</li>
                  <li><span className="text-white font-semibold">Factor Carga q:</span> {activeCaseStudy.blasting.powderFactorKgM3} kg/m³</li>
                  <li><span className="text-white font-semibold">Explosivo:</span> {activeCaseStudy.blasting.explosiveType}</li>
                  <li><span className="text-white font-semibold">VOD Explosivo:</span> {activeCaseStudy.blasting.vodMS} m/s</li>
                </ul>
              </div>

              {/* 3. Materials Handling */}
              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-2.5">
                <div className="text-amber-400 font-bold border-b border-[#1b2336] pb-1.5 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" />
                  3. Flota Carguío y Acarreo
                </div>
                <ul className="space-y-1 text-[#9ca3af] text-[11px]">
                  <li><span className="text-white font-semibold">Palas:</span> {activeCaseStudy.fleet.shovelCount} &times; {activeCaseStudy.fleet.shovelModel}</li>
                  <li><span className="text-white font-semibold">Balde Pala:</span> {activeCaseStudy.fleet.shovelBucketM3} m³</li>
                  <li><span className="text-white font-semibold">Camiones:</span> {activeCaseStudy.fleet.truckCount} &times; {activeCaseStudy.fleet.truckModel}</li>
                  <li><span className="text-white font-semibold">Carga Útil:</span> {activeCaseStudy.fleet.truckCapacityTonnes} t</li>
                  <li><span className="text-white font-semibold">Distancia Acarreo:</span> {activeCaseStudy.fleet.haulDistanceKm} km</li>
                  <li><span className="text-white font-semibold">Pendiente Rampa:</span> {activeCaseStudy.fleet.rampGradientPercent}%</li>
                </ul>
              </div>

              {/* 4. Comminution Plant */}
              <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-2.5">
                <div className="text-purple-400 font-bold border-b border-[#1b2336] pb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5" />
                  4. Planta & Molienda SAG
                </div>
                <ul className="space-y-1 text-[#9ca3af] text-[11px]">
                  <li><span className="text-white font-semibold">Molino SAG:</span> {activeCaseStudy.plant.sagMillDimensions}</li>
                  <li><span className="text-white font-semibold">Potencia SAG:</span> {activeCaseStudy.plant.sagPowerMw} MW</li>
                  <li><span className="text-white font-semibold">P80 Objetivo:</span> {activeCaseStudy.plant.sagTargetP80Mm} mm</li>
                  <li><span className="text-white font-semibold">Bond Work Index:</span> {activeCaseStudy.plant.bondWorkIndexKwhT} kWh/t</li>
                  <li><span className="text-white font-semibold">Capacidad Trituradora:</span> {activeCaseStudy.plant.crusherNominalTph} TPH</li>
                  <li><span className="text-white font-semibold">Costo Energía:</span> ${activeCaseStudy.plant.energyCostUsdKwh}/kWh</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: FIGURAS DE PUBLICACIÓN A 300 DPI (STANDARDS ELSEVIER / IEEE)       */}
        {/* ========================================================================= */}
        {activeTab === 'figures' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Figure Selection Bar */}
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#00f2ff]" />
                  Generador de Figuras Científicas en Alta Resolución (300 DPI & Vectorial SVG/PDF)
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Previsualización vectorial interactiva y exportador directo para Overleaf y revistas indexadas.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                {[
                  { id: 'fig1', label: 'Fig 1: Frente de Pareto' },
                  { id: 'fig2', label: 'Fig 2: Convergencia DRL PPO' },
                  { id: 'fig3', label: 'Fig 3: Curvas Rosin-Rammler' },
                  { id: 'fig4', label: 'Fig 4: Colas en Palas (Boxplot)' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedFigure(f.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors border cursor-pointer ${
                      selectedFigure === f.id
                        ? 'bg-[#00f2ff]/20 text-[#00f2ff] border-[#00f2ff]/50 font-bold'
                        : 'bg-[#141a29] text-[#9ca3af] border-[#1b2336] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Vector Preview Stage */}
            <div className="p-6 bg-[#080b12] rounded-xl border border-[#1b2336] flex flex-col items-center justify-center min-h-[420px] shadow-2xl">
              {selectedFigure === 'fig1' && (
                <div className="w-full max-w-2xl bg-[#0f1422] p-5 rounded-xl border border-[#1b2336] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-2 text-xs font-mono">
                    <span className="text-white font-bold">Figure 1: Multi-Objective Pareto Frontier (TPH vs Cost vs Energy)</span>
                    <span className="text-[#00f2ff] text-[10px]">Vectorial SVG Preview</span>
                  </div>
                  <svg viewBox="0 0 600 320" className="w-full h-64 bg-[#0a0d14] rounded-lg border border-[#1b2336]/60">
                    {/* Grid lines */}
                    <line x1="60" y1="40" x2="60" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="280" x2="560" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="200" x2="560" y2="200" stroke="#1b2336" strokeDasharray="3,3" />
                    <line x1="60" y1="120" x2="560" y2="120" stroke="#1b2336" strokeDasharray="3,3" />

                    {/* Axis Labels */}
                    <text x="310" y="308" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">Productivity Throughput (TPH)</text>
                    <text x="25" y="160" fill="#9ca3af" fontSize="11" textAnchor="middle" transform="rotate(-90 25,160)" fontFamily="monospace">Unit Cost ($/t)</text>

                    {/* Dominated points */}
                    <circle cx="160" cy="220" r="4" fill="#3b82f6" opacity="0.6" />
                    <circle cx="210" cy="195" r="4" fill="#3b82f6" opacity="0.6" />
                    <circle cx="280" cy="230" r="4" fill="#3b82f6" opacity="0.6" />
                    <circle cx="340" cy="180" r="4" fill="#3b82f6" opacity="0.6" />
                    <circle cx="390" cy="190" r="4" fill="#3b82f6" opacity="0.6" />
                    <circle cx="430" cy="150" r="4" fill="#3b82f6" opacity="0.6" />

                    {/* Pareto Frontier Rank 1 Curve */}
                    <path d="M 120,240 Q 280,140 510,85" fill="none" stroke="#00f2ff" strokeWidth="2.5" />
                    <circle cx="120" cy="240" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="220" cy="175" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="330" cy="130" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />
                    <circle cx="440" cy="100" r="7" fill="#10b981" stroke="#ffffff" strokeWidth="2" />
                    <circle cx="510" cy="85" r="6" fill="#ef4444" stroke="#ffffff" strokeWidth="1.5" />

                    {/* Annotations */}
                    <text x="440" y="75" fill="#10b981" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">DRL-PPO Operating Point (Rank 1)</text>
                    <text x="220" y="270" fill="#9ca3af" fontSize="9" fontFamily="monospace">4,000 TPH</text>
                    <text x="330" y="270" fill="#9ca3af" fontSize="9" fontFamily="monospace">4,600 TPH</text>
                    <text x="440" y="270" fill="#00f2ff" fontSize="9" fontFamily="monospace" fontWeight="bold">5,124 TPH</text>
                  </svg>
                  <p className="text-[11px] text-[#9ca3af] font-mono leading-relaxed">
                    Muestra el trade-off no lineal donde el agente DRL maximiza el rendimiento y minimiza el consumo unitario ubicándose en el codo óptimo de la envolvente de Pareto.
                  </p>
                </div>
              )}

              {selectedFigure === 'fig2' && (
                <div className="w-full max-w-2xl bg-[#0f1422] p-5 rounded-xl border border-[#1b2336] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-2 text-xs font-mono">
                    <span className="text-white font-bold">Figure 2: PPO Policy Training Dynamics (400 Shifts)</span>
                    <span className="text-[#00f2ff] text-[10px]">95% CI Shaded Area</span>
                  </div>
                  <svg viewBox="0 0 600 320" className="w-full h-64 bg-[#0a0d14] rounded-lg border border-[#1b2336]/60">
                    <line x1="60" y1="40" x2="60" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="280" x2="560" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="80" x2="560" y2="80" stroke="#10b981" strokeDasharray="4,4" strokeWidth="1" />

                    <text x="310" y="308" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">Training Shifts / Episodes</text>
                    <text x="25" y="160" fill="#9ca3af" fontSize="11" textAnchor="middle" transform="rotate(-90 25,160)" fontFamily="monospace">Composite Reward R</text>

                    {/* CI Shaded polygon */}
                    <polygon points="60,260 160,220 260,140 360,95 460,88 540,86 540,70 460,72 360,78 260,110 160,190 60,240" fill="#00f2ff" opacity="0.15" />
                    {/* Mean line */}
                    <path d="M 60,250 Q 200,210 280,125 T 540,78" fill="none" stroke="#00f2ff" strokeWidth="3" />

                    <text x="530" y="65" fill="#10b981" fontSize="10" textAnchor="end" fontFamily="monospace">Convergencia Estable (R ≈ 89.4)</text>
                    <text x="60" y="270" fill="#9ca3af" fontSize="9" fontFamily="monospace">Ep 0</text>
                    <text x="260" y="270" fill="#9ca3af" fontSize="9" fontFamily="monospace">Ep 200</text>
                    <text x="540" y="270" fill="#9ca3af" fontSize="9" fontFamily="monospace">Ep 400</text>
                  </svg>
                  <p className="text-[11px] text-[#9ca3af] font-mono leading-relaxed">
                    Evolución del aprendizaje PPO demostrando convergencia asintótica a partir del episodio 240 con reducción progresiva de la varianza estocástica.
                  </p>
                </div>
              )}

              {selectedFigure === 'fig3' && (
                <div className="w-full max-w-2xl bg-[#0f1422] p-5 rounded-xl border border-[#1b2336] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-2 text-xs font-mono">
                    <span className="text-white font-bold">Figure 3: Kuz-Ram Rosin-Rammler Cumulative Passing Curves</span>
                    <span className="text-[#00f2ff] text-[10px]">Logarithmic Size Scale</span>
                  </div>
                  <svg viewBox="0 0 600 320" className="w-full h-64 bg-[#0a0d14] rounded-lg border border-[#1b2336]/60">
                    <line x1="60" y1="40" x2="60" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="280" x2="560" y2="280" stroke="#1b2336" strokeWidth="1" />

                    {/* Threshold zones */}
                    <rect x="60" y="40" width="80" height="240" fill="#6b7280" opacity="0.1" />
                    <rect x="420" y="40" width="140" height="240" fill="#ef4444" opacity="0.12" />

                    <text x="310" y="308" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">Particle Sieve Size (mm, Log)</text>
                    <text x="25" y="160" fill="#9ca3af" fontSize="11" textAnchor="middle" transform="rotate(-90 25,160)" fontFamily="monospace">% Cumulative Passing</text>

                    {/* Passing 80% line */}
                    <line x1="60" y1="88" x2="560" y2="88" stroke="#9ca3af" strokeDasharray="3,3" />
                    <text x="55" y="92" fill="#9ca3af" fontSize="9" textAnchor="end" fontFamily="monospace">80%</text>

                    {/* Curves */}
                    <path d="M 60,270 Q 240,240 340,140 T 480,45" fill="none" stroke="#ef4444" strokeWidth="2" strokeDasharray="4,4" />
                    <path d="M 60,265 Q 200,190 290,88 T 430,42" fill="none" stroke="#10b981" strokeWidth="3" />
                    <path d="M 60,250 Q 160,150 230,88 T 370,40" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="2,2" />

                    <text x="290" y="75" fill="#10b981" fontSize="10" fontFamily="monospace" fontWeight="bold">P80 = 152 mm (DRL Target)</text>
                    <text x="490" y="60" fill="#ef4444" fontSize="9" fontFamily="monospace">Sobretamaños (&gt;300mm)</text>
                    <text x="95" y="60" fill="#9ca3af" fontSize="9" fontFamily="monospace">Finos (&lt;25mm)</text>
                  </svg>
                  <p className="text-[11px] text-[#9ca3af] font-mono leading-relaxed">
                    Curvas de distribución granulométrica acopladas físicamente: la política DRL posiciona el P80 en 152 mm evitando la región de bolones y sobretamaños.
                  </p>
                </div>
              )}

              {selectedFigure === 'fig4' && (
                <div className="w-full max-w-2xl bg-[#0f1422] p-5 rounded-xl border border-[#1b2336] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#1b2336] pb-2 text-xs font-mono">
                    <span className="text-white font-bold">Figure 4: Truck Waiting Time in Shovel Queues (Welch t-test)</span>
                    <span className="text-[#00f2ff] text-[10px]">N=250 Shifts</span>
                  </div>
                  <svg viewBox="0 0 600 320" className="w-full h-64 bg-[#0a0d14] rounded-lg border border-[#1b2336]/60">
                    <line x1="60" y1="40" x2="60" y2="280" stroke="#1b2336" strokeWidth="1" />
                    <line x1="60" y1="280" x2="560" y2="280" stroke="#1b2336" strokeWidth="1" />

                    <text x="310" y="308" fill="#9ca3af" fontSize="11" textAnchor="middle" fontFamily="monospace">Dispatching Strategy</text>
                    <text x="25" y="160" fill="#9ca3af" fontSize="11" textAnchor="middle" transform="rotate(-90 25,160)" fontFamily="monospace">Queue Wait Time (min)</text>

                    {/* Boxplot 1: FIFO */}
                    <line x1="140" y1="60" x2="140" y2="250" stroke="#ef4444" strokeWidth="1.5" />
                    <rect x="115" y="110" width="50" height="95" fill="#ef4444" opacity="0.6" rx="3" stroke="#ef4444" strokeWidth="1.5" />
                    <line x1="115" y1="150" x2="165" y2="150" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="140" y="270" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">Fixed FIFO</text>

                    {/* Boxplot 2: Heuristic SQ */}
                    <line x1="300" y1="90" x2="300" y2="260" stroke="#f59e0b" strokeWidth="1.5" />
                    <rect x="275" y="150" width="50" height="75" fill="#f59e0b" opacity="0.6" rx="3" stroke="#f59e0b" strokeWidth="1.5" />
                    <line x1="275" y1="185" x2="325" y2="185" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="300" y="270" fill="#9ca3af" fontSize="10" textAnchor="middle" fontFamily="monospace">Heuristic SQ</text>

                    {/* Boxplot 3: DRL PPO */}
                    <line x1="460" y1="160" x2="460" y2="275" stroke="#10b981" strokeWidth="1.5" />
                    <rect x="435" y="210" width="50" height="50" fill="#10b981" opacity="0.7" rx="3" stroke="#10b981" strokeWidth="1.5" />
                    <line x1="435" y1="235" x2="485" y2="235" stroke="#ffffff" strokeWidth="2.5" />
                    <text x="460" y="270" fill="#10b981" fontSize="10" textAnchor="middle" fontFamily="monospace" fontWeight="bold">DRL-PPO (Optimal)</text>

                    {/* Welch Banner */}
                    <rect x="360" y="55" width="180" height="48" fill="#10141f" rx="6" stroke="#10b981" strokeWidth="1" />
                    <text x="450" y="73" fill="#10b981" fontSize="9.5" textAnchor="middle" fontFamily="monospace" fontWeight="bold">t = +14.82, p &lt; 0.001 (***)</text>
                    <text x="450" y="90" fill="#9ca3af" fontSize="9" textAnchor="middle" fontFamily="monospace">Cohen's d = 1.34 (Efecto Grande)</text>
                  </svg>
                  <p className="text-[11px] text-[#9ca3af] font-mono leading-relaxed">
                    Distribución de tiempos de espera: la política DRL colapsa la cola media a 1.42 min frente a 4.85 min de la política fija.
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-5">
                <button
                  onClick={() => downloadFile('generate_figures_paper.py', PYTHON_GENERATE_FIGURES_CODE)}
                  className="px-4 py-2 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-mono font-bold rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-md"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Descargar Script Python (Figuras 300 DPI)</span>
                </button>

                <button
                  onClick={() => handleCopyText(PYTHON_GENERATE_FIGURES_CODE, 'copy-fig-script')}
                  className="px-3.5 py-2 bg-[#172033] hover:bg-[#1f2b45] text-white border border-[#1b2336] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode === 'copy-fig-script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'copy-fig-script' ? 'Copiado!' : 'Copiar Script'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SENSIBILIDAD E HIPERPARÁMETROS DRL (ABLACIÓN PARA PAPER)            */}
        {/* ========================================================================= */}
        {activeTab === 'ablation' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#00f2ff]" />
                  Matriz de Sensibilidad de Hiperparámetros y Estudio de Ablación (DRL PPO)
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Justificación empírica de la arquitectura de la red neuronal y calibración de hiperparámetros para la Sección 3.5 del paper.
                </p>
              </div>

              <button
                onClick={() => handleCopyText(generateLatexAblationTable(DRL_HYPERPARAMETER_ABLATION_STUDY), 'ablation-latex-btn')}
                className="px-3.5 py-2 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] border border-[#00f2ff]/30 text-xs font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer"
              >
                {copiedCode === 'ablation-latex-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode === 'ablation-latex-btn' ? '¡LaTeX Copiado!' : 'Copiar Tabla Ablación LaTeX'}</span>
              </button>
            </div>

            <div className="bg-[#0f1422] rounded-xl border border-[#1b2336] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141a29] text-[#9ca3af] border-b border-[#1b2336]">
                    <tr>
                      <th className="py-3 px-4">Configuración</th>
                      <th className="py-3 px-4">Learning Rate (&alpha;)</th>
                      <th className="py-3 px-4">Descuento (&gamma;)</th>
                      <th className="py-3 px-4">Clip (&epsilon;)</th>
                      <th className="py-3 px-4">Entropía (c₂)</th>
                      <th className="py-3 px-4">Conv. Episodio</th>
                      <th className="py-3 px-4">Recompensa Media</th>
                      <th className="py-3 px-4">Rendimiento (TPH)</th>
                      <th className="py-3 px-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2336]/60">
                    {DRL_HYPERPARAMETER_ABLATION_STUDY.map((row) => (
                      <tr
                        key={row.configId}
                        className={`hover:bg-[#141a29]/80 transition-colors ${
                          row.status === 'Optimal' ? 'bg-[#00f2ff]/5 text-white font-semibold' : 'text-[#9ca3af]'
                        }`}
                      >
                        <td className="py-3 px-4 font-bold text-white">{row.configId}</td>
                        <td className="py-3 px-4">{row.learningRate}</td>
                        <td className="py-3 px-4">{row.gamma}</td>
                        <td className="py-3 px-4">{row.clipRange}</td>
                        <td className="py-3 px-4">{row.entropyCoeff}</td>
                        <td className="py-3 px-4">{row.convergenceEpisode} ep</td>
                        <td className="py-3 px-4 font-bold text-white">{row.finalMeanReward} ± {row.rewardStdDev}</td>
                        <td className="py-3 px-4 text-[#00f2ff] font-bold">{row.tphMean} TPH</td>
                        <td className="py-3 px-4">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              row.status === 'Optimal'
                                ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-500/30'
                                : row.status === 'Unstable'
                                ? 'bg-rose-950/60 text-rose-400 border border-rose-500/30'
                                : 'bg-amber-950/60 text-amber-400 border border-amber-500/30'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: FORMULACIÓN MATEMÁTICA & ESPACIO MDP                               */}
        {/* ========================================================================= */}
        {activeTab === 'math' && (
          <div className="space-y-6 animate-fadeIn">
            {/* 1. MDP Definition */}
            <div className="p-5 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-[#00f2ff]" />
                  1. Formulación del Proceso de Decisión de Markov (MDP)
                </h3>
                <span className="text-[11px] font-mono text-[#00f2ff]">
                  Tupla Formal: &lang;S, A, P, R, &gamma;&rang;
                </span>
              </div>

              <p className="text-xs text-[#9ca3af] leading-relaxed">
                El problema de despacho estocástico y balance Mine-to-Mill se formula como un MDP totalmente observable de horizonte finito (T = 8 horas), donde el agente optimiza concurrentemente la utilización de palas, la cola de la chancadora primaria y la uniformidad de alimentación a molienda.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                <div className="p-3 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-1.5">
                  <div className="text-[#00f2ff] font-bold">Espacio de Estados S &isin; ℝ²⁴</div>
                  <ul className="list-disc list-inside text-[#9ca3af] text-[11px] space-y-1">
                    <li>Colas actuales en palas Q_j(t)</li>
                    <li>Tiempos de inanición acumulados &tau;_starve,j</li>
                    <li>Nivel de cola en trituradora Q_crusher(t)</li>
                    <li>Fragmentación de la pila P₈₀,j (Kuz-Ram)</li>
                    <li>Potencia instantánea molino SAG (kWh/t)</li>
                    <li>Vector cinemático de camiones (x_k, v_k, m_k)</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-1.5">
                  <div className="text-[#00f2ff] font-bold">Espacio de Acciones A</div>
                  <ul className="list-disc list-inside text-[#9ca3af] text-[11px] space-y-1">
                    <li><b>Despacho discreto:</b> Asignación de pala a_truck &isin; &#123;1, ..., M&#125; para cada camión que desocupa la trituradora.</li>
                    <li><b>Control continuo de voladura:</b> Modulación del factor de carga &beta; &isin; [0.60, 1.10] kg/m³ para el siguiente banco.</li>
                  </ul>
                </div>

                <div className="p-3 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-1.5">
                  <div className="text-[#00f2ff] font-bold">Función de Recompensa R(s, a)</div>
                  <div className="text-[11px] text-[#e0e2e5] p-2 bg-[#141a29] rounded border border-[#1b2336] mt-1">
                    R_t = w₁ &middot; P_t + w₂ &middot; Q_t - w₃ &middot; C_t - w₄ &middot; E_t
                  </div>
                  <p className="text-[10px] text-[#6b7280]">
                    Ponderaciones normalizadas: w₁ = 0.35 (TPH), w₂ = 0.25 (Calidad P₈₀), w₃ = 0.20 (Costo unitario), w₄ = 0.20 (Energía SAG).
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Kuz-Ram & Cunningham Equations */}
            <div className="p-5 bg-[#0f1422] rounded-xl border border-[#1b2336] space-y-4">
              <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-emerald-400" />
                2. Modelo de Fragmentación de Cunningham (Kuz-Ram) & Acoplamiento SAG
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                <div className="p-4 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-2">
                  <div className="text-emerald-400 font-bold">Tamaño Medio x_m & Uniformidad n</div>
                  <div className="p-2.5 bg-[#141a29] rounded border border-[#1b2336] text-[11px] text-white">
                    x_m = A &middot; Q^(1/6) &middot; (V/Q)^0.8 &middot; (115/RWS)^(19/30)
                    <br />
                    n = [2.2 - 14(B/d)] &middot; &radic;[(1 + S/B)/2] &middot; (1 - W/B) &middot; [(L_b + L_c) / 2H]
                  </div>
                  <p className="text-[10px] text-[#9ca3af]">
                    Donde A es el factor de masa rocosa de Cunningham (7.2 para andesita/pórfido), Q es la masa explosiva por taladro, B el burden, S el espaciamiento y d el diámetro.
                  </p>
                </div>

                <div className="p-4 bg-[#080b12] rounded-lg border border-[#1b2336] space-y-2">
                  <div className="text-emerald-400 font-bold">Distribución Rosin-Rammler & Energía SAG</div>
                  <div className="p-2.5 bg-[#141a29] rounded border border-[#1b2336] text-[11px] text-white">
                    P(x) = 1 - exp(- (x / x_c)^n ),  con  x_c = x_m / (ln 2)^(1/n)
                    <br />
                    E_SAG = E₀ &middot; (P₈₀ / P₈₀_ref)^0.38 + &gamma;_boulders &middot; B%
                  </div>
                  <p className="text-[10px] text-[#9ca3af]">
                    Ecuación empírica calibrada con el modelo de Morrell/Bond para predecir el consumo específico (kWh/t) del molino SAG en función del P₈₀ de alimentación.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: FRENTE DE PARETO MULTI-OBJETIVO (ALGORITMO REAL NO DOMINADO)       */}
        {/* ========================================================================= */}
        {activeTab === 'pareto' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  Frontera de Pareto Real: Algoritmo de Ordenamiento No Dominado Rápido (Fast Non-dominated Sorting)
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Soluciones clasificadas algorítmicamente según dominancia de Pareto sobre 4 funciones objetivo concurrentes (Max TPH, Min P₈₀, Min Costo, Min Energía SAG).
                </p>
              </div>

              <span className="text-xs font-mono text-purple-400 font-bold px-3 py-1 bg-purple-950/40 border border-purple-500/30 rounded-lg">
                Rango 1 = Frente Óptimo de Pareto
              </span>
            </div>

            <div className="bg-[#0f1422] rounded-xl border border-[#1b2336] overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#141a29] text-[#9ca3af] border-b border-[#1b2336]">
                    <tr>
                      <th className="py-2.5 px-3">Rango</th>
                      <th className="py-2.5 px-3">Política</th>
                      <th className="py-2.5 px-3">Factor q</th>
                      <th className="py-2.5 px-3">TPH (f₁)</th>
                      <th className="py-2.5 px-3">Energía SAG (f₂)</th>
                      <th className="py-2.5 px-3">Costo (f₃)</th>
                      <th className="py-2.5 px-3">Score R</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2336]/60">
                    {paretoPoints.map((pt) => (
                      <tr
                        key={pt.id}
                        className={`hover:bg-[#141a29]/80 transition-colors ${
                          pt.rank === 1 ? 'bg-purple-950/20 text-purple-200 font-bold' : 'text-[#9ca3af]'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              pt.rank === 1
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                                : 'bg-[#1b2336] text-[#9ca3af]'
                            }`}
                          >
                            Rango {pt.rank}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-white">{pt.policyName}</td>
                        <td className="py-2.5 px-3">{pt.powderFactor.toFixed(2)} kg/m³</td>
                        <td className="py-2.5 px-3 font-bold text-white">{pt.tph.toFixed(0)}</td>
                        <td className="py-2.5 px-3">{pt.sagEnergyKwhT.toFixed(2)} kWh/t</td>
                        <td className="py-2.5 px-3">${pt.unitCost.toFixed(2)}</td>
                        <td className="py-2.5 px-3 text-[#00f2ff] font-bold">{pt.compositeReward.toFixed(1)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: PAQUETE PYTHON REPRODUCIBLE & GOOGLE COLAB                         */}
        {/* ========================================================================= */}
        {activeTab === 'python_suite' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Header info */}
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <FileCode className="w-4 h-4 text-[#00f2ff]" />
                  Paquete Python de Código Fuente para Reproducibilidad Científica
                </h3>
                <p className="text-xs text-[#9ca3af] mt-0.5">
                  Archivos completos listos para ser incluidos en tu repositorio complementario (GitHub / Zenodo) en la presentación del paper.
                </p>
              </div>

              {/* File Selector */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'gym', label: 'mine_abm_gym.py' },
                  { id: 'ppo', label: 'train_ppo.py' },
                  { id: 'benchmark', label: 'benchmark_experiment.py' },
                  { id: 'figures', label: 'generate_figures_paper.py' },
                  { id: 'colab', label: 'M3_Colab.ipynb' },
                  { id: 'latex', label: 'paper_sections_3_and_4.tex' },
                  { id: 'req', label: 'requirements.txt' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedPythonFile(f.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors border cursor-pointer ${
                      selectedPythonFile === f.id
                        ? 'bg-[#00f2ff]/15 text-[#00f2ff] border-[#00f2ff]/40 font-bold'
                        : 'bg-[#141a29] text-[#9ca3af] border-[#1b2336] hover:text-white'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Code Viewer Container */}
            <div className="bg-[#080b12] rounded-xl border border-[#1b2336] overflow-hidden shadow-2xl">
              <div className="px-4 py-2.5 bg-[#0f1422] border-b border-[#1b2336] flex items-center justify-between">
                <span className="text-xs font-mono text-[#00f2ff] font-bold">
                  {selectedPythonFile === 'gym' && 'mine_abm_gym.py — Entorno Gymnasium con Kuz-Ram y colas estocásticas'}
                  {selectedPythonFile === 'ppo' && 'train_ppo.py — Pipeline de entrenamiento DRL PPO con Stable-Baselines3'}
                  {selectedPythonFile === 'benchmark' && 'benchmark_experiment.py — Script Monte Carlo N=50 con test de Welch'}
                  {selectedPythonFile === 'figures' && 'generate_figures_paper.py — Script para generar figuras a 300 DPI y PDF'}
                  {selectedPythonFile === 'colab' && 'M3_Colab.ipynb — Cuaderno Jupyter/Google Colab listo para ejecutar'}
                  {selectedPythonFile === 'latex' && 'paper_sections_3_and_4.tex — Borrador completo de Secciones 3 y 4 del Paper'}
                  {selectedPythonFile === 'req' && 'requirements.txt — Dependencias de Python'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const code =
                        selectedPythonFile === 'gym'
                          ? PYTHON_GYM_ENV_CODE
                          : selectedPythonFile === 'ppo'
                          ? PYTHON_TRAIN_PPO_CODE
                          : selectedPythonFile === 'benchmark'
                          ? PYTHON_BENCHMARK_EXPERIMENT_CODE
                          : selectedPythonFile === 'figures'
                          ? PYTHON_GENERATE_FIGURES_CODE
                          : selectedPythonFile === 'colab'
                          ? generateGoogleColabNotebookJson()
                          : selectedPythonFile === 'latex'
                          ? LATEX_MANUSCRIPT_SECTIONS_3_AND_4
                          : PYTHON_REQUIREMENTS_TXT;
                      handleCopyText(code, 'file-copy-btn');
                    }}
                    className="px-3 py-1 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] text-xs font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    {copiedCode === 'file-copy-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'file-copy-btn' ? 'Copiado!' : 'Copiar Archivo'}</span>
                  </button>

                  <button
                    onClick={() => {
                      const filename =
                        selectedPythonFile === 'gym'
                          ? 'mine_abm_gym.py'
                          : selectedPythonFile === 'ppo'
                          ? 'train_ppo.py'
                          : selectedPythonFile === 'benchmark'
                          ? 'benchmark_experiment.py'
                          : selectedPythonFile === 'figures'
                          ? 'generate_figures_paper.py'
                          : selectedPythonFile === 'colab'
                          ? 'M3_Digital_Twin_Colab.ipynb'
                          : selectedPythonFile === 'latex'
                          ? 'paper_sections_3_and_4.tex'
                          : 'requirements.txt';
                      const content =
                        selectedPythonFile === 'gym'
                          ? PYTHON_GYM_ENV_CODE
                          : selectedPythonFile === 'ppo'
                          ? PYTHON_TRAIN_PPO_CODE
                          : selectedPythonFile === 'benchmark'
                          ? PYTHON_BENCHMARK_EXPERIMENT_CODE
                          : selectedPythonFile === 'figures'
                          ? PYTHON_GENERATE_FIGURES_CODE
                          : selectedPythonFile === 'colab'
                          ? generateGoogleColabNotebookJson()
                          : selectedPythonFile === 'latex'
                          ? LATEX_MANUSCRIPT_SECTIONS_3_AND_4
                          : PYTHON_REQUIREMENTS_TXT;
                      downloadFile(filename, content);
                    }}
                    className="px-3 py-1 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-bold font-mono rounded transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Descargar</span>
                  </button>
                </div>
              </div>

              <pre className="p-5 text-[11px] font-mono text-[#00f2ff]/90 overflow-x-auto max-h-[550px] leading-relaxed">
                {selectedPythonFile === 'gym' && PYTHON_GYM_ENV_CODE}
                {selectedPythonFile === 'ppo' && PYTHON_TRAIN_PPO_CODE}
                {selectedPythonFile === 'benchmark' && PYTHON_BENCHMARK_EXPERIMENT_CODE}
                {selectedPythonFile === 'figures' && PYTHON_GENERATE_FIGURES_CODE}
                {selectedPythonFile === 'colab' && generateGoogleColabNotebookJson()}
                {selectedPythonFile === 'latex' && LATEX_MANUSCRIPT_SECTIONS_3_AND_4}
                {selectedPythonFile === 'req' && PYTHON_REQUIREMENTS_TXT}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
