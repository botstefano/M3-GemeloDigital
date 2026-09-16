import React, { useState, useEffect, useRef } from 'react';
import {
  SimulationKPIs,
  SimulationParams,
  HaulTruck,
  Shovel,
  DrillRig,
  BlastZone,
  ParetoSolution,
  AnomalyAlert,
  GanttTask,
  User,
  AuditLog,
  NavigationTab,
} from './types';
import {
  INITIAL_KPIS,
  INITIAL_SIM_PARAMS,
  INITIAL_TRUCKS,
  INITIAL_SHOVELS,
  INITIAL_DRILLS,
  INITIAL_BLAST_ZONES,
  INITIAL_ALERTS,
  INITIAL_GANTT_TASKS,
  INITIAL_USERS,
  INITIAL_AUDIT_LOGS,
} from './data/mockData';
import { ThreeMineScene } from './components/digital-twin/ThreeMineScene';
import { DigitalTwinHUD } from './components/digital-twin/DigitalTwinHUD';
import { WhatIfStudio } from './components/what-if/WhatIfStudio';
import { AnalyticsDashboard } from './components/dashboard/AnalyticsDashboard';
import { DrlTrainingStudio } from './components/drl-training/DrlTrainingStudio';
import { ReportsStudio } from './components/reports/ReportsStudio';
import { AuthAuditStudio } from './components/security/AuthAuditStudio';
import { ArchitectureDeliverables } from './components/architecture/ArchitectureDeliverables';
import { ScientificResearchStudio } from './components/scientific/ScientificResearchStudio';
import { FastApiManagerModal } from './components/fastapi/FastApiManagerModal';
import { checkFastApiHealth } from './services/fastapiClient';
import { calculateKuzRam } from './utils/kuzRam';
import {
  Layers,
  FlaskConical,
  Sliders,
  BarChart3,
  Cpu,
  FileText,
  ShieldCheck,
  Server,
  Play,
  Pause,
  RotateCcw,
  Clock,
  Zap,
  Activity,
  Flame,
  Truck,
  AlertTriangle,
  ChevronDown,
} from 'lucide-react';

