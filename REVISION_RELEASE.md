# Revision de release

## Verificaciones realizadas

- El repositorio remoto clona correctamente desde GitHub.
- El clon incluye los modelos `.glb` activos necesarios para abrir la app.
- `app.js` y `data.js` pasan validacion sintactica con Node.
- `tools/audit_release.mjs` revisa assets, datos y peso de modelos antes de compartir.
- La app responde desde un servidor local temporal:
  - `index.html`: 200
  - `app.js`: 200
  - `data.js`: 200
  - `assets/models/skeletal.glb`: 200

## Flujo de alumno revisado en codigo

- Portada con instrucciones breves.
- Menu por sistemas.
- Buscador de organos.
- Indice rapido de sistemas.
- Vista interna por sistema.
- Boton volver al menu.
- Modos: vista completa, solo modelo y solo ficha.
- Puntos clickeables y tarjetas de organos.
- Modo clase con avance, cierre final y resumen.
- Mensajes de carga, modelo temporal y error de modelo.
- En celular, el menu usa vistas livianas y el GLB se descarga bajo demanda desde cada sistema.

## Estado de modelos

| Sistema | Estado | Nota |
| --- | --- | --- |
| Tegumentario | Usable | Base corporal general. Puede reemplazarse por un modelo tegumentario mas claro. |
| Oseo | Presentable | Modelo real Z-Anatomy restaurado. |
| Muscular | Presentable | Modelo real Z-Anatomy restaurado. |
| Nervioso | Revisar | Modelo real con estructuras finas; puede exigir mas rendimiento. |
| Circulatorio | Revisar | Modelo real con vasos finos; conviene usar solo modelo al proyectar. |
| Respiratorio | Usable | Subset visceral compatible. |
| Digestivo | Usable | Modelo Sketchfab CC BY 4.0, fuente y autor confirmados. |
| Urinario | Usable | Modelo Sketchfab CC BY 4.0, convertido a PBR estandar y comprimido con Meshopt sin eliminar triangulos. |
| Endocrino | Usable | Subset liviano de glandulas. |
| Linfatico | Revisar | Sirve como organos linfoides, no como red linfatica completa. |
| Reproductor masculino | Usable | Subset visceral liviano. |
| Reproductor femenino | Usable | Modelo Sketchfab CC BY 4.0, fuente y autor confirmados. |

## Optimizacion aplicada

Peso actual de los modelos grandes restaurados desde fuentes FBX de Z-Anatomy:

- `skeletal.glb`: 28.2 MB.
- `muscular.glb`: 26.5 MB.
- `nervous.glb`: 44.8 MB.
- `circulatory.glb`: 37.9 MB.
- `urinary.glb`: 48.3 MB a 10.05 MB con PBR estandar y Meshopt, conservando 17 meshes y todos los triangulos.

Si se vuelven a optimizar, revisar visualmente que no se deformen estructuras finas.

## Advertencias de rendimiento pendientes

La auditoria actual marca como pesados:

- `nervous.glb`
- `circulatory.glb`
- `skeletal.glb`
- `muscular.glb`

La mejora recomendada es crear variantes mobile o reexportar con una optimizacion visualmente revisada, no borrar los modelos activos.

## Decisiones tomadas

- Las atribuciones se guardan en `assets/models/attributions.json` y forman parte de la auditoria automatica.
- Tegumentario queda como usable pero revisable, porque una piel/cuerpo completo educativo suele requerir un asset especifico.
- Los thumbnails reales se descartaron por ahora: los renders automaticos salian visualmente incorrectos por problemas del asset fuente.
- La app mantiene vistas temporales consistentes en el menu para no depender de thumbnails malos.

## Licencias

- Fuente principal activa: Z-Anatomy.
- Z-Anatomy: CC BY-SA 4.0.
- Modelos de Sketchfab activos: CC BY 4.0, con autor y fuente detallados en `CREDITOS.md`.
- Ver `CREDITOS.md` para creditos y nota de adaptaciones.
