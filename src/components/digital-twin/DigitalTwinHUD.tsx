import React from 'react';
import {
  DrillRig,
  Shovel,
  HaulTruck,
  BlastZone,
  SimulationParams,
  SimulationKPIs,
} from '../../types';
import {
  Camera,
  Layers,
  Sun,
  Moon,
  CloudSun,
  Wind,
  Gauge,
  Compass,
  Fuel,
  Cpu,
  Activity,
  Zap,
  Clock,
  CheckCircle,
  X,
  Target,
  Maximize2,
  Minimize2,
} from 'lucide-react';

interface DigitalTwinHUDProps {
  selectedAgent: DrillRig | Shovel | HaulTruck | BlastZone | null;
  onCloseInspector: () => void;
  cameraMode: 'orbit' | 'aerial' | 'follow' | 'first_person';
  onSetCameraMode: (mode: 'orbit' | 'aerial' | 'follow' | 'first_person') => void;
  heatmapMode: 'none' | 'fragmentation' | 'energy' | 'traffic' | 'grade';
  onSetHeatmapMode: (mode: 'none' | 'fragmentation' | 'energy' | 'traffic' | 'grade') => void;
  params: SimulationParams;
  onUpdateParams: (newParams: Partial<SimulationParams>) => void;
  kpis: SimulationKPIs;
}

