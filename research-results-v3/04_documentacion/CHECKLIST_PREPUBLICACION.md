# Checklist antes de publicar en Zenodo

## Contenido

- [ ] Confirmar que el título y la lista de autores coinciden con la versión final del manuscrito.
- [ ] Confirmar que cada CSV M-3 corresponde a la versión de resultados que se cita en el artículo.
- [ ] Confirmar que el resumen agregado no se describe como datos elementales ni como reproducción íntegra.
- [ ] Comprobar que el archivo SAG conserva las 14 filas de la Tabla 13-2 y su atribución.
- [ ] Ejecutar `05_scripts/recalcular_constancia.py` en un entorno limpio y comparar las salidas.
- [ ] Confirmar si las Figuras S1 y S2 se citarán en el manuscrito como material suplementario; si no, retirarlas del depósito.
- [ ] Revisar derechos/licencia de cada archivo, especialmente la redistribución de la transcripción numérica de Hudbay.

## Reproducibilidad y versión

- [ ] Fijar una release/tag/commit del repositorio que corresponda a los experimentos descritos en el manuscrito.
- [ ] Alinear README y documentación del repositorio con el diseño experimental del artículo.
- [ ] Comprobar que los enlaces de código y datos apuntan a esa versión, no solamente a la rama móvil `main`.
- [ ] Describir con precisión qué puede reproducirse con este depósito y qué no.
- [ ] No afirmar que hubo auditoría externa si no se ha realizado.
- [ ] No presentar las fechas de protocolos como preinscripción previa sin evidencia verificable de su registro.

## Integridad

- [ ] Ejecutar `generar_manifest_sha256.ps1` como último paso.
- [ ] Revisar el manifiesto y abrir el ZIP resultante después de generarlo.
- [ ] No modificar ningún archivo tras generar el manifiesto. Si se modifica algo, regenerarlo.
- [ ] Guardar una copia local del ZIP exacto que se deposita.

## Zenodo y manuscrito

- [ ] Seleccionar una licencia compatible con los derechos de cada archivo.
- [ ] Revisar título, autores, afiliaciones, descripción y palabras clave de Zenodo.
- [ ] Publicar el depósito y copiar el DOI específico de la versión.
- [ ] Añadir el DOI al manuscrito y a la declaración de disponibilidad de materiales.
