# Resultados agregados M-3 ya presentes en el repositorio

Este complemento no vuelve a incluir los dos CSV principales del experimento 1 y 2 para evitar duplicados. Deben permanecer en la raíz de `research-results-v3/`:

- `experiment1_policy_summary.csv`
- `experiment2_contrasts_summary.csv`

## Experimento 1

El archivo resume, por política e indicador, la media, mediana, mínimo y máximo de las diferencias relativas porcentuales frente a la asignación fija. El cálculo se realiza en dos pasos: primero se promedian las réplicas dentro de cada escenario; después se resume la diferencia porcentual entre los 24 escenarios. No contiene las 57 600 filas individuales.

Campos:

- `policy`: identificador de política.
- `tph_*_rel_pct`: diferencia relativa porcentual del indicador de productividad.
- `esag_*_rel_pct`: diferencia relativa porcentual de energía específica SAG.
- `cost_*_rel_pct`: diferencia relativa porcentual de costo.
- `co2_*_rel_pct`: diferencia relativa porcentual de CO₂.
- `mean`, `median`, `min_scenario`, `max_scenario`: resumen entre escenarios.

## Experimento 2

El archivo resume las diferencias relativas por resultado, contraste y orientación de frentes. `significant_holm` indica el número de escenarios cuyo valor ajustado `p_holm` es inferior a 0.05 en el archivo de origen.

Campos:

- `outcome`: indicador (`esag` o `tph`).
- `contrast`: comparación entre políticas.
- `orientation`: categoría de orientación (`far` o `near`).
- `n_scenarios`: número de escenarios incluidos en el resumen.
- `median_relative_pct`, `min_relative_pct`, `max_relative_pct`: resumen de diferencias porcentuales.
- `significant_holm`: conteo de escenarios con `p_holm < 0.05`.

Estos CSV son resultados agregados y no permiten reconstruir observaciones, valores p ni contrastes no incluidos en sus columnas.
