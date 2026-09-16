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
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Pareto Scatter 2D Plane */}
            <div className="lg:col-span-8 bg-[#15181e] p-4 rounded border border-[#1f2937]">
              <div className="flex items-center justify-between pb-2">
                <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider">
                  Matriz de Compromiso (Trade-off): Productividad (TPH) vs Costo ($/t) vs Energía (kWh/t)
                </h4>
                <span className="text-[10px] text-[#00f2ff] font-mono">Frente No Dominado (NSGA-II & PPO)</span>
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
                    // Map X: 3500 -> 60, 5600 -> 460
                    const xfix = 60 + ((sol.productivityTph - 3500) / 2100) * 400;
                    // Map Y: $4.00 -> 180, $6.50 -> 20
                    const yfix实施 = 180 - ((6.5 - sol.costPerTonne) / 2.5) * 160;
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
                        {/* Glow halo for selected */}
                        {isSelected && (
                          <circle cx={xfix} cy={yfix实施} r="12" fill="none" stroke="#00f2ff" strokeWidth="2" opacity="0.8" />
                        )}
                        <circle
                          cx={xfix}
                          cy={yfix实施}
                          r={sol.isOptimalFrontier ? 6 : 4.5}
                          fill={sol.isOptimalFrontier ? (isSelected ? '#00f2ff' : '#10b981') : '#4b5563'}
                        />
                        <text
                          x={xfix + 8}
                          y={yfix实施 + 3}
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
        )}

        {/* Tab 2: DRL Learning Convergence Curves */}
        {activeMetricTab === 'drl_learning' && (
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
                  {/* Reward line */}
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
                  {/* Loss line */}
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
                  {/* Energy savings line */}
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
        )}

        {/* Tab 3: Gantt Operational Timeline */}
        {activeMetricTab === 'gantt' && (
          <div className="bg-[#15181e] p-4 rounded border border-[#1f2937] flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider">
                Cronograma de Operaciones DBLH (Turno 12 Horas)
              </h4>
              <span className="text-[10px] text-[#6b7280] font-mono">Ventana Activa: T+0 a T+360 min</span>
            </div>

            <div className="space-y-2.5">
              {ganttTasks.map((task) => {
                const leftPct = (task.startMinute / 360) * 100;
                const widthPct地理 = (task.durationMinutes / 360) * 100;
                return (
                  <div key={task.id} className="grid grid-cols-12 items-center gap-2 text-xs">
                    <div className="col-span-3 text-[#e0e2e5] truncate font-medium">{task.activity}</div>
                    <div className="col-span-2 text-[#6b7280] text-[11px] font-mono">{task.agent}</div>
                    <div className="col-span-7 relative h-6 bg-[#0a0b0e] rounded overflow-hidden p-0.5 border border-[#1f2937]">
                      <div
                        style={{ left: `${leftPct}%`, width: `${widthPct地理}%` }}
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
        )}

        {/* Tab 4: Fleet Status & Queue Breakdown */}
        {activeMetricTab === 'fleet_status' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Shovel Queues */}
            <div className="bg-[#15181e] p-4 rounded border border-[#1f2937]">
              <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider mb-3">
                Estado de Frentes de Carguío & Colas
              </h4>
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
            </div>

            {/* Truck Fleet Telemetry Summary */}
            <div className="bg-[#15181e] p-4 rounded border border-[#1f2937]">
              <h4 className="text-xs font-bold text-white uppercase font-tech tracking-wider mb-3">
                Distribución de Ciclos de Acarreo (CAEX)
              </h4>
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
            </div>
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
