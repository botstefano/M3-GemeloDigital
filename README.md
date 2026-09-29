# M-3 Mining Digital Twin: Drill-Blast-Load-Haul (Mine-to-Mill)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18.0-blue.svg)](https://nodejs.org/)
[![Bun](https://img.shields.io/badge/Bun-%3E%3D1.0-orange.svg)](https://bun.sh/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue.svg)](https://www.typescriptlang.org/)

Plataforma de Simulación Digital Twin 3D y Optimización Multi-Objetivo (DRL & ABM) del ciclo **Drill-Blast-Load-Haul** para operaciones mineras a cielo abierto. Implementa modelado físico acoplado de fragmentación de roca (Kuz-Ram), colas estocásticas de carguío y acarreo ($M/G/1$), despacho dinámico y molienda SAG (Morrell / Bond).

Este repositorio contiene el código fuente completo, el motor de eventos discretos estocástico (ABM), los scripts de reproducibilidad experimental y los entornos Gymnasium para entrenamiento con aprendizaje por refuerzo profundo (DRL).

---

## Requisitos

- **Node.js** $\ge 18.0$ o **Bun** $\ge 1.0$ (ver especificaciones en `package.json`).
- **Variables de entorno**: Copiar el archivo de plantilla `.env.example` a `.env`:
  ```bash
  cp .env.example .env
  ```
  *(El simulador de eventos discretos y las pruebas estadísticas se ejecutan de manera local e independiente sin requerir claves de API obligatorias).*

---

## Ejecución

Para instalar dependencias y levantar el entorno de simulación local:

```bash
# Con Bun:
bun install
bun run dev

# Alternativamente con npm:
npm install
npm run dev
```

La aplicación web y el estudio de investigación estarán disponibles en:  
`http://localhost:3000`

---

## Reproducir resultados del artículo

Existen dos vías para reproducir de forma determinista y auditable las $N = 300$ réplicas Monte Carlo y las tablas/figuras del artículo:

### 1. Vía Consola / CLI (Replicación en un comando)
Ejecute el script automatizado de simulación estocástica por lotes:

```bash
# Con Bun:
bun run reproduce

# O con npm / npx:
npm run reproduce
# (O pasando un número personalizado de réplicas, ej: npx tsx scripts/reproduce_benchmarks.ts 300)
```

**¿Qué hace este script?**
- Ejecuta `MineAbmSimulator` (`scripts/reproduce_benchmarks.ts`) sobre 300 turnos operacionales de 8 horas para 4 políticas de despacho (`Fixed FIFO`, `Min-Queue`, `Expected-Wait`, `DRL-PPO`), sumando un total de 1,200 turnos simulados.
- Resuelve el acoplamiento físico en cada guardia: heterogeneidad geológica $\to$ distribución de fragmentación Kuz-Ram ($P_{80}$, digestibilidad de pila) $\to$ tiempos de carguío y acarreo $\to$ mezcla de mineral y consumo energético específico del molino SAG.
- Calcula las medias, desviaciones estándar, intervalos de confianza al 95% y pruebas de significancia estadística ($t$ de Welch y tamaño del efecto $d$ de Cohen).
- **Archivos generados automáticamente**:
  - `output/simulation_replications_300.csv`: Matriz con las 1,200 observaciones y todas las métricas de rendimiento (TPH, colas, energía SAG en kWh/t, costo unitario $/t, emisión de $\text{CO}_2$).
  - `output/benchmark_table.tex`: Tabla LaTeX en formato Booktabs lista para inclusión directa en el manuscrito del paper.

### 2. Vía Interfaz Gráfica (Web Studio)
1. Navegue en el navegador a `http://localhost:3000`.
2. Diríjase a la pestaña **«Simulación ABM & Monte Carlo»** (*Scientific Research Studio*).
3. Seleccione el número de réplicas ($N=300$), el factor de carga ($q = 0.78\text{ kg/m}^3$) y la semilla aleatoria del generador pseudoaleatorio congruencial lineal (LCG).
4. Haga clic en **«Ejecutar Monte Carlo (Batch ABM)»**.
5. Descargue los datasets en formato CSV mediante el botón **«Exportar CSV Completo»** o copie el código de la tabla LaTeX y las figuras vectoriales.

---

## Dónde se guardan las tablas y figuras

| Artefacto | Ubicación | Descripción |
|---|---|---|
| **Dataset Completo (300 Réplicas)** | `output/simulation_replications_300.csv` | Registros turno a turno con varianza estocástica natural. |
| **Tabla Comparativa (LaTeX)** | `output/benchmark_table.tex` | Tabla formal de benchmarks con pruebas $t$ de Welch frente al baseline FIFO. |
| **Scripts Python de Entrenamiento DRL** | `src/utils/scientificPythonSuite.ts` | Entorno Gymnasium (`mine_abm_gym.py`) y script de entrenamiento PPO (`train_ppo.py`). |
| **Dossier y Reportes Académicos** | Descargables desde la UI en PDF / CSV | Reporte metodológico consolidado del gemelo digital y simulación estocástica. |

---

## Estructura del Proyecto

```text
├── scripts/
│   └── reproduce_benchmarks.ts       # Script de ejecución CLI para reproducir las 300 réplicas
├── src/
│   ├── components/
│   │   ├── scientific/              # ScientificResearchStudio (UI de Monte Carlo, LaTeX y Python)
│   │   ├── digital-twin/            # Gemelo digital 3D interactivo con Three.js
│   │   ├── drl-training/            # Panel de control de agentes de despacho
│   │   └── dashboard/               # Indicadores operacionales en tiempo real
│   ├── utils/
│   │   ├── scientificAbmEngine.ts    # Motor de eventos discretos, colas M/G/1 y Monte Carlo
│   │   ├── kuzRam.ts                # Modelo de fragmentación Kuz-Ram y acoplamiento SAG
│   │   └── scientificPythonSuite.ts # Códigos fuente Gymnasium y Stable-Baselines3
│   └── data/
│       └── caseStudyPresets.ts      # Parámetros calibrados del yacimiento tipo pórfido andino
├── output/                          # Salidas de replicación (CSV y tablas LaTeX)
├── package.json                     # Scripts y dependencias del proyecto
├── LICENSE                          # Licencia de código abierto MIT (Criterio B5.1)
└── README.md                        # Documentación e instrucciones de réplica (Criterio B5.2)
```

---

## Licencia

Este proyecto está distribuido bajo los términos de la **Licencia MIT**. Consulte el archivo [LICENSE](LICENSE) para más detalles.
