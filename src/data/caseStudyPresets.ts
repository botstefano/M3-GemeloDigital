export interface MineCaseStudy {
  id: string;
  name: string;
  location: string;
  depositType: string;
  lithology: string;
  geotechnical: {
    ucsMpa: number;
    densityTM3: number;
    rqdPercent: number;
    jointSpacingM: number;
    rockMassFactorA: number; // Cunningham A factor
    youngsModulusGpa: number;
    poissonsRatio: number;
  };
  blasting: {
    benchHeightM: number;
    holeDiameterMm: number;
    burdenM: number;
    spacingM: number;
    subdrillM: number;
    stemmingM: number;
    powderFactorKgM3: number;
    explosiveType: string;
    explosiveDensityGCc: number;
    vodMS: number;
  };
  fleet: {
    truckModel: string;
    truckCount: number;
    truckCapacityTonnes: number;
    shovelModel: string;
    shovelCount: number;
    shovelBucketM3: number;
    drillRigModel: string;
    drillRigCount: number;
    haulDistanceKm: number;
    rampGradientPercent: number;
  };
  plant: {
    sagMillDimensions: string;
    sagPowerMw: number;
    sagTargetP80Mm: number;
    bondWorkIndexKwhT: number;
    crusherNominalTph: number;
    energyCostUsdKwh: number;
    dieselCostUsdL: number;
  };
  paperDossierText: string;
}

