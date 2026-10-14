import * as fs from 'fs';
import * as path from 'path';
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from 'docx';

async function generateDocx() {
  console.log('Iniciando generación de documento .docx...');

  // Leer archivos de código fuente
  const readFileSafe = (relPath: string): string => {
    try {
      const fullPath = path.resolve(process.cwd(), relPath);
      return fs.readFileSync(fullPath, 'utf-8');
    } catch (e) {
      console.warn(`No se pudo leer ${relPath}:`, e);
      return `// Archivo ${relPath} no encontrado`;
    }
  };

  const codeKuzRam = readFileSafe('src/utils/kuzRam.ts');
  const codeAbmEngine = readFileSafe('src/utils/scientificAbmEngine.ts');
  const codePythonSuite = readFileSafe('src/utils/scientificPythonSuite.ts');
  const codeCaseStudy = readFileSafe('src/data/caseStudyPresets.ts');
  const codeReproduction = readFileSafe('scripts/reproduce_benchmarks.ts');
  const latexTable = readFileSafe('output/benchmark_table.tex');
  const readmeText = readFileSafe('README.md');

  // Función auxiliar para bloques de código
  const createCodeParagraphs = (code: string): Paragraph[] => {
    const lines = code.split('\n');
    return lines.map(
      (line) =>
        new Paragraph({
          children: [
            new TextRun({
              text: line || ' ',
              font: 'Consolas',
              size: 17, // ~8.5 pt
              color: '1E293B',
            }),
          ],
          spacing: { line: 240, before: 20, after: 20 },
        })
    );
  };

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // PORTADA / TÍTULO PRINCIPAL
          new Paragraph({
            text: 'M-3 MINING DIGITAL TWIN: DRILL-BLAST-LOAD-HAUL',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { before: 200, after: 100 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'CÓDIGO FUENTE COMPLETO, MODELO MATEMÁTICO Y GUÍA PROMPT PARA REDACCIÓN DE ARTÍCULO CIENTÍFICO',
                bold: true,
                size: 24,
                color: '1E3A8A',
              }),
            ],
            spacing: { after: 300 },
          }),
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: [
              new TextRun({
                text: 'Plataforma de Simulación Estocástica (ABM), Aprendizaje por Refuerzo Profundo (DRL) y Acoplamiento Mine-to-Mill\n',
                italics: true,
                size: 20,
                color: '475569',
              }),
              new TextRun({
                text: 'Documento técnico preparado para ingestión y síntesis por modelos de Inteligencia Artificial (LLM)',
                size: 18,
                color: '64748B',
              }),
            ],
            spacing: { after: 400 },
          }),

          // SECCIÓN 1: PROMPT ESTRUCTURADO PARA LA IA
          new Paragraph({
            text: '1. PROMPT E INSTRUCCIONES PARA LA INTELIGENCIA ARTIFICIAL',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Instrucción para el LLM: ',
                bold: true,
                color: 'B91C1C',
              }),
              new TextRun({
                text: 'Actúa como un Investigador Principal y Redactor Académico Senior en Ingeniería de Minas, Modelado Estocástico y Computación Científica. Tu tarea es redactar un ',
              }),
              new TextRun({
                text: 'artículo científico original y de alto impacto (formato IMRyD para revista indexada Scopus Q1/Q2, como Computers & Operations Research, Mining Technology, o IEEE Transactions on Automation Science and Engineering) ',
                bold: true,
              }),
              new TextRun({
                text: 'basándote rigurosamente en las formulaciones matemáticas, los algoritmos de simulación y los resultados contenidos en este documento.\n',
              }),
            ],
            spacing: { after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'Directrices estrictas de redacción académica:\n',
                bold: true,
              }),
              new TextRun({
                text: '1. Honestidad Metodológica: ',
                bold: true,
              }),
              new TextRun({
                text: 'No inventes nombres de minas comerciales reales ni atribuyas los datos a campañas de campo no documentadas. Presenta el trabajo como un Gemelo Digital Estocástico (Stochastic Digital Twin) calibrado con parámetros geomecánicos representativos de pórfidos de cobre andinos a cielo abierto.\n',
              }),
              new TextRun({
                text: '2. Ecuaciones Físicas Explicadas: ',
                bold: true,
              }),
              new TextRun({
                text: 'Incorpora y formaliza en LaTeX las ecuaciones implementadas en el código: modelo Kuz-Ram modificado de Cunningham (1987) para el tamaño característico xc y de paso P80, Rosin-Rammler, correlación Morrell/Bond para energía específica SAG (kWh/t), dinámica de colas de eventos discretos M/G/1 con distribuciones log-normales de acarreo, y función de recompensa multi-objetivo del agente PPO.\n',
              }),
              new TextRun({
                text: '3. Rigor Estadístico: ',
                bold: true,
              }),
              new TextRun({
                text: 'Utiliza los resultados de la simulación de Monte Carlo reportados en la Sección 7 con N=300 turnos por política (1,200 turnos totales), reportando Media ± Desviación Estándar, prueba t de Welch para varianzas desiguales y tamaño de efecto d de Cohen.\n',
              }),
              new TextRun({
                text: '4. Estructura Requerida del Artículo: ',
                bold: true,
              }),
              new TextRun({
                text: 'Título en español e inglés; Resumen (Abstract) y Palabras Clave (Keywords); Introducción con estado del arte del Mine-to-Mill y despacho dinámico; Metodología y Arquitectura del Gemelo Digital (con pseudocódigo del algoritmo ABM); Caso de Estudio Calibrado; Resultados Experimentales y Benchmarks (incluyendo la Tabla formal Booktabs); Discusión de implicancias operacionales y energéticas; Conclusiones y Referencias bibliográficas.',
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECCIÓN 2: FORMULACIONES MATEMÁTICAS CLAVE
          new Paragraph({
            text: '2. FORMULACIONES MATEMÁTICAS IMPLEMENTADAS EN EL CÓDIGO',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: '2.1 Modelo de Fragmentación Kuz-Ram (Cunningham, 1987):\n',
                bold: true,
                color: '1E3A8A',
              }),
              new TextRun({
                text: 'Tamaño medio del fragmento: xm (cm) = A * (V/Q)^0.8 * Q^(1/6) * (115 / RWS)^(19/30)\n',
                font: 'Consolas',
                size: 18,
              }),
              new TextRun({
                text: 'Donde A es el factor geomecánico de roca, V/Q es el inverso del factor de carga (m3/kg), Q es la masa explosiva por taladro (kg), y RWS es la potencia relativa en peso respecto al ANFO.\n',
              }),
              new TextRun({
                text: 'Índice de uniformidad n (Cunningham):\n',
                bold: true,
              }),
              new TextRun({
                text: 'n = (2.2 - 0.014 * (B/d)) * sqrt((1 + S/B) / 2) * (1 - 0.1/B) * ((L_charge + L_stemming) / (2 * H))\n',
                font: 'Consolas',
                size: 18,
              }),
              new TextRun({
                text: 'Distribución acumulada Rosin-Rammler: P(x) = 1 - exp(- (x / xc)^n), donde xc = xm / (ln 2)^(1/n).\n',
                font: 'Consolas',
                size: 18,
              }),
              new TextRun({
                text: 'Tamaño de corte P80 (mm): P80 = xc * (-ln(0.20))^(1/n).\n\n',
                font: 'Consolas',
                size: 18,
              }),
              new TextRun({
                text: '2.2 Acoplamiento Físico de Energía SAG (Morrell / Bond):\n',
                bold: true,
                color: '1E3A8A',
              }),
              new TextRun({
                text: 'E_SAG (kWh/t) = 8.2 * (P80_blend / 240.0)^0.38\n\n',
                font: 'Consolas',
                size: 18,
              }),
              new TextRun({
                text: '2.3 Función de Recompensa Multi-Objetivo (DRL PPO):\n',
                bold: true,
                color: '1E3A8A',
              }),
              new TextRun({
                text: 'R_t = 0.35 * N(TPH) + 0.25 * N(P80_target) - 0.20 * N(Costo_unitario) - 0.20 * N(E_SAG)\n',
                font: 'Consolas',
                size: 18,
              }),
            ],
            spacing: { after: 300 },
          }),

          // SECCIÓN 3: PARÁMETROS DEL CASO DE ESTUDIO
          new Paragraph({
            text: '3. PARÁMETROS CALIBRADOS DEL CASO DE ESTUDIO (src/data/caseStudyPresets.ts)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 150 },
          }),
          ...createCodeParagraphs(codeCaseStudy),

          // SECCIÓN 4: MODELO DE FRAGMENTACIÓN KUZ-RAM
          new Paragraph({
            text: '4. CÓDIGO FUENTE: MODELO KUZ-RAM Y ENERGÍA SAG (src/utils/kuzRam.ts)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          ...createCodeParagraphs(codeKuzRam),

          // SECCIÓN 5: MOTOR ESTOCÁSTICO ABM Y MONTE CARLO
          new Paragraph({
            text: '5. CÓDIGO FUENTE: MOTOR DE SIMULACIÓN ABM ESTOCÁSTICO (src/utils/scientificAbmEngine.ts)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          ...createCodeParagraphs(codeAbmEngine),

          // SECCIÓN 6: ENTORNO GYMNASIUM Y PIPELINE DRL
          new Paragraph({
            text: '6. CÓDIGO FUENTE: ENTORNO GYMNASIUM Y ENTRENAMIENTO DRL (src/utils/scientificPythonSuite.ts)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          ...createCodeParagraphs(codePythonSuite),

          // SECCIÓN 7: SCRIPT DE REPRODUCIBILIDAD
          new Paragraph({
            text: '7. CÓDIGO FUENTE: SCRIPT CLI DE REPRODUCIBILIDAD (scripts/reproduce_benchmarks.ts)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          ...createCodeParagraphs(codeReproduction),

          // SECCIÓN 8: RESULTADOS EMPÍRICOS Y TABLA LATEX
          new Paragraph({
            text: '8. RESULTADOS EMPÍRICOS: TABLA FORMAL LATEX (output/benchmark_table.tex)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          new Paragraph({
            children: [
              new TextRun({
                text: 'La siguiente tabla contiene los resultados consolidados de N=300 turnos operacionales por política generados por la simulación estocástica Monte Carlo:',
              }),
            ],
            spacing: { after: 150 },
          }),
          ...createCodeParagraphs(latexTable),

          // SECCIÓN 9: README Y PROTOCOLO DE REPLICACIÓN
          new Paragraph({
            text: '9. PROTOCOLO DE REPLICACIÓN Y DOCUMENTACIÓN (README.md)',
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 400, after: 150 },
          }),
          ...createCodeParagraphs(readmeText),
        ],
      },
    ],
  });

  const buffer = await Packer.toBuffer(doc);

  // Guardar en la raíz del proyecto
  const rootPath = path.resolve(process.cwd(), 'M3_Codigo_Principal_Para_Articulo.docx');
  fs.writeFileSync(rootPath, buffer);
  console.log(`Guardado archivo en raíz: ${rootPath} (${(buffer.length / 1024).toFixed(1)} KB)`);

  // Guardar en carpeta public/ para que sea accesible o descargable en el navegador web
  const publicDir = path.resolve(process.cwd(), 'public');
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }
  const publicPath = path.join(publicDir, 'M3_Codigo_Principal_Para_Articulo.docx');
  fs.writeFileSync(publicPath, buffer);
  console.log(`Guardado archivo en public: ${publicPath}`);

  console.log('Generación de .docx completada exitosamente.');
}

generateDocx().catch((err) => {
  console.error('Error generando .docx:', err);
  process.exit(1);
});
