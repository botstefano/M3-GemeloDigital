import React, { useState } from 'react';
import {
  Server,
  Database,
  FolderTree,
  Network,
  Cpu,
  Calendar,
  Layers,
  Terminal,
  Code2,
  CheckCircle,
  Copy,
  ChevronDown,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

export const ArchitectureDeliverables: React.FC = () => {
  const [activeDeliverable, setActiveDeliverable] = useState<number>(1);
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2500);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Header Banner */}
      <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-xl border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Server className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-tech">
              Entregables Arquitectónicos del Sistema M-3 Digital Twin
            </h2>
            <p className="text-xs text-slate-400">
              Documentación técnica y blueprints de ingeniería para el ciclo Drill-Blast-Load-Haul (Entregables 1 al 8).
            </p>
          </div>
        </div>
      </div>

      {/* Deliverables Tab Selector */}
      <div className="flex flex-wrap gap-2">
        {[
          { id: 1, label: '1. Arquitectura de Alto Nivel', icon: Network },
          { id: 2, label: '2. Modelo de Datos (ERD)', icon: Database },
          { id: 3, label: '3. Estructura de Carpetas', icon: FolderTree },
          { id: 4, label: '4. Endpoints API (FastAPI)', icon: Terminal },
          { id: 5, label: '5. Componentes Frontend', icon: Layers },
          { id: 6, label: '6. Pipeline DRL / ABM', icon: Cpu },
          { id: 7, label: '7. Plan de Implementación', icon: Calendar },
          { id: 8, label: '8. DevOps & Producción', icon: Code2 },
        ].map((item) => {
          const Icon = item.icon;
          const isActive = activeDeliverable === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveDeliverable(item.id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold font-tech uppercase tracking-wide flex items-center gap-2 transition-all ${
                isActive
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Content Container */}
      <div className="bg-slate-900/90 p-6 rounded-xl border border-slate-800 shadow-xl">
        {/* Deliverable 1: High-Level Architecture */}
        {activeDeliverable === 1 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  1. Arquitectura de Alto Nivel & Flujo de Datos Distribuido
                </h3>
                <p className="text-xs text-slate-400">
                  Arquitectura desacoplada en microservicios dirigida por eventos (Event-Driven / CQRS) para simulación en tiempo real y optimización DRL.
                </p>
              </div>
            </div>

            {/* Architecture ASCII / Visual Diagram */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-[11px] text-amber-300">
{`
+---------------------------------------------------------------------------------------------------+
|                                      CAPA DE PRESENTACIÓN (CLIENTE)                               |
|  +---------------------------------------------------------------------------------------------+  |
|  |  Next.js 14+ (App Router) + React 19 + Tailwind CSS + Three.js / WebGL 3D Mining Engine     |  |
|  |  • Canvas 3D Tajo Abierto (Bancos, Camiones CAEX, Palas, Perforadoras, Detonación Kuz-Ram)  |  |
|  |  • HUD Telemetría Tiempo Real • What-If Sandbox • Matriz Pareto • Reportes PDF/Excel/GeoJSON |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------|-----------------------------------------------+
                                                    | (HTTPS / WSS WebSockets)
                                                    v
+---------------------------------------------------|-----------------------------------------------+
|                                API GATEWAY & SERVICIOS CORE (BACKEND)                             |
|  +---------------------------------------------------------------------------------------------+  |
|  |  FastAPI 0.100+ (Python 3.11) + Uvicorn ASGI                                                |  |
|  |  • Auth JWT OAuth2 (RBAC / ABAC)    • Endpoints REST /api/v1 (Simulación, What-If, Reportes) |  |
|  |  • WebSockets Manager (/ws/stream) • Rate Limiting & Audit Logger Inmutable                 |  |
|  +-----------------------------------+---------------------------------------------------------+  |
+--------------------------------------|------------------------------------------------------------+
                                       |
                   +-------------------+-------------------+
                   | (Task Queue / PubSub)                 | (SQL / GeoQueries)
                   v                                       v
+--------------------------------------+   +--------------------------------------------------------+
|       COLA Y WORKERS ASÍNCRONOS      |   |            PERSISTENCIA & BASE DE DATOS                |
|  +--------------------------------+  |   |  +--------------------------------------------------+  |
|  |  Redis 7+                      |  |   |  |  PostgreSQL 15+ con PostGIS                      |  |
|  |  • Broker de Mensajes          |  |   |  |  • Tablas Normalizadas 3NF                      |  |
|  |  • Cache de Estado Agentes     |  |   |  |  • Índices Espaciales GIST (Rutas & Polígonos)   |  |
|  +--------------------------------+  |   |  |  • Particionado TimescaleDB para Telemetría IoT   |  |
|  +--------------------------------+  |   |  +--------------------------------------------------+  |
|  |  Celery 5.3+ Workers           |  |   +--------------------------------------------------------+
|  |  • Motor ABM (Mesa Framework)  |  |
|  |  • Generador PDF (WeasyPrint)  |  |
|  |  • Generador Excel (openpyxl)  |  |
|  +--------------------------------+  |
+------------------|-------------------+
                   |
                   v
+---------------------------------------------------------------------------------------------------+
|                                 MOTOR DE OPTIMIZACIÓN DRL (RAY RLLIB)                             |
|  +---------------------------------------------------------------------------------------------+  |
|  |  Ray 2.9+ Cluster / Stable-Baselines3 (Python)                                              |  |
|  |  • Gymnasium Environment (MineToMill-v3)                                                    |  |
|  |  • Algoritmos: PPO (Continuous Dispatch & ROP) + SAC (Multi-Objective Energy Optimization)   |  |
|  |  • Recompensa Multi-Objetivo F(z) = w1·Prod + w2·Calidad - w3·Costo - w4·Energía             |  |
|  |  • Algoritmo Genético NSGA-II para cálculo del Frente de Pareto de soluciones no dominadas |  |
|  |  • MLflow Model Registry para Versionado y Despliegue en Caliente                           |  |
|  +---------------------------------------------------------------------------------------------+  |
+---------------------------------------------------------------------------------------------------+
`}
              </pre>
            </div>
          </div>
        )}

        {/* Deliverable 2: Data Model (ERD) */}
        {activeDeliverable === 2 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  2. Modelo de Datos Normalizado (PostgreSQL 15 + PostGIS)
                </h3>
                <p className="text-xs text-slate-400">
                  Esquema relacional en Tercera Forma Normal (3NF) con soporte geoespacial PostGIS y series de tiempo optimizadas.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Table: users & roles */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 font-mono mb-2">TABLE users & roles</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`CREATE TABLE roles (
  id VARCHAR(32) PRIMARY KEY,
  name VARCHAR(64) NOT NULL,
  description TEXT,
  permissions JSONB NOT NULL
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  role_id VARCHAR(32) REFERENCES roles(id),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(128) NOT NULL,
  department VARCHAR(128),
  is_2fa_enabled BOOLEAN DEFAULT FALSE,
  totp_secret VARCHAR(64),
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);`}
                </pre>
              </div>

              {/* Table: simulation_runs */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 font-mono mb-2">TABLE simulation_runs</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`CREATE TABLE simulation_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES users(id),
  scenario_name VARCHAR(128) NOT NULL,
  is_what_if BOOLEAN DEFAULT FALSE,
  dispatch_policy VARCHAR(64) NOT NULL,
  powder_factor_kg_m3 NUMERIC(5,3),
  target_tph INT NOT NULL,
  total_tonnes_moved NUMERIC(10,2),
  unit_cost_usd_t NUMERIC(6,2),
  specific_energy_kwh_t NUMERIC(6,2),
  current_p80_mm NUMERIC(6,1),
  drl_composite_reward NUMERIC(6,2),
  status VARCHAR(32) NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);`}
                </pre>
              </div>

              {/* Table: blast_polygons (PostGIS) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-emerald-400 font-mono mb-2">TABLE blast_polygons (PostGIS)</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`CREATE TABLE blast_polygons (
  id VARCHAR(64) PRIMARY KEY,
  simulation_run_id UUID REFERENCES simulation_runs(id),
  name VARCHAR(128) NOT NULL,
  bench_elevation_m NUMERIC(7,2) NOT NULL,
  geom GEOMETRY(PolygonZ, 4326),
  burden_m NUMERIC(4,2),
  spacing_m NUMERIC(4,2),
  hole_diameter_mm INT,
  powder_factor_kg_m3 NUMERIC(4,2),
  explosive_type VARCHAR(32),
  rock_factor_a NUMERIC(4,2),
  p50_mm NUMERIC(6,1),
  p80_mm NUMERIC(6,1),
  uniformity_index_n NUMERIC(4,2),
  fines_pct NUMERIC(4,1),
  boulders_pct NUMERIC(4,1),
  is_detonated BOOLEAN DEFAULT FALSE
);
CREATE INDEX idx_blast_geom ON blast_polygons USING GIST (geom);`}
                </pre>
              </div>

              {/* Table: agent_telemetry_logs (TimescaleDB) */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 font-mono mb-2">TABLE agent_telemetry_logs</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`CREATE TABLE agent_telemetry_logs (
  time TIMESTAMPTZ NOT NULL,
  simulation_run_id UUID,
  agent_id VARCHAR(64) NOT NULL,
  agent_type VARCHAR(32) NOT NULL,
  status VARCHAR(32) NOT NULL,
  location GEOMETRY(PointZ, 4326),
  payload_tonnes NUMERIC(6,2),
  speed_kmh NUMERIC(5,2),
  fuel_rate_l_h NUMERIC(6,2),
  power_kw NUMERIC(8,2),
  tire_temp_c NUMERIC(5,1)
);
SELECT create_hypertable('agent_telemetry_logs', 'time');`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Deliverable 3: Project Folder Structure */}
        {activeDeliverable === 3 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  3. Estructura de Carpetas del Proyecto (Domain-Driven Design)
                </h3>
                <p className="text-xs text-slate-400">
                  Separación clara por dominios limpios para FastAPI Backend y Next.js Frontend.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Backend Structure */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-amber-400 font-mono mb-2">📁 BACKEND (Python FastAPI)</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`backend/
├── app/
│   ├── api/
│   │   ├── v1/
│   │   │   ├── endpoints/
│   │   │   │   ├── auth.py         # OAuth2 JWT login & 2FA
│   │   │   │   ├── simulation.py   # ABM lifecycle controls
│   │   │   │   ├── what_if.py      # Scenario recalculations
│   │   │   │   ├── drl.py          # Policy training & deployment
│   │   │   │   ├── reports.py      # PDF/Excel/Word generation
│   │   │   │   └── audit.py        # Audit trail logs
│   │   │   └── router.py
│   │   └── websockets/
│   │       └── stream.py           # Real-time telemetry pub/sub
│   ├── core/
│   │   ├── config.py               # Env vars & DB settings
│   │   ├── security.py             # Password hashing & JWT
│   │   └── permissions.py          # RBAC / ABAC guards
│   ├── db/
│   │   ├── session.py              # Async SQLAlchemy engine
│   │   └── models/                 # ORM entities (Users, Sim)
│   ├── domain/
│   │   ├── abm/                    # Mesa simulation agents
│   │   │   ├── drill_agent.py
│   │   │   ├── shovel_agent.py
│   │   │   ├── truck_agent.py
│   │   │   └── pit_model.py
│   │   ├── kuz_ram/                # Fragmentation mathematics
│   │   └── drl/                    # Ray RLlib Gym & Policies
│   └── workers/
│       ├── celery_app.py
│       └── tasks/                  # Long-running jobs (PDF/Gym)
├── tests/
├── Dockerfile
└── requirements.txt`}
                </pre>
              </div>

              {/* Frontend Structure */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs font-bold text-cyan-400 font-mono mb-2">📁 FRONTEND (Next.js / React)</div>
                <pre className="text-[11px] text-slate-300 font-mono leading-relaxed">
{`frontend/
├── src/
│   ├── app/                        # Next.js 14 App Router
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Main Twin View
│   │   ├── what-if/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── drl-studio/page.tsx
│   │   └── reports/page.tsx
│   ├── components/
│   │   ├── digital-twin/           # Three.js 3D Viewport & HUD
│   │   ├── dashboard/              # Pareto scatter, Gantt, KPIs
│   │   ├── what-if/                # Parameter sliders & Scorecard
│   │   ├── reports/                # Report generator & Scheduler
│   │   └── security/               # RBAC switcher & Audit trail
│   ├── hooks/
│   │   ├── useSimulationStream.ts  # WebSocket live agent states
│   │   └── useKuzRam.ts            # Reactive fragmentation calc
│   ├── services/
│   │   ├── api.ts                  # Axios HTTP client
│   │   └── exportService.ts        # jsPDF & SheetJS export
│   └── types/                      # Global TypeScript interfaces
├── public/assets/3d/               # Blender GLTF mining assets
├── package.json
└── tailwind.config.js`}
                </pre>
              </div>
            </div>
          </div>
        )}

        {/* Deliverable 4: FastAPI Endpoints */}
        {activeDeliverable === 4 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  4. Endpoints API Principales (FastAPI 0.100+ OpenAPI Catalog)
                </h3>
                <p className="text-xs text-slate-400">
                  Especificación de rutas REST y WebSockets con métodos, payloads y respuestas tipadas.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {/* POST /api/v1/simulation/start */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                    POST
                  </span>
                  <span className="text-slate-100 font-bold">/api/v1/simulation/run</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Control de Simulación ABM</span>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div>
                    <div className="text-slate-400 mb-1">Payload Entrada:</div>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
{`{
  "simulation_speed": 1.0,
  "drill_count": 3,
  "truck_count": 8,
  "dispatch_policy": "drl_ppo_agent",
  "powder_factor_kg_m3": 0.78
}`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Respuesta (200 OK):</div>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">
{`{
  "run_id": "8f3b2a19-...",
  "status": "RUNNING",
  "ws_channel": "ws://api/ws/stream/8f3b2a19",
  "initial_tph": 4920
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* POST /api/v1/what-if/recalculate */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-blue-950 text-blue-400 border border-blue-800 font-bold">
                    POST
                  </span>
                  <span className="text-slate-100 font-bold">/api/v1/what-if/recalculate</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Kuz-Ram & Mine-to-Mill Scorecard</span>
                </div>
                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3 font-mono text-[11px]">
                  <div>
                    <div className="text-slate-400 mb-1">Payload Entrada:</div>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-slate-300">
{`{
  "burden_m": 6.5,
  "spacing_m": 7.5,
  "powder_factor_kg_m3": 0.78,
  "explosive_type": "Heavy_Emulsion",
  "drl_weights": { "w1": 0.35, "w2": 0.25, "w3": 0.20, "w4": 0.20 }
}`}
                    </pre>
                  </div>
                  <div>
                    <div className="text-slate-400 mb-1">Respuesta (200 OK):</div>
                    <pre className="p-2 bg-slate-900 rounded border border-slate-800 text-emerald-300">
{`{
  "p50_mm": 94.2,
  "p80_mm": 154.0,
  "sag_energy_kwh_t": 6.85,
  "sag_energy_savings_pct": 18.2,
  "prospective_tph": 4980,
  "composite_reward": 94.6
}`}
                    </pre>
                  </div>
                </div>
              </div>

              {/* GET /api/v1/drl/pareto-frontier */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="flex items-center gap-2 font-mono">
                  <span className="px-2 py-0.5 rounded bg-purple-950 text-purple-400 border border-purple-800 font-bold">
                    GET
                  </span>
                  <span className="text-slate-100 font-bold">/api/v1/drl/pareto-frontier</span>
                  <span className="text-slate-400 text-[11px] ml-auto">Soluciones No Dominadas Multi-Objetivo</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Deliverable 5: Frontend Architecture */}
        {activeDeliverable === 5 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  5. Componentes Clave del Frontend & Gestión de Estado
                </h3>
                <p className="text-xs text-slate-400">
                  Arquitectura reactiva con Three.js WebGL, stores desacoplados y hooks de sincronización en tiempo real.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-amber-400 font-tech mb-2">1. Visualización ThreeMineScene</div>
                <p className="text-slate-300 leading-relaxed">
                  Renderiza el tajo procedural con mallas de perforadoras, palas articuladas, camiones CAEX con física en rampas y detonaciones Kuz-Ram a 60 FPS con ResizeObserver reactivo.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-cyan-400 font-tech mb-2">2. WhatIfStudio & KuzRam Engine</div>
                <p className="text-slate-300 leading-relaxed">
                  Calcula de forma determinista la distribución Rosin-Rammler, diggability score y acople energético Mine-to-Mill permitiendo al operador comparar deltas antes de aplicar al gemelo.
                </p>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="font-bold text-purple-400 font-tech mb-2">3. Pareto Explorer & DRL Lab</div>
                <p className="text-slate-300 leading-relaxed">
                  Permite explorar soluciones multi-objetivo no dominadas, ajustar ponderaciones ($w_1, w_2, w_3, w_4$) y monitorear el entrenamiento de políticas PPO/SAC en tiempo real.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Deliverable 6: DRL Pipeline */}
        {activeDeliverable === 6 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  6. Pipeline de Entrenamiento DRL (Mine-to-Mill Reinforcement Learning)
                </h3>
                <p className="text-xs text-slate-400">
                  Flujo de datos end-to-end: Simulación ABM $\rightarrow$ Gymnasium Env $\rightarrow$ Ray RLlib $\rightarrow$ Pareto Evaluation $\rightarrow$ MLflow Registry.
                </p>
              </div>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300 overflow-x-auto leading-relaxed">
              <pre className="text-[11px] text-cyan-300">
{`
+----------------------------------------------------------------------------------------------------+
|                                     PIPELINE DE ENTRENAMIENTO DRL                                  |
|                                                                                                    |
|   1. SIMULACIÓN ABM         2. GYM ENVIRONMENT         3. RAY RLLIB WORKERS       4. EVALUADOR     |
|   [Mesa Framework]        [MineToMill-v3 Env]          [Parallel PPO / SAC]      [Pareto NSGA-II]  |
|   • Estado Perforadoras   • Obs Space: (16 dim)        • Policy Gradient Loss    • No-Dominated    |
|   • Voladura Kuz-Ram      • Action: [q, ROP, Softmax]  • Advantage Estimation    • Weight Vector   |
|   • Colas Palas / CAEX    • Step Reward F(z)           • Value Loss Network      • Trade-off Curve |
|          |                         |                            |                        |         |
|          v                         v                            v                        v         |
|   +--------------+        +-----------------+          +------------------+     +---------------+  |
|   |  Muckpile    |------->|   Recompensa    |--------->|  Actualización   |---->|  Validación   |  |
|   |  Telemetry   |        |   Multi-Obj     |          |  Pesos Neuronal  |     |  en Sandbox   |  |
|   +--------------+        +-----------------+          +------------------+     +---------------+  |
|                                                                                          |         |
|   5. REGISTRO & DESPLIEGUE                                                               v         |
|   +----------------------------------------------------------------------------------------------+ |
|   | MLflow Model Registry -> Tag: Production -> Despacho en Caliente al Gemelo Digital 3D        | |
|   +----------------------------------------------------------------------------------------------+ |
+----------------------------------------------------------------------------------------------------+
`}
              </pre>
            </div>
          </div>
        )}

        {/* Deliverable 7: Implementation Roadmap */}
        {activeDeliverable === 7 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  7. Plan Maestro de Implementación (Hitos Semanales & Fases)
                </h3>
                <p className="text-xs text-slate-400">
                  Cronograma estructurado en 6 fases para entrega de producción en 24 semanas.
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {[
                { phase: 'Fase 1 (Semanas 1-4)', title: 'Diseño Arquitectónico & Modelo Físico Kuz-Ram', desc: 'Validación matemática de fórmulas Cunningham, esquema PostgreSQL/PostGIS e ingesta de datos históricos mina.' },
                { phase: 'Fase 2 (Semanas 5-8)', title: 'Motor ABM & Gemelo Digital 3D (Three.js)', desc: 'Desarrollo de agentes Mesa (Drill, Blast, Load, Haul), viewport WebGL interactivo y WebSocket live streaming.' },
                { phase: 'Fase 3 (Semanas 9-14)', title: 'Integración DRL (Ray RLlib) & Multi-Objetivo', desc: 'Entrenamiento de agentes PPO/SAC en clúster Ray, cálculo de frente de Pareto y optimizador de despacho en caliente.' },
                { phase: 'Fase 4 (Semanas 15-18)', title: 'Módulos de Analítica, What-If & Reportes', desc: 'Dashboard de KPIs, Gantt interactivo, generador de PDF ejecutivo WeasyPrint y programación SMTP.' },
                { phase: 'Fase 5 (Semanas 19-21)', title: 'Seguridad RBAC, Auditoría & Pruebas E2E', desc: 'Autenticación 2FA, matriz de roles, pruebas de carga (>100 agentes simultáneos a 60 FPS) y penetración.' },
                { phase: 'Fase 6 (Semanas 22-24)', title: 'Despliegue Productivo K8s & Monitoreo IoT', desc: 'Orquestación Helm en Kubernetes, observabilidad Prometheus/Grafana y puesta en marcha con telemetría de campo.' },
              ].map((item, idx) => (
                <div key={idx} className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="font-mono text-amber-400 font-bold">{item.phase}:</span>{' '}
                    <strong className="text-slate-100">{item.title}</strong>
                    <p className="text-slate-400 text-[11px] mt-0.5">{item.desc}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-slate-900 border border-slate-700 text-slate-300 font-mono text-[10px] whitespace-nowrap self-start sm:self-center">
                    Entregable Validado
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Deliverable 8: DevOps & Production */}
        {activeDeliverable === 8 && (
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base font-bold text-slate-100 font-tech">
                  8. Recomendaciones DevOps, Kubernetes & Monitoreo
                </h3>
                <p className="text-xs text-slate-400">
                  Infraestructura como código (IaC), manifiestos Docker Compose, Helm K8s y observabilidad Prometheus/Grafana.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-amber-400 font-bold mb-2">docker-compose.production.yml</div>
                <pre className="text-[11px] text-slate-300 leading-relaxed overflow-x-auto">
{`version: '3.8'
services:
  api-gateway:
    build: ./backend
    ports: ["8000:8000"]
    environment:
      - DATABASE_URL=postgresql://user:pass@postgres:5432/m3_twin
      - REDIS_URL=redis://redis:6379/0
    depends_on: [postgres, redis]

  celery-abm-worker:
    build: ./backend
    command: celery -A app.workers.celery_app worker -Q abm_sim -c 8
    depends_on: [redis]

  ray-head:
    image: rayproject/ray:2.9.0-py311
    ports: ["8265:8265", "6379:6379"]
    command: ray start --head --dashboard-host=0.0.0.0

  postgres:
    image: postgis/postgis:15-3.3
    volumes: [pgdata:/var/lib/postgresql/data]
    ports: ["5432:5432"]

  redis:
    image: redis:7-alpine
    ports: ["6379:6379"]`}
                </pre>
              </div>

              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-cyan-400 font-bold mb-2">Estrategia de Backup & Métricas Prometheus</div>
                <div className="text-[11px] text-slate-300 font-sans leading-relaxed space-y-2">
                  <p>
                    <strong>• Respaldos Continuos (PITR):</strong> PostgreSQL WAL-G archivando segmentos cada 15 min hacia almacenamiento en la nube (S3/GCS) con retención de 30 días.
                  </p>
                  <p>
                    <strong>• Monitoreo & SLOs:</strong> Prometheus exponiendo métricas de latencia de simulación (p95 &lt; 200ms), FPS de cliente WebGL, uso de GPU en inferencia DRL y colas Celery.
                  </p>
                  <p>
                    <strong>• Escalabilidad K8s:</strong> HPA (Horizontal Pod Autoscaler) escalando workers de simulación ABM en función de la carga de escenarios What-If concurrentes.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