export const MINE_CASE_STUDIES: MineCaseStudy[] = [
  {
    id: 'andes-porphyry',
    name: 'Pórfido Cu-Mo Andes Centrales (Tipo Cuajone / Toromocho)',
    location: 'Cordillera de los Andes (3,800 - 4,400 m.s.n.m.)',
    depositType: 'Pórfido Cuprífero con Enriquecimiento Supérgeno e Hipógeno',
    lithology: 'Andesita pórfida moderadamente alterada (Sericítica / Potásica)',
    geotechnical: {
      ucsMpa: 125,
      densityTM3: 2.68,
      rqdPercent: 74,
      jointSpacingM: 0.85,
      rockMassFactorA: 7.2,
      youngsModulusGpa: 42.5,
      poissonsRatio: 0.24,
    },
    blasting: {
      benchHeightM: 15.0,
      holeDiameterMm: 270, // 10 5/8"
      burdenM: 6.8,
      spacingM: 7.8,
      subdrillM: 2.0,
      stemmingM: 5.5,
      powderFactorKgM3: 0.78,
      explosiveType: 'Emulsión Gasificada Heavy ANFO 70/30',
      explosiveDensityGCc: 1.18,
      vodMS: 5200,
    },
    fleet: {
      truckModel: 'Caterpillar 793F / Komatsu 930E',
      truckCount: 8,
      truckCapacityTonnes: 240,
      shovelModel: 'Komatsu P&H 4100XPC Eléctrica de Cable',
      shovelCount: 2,
      shovelBucketM3: 57.0,
      drillRigModel: 'Cat MD6250 Rotary / Sandvik DR412i',
      drillRigCount: 3,
      haulDistanceKm: 3.8,
      rampGradientPercent: 8.5,
    },
    plant: {
      sagMillDimensions: '36 ft diámetro × 19 ft EGL (Semi-Autógeno)',
      sagPowerMw: 20.0,
      sagTargetP80Mm: 152,
      bondWorkIndexKwhT: 14.4,
      crusherNominalTph: 5200,
      energyCostUsdKwh: 0.085,
      dieselCostUsdL: 1.15,
    },
    paperDossierText: `The empirical case study corresponds to a benchmark open-pit copper-molybdenum porphyry mine located in the Central Andes (altitude 4,100 m a.s.l.). The orebody is dominated by moderately competent altered andesites (uniaxial compressive strength UCS = 125 MPa, in-situ rock density rho = 2.68 t/m^3, Cunningham Rock Mass Factor A = 7.2). Blasting parameters comprise 15 m benches drilled at 270 mm (10 5/8 in) diameter with an equilateral pattern (B = 6.8 m, S = 7.8 m), primed with heavy ANFO 70/30 (powder factor q = 0.78 kg/m^3). Loading is performed by two P&H 4100XPC electric rope shovels (57 m^3 bucket payload ~92 t) dispatching to an ultra-class fleet of eight 240-tonne haul trucks (nominal circuit cycle distance 3.8 km with 8.5% ramp gradients). The primary gyratory crusher feeds a 36 ft x 19 ft (20 MW) SAG milling circuit targeting an optimal P80 feed of 150-160 mm with a Bond work index of 14.4 kWh/t.`
  },
  {
    id: 'skarn-cu-fe',
    name: 'Skarn Polimetálico Cu-Zn-Fe (Tipo Antamina / Las Bambas)',
    location: 'Franja Metalogenética del Centro-Sur del Perú',
    depositType: 'Reemplazo Metasomático de Contacto (Skarn)',
    lithology: 'Granate-Epidota Skarn de alta dureza y abrasividad',
    geotechnical: {
      ucsMpa: 165,
      densityTM3: 3.15,
      rqdPercent: 82,
      jointSpacingM: 1.20,
      rockMassFactorA: 9.4,
      youngsModulusGpa: 58.0,
      poissonsRatio: 0.22,
    },
    blasting: {
      benchHeightM: 15.0,
      holeDiameterMm: 311, // 12 1/4"
      burdenM: 6.2,
      spacingM: 7.2,
      subdrillM: 2.2,
      stemmingM: 5.2,
      powderFactorKgM3: 0.92,
      explosiveType: 'Emulsión Matriz 80/20 de Alta Potencia Relativa',
      explosiveDensityGCc: 1.25,
      vodMS: 5800,
    },
    fleet: {
      truckModel: 'Komatsu 980E-4 (360 t Payload)',
      truckCount: 10,
      truckCapacityTonnes: 360,
      shovelModel: 'Cat 7495 HD Electric Rope Shovel',
      shovelCount: 2,
      shovelBucketM3: 61.2,
      drillRigModel: 'Epiroc Pit Viper 351',
      drillRigCount: 3,
      haulDistanceKm: 4.5,
      rampGradientPercent: 10.0,
    },
    plant: {
      sagMillDimensions: '38 ft diámetro × 21 ft EGL (Gearless Dual Pinion)',
      sagPowerMw: 28.0,
      sagTargetP80Mm: 140,
      bondWorkIndexKwhT: 18.2,
      crusherNominalTph: 6000,
      energyCostUsdKwh: 0.092,
      dieselCostUsdL: 1.20,
    },
    paperDossierText: `The second benchmark scenario addresses a massive contact metasomatic skarn (Cu-Zn-Fe) characterized by high competence and abrasiveness (UCS = 165 MPa, rock density rho = 3.15 t/m^3, Cunningham Factor A = 9.4). The drilling pattern features 311 mm blast holes (B = 6.2 m, S = 7.2 m) loaded with high-density emulsion matrix (powder factor q = 0.92 kg/m^3) to overcome boulder generation. Materials handling is executed by two CAT 7495 rope shovels and ten 360-t ultra-class trucks operating across a 4.5 km haulage corridor. Processing relies on a 38 ft x 21 ft (28 MW) gearless SAG mill with Bond ball mill work index of 18.2 kWh/t.`
  },
  {
    id: 'epithermal-gold',
    name: 'Epitermal Diseminado Au-Ag (Tipo Yanacocha / Pierina)',
    location: 'Macizo Volcánico Andino',
    depositType: 'Epitermal de Alta Sulfuración en Brechas Silíceas',
    lithology: 'Toba dacítica con sílice masiva y oquedades vuggy silica',
    geotechnical: {
      ucsMpa: 95,
      densityTM3: 2.45,
      rqdPercent: 58,
      jointSpacingM: 0.65,
      rockMassFactorA: 5.6,
      youngsModulusGpa: 31.0,
      poissonsRatio: 0.26,
    },
    blasting: {
      benchHeightM: 10.0,
      holeDiameterMm: 229, // 9"
      burdenM: 5.5,
      spacingM: 6.5,
      subdrillM: 1.5,
      stemmingM: 4.0,
      powderFactorKgM3: 0.65,
      explosiveType: 'ANFO Estándar con Microesferas',
      explosiveDensityGCc: 0.85,
      vodMS: 4200,
    },
    fleet: {
      truckModel: 'CAT 785D (140 t Payload)',
      truckCount: 7,
      truckCapacityTonnes: 140,
      shovelModel: 'Hitachi EX3600-6 Pala Hidráulica',
      shovelCount: 2,
      shovelBucketM3: 22.0,
      drillRigModel: 'Sandvik D245S',
      drillRigCount: 2,
      haulDistanceKm: 2.9,
      rampGradientPercent: 8.0,
    },
    plant: {
      sagMillDimensions: '32 ft diámetro × 16 ft EGL',
      sagPowerMw: 14.0,
      sagTargetP80Mm: 165,
      bondWorkIndexKwhT: 12.0,
      crusherNominalTph: 3800,
      energyCostUsdKwh: 0.082,
      dieselCostUsdL: 1.12,
    },
    paperDossierText: `The third benchmark configuration models a high-sulfidation epithermal gold-silver open pit hosted within dacitic volcanic tuffs and vuggy silica structures (UCS = 95 MPa, rho = 2.45 t/m^3, Cunningham Factor A = 5.6). Shorter 10 m benches are blasted with 229 mm holes (q = 0.65 kg/m^3) to minimize fines and dust dispersal. A hydraulic shovel fleet (Hitachi EX3600) pairs with 140-t trucks over a 2.9 km haul network, delivering feed to a 32 ft SAG mill (14 MW, Bond work index 12.0 kWh/t).`
  }
];

