# Iconos de mapa

Coloca los íconos de cada ubicación de los sitios turísticos aquí.

Rutas recomendadas:

- `src/assets/map-icons/lajas.png`
- `src/assets/map-icons/cocha.png`
- `src/assets/map-icons/galeras.png`
- `src/assets/map-icons/juanambu.png`

También puedes usar formatos `svg`, `webp`, `jpg` o `gif`, pero `png` o `svg` son los más seguros para iconos.

## Tamaños sugeridos

- Tamaño ideal: `64x64` píxeles.
- Tamaño máximo seguro: `96x96` píxeles.
- Tamaño mínimo recomendado: `48x48` píxeles.

### Por qué estos tamaños

- `64x64` es suficientemente claro para un botón en el mapa y no rompe el layout.
- `96x96` sigue siendo seguro en la mayoría de diseños, pero puede ocupar más espacio visual.
- `48x48` aún es legible y suficiente para íconos pequeños.

## Uso esperado en código

Una vez que copies tus archivos, el import sería algo como:

```ts
import lajasIcon from "@/assets/map-icons/lajas.png";
import cochaIcon from "@/assets/map-icons/cocha.png";
import galerasIcon from "@/assets/map-icons/galeras.png";
import juanambuIcon from "@/assets/map-icons/juanambu.png";
```

O si quieres mantener el directorio con nombres de ubicación:

- `src/assets/map-icons/lajas.svg`
- `src/assets/map-icons/cocha.svg`
- `src/assets/map-icons/galeras.svg`
- `src/assets/map-icons/juanambu.svg`

## Reemplazo

Simplemente copia tus archivos en esta carpeta con los nombres indicados y el proyecto podrá importarlos fácilmente.
