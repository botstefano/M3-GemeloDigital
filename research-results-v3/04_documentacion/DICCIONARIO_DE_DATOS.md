# Diccionario de datos del depósito

## 01_resultados_agregados/experiment1_policy_summary.csv

| Campo | Tipo | Unidad / significado |
|---|---|---|
| `policy` | texto | Identificador de política de despacho según el análisis M-3 |
| `tph_*_pct` | numérico | Diferencia relativa porcentual de productividad respecto de la asignación fija, resumida entre escenarios |
| `esag_*_pct` | numérico | Diferencia relativa porcentual de energía específica SAG respecto de la asignación fija, resumida entre escenarios |
| `cost_*_pct` | numérico | Diferencia relativa porcentual del indicador de costo, resumida entre escenarios |
| `co2_*_pct` | numérico | Diferencia relativa porcentual del indicador de emisiones, resumida entre escenarios |
| `mean` / `median` | numérico | Estadístico de las diferencias porcentuales entre escenarios |
| `min_scenario` / `max_scenario` | numérico | Mínimo y máximo entre escenarios |

## 01_resultados_agregados/experiment2_contrasts_summary.csv

| Campo | Tipo | Unidad / significado |
|---|---|---|
| `outcome` | texto | Indicador de resultado (`esag` o `tph`) |
| `contrast` | texto | Comparación identificada en el análisis M-3 |
| `orientation` | texto | Categoría de orientación de frentes (`far` o `near`) usada en el experimento 2 |
| `n_scenarios` | entero | Número de escenarios resumidos |
| `median_relative_pct` | numérico | Mediana de diferencias relativas, en porcentaje |
| `min_relative_pct` / `max_relative_pct` | numérico | Rango de diferencias relativas, en porcentaje |
| `significant_holm` | entero | Cantidad de escenarios con `p_holm < 0.05` según archivo fuente |

## 02_datos_externos_constancia/constancia_sag_table_13_2.csv

Los nombres y unidades de las 12 columnas se describen en `02_datos_externos_constancia/FUENTE_Y_NOTAS.md`. La tabla contiene 14 observaciones publicadas; no contiene registros de M-3.
