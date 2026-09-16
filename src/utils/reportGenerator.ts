import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { SimulationKPIs, DrillRig, Shovel, HaulTruck, BlastZone, SimulationParams } from '../types';

export function exportSimulationToPDF(
  kpis: SimulationKPIs,
  params: SimulationParams,
  drills: DrillRig[],
  shovels: Shovel[],
  trucks: HaulTruck[],
  blastZones: BlastZone[]
) {
  const doc = new jsPDF();
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 19);

  // Header Banner
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 38, 'F');
  
  doc.setTextColor(245, 158, 11); // amber-500
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('M-3: DIGITAL TWIN - DRILL-BLAST-LOAD-HAUL', 14, 16);

  doc.setTextColor(226, 232, 240); // slate-200
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Reporte Ejecutivo de Producción y Optimización Multi-Objetivo Mine-to-Mill', 14, 24);
  doc.text(`Fecha de Emisión: ${dateStr} UTC | Generado por M-3 Engine`, 14, 31);

  // Summary Metrics Section
  doc.setTextColor(15, 23, 42);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('1. RESUMEN EJECUTIVO DE RENDIMIENTO OPERACIONAL', 14, 48);

  doc.setFillColor(241, 245, 249);
  doc.rect(14, 52, 182, 32, 'F');

  doc.setFontSize(10);
  doc.setTextColor(51, 65, 85);
  doc.setFont('helvetica', 'bold');
  doc.text(`Productividad Total:`, 18, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kpis.tph} TPH (Meta: ${kpis.targetTph} TPH)`, 62, 60);

  doc.setFont('helvetica', 'bold');
  doc.text(`Costo Unitario:`, 18, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`$${kpis.costPerTonne.toFixed(2)} / tonelada`, 62, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(`Energía Específica:`, 18, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kpis.energyKwhPerTonne.toFixed(2)} kWh/t`, 62, 76);

  doc.setFont('helvetica', 'bold');
  doc.text(`Fragmentación P80:`, 110, 60);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kpis.currentP80Mm} mm (Meta: ${kpis.targetP80Mm} mm)`, 152, 60);

  doc.setFont('helvetica', 'bold');
  doc.text(`Disponibilidad Flota:`, 110, 68);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kpis.truckFleetAvailabilityPercent}% OEE: ${kpis.fleetOeePercent}%`, 152, 68);

  doc.setFont('helvetica', 'bold');
  doc.text(`DRL Reward Score:`, 110, 76);
  doc.setFont('helvetica', 'normal');
  doc.text(`${kpis.drlRewardScore} pts (PPO-M-3 Policy)`, 152, 76);

  // Kuz-Ram Blast Analysis
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('2. ANÁLISIS DE FRAGMENTACIÓN KUZ-RAM & MINE-TO-MILL', 14, 95);

  let y = 103;
  blastZones.forEach((bz, idx) => {
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 41, 59);
    doc.text(`Polígono: ${bz.name} [Banco ${bz.benchElevation}m]`, 14, y);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    y += 6;
    doc.text(
      `Malla: ${bz.burdenM}m x ${bz.spacingM}m | Factor Carga: ${bz.powderFactorKgM3} kg/m³ (${bz.explosiveType}) | Pozos: ${bz.numHoles}`,
      18,
      y
    );
    if (bz.kuzRamResult) {
      y += 6;
      doc.text(
        `Kuz-Ram: P50=${bz.kuzRamResult.p50Mm}mm, P80=${bz.kuzRamResult.p80Mm}mm, n=${bz.kuzRamResult.uniformityIndexN} | Finos <25mm: ${bz.kuzRamResult.finesPercentUnder25mm}% | Bolones >600mm: ${bz.kuzRamResult.bouldersPercentOver600mm}%`,
        18,
        y
      );
      y += 6;
      doc.text(
        `Ahorro Energético M-to-M en SAG: ${bz.kuzRamResult.energySavingPercentage}% (Consumo estimado SAG: ${bz.kuzRamResult.estimatedSagMillKwhPerTonne} kWh/t)`,
        18,
        y
      );
    }
    y += 10;
  });

  // Fleet Table Section
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text('3. ESTADO DE FLOTA Y ASIGNACIÓN DINÁMICA', 14, y);
  y += 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, 182, 7, 'F');
  doc.text('ID', 16, y + 5);
  doc.text('Modelo', 32, y + 5);
  doc.text('Estado', 78, y + 5);
  doc.text('Carga (t)', 118, y + 5);
  doc.text('Ciclos', 142, y + 5);
  doc.text('Combustible (L/h)', 160, y + 5);
  y += 7;

  doc.setFont('helvetica', 'normal');
  trucks.slice(0, 8).forEach((t) => {
    doc.text(t.id, 16, y + 5);
    doc.text(t.name.substring(0, 22), 32, y + 5);
    doc.text(t.status, 78, y + 5);
    doc.text(`${t.currentPayloadTonnes} / ${t.capacityTonnes}`, 118, y + 5);
    doc.text(`${t.cyclesCompleted}`, 142, y + 5);
    doc.text(`${t.fuelConsumptionLitersPerHour} L/h`, 160, y + 5);
    y += 6;
  });

  // Footer Signature
  doc.setFontSize(8);
  doc.setTextColor(148, 163, 184);
  doc.text('Documento confidencial generado automáticamente por la plataforma M-3 Digital Twin.', 14, 285);
  doc.text('Página 1 de 1', 180, 285);

  doc.save(`M3_Reporte_Produccion_${new Date().toISOString().substring(0, 10)}.pdf`);
}

