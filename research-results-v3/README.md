# Suplemento de resultados agregados M-3 v3

Los dos CSV de esta carpeta son resúmenes estadísticos agregados calculados directamente a partir de `m3_v3/confirmatory.csv` y `m3_v3/exp2_contrasts.csv` del paquete privado proporcionado para revisión.

## Archivos

- `experiment1_policy_summary.csv`: por política e indicador (productividad, energía SAG, costo y CO₂), primero se calcula la media de las 300 réplicas dentro de cada escenario; luego se calcula la diferencia porcentual respecto de la asignación fija para cada uno de los 24 escenarios. Se presentan la media, mediana, mínimo y máximo de esas 24 diferencias. Es un resumen descriptivo y no añade nuevas pruebas estadísticas.
- `experiment2_contrasts_summary.csv`: agrupa los contrastes del archivo `exp2_contrasts.csv` por resultado, contraste y orientación de los frentes. Presenta mediana, rango y cantidad de escenarios con `p_holm < 0.05`. La columna `rel` del archivo fuente ya está expresada en porcentaje; no se vuelve a multiplicar por 100.

## Alcance

Los conteos del paquete fuente son:
- Experimento 1: 24 escenarios × 8 políticas × 300 réplicas = 57 600 registros.
- Experimento 2: 24 escenarios × 10 políticas × 300 réplicas = 72 000 registros.

Estos resúmenes no contienen observaciones individuales y no permiten regenerar los experimentos. No son datos medidos en una mina real ni validación operacional. No sustituyen al paquete íntegro de reproducción.

Las fechas declaradas en los documentos de preinscripción del paquete fuente no quedan demostradas históricamente por esta publicación posterior en GitHub.

## Uso responsable

M-3 se presenta como un modelo académico de simulación. Estos resúmenes no deben utilizarse para decisiones operacionales, dimensionamiento, diseño ni ejecución de actividades mineras. Cualquier aplicación real requiere evaluación, validación y supervisión profesional independiente.
