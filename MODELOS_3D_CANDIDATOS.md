# Modelos 3D candidatos

Busqueda revisada el 2026-04-24. Lista de reemplazos posibles para sistemas que todavia estan temporales o en revision. Priorizar modelos con descarga libre, licencia clara y peso razonable para compartir con alumnos.

> Nota practica: Sketchfab suele requerir iniciar sesion para descargar. AnatomyTOOL enlaza varios modelos embebidos de Sketchfab y muestra la linea de credito/licencia, pero no siempre ofrece formato directo. Cuando el ZIP/GLB quede en `Descargas`, se integra convirtiendolo a `assets/models/*.glb`.

## Prioridad alta

| Sistema | Candidato | Licencia indicada | Uso sugerido | Enlace |
| --- | --- | --- | --- | --- |
| Reproductor masculino | Male Reproductive System, brianj.seely | CC BY | Mejor primer candidato: peso moderado y licencia simple. | https://sketchfab.com/3d-models/male-reproductive-system-9e2b280a9409480496ec76088eb65b63 |
| Reproductor masculino | MALE REPRODUCTIVE SYSTEM, prabhatsharma8030 | CC BY | Alternativa con mas descargas; revisar orientacion y limpieza. | https://sketchfab.com/3d-models/male-reproductive-system-17bdcd1c2e9046d1abde72eff5c2cd0d |
| Respiratorio | Respiratory System, brianj.seely | CC BY | Mejor primer candidato: completo y no exageradamente pesado. | https://sketchfab.com/3d-models/respiratory-system-34ef811ecdd14eb99433daf26fcb8061 |
| Respiratorio | Human Lung 3D, 3D EduTex | CC BY | Alternativa liviana si se prioriza rendimiento sobre detalle completo. | https://sketchfab.com/3d-models/human-lung-3d-cb992e6cacf5411884828142aec8d596 |
| Digestivo | Digestive-system, jalmer | CC BY | Descargado e integrado como `digestive.glb`; falta revision visual final. | https://sketchfab.com/3d-models/digestive-system-a4df1a9616974eada72013f19551d7e7 |
| Digestivo | digestive system, 7D production | CC BY | Alternativa liviana y muy descargada. | https://sketchfab.com/3d-models/digestive-system-f78ce703805f49d3b732e37be5b93188 |
| Urinario | Urinary System Final, Hannah Koffman | CC BY | Descargado e integrado como `urinary.glb`; pesa bastante y requiere revision de rendimiento. | https://sketchfab.com/3d-models/urinary-system-final-4258252eb7c04e748ab7501eb5f1abb1 |
| Urinario | Urinary system, 10930903MandyHo | CC BY | Alternativa completa de peso medio. | https://sketchfab.com/3d-models/3780929cbff345fc901aa50e4fe58a27 |
| Endocrino | Endocrine System, brianj.seely | CC BY | Candidato principal para reemplazar el modelo temporal. | https://sketchfab.com/3d-models/endocrine-system-b10f70cacb6946da851e5696291398a5 |
| Endocrino | Endocrine System, stogoskij | CC BY | Alternativa si el anterior no encuadra bien. | https://sketchfab.com/3d-models/endocrine-system-79e4c5dd1a4c443ab68bbf542a62b96d |
| Linfatico | Lymphatic System, brianj.seely | CC BY | Mejor primer candidato para reemplazar el GLB raro actual. | https://sketchfab.com/3d-models/lymphatic-system-286b841af50143e58d4c5fcbfd41fbbe |

## Prioridad media

| Sistema | Candidato | Licencia indicada | Uso sugerido | Enlace |
| --- | --- | --- | --- | --- |
| Linfatico | Lymphatic System: an overview | CC BY-NC-SA | Buen modelo educativo, pero con restriccion no comercial. Revisar antes de publicarlo. | https://anatomytool.org/content/lymphatic-system-overview |
| Linfatico | Dundee - 3D model Lymphatic system | CC BY-NC-SA | Vista completa del sistema linfatico. Licencia no comercial. | https://anatomytool.org/content/dundee-3d-model-lymphatic-system |
| Reproductor femenino | Vallance - 3D model Female reproductive organs | CC BY | Alternativa academica si el GLB descargado no queda bien. | https://anatomytool.org/content/vallance-3d-model-female-reproductive-organs |
| Reproductor femenino | Female Reproductive System, Stanford EdTech | CC BY | Alternativa completa con organos, huesos y tejidos. Puede requerir limpieza. | https://sketchfab.com/3d-models/female-reproductive-system-c4d5e725198d4a1997c641d548bb20ce |

## Sistemas que ya tienen base aceptable

| Sistema | Estado actual | Proximo criterio |
| --- | --- | --- |
| Oseo | Z-Anatomy presentable | Mantener salvo que aparezca un modelo mas liviano y limpio. |
| Muscular | Z-Anatomy presentable | Mantener; ajustar solo camara/materiales si hace falta. |
| Tegumentario | Modelo actual aprobado | Mantener. No buscar reemplazo salvo que el usuario lo pida. |
| Digestivo | GLB descargado integrado | Revisar encuadre/materiales/licencia antes de marcar como presentable. |
| Urinario | GLB descargado integrado | Revisar encuadre/materiales/licencia y optimizar por peso. |
| Reproductor femenino | GLB descargado integrado | Revisar encuadre/materiales/licencia antes de marcar como presentable. |

## Regla para integrar

1. Descargar el modelo en formato GLB/GLTF si esta disponible; si no, usar FBX/OBJ y convertir con Blender.
2. Guardar el archivo final en `assets/models/` con el nombre esperado por `app.js`.
3. Optimizar o limpiar en Blender si el archivo trae ejes, etiquetas, esqueletos extra o materiales negros.
4. Actualizar `CREDITOS.md` con autor, fuente, licencia y adaptaciones.
5. Probar encuadre en menu y en vista interna antes de marcarlo como presentable.
