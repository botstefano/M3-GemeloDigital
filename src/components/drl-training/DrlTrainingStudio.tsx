import React, { useState, useEffect } from 'react';
import { DrlPolicyMetrics, SimulationParams, UserRole } from '../../types';
import { generateTrainingHistory } from '../../utils/drlEngine';
import {
  Cpu,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Zap,
  Activity,
  Layers,
  Database,
  CheckCircle,
  TrendingUp,
  Sliders,
  ShieldAlert,
  Server,
} from 'lucide-react';

interface DrlTrainingStudioProps {
  params: SimulationParams;
  onUpdateParams: (newParams: Partial<SimulationParams>) => void;
  userRole: UserRole;
  onOpenFastApiModal?: () => void;
  isFastApiOnline?: boolean;
  fastApiLatency?: number | null;
}

export const DrlTrainingStudio: React.FC<DrlTrainingStudioProps> = ({
  params,
  onUpdateParams,
  userRole,
  onOpenFastApiModal,
  isFastApiOnline,
  fastApiLatency,
}) => {
  const [isTrainingActive, setIsTrainingActive] = useState(false);
  const [algorithm, setAlgorithm] = useState<'PPO' | 'SAC' | 'DQN'>('PPO');
  const [learningRate, setLearningRate] = useState<number>(0.0003);
  const [batchSize, setBatchSize] = useState<number>(256);
  const [gammaDiscount, setGammaDiscount] = useState<number>(0.99);
  const [trainingEpisodes, setTrainingEpisodes] = useState<DrlPolicyMetrics[]>(() => generateTrainingHistory(40));
  const [currentEpisode, setCurrentEpisode] = useState(40);
  const [deployedModelVersion, setDeployedModelVersion] = useState('PPO-M-3-v2.4-Prod');

  const isObserver = userRole === 'observer';

  // Live Gym Training Step Simulation
  useEffect(() => {
    let interval: any = null;
    if (isTrainingActive) {
      interval = setInterval(() => {
        setCurrentEpisode((prev) => {
          const nextEp = prev + 1;
          const progress = Math.min(nextEp / 120, 1.0);
          const noise = (Math.random() - 0.48) * 3.5;
          const reward = -40 + 135 / (1 + Math.exp(-6 * (progress - 0.35))) + noise;
          const actorLoss = Math.max(0.02, 1.45 * Math.exp(-3.5 * progress) + (Math.random() - 0.5) * 0.04);
          const criticLoss = Math.max(0.4, 42.0 * Math.exp(-4.2 * progress) + (Math.random() - 0.5) * 0.6);
          const entropy = Math.max(0.05, 0.85 * Math.exp(-2.2 * progress));
          const meanTph = Math.round(3600 + 1450 / (1 + Math.exp(-5 * (progress - 0.4))));

          const newMetric: DrlPolicyMetrics = {
            episode: nextEp,
            reward: Math.round(reward * 10) / 10,
            actorLoss: Math.round(actorLoss * 1000) / 1000,
            criticLoss: Math.round(criticLoss * 100) / 100,
            entropy: Math.round(entropy * 1000) / 1000,
            meanTph,
            costReductionPct: Math.round((progress * 24) * 10) / 10,
            energyReductionPct: Math.round((progress * 26) * 10) / 10,
            paretoOptimalityScore: Math.round((progress * 40 + 58) * 10) / 10,
          };

          setTrainingEpisodes((list) => [...list.slice(-50), newMetric]);
          return nextEp;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTrainingActive]);

  const handleDeployPolicy = () => {
    const newVersion = `${algorithm}-M-3-v${(currentEpisode / 10).toFixed(1)}-Deploy`;
    setDeployedModelVersion(newVersion);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-tech">
              Deep Reinforcement Learning (DRL) Pipeline Studio
            </h2>
            <p className="text-xs text-slate-400">
              Entrenamiento y optimización de políticas de despacho y control continuo de fragmentación con Ray RLlib & Stable-Baselines3.
            </p>
          </div>
        </div>

        {isObserver ? (
          <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/40 px-3.5 py-2 rounded-lg text-xs text-amber-300 font-medium">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span>Permiso de entrenamiento restringido a Ingenieros de Procesos y Administradores.</span>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            {onOpenFastApiModal && (
              <button
                onClick={onOpenFastApiModal}
                className={`px-3 py-2 rounded-lg text-xs font-mono flex items-center gap-1.5 transition-all border ${
                  isFastApiOnline
                    ? 'bg-emerald-950/40 text-emerald-400 border-emerald-800/60 hover:bg-emerald-900/40'
                    : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-cyan-400 hover:border-cyan-800'
                }`}
                title="Configurar conexión con motor FastAPI"
              >
                <Server className="w-3.5 h-3.5" />
                <span>{isFastApiOnline ? `FastAPI PyTorch: OK (${fastApiLatency}ms)` : 'Gym: Local (FastAPI)'}</span>
              </button>
            )}

            <button
              onClick={() => setIsTrainingActive(!isTrainingActive)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-lg ${
                isTrainingActive
                  ? 'bg-amber-500 text-slate-950 hover:bg-amber-400'
                  : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-purple-900/30'
              }`}
            >
              {isTrainingActive ? (
                <>
                  <Pause className="w-4 h-4 fill-current" /> Pausar Gym
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" /> Iniciar Entrenamiento DRL
                </>
              )}
            </button>
            <button
              onClick={handleDeployPolicy}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-all shadow-lg shadow-emerald-900/30"
            >
              <CheckCircle className="w-4 h-4" /> Desplegar a Producción
            </button>
          </div>
        )}
      </div>

      {/* Grid: Hyperparameters + Architecture + Live Training Graph */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Gymnasium Specs & Hyperparameters (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Gym Environment Formulation */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase font-tech">
                Espacio de Estados & Acciones (Gym Env)
              </span>
              <span className="text-[10px] font-mono text-purple-400">MineToMill-v3</span>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold text-purple-300 flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5" /> Observation Space (State Dim = 16)
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  • Geología: Factor Cunningham A, Densidad roca t/m³, Dureza (UCS).<br />
                  • Equipos: Posición (x,y,z), Disponibilidad OEE, Carga útil actual.<br />
                  • Colas: Camiones en espera por pala, Nivel tolva chancado primario.
                </p>
              </div>

              <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
                <div className="text-[11px] font-bold text-emerald-300 flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5" /> Action Space (Continuous & Discrete)
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
                  • Factor de Carga Voladura: q ∈ [0.4, 1.2] kg/m³<br />
                  • Asignación Despacho CAEX: Distribución Softmax a frentes de carguío.<br />
                  • Velocidad Perforación: ROP target controlada en tiempo real.
                </p>
              </div>
            </div>
          </div>

          {/* Hyperparameters Config */}
          <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-slate-200 uppercase font-tech">
                Configuración del Algoritmo
              </span>
              <span className="text-xs font-mono text-emerald-400">Modelo Activo: {deployedModelVersion}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-slate-400">Algoritmo:</label>
                <select
                  disabled={isObserver}
                  value={algorithm}
                  onChange={(e) => setAlgorithm(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mt-1"
                >
                  <option value="PPO">PPO (Proximal Policy Optimization)</option>
                  <option value="SAC">SAC (Soft Actor-Critic)</option>
                  <option value="DQN">DQN (Deep Q-Network)</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Learning Rate (α):</label>
                <select
                  disabled={isObserver}
                  value={learningRate}
                  onChange={(e) => setLearningRate(parseFloat(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mt-1 font-mono"
                >
                  <option value={0.0001}>1e-4</option>
                  <option value={0.0003}>3e-4 (Recomendado)</option>
                  <option value={0.001}>1e-3</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Batch Size:</label>
                <select
                  disabled={isObserver}
                  value={batchSize}
                  onChange={(e) => setBatchSize(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-200 mt-1 font-mono"
                >
                  <option value={128}>128 timesteps</option>
                  <option value={256}>256 timesteps</option>
                  <option value={512}>512 timesteps</option>
                </select>
              </div>

              <div>
                <label className="text-[11px] text-slate-400">Discount Factor (γ):</label>
                <input
                  type="text"
                  disabled
                  value="0.99"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-400 mt-1 font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Training Graphs & Neural Architecture (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Live Convergence Metrics */}
          <div className="bg-slate-900/90 p-5 rounded-xl border border-slate-800 shadow-xl flex flex-col gap-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-slate-100 font-tech">
                  Monitoreo de Entrenamiento Ray RLlib (Live TensorBoard Stream)
                </h3>
                <span className="text-[11px] text-slate-400 font-mono">
                  Episodio #{currentEpisode} | Recompensa Media:{' '}
                  <strong className="text-emerald-400">
                    {trainingEpisodes[trainingEpisodes.length - 1]?.reward} pts
                  </strong>
                </span>
              </div>
              {isTrainingActive && (
                <span className="flex items-center gap-1.5 text-xs text-purple-400 bg-purple-950/60 px-2.5 py-1 rounded-full border border-purple-800/40 animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  Entrenando Workers Paralelos (Ray 8 Cores)
                </span>
              )}
            </div>

            {/* Live Chart */}
            <div className="relative w-full h-56 bg-slate-950/80 rounded-lg p-2 border border-slate-800/80">
              <svg className="w-full h-full" viewBox="0 0 500 180">
                <line x1="40" y1="20" x2="480" y2="20" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="80" x2="480" y2="80" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="140" x2="480" y2="140" stroke="#334155" strokeDasharray="3 3" />
                <line x1="40" y1="160" x2="480" y2="160" stroke="#475569" />
                <line x1="40" y1="10" x2="40" y2="160" stroke="#475569" />

                <text x="5" y="25" fill="#94a3b8" fontSize="9">+100</text>
                <text x="12" y="85" fill="#94a3b8" fontSize="9">0</text>
                <text x="8" y="145" fill="#94a3b8" fontSize="9">-50</text>

                {/* Training Reward Curve */}
                <polyline
                  fill="none"
                  stroke="#a855f7"
                  strokeWidth="2.5"
                  points={trainingEpisodes
                    .map((d, i) => `${40 + (i / (trainingEpisodes.length - 1)) * 430},${140 - ((d.reward + 50) / 150) * 120}`)
                    .join(' ')}
                />
              </svg>
            </div>

            {/* Neural Network Architecture Blueprint */}
            <div className="bg-slate-950/60 p-3.5 rounded-lg border border-slate-800">
              <div className="text-xs font-bold text-slate-300 font-tech mb-2">
                Arquitectura de Red Neuronal Actor-Critic (Multi-Layer Perceptron):
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono text-slate-400">
                <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-center">
                  <div className="text-slate-500">Input Layer</div>
                  <div className="text-purple-400 font-bold">16 Neuronas</div>
                </div>
                <span>➔</span>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-center">
                  <div className="text-slate-500">Hidden 1 (ReLU)</div>
                  <div className="text-slate-200 font-bold">256 Neuronas</div>
                </div>
                <span>➔</span>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-center">
                  <div className="text-slate-500">Hidden 2 (ReLU)</div>
                  <div className="text-slate-200 font-bold">128 Neuronas</div>
                </div>
                <span>➔</span>
                <div className="bg-slate-900 px-2.5 py-1.5 rounded border border-slate-800 text-center">
                  <div className="text-slate-500">Actor / Critic Output</div>
                  <div className="text-emerald-400 font-bold">Softmax + V(s)</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