export default function App() {
  // Navigation & User State
  const [activeTab, setActiveTab] = useState<NavigationTab>('twin3d');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]); // Default: Chief Ops Admin
  const [allUsers, setAllUsers] = useState<User[]>(INITIAL_USERS);

  // Simulation Controls & Time
  const [isSimRunning, setIsSimRunning] = useState<boolean>(true);
  const [simSpeed, setSimSpeed] = useState<number>(1.0);
  const [simMinutes, setSimMinutes] = useState<number>(245); // Active shift min
  const [simulationParams, setSimulationParams] = useState<SimulationParams>(INITIAL_SIM_PARAMS);

  // Mining Entity States
  const [kpis, setKpis] = useState<SimulationKPIs>(INITIAL_KPIS);
  const [trucks, setTrucks] = useState<HaulTruck[]>(INITIAL_TRUCKS);
  const [shovels, setShovels] = useState<Shovel[]>(INITIAL_SHOVELS);
  const [drills, setDrills] = useState<DrillRig[]>(INITIAL_DRILLS);
  const [blastZones, setBlastZones] = useState<BlastZone[]>(INITIAL_BLAST_ZONES);
  const [alerts, setAlerts] = useState<AnomalyAlert[]>(INITIAL_ALERTS);
  const [ganttTasks] = useState<GanttTask[]>(INITIAL_GANTT_TASKS);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Selection state for 3D scene
  const [selectedAgent, setSelectedAgent] = useState<DrillRig | Shovel | HaulTruck | BlastZone | null>(null);
  const [cameraMode, setCameraMode] = useState<'orbit' | 'aerial' | 'follow' | 'first_person'>('orbit');
  const [heatmapMode, setHeatmapMode] = useState<'none' | 'fragmentation' | 'energy' | 'traffic' | 'grade'>('none');

  // FastAPI Engine Connection State
  const [isFastApiModalOpen, setIsFastApiModalOpen] = useState<boolean>(false);
  const [isFastApiOnline, setIsFastApiOnline] = useState<boolean>(false);
  const [fastApiLatency, setFastApiLatency] = useState<number | null>(null);

  // Probe FastAPI Health on Mount
  useEffect(() => {
    checkFastApiHealth().then((res) => {
      setIsFastApiOnline(res.online);
      setFastApiLatency(res.latencyMs);
    });
  }, []);

  // Active unacknowledged alerts count
  const unreadAlertsCount = alerts.filter((a) => a.status === 'active').length;

  // Real-Time ABM Simulation Step Engine
  useEffect(() => {
    let interval: any = null;
    if (isSimRunning) {
      interval = setInterval(() => {
        // Increment shift time
        setSimMinutes((prev) => (prev >= 720 ? 0 : prev + 1));

        // Physical Kuz-Ram coupling for active blast zone
        const kz = calculateKuzRam({
          powderFactorKgM3: simulationParams.powderFactorKgM3,
          rockMassFactorA: 7.2,
        });

        // Update Trucks progress and cycle states with queue resolution
        setTrucks((prevTrucks) =>
          prevTrucks.map((truck) => {
            // Speed affected by payload (loaded uphill vs empty return)
            const isLoaded = truck.status === 'hauling_full';
            const nominalSpeed = isLoaded ? 22 : 36;
            const speedFactor = (nominalSpeed / 28) * 0.018 * simSpeed;
            let nextProgress = truck.progressAlongRoute + speedFactor;
            let nextStatus = truck.status;
            let nextPayload = truck.currentPayloadTonnes;
            let nextRounds = truck.totalRoundsCompleted;
            let assignedShovel = truck.assignedShovelId;

            // Route loop transitions
            if (nextProgress >= 1.0) {
              nextProgress = 0.0;
              if (truck.status === 'hauling_full') {
                nextStatus = 'dumping';
                nextPayload = 0;
                nextRounds += 1;
              } else if (truck.status === 'returning_empty') {
                nextStatus = 'loading';
                nextPayload = truck.capacityTonnes;
              } else if (truck.status === 'loading') {
                nextStatus = 'hauling_full';
              } else if (truck.status === 'dumping') {
                nextStatus = 'returning_empty';

                // REAL DISPATCH LOGIC AT CRUSHER DUMP
                if (simulationParams.truckDispatchPolicy === 'fixed') {
                  assignedShovel = truck.assignedShovelId || 'SH-01';
                } else if (simulationParams.truckDispatchPolicy === 'heuristic_min_queue') {
                  // Select shovel with fewest trucks
                  const sh1Count = prevTrucks.filter((t) => t.assignedShovelId === 'SH-01' && (t.status === 'loading' || t.status === 'returning_empty')).length;
                  const sh2Count = prevTrucks.filter((t) => t.assignedShovelId === 'SH-02' && (t.status === 'loading' || t.status === 'returning_empty')).length;
                  assignedShovel = sh1Count <= sh2Count ? 'SH-01' : 'SH-02';
                } else {
                  // DRL-PPO Policy: balances queue length and rock diggability
                  const sh1Count = prevTrucks.filter((t) => t.assignedShovelId === 'SH-01' && (t.status === 'loading' || t.status === 'returning_empty')).length;
                  const sh2Count = prevTrucks.filter((t) => t.assignedShovelId === 'SH-02' && (t.status === 'loading' || t.status === 'returning_empty')).length;
                  const score1 = 5.0 - sh1Count * 2.1;
                  const score2 = 4.8 - sh2Count * 2.1;
                  assignedShovel = score1 >= score2 ? 'SH-01' : 'SH-02';
                }
              }
            }

            // Slight dynamic tire temp fluctuation based on load & speed
            const tireTemp = Math.round((78 + (isLoaded ? 8 : 0) + Math.sin(Date.now() / 8000 + truck.id.charCodeAt(3)) * 3) * 10) / 10;

            return {
              ...truck,
              progressAlongRoute: nextProgress,
              status: nextStatus,
              currentPayloadTonnes: nextPayload,
              totalRoundsCompleted: nextRounds,
              assignedShovelId: assignedShovel,
              tireTempCelsius: tireTemp,
            };
          })
        );

        // Update Shovel Queues based on active trucks
        setShovels((prevShovels) =>
          prevShovels.map((sh) => {
            const waitingTrucks = trucks
              .filter((t) => t.assignedShovelId === sh.id && t.status === 'returning_empty' && t.progressAlongRoute > 0.8)
              .map((t) => t.id);
            const activeTruck = trucks.find((t) => t.assignedShovelId === sh.id && t.status === 'loading');
            return {
              ...sh,
              assignedTruckId: activeTruck ? activeTruck.id : null,
              trucksInQueue: waitingTrucks,
              status: activeTruck ? 'loading' : waitingTrucks.length > 0 ? 'operating' : 'idle',
            };
          })
        );

        // Update Drills penetration progress
        setDrills((prevDrills) =>
          prevDrills.map((drill) => {
            if (drill.status !== 'drilling') return drill;
            const inc = (drill.penetrationRateMh / 3600) * 4 * simSpeed;
            const nextMeters = Math.min(drill.targetMeters, drill.currentMetersDrilled + inc);
            const nextStatus = nextMeters >= drill.targetMeters ? 'moving' : 'drilling';
            return {
              ...drill,
              currentMetersDrilled: Math.round(nextMeters * 10) / 10,
              status: nextStatus,
            };
          })
        );

        // Dynamic KPI live variations coupled with Kuz-Ram and Queues
        setKpis((prev) => {
          const trucksDumping = trucks.filter((t) => t.status === 'dumping').length;
          const trucksLoading = trucks.filter((t) => t.status === 'loading').length;
          const currentTph = Math.round(4200 + trucksLoading * 280 + trucksDumping * 350 + (simulationParams.truckDispatchPolicy.includes('drl') ? 350 : 0));
          const unitCost = Math.round((4.65 + (kz.estimatedSagMillKwhPerTonne * 0.12) + (prev.shovelQueueAvgSeconds > 120 ? 0.35 : 0)) * 100) / 100;

          return {
            ...prev,
            tph: currentTph,
            currentP80Mm: kz.p80Mm,
            energyKwhPerTonne: kz.estimatedSagMillKwhPerTonne,
            costPerTonne: unitCost,
            crusherQueueLength: trucksDumping,
            totalTonnesMoved: (prev.totalTonnesMoved || 38450) + Math.round((currentTph / 3600) * 2 * simSpeed),
            fleetOeePercent: Math.round((88.5 + (Math.random() - 0.5) * 1.2) * 10) / 10,
          };
        });
      }, 1000 / simSpeed);
    }
    return () => clearInterval(interval);
  }, [isSimRunning, simSpeed]);

  // Handler: Apply What-If parameters to live twin
  const handleApplyWhatIfParams = (newParams: Partial<SimulationParams>) => {
    setSimulationParams((prev) => ({ ...prev, ...newParams }));
    // Add audit entry
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'UPDATE_WHAT_IF_PARAMETERS',
      category: 'SIMULATION',
      details: `Parámetros modificados por ${currentUser.name}: Factor de carga=${newParams.powderFactorKgM3 ?? simulationParams.powderFactorKgM3} kg/m³`,
      ipAddress: '192.168.10.42',
      status: 'SUCCESS',
    };
    setAuditLogs((logs) => [newLog, ...logs]);
  };

  // Handler: Detonate Blast Polygon
  const handleDetonateBlast = (zoneId: string) => {
    setBlastZones((zones) =>
      zones.map((z) => (z.id === zoneId ? { ...z, isDetonated: true } : z))
    );

    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userId: currentUser.id,
      userName: currentUser.name,
      userRole: currentUser.role,
      action: 'EXECUTE_BLAST_DETONATION',
      category: 'SIMULATION',
      details: `Detonación de voladura ejecutada en polígono ${zoneId} con modelo Kuz-Ram activo.`,
      ipAddress: '192.168.10.42',
      status: 'SUCCESS',
    };
    setAuditLogs((logs) => [newLog, ...logs]);
  };

  // Handler: Select Pareto Solution from dashboard
  const handleSelectParetoSolution = (sol: ParetoSolution) => {
    setKpis((prev) => ({
      ...prev,
      tph: sol.productivityTph,
      costPerTonne: sol.costPerTonne,
      energyKwhPerTonne: sol.energyKwhPerTonne,
      currentP80Mm: sol.p80QualityMm,
      drlRewardScore: Math.round(sol.weights.w1 * 95 + sol.weights.w2 * 90),
    }));
  };

  // Handler: Acknowledge Alert
  const handleAcknowledgeAlert = (id: string) => {
    setAlerts((list) =>
      list.map((a) => (a.id === id ? { ...a, status: 'acknowledged' } : a))
    );
  };

  // Handler: Toggle 2FA for current user
  const handleToggle2FA = () => {
    const updated = { ...currentUser, twoFactorEnabled: !currentUser.twoFactorEnabled };
    setCurrentUser(updated);
    setAllUsers((list) => list.map((u) => (u.id === updated.id ? updated : u)));
  };

  // Handler: Switch user
  const handleSwitchUser = (user: User) => {
    setCurrentUser(user);
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      action: 'AUTH_SWITCH_USER_SESSION',
      category: 'SECURITY',
      details: `Sesión activa transferida a ${user.name} (${user.role}).`,
      ipAddress: '192.168.10.42',
      status: 'SUCCESS',
    };
    setAuditLogs((logs) => [newLog, ...logs]);
  };

  // Format shift minutes into HH:MM
  const formatShiftTime = (mins: number) => {
    const h = Math.floor(mins / 60)
      .toString()
      .padStart(2, '0');
    const m = (mins % 60).toString().padStart(2, '0');
    return `T+${h}:${m}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0b0e] text-[#e0e2e5] flex flex-col font-sans">
      {/* 1. Global Navigation & Operations Header */}
      <header className="sticky top-0 z-50 bg-[#0f1115]/95 backdrop-blur-md border-b border-[#1f2937] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-4">
          {/* Logo & Platform Identity */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-[#00f2ff] to-[#0066ff] rounded flex items-center justify-center shadow-[0_0_15px_rgba(0,242,255,0.3)] text-black font-black text-xs">
              M-3
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-sm font-bold tracking-widest uppercase text-white font-tech">
                  Digital Twin: Drill-Blast-Load-Haul
                </h1>
                <span className="px-2 py-0.5 rounded bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] text-[10px] font-mono font-semibold flex items-center gap-1.5 shadow-[0_0_8px_rgba(16,185,129,0.2)]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  ACTIVE_OPTIMIZING
                </span>
              </div>
              <p className="text-[10px] text-[#9ca3af] font-mono">
                CORE ENGINE: RAY-RLlib v2.9 | AGENT-MODEL: MESA 2.1 | MINE-TO-MILL
              </p>
            </div>
          </div>

          {/* Simulation Playback & Speed Controls */}
          <div className="flex items-center gap-2 bg-[#15181e] px-3 py-1.5 rounded border border-[#1f2937]">
            <button
              onClick={() => setIsSimRunning(!isSimRunning)}
              className={`p-1.5 rounded transition-all ${
                isSimRunning
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#00f2ff] text-black font-bold hover:opacity-90 shadow-[0_0_10px_rgba(0,242,255,0.3)]'
                  : 'bg-[#10b981] text-black font-bold hover:bg-[#10b981]/90 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
              }`}
              title={isSimRunning ? 'Pausar Simulación' : 'Reanudar Simulación'}
            >
              {isSimRunning ? <Pause className="w-3.5 h-3.5 fill-current" /> : <Play className="w-3.5 h-3.5 fill-current" />}
            </button>

            <button
              onClick={() => {
                setSimMinutes(0);
                setTrucks(INITIAL_TRUCKS);
              }}
              className="p-1.5 rounded bg-[#1f2937] hover:bg-[#374151] text-[#9ca3af] hover:text-white transition-all border border-[#374151]/50"
              title="Reiniciar Turno"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>

            {/* Speed Selector */}
            <div className="flex items-center gap-1 pl-2 border-l border-[#1f2937]">
              {[0.5, 1.0, 2.0, 5.0].map((s) => (
                <button
                  key={s}
                  onClick={() => setSimSpeed(s)}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold transition-all ${
                    simSpeed === s
                      ? 'bg-[#00f2ff] text-black shadow-[0_0_8px_#00f2ff]'
                      : 'bg-[#1f2937] text-[#9ca3af] hover:text-[#e0e2e5]'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Shift Clock */}
            <div className="pl-2 border-l border-[#1f2937] flex items-center gap-1.5 text-xs font-mono text-[#00f2ff] font-semibold">
              <Clock className="w-3.5 h-3.5 text-[#6b7280]" />
              <span>{formatShiftTime(simMinutes)}</span>
            </div>
          </div>

          {/* FastAPI Engine Status Quick Button */}
          <button
            onClick={() => setIsFastApiModalOpen(true)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded border transition-all text-xs font-mono cursor-pointer ${
              isFastApiOnline
                ? 'bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40 hover:bg-[#10b981]/25 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                : 'bg-[#15181e] text-[#9ca3af] border-[#1f2937] hover:text-[#00f2ff] hover:border-[#00f2ff]/40'
            }`}
            title="Configuración y Estado de tu API FastAPI"
          >
            <Server className="w-3.5 h-3.5" />
            <span className="hidden md:inline font-semibold">FastAPI:</span>
            <span className="flex items-center gap-1.5 font-bold">
              <span
                className={`w-2 h-2 rounded-full ${
                  isFastApiOnline ? 'bg-[#10b981] animate-pulse' : 'bg-[#f59e0b]'
                }`}
              />
              {isFastApiOnline ? `${fastApiLatency}ms` : 'Local Engine'}
            </span>
          </button>

          {/* User Profile & RBAC Switcher Quick Badge */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] uppercase text-[#6b7280]">DRL Reward Delta</p>
              <p className="text-xs font-bold text-[#00f2ff] font-mono">+14.2% [EP_450]</p>
            </div>
            <div className="w-px h-7 bg-[#1f2937] hidden sm:block"></div>
            <button
              onClick={() => setActiveTab('security')}
              className="flex items-center gap-2.5 bg-[#15181e] hover:bg-[#1f2937] px-3 py-1.5 rounded border border-[#1f2937] hover:border-[#00f2ff]/40 transition-all text-left"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-full object-cover border border-[#374151]"
              />
              <div className="hidden md:block">
                <div className="text-xs font-semibold text-[#e0e2e5]">{currentUser.name}</div>
                <div className="text-[10px] font-mono text-[#00f2ff] capitalize">
                  {currentUser.role.replace('_', ' ')}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex overflow-x-auto no-scrollbar gap-1 border-t border-[#1f2937] pt-1">
          {[
            { id: 'twin3d', label: 'Gemelo Digital 3D', icon: Layers },
            { id: 'scientific', label: 'Investigación Científica (Paper)', icon: FlaskConical },
            { id: 'whatif', label: 'Sandbox What-If & Kuz-Ram', icon: Sliders },
            { id: 'analytics', label: 'Analytics & Frente Pareto', icon: BarChart3 },
            { id: 'drl_studio', label: 'Pipeline DRL (Ray RLlib)', icon: Cpu },
            { id: 'reports', label: 'Reportes & Exportación', icon: FileText },
            { id: 'security', label: 'Seguridad & RBAC', icon: ShieldCheck },
            { id: 'architecture', label: 'Entregables de Arquitectura', icon: Server },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as NavigationTab)}
                className={`px-3.5 py-2 rounded-t text-xs font-bold font-tech uppercase tracking-wider flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  isActive
                    ? 'border-[#00f2ff] text-[#00f2ff] bg-[#15181e] shadow-[0_0_12px_rgba(0,242,255,0.15)]'
                    : 'border-transparent text-[#9ca3af] hover:text-[#e0e2e5] hover:bg-[#15181e]/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </header>

      {/* 2. Main Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6">
        {/* VIEW 1: Digital Twin 3D Viewport & HUD */}
        {activeTab === 'twin3d' && (
          <div className="flex flex-col gap-5">
            <div className="relative w-full h-[620px] rounded-xl overflow-hidden border border-[#1f2937] shadow-[0_0_30px_rgba(0,242,255,0.06)] bg-[#050608]">
              {/* Three.js Canvas */}
              <ThreeMineScene
                trucks={trucks}
                shovels={shovels}
                drills={drills}
                blastZones={blastZones}
                params={simulationParams}
                onSelectAgent={(agent) => setSelectedAgent(agent)}
                selectedAgentId={selectedAgent?.id ?? null}
                cameraMode={cameraMode}
                heatmapMode={heatmapMode}
                onTriggerBlast={handleDetonateBlast}
              />

              {/* Real-Time Telemetry HUD Overlay */}
              <div className="absolute inset-0 pointer-events-none p-4 flex flex-col justify-between overflow-y-auto">
                <div className="pointer-events-auto">
                  <DigitalTwinHUD
                    selectedAgent={selectedAgent}
                    onCloseInspector={() => setSelectedAgent(null)}
                    cameraMode={cameraMode}
                    onSetCameraMode={setCameraMode}
                    heatmapMode={heatmapMode}
                    onSetHeatmapMode={setHeatmapMode}
                    params={simulationParams}
                    onUpdateParams={(newParams) => setSimulationParams((prev) => ({ ...prev, ...newParams }))}
                    kpis={kpis}
                  />
                </div>
              </div>
            </div>

            {/* Quick Context Strip */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Total Toneladas Turno:</span>
                <span className="font-mono font-bold text-[#00f2ff] text-sm">
                  {(kpis.totalTonnesMoved ?? 38450).toLocaleString()} t
                </span>
              </div>
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Política Despacho:</span>
                <span className="font-mono font-bold text-[#a855f7]">PPO DRL Multi-Objective</span>
              </div>
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Alertas Activas:</span>
                <span className="font-mono font-bold text-[#ef4444]">{unreadAlertsCount} Eventos</span>
              </div>
              <div className="bg-[#15181e] p-3 rounded border border-[#1f2937] flex items-center justify-between shadow-sm">
                <span className="text-[10px] uppercase font-bold text-[#6b7280] tracking-wider">Factor Carga Promedio:</span>
                <span className="font-mono font-bold text-[#10b981]">
                  {simulationParams.powderFactorKgM3 ?? 0.76} kg/m³
                </span>
              </div>
            </div>
          </div>
        )}

        {/* VIEW: Scientific Research & Statistical Validation Suite */}
        {activeTab === 'scientific' && <ScientificResearchStudio />}

        {/* VIEW 2: What-If Studio & Kuz-Ram Engine */}
        {activeTab === 'whatif' && (
          <WhatIfStudio
            currentParams={simulationParams}
            kpis={kpis}
            activeBlastZone={blastZones[0]}
            onApplyParams={handleApplyWhatIfParams}
            userRole={currentUser.role}
            onOpenFastApiModal={() => setIsFastApiModalOpen(true)}
            isFastApiOnline={isFastApiOnline}
            fastApiLatency={fastApiLatency}
          />
        )}

        {/* VIEW 3: Analytics & Executive Dashboard */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            kpis={kpis}
            trucks={trucks}
            shovels={shovels}
            drills={drills}
            ganttTasks={ganttTasks}
            alerts={alerts}
            onAcknowledgeAlert={handleAcknowledgeAlert}
            onSelectParetoSolution={handleSelectParetoSolution}
          />
        )}

        {/* VIEW 4: DRL Training Studio */}
        {activeTab === 'drl_studio' && (
          <DrlTrainingStudio
            params={simulationParams}
            onUpdateParams={handleApplyWhatIfParams}
            userRole={currentUser.role}
            onOpenFastApiModal={() => setIsFastApiModalOpen(true)}
            isFastApiOnline={isFastApiOnline}
            fastApiLatency={fastApiLatency}
          />
        )}

        {/* VIEW 5: Reports Studio */}
        {activeTab === 'reports' && (
          <ReportsStudio
            kpis={kpis}
            params={simulationParams}
            drills={drills}
            shovels={shovels}
            trucks={trucks}
            blastZones={blastZones}
            userRole={currentUser.role}
          />
        )}

        {/* VIEW 6: Security, RBAC & Audit */}
        {activeTab === 'security' && (
          <AuthAuditStudio
            currentUser={currentUser}
            allUsers={allUsers}
            onSwitchUser={handleSwitchUser}
            auditLogs={auditLogs}
            onToggle2FA={handleToggle2FA}
          />
        )}

        {/* VIEW 7: Architecture Deliverables (1-8) */}
        {activeTab === 'architecture' && <ArchitectureDeliverables />}
      </main>

      {/* FastAPI Engine Configuration & Python Starter Modal */}
      <FastApiManagerModal
        isOpen={isFastApiModalOpen}
        onClose={() => setIsFastApiModalOpen(false)}
        onConnectionStatusChange={(online, latency) => {
          setIsFastApiOnline(online);
          setFastApiLatency(latency);
        }}
      />

      {/* 3. Global Industrial Footer */}
      <footer className="h-9 bg-[#0a0b0e] border-t border-[#1f2937] px-6 flex items-center justify-between shrink-0 text-xs text-[#6b7280]">
        <div className="flex gap-4 text-[9px] uppercase tracking-tighter text-[#6b7280] font-mono">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> DB_SYNC: OK
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]"></span> K8S_CLUSTER: HEALTHY
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]"></span> WORKER_DRL_TRAINING: ACTIVE
          </span>
        </div>
        <div className="text-[9px] font-mono text-[#4b5563]">
          M-3 SYSTEM ARCHITECTURE v2.9-PROD | RAY-RLlib | THREE.js WebGL
        </div>
      </footer>
    </div>
  );
}
