# Atlas 3D del Cuerpo Humano

Atlas interactivo para explorar sistemas del cuerpo humano con modelos 3D, fichas breves, hotspots y recorridos guiados. El proyecto esta pensado para compartirse por link y funcionar tanto como apoyo en clase como para exploracion individual.

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
  - proceso paso a paso;
  - recorrido guiado proyectable;
  - fichas de organos y cierre final.

## Como abrirlo

1. Abrir esta carpeta en la compu.
2. Iniciar un servidor local:

```bash
node tools/local_smoke_server.js 8000
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

## Modelos y creditos

- Base principal de varios modelos: **Z-Anatomy** ([GitHub](https://github.com/LluisV/Z-Anatomy)), licencia **CC BY 4.0**.
- Algunos sistemas usan modelos temporales o en revision.
- La app esta preparada para reemplazar assets 3D sin rehacer navegacion, textos ni hotspots.

## Estado actual

- Digestivo: unidad mas avanzada y trabajada.
- Oseo / muscular: presentables.
- Nervioso / circulatorio / otros: funcionales, con partes en revision segun el asset disponible.
- Algunos sistemas siguen con placeholders o modelos temporales mientras se consiguen versiones mejores.

## Si algo falla

- Recargar con `Ctrl + F5`.
- Confirmar que la app se abrio desde servidor local y no con doble clic sobre el HTML.
- Si un modelo tarda o falla, la app intenta mostrar una vista temporal para sostener el recorrido.
