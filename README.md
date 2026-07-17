# Atlas 3D del Cuerpo Humano

[![Validar atlas](https://github.com/milton2112/atlas-3d-cuerpo-humano/actions/workflows/validate.yml/badge.svg)](https://github.com/milton2112/atlas-3d-cuerpo-humano/actions/workflows/validate.yml)

Atlas interactivo para explorar sistemas del cuerpo humano con modelos 3D, fichas breves, hotspots y recorridos guiados. El proyecto esta pensado para compartirse por link y funcionar tanto como apoyo en clase como para exploracion individual.

**Version actual:** Digestivo Aula 2026 (julio 2026). Esta version prioriza la unidad de sistema digestivo, rendimiento mobile, fichas mas concentradas dentro del proceso y una navegacion mas clara para alumnos.

## Que incluye hoy

- Portada clara con acceso rapido a sistemas y recorrido guiado.
- Tarjetas por sistema con estado visible del modelo.
- Vista interna por sistema con:
  - modelo 3D o fallback temporal;
  - puntos clickeables sobre organos;
  - ficha breve del sistema;
  - organos y estructuras destacadas.
- Unidad especial del **Sistema digestivo** con:
  - introduccion propia;
  - proceso paso a paso con fichas de estudio por etapa;
  - recorrido guiado proyectable;
  - fichas de organos, conceptos clave y cierre final.

## Como abrirlo

1. Abrir esta carpeta en la compu.
2. Iniciar un servidor local:

```bash
npm start
```

3. Entrar en el navegador a:

```text
http://localhost:8000
```

Tambien sirve Live Server de VS Code o cualquier servidor estatico simple.

## Como usarlo

1. Entrar a un sistema desde el menu principal.
2. Mirar el modelo y usar los puntos interactivos.
3. Cambiar entre:
   - `Vista completa`
   - `Solo modelo`
   - `Solo ficha`
4. Usar el buscador para ir rapido a un organo.
5. En Digestivo, abrir:
   - `Abrir proceso digestivo completo`
   - `Abrir recorrido guiado`
   - `Copiar link del digestivo`

## Ruta recomendada para Digestivo

1. Ver la introduccion del sistema.
2. Senalar boca, faringe, esofago, estomago, higado, pancreas, intestino delgado e intestino grueso.
3. Abrir la secuencia completa del proceso digestivo.
4. Usar el recorrido guiado para repasar de forma proyectable.
5. Cerrar con el repaso final del sistema.

## Estructura principal

- `index.html`: estructura de la app.
- `app.js`: logica de navegacion, visores y hotspots.
- `styles.css`: estilos visuales y responsive.
- `data.js`: contenido educativo, organos, pasos y configuracion.
- `GUIA_USO.md`: guia corta de uso y recorrido sugerido.
- `PERFORMANCE.md`: criterios de rendimiento, version mobile y auditoria de release.

## Verificacion antes de compartir

```bash
npm run check
```

La auditoria avisa si faltan assets o si hay modelos demasiado pesados para publicar sin una version mobile.

GitHub Actions ejecuta la misma verificacion en cada push y pull request, ademas de una revision semanal. Dependabot revisa mensualmente las versiones de las acciones usadas por el repositorio.

## Modelos y creditos

- Base principal de varios modelos: **Z-Anatomy** ([GitHub](https://github.com/LluisV/Z-Anatomy)), licencia **CC BY-SA 4.0**.
- Digestivo, urinario y reproductor femenino usan modelos de Sketchfab con licencia **CC BY 4.0**; ver `CREDITOS.md`.
- Algunos sistemas usan modelos temporales o en revision.
- La app esta preparada para reemplazar assets 3D sin rehacer navegacion, textos ni hotspots.

## Estado actual

- Digestivo: unidad mas avanzada y trabajada.
- Oseo / muscular: presentables.
- Nervioso / circulatorio / otros: funcionales, con partes en revision segun el asset disponible.
- Algunos sistemas siguen con placeholders o modelos temporales mientras se consiguen versiones mejores.
- En celular, el menu usa vistas livianas y el modelo 3D se abre bajo demanda para mejorar la carga inicial.
- El modelo urinario usa materiales PBR estandar y compresion Meshopt; paso de 48,3 MB a 10,05 MB sin eliminar triangulos.

## Si algo falla

- Recargar con `Ctrl + F5`.
- Confirmar que la app se abrio desde servidor local y no con doble clic sobre el HTML.
- Si un modelo tarda o falla, la app intenta mostrar una vista temporal para sostener el recorrido.
