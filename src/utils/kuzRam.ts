import { BlastZone, KuzRamOutput } from '../types';

/**
 * Kuz-Ram Fragmentation Model & Mine-to-Mill Energy Coupling
 * Formulated by Cunningham (1983, 1987) & modified for modern automated blast engineering.
 */
export function calculateKuzRam(zone: Partial<BlastZone>): KuzRamOutput {
  const burden = zone.burdenM || 6.5; // meters
  const spacing = zone.spacingM || 7.5; // meters
  const diameter = (zone.holeDiameterMm || 250) / 1000; // meters (e.g. 0.250 m)
  const benchHeight = zone.benchHeightM || 15.0; // meters
  const stemming = zone.stemmingM || 5.0; // meters
  const powderFactor = zone.powderFactorKgM3 || 0.72; // kg/m^3 (q)
  const rockFactorA = zone.rockMassFactorA || 7.5; // Rock structure factor (1-14)
  const density = zone.rockDensityTM3 || 2.7; // t/m^3
  const explosiveType = zone.explosiveType || 'Heavy_Emulsion';

  // Relative Weight Strength (RWS) to ANFO (ANFO = 100, Heavy Emulsion = 115, Slurry = 108)
  const rws = explosiveType === 'Heavy_Emulsion' ? 115 : explosiveType === 'Slurry' ? 108 : 100;
  
  // Total explosive mass per hole Q (kg)
  const chargeLength = Math.max(benchHeight - stemming + (benchHeight * 0.1), 1.0); // subdrill
  const holeVolume = Math.PI * Math.pow(diameter / 2, 2) * chargeLength; // m^3
  const explosiveDensity = explosiveType === 'Heavy_Emulsion' ? 1.25 : 0.85; // g/cm^3 -> t/m^3
  const explosiveMassQ = Math.max(holeVolume * explosiveDensity * 1000, 10); // kg

  // 1. Mean fragment size xm (cm)
  // xm = A * Q^(1/6) * (q)^(-0.8) * (RWS / 115)^(-19/30) / 10 (or standard Cunningham formula in cm)
  // Standard metric formula: xm (cm) = A * (V/Q)^0.8 * Q^(1/6) * (115/RWS)^(19/30)
  // Where V/Q is 1 / powderFactor (m^3/kg)
  const vOverQ = 1 / powderFactor;
  const xmCm = rockFactorA * Math.pow(vOverQ, 0.8) * Math.pow(explosiveMassQ, 0.167) * Math.pow(115 / rws, 0.633);
  const xmMm = Math.max(xmCm * 10, 10); // in mm

  // 2. Uniformity index n (Cunningham equation)
  // n = (2.2 - 14 * (B/d)) * sqrt((1 + S/B)/2) * (1 - W/B) * ((L_b + L_c)/(2H)) * (P_c / H)
  // Simplified robust formulation:
  const bOverD = burden / diameter;
  const sOverB = spacing / burden;
  const drillAccuracyFactor = 1 - (0.1 / burden); // drilling deviation
  const chargeFactor = (chargeLength + stemming) / (2 * benchHeight);
  
  let n = (2.2 - (0.014 * bOverD)) * Math.sqrt((1 + sOverB) / 2) * drillAccuracyFactor * chargeFactor;
  n = Math.max(0.75, Math.min(n, 2.2)); // Clamp to realistic mining rock blast physics

  // 3. Characteristic size xc in Rosin-Rammler: xc = xm / (ln(2))^(1/n)
  const xcMm = xmMm / Math.pow(Math.LN2, 1 / n);

  // 4. Calculate P50 and P80 using Rosin-Rammler equation:
  // Cumulative fraction passing size x: P(x) = 1 - exp(- (x / xc)^n)
  // Invert: x = xc * (-ln(1 - P))^(1/n)
  const p50Mm = xcMm * Math.pow(-Math.log(1 - 0.50), 1 / n);
  const p80Mm = xcMm * Math.pow(-Math.log(1 - 0.80), 1 / n);

  // 5. Fines (< 25 mm) and Boulders (> 600 mm)
  const finesPercent = (1 - Math.exp(-Math.pow(25 / xcMm, n))) * 100;
  const passing600 = (1 - Math.exp(-Math.pow(600 / xcMm, n))) * 100;
  const bouldersPercent = Math.max(0, 100 - passing600);

  // 6. Diggability Score (0 to 100, where 100 is optimal uniform fragmentation with minimal boulders)
  const boulderPenalty = bouldersPercent * 2.8;
  const finesPenalty = Math.max(0, finesPercent - 15) * 0.8;
  const sizeOptimality = Math.max(0, 100 - Math.abs(p80Mm - 180) * 0.25);
  const diggabilityScore = Math.max(10, Math.min(98, sizeOptimality - boulderPenalty - finesPenalty));

  // 7. Mine-to-Mill Coupling: SAG Mill specific energy consumption E_SAG (kWh/t)
  // Baseline P80 = 250 mm requires ~8.5 kWh/t in SAG.
  // Finer blast feed (e.g. P80 = 120 mm) can reduce SAG specific energy to 6.2 kWh/t.
  // Formula: E_SAG = E_baseline * (P80 / P80_ref)^0.35 + Bond fines adjustment
  const p80Ref = 240; // mm baseline
  const baseSagKwhT = 8.2;
  const sagMillKwhT = baseSagKwhT * Math.pow(p80Mm / p80Ref, 0.38) + (bouldersPercent * 0.04);
  const baselineEnergy = 8.8; // kWh/t typical unoptimized
  const energySaving = Math.max(0, ((baselineEnergy - sagMillKwhT) / baselineEnergy) * 100);

  return {
    p50Mm: Math.round(p50Mm * 10) / 10,
    p80Mm: Math.round(p80Mm * 10) / 10,
    uniformityIndexN: Math.round(n * 100) / 100,
    meanSizeXmMm: Math.round(xmMm * 10) / 10,
    characteristicSizeXcm: Math.round((xcMm / 10) * 10) / 10,
    finesPercentUnder25mm: Math.round(finesPercent * 10) / 10,
    bouldersPercentOver600mm: Math.round(bouldersPercent * 10) / 10,
    optimumDiggabilityScore: Math.round(diggabilityScore * 10) / 10,
    estimatedSagMillKwhPerTonne: Math.round(sagMillKwhT * 100) / 100,
    energySavingPercentage: Math.round(energySaving * 10) / 10,
  };
}

/**
 * Calculates Rosin-Rammler cumulative distribution curve for plotting
 */
export function generateFragmentationCurve(p80Mm: number, n: number, pointsCount = 40): { sizeMm: number; percentPassing: number }[] {
  const xcMm = p80Mm / Math.pow(-Math.log(0.2), 1 / n);
  const sizes = [
    5, 10, 15, 25, 37.5, 50, 75, 100, 125, 150, 175, 200, 250, 300, 350, 400, 500, 600, 750, 900, 1100
  ];
  
  return sizes.map((size) => {
    const fraction = 1 - Math.exp(-Math.pow(size / xcMm, n));
    return {
      sizeMm: size,
      percentPassing: Math.round(fraction * 1000) / 10,
    };
  });
}
