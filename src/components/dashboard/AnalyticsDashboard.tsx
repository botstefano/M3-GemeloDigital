import React, { useState } from 'react';
import {
  SimulationKPIs,
  ParetoSolution,
  GanttTask,
  AnomalyAlert,
  DrlPolicyMetrics,
  HaulTruck,
  Shovel,
  DrillRig,
} from '../../types';
import { DEFAULT_PARETO_SOLUTIONS, generateTrainingHistory } from '../../utils/drlEngine';
import { AcademicCardWrapper } from '../common/AcademicCardWrapper';
import {
  Gauge,
  DollarSign,
  Zap,
  CheckCircle,
  Activity,
  AlertTriangle,
  TrendingUp,
  Cpu,
  Layers,
  Clock,
  ChevronRight,
  Filter,
  Flame,
  Truck,
} from 'lucide-react';

interface AnalyticsDashboardProps {
  kpis: SimulationKPIs;
  trucks: HaulTruck[];
  shovels: Shovel[];
  drills: DrillRig[];
  ganttTasks: GanttTask[];
  alerts: AnomalyAlert[];
  onAcknowledgeAlert: (id: string) => void;
  onSelectParetoSolution: (sol: ParetoSolution) => void;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  kpis,
  trucks,
  shovels,
  drills,
  ganttTasks,
  alerts,
  onAcknowledgeAlert,
  onSelectParetoSolution,
}) => {
  const [selectedParetoId, setSelectedParetoId] = useState<string>('pareto-2');
  const [activeMetricTab, setActiveMetricTab] = useState<'pareto' | 'drl_learning' | 'gantt' | 'fleet_status'>('pareto');
  const [trainingData] = useState<DrlPolicyMetrics[]>(() => generateTrainingHistory(50));

  const selectedPareto = DEFAULT_PARETO_SOLUTIONS.find((p) => p.id === selectedParetoId) || DEFAULT_PARETO_SOLUTIONS[1];

  return (
    <div className="flex flex-col gap-6">
      {/* 1. Top Executive KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {/* TPH */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">Productividad TPH</span>
            <TrendingUp className="w-4 h-4 text-[#10b981]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {(kpis?.tph ?? 4920).toLocaleString()}{' '}
            <span className="text-xs text-[#6b7280] font-normal">t/h</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#10b981] font-semibold mt-1">
            <span>+{((((kpis?.tph ?? 4920) / (kpis?.targetTph ?? 4800)) - 1) * 100).toFixed(1)}%</span>
            <span className="text-[#6b7280] font-normal">vs Meta ({kpis?.targetTph ?? 4800})</span>
          </div>
        </div>

        {/* Cost per Tonne */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">Costo Unitario</span>
            <DollarSign className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            ${(kpis?.costPerTonne ?? 4.85).toFixed(2)}{' '}
            <span className="text-xs text-[#6b7280] font-normal">/ t</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#10b981] font-semibold mt-1">
            <span>-12.4%</span>
            <span className="text-[#6b7280] font-normal">OPEX Optimizado</span>
          </div>
        </div>

        {/* Energy Consumption */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">Energía Específica</span>
            <Zap className="w-4 h-4 text-[#00f2ff]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {(kpis?.energyKwhPerTonne ?? 9.35).toFixed(2)}{' '}
            <span className="text-xs text-[#6b7280] font-normal">kWh/t</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#00f2ff] font-semibold mt-1">
            <span>-18.2%</span>
            <span className="text-[#6b7280] font-normal">Mine-to-Mill</span>
          </div>
        </div>

        {/* Fragmentation P80 */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">Kuz-Ram P80</span>
            <Flame className="w-4 h-4 text-[#f59e0b]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {kpis?.currentP80Mm ?? 154}{' '}
            <span className="text-xs text-[#6b7280] font-normal">mm</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#9ca3af] mt-1 font-mono">
            <span>Meta: {kpis?.targetP80Mm ?? 160} mm</span>
          </div>
        </div>

        {/* Fleet OEE & Availability */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">Disponibilidad Flota</span>
            <Activity className="w-4 h-4 text-[#0066ff]" />
          </div>
          <div className="text-2xl font-bold text-white font-mono mt-1">
            {kpis?.truckFleetAvailabilityPercent ?? 92.5}%
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#9ca3af] mt-1 font-mono">
            <span>OEE Mina: {kpis?.fleetOeePercent ?? 88.6}%</span>
          </div>
        </div>

        {/* DRL Reward Score */}
        <div className="bg-[#0f1115] p-4 rounded border border-[#1f2937] shadow-lg relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#6b7280] font-bold uppercase tracking-widest font-tech">DRL Policy Reward</span>
            <Cpu className="w-4 h-4 text-[#a855f7]" />
          </div>
          <div className="text-2xl font-bold text-[#a855f7] font-mono mt-1">
            {kpis?.drlRewardScore ?? 93.4}{' '}
            <span className="text-xs text-[#6b7280] font-normal">pts</span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#a855f7] font-semibold mt-1 font-mono">
            <span>PPO-M-3 Activo</span>
          </div>
        </div>
      </div>

      {/* 2. Interactive Analytical Tabs & Visualizers */}
      <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-xl flex flex-col gap-5">
        {/* Tab Navigation Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveMetricTab('pareto')}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
                activeMetricTab === 'pareto'
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
              }`}
            >
              Frente de Pareto Multi-Objetivo
            </button>
            <button
              onClick={() => setActiveMetricTab('drl_learning')}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
                activeMetricTab === 'drl_learning'
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
              }`}
            >
              Curvas de Aprendizaje DRL
            </button>
            <button
              onClick={() => setActiveMetricTab('gantt')}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
                activeMetricTab === 'gantt'
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
              }`}
            >
              Diagrama Gantt Ciclo DBLH
            </button>
            <button
              onClick={() => setActiveMetricTab('fleet_status')}
              className={`px-3.5 py-1.5 rounded text-xs font-semibold font-tech uppercase tracking-wider transition-all ${
                activeMetricTab === 'fleet_status'
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
              }`}
            >
              Matriz de Flota & Colas
            </button>
          </div>
        </div>

        {/* Tab 1: Pareto Frontier Visualizer */}
        {activeMetricTab === 'pareto' && (
          <AcademicCardWrapper
            id="academic-fig-pareto"
            figureNumber="Figura 4"
            title="Frente de Pareto Multi-Objetivo (Productividad TPH vs Costo Unitario $/t)"
            subtitle="Espacio de soluciones no dominadas evaluado mediante PPO-M-3, SAC-Multi, NSGA-II y Baseline FIFO"
            type="figure"
            tableData={DEFAULT_PARETO_SOLUTIONS.map((s) => ({
              ID: s.id,
              Politica: s.policyName,
              Algoritmo: s.algorithm,
              ProductividadTPH: s.productivityTph,
              CostoUnitarioUSD: s.costPerTonne,
              EnergiaSAG_kWh_t: s.energyKwhPerTonne,
              CalidadP80_mm: s.p80QualityMm,
              FrenteOptimo: s.isOptimalFrontier ? 'SI' : 'NO',
              Peso_Prod_w1: s.weights.w1,
              Peso_Cal_w2: s.weights.w2,
              Peso_Costo_w3: s.weights.w3,
              Peso_Energia_w4: s.weights.w4,
            }))}
            interpretation="La envolvente punteada celeste define la frontera de compromiso óptima (Pareto-optimal boundary). La política autónoma PPO-M-3 (punto celeste destacado) alcanza un régimen óptimo de 4,920 t/h a un costo unitario mínimo de $4.85/t y 9.35 kWh/t en SAG. En contraste, las soluciones heurísticas FIFO y de menor cola se ubican en regiones subóptimas con sobrecostos de hasta $6.12/t por acumulación de camiones."
            physicalExplainability="El acoplamiento estocástico de colas M/G/1 en palas y recepción de tolva de chancado produce interferencias cuando la asignación es estática. El agente PPO ajusta dinámicamente las probabilidades de despacho ponderando la fragmentación geomecánica de roca proveniente del banco detonado (Kuz-Ram), manteniendo la tasa de arribo en equilibrio con la tasa de conminución del molino SAG."
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Pareto Scatter 2D Plane */}
              <div className="lg:col-span-8 bg-[#15181e] p-4 rounded border border-[#1f2937]">
                <div className="flex items-center justify-between pb-2">
                  <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider">
                    Dispersión 2D: Productividad (TPH) vs Costo ($/t)
                  </h4>
                  <span className="text-[10px] text-[#00f2ff] font-mono">Frente No Dominado (PPO & NSGA-II)</span>
                </div>

                {/* Custom SVG Scatter Plot */}
                <div className="relative w-full h-64 bg-[#0a0b0e] rounded p-2 border border-[#1f2937]">
                  <svg className="w-full h-full" viewBox="0 0 500 220">
                    {/* Grid Lines */}
                    <line x1="60" y1="20" x2="480" y2="20" stroke="#1f2937" strokeDasharray="3 3" />
                    <line x1="60" y1="70" x2="480" y2="70" stroke="#1f2937" strokeDasharray="3 3" />
                    <line x1="60" y1="120" x2="480" y2="120" stroke="#1f2937" strokeDasharray="3 3" />
                    <line x1="60" y1="170" x2="480" y2="170" stroke="#1f2937" strokeDasharray="3 3" />
                    <line x1="60" y1="190" x2="480" y2="190" stroke="#374151" />
                    <line x1="60" y1="10" x2="60" y2="190" stroke="#374151" />

                    {/* Y Axis Labels (Cost $/t from $6.50 down to $4.00) */}
                    <text x="12" y="25" fill="#6b7280" fontSize="9">$6.50/t</text>
                    <text x="12" y="75" fill="#6b7280" fontSize="9">$5.75/t</text>
                    <text x="12" y="125" fill="#6b7280" fontSize="9">$5.00/t</text>
                    <text x="12" y="175" fill="#6b7280" fontSize="9">$4.25/t</text>

                    {/* X Axis Labels (TPH from 3500 to 5600) */}
                    <text x="60" y="208" fill="#6b7280" fontSize="9">3500 TPH</text>
                    <text x="200" y="208" fill="#6b7280" fontSize="9">4200 TPH</text>
                    <text x="340" y="208" fill="#6b7280" fontSize="9">4900 TPH</text>
                    <text x="440" y="208" fill="#6b7280" fontSize="9">5600 TPH</text>

                    {/* Connecting Optimal Pareto Frontier Curve */}
                    <path
                      d="M 180,160 Q 300,120 460,35"
                      fill="none"
                      stroke="#00f2ff"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                    />

                    {/* Plot Solutions */}
                    {DEFAULT_PARETO_SOLUTIONS.map((sol) => {
                      const xfix = 60 + ((sol.productivityTph - 3500) / 2100) * 400;
                      const yfix = 180 - ((6.5 - sol.costPerTonne) / 2.5) * 160;
                      const isSelected = sol.id === selectedParetoId;

                      return (
                        <g
                          key={sol.id}
                          className="cursor-pointer transition-all"
                          onClick={() => {
                            setSelectedParetoId(sol.id);
                            onSelectParetoSolution(sol);
                          }}
                        >
                          {isSelected && (
                            <circle cx={xfix} cy={yfix} r="12" fill="none" stroke="#00f2ff" strokeWidth="2" opacity="0.8" />
                          )}
                          <circle
                            cx={xfix}
                            cy={yfix}
                            r={sol.isOptimalFrontier ? 6 : 4.5}
                            fill={sol.isOptimalFrontier ? (isSelected ? '#00f2ff' : '#10b981') : '#4b5563'}
                          />
                          <text
                            x={xfix + 8}
                            y={yfix + 3}
                            fill={isSelected ? '#00f2ff' : '#9ca3af'}
                            fontSize="9"
                            fontWeight={isSelected ? 'bold' : 'normal'}
                          >
                            {sol.policyName.split(' ')[0]}
                          </text>
                        </g>
                      );
                    })}
                  </svg>
                </div>
              </div>

              {/* Selected Solution Inspector Card */}
              <div className="lg:col-span-4 bg-[#15181e] p-4 rounded border border-[#00f2ff]/30 flex flex-col gap-3 shadow-[0_0_20px_rgba(0,242,255,0.08)]">
                <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
                  <div>
                    <h4 className="text-sm font-bold text-white font-tech">{selectedPareto.policyName}</h4>
                    <span className="text-[10px] font-mono text-[#00f2ff]">Algoritmo: {selectedPareto.algorithm}</span>
                  </div>
                  {selectedPareto.isOptimalFrontier && (
                    <span className="px-2 py-0.5 rounded bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 text-[10px] font-bold uppercase">
                      Frente Óptimo
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div className="bg-[#0a0b0e] p-2 rounded border border-[#1f2937]">
                    <div className="text-[10px] uppercase font-bold text-[#6b7280]">Productividad</div>
                    <div className="text-base font-bold text-[#10b981] font-mono">{selectedPareto.productivityTph} t/h</div>
                  </div>
                  <div className="bg-[#0a0b0e] p-2 rounded border border-[#1f2937]">
                    <div className="text-[10px] uppercase font-bold text-[#6b7280]">Costo Unitario</div>
                    <div className="text-base font-bold text-white font-mono">${selectedPareto.costPerTonne.toFixed(2)}/t</div>
                  </div>
                  <div className="bg-[#0a0b0e] p-2 rounded border border-[#1f2937]">
                    <div className="text-[10px] uppercase font-bold text-[#6b7280]">Energía Específica</div>
                    <div className="text-base font-bold text-[#00f2ff] font-mono">{selectedPareto.energyKwhPerTonne.toFixed(1)} kWh/t</div>
                  </div>
                  <div className="bg-[#0a0b0e] p-2 rounded border border-[#1f2937]">
                    <div className="text-[10px] uppercase font-bold text-[#6b7280]">Calidad P80</div>
                    <div className="text-base font-bold text-[#a855f7] font-mono">{selectedPareto.p80QualityMm} mm</div>
                  </div>
                </div>

                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#1f2937] text-xs">
                  <div className="text-[10px] uppercase font-bold text-[#9ca3af] mb-1">Ponderaciones Asignadas:</div>
                  <div className="flex justify-between text-[10px] font-mono text-[#6b7280]">
                    <span>w₁ (Prod): {(selectedPareto.weights.w1 * 100).toFixed(0)}%</span>
                    <span>w₂ (Cal): {(selectedPareto.weights.w2 * 100).toFixed(0)}%</span>
                    <span>w₃ (Cost): {(selectedPareto.weights.w3 * 100).toFixed(0)}%</span>
                    <span>w₄ (Ener): {(selectedPareto.weights.w4 * 100).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </AcademicCardWrapper>
        )}

        {/* Tab 2: DRL Learning Convergence Curves */}
        {activeMetricTab === 'drl_learning' && (
          <AcademicCardWrapper
            id="academic-fig-drl-learning"
            figureNumber="Figura 5"
            title="Curvas de Convergencia del Aprendizaje DRL (Recompensa Episódica, Actor Loss y Reducción OPEX)"
            subtitle="Evolución de métricas de entrenamiento a lo largo de 50 episodios de optimización continua"
            type="figure"
            tableData={trainingData.map((d) => ({
              Episodio: d.episode,
              Recompensa: d.reward,
              PerdidaActor: d.actorLoss,
              PerdidaCritico: d.criticLoss,
              Entropia: d.entropy,
              TPH_Medio: d.meanTph,
              AhorroCostoPct: d.costReductionPct,
              AhorroEnergiaPct: d.energyReductionPct,
              ParetoScore: d.paretoOptimalityScore,
            }))}
            interpretation="La recompensa acumulada asciende desde valores fuertemente negativos (-40 pts) en la fase inicial de exploración hasta estabilizarse en +94.6 pts a partir del episodio 35. La pérdida del Actor (Actor Policy Loss) desciende a 0.038, indicando que las probabilidades de despacho Softmax convergieron a una política determinista cuasi-óptima. El ahorro energético en molienda SAG alcanza un 24.5%."
            physicalExplainability="El gradiente de política PPO utiliza recorte de ventaja (clipping epsilon = 0.2) para impedir que una decisión errónea ante una perturbación estocástica (como una detención imprevista de pala) desestabilice los pesos de la red. Al correlacionar el estado del lecho de roca con el consumo del molino, el agente aprende a seleccionar rutas que nivelan la dureza del mineral entregado a la planta concentradora."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Episodic Reward Curve */}
              <div className="bg-[#15181e] p-4 rounded border border-[#1f2937] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-tech uppercase tracking-wider">1. Recompensa Episódica (Reward)</span>
                  <span className="text-[10px] font-mono text-[#10b981]">+94.6 pts</span>
                </div>
                <div className="h-44 w-full bg-[#0a0b0e] rounded p-2 border border-[#1f2937]">
                  <svg className="w-full h-full" viewBox="0 0 300 130">
                    <line x1="30" y1="10" x2="30" y2="110" stroke="#374151" />
                    <line x1="30" y1="110" x2="290" y2="110" stroke="#374151" />
                    <polyline
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="2"
                      points={trainingData
                        .map((d, i) => `${30 + (i / 50) * 250},${100 - ((d.reward + 40) / 140) * 85}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
                <p className="text-[11px] text-[#9ca3af]">Convergencia asintótica estable tras ~35 episodios PPO.</p>
              </div>

              {/* Actor-Critic Loss */}
              <div className="bg-[#15181e] p-4 rounded border border-[#1f2937] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-tech uppercase tracking-wider">2. Actor Policy Loss</span>
                  <span className="text-[10px] font-mono text-[#00f2ff]">0.038</span>
                </div>
                <div className="h-44 w-full bg-[#0a0b0e] rounded p-2 border border-[#1f2937]">
                  <svg className="w-full h-full" viewBox="0 0 300 130">
                    <line x1="30" y1="10" x2="30" y2="110" stroke="#374151" />
                    <line x1="30" y1="110" x2="290" y2="110" stroke="#374151" />
                    <polyline
                      fill="none"
                      stroke="#00f2ff"
                      strokeWidth="2"
                      points={trainingData
                        .map((d, i) => `${30 + (i / 50) * 250},${10 + (d.actorLoss / 1.5) * 90}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
                <p className="text-[11px] text-[#9ca3af]">Gradiente de ventaja estabilizado mediante clipping $\epsilon = 0.2$.</p>
              </div>

              {/* Critic Value Loss */}
              <div className="bg-[#15181e] p-4 rounded border border-[#1f2937] flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white font-tech uppercase tracking-wider">3. Reducción de Costo & Energía</span>
                  <span className="text-[10px] font-mono text-[#f59e0b]">-24.5%</span>
                </div>
                <div className="h-44 w-full bg-[#0a0b0e] rounded p-2 border border-[#1f2937]">
                  <svg className="w-full h-full" viewBox="0 0 300 130">
                    <line x1="30" y1="10" x2="30" y2="110" stroke="#374151" />
                    <line x1="30" y1="110" x2="290" y2="110" stroke="#374151" />
                    <polyline
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      points={trainingData
                        .map((d, i) => `${30 + (i / 50) * 250},${110 - (d.energyReductionPct / 30) * 90}`)
                        .join(' ')}
                    />
                  </svg>
                </div>
                <p className="text-[11px] text-[#9ca3af]">Ahorro acumulado Mine-to-Mill validado en simulación ABM.</p>
              </div>
            </div>
          </AcademicCardWrapper>
        )}

        {/* Tab 3: Gantt Operational Timeline */}
        {activeMetricTab === 'gantt' && (
          <AcademicCardWrapper
            id="academic-fig-gantt"
            figureNumber="Figura 6"
            title="Cronograma de Operaciones DBLH (Turno Operacional 12 Horas)"
            subtitle="Secuenciamiento temporal de perforación, voladura, carguío, acarreo y chancado"
            type="figure"
            tableData={ganttTasks.map((task) => ({
              ID: task.id,
              Actividad: task.activity,
              Equipo: task.agent,
              Categoria: task.category,
              MinutoInicio: task.startMinute,
              DuracionMinutos: task.durationMinutes,
              Estado: task.status,
            }))}
            interpretation="Visualiza la ejecución temporal coordinada de las 5 fases críticas del ciclo minero. Se aprecia cómo las ventanas de tronadura en el minuto 45 bloquean temporalmente el acceso a los bancos 4105 y 4120, reactivando inmediatamente el carguío continuo de los camiones CAEX con las palas P&H sin retrasos en la tolva de chancado primario."
            physicalExplainability="El modelo de eventos discretos programa los frentes de carguío de forma escalonada para que la llegada estocástica de camiones al chancador satisfaga el modelo de colas M/G/1 con factor de utilización rho < 0.82, garantizando que el chancador opere en régimen estable sin rebalses ni detenciones por vaciado de tolva."
          >
            <div className="bg-[#15181e] p-4 rounded border border-[#1f2937] flex flex-col gap-3">
              <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
                <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider">
                  Timeline de Turno (T+0 a T+360 min)
                </h4>
                <span className="text-[10px] text-[#6b7280] font-mono">Ventana Activa: Guardia Día</span>
              </div>

              <div className="space-y-2.5">
                {ganttTasks.map((task) => {
                  const leftPct = (task.startMinute / 360) * 100;
                  const widthPct = (task.durationMinutes / 360) * 100;
                  return (
                    <div key={task.id} className="grid grid-cols-12 items-center gap-2 text-xs">
                      <div className="col-span-3 text-[#e0e2e5] truncate font-medium">{task.activity}</div>
                      <div className="col-span-2 text-[#6b7280] text-[11px] font-mono">{task.agent}</div>
                      <div className="col-span-7 relative h-6 bg-[#0a0b0e] rounded overflow-hidden p-0.5 border border-[#1f2937]">
                        <div
                          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
                          className={`absolute top-0.5 bottom-0.5 rounded px-2 text-[10px] font-semibold flex items-center shadow ${
                            task.category === 'drill'
                              ? 'bg-[#0066ff] text-white border border-[#0066ff]'
                              : task.category === 'blast'
                              ? 'bg-[#ef4444] text-white border border-[#ef4444]'
                              : task.category === 'load'
                              ? 'bg-[#f59e0b] text-black border border-[#f59e0b]'
                              : task.category === 'haul'
                              ? 'bg-[#10b981] text-black border border-[#10b981]'
                              : 'bg-[#a855f7] text-white border border-[#a855f7]'
                          }`}
                        >
                          <span className="truncate">{task.durationMinutes} min</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </AcademicCardWrapper>
        )}

        {/* Tab 4: Fleet Status & Queue Breakdown */}
        {activeMetricTab === 'fleet_status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shovel Queues Table */}
            <AcademicCardWrapper
              id="academic-table-shovels"
              figureNumber="Tabla 1"
              title="Matriz de Frentes de Carguío, Palas P&H y Colas de Camiones CAEX"
              subtitle="Telemetría en tiempo real de frentes activos y longitud de cola"
              type="table"
              tableData={shovels.map((s) => ({
                ID: s.id,
                Nombre: s.name,
                Modelo: s.model,
                CapacidadBaldeM3: s.bucketCapacityM3,
                Estado: s.status,
                CamionEnCarguio: s.assignedTruckId || 'Ninguno',
                TotalCamionesEnCola: s.trucksInQueue.length,
                DetalleCamionesEnCola: s.trucksInQueue.join(', ') || 'Sin cola',
                PotenciaConsumidaKW: s.powerConsumptionKw,
                TiempoCicloSegundos: s.cycleTimeSeconds,
              }))}
              interpretation="Registra la carga operacional instantánea en cada pala eléctrica P&H 4100XPC. Permite verificar que la longitud de cola de camiones se mantenga entre 0 y 2 unidades, evitando tiempos muertos por sobre-asignación de flota."
              physicalExplainability="Cada camión esperando en cola representa una pérdida estocástica de capacidad y un consumo inútil de combustible diésel en ralentí de aproximadamente 42 L/h. La tasa de servicio de la pala depende directamente de la fragmentación de la roca (Kuz-Ram), requiriendo 3 pases de balde para completar las 360 toneladas del CAT 797F."
            >
              <div className="space-y-3">
                {shovels.map((s) => (
                  <div key={s.id} className="bg-[#0a0b0e] p-3 rounded border border-[#1f2937]">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-white">{s.name}</span>
                      <span className="text-[#00f2ff] font-mono">{s.status.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-[11px] text-[#9ca3af] mt-1">
                      <span>Camión en Carguío: <strong className="text-white">{s.assignedTruckId || 'Ninguno'}</strong></span>
                      <span>Colas: <strong className="text-[#ef4444]">{s.trucksInQueue.length} CAEX ({s.trucksInQueue.join(', ') || '0'})</strong></span>
                    </div>
                  </div>
                ))}
              </div>
            </AcademicCardWrapper>

            {/* Truck Fleet Telemetry Summary Table */}
            <AcademicCardWrapper
              id="academic-table-trucks"
              figureNumber="Tabla 2"
              title="Distribución del Ciclo de Acarreo de la Flota CAEX"
              subtitle="Estado operacional de los camiones Caterpillar 797F"
              type="table"
              tableData={[
                { EstadoCiclo: 'En Acarreo Lleno', CantidadCAEX: trucks.filter((t) => t.status === 'hauling_full').length, Descripcion: 'Transportando mineral hacia chancador primario' },
                { EstadoCiclo: 'En Retorno Vacio', CantidadCAEX: trucks.filter((t) => t.status === 'returning_empty').length, Descripcion: 'Descendiendo por rampa hacia frentes de carguio' },
                { EstadoCiclo: 'En Carguio / Acolado', CantidadCAEX: trucks.filter((t) => t.status === 'loading' || t.status === 'spotting').length, Descripcion: 'Posicionandose o recibiendo pases de pala' },
                { EstadoCiclo: 'En Descarga Chancado', CantidadCAEX: trucks.filter((t) => t.status === 'dumping').length, Descripcion: 'Volteo en tolva de chancador primario' },
              ]}
              interpretation="Resume la distribución porcentual de la flota de camiones CAT 797F a lo largo de las 4 etapas del ciclo de acarreo. Un equilibrio óptimo mantiene la mayoría de camiones en tránsito efectivo (acarreo y retorno), minimizando esperas en cola."
              physicalExplainability="El tiempo de ciclo total T_ciclo = T_carguio + T_acarreo + T_descarga + T_retorno + T_colas. La velocidad en rampa cargada en pendiente del 10% está restringida a 22 km/h por potencia del motor de 4,000 HP, mientras que el retorno vacío alcanza 36 km/h con frenado retardador electrodinámico."
            >
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">En Acarreo Lleno</div>
                  <div className="text-base font-bold text-[#10b981] font-mono">
                    {trucks.filter((t) => t.status === 'hauling_full').length} CAEX
                  </div>
                </div>
                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">En Retorno Vacío</div>
                  <div className="text-base font-bold text-[#0066ff] font-mono">
                    {trucks.filter((t) => t.status === 'returning_empty').length} CAEX
                  </div>
                </div>
                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">En Carguío / Acolado</div>
                  <div className="text-base font-bold text-[#f59e0b] font-mono">
                    {trucks.filter((t) => t.status === 'loading' || t.status === 'spotting').length} CAEX
                  </div>
                </div>
                <div className="bg-[#0a0b0e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">En Descarga Chancado</div>
                  <div className="text-base font-bold text-[#a855f7] font-mono">
                    {trucks.filter((t) => t.status === 'dumping').length} CAEX
                  </div>
                </div>
              </div>
            </AcademicCardWrapper>
          </div>
        )}
      </div>

      {/* 3. Intelligent Anomaly Alert Feed */}
      <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-xl flex flex-col gap-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-[#f59e0b]" />
            <h3 className="text-sm font-bold text-white font-tech uppercase tracking-wider">Alertas Inteligentes & Detección de Anomalías</h3>
          </div>
          <span className="text-xs font-mono text-[#6b7280]">{alerts.length} Eventos Registrados</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3.5 rounded border flex flex-col justify-between gap-2 shadow ${
                alert.severity === 'critical'
                  ? 'bg-[#ef4444]/10 border-[#ef4444]/40 text-white'
                  : alert.severity === 'warning'
                  ? 'bg-[#f59e0b]/10 border-[#f59e0b]/40 text-white'
                  : 'bg-[#0066ff]/10 border-[#0066ff]/40 text-white'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-1.5 font-bold text-xs font-tech">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      alert.severity === 'critical'
                        ? 'bg-[#ef4444] animate-ping'
                        : alert.severity === 'warning'
                        ? 'bg-[#f59e0b]'
                        : 'bg-[#0066ff]'
                    }`}
                  />
                  <span>{alert.source}</span>
                </div>
                <span className="text-[10px] font-mono text-[#6b7280]">{alert.timestamp}</span>
              </div>
              <p className="text-xs leading-relaxed text-[#d1d5db]">{alert.message}</p>
              <div className="flex items-center justify-between text-[10px] text-[#9ca3af] border-t border-[#1f2937] pt-2 mt-1">
                <span>{alert.metric}: <strong className="text-white">{alert.currentValue}</strong></span>
                {alert.status === 'active' ? (
                  <button
                    onClick={() => onAcknowledgeAlert(alert.id)}
                    className="px-2 py-0.5 rounded bg-[#15181e] hover:bg-[#1f2937] text-white font-semibold text-[10px] border border-[#1f2937] transition-all"
                  >
                    Reconocer
                  </button>
                ) : (
                  <span className="text-[#10b981] font-semibold flex items-center gap-0.5">
                    <CheckCircle className="w-3 h-3" /> Reconocido
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
