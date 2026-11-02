# Metodología del recálculo SAG de Constancia

El script `05_scripts/recalcular_constancia.py` utiliza exclusivamente el CSV transcrito de la Tabla 13-2.

## Estadística descriptiva

Para cada variable numérica se calcula n, media, desviación estándar muestral, error estándar, coeficiente de variación, mínimo, mediana y máximo. El intervalo de confianza de la media se calcula con la distribución t de Student:

`media ± t(0.975, n − 1) × s / √n`.

Esta fórmula supone observaciones independientes y una distribución aproximadamente normal de la media. Dado que dos líneas fueron observadas en las mismas siete fechas, los intervalos deben interpretarse como descriptivos bajo ese supuesto, no como una estructura que modele explícitamente la agrupación temporal.

## Comparación Shell Model frente a Shell Plant

Se define la diferencia por survey como `dᵢ = Shell Modelᵢ − Shell Plantᵢ`.

- Sesgo: media de `dᵢ`.
- MAE: media de `|dᵢ|`.
- RMSE: raíz de la media de `dᵢ²`.
- MAPE: media de `|dᵢ / Shell Plantᵢ| × 100`.
- Correlación: coeficiente de Pearson entre ambas columnas.
- Prueba del sesgo: prueba t de una muestra sobre las diferencias pareadas `dᵢ` frente a cero.

No rechazar la hipótesis de sesgo cero no demuestra equivalencia entre las dos series.

## Comparación exploratoria por tipo de mena

El script presenta estadísticos descriptivos por tipo de mena y calcula una prueba t de Welch y tamaños de efecto convencionales para la energía Shell Plant. El resultado inferencial se etiqueta como exploratorio y condicionado a independencia. No se ajusta un modelo de efectos de fecha ni se presenta la prueba como evidencia generalizable.

## Correlaciones

Las correlaciones de P80 de alimentación, SGI y tonelaje con ambas columnas de energía son descriptivas. No permiten inferir causalidad.

## Límites

Este análisis no modela la transferencia del chancador, no relaciona la fragmentación de voladura con la alimentación final al molino y no utiliza datos de M-3. No constituye validación ni calibración de la ecuación energética de M-3.
