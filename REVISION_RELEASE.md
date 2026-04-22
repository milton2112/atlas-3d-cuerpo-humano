# Revision de release

## Verificaciones realizadas

- El repositorio remoto clona correctamente desde GitHub.
- El clon incluye los modelos `.glb` activos necesarios para abrir la app.
- `app.js` y `data.js` pasan validacion sintactica con Node.
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

## Estado de modelos

| Sistema | Estado | Nota |
| --- | --- | --- |
| Tegumentario | Usable | Base corporal general. Puede reemplazarse por un modelo tegumentario mas claro. |
| Oseo | Usable | Modelo real Z-Anatomy optimizado. |
| Muscular | Usable | Modelo real Z-Anatomy optimizado. |
| Nervioso | Revisar | Modelo real optimizado, puede conservar lineas finas. |
| Circulatorio | Revisar | Modelo real optimizado, puede verse cargado por vasos finos. |
| Respiratorio | Usable | Subset visceral compatible. |
| Digestivo | Usable | Subset visceral compatible. |
| Urinario | Usable | Subset visceral liviano. |
| Endocrino | Usable | Subset liviano de glandulas. |
| Linfatico | Revisar | Sirve como organos linfoides, no como red linfatica completa. |
| Reproductor masculino | Usable | Subset visceral liviano. |
| Reproductor femenino | Placeholder | Falta GLB real compatible. Se mantiene vista temporal para no romper la clase. |

## Optimizacion aplicada

Modelos grandes optimizados con `tools/cleanup_glb_model.py`:

- `skeletal.glb`: 28.2 MB a 20.9 MB.
- `muscular.glb`: 26.4 MB a 25.3 MB.
- `nervous.glb`: 44.7 MB a 27.7 MB.
- `circulatory.glb`: 37.9 MB a 23.8 MB.

Los originales quedaron en `assets/models/_source-originals/`, fuera del commit por `.gitignore`.

## Decisiones tomadas

- Reproductor femenino queda como placeholder hasta conseguir un modelo real compatible, en pose neutral y licencia clara.
- Tegumentario queda como usable pero revisable, porque una piel/cuerpo completo educativo suele requerir un asset especifico.
- Los thumbnails reales se descartaron por ahora: los renders automaticos salian visualmente incorrectos por problemas del asset fuente.
- La app mantiene placeholders consistentes en el menu para no depender de thumbnails malos.

## Licencias

- Fuente principal activa: Z-Anatomy.
- Licencia indicada por el proyecto fuente: CC BY 4.0.
- Ver `CREDITOS.md` para creditos y nota de adaptaciones.
