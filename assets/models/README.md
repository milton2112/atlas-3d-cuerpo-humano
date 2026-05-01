# Modelos 3D activos

Esta carpeta contiene los `.glb` que carga la app.

## Fuente principal

- Z-Anatomy, repositorio oficial: https://github.com/LluisV/Z-Anatomy
- Rama usada para FBX: `PC-Version/Resources/Models/FBX`
- Licencia indicada por el proyecto: CC BY 4.0

## Mapeo actual

- `skeletal.glb`: `SkeletalSystem100.fbx`
- `muscular.glb`: `MuscularSystem100.fbx`
- `nervous.glb`: `NervousSystem100.fbx`
- `circulatory.glb`: `CardioVascular41.fbx`
- `lymphatic.glb`: `LymphoidOrgans100.fbx`
- `integumentary.glb`: `Regions of human body100.fbx`
- `respiratory.glb`: subset limpio de `VisceralSystem100.fbx`
- `digestive.glb`: subset limpio de `VisceralSystem100.fbx`
- `urinary.glb`: subset limpio de `VisceralSystem100.fbx`
- `endocrine.glb`: subset limpio de `VisceralSystem100.fbx`
- `reproductive-male.glb`: subset limpio de `VisceralSystem100.fbx`
- `reproductive-female`: pendiente de modelo fuente real compatible. La app usa una vista temporal generada por codigo.

## Nota

Como cada sistema se muestra en su propio panel, ya no hace falta que todos los modelos queden superpuestos sobre un mismo cuerpo. La prioridad es que cada sistema se vea bien de forma independiente.

Los modelos grandes activos fueron restaurados desde fuentes FBX de Z-Anatomy y convertidos a GLB. Si se vuelven a optimizar, revisar visualmente que no se deformen estructuras finas.
