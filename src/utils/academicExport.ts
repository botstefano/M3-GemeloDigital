import * as htmlToImage from 'html-to-image';
import * as XLSX from 'xlsx';

/**
 * Exports any DOM element as a high-resolution 600 DPI PNG image
 * using html-to-image with pixelRatio = 4 (produces ~3600-4800px width for standard figures).
 */
export async function exportElementToHighDpiPng(
  elementId: string,
  filename: string,
  title?: string
): Promise<void> {
  const node = document.getElementById(elementId);
  if (!node) {
    console.error(`Element with id ${elementId} not found`);
    return;
  }

  try {
    // skipFonts: true and fontEmbedCSS: '' prevents SecurityError when reading remote CSS stylesheets (e.g. Google Fonts)
    // pixelRatio: 4 produces publication-ready ultra-high resolution (3000-5000px wide, ~600 DPI equivalent)
    let dataUrl: string;
    try {
      dataUrl = await htmlToImage.toPng(node, {
        quality: 1.0,
        pixelRatio: 4,
        backgroundColor: '#0a0b0e',
        skipFonts: true,
        fontEmbedCSS: '',
        style: {
          borderRadius: '0px',
        },
        filter: (child: HTMLElement) => {
          if (child.classList && (child.classList.contains('no-export') || child.classList.contains('no-print'))) {
            return false;
          }
          return true;
        },
      });
    } catch (innerError) {
      console.warn('Initial high-DPI export attempt encountered an issue, retrying with conservative ratio:', innerError);
      // Fallback with pixelRatio: 2
      dataUrl = await htmlToImage.toPng(node, {
        quality: 0.98,
        pixelRatio: 2,
        backgroundColor: '#0a0b0e',
        skipFonts: true,
        fontEmbedCSS: '',
        filter: (child: HTMLElement) => {
          if (child.classList && (child.classList.contains('no-export') || child.classList.contains('no-print'))) {
            return false;
          }
          return true;
        },
      });
    }

    const link = document.createElement('a');
    link.download = `${filename.replace(/\.png$/i, '')}_600DPI.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error generating 600 DPI image:', error);
  }
}

/**
 * Exports data table directly to Excel (.xlsx) file with professional formatting
 */
export function exportTableDataToExcel(
  data: Record<string, any>[],
  sheetName: string,
  filename: string,
  metadata?: { title: string; interpretation?: string; explainability?: string }
): void {
  try {
    const wb = XLSX.utils.book_new();

    // Prepare rows with title and notes if available
    const rows: any[] = [];
    if (metadata?.title) {
      rows.push({ Info: `TITULO: ${metadata.title}` });
    }
    if (metadata?.interpretation) {
      rows.push({ Info: `INTERPRETACION: ${metadata.interpretation}` });
    }
    if (metadata?.explainability) {
      rows.push({ Info: `EXPLICABILIDAD FISICA: ${metadata.explainability}` });
      rows.push({}); // empty row
    }

    // Convert data to sheet
    const ws = XLSX.utils.json_to_sheet(data);

    // If metadata was provided, prepend metadata rows
    if (rows.length > 0) {
      const metaSheet = XLSX.utils.json_to_sheet(rows, { header: ['Info'], skipHeader: true });
      XLSX.utils.book_append_sheet(wb, metaSheet, 'Metadatos');
    }

    XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
    XLSX.writeFile(wb, `${filename.replace(/\.xlsx$/i, '')}.xlsx`);
  } catch (error) {
    console.error('Error exporting to Excel:', error);
  }
}

/**
 * Downloads a structured academic report containing interpretation & physical explainability
 */
export function exportExplainabilityDoc(
  title: string,
  figureOrTableId: string,
  interpretation: string,
  explainability: string,
  parameters?: Record<string, any>
): void {
  const content = `# DOCUMENTO DE INTERPRETABILIDAD & EXPLICABILIDAD CIENTÍFICA
## ${title.toUpperCase()}
**Identificador:** ${figureOrTableId}
**Fecha de Generación:** ${new Date().toLocaleString()}
**Resolución de Exportación Gráfica:** 600 DPI (Estándar IEEE / Elsevier Minerals Engineering)

---

### 1. INTERPRETABILIDAD TÉCNICA
${interpretation}

---

### 2. EXPLICABILIDAD FÍSICO-MINERA & MATEMÁTICA
${explainability}

${
  parameters
    ? `---

### 3. PARÁMETROS OPERACIONALES ASOCIADOS
${Object.entries(parameters)
  .map(([k, v]) => `- **${k}:** ${v}`)
  .join('\n')}`
    : ''
}

---
*Generado por el Gemelo Digital Mine-to-Mill M-3 (Ray RLlib / Mesa / Kuz-Ram Framework)*
`;

  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Explicabilidad_${figureOrTableId.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
