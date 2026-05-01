# Guia docente rapida

## Objetivo

Usar el atlas como reemplazo interactivo de una presentacion lineal. Cada sistema se abre en una vista propia con modelo, organos clave, dato breve y pregunta guia.

## Como abrir

1. Abrir la carpeta del proyecto.
2. Iniciar un servidor local:

```bash
node tools/local_smoke_server.js 8000
```

3. Entrar en el navegador a:

```text
http://localhost:8000
```

Si se usa Live Server de VS Code, tambien sirve.

## Como usar en clase

1. Mostrar la portada en pantalla completa.
2. Elegir un sistema desde el menu o tocar "Empezar modo clase".
3. Dentro de cada sistema:
   - rotar el modelo si esta disponible;
   - cambiar entre vista completa, solo modelo o solo ficha;
   - tocar puntos sobre el visor;
   - tocar tarjetas de organos para leer informacion.
4. Usar el buscador para ir rapido a un organo, por ejemplo corazon, pulmones o rinones.
5. En modo clase, usar "Siguiente sistema" para avanzar.
6. Al finalizar, volver al menu para repasar sistemas puntuales.

## Si algo no carga

- Recargar con `Ctrl + F5`.
- Verificar que se este abriendo desde servidor local y no directamente como archivo.
- Si un modelo 3D falla, la app conserva una vista temporal para no cortar la clase.

## Creditos

Modelos base: Z-Anatomy, licencia CC BY 4.0.

## Nota de mantenimiento

Los modelos actuales funcionan como base reemplazable. Para mejorar el atlas, solo hace falta sustituir archivos `.glb` en `assets/models/` manteniendo los nombres documentados.
