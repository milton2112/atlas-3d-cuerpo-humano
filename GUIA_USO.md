# Guia de uso rapida

## Objetivo

Usar el atlas como un material interactivo para explorar sistemas del cuerpo humano por link, con una navegacion simple, modelos, organos clave y recorridos guiados.

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

## Como usar

1. Mostrar la portada en pantalla completa.
2. Elegir un sistema desde el menu o tocar `Empezar recorrido guiado`.
3. Dentro de cada sistema:
   - rotar el modelo si esta disponible;
   - cambiar entre vista completa, solo modelo o solo ficha;
   - tocar puntos sobre el visor;
   - tocar tarjetas de organos para leer informacion.
4. Usar el buscador para ir rapido a un organo, por ejemplo corazon, pulmones o rinones.
5. En el recorrido guiado, usar "Siguiente sistema" para avanzar.
6. Al finalizar, volver al menu para repasar sistemas puntuales.

## Recorrido sugerido para sistema digestivo

1. Entrar a `Sistema digestivo`.
2. Mostrar primero la introduccion del sistema.
3. Senalar boca, faringe, estomago, higado, pancreas, intestino delgado e intestino grueso en el visor.
4. Abrir `Abrir proceso digestivo completo` para pasar a la secuencia detallada.
5. Si se proyecta en grupo o se comparte por link, usar `Abrir recorrido guiado` o copiar el `link del digestivo`.

### Ideas clave para remarcar

- Comer no alcanza: hay que transformar el alimento para que las celulas lo aprovechen.
- La digestion tiene una parte mecanica y otra quimica.
- La mayor parte de la absorcion ocurre en el intestino delgado.
- El intestino grueso no absorbe nutrientes principales: recupera agua y prepara la eliminacion.

## Si algo no carga

- Recargar con `Ctrl + F5`.
- Verificar que se este abriendo desde servidor local y no directamente como archivo.
- Si un modelo 3D falla, la app conserva una vista temporal para no cortar el recorrido.

## Creditos

Modelos base: Z-Anatomy, licencia CC BY 4.0.

## Nota de mantenimiento

Los modelos actuales funcionan como base reemplazable. Para mejorar el atlas, solo hace falta sustituir archivos `.glb` en `assets/models/` manteniendo los nombres documentados en la app.
