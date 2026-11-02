# Suplemento de resultados M-3 v3

Este directorio reúne dos resúmenes estadísticos agregados de los experimentos M-3 y un análisis externo descriptivo de 14 mediciones SAG publicadas para la operación Constancia.

> **Alcance:** los archivos de este directorio no constituyen un paquete íntegro para ejecutar nuevamente el motor M-3. Los dos CSV M-3 son resúmenes agregados; no contienen las observaciones individuales completas ni todos los datos necesarios para reconstruir las réplicas y contrastes. Los datos de Constancia pertenecen a otra operación y no calibran, validan ni ajustan M-3.

## Contenido

```text
research-results-v3/
├── experiment1_policy_summary.csv          # ya presente en el repositorio
├── experiment2_contrasts_summary.csv       # ya presente en el repositorio
├── 02_datos_externos_constancia/
│   ├── constancia_sag_table_13_2.csv
│   ├── FUENTE_Y_NOTAS.md
│   └── resultados_recalculados/
├── 03_figuras/
│   ├── figura_S1_constancia_modelo_vs_planta.png
│   └── figura_S2_constancia_diferencias_por_survey.png
├── 04_documentacion/
├── 05_scripts/
├── CITATION.cff
└── ZENODO_METADATA.md
```

## Resultados agregados M-3

- `experiment1_policy_summary.csv`: diferencia relativa descriptiva frente a la asignación fija, resumida entre los 24 escenarios para cada política e indicador. Cada resumen se construyó promediando las 300 réplicas dentro de cada escenario y resumiendo después las diferencias entre escenarios. El archivo no contiene las 57 600 observaciones individuales.
- `experiment2_contrasts_summary.csv`: resume medianas, rangos y cantidad de escenarios con `p_holm < 0.05` por resultado, contraste y orientación. No contiene los valores p individuales, todas las 168 filas de contraste ni los registros por réplica. El experimento se reporta con 72 000 guardias.

Los conteos del estudio son los descritos en el manuscrito: experimento 1, 24 escenarios × 8 políticas × 300 réplicas; experimento 2, 24 escenarios × 10 políticas × 300 réplicas. Estos conteos no significan que los datos individuales estén incluidos en este subdirectorio.

## Contraste externo SAG: Constancia

`02_datos_externos_constancia/constancia_sag_table_13_2.csv` contiene una transcripción de 14 filas de la Tabla 13-2 del informe técnico NI 43-101 de Hudbay Minerals Inc. (2021). La columna de tamaño de alimentación se identifica como **P80 de alimentación**, de acuerdo con el encabezado de la tabla fuente, y se diferencia del **P80 de producto SAG**. La conversión de pulgadas a milímetros usa 1 in = 25.4 mm.

Las salidas de `resultados_recalculados/` se pueden regenerar ejecutando el script incluido. Las inferencias basadas en los 14 surveys se consideran exploratorias y condicionadas a independencia, debido a que las dos líneas fueron medidas en las mismas siete fechas.

### Ejecutar el recálculo externo

Desde la carpeta `research-results-v3`:

```powershell
py -m pip install -r .\05_scripts\requirements.txt
py .\05_scripts\recalcular_constancia.py
```

El script utiliza solo los datos públicos de Constancia incluidos en este subdirectorio. No ejecuta, modifica ni calibra el motor M-3.

## Figuras suplementarias

- **Figura S1:** dispersión entre la energía específica Shell Model y Shell Plant; incluye la línea de igualdad. La asociación de estas dos columnas no constituye validación predictiva de M-3.
- **Figura S2:** comparación de los valores energéticos Shell Model y Shell Plant por survey.

Las figuras principales de M-3 no se duplican aquí. Las figuras S1 y S2 deben citarse como material suplementario en la versión final del manuscrito si se conservan en el depósito.

## Documentación

- `04_documentacion/DICCIONARIO_DE_DATOS.md`: nombres, tipos y significados de los campos.
- `04_documentacion/METODOLOGIA_RECALCULO_SAG.md`: fórmulas, métricas y supuestos.
- `04_documentacion/MAPA_DE_EVIDENCIA.md`: correspondencia general entre resultados del artículo y archivos.
- `04_documentacion/VERSIONES_Y_PROCEDENCIA.md`: fuentes, versiones y límites de trazabilidad.
- `04_documentacion/CHECKLIST_PREPUBLICACION.md`: comprobaciones pendientes antes del depósito DOI.
- `CITATION.cff` y `ZENODO_METADATA.md`: metadatos preliminares, sin DOI inventado.

## Límites de reproducibilidad

Este suplemento permite consultar los resúmenes de M-3 y recalcular el análisis externo SAG. No permite regenerar el motor v3, sus 57 600 y 72 000 guardias, los pesos de agentes ni toda la matriz de contrastes. La reimplementación o auditoría independiente del motor tampoco queda demostrada por el contenido de este directorio.

Las fechas consignadas en documentos de preinscripción del paquete fuente no quedan verificadas históricamente por su carga posterior a GitHub. Un manifiesto SHA-256 permite comprobar integridad desde el momento de su generación, pero no demuestra la fecha en la que se crearon los archivos.

## Fuente de datos externos

Hudbay Minerals Inc. (2021). *NI 43-101 Technical Report: Constancia Mine, Cuzco, Peru*. Tabla 13-2, “Summary of SAG Mill Surveys and Model Calibration”.

PDF de referencia: https://s23.q4cdn.com/405985100/files/doc_downloads/tech_reports/peru/Constancia-NI-43-101-Technical-Report-March-29-2021_FINAL.pdf

El informe PDF no se redistribuye en este directorio. La transcripción numérica debe mantenerse acompañada de su atribución y sujeta a la revisión de derechos/licencia correspondiente.

## Uso responsable

Los datos externos y los resúmenes M-3 tienen fines académicos. No son mediciones de una operación M-3 ni sustituyen validación, supervisión o evaluación profesional independiente para cualquier contexto real.
