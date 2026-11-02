# Informe Técnico: Análisis Académico Independiente del Componente de Molienda SAG

## Datos de referencia: Operación Constancia (Hudbay Minerals, Perú)

> **Advertencia metodológica:** Este análisis se realiza de forma independiente sobre mediciones de la planta Constancia. No constituye una calibración, validación ni ajuste del motor M-3. El proyecto M-3 y su modelo de acoplamiento Mine-to-Mill no son modificados. El presente informe tiene fines académicos de estudio comparativo de datos reales de molienda SAG.

---

## 1. Estadísticas Descriptivas de las Variables

La tabla siguiente resume las estadísticas descriptivas de las seis variables operacionales y el factor de corrección para las 14 mediciones (surveys) de la planta Constancia.

| Variable | N | Media | Desv. Est. | Error Est. | CV (%) | Mín. | Mediana | Máx. | IC 95 % (inf.) | IC 95 % (sup.) |
|----------|---|-------|-----------|-----------|--------|------|---------|------|----------------|----------------|
| F80 (mm) | 14 | 59.33 | 9.74 | 2.60 | 16.42 | 45.72 | 59.69 | 73.66 | 54.22 | 64.43 |
| SGI (min) | 14 | 68.21 | 29.54 | 7.89 | 43.30 | 30.00 | 67.50 | 122.00 | 52.74 | 83.69 |
| Tonelaje (t/h) | 14 | 1809.79 | 279.06 | 74.58 | 15.42 | 1351 | 1883 | 2224 | 1663.61 | 1955.96 |
| P80 producto (µm) | 14 | 1189.57 | 308.99 | 82.58 | 25.97 | 614 | 1188 | 1834 | 1027.71 | 1351.43 |
| E. específica calc. (kWh/t) | 14 | 7.76 | 1.77 | 0.47 | 22.82 | 5.00 | 7.50 | 10.50 | 6.83 | 8.68 |
| E. específica med. (kWh/t) | 14 | 7.89 | 2.14 | 0.57 | 27.11 | 5.40 | 7.60 | 11.40 | 6.77 | 9.01 |
| Factor de corrección | 14 | 1.02 | 0.10 | 0.03 | 10.34 | 0.85 | 1.03 | 1.19 | 0.96 | 1.07 |

### Observaciones

- **F80 de alimentación:** oscila entre 45.72 mm y 73.66 mm (CV = 16.42 %), reflejando variabilidad natural de la fragmentación de alimentación al SAG. La mediana (59.69 mm) es prácticamente igual a la media, indicando distribución simétrica.
- **SGI (SAG Grindability Index):** presenta la mayor variabilidad relativa (CV = 43.30 %), con valores desde 30 min (mineral supergene blando) hasta 122 min (hypogene duro). Esta variable es el principal diferenciador entre tipos de mena.
- **Tonelaje procesado:** varía entre 1,351 y 2,224 t/h (CV = 15.42 %), inversamente correlacionado con la dureza del mineral.
- **P80 del producto:** presenta alta dispersión (CV = 25.97 %), desde 614 µm hasta 1,834 µm, indicando que la granulometría de descarga del SAG varía significativamente según las condiciones operacionales.
- **Energía específica:** tanto la calculada por el modelo como la medida en planta presentan coeficientes de variación elevados (22.82 % y 27.11 % respectivamente), lo que es consistente con la amplia gama de durezas de mineral y condiciones de operación abarcadas por el dataset.

---

## 2. Comparación entre Energía Calculada y Energía Medida

### 2.1 Tabla de Comparación por Survey

