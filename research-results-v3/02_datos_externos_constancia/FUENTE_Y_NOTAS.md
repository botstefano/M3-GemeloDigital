# Fuente y notas de transcripción — Constancia SAG

**Fuente primaria:** Hudbay Minerals Inc. (2021), *NI 43-101 Technical Report: Constancia Mine, Cuzco, Peru*, Tabla 13-2: “Summary of SAG Mill Surveys and Model Calibration”.

**Observaciones:** 14 surveys de dos líneas de molienda observadas en siete fechas entre junio de 2017 y septiembre de 2020.

## Variables del CSV

| Campo | Descripción | Unidad |
|---|---|---|
| `survey_no` | Identificador de survey | — |
| `grinding_line` | Línea de molienda | — |
| `ore_type` | Tipo de mena informado | — |
| `date` | Fecha del survey | AAAA-MM-DD |
| `feed_size_p80_in` | P80 de alimentación, según encabezado de la tabla | pulgadas |
| `feed_size_p80_mm` | Conversión de P80 de alimentación | mm |
| `sgi_min` | SAG Grindability Index | min |
| `sag_ag_throughput_tph` | Tonelaje SAG/AG | t/h |
| `sag_mill_product_p80_microns` | P80 del producto SAG | µm |
| `sag_specific_energy_shell_model_kwh_t` | Energía específica Shell Model | kWh/t |
| `sag_specific_energy_shell_plant_kwh_t` | Energía específica Shell Plant | kWh/t |
| `sag_correction_factor` | Factor de corrección de la tabla fuente | — |

El P80 de alimentación y el P80 del producto son variables diferentes. Se mantiene la etiqueta P80 de alimentación indicada por el encabezado fuente; no se sustituye por F80.

## Conversión

La columna `feed_size_p80_mm` se obtiene de `feed_size_p80_in` mediante 1 in = 25.4 mm. No se han añadido observaciones ni estimaciones.

## Alcance y limitaciones

Los datos pertenecen a Constancia y no a la operación modelada por M-3. El conjunto no incluye correspondencia entre fragmentación de voladura, transferencia del chancador y alimentación final al SAG de M-3. Su uso es comparativo y descriptivo; no representa calibración, validación ni ajuste del motor M-3.

Las dos líneas aparecen medidas en las mismas siete fechas. Por ello, las inferencias que tratan los 14 registros como independientes deben considerarse exploratorias y condicionadas a ese supuesto.

## Referencia

Hudbay Minerals Inc. (2021). *NI 43-101 Technical Report: Constancia Mine, Cuzco, Peru*. Tabla 13-2.

PDF: https://s23.q4cdn.com/405985100/files/doc_downloads/tech_reports/peru/Constancia-NI-43-101-Technical-Report-March-29-2021_FINAL.pdf
