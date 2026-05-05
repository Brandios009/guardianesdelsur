import { useEffect, useState } from "react";
import { useGame } from "@/store/game";
import { Colibri } from "@/components/Colibri";

const QUOTES = [
  "Cuidado en el monte, que el Duende te trenza el pelo y te pierde en la niebla",
  "Pueblo pequeño, infierno grande",
  "Donde la tierra se enamoró, nació la Laguna de La Cocha, espejo del cielo",
  "No aceptes dulces de extraños en la quebrada; son heces que el Duende regala",
  "A altas horas de la noche, no todo lo que llora es humano, ni todo lo que brilla es oro",
];

export const LoadingScreen = () => {
  const setScreen = useGame((s) => s.setScreen);
  const activeKey = useGame((s) => s.activeLocation);
  const gameUrl = useGame((s) => s.gameUrl);
  const locations = useGame((s) => s.locations);

  const loc = locations.find((l) => l.key === activeKey);
  const [progress, setProgress] = useState(0);
  const [quote] = useState(() => QUOTES[Math.floor(Math.random() * QUOTES.length)]);

  useEffect(() => {
    if (!loc) return;
    const id = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(id);
          // If gameUrl is set, go to game. Otherwise, go to boss
          setTimeout(() => {
            if (gameUrl) {
              setScreen("game");
            } else {
              setScreen("boss");
            }
          }, 700);
          return 100;
        }
        return p + 1.4;
      });
    }, 60);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loc?.key, gameUrl]);

  if (!loc) return null;

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />

      <div className="relative z-10 w-full max-w-3xl animate-fade-in">
        <p className="text-center eyebrow mb-3">— Destino sagrado —</p>
        <h2
          className="text-center font-pixel text-ink mb-7 text-glow leading-tight"
          style={{ fontSize: "clamp(18px, 3vw, 26px)" }}
        >
          ▸ {loc.name.toUpperCase()}
        </h2>

        {/* Cinematic stage */}
        <div className="panel-pixel relative h-[240px] overflow-hidden mb-5">
          {/* Sky gradient layer */}
          <div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(180deg, hsl(var(--hero-tint)) 0%, hsl(var(--background)) 100%)",
            }}
          />

          {/* Distant mountains */}
          <div className="absolute bottom-12 left-0 w-[200%] h-32 animate-scroll-slow">
            <Mountains />
          </div>

          {/* Mid-ground hills */}
          <div className="absolute bottom-6 left-0 w-[200%] h-24 animate-scroll-mid opacity-90">
            <Hills />
          </div>

          {/* Ground */}
          <div
            className="absolute bottom-0 left-0 right-0 h-3"
            style={{
              backgroundImage:
                "repeating-linear-gradient(90deg, hsl(var(--surface)) 0 8px, hsl(var(--border)) 8px 12px)",
            }}
          />

          {/* Foreground props */}
          <div className="absolute bottom-3 left-0 w-[200%] h-10 animate-scroll-fast">
            <Props />
          </div>

          {/* Hero */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <Colibri size={130} />
          </div>

          {/* Vignette */}
          <div className="absolute inset-0 pointer-events-none vignette" />
        </div>

        {/* Loading bar */}
        <div className="panel-deep p-1 mb-3">
          <div className="relative h-7 bg-surface overflow-hidden">
            <div
              className="absolute inset-y-0 left-0 bg-accent transition-[width] duration-100"
              style={{ width: `${progress}%` }}
            />
            <div
              className="absolute inset-y-0 w-1.5 bg-primary animate-flicker"
              style={{ left: `calc(${progress}% - 6px)` }}
            />
            <div className="absolute inset-0 flex items-center justify-center font-pixel text-[10px] text-ink mix-blend-difference">
              {Math.floor(progress)}%
            </div>
          </div>
        </div>

        <p className="text-center font-pixel text-[8px] text-ink-mute uppercase mb-6 leading-loose">
          ✦ {loc.lore} ✦
        </p>

        {/* Lore strip */}
        <div className="panel-pixel px-6 py-5 text-center">
          
          <p className="font-pixel text-[9px] text-ink-soft normal-case" style={{ lineHeight: 2 }}>
            "{quote}"
          </p>
          <p className="font-pixel text-[7px] text-ink-mute mt-4 uppercase">— {loc.myth} —</p>
        </div>
      </div>
    </section>
  );
};

const Mountains = () => (
  <svg viewBox="0 0 800 100" className="w-full h-full" preserveAspectRatio="none">
    {[...Array(2)].map((_, k) => (
      <g key={k} transform={`translate(${k * 400}, 0)`}>
        <polygon
          points="0,100 60,40 120,80 180,20 260,90 340,30 400,100"
          fill="hsl(var(--surface-2))"
          opacity="0.7"
        />
      </g>
    ))}
  </svg>
);

const Hills = () => (
  <svg viewBox="0 0 800 80" className="w-full h-full" preserveAspectRatio="none">
    {[...Array(2)].map((_, k) => (
      <g key={k} transform={`translate(${k * 400}, 0)`}>
        <polygon
          points="0,80 40,50 100,65 160,40 220,60 300,45 360,70 400,80"
          fill="hsl(var(--surface))"
        />
      </g>
    ))}
  </svg>
);

const Props = () => (
  <svg viewBox="0 0 800 40" className="w-full h-full" preserveAspectRatio="none">
    {[...Array(2)].map((_, k) => (
      <g key={k} transform={`translate(${k * 400}, 0)`}>
        {/* Trees / stones */}
        <rect x="60" y="20" width="6" height="20" fill="hsl(var(--border))" />
        <polygon points="50,20 72,20 61,4" fill="hsl(var(--accent))" opacity="0.8" />
        <rect x="160" y="28" width="14" height="12" fill="hsl(var(--surface-2))" />
        <rect x="240" y="22" width="6" height="18" fill="hsl(var(--border))" />
        <polygon points="232,22 252,22 242,8" fill="hsl(var(--primary))" opacity="0.7" />
        <rect x="320" y="32" width="22" height="8" fill="hsl(var(--surface-2))" />
      </g>
    ))}
  </svg>
);