export interface DRLHyperparameterAblationRow {
  configId: string;
  learningRate: number;
  gamma: number;
  clipRange: number;
  entropyCoeff: number;
  batchSize: number;
  convergenceEpisode: number;
  finalMeanReward: number;
  rewardStdDev: number;
  paretoOptimalityPct: number;
  tphMean: number;
  status: 'Optimal' | 'Sub-optimal' | 'Unstable';
}

export const DRL_HYPERPARAMETER_ABLATION_STUDY: DRLHyperparameterAblationRow[] = [
  {
    configId: 'PPO-C1 (Default Baseline)',
    learningRate: 0.0003,
    gamma: 0.99,
    clipRange: 0.20,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 240,
    finalMeanReward: 89.4,
    rewardStdDev: 3.2,
    paretoOptimalityPct: 94.2,
    tphMean: 5080,
    status: 'Optimal',
  },
  {
    configId: 'PPO-C2 (High Learning Rate)',
    learningRate: 0.0010,
    gamma: 0.99,
    clipRange: 0.20,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 160,
    finalMeanReward: 78.2,
    rewardStdDev: 9.8,
    paretoOptimalityPct: 76.5,
    tphMean: 4720,
    status: 'Unstable',
  },
  {
    configId: 'PPO-C3 (Low Learning Rate)',
    learningRate: 0.00008,
    gamma: 0.99,
    clipRange: 0.20,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 420,
    finalMeanReward: 84.1,
    rewardStdDev: 2.4,
    paretoOptimalityPct: 88.0,
    tphMean: 4920,
    status: 'Sub-optimal',
  },
  {
    configId: 'PPO-C4 (Short Myopic Gamma)',
    learningRate: 0.0003,
    gamma: 0.92,
    clipRange: 0.20,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 280,
    finalMeanReward: 74.6,
    rewardStdDev: 5.1,
    paretoOptimalityPct: 71.0,
    tphMean: 4580,
    status: 'Sub-optimal',
  },
  {
    configId: 'PPO-C5 (Tight PPO Clip)',
    learningRate: 0.0003,
    gamma: 0.99,
    clipRange: 0.10,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 360,
    finalMeanReward: 86.2,
    rewardStdDev: 2.1,
    paretoOptimalityPct: 91.5,
    tphMean: 4990,
    status: 'Optimal',
  },
  {
    configId: 'PPO-C6 (Wide PPO Clip)',
    learningRate: 0.0003,
    gamma: 0.99,
    clipRange: 0.35,
    entropyCoeff: 0.010,
    batchSize: 64,
    convergenceEpisode: 190,
    finalMeanReward: 81.3,
    rewardStdDev: 7.4,
    paretoOptimalityPct: 81.0,
    tphMean: 4810,
    status: 'Sub-optimal',
  },
  {
    configId: 'PPO-C7 (High Exploration Entropy)',
    learningRate: 0.0003,
    gamma: 0.99,
    clipRange: 0.20,
    entropyCoeff: 0.050,
    batchSize: 64,
    convergenceEpisode: 310,
    finalMeanReward: 83.5,
    rewardStdDev: 6.2,
    paretoOptimalityPct: 85.0,
    tphMean: 4890,
    status: 'Sub-optimal',
  }
];

export function generateLatexAblationTable(data: DRLHyperparameterAblationRow[]): string {
  return `\\begin{table}[htbp]
\\centering
\\caption{DRL (PPO) Hyperparameter Sensitivity and Ablation Study on Mine-to-Mill Environment.}
\\label{tab:drl_hyperparameters_ablation}
\\small
\\begin{tabular}{lccccccr}
\\toprule
\\textbf{Configuration ID} & $\\alpha$ & $\\gamma$ & $\\epsilon$ & $c_2$ (Ent.) & \\textbf{Conv. Ep.} & \\textbf{Reward} & \\textbf{Status} \\\\
\\midrule
${data
  .map(
    (r) =>
      `${r.configId} & $${r.learningRate}$ & $${r.gamma}$ & $${r.clipRange}$ & $${r.entropyCoeff}$ & ${r.convergenceEpisode} & $${r.finalMeanReward} \\pm ${r.rewardStdDev}$ & ${r.status} \\\\`
  )
  .join('\n')}
\\bottomrule
\\end{tabular}
\\end{table}`;
}