| Survey | Línea | Tipo de Mena | F80 (mm) | SGI (min) | TPH | P80 (µm) | E_calc (kWh/t) | E_meas (kWh/t) | Diferencia (kWh/t) | Error (%) | FC |
|--------|-------|-------------|----------|-----------|------|----------|----------------|----------------|---------------------|-----------|----|
| 1 | 1 | Hypogene | 66.04 | 76 | 1843 | 1834 | 7.5 | 7.7 | −0.2 | −2.6 | 1.03 |
| 2 | 2 | Hypogene | 58.42 | 73 | 1931 | 1223 | 8.1 | 6.9 | +1.2 | +17.4 | 0.85 |
| 3 | 1 | Supergene | 45.72 | 34 | 2025 | 1138 | 5.5 | 5.8 | −0.3 | −5.2 | 1.07 |
| 4 | 2 | Supergene | 48.26 | 32 | 2023 | 614 | 6.3 | 5.4 | +0.9 | +16.7 | 0.87 |
| 5 | 1 | Hypogene | 48.26 | 61 | 1841 | 1504 | 7.0 | 7.5 | −0.5 | −6.7 | 1.07 |
| 6 | 2 | Hypogene | 48.26 | 74 | 1772 | 1068 | 8.5 | 7.7 | +0.8 | +10.4 | 0.90 |
| 7 | 1 | Hypogene | 55.88 | 62 | 1973 | 1246 | 7.4 | 7.3 | +0.1 | +1.4 | 0.99 |
| 8 | 2 | Hypogene | 53.34 | 61 | 1923 | 1178 | 7.5 | 7.7 | −0.2 | −2.6 | 1.03 |
| 9 | 1 | Supergene | 63.50 | 30 | 2087 | 1216 | 5.0 | 5.7 | −0.7 | −12.3 | 1.13 |
| 10 | 2 | Supergene | 60.96 | 32 | 2224 | 795 | 5.8 | 5.4 | +0.4 | +7.4 | 0.93 |
| 11 | 1 | Hypogene | 73.66 | 101 | 1530 | 918 | 10.5 | 9.9 | +0.6 | +6.1 | 0.94 |
| 12 | 2 | Hypogene | 71.12 | 95 | 1351 | 1155 | 9.6 | 11.4 | −1.8 | −15.8 | 1.19 |
| 13 | 1 | Hypogene | 63.50 | 102 | 1432 | 1198 | 9.8 | 10.9 | −1.1 | −10.1 | 1.11 |
| 14 | 2 | Hypogene | 73.66 | 122 | 1382 | 1567 | 10.1 | 11.2 | −1.1 | −9.8 | 1.11 |

### 2.2 Resumen de Métricas de Ajuste

| Métrica | Valor |
|---------|-------|
| Sesgo medio (E_calc − E_meas) | −0.136 kWh/t |
| Desviación estándar del sesgo | 0.865 kWh/t |
| Error Absoluto Medio (MAE) | 0.707 kWh/t |
| Raíz del Error Cuadrático Medio (RMSE) | 0.845 kWh/t |
| Error Absoluto Medio Porcentual (MAPE) | 8.88 % |
| Correlación de Pearson r(E_calc, E_meas) | 0.9192 |
| Coeficiente de determinación R² | 0.8450 |
| Diferencia absoluta máxima | 1.800 kWh/t (survey 12) |
| Diferencia absoluta mínima | 0.100 kWh/t (survey 7) |

### 2.3 Interpretación

El modelo de planta presenta una **correlación fuerte** con las mediciones reales (r = 0.9192, R² = 0.845), indicando que el modelo captura adecuadamente la dirección y magnitud general del consumo energético. Sin embargo, el RMSE de 0.845 kWh/t y el MAPE de 8.88 % revelan un nivel de discrepancia no despreciable a nivel de survey individual. El sesgo medio ligeramente negativo (−0.136 kWh/t) indica que el modelo tiende a **subestimar** marginalmente la energía medida, pero este sesgo es pequeño en magnitud relativa (1.7 % de la media de E_meas) y no es significativo dado el tamaño de muestra.

Los surveys con mayor discrepancia (12, 2 y 4) presentan factores de corrección en los extremos del rango (0.85, 0.87 y 1.19), sugiriendo que el modelo requiere ajustes significativos en condiciones de mineral particulares o líneas de molienda específicas.

---

## 3. Evaluación de Errores, Diferencias y Variabilidad

### 3.1 Análisis de Correlaciones

Se calcularon las correlaciones de Pearson entre las variables operacionales y ambas estimaciones de energía específica:

| Par de variables | r (Pearson) |
|-----------------|-------------|
| E_calc vs. E_meas | 0.9192 |
| F80 vs. E_calc | 0.6075 |
| F80 vs. E_meas | 0.6724 |
| SGI vs. E_calc | 0.9623 |
| SGI vs. E_meas | 0.9441 |
| TPH vs. E_calc | −0.9132 |
| TPH vs. E_meas | −0.9782 |

**Hallazgos:**

- El **SGI** es el predictor más fuerte de la energía específica (r > 0.94 para ambas estimaciones), lo que es físicamente coherente: a mayor dureza del mineral (mayor SGI), mayor energía requerida por el molino SAG.
- El **tonelaje (TPH)** presenta correlación negativa muy fuerte con la energía específica (r < −0.91), confirmando que a mayor tonelaje procesado (mineral más blando), menor energía específica por tonelada.
- El **F80** muestra correlación moderada positiva con la energía (r ≈ 0.61–0.67), lo que es consistente con el principio de que una alimentación más gruesa requiere mayor energía de molienda, aunque su efecto es menos dominante que el SGI.