export const DigitalTwinHUD: React.FC<DigitalTwinHUDProps> = ({
  selectedAgent,
  onCloseInspector,
  cameraMode,
  onSetCameraMode,
  heatmapMode,
  onSetHeatmapMode,
  params,
  onUpdateParams,
  kpis,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Top Floating Control Toolbar */}
      <div className="bg-[#0f1115]/90 backdrop-blur-md p-3 rounded border border-[#1f2937] shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Camera Preset Buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6b7280] mr-1 uppercase font-tech tracking-wider">
            <Camera className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span>Cámara:</span>
          </div>
          <button
            onClick={() => onSetCameraMode('orbit')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all uppercase tracking-wider ${
              cameraMode === 'orbit'
                ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Órbita 3D
          </button>
          <button
            onClick={() => onSetCameraMode('aerial')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all uppercase tracking-wider ${
              cameraMode === 'aerial'
                ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Aérea Táctica
          </button>
          <button
            onClick={() => onSetCameraMode('follow')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all uppercase tracking-wider ${
              cameraMode === 'follow'
                ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Seguir Agente
          </button>
          <button
            onClick={() => onSetCameraMode('first_person')}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-all uppercase tracking-wider ${
              cameraMode === 'first_person'
                ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            1ra Persona
          </button>
        </div>

        {/* Heatmaps & Shaders */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#6b7280] mr-1 uppercase font-tech tracking-wider">
            <Layers className="w-3.5 h-3.5 text-[#00f2ff]" />
            <span>Capas Heatmap:</span>
          </div>
          <button
            onClick={() => onSetHeatmapMode('none')}
            className={`px-2 py-1 rounded text-xs transition-all ${
              heatmapMode === 'none'
                ? 'bg-[#1f2937] text-white font-semibold border border-[#374151]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Off
          </button>
          <button
            onClick={() => onSetHeatmapMode('fragmentation')}
            className={`px-2 py-1 rounded text-xs transition-all ${
              heatmapMode === 'fragmentation'
                ? 'bg-[#10b981] text-black font-bold shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Fragmentación P80
          </button>
          <button
            onClick={() => onSetHeatmapMode('energy')}
            className={`px-2 py-1 rounded text-xs transition-all ${
              heatmapMode === 'energy'
                ? 'bg-[#f59e0b] text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Consumo Energía
          </button>
          <button
            onClick={() => onSetHeatmapMode('traffic')}
            className={`px-2 py-1 rounded text-xs transition-all ${
              heatmapMode === 'traffic'
                ? 'bg-[#00f2ff] text-black font-bold shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Tráfico / Colas
          </button>
          <button
            onClick={() => onSetHeatmapMode('grade')}
            className={`px-2 py-1 rounded text-xs transition-all ${
              heatmapMode === 'grade'
                ? 'bg-[#a855f7] text-white font-bold shadow-[0_0_10px_rgba(168,85,247,0.3)]'
                : 'bg-[#15181e] text-[#9ca3af] hover:text-[#e0e2e5] border border-[#1f2937]'
            }`}
          >
            Ley Mineral (Cu/Au)
          </button>
        </div>

        {/* Atmosphere & Weather Environment */}
        <div className="flex items-center gap-1 bg-[#0a0b0e] p-1 rounded border border-[#1f2937]">
          <button
            onClick={() => onUpdateParams({ weatherCondition: 'clear' })}
            title="Día Despejado"
            className={`p-1.5 rounded transition-all ${
              params.weatherCondition === 'clear' ? 'bg-[#00f2ff]/20 text-[#00f2ff]' : 'text-[#6b7280] hover:text-[#e0e2e5]'
            }`}
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdateParams({ weatherCondition: 'sunset' })}
            title="Atardecer / Golden Hour"
            className={`p-1.5 rounded transition-all ${
              params.weatherCondition === 'sunset' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'text-[#6b7280] hover:text-[#e0e2e5]'
            }`}
          >
            <CloudSun className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdateParams({ weatherCondition: 'night' })}
            title="Turno Noche con Luminarias"
            className={`p-1.5 rounded transition-all ${
              params.weatherCondition === 'night' ? 'bg-[#0066ff]/20 text-[#00f2ff]' : 'text-[#6b7280] hover:text-[#e0e2e5]'
            }`}
          >
            <Moon className="w-4 h-4" />
          </button>
          <button
            onClick={() => onUpdateParams({ weatherCondition: 'dust_storm' })}
            title="Tormenta de Polvo / Neblina"
            className={`p-1.5 rounded transition-all ${
              params.weatherCondition === 'dust_storm' ? 'bg-[#f59e0b]/20 text-[#f59e0b]' : 'text-[#6b7280] hover:text-[#e0e2e5]'
            }`}
          >
            <Wind className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Agent Telemetry Inspector Modal / Card */}
      {selectedAgent && (
        <div className="bg-[#0f1115]/95 backdrop-blur-xl p-4 rounded border border-[#00f2ff]/30 shadow-[0_0_30px_rgba(0,242,255,0.1)] animate-in fade-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-[#1f2937]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded bg-[#15181e] border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff] shadow-[0_0_10px_rgba(0,242,255,0.15)]">
                {selectedAgent.type === 'truck' && <Gauge className="w-5 h-5" />}
                {selectedAgent.type === 'shovel' && <Cpu className="w-5 h-5" />}
                {selectedAgent.type === 'drill' && <Activity className="w-5 h-5" />}
                {selectedAgent.type === undefined && <Target className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="text-sm font-bold text-white font-tech tracking-wide flex items-center gap-2">
                  {selectedAgent.name}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#15181e] text-[#00f2ff] border border-[#1f2937] uppercase">
                    ID: {selectedAgent.id}
                  </span>
                </h3>
                <p className="text-xs text-[#9ca3af]">
                  {'model' in selectedAgent ? (selectedAgent as any).model : 'Polígono Georeferenciado'} • Estado:{' '}
                  <span className="text-[#00f2ff] font-semibold uppercase">
                    {'status' in selectedAgent ? (selectedAgent as any).status : 'Activo'}
                  </span>
                </p>
              </div>
            </div>
            <button
              onClick={onCloseInspector}
              className="p-1 rounded text-[#9ca3af] hover:text-white hover:bg-[#1f2937] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Inspector Body Details Depending on Type */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4">
            {selectedAgent.type === 'truck' && (
              <>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#00f2ff]" /> Carga Actual
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as HaulTruck).currentPayloadTonnes} <span className="text-xs text-[#6b7280]">/ {(selectedAgent as HaulTruck).capacityTonnes} t</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#10b981]" /> Velocidad Rampa
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as HaulTruck).speedKmh} <span className="text-xs text-[#6b7280]">km/h</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280] flex items-center gap-1.5">
                    <Fuel className="w-3.5 h-3.5 text-[#f59e0b]" /> Consumo Diésel
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as HaulTruck).fuelConsumptionLitersPerHour} <span className="text-xs text-[#6b7280]">L/h</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#ef4444]" /> Cola Espera
                  </div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as HaulTruck).waitTimeSeconds} <span className="text-xs text-[#6b7280]">seg</span>
                  </div>
                </div>
              </>
            )}

            {selectedAgent.type === 'shovel' && (
              <>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Capacidad Balde</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as Shovel).bucketCapacityM3} <span className="text-xs text-[#6b7280]">m³</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Tiempo de Ciclo</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as Shovel).cycleTimeSeconds} <span className="text-xs text-[#6b7280]">seg</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Pases / Camión</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as Shovel).passNumber} <span className="text-xs text-[#6b7280]">/ {(selectedAgent as Shovel).totalPassesPerTruck}</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Potencia Eléctrica</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as Shovel).powerConsumptionKw} <span className="text-xs text-[#6b7280]">kW</span>
                  </div>
                </div>
              </>
            )}

            {selectedAgent.type === 'drill' && (
              <>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Tasa Perforación (ROP)</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as DrillRig).drillRateMetersPerHour} <span className="text-xs text-[#6b7280]">m/h</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Profundidad Pozo</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as DrillRig).holeDepthMeters} <span className="text-xs text-[#6b7280]">/ {(selectedAgent as DrillRig).targetDepthMeters} m</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Pozos Completados</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as DrillRig).currentHole} <span className="text-xs text-[#6b7280]">/ {(selectedAgent as DrillRig).totalHoles}</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Desgaste Tricono</div>
                  <div className="text-lg font-bold text-[#f59e0b] font-mono mt-0.5">
                    {(selectedAgent as DrillRig).bitWearPercent}%
                  </div>
                </div>
              </>
            )}

            {'burdenM' in selectedAgent && (
              <>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Malla Burden x Spacing</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as BlastZone).burdenM}m x {(selectedAgent as BlastZone).spacingM}m
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Factor de Carga (q)</div>
                  <div className="text-lg font-bold text-white font-mono mt-0.5">
                    {(selectedAgent as BlastZone).powderFactorKgM3} <span className="text-xs text-[#6b7280]">kg/m³</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Kuz-Ram P80 Estimado</div>
                  <div className="text-lg font-bold text-[#10b981] font-mono mt-0.5">
                    {(selectedAgent as BlastZone).kuzRamResult?.p80Mm} <span className="text-xs text-[#6b7280]">mm</span>
                  </div>
                </div>
                <div className="bg-[#15181e] p-2.5 rounded border border-[#1f2937]">
                  <div className="text-[10px] uppercase font-bold text-[#6b7280]">Ahorro Energía SAG</div>
                  <div className="text-lg font-bold text-[#00f2ff] font-mono mt-0.5">
                    +{(selectedAgent as BlastZone).kuzRamResult?.energySavingPercentage}%
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