export function exportSimulationToExcel(
  kpis: SimulationKPIs,
  drills: DrillRig[],
  shovels: Shovel[],
  trucks: HaulTruck[],
  blastZones: BlastZone[]
) {
  const wb = XLSX.utils.book_new();

  // Sheet 1: KPIs
  const kpiData = [
    { Indicador: 'Productividad (TPH)', Valor: kpis.tph, Unidad: 't/h', Meta: kpis.targetTph },
    { Indicador: 'Costo Unitario', Valor: kpis.costPerTonne, Unidad: '$/t', Meta: 5.00 },
    { Indicador: 'Consumo Energético', Valor: kpis.energyKwhPerTonne, Unidad: 'kWh/t', Meta: 10.0 },
    { Indicador: 'Consumo Diésel', Valor: kpis.fuelLitersPerTonne, Unidad: 'L/t', Meta: 0.45 },
    { Indicador: 'Disponibilidad Flota CAEX', Valor: kpis.truckFleetAvailabilityPercent, Unidad: '%', Meta: 90.0 },
    { Indicador: 'OEE General Mina', Valor: kpis.fleetOeePercent, Unidad: '%', Meta: 85.0 },
    { Indicador: 'Fragmentación P80', Valor: kpis.currentP80Mm, Unidad: 'mm', Meta: kpis.targetP80Mm },
    { Indicador: 'DRL Multi-Objective Reward', Valor: kpis.drlRewardScore, Unidad: 'Score', Meta: 90.0 },
  ];
  const wsKPIs = XLSX.utils.json_to_sheet(kpiData);
  XLSX.utils.book_append_sheet(wb, wsKPIs, 'Resumen KPIs');

  // Sheet 2: Trucks Fleet
  const trucksData = trucks.map((t) => ({
    ID: t.id,
    Nombre: t.name,
    Modelo: t.model,
    Estado: t.status,
    CargaActualTon: t.currentPayloadTonnes,
    CapacidadMaximaTon: t.capacityTonnes,
    Destino: t.destination,
    PalaAsignada: t.assignedShovelId,
    VelocidadKmh: t.speedKmh,
    ConsumoLitersH: t.fuelConsumptionLitersPerHour,
    TotalCombustibleL: t.totalFuelConsumed,
    TiempoEsperaSeg: t.waitTimeSeconds,
    TemperaturaNeumaticoC: t.tireTemperatureC,
    CiclosCompletados: t.cyclesCompleted,
  }));
  const wsTrucks = XLSX.utils.json_to_sheet(trucksData);
  XLSX.utils.book_append_sheet(wb, wsTrucks, 'Flota CAEX');

  // Sheet 3: Shovels & Drills
  const shovelsData = shovels.map((s) => ({
    ID: s.id,
    Nombre: s.name,
    Modelo: s.model,
    Estado: s.status,
    CapacidadBaldeM3: s.bucketCapacityM3,
    ToneladasPorPase: s.bucketPayloadTonnes,
    TiempoCicloSeg: s.cycleTimeSeconds,
    EficienciaPct: s.efficiencyPercent,
    CamionesEnCola: s.trucksInQueue.join(', ') || 'Ninguno',
    TotalToneladasCargadas: s.totalTonnesLoaded,
    PotenciaKw: s.powerConsumptionKw,
  }));
  const wsShovels = XLSX.utils.json_to_sheet(shovelsData);
  XLSX.utils.book_append_sheet(wb, wsShovels, 'Palas y Cargadores');

  // Sheet 4: Kuz-Ram Blast Zones
  const blastData = blastZones.map((b) => ({
    ID: b.id,
    Nombre: b.name,
    BancoElevacionM: b.benchElevation,
    BurdenM: b.burdenM,
    EspaciamientoM: b.spacingM,
    DiametroPozoMm: b.holeDiameterMm,
    TipoExplosivo: b.explosiveType,
    FactorCargaKgM3: b.powderFactorKgM3,
    KuzRam_P50_mm: b.kuzRamResult?.p50Mm,
    KuzRam_P80_mm: b.kuzRamResult?.p80Mm,
    IndiceUniformidad_n: b.kuzRamResult?.uniformityIndexN,
    Finos_Menor_25mm_pct: b.kuzRamResult?.finesPercentUnder25mm,
    Bolones_Mayor_600mm_pct: b.kuzRamResult?.bouldersPercentOver600mm,
    ScoreDiggabilidad: b.kuzRamResult?.optimumDiggabilityScore,
    Consumo_SAG_kWh_t: b.kuzRamResult?.estimatedSagMillKwhPerTonne,
    Ahorro_Energia_SAG_pct: b.kuzRamResult?.energySavingPercentage,
  }));
  const wsBlast = XLSX.utils.json_to_sheet(blastData);
  XLSX.utils.book_append_sheet(wb, wsBlast, 'Voladura Kuz-Ram');

  XLSX.writeFile(wb, `M3_Datos_Simulacion_${new Date().toISOString().substring(0, 10)}.xlsx`);
}

export function exportGeoJSON(shovels: Shovel[], trucks: HaulTruck[], blastZones: BlastZone[]) {
  const features = [
    ...blastZones.map((b) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-70.2541 + b.x * 0.0001, -22.3125 + b.z * 0.0001, b.benchElevation],
      },
      properties: {
        id: b.id,
        name: b.name,
        type: 'blast_polygon',
        powderFactor: b.powderFactorKgM3,
        p80: b.kuzRamResult?.p80Mm,
      },
    })),
    ...trucks.map((t) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [-70.2541 + t.x * 0.0001, -22.3125 + t.z * 0.0001, 4100 + t.y],
      },
      properties: {
        id: t.id,
        name: t.name,
        type: 'haul_truck',
        status: t.status,
        payloadTon: t.currentPayloadTonnes,
        speedKmh: t.speedKmh,
      },
    })),
  ];

  const geoJson = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
    },
    features,
  };

  const blob = new Blob([JSON.stringify(geoJson, null, 2)], { type: 'application/geo+json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `M3_Mine_Telemetry_${new Date().toISOString().substring(0, 10)}.geojson`;
  a.click();
  URL.revokeObjectURL(url);
}
