import { SimulationParams, SimulationKPIs, BlastZone, DrlPolicyMetrics } from '../types';
import { calculateKuzRam } from '../utils/kuzRam';
import { calculateMultiObjectiveReward } from '../utils/drlEngine';

// Local storage key for persisting custom endpoint URL
const FASTAPI_URL_STORAGE_KEY = 'm3_fastapi_custom_url';

export const getDefaultFastApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(FASTAPI_URL_STORAGE_KEY);
    if (saved) return saved;
  }
  return (import.meta as any).env?.VITE_FASTAPI_URL || 'http://localhost:8000';
};

export const setCustomFastApiUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(FASTAPI_URL_STORAGE_KEY, url);
  }
};

export interface FastApiHealthResponse {
  status: 'healthy' | 'ok' | 'degraded';
  version: string;
  engine: string;
  uptime_seconds?: number;
  drl_model_loaded?: string;
  gpu_available?: boolean;
}

export interface WhatIfFastApiRequest {
  burden_m: number;
  spacing_m: number;
  powder_factor_kg_m3: number;
  explosive_type: string;
  rock_mass_factor_a: number;
  bench_height_m: number;
  hole_diameter_mm: number;
  stemming_m: number;
  truck_count: number;
  target_tph: number;
  truck_dispatch_policy: string;
  drl_weights: {
    w1_productivity: number;
    w2_quality: number;
    w3_cost: number;
    w4_energy: number;
  };
}

export interface WhatIfFastApiResponse {
  p50_mm: number;
  p80_mm: number;
  uniformity_index_n: number;
  fines_percent: number;
  boulders_percent: number;
  optimum_diggability_score: number;
  sag_energy_kwh_t: number;
  sag_energy_savings_pct: number;
  prospective_tph: number;
  prospective_cost_usd_t: number;
  prospective_energy_kwh_t: number;
  composite_reward: number;
  reward_components: {
    prod: number;
    qual: number;
    cost: number;
    energy: number;
  };
  calculated_by: 'fastapi_python_engine' | 'local_fallback_engine';
  latency_ms: number;
}

export interface DrlFastApiStepRequest {
  algorithm: 'PPO' | 'SAC' | 'DQN';
  episode: number;
  learning_rate: number;
  batch_size: number;
  gamma: number;
  current_params: SimulationParams;
}

export interface DrlFastApiStepResponse {
  metric: DrlPolicyMetrics;
  recommended_actions: {
    optimal_powder_factor: number;
    recommended_tph: number;
    dispatch_weights: { w1: number; w2: number; w3: number; w4: number };
  };
  calculated_by: 'fastapi_python_engine' | 'local_fallback_engine';
  latency_ms: number;
}

/**
 * Check if the FastAPI server is reachable
 */
