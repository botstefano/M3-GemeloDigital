# Mapa de evidencia entre manuscrito y depósito

Este mapa identifica los tipos de resultados y los archivos relacionados. La numeración final de tablas y secciones debe comprobarse contra la versión del manuscrito que se envíe a la revista.

| Elemento del manuscrito | Archivo(s) relacionado(s) | Qué permite comprobar | Límite |
|---|---|---|---|
| Resultados agregados del experimento 1 | `experiment1_policy_summary.csv` | Resumen de diferencias relativas por política e indicador entre escenarios | No contiene resultados fila por fila ni todas las celdas por escenario |
| Contrastes del experimento 2 | `experiment2_contrasts_summary.csv` | Medianas, rangos y conteos de contrastes con `p_holm < 0.05` por orientación | No contiene los valores p individuales ni las 168 filas de contraste |
| Estadística descriptiva de Constancia | `02_datos_externos_constancia/resultados_recalculados/sag_estadisticas_descriptivas.csv` | Estadísticos de las 14 observaciones | Intervalos t bajo supuesto de independencia |
| Comparación energética de Constancia | `02_datos_externos_constancia/resultados_recalculados/sag_metricas_modelo_vs_planta.csv` | Sesgo, MAE, RMSE, MAPE y correlación entre las dos columnas energéticas | Datos de otra operación; no validan M-3 |
| Comparaciones exploratorias por mena | `02_datos_externos_constancia/resultados_recalculados/sag_comparacion_por_mena_exploratoria.csv` | Diferencias descriptivas y pruebas exploratorias por tipo de mena | Dependencia potencial por fecha; no generalizable |
| Figuras suplementarias SAG | `03_figuras/figura_S1_constancia_modelo_vs_planta.png`; `03_figuras/figura_S2_constancia_diferencias_por_survey.png` | Visualización de las observaciones publicadas de Constancia | No son resultados de simulación M-3 |

Las figuras principales de M-3 no se duplican aquí. No debe afirmarse que los datos incluidos en este subdirectorio permiten reproducir íntegramente las simulaciones M-3.
