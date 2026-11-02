# M-3 — prototipo de simulación y resultados de investigación

M-3 es un proyecto académico que estudia, mediante simulación, el ciclo mina-molino y distintas políticas de despacho. En el manuscrito actualizado se describe con precisión como un **modelo de simulación**, no como un gemelo digital conectado bidireccionalmente y en tiempo real con una operación minera.

## Estado de esta rama

La rama `main` contiene una versión anterior del prototipo web. Sus controles, resultados y documentación de ejecución no deben confundirse con el motor v3 utilizado para producir los resultados descritos en el manuscrito actualizado. La aplicación desplegada no se declara aquí como una implementación comprobada del motor v3.

El directorio [`research-results-v3/`](research-results-v3/README.md) incorpora un suplemento de resultados **estadísticos agregados** del paquete de investigación v3. Este suplemento permite consultar resúmenes, pero **no es un paquete íntegro de reproducción** y no permite regenerar los experimentos desde cero.

## Suplemento de resultados

Incluye:

- `experiment1_policy_summary.csv`: resumen descriptivo de diferencias relativas de las políticas frente a la asignación fija en el experimento 1.
- `experiment2_contrasts_summary.csv`: resumen de contrastes del experimento 2 por orientación de los frentes.

Los tamaños de muestra descritos en el paquete fuente son 57 600 registros para el experimento 1 y 72 000 para el experimento 2. Los archivos CSV de este suplemento no contienen observaciones individuales.

## Límites de reproducibilidad

El suplemento no incluye el motor ejecutable v3, scripts de simulación, datos fila por fila, pesos de agentes ni documentación que permita reconstruir por completo los experimentos. Las fechas consignadas en archivos de preinscripción del paquete de origen tampoco quedan verificadas históricamente por una carga posterior a GitHub.

La presencia de estos resúmenes no demuestra que la aplicación de esta rama o el despliegue web reproduzcan el motor v3. Cualquier publicación del manuscrito debe describir con exactitud qué artefactos están disponibles y cuáles no.

## Ejecutar el prototipo web de esta rama

Este comando inicia el prototipo contenido en esta rama; **no** reproduce los experimentos v3:

```bash
npm install
npm run dev
```

Consulta `package.json` para conocer los scripts y versiones de dependencias del prototipo.

## Uso responsable

Este repositorio es académico y de investigación por simulación. Los materiales no deben emplearse para diseño u operación de voladuras, dimensionamiento de cargas, control de equipos ni decisiones de ingeniería en campo. Los resultados de simulación no son mediciones de una mina real ni sustituyen la validación y supervisión profesional independiente.

## Licencia

Consulta [`LICENSE`](LICENSE) para las condiciones aplicables al código existente.