export async function checkFastApiHealth(baseUrl?: string): Promise<{
  online: boolean;
  data?: FastApiHealthResponse;
  latencyMs: number;
  error?: string;
}> {
  const url = (baseUrl || getDefaultFastApiUrl()).replace(/\/$/, '');
  const startTime = performance.now();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const response = await fetch(`${url}/api/v1/health`, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal,
    }).catch(async () => {
      // Fallback probe to root /health or /
      return fetch(`${url}/health`, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (response && response.ok) {
      const data = await response.json();
      return { online: true, data, latencyMs };
    }

    return {
      online: false,
      latencyMs,
      error: response ? `HTTP ${response.status}: ${response.statusText}` : 'Servidor inaccesible',
    };
  } catch (err: any) {
    const latencyMs = Math.round(performance.now() - startTime);
    return {
      online: false,
      latencyMs,
      error: err.name === 'AbortError' ? 'Tiempo de espera agotado (2.5s)' : (err.message || 'Error de conexión CORS o red'),
    };
  }
}

/**
 * Execute What-If & Kuz-Ram calculations via FastAPI backend with client-side fallback
 */
export async function calculateWhatIfWithEngine(
  params: SimulationParams,
  blast: BlastZone,
  customBaseUrl?: string
): Promise<WhatIfFastApiResponse> {
  const url = (customBaseUrl || getDefaultFastApiUrl()).replace(/\/$/, '');
  const startTime = performance.now();

  const payload: WhatIfFastApiRequest = {
    burden_m: blast.burdenM,
    spacing_m: blast.spacingM,
    powder_factor_kg_m3: blast.powderFactorKgM3,
    explosive_type: blast.explosiveType,
    rock_mass_factor_a: blast.rockMassFactorA,
    bench_height_m: blast.benchHeightM,
    hole_diameter_mm: blast.holeDiameterMm,
    stemming_m: blast.stemmingM,
    truck_count: params.truckCount,
    target_tph: params.targetTph,
    truck_dispatch_policy: params.truckDispatchPolicy,
    drl_weights: params.drlWeights,
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const response = await fetch(`${url}/api/v1/what-if/recalculate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
    const latencyMs = Math.round(performance.now() - startTime);

    if (response.ok) {
      const data = await response.json();
      return {
        ...data,
        calculated_by: 'fastapi_python_engine',
        latency_ms: latencyMs,
      };
    }
  } catch (_err) {
    // Graceful fallback to client calculation
  }

  // Local calculation fallback
  const latencyMs = Math.round(performance.now() - startTime);
  const localKuzRam = calculateKuzRam({
    burdenM: blast.burdenM,
    spacingM: blast.spacingM,
    holeDiameterMm: blast.holeDiameterMm,
    benchHeightM: blast.benchHeightM,
    stemmingM: blast.stemmingM,
    powderFactorKgM3: blast.powderFactorKgM3,
    explosiveType: blast.explosiveType,
    rockMassFactorA: blast.rockMassFactorA,
  });

  const prospectiveTph = Math.round(
    params.targetTph *
      (params.truckCount / 8) *
      (params.truckDispatchPolicy.includes('drl') ? 1.12 : 0.94) *
      (localKuzRam.optimumDiggabilityScore / 80)
  );

  const prospectiveCost =
    Math.round((4.85 * (0.75 + (blast.powderFactorKgM3 / 0.78) * 0.15) * (8 / params.truckCount) ** 0.15) * 100) / 100;

  const prospectiveEnergy = Math.round((localKuzRam.estimatedSagMillKwhPerTonne + 2.5) * 100) / 100;

  const rewardObj = calculateMultiObjectiveReward(
    prospectiveTph,
    localKuzRam.p80Mm,
    prospectiveCost,
    prospectiveEnergy,
    params.drlWeights
  );

  return {
    p50_mm: localKuzRam.meanSizeXmMm,
    p80_mm: localKuzRam.p80Mm,
    uniformity_index_n: localKuzRam.uniformityIndexN,
    fines_percent: localKuzRam.finesPercentUnder25mm,
    boulders_percent: localKuzRam.bouldersPercentOver600mm,
    optimum_diggability_score: localKuzRam.optimumDiggabilityScore,
    sag_energy_kwh_t: localKuzRam.estimatedSagMillKwhPerTonne,
    sag_energy_savings_pct: localKuzRam.energySavingPercentage,
    prospective_tph: prospectiveTph,
    prospective_cost_usd_t: prospectiveCost,
    prospective_energy_kwh_t: prospectiveEnergy,
    composite_reward: rewardObj.totalReward,
    reward_components: rewardObj.components,
    calculated_by: 'local_fallback_engine',
    latency_ms: latencyMs,
  };
}

/**
 * Complete Python FastAPI Starter Script for the user to run directly
 */
export const FASTAPI_STARTER_PYTHON_CODE = `"""
M-3 DIGITAL TWIN - PYTHON FASTAPI MOTOR BACKEND
================================================
Instalación:
    pip install fastapi uvicorn pydantic numpy scipy

Ejecución:
    uvicorn main:app --reload --port 8000
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import numpy as np
import math
import time

app = FastAPI(
    title="M-3 Mine-to-Mill Optimization & ABM Engine",
    description="Motor de simulación física Kuz-Ram, Despacho ABM y Políticas DRL (PPO)",
    version="1.0.0"
)

# Permitir CORS para conexión directa desde el frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

START_TIME = time.time()

# -------------------------------------------------------------
# MODELOS DE DATOS (PYDANTIC)
# -------------------------------------------------------------
class DrlWeights(BaseModel):
    w1_productivity: float = 0.35
    w2_quality: float = 0.25
    w3_cost: float = 0.20
    w4_energy: float = 0.20

class WhatIfRequest(BaseModel):
    burden_m: float = 6.5
    spacing_m: float = 7.5
    powder_factor_kg_m3: float = 0.78
    explosive_type: str = "Heavy_Emulsion"
    rock_mass_factor_a: float = 7.2
    bench_height_m: float = 15.0
    hole_diameter_mm: int = 270
    stemming_m: float = 4.8
    truck_count: int = 8
    target_tph: int = 4800
    truck_dispatch_policy: str = "drl_ppo_agent"
    drl_weights: DrlWeights = DrlWeights()

# -------------------------------------------------------------
# RUTAS DE LA API
# -------------------------------------------------------------
@app.get("/api/v1/health")
@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "version": "1.0.0",
        "engine": "PyTorch / NumPy M-3 Physical Simulator",
        "uptime_seconds": round(time.time() - START_TIME, 1),
        "drl_model_loaded": "PPO-M-3-v2.4-Prod",
        "gpu_available": False
    }

@app.post("/api/v1/what-if/recalculate")
def recalculate_what_if(req: WhatIfRequest):
    """
    Cálculo analítico del modelo Kuz-Ram acoplado a Bond y Despacho
    """
    # 1. Energía Específica del Explosivo (RWS vs ANFO)
    rws = 1.15 if req.explosive_type == "Heavy_Emulsion" else 1.0
    
    # 2. Índice de Uniformidad (n de Cunningham)
    d_mm = float(req.hole_diameter_mm)
    b_m = req.burden_m
    s_m = req.spacing_m
    w_m = 0.2  # desviación de perforación estándar
    
    n = (2.2 - 14 * (b_m / d_mm)) * math.sqrt((1 + s_m / b_m) / 2) * (1 - w_m / b_m)
    n = max(0.8, min(2.2, n))
    
    # 3. Tamaño Medio x_m (cm a mm)
    q_kg = req.powder_factor_kg_m3 * (b_m * s_m * req.bench_height_m)
    x_m_cm = req.rock_mass_factor_a * ((req.powder_factor_kg_m3 * (rws / 100)) ** -0.8) * (q_kg ** 0.167)
    x_m_mm = x_m_cm * 10.0
    
    # 4. Cálculo P80 (Rosin-Rammler)
    p80_mm = x_m_mm * ((-math.log(1 - 0.80)) ** (1.0 / n))
    p50_mm = x_m_mm * ((-math.log(1 - 0.50)) ** (1.0 / n))
    
    # 5. Porcentajes de Finos (<25mm) y Sobretamaño (>600mm)
    fines_pct = (1 - math.exp(-((25.0 / x_m_mm) ** n))) * 100
    boulders_pct = (math.exp(-((600.0 / x_m_mm) ** n))) * 100
    
    # 6. Score de Excavabilidad y Consumo SAG (Mine-to-Mill)
    optimum_diggability = max(0.0, min(100.0, 100 - abs(p80_mm - 155.0) * 0.45))
    sag_energy = max(4.0, 6.2 + (p80_mm - 150.0) * 0.038)
    sag_savings_pct = max(-25.0, min(35.0, (8.5 - sag_energy) / 8.5 * 100))
    
    # 7. Rendimiento de Transporte y Molienda (TPH)
    dispatch_multiplier = 1.12 if "drl" in req.truck_dispatch_policy else 0.95
    prospective_tph = int(req.target_tph * (req.truck_count / 8.0) * dispatch_multiplier * (optimum_diggability / 80.0))
    
    # 8. Costo Unitario y Energía
    prospective_cost = round(4.85 * (0.75 + (req.powder_factor_kg_m3 / 0.78) * 0.15) * ((8.0 / req.truck_count) ** 0.15), 2)
    prospective_energy = round(sag_energy + 2.5, 2)
    
    # 9. Función de Recompensa DRL Multi-Objetivo
    norm_prod = min(100.0, max(0.0, (prospective_tph / 5000.0) * 100.0))
    norm_qual = max(0.0, 100.0 - abs(p80_mm - 160.0) * 0.75)
    norm_cost = (prospective_cost / 8.0) * 100.0
    norm_energy = (prospective_energy / 14.0) * 100.0
    
    w = req.drl_weights
    p_part = w.w1_productivity * norm_prod
    q_part = w.w2_quality * norm_qual
    c_part = w.w3_cost * norm_cost
    e_part = w.w4_energy * norm_energy
    
    composite_reward = round(p_part + q_part - c_part - e_part, 1)
    
    return {
        "p50_mm": round(p50_mm, 1),
        "p80_mm": round(p80_mm, 1),
        "uniformity_index_n": round(n, 2),
        "fines_percent": round(fines_pct, 1),
        "boulders_percent": round(boulders_pct, 1),
        "optimum_diggability_score": round(optimum_diggability, 1),
        "sag_energy_kwh_t": round(sag_energy, 2),
        "sag_energy_savings_pct": round(sag_savings_pct, 1),
        "prospective_tph": prospective_tph,
        "prospective_cost_usd_t": prospective_cost,
        "prospective_energy_kwh_t": prospective_energy,
        "composite_reward": composite_reward,
        "reward_components": {
            "prod": round(p_part, 1),
            "qual": round(q_part, 1),
            "cost": round(c_part, 1),
            "energy": round(e_part, 1)
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
`;
