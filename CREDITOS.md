# Creditos y licencias

## Modelos 3D activos

- Base principal: [Z-Anatomy](https://github.com/LluisV/Z-Anatomy).
- Licencia indicada por el proyecto fuente: Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0).
- Adaptaciones realizadas para este atlas: conversion a GLB, separacion por sistema, limpieza de ayudas visuales, recolor educativo y render de thumbnails.

## Modelos de Sketchfab

- `digestive.glb`: [Digestive-system](https://sketchfab.com/3d-models/digestive-system-a4df1a9616974eada72013f19551d7e7), por jalmer, licencia CC BY 4.0.
- `urinary.glb`: [Urinary System Final](https://sketchfab.com/3d-models/urinary-system-final-4258252eb7c04e748ab7501eb5f1abb1), por Hannah Koffman, licencia CC BY 4.0.
- `reproductive-female.glb`: [Female Reproductive System](https://sketchfab.com/3d-models/female-reproductive-system-89fbe9c118404161acb3e9c1b427a2c8), por The Period App, licencia CC BY 4.0.

La atribucion estructurada de todos los modelos activos esta en `assets/models/attributions.json` y se valida automaticamente antes de cada publicacion.

## Vistas temporales

Algunos sistemas todavia usan modelos temporales cuando no hay un GLB compatible o cuando conviene evitar una carga pesada. Estan preparados para reemplazarse sin reescribir la app.

## Limpieza de assets

Los experimentos 2D anteriores y modelos descartados se retiraron del repositorio de trabajo para reducir peso local. La experiencia principal actual usa los modelos activos de `assets/models/` y las imagenes de `assets/digestive/`.
