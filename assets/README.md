# Organizacion de assets

## Activos usados por la app

- `assets/models/`: modelos `.glb` cargados en la vista interna de cada sistema.
- `assets/thumbnails/`: thumbnails livianos para el menu. Si falta una imagen, la app usa un placeholder consistente.
- `assets/models/_unused/`: modelos descartados o mezclados que no deben cargarse.

## Fuentes y conversion

- `assets/fbx/`: FBX originales descargados desde Z-Anatomy. No se cargan en runtime.
- `tools/convert_fbx_to_glb.py`: conversion general FBX a GLB.
- `tools/export_z_anatomy_subset.py`: separacion de subsets desde `VisceralSystem100.fbx`.
- `tools/cleanup_glb_model.py`: limpieza de lineas, ayudas y geometria no educativa.
- `tools/render_model_thumbnail.py`: render de thumbnails desde Blender.

## Assets historicos

- `assets/archive/2d-experiments/`: imagenes, SVG y fuentes de la etapa 2D. No forman parte del flujo principal actual.
- `assets/downloads/`: descargas fuente temporales. Conviene mantener esta carpeta vacia o liviana.

## Regla para reemplazar modelos

1. Exportar el nuevo modelo como `.glb`.
2. Guardarlo en `assets/models/`.
3. Usar el mismo nombre esperado, por ejemplo `skeletal.glb` o `respiratory.glb`.
4. Opcional: generar un PNG liviano en `assets/thumbnails/`.
5. Recargar el navegador con `Ctrl + F5`.
