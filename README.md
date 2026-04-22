# Atlas 3D del Cuerpo Humano

Proyecto web educativo para secundaria. Permite explorar sistemas del cuerpo humano desde un menu principal, abrir una vista interna por sistema y usar un recorrido guiado tipo presentacion.

## Estado actual

- Menu liviano con previews estaticas.
- Modelos 3D cargados solo al entrar a cada sistema.
- Buscador de organos para abrir el sistema correcto.
- Indice rapido de sistemas desde cualquier vista.
- Modos de vista: completa, solo modelo y solo ficha.
- Puntos clickeables sobre el visor.
- Tarjetas de organos y estructuras.
- Modo clase con avance por sistemas y cierre final.
- Pantalla completa.
- Creditos visibles para compartir.

## Como abrir

Usar un servidor local desde esta carpeta:

```bash
python -m http.server 8000
```

Luego abrir:

```text
http://localhost:8000
```

Tambien funciona con Live Server de VS Code.

## Archivos principales

- `index.html`: estructura general.
- `styles.css`: interfaz, responsive y pulido visual.
- `app.js`: flujo, visores 3D, modo clase, hotspots y navegacion.
- `data.js`: contenido educativo, organos, sistemas y puntos interactivos.
- `assets/models/`: modelos `.glb` activos.
- `GUIA_DOCENTE.md`: instrucciones de uso para profesores.
- `assets/README.md`: organizacion de assets y reemplazo de modelos.

## Modelos

La fuente principal actual es Z-Anatomy:

- https://github.com/LluisV/Z-Anatomy
- Licencia indicada por el proyecto: CC BY 4.0

Algunos modelos funcionan como placeholders mientras se consiguen o exportan alternativas mejores. La arquitectura permite reemplazar cada `.glb` sin reescribir la app.

## Reemplazar un modelo

1. Exportar el nuevo modelo como `.glb`.
2. Guardarlo en `assets/models/`.
3. Mantener el nombre esperado, por ejemplo `muscular.glb`.
4. Recargar con `Ctrl + F5`.

El mapeo de modelos esta documentado en `assets/models/README.md`.