### 3.2 Análisis por Tipo de Mena

| Tipo de Mena | N | F80 medio (mm) | SGI medio (min) | TPH medio (t/h) | E_calc media (kWh/t) | E_meas media (kWh/t) | E_calc SD | E_meas SD |
|-------------|---|----------------|-----------------|------------------|---------------------|---------------------|-----------|-----------|
| Hypogene | 10 | 61.21 | 82.7 | 1698 | 8.60 | 8.82 | 1.29 | 1.80 |
| Supergene | 4 | 54.61 | 32.0 | 2090 | 5.65 | 5.57 | 0.54 | 0.21 |

El mineral **hypogene** (más profundo, más duro) consume significativamente más energía específica (8.60–8.82 kWh/t) que el supergene (5.57–5.65 kWh/t), con un diferencial de aproximadamente 3 kWh/t. La dispersión interna del hypogene es notablemente mayor (SD = 1.29–1.80) que la del supergene (SD = 0.21–0.54), reflejando la heterogeneidad mineralógica del hypogene a lo largo del tiempo (surveys de 2017 a 2020).

### 3.3 Análisis por Línea de Molienda

| Línea | N | F80 medio (mm) | SGI medio (min) | TPH medio (t/h) | E_calc media (kWh/t) | E_meas media (kWh/t) |
|-------|---|----------------|-----------------|------------------|---------------------|---------------------|
| Línea 1 | 7 | 59.51 | 66.6 | 1819 | 7.53 | 7.83 |
| Línea 2 | 7 | 59.15 | 69.9 | 1801 | 7.99 | 7.96 |

Las dos líneas de molienda presentan medias globales similares, pero la línea 2 muestra mayor variabilidad en la energía medida (SD = 2.47) comparada con la línea 1 (SD = 1.95). Los surveys 12 y 2 (ambos línea 2, hypogene) presentan las mayores discrepancias modelo-planta, sugiriendo que la línea 2 puede tener características de diseño o desgaste de liners que el modelo no captura completamente.

### 3.4 Distribución de Errores

| Rango de Error (%) | Nº de Surveys | Porcentaje |
|---------------------|---------------|------------|
| |E| < 5 % | 5 | 35.7 % |
| 5 % ≤ |E| < 10 % | 4 | 28.6 % |
| 10 % ≤ |E| < 15 % | 3 | 21.4 % |
| |E| ≥ 15 % | 2 | 14.3 % |

El 64.3 % de los surveys presentan un error inferior al 10 %, mientras que el 35.7 % restante excede este umbral. Los dos surveys con error superior al 15 % (surveys 2 y 12, ambos hypogene línea 2) representan casos atípicos que podrían requerir investigación adicional sobre condiciones operacionales específicas.

---

## 4. Tabla de Resultados para Artículo Científico

### Tabla A. Estadísticas descriptivas y métricas de ajuste del modelo de energía específica SAG, planta Constancia

| Variable | Unidad | N | Media ± DE | CV (%) | Mín. | Máx. |
|----------|--------|---|-------------|--------|------|------|
| F80 alimentación | mm | 14 | 59.33 ± 9.74 | 16.4 | 45.72 | 73.66 |
| SGI | min | 14 | 68.21 ± 29.54 | 43.3 | 30.00 | 122.00 |
| Tonelaje SAG | t/h | 14 | 1809.79 ± 279.06 | 15.4 | 1351 | 2224 |
| P80 producto | µm | 14 | 1189.57 ± 308.99 | 26.0 | 614 | 1834 |
| E. específica (modelo) | kWh/t | 14 | 7.76 ± 1.77 | 22.8 | 5.00 | 10.50 |
| E. específica (planta) | kWh/t | 14 | 7.89 ± 2.14 | 27.1 | 5.40 | 11.40 |
| Factor de corrección | — | 14 | 1.02 ± 0.10 | 10.3 | 0.85 | 1.19 |

*Nota.* DE = desviación estándar; CV = coeficiente de variación. E. específica (modelo) = energía específica calculada por el modelo de planta SAG; E. específica (planta) = energía específica medida en campo. Datos de la planta Constancia (Hudbay Minerals), 14 mediciones entre 2017 y 2020.

