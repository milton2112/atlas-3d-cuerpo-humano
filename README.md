# Atlas 3D del Cuerpo Humano

Proyecto web educativo para secundaria. Permite explorar sistemas del cuerpo humano desde un menu principal, abrir una vista interna por sistema y usar un recorrido guiado tipo presentacion.

## Estado actual

- Menu principal con tarjetas por sistema y estados visibles: `Presentable`, `En revision` o `Temporal`.
- Previews 3D livianas en el menu; los modelos pesados se difieren para no trabar notebooks lentas.
- Vista interna por sistema con tres modos: `Vista completa`, `Solo modelo` y `Solo ficha`.
- Seccion "Que mirar primero" para orientar al alumno antes de leer detalles.
- Puntos clickeables sobre el visor y tarjetas de organos clave.
- Buscador de organos para abrir el sistema correspondiente.
- Indice rapido de sistemas desde cualquier vista.
- Modo clase tipo presentacion, con avance por sistemas y cierre final.
- Pantalla completa, guia visible y creditos para compartir.
- Arquitectura preparada para reemplazar modelos `.glb` sin rehacer la app.

## Como abrir

Usar un servidor local desde esta carpeta. Si tenes VS Code, Live Server tambien sirve.

```bash
node tools/local_smoke_server.js 8000
```

Luego abrir:

```text
http://localhost:8000
```

Tambien funciona con Live Server de VS Code. Evitar abrir `index.html` directamente como archivo, porque algunos navegadores bloquean la carga de modelos.

## Archivos principales

- `index.html`: estructura general.
- `styles.css`: interfaz, responsive y pulido visual.
- `app.js`: flujo, visores 3D, modo clase, hotspots y navegacion.
- `data.js`: contenido educativo, organos, sistemas y puntos interactivos.
- `assets/models/`: modelos `.glb` activos.
- `GUIA_DOCENTE.md`: instrucciones de uso para profesores.
- `assets/README.md`: organizacion de assets y reemplazo de modelos.

## Modelos y licencias

La fuente principal actual es Z-Anatomy:

- https://github.com/LluisV/Z-Anatomy
- Licencia indicada por el proyecto: CC BY 4.0

Algunos modelos funcionan como vistas temporales mientras se consiguen o exportan alternativas mejores. La arquitectura permite reemplazar cada `.glb` sin reescribir la app.

Antes de compartir publicamente una version final, revisar `CREDITOS.md` y confirmar que cada asset externo mantenga su atribucion y licencia.

## Reemplazar un modelo

1. Exportar el nuevo modelo como `.glb`.
2. Guardarlo en `assets/models/`.
3. Mantener el nombre esperado, por ejemplo `muscular.glb`.
4. Recargar con `Ctrl + F5`.

El mapeo de modelos esta documentado en `assets/models/README.md`.

## Uso sugerido en clase

1. Abrir el atlas y elegir un sistema desde el menu.
2. Usar `Solo modelo` para explicar visualmente.
3. Abrir organos clave para leer ubicacion, funcion y dato breve.
4. Activar `Empezar modo clase` para recorrer todos los sistemas.

## Si un modelo tarda o falla

- Esperar el mensaje `Cargando modelo...`; los GLB grandes pueden tardar unos segundos.
- Probar `Ctrl + F5` si el navegador conserva una version anterior.
- Si un sistema muestra vista temporal, la clase puede continuar igual.
- Los modelos pesados del menu se cargan de forma diferida para priorizar estabilidad.
