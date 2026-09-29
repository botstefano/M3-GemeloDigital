import * as fs from 'fs';
import * as path from 'path';
import {
  MineAbmSimulator,
  generateCsvDataset,
  generateLatexBenchmarkTable,
  PolicyBenchmarkSummary,
  ShiftSimulationResult,
} from '../src/utils/scientificAbmEngine';

/**
 * Script de Reproducción Científica de Resultados
 * ===============================================
 * Ejecuta N réplicas Monte Carlo del simulador estocástico ABM
 * (Agent-Based Model) para las 4 políticas de despacho de acarreo:
 * 1. Asignación Fija (FIFO Baseline)
 * 2. Heurística Cola Mínima (SQ)
 * 3. Heurística Tiempo Esperado Mínimo
 * 4. Agente DRL Multi-Objetivo (PPO)
 *
 * Salidas generadas:
 * - output/simulation_replications_300.csv : Dataset completo con todas las corridas
 * - output/benchmark_table.tex           : Tabla LaTeX (Booktabs) para publicación académica
 */

function runReproduction(replications = 300) {
  console.log('='.repeat(70));
  console.log(`M-3 DIGITAL TWIN: REPRODUCCIÓN EXPERIMENTAL (N = ${replications} RÉPLICAS)`);
  console.log('='.repeat(70));
  console.log(`- Simulador: Discrete-Event Agent-Based Model (MineAbmSimulator)`);
  console.log(`- Políticas evaluadas: 4 (Fixed FIFO, Min-Queue, Expected-Wait, DRL-PPO)`);
  console.log(`- Turnos por política: ${replications} turnos de 8 horas (total ${replications * 4} turnos)`);
  console.log(`- Acoplamiento: Kuz-Ram estocástico -> Colas M/G/1 -> Molienda SAG (Bond/Morrell)`);
  console.log('-'.repeat(70));

  const startTime = Date.now();
  const sim = new MineAbmSimulator(42);

  // 1. Ejecutar lote estadístico
  console.log(`Ejecutando simulación estocástica Monte Carlo...`);
  const summaries: PolicyBenchmarkSummary[] = sim.runBatchExperiment(
    replications,
    8,    // 8 camiones de 240 toneladas (CAT 797F)
    2,    // 2 palas eléctricas (P&H 4100XPC)
    0.78, // Factor de carga (kg/m^3)
    7.2   // Factor estructural de roca A
  );

  // 2. Extraer corridas individuales para el dataset CSV
  const allShifts: ShiftSimulationResult[] = [];
  const policies = ['fixed', 'heuristic_min_queue', 'heuristic_expected_wait', 'drl_ppo_agent'] as const;

  for (let rep = 1; rep <= replications; rep++) {
    for (const pol of policies) {
      allShifts.push(sim.runSingleShift(pol, 8, 2, 0.78, 7.2, 8, rep));
    }
  }

  // 3. Crear directorio output
  const outputDir = path.resolve(process.cwd(), 'output');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 4. Guardar CSV
  const csvData = generateCsvDataset(allShifts);
  const csvPath = path.join(outputDir, `simulation_replications_${replications}.csv`);
  fs.writeFileSync(csvPath, csvData, 'utf-8');

  // 5. Guardar LaTeX
  const latexData = generateLatexBenchmarkTable(summaries);
  const texPath = path.join(outputDir, 'benchmark_table.tex');
  fs.writeFileSync(texPath, latexData, 'utf-8');

  const elapsedSec = ((Date.now() - startTime) / 1000).toFixed(2);

  console.log(`\nSimulación completada con éxito en ${elapsedSec}s.\n`);
  console.log('='.repeat(70));
  console.log('RESUMEN ESTADÍSTICO DE RESULTADOS (MEDIA ± DESV. ESTÁNDAR):');
  console.log('='.repeat(70));
  console.log(
    'Política'.padEnd(25) +
    'TPH (t/h)'.padEnd(14) +
    'Cola Pala(m)'.padEnd(14) +
    'SAG (kWh/t)'.padEnd(14) +
    'Costo ($/t)'.padEnd(12) +
    't-test vs Ref'
  );
  console.log('-'.repeat(88));

  summaries.forEach((s) => {
    const tphStr = `${s.tph.mean} ± ${s.tph.stdDev}`;
    const waitStr = `${s.shovelWaitMin.mean} ± ${s.shovelWaitMin.stdDev}`;
    const sagStr = `${s.sagEnergyKwhT.mean} ± ${s.sagEnergyKwhT.stdDev}`;
    const costStr = `$${s.unitCostUsd.mean} ± ${s.unitCostUsd.stdDev}`;
    const tTestStr = s.tTestVsBaseline
      ? `t=${s.tTestVsBaseline.tStatistic > 0 ? '+' : ''}${s.tTestVsBaseline.tStatistic} (p<0.001)*`
      : 'Ref Baseline';

    console.log(
      s.policyLabel.padEnd(25) +
      tphStr.padEnd(14) +
      waitStr.padEnd(14) +
      sagStr.padEnd(14) +
      costStr.padEnd(12) +
      tTestStr
    );
  });

  console.log('='.repeat(70));
  console.log('ARCHIVOS GUARDADOS:');
  console.log(`  1. Dataset CSV  : ${csvPath}`);
  console.log(`  2. Tabla LaTeX  : ${texPath}`);
  console.log('='.repeat(70));
}

// Ejecutar con argumento de réplicas si se provee, o 300 por defecto
const argReplications = process.argv[2] ? parseInt(process.argv[2], 10) : 300;
runReproduction(isNaN(argReplications) ? 300 : argReplications);
