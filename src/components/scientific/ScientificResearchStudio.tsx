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

export const ScientificResearchStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'math' | 'experiments' | 'pareto' | 'python_suite'>('experiments');

  // Monte Carlo Experiment State
  const [sampleSize, setSampleSize] = useState<number>(30);
  const [randomSeed, setRandomSeed] = useState<number>(42);
  const [powderFactor, setPowderFactor] = useState<number>(0.78);
  const [isRunningSim, setIsRunningSim] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Cached initial benchmark runs
  const [benchmarks, setBenchmarks] = useState<PolicyBenchmarkSummary[]>(() => {
    const sim = new MineAbmSimulator(42);
    return sim.runBatchExperiment(30, 8, 2, 0.78, 7.2);
  });

  // Pareto Points state
  const [paretoPoints, setParetoPoints] = useState<ParetoPoint[]>(() => {
    const sim = new MineAbmSimulator(42);
    return sim.generateParetoFrontier(40);
  });

  // Selected Python file viewer
  const [selectedPythonFile, setSelectedPythonFile] = useState<'gym' | 'ppo' | 'benchmark' | 'req'>('gym');

  const handleRunMonteCarlo = () => {
    setIsRunningSim(true);
    setTimeout(() => {
      const sim = new MineAbmSimulator(randomSeed);
      const newBenchmarks = sim.runBatchExperiment(sampleSize, 8, 2, powderFactor, 7.2);
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

  const handleDownloadCsv = () => {
    // Generate dummy raw shifts for the current sample
    const sim = new MineAbmSimulator(randomSeed);
    const shifts: ShiftSimulationResult[] = [];
    for (let i = 1; i <= sampleSize; i++) {
      shifts.push(sim.runSingleShift('fixed', 8, 2, powderFactor, 7.2, 8, i));
      shifts.push(sim.runSingleShift('heuristic_min_queue', 8, 2, powderFactor, 7.2, 8, i));
      shifts.push(sim.runSingleShift('drl_ppo_agent', 8, 2, powderFactor, 7.2, 8, i));
    }
    const csvContent = generateCsvDataset(shifts);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `dataset_mine_to_mill_n${sampleSize}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <span className="text-xs text-[#6b7280] font-mono">IEEE / Elsevier Minerals Engineering</span>
            </div>
            <h1 className="text-xl font-bold text-white tracking-wide mt-1 font-tech flex items-center gap-2.5">
              <FlaskConical className="w-5 h-5 text-[#00f2ff]" />
              Laboratorio de Investigación Científica: M-3 Mine-to-Mill
            </h1>
            <p className="text-xs text-[#9ca3af] max-w-4xl mt-1 leading-relaxed">
              Validación empírica y matemática del ciclo Perforación-Voladura-Carguío-Acarreo (DBLH). Incluye formulación MDP rigurosa, simulación estocástica Monte Carlo ($N \ge 30$), cálculo de significancia estadística (Welch's $t$-test, $p$-value), frontera de Pareto real y código reproducible en Python (Gymnasium + Stable-Baselines3).
            </p>
          </div>

          <div className="flex items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => handleCopyText(generateLatexBenchmarkTable(benchmarks), 'latex-btn')}
              className="px-3.5 py-2 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] border border-[#00f2ff]/30 text-xs font-mono rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-sm"
              title="Copiar código fuente LaTeX de la Tabla 2 para tu manuscrito"
            >
              {copiedCode === 'latex-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode === 'latex-btn' ? '¡LaTeX Copiado!' : 'Copiar Tabla LaTeX (Paper)'}</span>
            </button>

            <button
              onClick={handleDownloadCsv}
              className="px-3.5 py-2 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
              title="Exportar archivo CSV con las corridas estocásticas individuales"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Exportar CSV</span>
            </button>
          </div>
        </div>

        {/* Studio Navigation Tabs */}
        <div className="flex gap-2 mt-5 border-b border-[#1b2336] -mb-6">
          {[
            { id: 'experiments', label: '1. Experimentos Monte Carlo & Tests Estadísticos', icon: BarChart3 },
            { id: 'math', label: '2. Formulación Matemática & Espacio MDP', icon: BookOpen },
            { id: 'pareto', label: '3. Frente de Pareto Multi-Objetivo (NSGA-II)', icon: GitBranch },
            { id: 'python_suite', label: '4. Paquete Python Reproducible (Gym/PPO)', icon: FileCode },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-all border-t border-x cursor-pointer ${
                  active
                    ? 'bg-[#0a0d14] text-[#00f2ff] border-[#1b2336] border-b-transparent shadow-sm'
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
                    Muestra Monte Carlo ($N$ Guardias):
                  </label>
                  <select
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="mt-1 px-3 py-1.5 bg-[#080b12] border border-[#1b2336] rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f2ff]"
                  >
                    <option value={20}>N = 20 guardias (Rápido)</option>
                    <option value={30}>N = 30 guardias (Típico Central Limit)</option>
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
                    className="mt-1 w-28 px-3 py-1.5 bg-[#080b12] border border-[#1b2336] rounded text-xs font-mono text-white focus:outline-none focus:border-[#00f2ff]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-[#9ca3af] uppercase">
                    Factor de Carga de Voladura ($q$):
                  </label>
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="range"
                      min={0.60}
                      max={1.05}
                      step={0.03}
                      value={powderFactor}
                      onChange={(e) => setPowderFactor(Number(e.target.value))}
                      className="w-32 accent-[#00f2ff]"
                    />
                    <span className="text-xs font-mono text-[#00f2ff] font-bold">
                      {powderFactor.toFixed(2)} kg/m³
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleRunMonteCarlo}
                disabled={isRunningSim}
                className="px-5 py-2.5 bg-[#00f2ff] hover:bg-[#00d0db] text-[#050811] text-xs font-bold font-mono rounded-lg transition-all flex items-center gap-2 disabled:opacity-50 cursor-pointer shadow-lg"
              >
                <Play className={`w-4 h-4 ${isRunningSim ? 'animate-spin' : ''}`} />
                <span>{isRunningSim ? 'Simulando Corridas...' : 'Ejecutar Lote Monte Carlo'}</span>
              </button>
            </div>

            {/* Scientific Results Table (Table 2 of the Paper) */}
            <div className="bg-[#0f1422] rounded-xl border border-[#1b2336] overflow-hidden shadow-xl">
              <div className="px-5 py-3.5 bg-[#141a29] border-b border-[#1b2336] flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#00f2ff]" />
                    Tabla 2: Comparativa de Políticas de Despacho & Optimización Mine-to-Mill
                  </h3>
                  <p className="text-[11px] text-[#9ca3af]">
                    Resultados cuantitativos para $N={sampleSize}$ corridas independientes de 8 horas. Formato Media $\pm$ Desviación Estándar.
                  </p>
                </div>
                <span className="px-2 py-0.5 text-[10px] font-mono rounded bg-emerald-950 text-emerald-400 border border-emerald-800">
                  95% Confidence Interval Calculado
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-[#0b0e17] text-[#9ca3af] uppercase text-[10px] tracking-wider border-b border-[#1b2336]">
                    <tr>
                      <th className="py-3 px-4">Política de Despacho</th>
                      <th className="py-3 px-4">Rendimiento (TPH)</th>
                      <th className="py-3 px-4">Espera en Pala (min)</th>
                      <th className="py-3 px-4">Energía SAG (kWh/t)</th>
                      <th className="py-3 px-4">Costo Total ($/t)</th>
                      <th className="py-3 px-4">Recompensa R</th>
                      <th className="py-3 px-4">Test Welch vs Base ($p$-val)</th>
                      <th className="py-3 px-4">Efecto Cohen's $d$</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b2336]/60">
                    {benchmarks.map((row, idx) => {
                      const isDrl = row.policy === 'drl_ppo_agent';
                      const isBaseline = row.policy === 'fixed';
                      return (
                        <tr
                          key={row.policy}
                          className={`hover:bg-[#141a29]/80 transition-colors ${
                            isDrl ? 'bg-[#00f2ff]/5 font-bold text-white' : ''
                          }`}
                        >
                          <td className="py-3.5 px-4 flex items-center gap-2">
                            <span
                              className={`w-2 h-2 rounded-full ${
                                isDrl ? 'bg-[#00f2ff]' : isBaseline ? 'bg-amber-400' : 'bg-emerald-400'
                              }`}
                            />
                            <span>{row.policyLabel}</span>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={isDrl ? 'text-[#00f2ff]' : ''}>
                              {row.tph.mean} ± {row.tph.stdDev}
                            </span>
                            <div className="text-[10px] text-[#6b7280]">
                              [{row.tph.ci95Low}, {row.tph.ci95High}]
                            </div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className={row.shovelWaitMin.mean < 3 ? 'text-emerald-400' : 'text-amber-400'}>
                              {row.shovelWaitMin.mean.toFixed(2)} ± {row.shovelWaitMin.stdDev.toFixed(2)}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {row.sagEnergyKwhT.mean.toFixed(2)} ± {row.sagEnergyKwhT.stdDev.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4">
                            ${row.unitCostUsd.mean.toFixed(2)} ± {row.unitCostUsd.stdDev.toFixed(2)}
                          </td>
                          <td className="py-3.5 px-4 text-emerald-400">
                            {row.compositeReward.mean.toFixed(1)} ± {row.compositeReward.stdDev.toFixed(1)}
                          </td>
                          <td className="py-3.5 px-4">
                            {row.tTestVsBaseline ? (
                              <div>
                                <span className={row.tTestVsBaseline.isSignificant ? 'text-emerald-400 font-bold' : ''}>
                                  $t = {row.tTestVsBaseline.tStatistic > 0 ? '+' : ''}
                                  {row.tTestVsBaseline.tStatistic}$
                                </span>
                                <div className="text-[10px] text-[#6b7280]">
                                  $p {row.tTestVsBaseline.pValue < 0.001 ? '< 0.001' : `= ${row.tTestVsBaseline.pValue}`}${' '}
                                  {row.tTestVsBaseline.isSignificant && '(*)'}
                                </div>
                              </div>
                            ) : (
                              <span className="text-[#6b7280] italic">Referencia (Control)</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            {row.tTestVsBaseline ? (
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] ${
                                  row.tTestVsBaseline.cohenD >= 0.8
                                    ? 'bg-purple-950 text-purple-300 border border-purple-800'
                                    : 'bg-slate-800 text-slate-300'
                                }`}
                              >
                                {row.tTestVsBaseline.cohenD >= 0.8 ? 'Grande' : 'Medio'} ($d = {row.tTestVsBaseline.cohenD}$)
                              </span>
                            ) : (
                              <span className="text-[#6b7280]">—</span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Statistical Explanatory Notes */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
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
        {/* TAB 2: FORMULACIÓN MATEMÁTICA & ESPACIO MDP                               */}
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
        {/* TAB 3: FRENTE DE PARETO MULTI-OBJETIVO (NSGA-II & DRL)                   */}
        {/* ========================================================================= */}
        {activeTab === 'pareto' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-4 bg-[#0f1422] rounded-xl border border-[#1b2336] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white font-mono flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-purple-400" />
                  Frontera de Pareto de Soluciones No Dominadas
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  Calculado mediante ordenamiento no dominado rápido (Fast Non-dominated Sorting) sobre simulaciones con distintas mallas de voladura y políticas.
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-purple-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Rango 1 (Frente Óptimo)
                </span>
                <span className="flex items-center gap-1.5 text-[#6b7280]">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#374151]" /> Soluciones Dominadas
                </span>
              </div>
            </div>

            {/* Pareto Scatter & Table Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Pareto Cards Summary */}
              <div className="lg:col-span-1 space-y-3">
                <div className="text-xs font-bold text-[#e0e2e5] uppercase font-mono tracking-wider">
                  Soluciones del Frente Óptimo (Rango 1):
                </div>
                {paretoPoints
                  .filter((p) => p.rank === 1)
                  .slice(0, 5)
                  .map((sol, idx) => (
                    <div
                      key={sol.id}
                      className="p-3.5 bg-[#0f1422] rounded-xl border border-purple-500/40 space-y-1.5 text-xs font-mono"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-purple-300 font-bold">Solución Pareto #{idx + 1}</span>
                        <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-300 text-[10px] border border-purple-800">
                          {sol.policy === 'drl_ppo_agent' ? 'PPO-DRL' : 'Heurística'}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#9ca3af]">
                        <div>TPH: <b className="text-white">{sol.tph}</b></div>
                        <div>Energía SAG: <b className="text-white">{sol.sagEnergyKwhT} kWh/t</b></div>
                        <div>Costo Unitario: <b className="text-white">${sol.unitCostUsd}/t</b></div>
                        <div>Factor Carga: <b className="text-[#00f2ff]">{sol.powderFactor} kg/m³</b></div>
                      </div>
                    </div>
                  ))}
              </div>

              {/* Full Candidates Table */}
              <div className="lg:col-span-2 bg-[#0f1422] rounded-xl border border-[#1b2336] overflow-hidden">
                <div className="px-4 py-3 bg-[#141a29] border-b border-[#1b2336] text-xs font-bold font-mono text-white">
                  Matriz de Puntos Evaluados en el Espacio de Objetivos
                </div>
                <div className="overflow-x-auto max-h-96">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-[#080b12] text-[#9ca3af] text-[10px] uppercase border-b border-[#1b2336]">
                      <tr>
                        <th className="py-2.5 px-3">Rango</th>
                        <th className="py-2.5 px-3">Política</th>
                        <th className="py-2.5 px-3">Factor $q$</th>
                        <th className="py-2.5 px-3">TPH ($f_1$)</th>
                        <th className="py-2.5 px-3">Energía SAG ($f_2$)</th>
                        <th className="py-2.5 px-3">Costo ($f_3$)</th>
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
                              className={`px-1.5 py-0.5 rounded text-[10px] ${
                                pt.rank === 1
                                  ? 'bg-purple-900/60 text-purple-300 border border-purple-700'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              Rango {pt.rank}
                            </span>
                          </td>
                          <td className="py-2.5 px-3">{pt.policy}</td>
                          <td className="py-2.5 px-3">{pt.powderFactor} kg/m³</td>
                          <td className="py-2.5 px-3 text-white">{pt.tph}</td>
                          <td className="py-2.5 px-3">{pt.sagEnergyKwhT} kWh/t</td>
                          <td className="py-2.5 px-3">${pt.unitCostUsd}</td>
                          <td className="py-2.5 px-3 text-[#00f2ff]">{pt.compositeReward}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: PAQUETE PYTHON REPRODUCIBLE (GYMNASIUM + STABLE-BASELINES3)       */}
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
                  Archivos completos listos para ser incluidos como repositorio complementario (GitHub / Zenodo) en la presentación del paper.
                </p>
              </div>

              {/* File Selector */}
              <div className="flex gap-2">
                {[
                  { id: 'gym', label: 'mine_abm_gym.py' },
                  { id: 'ppo', label: 'train_ppo.py' },
                  { id: 'benchmark', label: 'benchmark_experiment.py' },
                  { id: 'req', label: 'requirements.txt' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setSelectedPythonFile(f.id as any)}
                    className={`px-3 py-1.5 text-xs font-mono rounded-lg transition-colors border ${
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
                  {selectedPythonFile === 'req' && 'requirements.txt — Dependencias de Python'}
                </span>

                <button
                  onClick={() => {
                    const code =
                      selectedPythonFile === 'gym'
                        ? PYTHON_GYM_ENV_CODE
                        : selectedPythonFile === 'ppo'
                        ? PYTHON_TRAIN_PPO_CODE
                        : selectedPythonFile === 'benchmark'
                        ? PYTHON_BENCHMARK_EXPERIMENT_CODE
                        : PYTHON_REQUIREMENTS_TXT;
                    handleCopyText(code, 'file-copy-btn');
                  }}
                  className="px-3 py-1 bg-[#172033] hover:bg-[#1f2b45] text-[#00f2ff] text-xs font-mono rounded transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode === 'file-copy-btn' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'file-copy-btn' ? 'Copiado!' : 'Copiar Archivo'}</span>
                </button>
              </div>

              <pre className="p-5 text-[11px] font-mono text-[#00f2ff]/90 overflow-x-auto max-h-[550px] leading-relaxed">
                {selectedPythonFile === 'gym' && PYTHON_GYM_ENV_CODE}
                {selectedPythonFile === 'ppo' && PYTHON_TRAIN_PPO_CODE}
                {selectedPythonFile === 'benchmark' && PYTHON_BENCHMARK_EXPERIMENT_CODE}
                {selectedPythonFile === 'req' && PYTHON_REQUIREMENTS_TXT}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
