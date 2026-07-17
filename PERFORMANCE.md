# Rendimiento y publicacion

## Estado actual

- El menu principal carga previews 3D solo en escritorio.
- En celular, el menu usa vistas livianas y cada sistema descarga el modelo 3D recien cuando se toca `Abrir modelo 3D`.
- El visor 3D usa menor resolucion en pantallas chicas para reducir trabajo de GPU.
- El modelo urinario usa materiales PBR estandar y compresion Meshopt: paso de 48,3 MB a 10,05 MB sin simplificar la anatomia.
- `nervous.glb` paso de 44,77 MB a 7,91 MB con Meshopt y conserva todos los triangulos.
- `circulatory.glb` paso de 37,91 MB a 13,33 MB con Meshopt y conserva todos los triangulos.
- Las imagenes de la unidad digestiva son locales, asi que no dependen de Wikimedia para abrir la clase.
- La auditoria local revisa assets faltantes, datos basicos y modelos pesados.

## Verificacion rapida

```bash
npm run check
```

El archivo `tools/model-budgets.json` fija un limite por modelo activo. La auditoria falla si un GLB nuevo supera el peso aceptado, si falta un asset o si aparecen IDs educativos duplicados.

## Automatizaciones

- GitHub Actions valida cada push y pull request.
- Una ejecucion programada repite la auditoria cada lunes.
- Dependabot revisa mensualmente las acciones de GitHub.
- `npm start` abre el servidor local en el puerto 8000.

## Modelos que mas pesan

- `skeletal.glb` y `muscular.glb`: revisar optimizacion antes de publicar.

No conviene decimarlos a ciegas: las estructuras finas pueden deformarse. Si se optimizan, probar visualmente cada sistema despues.

## Regla para seguir agregando contenido

1. Guardar solo assets usados por la app.
2. Mantener descargas y pruebas fuera de `assets/`.
3. Usar imagenes locales para clases que deben funcionar sin depender de terceros.
4. Revisar licencias antes de publicar.
5. Correr la auditoria antes de compartir una nueva version.
