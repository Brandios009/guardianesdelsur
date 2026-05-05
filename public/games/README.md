# Integración de builds de Unity

Coloca aquí el contenido exportado de Unity para cada ubicación.

Cada ubicación debe tener su propio build, con una estructura como esta:

public/games/{locationKey}/
  ├── index.html
  ├── Build/
  ├── TemplateData/
  └── ...otros archivos generados por Unity

Reemplaza `{locationKey}` con uno de estos valores:
- lajas
- cocha
- galeras
- juanambu

La aplicación web cargará el juego desde:
`/games/{locationKey}/index.html`

Si tu exportación de Unity está dentro de una carpeta llamada `Build`, copia la carpeta `Build`, `TemplateData` y el archivo `index.html` directamente dentro de `public/games/{locationKey}/`.