### Tabla B. Métricas de desempeño del modelo frente a mediciones de planta

| Métrica | Valor | Interpretación |
|---------|-------|----------------|
| Sesgo medio (kWh/t) | −0.136 | Subestimación marginal del modelo |
| MAE (kWh/t) | 0.707 | Error absoluto medio |
| RMSE (kWh/t) | 0.845 | Error cuadrático medio |
| MAPE (%) | 8.88 | Error porcentual medio |
| Pearson r | 0.919 | Correlación fuerte |
| R² | 0.845 | Buena capacidad explicativa |

### Tabla C. Correlaciones de Pearson entre variables operacionales y energía específica SAG

| Variable | r vs. E_calc | r vs. E_meas |
|----------|-------------|-------------|
| F80 (mm) | 0.608 | 0.672 |
| SGI (min) | 0.962 | 0.944 |
| TPH (t/h) | −0.913 | −0.978 |
| E_meas | 0.919 | — |

### Tabla D. Energía específica por tipo de mena

| Tipo de mena | N | E_calc (kWh/t) | E_meas (kWh/t) | Diferencia media (kWh/t) |
|-------------|---|----------------|----------------|------------------------|
| Hypogene | 10 | 8.60 ± 1.29 | 8.82 ± 1.80 | −0.22 |
| Supergene | 4 | 5.65 ± 0.54 | 5.57 ± 0.21 | +0.08 |

---

## 5. Limitaciones del Uso de Datos de una Operación Minera Distinta

El presente análisis se basa exclusivamente en mediciones de la planta Constancia (Hudbay Minerals, Perú), una operación distinta al contexto del proyecto M-3. Esta sección detalla las limitaciones que se deben considerar:

### 5.1 Diferencias de Yacimiento y Mineralogía

- **Constancia** es un yacimiento de cobre de tipo pórfido ubicado en los Andes peruanos, con dos tipos de mena claramente diferenciados: hypogene (sulfuros primarios, SGI = 61–122 min) y supergene (óxidos/enriquecimiento secundario, SGI = 30–34 min). El proyecto M-3 modela un yacimiento tipo pórfido andino genérico con factor de roca A de Kuz-Ram entre 6.8 y 7.6, lo que no corresponde directamente a las características mineralógicas específicas de Constancia.
- Las propiedades mineralógicas (dureza, abrasividad, birrefringencia, asociación de minerales) son específicas de cada yacimiento y no son transferibles directamente entre operaciones.

### 5.2 Diferencias de Equipamiento y Diseño de Planta

- Constancia opera con **dos líneas de molienda SAG** paralelas con características de diseño, configuración de liners, volumen de carga de bolas y potencia instalada específicas. El modelo M-3 utiliza ecuaciones simplificadas de Morrell/Bond con una sola configuración de molino SAG genérica.
- Las diferencias en diámetro del molino, longitud, fracción de llenado de bolas, tamaño de bolas, velocidad crítica y configuración del discharge (grate vs. overflow) afectan directamente la relación entre F80, P80 y consumo energético, haciendo que los valores absolutos no sean comparables entre operaciones.

### 5.3 Diferencias de Escala y Configuración de Circuito

- Constancia procesa entre 1,351 y 2,224 t/h por línea SAG con circuitos SAG-Ball Mill-Pebble Crusher. El modelo M-3 simula un rango de throughput diferente (aproximadamente 4,000–5,000 t/h totales) para una flota de 8 camiones de 240 t y 2 palas, lo que representa una escala operacional distinta.
- El efecto de escala en la molienda es no lineal: la energía específica no escala proporcionalmente con el tonelaje debido a las economías de escala en el consumo de energía y a los efectos de tamaño del molino (ley de Bond).

### 5.4 Diferencias de Condiciones Operacionales y Temporales

- Las mediciones de Constancia abarcan un periodo de tres años (junio 2017 a septiembre 2020), durante los cuales el molino experimentó cambios de liners, desgaste progresivo, ajustes de fracción de llenado de bolas y modificaciones en la configuración del circuito. El modelo M-3 no captura la degradación temporal de los componentes mecánicos del molino.
- Los factores de corrección de Constancia varían entre 0.85 y 1.19 (rango del 40 %), indicando que las condiciones de operación no son estacionarias y que el modelo de planta requiere correcciones significativas según el estado del molino.

### 5.5 Tamaño y Representatividad de la Muestra

