# Rendimiento y publicacion

## Estado actual

- El menu principal carga previews 3D solo en escritorio.
- En celular, el menu usa vistas livianas y cada sistema descarga el modelo 3D recien cuando se toca `Abrir modelo 3D`.
- El visor 3D usa menor resolucion en pantallas chicas para reducir trabajo de GPU.
- Las imagenes de la unidad digestiva son locales, asi que no dependen de Wikimedia para abrir la clase.
- La auditoria local revisa assets faltantes, datos basicos y modelos pesados.

## Verificacion rapida

```bash
node --check app.js
node --check data.js
node tools/audit_release.mjs
```

## Modelos que mas pesan

- `urinary.glb`: requiere version mobile.
- `nervous.glb`: requiere version mobile.
- `circulatory.glb`: requiere version mobile.
- `skeletal.glb` y `muscular.glb`: revisar optimizacion antes de publicar.

No conviene decimarlos a ciegas: las estructuras finas pueden deformarse. Si se optimizan, probar visualmente cada sistema despues.

## Regla para seguir agregando contenido

1. Guardar solo assets usados por la app.
2. Mantener descargas y pruebas fuera de `assets/`.
3. Usar imagenes locales para clases que deben funcionar sin depender de terceros.
4. Revisar licencias antes de publicar.
5. Correr la auditoria antes de compartir una nueva version.
