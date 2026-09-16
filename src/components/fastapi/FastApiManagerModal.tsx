import React, { useState, useEffect } from 'react';
import {
  Server,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Copy,
  Check,
  Terminal,
  ExternalLink,
  Code2,
  Zap,
  Activity,
  AlertCircle,
  X,
} from 'lucide-react';
import {
  checkFastApiHealth,
  getDefaultFastApiUrl,
  setCustomFastApiUrl,
  FASTAPI_STARTER_PYTHON_CODE,
  FastApiHealthResponse,
} from '../../services/fastapiClient';

interface FastApiManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnectionStatusChange?: (isOnline: boolean, latency: number) => void;
}

export const FastApiManagerModal: React.FC<FastApiManagerModalProps> = ({
  isOpen,
  onClose,
  onConnectionStatusChange,
}) => {
  const [apiUrl, setApiUrl] = useState<string>(getDefaultFastApiUrl());
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [healthData, setHealthData] = useState<FastApiHealthResponse | null>(null);
  const [latency, setLatency] = useState<number | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'connection' | 'python_code' | 'docs'>('connection');
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const runHealthCheck = async (urlToTest?: string) => {
    setIsChecking(true);
    setErrorMessage(null);
    const target = urlToTest || apiUrl;

    const result = await checkFastApiHealth(target);
    setIsChecking(false);
    setIsOnline(result.online);
    setLatency(result.latencyMs);

    if (result.online && result.data) {
      setHealthData(result.data);
      setCustomFastApiUrl(target);
      if (onConnectionStatusChange) {
        onConnectionStatusChange(true, result.latencyMs);
      }
    } else {
      setHealthData(null);
      setErrorMessage(result.error || 'No se pudo conectar al servidor FastAPI');
      if (onConnectionStatusChange) {
        onConnectionStatusChange(false, result.latencyMs);
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      runHealthCheck();
    }
  }, [isOpen]);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(FASTAPI_STARTER_PYTHON_CODE);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0e121b] border border-[#1f293d] rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#141a29] border-b border-[#1f293d] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#00f2ff]/10 border border-[#00f2ff]/30 flex items-center justify-center text-[#00f2ff]">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white font-tech tracking-wide flex items-center gap-2">
                Conexión con Motor Personalizado (FastAPI)
                {isOnline ? (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 font-mono">
                    ONLINE ({latency}ms)
                  </span>
                ) : (
                  <span className="px-2 py-0.5 text-[10px] rounded-full bg-[#f59e0b]/20 text-[#f59e0b] border border-[#f59e0b]/40 font-mono">
                    FALLBACK LOCAL ACTIVO
                  </span>
                )}
              </h2>
              <p className="text-xs text-[#9ca3af]">
                Conecta tu propio backend en Python para ejecutar simulaciones físicas y modelos PPO/DRL.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#9ca3af] hover:text-white hover:bg-[#1f293d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-6 pt-3 bg-[#111624] border-b border-[#1f293d] flex gap-2">
          {[
            { id: 'connection', label: '1. Estado & Endpoint URL', icon: Zap },
            { id: 'python_code', label: '2. Código Python (main.py)', icon: Code2 },
            { id: 'docs', label: '3. Endpoints Soportados', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-t-lg transition-colors border-t border-x ${
                  active
                    ? 'bg-[#0e121b] text-[#00f2ff] border-[#1f293d] border-b-transparent'
                    : 'text-[#6b7280] hover:text-[#e0e2e5] border-transparent'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {/* TAB 1: CONNECTION */}
          {activeTab === 'connection' && (
            <div className="space-y-5">
              {/* Connection Form */}
              <div className="bg-[#141a29] p-4 rounded-xl border border-[#1f293d] space-y-3">
                <label className="block text-xs font-bold text-[#e0e2e5] uppercase tracking-wider font-mono">
                  URL Base de tu API FastAPI:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="http://localhost:8000 o https://tu-api.railway.app"
                    className="flex-1 px-3.5 py-2 bg-[#090c14] border border-[#1f293d] rounded-lg text-sm text-white font-mono focus:outline-none focus:border-[#00f2ff] transition-colors"
                  />
                  <button
                    onClick={() => runHealthCheck()}
                    disabled={isChecking}
                    className="px-4 py-2 bg-[#00f2ff] text-[#050811] font-bold text-xs rounded-lg hover:bg-[#00d0db] transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isChecking ? 'animate-spin' : ''}`} />
                    Probar Conexión
                  </button>
                </div>
                <div className="text-[11px] text-[#6b7280] flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-[#00f2ff]" />
                  Asegúrate de que tu servidor tenga configurado el middleware de <b>CORS</b> para aceptar peticiones
                  desde el navegador.
                </div>
              </div>

              {/* Status Display Card */}
              <div
                className={`p-4 rounded-xl border ${
                  isOnline
                    ? 'bg-[#10b981]/10 border-[#10b981]/30 text-[#10b981]'
                    : 'bg-[#f59e0b]/10 border-[#f59e0b]/30 text-[#f59e0b]'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isOnline ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" />
                  )}
                  <div className="flex-1 text-xs">
                    <div className="font-bold text-sm">
                      {isOnline
                        ? '¡Conectado exitosamente al motor FastAPI!'
                        : 'Modo Local (Simulación y DRL en Cliente)'}
                    </div>
                    <div className="mt-1 text-[#d1d5db]">
                      {isOnline ? (
                        <div className="space-y-1 mt-2">
                          <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
                            <div>
                              <b>Motor detectado:</b> {healthData?.engine || 'FastAPI Custom Engine'}
                            </div>
                            <div>
                              <b>Latencia RTT:</b> {latency} ms
                            </div>
                            <div>
                              <b>Modelo DRL:</b> {healthData?.drl_model_loaded || 'PPO Activo'}
                            </div>
                            <div>
                              <b>Versión:</b> {healthData?.version || '1.0.0'}
                            </div>
                          </div>
                          <p className="text-[11px] text-[#10b981] pt-1">
                            Las optimizaciones What-If y los pasos DRL se calcularán directamente en tu backend Python.
                          </p>
                        </div>
                      ) : (
                        <div>
                          <p>
                            El frontend sigue funcionando al 100% con los modelos matemáticos analíticos de Kuz-Ram y
                            algoritmos locales. Cuando levantes tu servidor en{' '}
                            <code className="text-[#00f2ff] font-mono">{apiUrl}</code>, haz clic en "Probar Conexión"
                            para sincronizarlo.
                          </p>
                          {errorMessage && (
                            <div className="mt-2 p-2 bg-[#090c14] rounded border border-red-900/40 text-red-400 font-mono text-[11px]">
                              Detalle: {errorMessage}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: PYTHON STARTER CODE */}
          {activeTab === 'python_code' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white font-mono">Archivo Python listo para ejecutar (main.py):</h3>
                  <p className="text-[11px] text-[#6b7280]">
                    Contiene la fórmula Kuz-Ram, recompensa DRL y CORS preconfigurados.
                  </p>
                </div>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-[#1f293d] hover:bg-[#2b3852] text-[#00f2ff] text-xs font-mono rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10b981]" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedCode ? 'Copiado!' : 'Copiar Código'}
                </button>
              </div>

              {/* Instructions Bar */}
              <div className="p-3 bg-[#090c14] border border-[#1f293d] rounded-lg font-mono text-[11px] text-[#9ca3af] space-y-1">
                <div className="text-[#00f2ff] font-bold">Comandos para iniciar en tu máquina:</div>
                <div className="text-white">1. pip install fastapi uvicorn pydantic numpy scipy</div>
                <div className="text-white">2. uvicorn main:app --reload --port 8000</div>
              </div>

              {/* Code Viewer */}
              <pre className="p-4 bg-[#090c14] border border-[#1f293d] rounded-xl text-[11px] font-mono text-[#00f2ff]/90 overflow-x-auto max-h-72 leading-relaxed">
                {FASTAPI_STARTER_PYTHON_CODE}
              </pre>
            </div>
          )}

          {/* TAB 3: API ENDPOINTS DOCS */}
          {activeTab === 'docs' && (
            <div className="space-y-3 text-xs font-mono">
              <div className="p-3 bg-[#141a29] rounded-xl border border-[#1f293d]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    GET
                  </span>
                  <span className="text-white font-bold">/api/v1/health</span>
                </div>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  Comprobación de estado y versión del motor de simulación.
                </p>
              </div>

              <div className="p-3 bg-[#141a29] rounded-xl border border-[#1f293d]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                    POST
                  </span>
                  <span className="text-white font-bold">/api/v1/what-if/recalculate</span>
                </div>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  Recibe parámetros de roca, malla de voladura y despacho, y retorna la curva Rosin-Rammler, $P_{80}$, y
                  score de recompensa DRL.
                </p>
              </div>

              <div className="p-3 bg-[#141a29] rounded-xl border border-[#1f293d]">
                <div className="flex items-center gap-2">
                  <span className="px-1.5 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 font-bold">
                    POST
                  </span>
                  <span className="text-white font-bold">/api/v1/drl/recommend</span>
                </div>
                <p className="mt-1 text-[11px] text-[#9ca3af]">
                  Consulta la política de Deep Reinforcement Learning para obtener la acción de despacho óptima.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#141a29] border-t border-[#1f293d] flex items-center justify-between">
          <div className="text-[11px] text-[#6b7280] font-mono">
            Configurable vía <code className="text-[#00f2ff]">.env (VITE_FASTAPI_URL)</code> o en este panel.
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#1f293d] hover:bg-[#2b3852] text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
