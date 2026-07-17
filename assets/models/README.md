# Modelos 3D activos

Esta carpeta contiene los `.glb` que carga la app.

## Fuente principal

- Z-Anatomy, repositorio oficial: https://github.com/LluisV/Z-Anatomy
- Rama usada para FBX: `PC-Version/Resources/Models/FBX`
- Licencia indicada por el proyecto: CC BY-SA 4.0

## Mapeo actual

- `skeletal.glb`: `SkeletalSystem100.fbx`
- `muscular.glb`: `MuscularSystem100.fbx`
- `nervous.glb`: `NervousSystem100.fbx`
- `circulatory.glb`: `CardioVascular41.fbx`
- `integumentary.glb`: `Regions of human body100.fbx`
- `respiratory.glb`: subset limpio de `VisceralSystem100.fbx`
- `digestive.glb`: modelo Digestive-system de jalmer, Sketchfab, CC BY 4.0.
- `urinary.glb`: modelo Urinary System Final de Hannah Koffman, Sketchfab, CC BY 4.0; convertido a PBR estandar y comprimido con Meshopt sin simplificacion geometrica.
- `endocrine.glb`: subset limpio de `VisceralSystem100.fbx`
- `reproductive-male.glb`: subset limpio de `VisceralSystem100.fbx`
- `reproductive-female.glb`: modelo Female Reproductive System de The Period App, Sketchfab, CC BY 4.0.

Ver `attributions.json` para autores, fuentes y licencias completas de cada archivo activo.

El sistema linfatico usa una vista temporal generada por codigo hasta conseguir un modelo real compatible.

## Nota

Como cada sistema se muestra en su propio panel, ya no hace falta que todos los modelos queden superpuestos sobre un mismo cuerpo. La prioridad es que cada sistema se vea bien de forma independiente.

Los modelos grandes activos fueron restaurados desde fuentes FBX de Z-Anatomy y convertidos a GLB. Si se vuelven a optimizar, revisar visualmente que no se deformen estructuras finas.

`urinary.glb` requiere `MeshoptDecoder`, configurado en `app.js`. La auditoria de release comprueba esa integracion automaticamente.
