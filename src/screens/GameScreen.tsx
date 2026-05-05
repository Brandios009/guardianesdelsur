import { useEffect, useRef, useState } from "react";
import { useGame } from "@/store/game";
import { ArrowLeft, Maximize } from "lucide-react";

export const GameScreen = () => {
  const gameUrl = useGame((s) => s.gameUrl);
  const gameVictory = useGame((s) => s.gameVictory);
  const setScreen = useGame((s) => s.setScreen);
  const activeKey = useGame((s) => s.activeLocation);
  const locations = useGame((s) => s.locations);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [isGameReady, setIsGameReady] = useState(false);

  const handleFullscreen = () => {
    if (!iframeRef.current) return;
    const target = iframeRef.current as HTMLElement;
    if (target.requestFullscreen) {
      target.requestFullscreen();
    } else if ((target as any).webkitRequestFullscreen) {
      (target as any).webkitRequestFullscreen();
    }
  };

  const loc = locations.find((l) => l.key === activeKey);

  // Listen for messages from the Unity game
  useEffect(() => {
    setIsGameReady(false);

    const handleMessage = (event: MessageEvent) => {
      // Verify the message is from the game (adjust origin if needed)
      // For security, you may want to check event.origin
      
      if (event.data?.type === "GAME_VICTORY") {
        console.log("Victory event received from game");
        gameVictory();
      } else if (event.data?.type === "GAME_ERROR") {
        console.error("Game error:", event.data.message);
      } else if (event.data?.type === "GAME_READY") {
        console.log("Game loaded successfully");
        setIsGameReady(true);
        // Send initial data to the game if needed
        if (iframeRef.current?.contentWindow && loc) {
          iframeRef.current.contentWindow.postMessage(
            {
              type: "INIT_GAME",
              locationKey: activeKey,
              locationName: loc.name,
              bossName: loc.boss.name,
            },
            "*"
          );
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [gameVictory, activeKey, loc]);

  if (!gameUrl) {
    return (
      <section className="relative min-h-screen flex items-center justify-center px-4 py-10">
        <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
        <div className="relative z-10 text-center">
          <p className="eyebrow mb-4">— Error —</p>
          <p className="text-sm text-ink/70 mb-6">No hay URL del juego disponible</p>
          <button
            onClick={() => setScreen("boss")}
            className="btn-pixel"
          >
            ← Volver
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative h-screen flex flex-col bg-black overflow-hidden">
      {/* Top bar */}
      <div className="relative z-10 panel-pixel border-x-0 border-b px-4 py-3 flex items-center justify-between gap-2">
        <button
          onClick={() => setScreen("boss")}
          className="btn-ghost-pixel"
          aria-label="Volver"
        >
          <ArrowLeft className="w-3 h-3" /> Volver
        </button>
        <div className="flex items-center gap-2">
          <p className="font-pixel text-[8px] text-accent uppercase">
            Batalla: {loc?.boss.name}
          </p>
          <button
            type="button"
            onClick={handleFullscreen}
            className="btn-ghost-pixel"
            aria-label="Pantalla completa"
          >
            <Maximize className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Game iframe - fullscreen */}
      <div className="relative flex-1 overflow-hidden bg-black min-h-0">
        <iframe
          ref={iframeRef}
          src={gameUrl}
          title="Game Battle"
          className="absolute inset-0 w-full h-full border-0"
          allow="fullscreen; gamepad"
          allowFullScreen
          sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
          onLoad={() => setIsGameReady(true)}
        />
      </div>

      {/* Loading indicator while game is loading */}
      {!isGameReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/80 pointer-events-none z-10">
          <div className="text-center">
            <p className="font-pixel text-accent text-sm mb-4 animate-pulse">
              Cargando batalla...
            </p>
          </div>
        </div>
      )}
    </section>
  );
};
