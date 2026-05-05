# Integración del Juego Unity - Guía de Instalación

## Descripción General

El flujo de integración del juego de Unity es:

1. **Usuario hace click en "DERROTAR"** en BossScreen
2. Se establece la URL del juego en el store
3. Se muestra LoadingScreen mientras carga
4. Se abre GameScreen con el juego en un iframe
5. Cuando gana en Unity, envía evento `postMessage` a la web
6. Se desbloquea el sitio turístico y se muestra VictoryScreen

## Estructura de Carpetas

```
public/
└── games/
    ├── lajas/
    │   ├── index.html
    │   ├── index.js
    │   └── ...otros archivos del build
    ├── cocha/
    │   └── ...
    ├── galeras/
    │   └── ...
    └── juanambu/
        └── ...
```

## Pasos para Integrar

### 1. Preparar el Build de Unity

Exporta tu juego de Unity como WebGL. Unity generará una carpeta con:
- `index.html`
- `index.js`
- Archivos `.wasm` y `.data`
- Archivos estáticos

### 2. Copiar al Proyecto Web

1. Copia la carpeta completa del build de Unity a `public/games/{locationKey}/`
   - Reemplaza `{locationKey}` con: `lajas`, `cocha`, `galeras`, o `juanambu`
   - Asegúrate de que `index.html` está en `public/games/{locationKey}/index.html`

### 3. Implementar Comunicación en Unity

En tu script de Unity, cuando el jugador gana, envía un evento postMessage:

```csharp
// En C# (Unity)
public void OnVictory()
{
    #if UNITY_WEBGL && !UNITY_EDITOR
    SendMessage("JSBridge", "onVictory");
    #endif
}

// Luego en un script JavaScript o usando WebGL plugin:
// window.parent.postMessage(
//   { type: "GAME_VICTORY" },
//   "*"
// );
```

O más fácil, usando JavaScript directamente en el HTML/JS del build:

```javascript
// En tu juego, cuando ganas:
window.parent.postMessage({ type: "GAME_VICTORY" }, "*");
```

### 4. Datos Disponibles para el Juego

Cuando el juego carga, recibe un evento con información del contexto:

```javascript
window.addEventListener("message", (event) => {
  if (event.data?.type === "INIT_GAME") {
    const { locationKey, locationName, bossName } = event.data;
    console.log(`Batalla contra: ${bossName} en ${locationName}`);
  }
});
```

Datos disponibles:
- `locationKey`: "lajas" | "cocha" | "galeras" | "juanambu"
- `locationName`: Nombre del lugar (ej: "Las Lajas")
- `bossName`: Nombre del jefe (ej: "El Demonio de las Lajas")

### 5. Eventos que Puede Enviar el Juego

El juego puede enviar los siguientes eventos a través de `postMessage`:

**Victoria:**
```javascript
window.parent.postMessage({ type: "GAME_VICTORY" }, "*");
```

**Error:**
```javascript
window.parent.postMessage({
  type: "GAME_ERROR",
  message: "Descripción del error"
}, "*");
```

**Juego Listo:**
```javascript
window.parent.postMessage({ type: "GAME_READY" }, "*");
```

## Flujo Completo de Pantallas

```
BossScreen (sitio bloqueado)
    ↓ [Click "DERROTAR"]
LoadingScreen (carga del juego)
    ↓ [Progreso 100%]
GameScreen (iframe con juego de Unity)
    ↓ [Gana en el juego]
PostMessage: { type: "GAME_VICTORY" }
    ↓
VictoryScreen (pantalla de celebración)
    ↓ [Click "Volver al Mapa"]
MapScreen (sitio ahora está desbloqueado)
```

## Verificación de la Integración

Para verificar que todo funciona:

1. En la consola del navegador, deberías ver logs de:
   - "Victory event received from game"
   - "Game loaded successfully"

2. La URL del juego está en: `http://localhost:5173/games/{locationKey}/index.html`

3. El sitio turístico se marca como "unlocked" en Supabase

## Notas de Seguridad

- El sandbox del iframe está configurado con permisos mínimos
- Los eventos postMessage funcionan con `"*"` origin para desarrollo
- En producción, considera especificar el origin exacto

## Solución de Problemas

### El juego no carga
- Verifica que la ruta sea correcta: `public/games/{locationKey}/index.html`
- Abre la consola del navegador (F12) y busca errores CORS

### postMessage no se recibe
- Asegúrate de enviar: `window.parent.postMessage(...)`
- No olvides incluir `"*"` como segundo argumento

### Sitio no se desbloquea
- Verifica que el evento sea exactamente: `{ type: "GAME_VICTORY" }`
- Revisa que haya un jugador autenticado (no solo registro local)

## Ubicación de Archivos Clave

- **Store (configuración de pantallas)**: `src/store/game.ts`
- **GameScreen (renderiza el iframe)**: `src/screens/GameScreen.tsx`
- **BossScreen (botón Derrotar)**: `src/screens/BossScreen.tsx`
- **VictoryScreen (celebración)**: `src/screens/VictoryScreen.tsx`
- **Router (define qué se renderiza)**: `src/routes/index.tsx`

## URL Dinámica

La URL del juego se genera automáticamente en `BossScreen.tsx`:

```typescript
const gameUrl = `/games/${loc.key}/index.html`;
```

Puedes cambiar esto si tienes tus builds en un servidor diferente:

```typescript
const gameUrl = `https://games.tuservidor.com/${loc.key}/index.html`;
```

---

¡Cuando tengas el build del juego, simplemente cópialo a la carpeta correspondiente y listo!
