import React, { useState } from 'react';
import { SimulationParams, SimulationKPIs, BlastZone, UserRole } from '../../types';
import { calculateKuzRam, generateFragmentationCurve } from '../../utils/kuzRam';
import { calculateMultiObjectiveReward } from '../../utils/drlEngine';
import {
  Sliders,
  Play,
  RotateCcw,
  Zap,
  DollarSign,
  TrendingUp,
  Scale,
  Sparkles,
  Flame,
  Truck,
  Layers,
  ArrowRight,
  ShieldAlert,
  Info,
  Server,
} from 'lucide-react';

interface WhatIfStudioProps {
  currentParams: SimulationParams;
  onApplyParams: (newParams: SimulationParams) => void;
  kpis: SimulationKPIs;
  activeBlastZone: BlastZone;
  userRole: UserRole;
  onOpenFastApiModal?: () => void;
  isFastApiOnline?: boolean;
  fastApiLatency?: number | null;
}

export const WhatIfStudio: React.FC<WhatIfStudioProps> = ({
  currentParams,
  onApplyParams,
  kpis,
  activeBlastZone,
  userRole,
  onOpenFastApiModal,
  isFastApiOnline,
  fastApiLatency,
}) => {
  // Local what-if draft state
  const [draftParams, setDraftParams] = useState<SimulationParams>({ ...currentParams });
  const [draftBlast, setDraftBlast] = useState<BlastZone>({ ...activeBlastZone });

  const isObserver = userRole === 'observer';

  // Live Kuz-Ram calculation for the draft
  const draftKuzRam = calculateKuzRam({
    burdenM: draftBlast.burdenM,
    spacingM: draftBlast.spacingM,
    holeDiameterMm: draftBlast.holeDiameterMm,
    benchHeightM: draftBlast.benchHeightM,
    stemmingM: draftBlast.stemmingM,
    powderFactorKgM3: draftBlast.powderFactorKgM3,
    explosiveType: draftBlast.explosiveType,
    rockMassFactorA: draftBlast.rockMassFactorA,
  });

  // Fragmentation curve data
  const fragCurve = generateFragmentationCurve(draftKuzRam.p80Mm, draftKuzRam.uniformityIndexN);

  // Computed what-if prospective KPIs
  const prospectiveTph = Math.round(
    draftParams.targetTph *
      (draftParams.truckCount / 8) *
      (draftParams.truckDispatchPolicy.includes('drl') ? 1.12 : 0.94) *
      (draftKuzRam.optimumDiggabilityScore / 80)
  );

  const prospectiveCost = Math.round(
    (4.85 * (0.75 + (draftBlast.powderFactorKgM3 / 0.78) * 0.15) * (8 / draftParams.truckCount) ** 0.15) * 100
  ) / 100;

  const prospectiveEnergy = Math.round((draftKuzRam.estimatedSagMillKwhPerTonne + 2.5) * 100) / 100;

  const rewardCalc = calculateMultiObjectiveReward(
    prospectiveTph,
    draftKuzRam.p80Mm,
    prospectiveCost,
    prospectiveEnergy,
    draftParams.drlWeights
  );

  // Delta calculations
  const deltaTph = prospectiveTph - kpis.tph;
  const deltaCost = prospectiveCost - kpis.costPerTonne;
  const deltaEnergy = prospectiveEnergy - kpis.energyKwhPerTonne;
  const deltaP80 = draftKuzRam.p80Mm - kpis.currentP80Mm;

  const handleApply = () => {
    onApplyParams(draftParams);
  };

  const handleReset = () => {
    setDraftParams({ ...currentParams });
    setDraftBlast({ ...activeBlastZone });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Banner */}
      <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded bg-[#15181e] border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.2)]">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white font-tech tracking-wide uppercase">Laboratorio de Escenarios "What-If"</h2>
              <p className="text-xs text-[#9ca3af]">
                Simulación prospectiva multi-objetivo: ajusta variables operacionales en caliente y evalúa el impacto Mine-to-Mill.
              </p>
            </div>
          </div>
        </div>

        {isObserver ? (
          <div className="flex items-center gap-2 bg-[#f59e0b]/10 border border-[#f59e0b]/30 px-3.5 py-2 rounded text-xs text-[#f59e0b] font-medium">
            <ShieldAlert className="w-4 h-4 text-[#f59e0b]" />
            <span>Modo Observador: Solo lectura de simulaciones.</span>
          </div>
        ) : (
          <div className="flex items-center gap-2.5">
            {onOpenFastApiModal && (
              <button
                onClick={onOpenFastApiModal}
                className={`px-3 py-2 rounded text-xs font-mono flex items-center gap-1.5 transition-all border ${
                  isFastApiOnline
                    ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40 hover:bg-[#10b981]/25'
                    : 'bg-[#15181e] text-[#9ca3af] border-[#1f2937] hover:text-[#00f2ff] hover:border-[#00f2ff]/40'
                }`}
                title="Configurar conexión con motor FastAPI"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{isFastApiOnline ? `FastAPI: OK (${fastApiLatency}ms)` : 'Motor: Local (FastAPI)'}</span>
              </button>
            )}

            <button
              onClick={handleReset}
              className="px-3.5 py-2 rounded bg-[#15181e] hover:bg-[#1f2937] text-[#9ca3af] hover:text-white border border-[#1f2937] text-xs font-semibold flex items-center gap-1.5 transition-all uppercase tracking-wider"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Restablecer
            </button>
            <button
              onClick={handleApply}
              className="px-4 py-2 rounded bg-gradient-to-r from-[#0066ff] to-[#00f2ff] hover:brightness-110 text-black text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(0,242,255,0.3)]"
            >
              <Play className="w-4 h-4 fill-current" />
              Aplicar al Gemelo Digital
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Control Panels vs Live Prospective Scorecard */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Parameter Inputs & Sliders (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Section 1: Drill & Blast Parameters (Kuz-Ram) */}
          <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-tech uppercase tracking-wider">
                <Flame className="w-4 h-4 text-[#f59e0b]" />
                <span>1. Parámetros de Perforación y Voladura (Kuz-Ram)</span>
              </div>
              <span className="text-xs text-[#00f2ff] bg-[#00f2ff]/10 px-2 py-0.5 rounded border border-[#00f2ff]/30 font-mono">
                {draftBlast.explosiveType}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Powder Factor */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Factor de Carga (q):</span>
                  <span className="font-mono text-[#00f2ff] font-bold">{draftBlast.powderFactorKgM3} kg/m³</span>
                </div>
                <input
                  type="range"
                  min={0.4}
                  max={1.2}
                  step={0.02}
                  disabled={isObserver}
                  value={draftBlast.powderFactorKgM3}
                  onChange={(e) => setDraftBlast({ ...draftBlast, powderFactorKgM3: parseFloat(e.target.value) })}
                  className="w-full accent-[#00f2ff] bg-[#15181e] h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b7280] font-mono">
                  <span>0.4 (Bajo)</span>
                  <span>0.78 (Estándar)</span>
                  <span>1.2 (Intenso)</span>
                </div>
              </div>

              {/* Burden & Spacing */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Malla (Burden x Spacing):</span>
                  <span className="font-mono text-white font-bold">
                    {draftBlast.burdenM}m × {draftBlast.spacingM}m
                  </span>
                </div>
                <input
                  type="range"
                  min={5.0}
                  max={9.0}
                  step={0.2}
                  disabled={isObserver}
                  value={draftBlast.burdenM}
                  onChange={(e) => {
                    const b = parseFloat(e.target.value);
                    setDraftBlast({ ...draftBlast, burdenM: b, spacingM: Math.round(b * 1.15 * 10) / 10 });
                  }}
                  className="w-full accent-[#00f2ff] bg-[#15181e] h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b7280] font-mono">
                  <span>5.0m (Fina)</span>
                  <span>6.5m (Nominal)</span>
                  <span>9.0m (Abierta)</span>
                </div>
              </div>

              {/* Explosive Type */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#9ca3af]">Tipo de Explosivo:</label>
                <select
                  disabled={isObserver}
                  value={draftBlast.explosiveType}
                  onChange={(e) => setDraftBlast({ ...draftBlast, explosiveType: e.target.value as any })}
                  className="w-full bg-[#15181e] border border-[#1f2937] rounded px-3 py-1.5 text-xs text-white focus:border-[#00f2ff] focus:outline-none"
                >
                  <option value="Heavy_Emulsion">Emulsión Pesada 115 RWS (Alto Rendimiento)</option>
                  <option value="ANFO">ANFO Estándar 100 RWS (Seco Económico)</option>
                  <option value="Slurry">Hidrogel / Slurry 108 RWS (Resistente al Agua)</option>
                </select>
              </div>

              {/* Rock Structure Factor */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Factor Roca Cunningham (A):</span>
                  <span className="font-mono text-[#00f2ff] font-bold">{draftBlast.rockMassFactorA}</span>
                </div>
                <input
                  type="range"
                  min={3.0}
                  max={13.0}
                  step={0.5}
                  disabled={isObserver}
                  value={draftBlast.rockMassFactorA}
                  onChange={(e) => setDraftBlast({ ...draftBlast, rockMassFactorA: parseFloat(e.target.value) })}
                  className="w-full accent-[#00f2ff] bg-[#15181e] h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b7280] font-mono">
                  <span>3.0 (Blanda)</span>
                  <span>7.5 (Pórfido Cu)</span>
                  <span>13.0 (Masiva Dura)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Fleet & Loading Operations */}
          <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-tech uppercase tracking-wider">
                <Truck className="w-4 h-4 text-[#0066ff]" />
                <span>2. Parámetros de Carguío, Acarreo y Despacho Dinámico</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Truck Count Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs">
                  <span className="text-[#9ca3af]">Flota de Camiones CAEX:</span>
                  <span className="font-mono text-[#0066ff] font-bold">{draftParams.truckCount} Unidades</span>
                </div>
                <input
                  type="range"
                  min={4}
                  max={16}
                  step={1}
                  disabled={isObserver}
                  value={draftParams.truckCount}
                  onChange={(e) => setDraftParams({ ...draftParams, truckCount: parseInt(e.target.value) })}
                  className="w-full accent-[#0066ff] bg-[#15181e] h-2 rounded cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-[#6b7280] font-mono">
                  <span>4 CAEX</span>
                  <span>8 CAEX (Nominal)</span>
                  <span>16 CAEX</span>
                </div>
              </div>

              {/* Dispatch Algorithm Selection */}
              <div className="space-y-1.5">
                <label className="text-xs text-[#9ca3af]">Política de Asignación / Despacho:</label>
                <select
                  disabled={isObserver}
                  value={draftParams.truckDispatchPolicy}
                  onChange={(e) => setDraftParams({ ...draftParams, truckDispatchPolicy: e.target.value as any })}
                  className="w-full bg-[#15181e] border border-[#1f2937] rounded px-3 py-1.5 text-xs text-white focus:border-[#00f2ff] focus:outline-none"
                >
                  <option value="drl_ppo_agent">🤖 DRL Agent PPO-M-3 (Optimización Continua Multi-Objetivo)</option>
                  <option value="drl_sac_agent">⚡ DRL Agent Soft Actor-Critic (Eficiencia Energética)</option>
                  <option value="heuristic_min_queue">📊 Heurística Mínima Cola (Rule-Based FIFO)</option>
                  <option value="fixed">🔒 Asignación Fija Estática (Línea Base Tradicional)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Section 3: Multi-Objective DRL Weights Ponderation */}
          <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-tech uppercase tracking-wider">
                <Scale className="w-4 h-4 text-[#10b981]" />
                <span>3. Función de Recompensa Multi-Objetivo: F(z) = w₁·Prod + w₂·Cal - w₃·Cost - w₄·Ener</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {/* w1: Productivity */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">w₁ Productividad</div>
                <div className="text-base font-bold text-[#10b981] font-mono mt-0.5">
                  {(draftParams.drlWeights.w1_productivity * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.7}
                  step={0.05}
                  disabled={isObserver}
                  value={draftParams.drlWeights.w1_productivity}
                  onChange={(e) =>
                    setDraftParams({
                      ...draftParams,
                      drlWeights: { ...draftParams.drlWeights, w1_productivity: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-[#10b981] mt-2 h-1.5"
                />
              </div>

              {/* w2: Quality */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">w₂ Fragmentación</div>
                <div className="text-base font-bold text-[#00f2ff] font-mono mt-0.5">
                  {(draftParams.drlWeights.w2_quality * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.7}
                  step={0.05}
                  disabled={isObserver}
                  value={draftParams.drlWeights.w2_quality}
                  onChange={(e) =>
                    setDraftParams({
                      ...draftParams,
                      drlWeights: { ...draftParams.drlWeights, w2_quality: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-[#00f2ff] mt-2 h-1.5"
                />
              </div>

              {/* w3: Cost */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">w₃ Costo OPEX</div>
                <div className="text-base font-bold text-[#f59e0b] font-mono mt-0.5">
                  {(draftParams.drlWeights.w3_cost * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.7}
                  step={0.05}
                  disabled={isObserver}
                  value={draftParams.drlWeights.w3_cost}
                  onChange={(e) =>
                    setDraftParams({
                      ...draftParams,
                      drlWeights: { ...draftParams.drlWeights, w3_cost: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-[#f59e0b] mt-2 h-1.5"
                />
              </div>

              {/* w4: Energy */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">w₄ Consumo kWh</div>
                <div className="text-base font-bold text-[#ef4444] font-mono mt-0.5">
                  {(draftParams.drlWeights.w4_energy * 100).toFixed(0)}%
                </div>
                <input
                  type="range"
                  min={0.05}
                  max={0.7}
                  step={0.05}
                  disabled={isObserver}
                  value={draftParams.drlWeights.w4_energy}
                  onChange={(e) =>
                    setDraftParams({
                      ...draftParams,
                      drlWeights: { ...draftParams.drlWeights, w4_energy: parseFloat(e.target.value) },
                    })
                  }
                  className="w-full accent-[#ef4444] mt-2 h-1.5"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Comparative Delta Scorecard & Rosin-Rammler Curve (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Comparative Delta Scorecard */}
          <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <div className="flex items-center gap-2 text-sm font-bold text-white font-tech uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-[#00f2ff]" />
                <span>Scorecard Prospectivo: What-If vs Actual</span>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              {/* TPH Delta */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Productividad (TPH)</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {prospectiveTph} <span className="text-xs text-[#6b7280] font-normal">t/h</span>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded flex items-center gap-1 ${
                    deltaTph >= 0 ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40' : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                  }`}
                >
                  {deltaTph >= 0 ? `+${deltaTph}` : deltaTph} t/h
                </div>
              </div>

              {/* Cost Delta */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Costo Unitario ($/t)</div>
                  <div className="text-lg font-bold text-white font-mono">
                    ${prospectiveCost.toFixed(2)} <span className="text-xs text-[#6b7280] font-normal">/ t</span>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded flex items-center gap-1 ${
                    deltaCost <= 0 ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40' : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                  }`}
                >
                  {deltaCost <= 0 ? `${deltaCost.toFixed(2)}` : `+${deltaCost.toFixed(2)}`} $/t
                </div>
              </div>

              {/* Energy Delta */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Energía Específica (kWh/t)</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {prospectiveEnergy.toFixed(2)} <span className="text-xs text-[#6b7280] font-normal">kWh/t</span>
                  </div>
                </div>
                <div
                  className={`text-xs font-bold font-mono px-2.5 py-1 rounded flex items-center gap-1 ${
                    deltaEnergy <= 0 ? 'bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40' : 'bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/40'
                  }`}
                >
                  {deltaEnergy <= 0 ? `${deltaEnergy.toFixed(2)}` : `+${deltaEnergy.toFixed(2)}`} kWh/t
                </div>
              </div>

              {/* P80 Delta */}
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Kuz-Ram P80 Fragmentation</div>
                  <div className="text-lg font-bold text-white font-mono">
                    {draftKuzRam.p80Mm} <span className="text-xs text-[#6b7280] font-normal">mm</span>
                  </div>
                </div>
                <div className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-[#0a0b0e] text-[#00f2ff] border border-[#1f2937]">
                  {deltaP80 >= 0 ? `+${deltaP80.toFixed(1)}` : deltaP80.toFixed(1)} mm
                </div>
              </div>
            </div>

            {/* Mine-to-Mill Coupling Impact */}
            <div className="bg-[#15181e] p-3.5 rounded border border-[#00f2ff]/30 shadow-[0_0_15px_rgba(0,242,255,0.06)]">
              <div className="text-xs font-bold text-[#00f2ff] font-tech uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#00f2ff]" />
                <span>Impacto Mine-to-Mill en Molienda SAG:</span>
              </div>
              <p className="text-xs text-[#d1d5db] mt-1">
                La fragmentación simulada reduce el consumo en SAG a{' '}
                <strong className="text-[#00f2ff]">{draftKuzRam.estimatedSagMillKwhPerTonne} kWh/t</strong>, generando un{' '}
                <strong className="text-[#10b981]">+{draftKuzRam.energySavingPercentage}% de ahorro energético</strong> vs línea base.
              </p>
            </div>
          </div>

          {/* Rosin-Rammler Fragmentation Curve Visualization */}
          <div className="bg-[#0f1115] p-5 rounded border border-[#1f2937] shadow-xl flex flex-col gap-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#1f2937]">
              <div className="text-sm font-bold text-white font-tech uppercase tracking-wider">Curva Granulométrica Rosin-Rammler</div>
              <span className="text-[11px] font-mono text-[#6b7280]">P50={draftKuzRam.p50Mm}mm | P80={draftKuzRam.p80Mm}mm</span>
            </div>

            {/* Custom SVG Rosin-Rammler Curve Chart */}
            <div className="relative w-full h-44 bg-[#0a0b0e] rounded p-2 border border-[#1f2937]">
              <svg className="w-full h-full" viewBox="0 0 400 150">
                {/* Grid Lines */}
                <line x1="40" y1="20" x2="380" y2="20" stroke="#1f2937" strokeDasharray="3 3" />
                <line x1="40" y1="50" x2="380" y2="50" stroke="#1f2937" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="#1f2937" strokeDasharray="3 3" />
                <line x1="40" y1="110" x2="380" y2="110" stroke="#1f2937" strokeDasharray="3 3" />
                <line x1="40" y1="130" x2="380" y2="130" stroke="#374151" />
                <line x1="40" y1="10" x2="40" y2="130" stroke="#374151" />

                {/* Axis Labels */}
                <text x="10" y="25" fill="#6b7280" fontSize="9">100%</text>
                <text x="15" y="55" fill="#6b7280" fontSize="9">80%</text>
                <text x="15" y="85" fill="#6b7280" fontSize="9">50%</text>
                <text x="15" y="115" fill="#6b7280" fontSize="9">20%</text>
                <text x="40" y="145" fill="#6b7280" fontSize="9">0 mm</text>
                <text x="180" y="145" fill="#6b7280" fontSize="9">300 mm</text>
                <text x="350" y="145" fill="#6b7280" fontSize="9">600 mm</text>

                {/* 80% and 50% Threshold Guides */}
                <line x1="40" y1="50" x2="380" y2="50" stroke="#00f2ff" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />
                <line x1="40" y1="80" x2="380" y2="80" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" opacity="0.6" />

                {/* Plot Path */}
                {(() => {
                  const points = fragCurve.map((pt) => {
                    const x = 40 + (Math.min(pt.sizeMm, 600) / 600) * 340;
                    const y = 130 - (pt.percentPassing / 100) * 110;
                    return `${x},${y}`;
                  });
                  return (
                    <>
                      <polyline
                        fill="none"
                        stroke="#00f2ff"
                        strokeWidth="2.5"
                        points={points.join(' ')}
                      />
                      {/* P80 Point Marker */}
                      <circle
                        cx={40 + (Math.min(draftKuzRam.p80Mm, 600) / 600) * 340}
                        cy={50}
                        r="4"
                        fill="#00f2ff"
                      />
                    </>
                  );
                })()}
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-[#15181e] p-1.5 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">Finos (&lt;25mm)</div>
                <div className="font-mono font-bold text-white">{draftKuzRam.finesPercentUnder25mm}%</div>
              </div>
              <div className="bg-[#15181e] p-1.5 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">Bolones (&gt;600mm)</div>
                <div className="font-mono font-bold text-[#ef4444]">{draftKuzRam.bouldersPercentOver600mm}%</div>
              </div>
              <div className="bg-[#15181e] p-1.5 rounded border border-[#1f2937]">
                <div className="text-[10px] uppercase font-bold text-[#6b7280]">Diggability Score</div>
                <div className="font-mono font-bold text-[#10b981]">{draftKuzRam.optimumDiggabilityScore}/100</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
