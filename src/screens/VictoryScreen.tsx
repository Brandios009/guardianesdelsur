import { useGame } from "@/store/game";
import { Trophy, MapPin, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export const VictoryScreen = () => {
  const setScreen = useGame((s) => s.setScreen);
  const activeKey = useGame((s) => s.activeLocation);
  const locations = useGame((s) => s.locations);
  const [showConfetti, setShowConfetti] = useState(true);

  const loc = locations.find((l) => l.key === activeKey);

  useEffect(() => {
    // Simulate confetti animation
    const timer = setTimeout(() => setShowConfetti(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  if (!loc) return null;

  const handleReturn = () => {
    setScreen("map");
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 bg-hero-gradient pointer-events-none" />
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 50% 30%, hsl(var(--accent) / 0.6), transparent 55%)",
        }}
      />

      {/* Confetti effect (visual only) */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-accent rounded-full animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `-20px`,
                animation: `fall ${2 + Math.random()}s linear infinite`,
                opacity: Math.random() * 0.7 + 0.3,
              }}
            />
          ))}
        </div>
      )}

      <div className="relative z-10 w-full max-w-2xl animate-fade-in">
        {/* Victory header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Trophy className="w-16 h-16 text-accent animate-bounce" />
          </div>
          <h1 className="font-pixel text-2xl sm:text-4xl text-accent uppercase mb-2">
            ¡VICTORIA!
          </h1>
          <p className="eyebrow text-accent/80">
            — Has vencido a {loc.boss.name} —
          </p>
        </div>

        {/* Victory card */}
        <div className="panel-glow p-6 sm:p-8 mb-6">
          <div className="space-y-4">
            {/* Location unlocked */}
            <div className="flex items-start gap-4 pb-4 border-b border-accent/30">
              <MapPin className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-pixel text-xs text-accent/70 uppercase">
                  Sitio Desbloqueado
                </p>
                <p className="text-sm sm:text-base mt-1">
                  {loc.name} ahora está disponible
                </p>
              </div>
            </div>

            {/* Story unlock */}
            <div className="flex items-start gap-4 pb-4 border-b border-accent/30">
              <Sparkles className="w-5 h-5 text-accent flex-shrink-0 mt-1" />
              <div>
                <p className="font-pixel text-xs text-accent/70 uppercase">
                  Información Histórica
                </p>
                <p className="text-sm sm:text-base mt-1">
                  Puedes consultar la crónica y detalles turísticos del sitio
                </p>
              </div>
            </div>

            {/* Progress note */}
            <div className="pt-2">
              <p className="text-xs text-ink/60 italic">
                Tu progreso ha sido guardado. Continúa tu viaje como Guardián del Sur.
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex justify-center">
          <button
            onClick={handleReturn}
            className="btn-pixel px-8 py-3 flex items-center gap-2"
          >
            Volver al Mapa
            <MapPin className="w-3 h-3" />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fall {
          to {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>
    </section>
  );
};
