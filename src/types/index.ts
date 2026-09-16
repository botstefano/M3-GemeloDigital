export type UserRole = 'admin' | 'supervisor' | 'process_engineer' | 'observer';

export type NavigationTab = 'twin3d' | 'scientific' | 'whatif' | 'analytics' | 'drl_studio' | 'reports' | 'security' | 'architecture';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  twoFactorEnabled: boolean;
  department: string;
  lastLogin: string;
}

export type EquipmentType = 'drill' | 'shovel' | 'truck' | 'crusher' | 'blast_zone';

export type AgentStatus = 'idle' | 'operating' | 'hauling_full' | 'returning_empty' | 'spotting' | 'loading' | 'dumping' | 'maintenance' | 'drilling' | 'blasting';

export interface DrillRig {
  id: string;
  name: string;
  type: 'drill';
  model: string;
  x: number;
  y: number;
  z: number;
  rotation: number;
  status: AgentStatus;
  drillRateMetersPerHour: number;
  holeDepthMeters: number;
  targetDepthMeters: number;
  currentHole: number;
  totalHoles: number;
  fuelRateLitersPerHour: number;
  dieselConsumedLiters: number;
  vibrationMmSec: number;
  bitWearPercent: number;
  bitDiameterMm: number;
  penetrationSpeedMMin: number;
}

export interface Shovel {
  id: string;
  name: string;
  type: 'shovel';
  model: string;
  x: number;
  y: number;
  z: number;
  status: AgentStatus;
  bucketCapacityM3: number;
  bucketPayloadTonnes: number;
  cycleTimeSeconds: number;
  currentCycleTimer: number;
  efficiencyPercent: number;
  assignedTruckId: string | null;
  trucksInQueue: string[];
  totalTonnesLoaded: number;
  passNumber: number;
  totalPassesPerTruck: number;
  powerConsumptionKw: number;
}

export interface HaulTruck {
  id: string;
  name: string;
  type: 'truck';
  model: string;
  x: number;
  y: number;
  z: number;
  targetX: number;
  targetZ: number;
  rotation: number;
  speedKmh: number;
  maxSpeedKmh: number;
  capacityTonnes: number;
  currentPayloadTonnes: number;
  status: AgentStatus;
  assignedShovelId: string;
  destination: 'shovel' | 'crusher' | 'waste_dump';
  routeProgress: number; // 0 to 1
  routePath: [number, number, number][];
  fuelConsumptionLitersPerHour: number;
  totalFuelConsumed: number;
  waitTimeSeconds: number;
  tireTemperatureC: number;
  payloadType: 'ore_high' | 'ore_low' | 'waste';
  cyclesCompleted: number;
}

export interface BlastZone {
  id: string;
  name: string;
  benchElevation: number; // e.g. 4120 m
  x: number;
  z: number;
  width: number;
  length: number;
  numHoles: number;
  burdenM: number;
  spacingM: number;
  holeDiameterMm: number;
  benchHeightM: number;
  stemmingM: number;
  explosiveType: 'ANFO' | 'Heavy_Emulsion' | 'Slurry';
  powderFactorKgM3: number;
  rockDensityTM3: number;
  vodMs: number; // Velocity of detonation
  detonationDelayMs: number;
  rockMassFactorA: number; // Kuz-Ram rock factor (1 to 14)
  isBlasted: boolean;
  blastProgress: number; // 0 to 1
  kuzRamResult?: KuzRamOutput;
}

export interface KuzRamOutput {
  p50Mm: number;
  p80Mm: number;
  uniformityIndexN: number;
  meanSizeXmMm: number;
  characteristicSizeXcm: number;
  finesPercentUnder25mm: number;
  bouldersPercentOver600mm: number;
  optimumDiggabilityScore: number; // 0-100
  estimatedSagMillKwhPerTonne: number; // Bond/Kuz-Ram Mine to Mill coupling
  energySavingPercentage: number;
}

export interface SimulationParams {
  simulationSpeed: number;
  drillCount: number;
  shovelCount: number;
  truckCount: number;
  powderFactorKgM3: number;
  burdenSpacingRatio: number;
  truckDispatchPolicy: 'fixed' | 'heuristic_min_queue' | 'drl_ppo_agent' | 'drl_sac_agent';
  fuelPricePerLiter: number;
  energyPricePerKwh: number;
  targetTph: number;
  weatherCondition: 'clear' | 'sunset' | 'night' | 'dust_storm';
  drlWeights: {
    w1_productivity: number;
    w2_quality: number;
    w3_cost: number;
    w4_energy: number;
  };
}

export interface SimulationKPIs {
  tph: number; // Tonnes per hour
  targetTph: number;
  costPerTonne: number; // $/tonne
  energyKwhPerTonne: number; // kWh/tonne
  fuelLitersPerTonne: number;
  fleetOeePercent: number;
  truckFleetAvailabilityPercent: number;
  shovelFleetAvailabilityPercent: number;
  drillFleetAvailabilityPercent: number;
  currentP80Mm: number;
  targetP80Mm: number;
  totalTonnesMoved: number;
  totalCostUsd: number;
  carbonEmissionTonnesCo2: number;
  crusherQueueLength: number;
  shovelQueueAvgSeconds: number;
  drlRewardScore: number;
}

export interface DrlPolicyMetrics {
  episode: number;
  reward: number;
  actorLoss: number;
  criticLoss: number;
  entropy: number;
  meanTph: number;
  costReductionPct: number;
  energyReductionPct: number;
  paretoOptimalityScore: number;
}

export interface ParetoSolution {
  id: string;
  policyName: string;
  algorithm: 'PPO-M-3' | 'SAC-Multi' | 'NSGA-II' | 'Baseline-FIFO';
  productivityTph: number;
  p80QualityMm: number;
  costPerTonne: number;
  energyKwhPerTonne: number;
  compositeReward: number;
  isOptimalFrontier: boolean;
  weights: { w1: number; w2: number; w3: number; w4: number };
}

export interface GanttTask {
  id: string;
  activity: string;
  agent: string;
  startMinute: number;
  durationMinutes: number;
  status: 'completed' | 'in_progress' | 'scheduled' | 'delayed';
  category: 'drill' | 'blast' | 'load' | 'haul' | 'crush';
}

export interface AnomalyAlert {
  id: string;
  timestamp: string;
  severity: 'critical' | 'warning' | 'info';
  source: string;
  message: string;
  metric: string;
  threshold: string;
  currentValue: string;
  status: 'active' | 'acknowledged' | 'resolved';
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  action: string;
  category: 'SIMULATION' | 'DRL_MODEL' | 'SECURITY' | 'CONFIG' | 'REPORT';
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'WARNING' | 'FAILED';
}

export type ViewTab = 'twin_3d' | 'scientific' | 'what_if' | 'dashboard' | 'drl_studio' | 'reports' | 'architecture' | 'security';