- El dataset contiene solo **14 mediciones** (surveys), lo que limita la potencia estadística de cualquier inferencia. Intervalos de confianza al 95 % son anchos (e.g., E_meas: [6.77, 9.01] kWh/t) y no permiten conclusiones robustas sobre la significancia de diferencias menores.
- La distribución desigual entre tipos de mena (10 hypogene vs. 4 supergene) introduce un sesgo hacia las características del mineral hypogene en las medias globales.

### 5.6 Incomparabilidad Directa con el Modelo M-3

- El modelo M-3 utiliza la ecuación **E_SAG = 8.2 × (P80/240)^0.38 × (RockA/7.2)^0.25** con P80 en milímetros y factor de roca A de Kuz-Ram. La planta Constancia utiliza un modelo de energía específica basado en SGI (SAG Grindability Index), F80 en milímetros y un factor de corrección empírico específico de la planta. Estas son formulaciones fundamentalmente diferentes con variables de entrada distintas.
- Los P80 de producto en Constancia (614–1,834 µm) son significativamente más finos que el P80 de alimentación (45.72–73.66 mm), mientras que el modelo M-3 acopla el P80 de fragmentación de voladura (142–240 mm) con el consumo SAG. Las escalas granulométricas son distintas y no directamente equivalentes.
- **Por lo tanto, este análisis no debe interpretse como una validación, calibración ni ajuste del motor M-3**, sino como un estudio académico independiente sobre datos reales de molienda SAG que aporta contexto empírico sobre el comportamiento de esta unidad operacional.

### 5.7 Limitaciones de Transferibilidad

- Los resultados estadísticos (correlaciones, métricas de error, rangos de energía específica) son específicos de la configuración Constancia y no deben extrapolarse a otras operaciones sin recalibración con datos locales.
- Las correlaciones observadas (e.g., SGI-Energía con r = 0.96) pueden no mantenerse en yacimientos con mineralogías distintas, circuitos de molienda alternativos o escalas diferentes.

---

## 6. Conclusiones

1. Las estadísticas descriptivas muestran que el dataset de Constancia abarca un rango operativo amplio (F80: 45.72–73.66 mm; SGI: 30–122 min; E_meas: 5.4–11.4 kWh/t), representativo de dos tipos de mena (hypogene y supergene) con comportamientos energéticos claramente diferenciados.

2. El modelo de planta calcula la energía específica con una correlación fuerte respecto a las mediciones reales (r = 0.919, R² = 0.845), con un RMSE de 0.845 kWh/t y un MAPE de 8.88 %. El sesgo medio es marginal (−0.136 kWh/t), indicando una leve subestimación del modelo.

3. El SGI es el predictor más fuerte de la energía específica (r = 0.96 con E_calc y r = 0.94 con E_meas), seguido por el tonelaje (r = −0.91 a −0.98) y el F80 (r = 0.61 a 0.67). Esto confirma que la dureza del mineral es el factor dominante en el consumo energético SAG, por encima del tamaño de alimentación.

4. El mineral hypogene consume en promedio 3.05 kWh/t más que el supergene (8.82 vs. 5.57 kWh/t en mediciones de planta), con mayor dispersión interna (SD = 1.80 vs. 0.21), reflejando la heterogeneidad mineralógica del hypogene a lo largo del periodo de medición.

5. El 64.3 % de los surveys presentan errores inferiores al 10 %, mientras que el 14.3 % excede el 15 % de error, correspondiendo a casos atípicos en la línea 2 con mineral hypogene y factores de corrección extremos.

6. El análisis es estrictamente independiente del motor M-3 y no constituye una calibración ni validación del mismo, debido a las diferencias fundamentales en yacimiento, equipamiento, escala, formulación del modelo de energía y escalas granulométricas entre la operación Constancia y el contexto modelado por M-3.

---

## 7. Referencias

Hudbay Minerals Inc. (2017–2020). *SAG mill performance surveys, Constancia operation* [Datos no publicados]. Tabla 13.2.

Morrell, S. (2004). An alternative energy–size relationship to that proposed by Bond for the design and optimisation of grinding circuits. *International Journal of Mineral Processing*, *74*(3–4), 133–141.

Bond, F. C. (1952). The third theory of comminution. *Mining Engineering*, *4*(5), 484–494.

Amelunxen, P., Meadows, D., & Lam, M. (2013). The appropriateness of using the SAG grindability index to design SAG mills. *Proceedings of the 45th Annual Canadian Mineral Processors Conference* (pp. 297–310). Canadian Institute of Mining.
