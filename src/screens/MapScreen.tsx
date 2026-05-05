import { useGame, type GuardianLocation, type LocationKey } from "@/store/game";
import { Colibri } from "@/components/Colibri";
import { ArrowLeft, Lock, Swords, Sparkles, MapPin } from "lucide-react";
import landscapeDecadente from "@/assets/landscape-decadente.jpg";
import landscapeVital from "@/assets/landscape-vital.jpg";
import lajasIcon from "@/assets/map-icons/lajas.png";
import cochaIcon from "@/assets/map-icons/cocha.png";
import galerasIcon from "@/assets/map-icons/galeras.png";
import juanambuIcon from "@/assets/map-icons/juanambu.png";
import { useState } from "react";

export const MapScreen = () => {
  const locations = useGame((s) => s.locations);
  const setActive = useGame((s) => s.setActiveLocation);
  const setScreen = useGame((s) => s.setScreen);
  const setGameUrl = useGame((s) => s.setGameUrl);
  const player = useGame((s) => s.player);
  const unlocked = useGame((s) => s.unlocked);
  const showNotif = useGame((s) => s.showNotif);
  const logout = useGame((s) => s.logout);

  const [hovered, setHovered] = useState<LocationKey | null>(null);

  const handleLogout = () => {
    localStorage.removeItem("guardianes_session");
    logout();
    showNotif("Sesión cerrada. ¡Hasta pronto, Guardián!");
  };

  const completed = locations.filter((l) => l.status === "unlocked").length;
  const rank =
    completed === 4
      ? "Guardián Eterno"
      : completed >= 2
      ? "Caminante del Sur"
      : completed >= 1
      ? "Aprendiz"
      : "Novato";

  const iconMap: Record<LocationKey, string> = {
    lajas: lajasIcon,
    cocha: cochaIcon,
    galeras: galerasIcon,
    juanambu: juanambuIcon,
  };

  const onSelect = (loc: GuardianLocation) => {
    setActive(loc.key);
    setGameUrl(null);
    setScreen("loading");
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Atmospheric backdrop */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <img
          src={unlocked ? landscapeVital : landscapeDecadente}
          alt=""
          aria-hidden
          className="w-full h-full object-cover transition-opacity duration-1000"
          style={{ filter: unlocked ? "saturate(1.1)" : "saturate(0.6) brightness(0.55)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--background) / 0.4) 0%, hsl(var(--background) / 0.85) 60%, hsl(var(--background)) 100%)",
          }}
        />
      </div>

      {/* Header */}
      <header className="relative z-10 panel-pixel border-x-0 border-t-0 px-4 sm:px-8 py-3 flex flex-wrap items-center gap-3 justify-between">
        <button
          onClick={handleLogout}
          className="btn-ghost-pixel"
          aria-label="Cerrar sesión"
        >
          <ArrowLeft className="w-3 h-3" /> Salir
        </button>

        <div className="flex flex-col items-start gap-1 text-left">
          <span className="font-pixel text-[8px] sm:text-[10px] text-ink uppercase">
            ✦ Guardianes del Sur ✦
          </span>
          <span className="font-pixel text-[8px] text-accent uppercase">
            Lugares Turísticos en Nariño
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="panel-deep px-3 py-2 flex items-center gap-2">
            <Swords className="w-3 h-3 text-accent" />
            <span className="font-pixel text-[9px] text-accent">
              {completed} / 4
            </span>
          </div>
          <div className="panel-deep px-3 py-2 hidden md:block">
            <span className="font-pixel text-[8px] text-ink-mute uppercase">
              {player?.firstName ?? "Anónimo"} · {rank}
            </span>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="relative z-10 flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Map */}
        <div className="relative flex-1 flex items-center justify-center p-4 sm:p-8 vignette">
          {/* Floating mascot in corner */}
          <div className="absolute bottom-6 left-6 hidden md:block opacity-90">
            <Colibri size={140} />
          </div>

          <svg
            viewBox="0 0 800 500"
            className="w-full max-w-3xl h-auto drop-shadow-[6px_6px_0_hsl(var(--background))]"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Old parchment-style map frame */}
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path
                  d="M 20 0 L 0 0 0 20"
                  fill="none"
                  stroke="hsl(var(--border))"
                  strokeOpacity="0.25"
                  strokeWidth="0.5"
                />
              </pattern>
              <linearGradient id="mapBg" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--surface))" stopOpacity="0.55" />
                <stop offset="100%" stopColor="hsl(var(--background))" stopOpacity="0.85" />
              </linearGradient>
              <filter id="pixelize">
                <feFlood floodColor="hsl(var(--accent))" />
                <feComposite in2="SourceGraphic" operator="in" />
              </filter>
            </defs>

            <rect
              x="6"
              y="6"
              width="788"
              height="488"
              fill="url(#mapBg)"
              stroke="hsl(var(--border))"
              strokeWidth="3"
            />
            <rect x="6" y="6" width="788" height="488" fill="url(#grid)" opacity="0.35" />

            {/* Decorative compass */}
            <g transform="translate(720, 60)">
              <circle r="28" fill="hsl(var(--background))" stroke="hsl(var(--border))" strokeWidth="2" />
              <text
                x="0"
                y="-12"
                textAnchor="middle"
                fontFamily="Press Start 2P"
                fontSize="8"
                fill="hsl(var(--accent))"
              >
                N
              </text>
              <polygon points="0,-6 4,8 0,4 -4,8" fill="hsl(var(--accent))" />
            </g>

            {/* Nodes */}
            {locations.map((loc) => (
              <MapNode
                key={loc.key}
                loc={loc}
                icon={iconMap[loc.key]}
                onClick={() => onSelect(loc)}
                onHover={setHovered}
                hovered={hovered === loc.key}
              />
            ))}
          </svg>

          {/* Floating tooltip on hover */}
          {hovered && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 panel-pixel px-4 py-3 pointer-events-none animate-fade-in">
              <p className="font-pixel text-[8px] text-accent uppercase mb-1">
                ▸ {locations.find((l) => l.key === hovered)?.name}
              </p>
              <p className="font-pixel text-[7px] text-ink-soft uppercase">
                {locations.find((l) => l.key === hovered)?.subtitle}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="lg:w-[300px] panel-pixel border-r-0 border-b-0 lg:border-l-2 border-t-2 lg:border-t-0 flex flex-col max-h-[420px] lg:max-h-none overflow-y-auto">
          <div className="px-5 py-4 border-b-2 border-border-strong">
            <h2 className="font-pixel text-[10px] text-accent uppercase flex items-center gap-2">
              <MapPin className="w-3 h-3" /> Destinos por liberar
            </h2>
                  <div className="flex gap-3 mt-3 flex-wrap">
              <LegendDot tone="locked" label="Bloqueado" />
              <LegendDot tone="unlocked" label="Liberado" />
            </div>
          </div>
          {locations.map((loc) => (
            <button
              key={loc.key}
              onClick={() => onSelect(loc)}
              onMouseEnter={() => setHovered(loc.key)}
              onMouseLeave={() => setHovered(null)}
              className="text-left px-5 py-4 border-b border-border-strong hover:bg-surface-2 transition-colors"
            >
              <div className="font-pixel text-[9px] text-ink uppercase mb-2">
                ▸ {loc.name}
              </div>
              <div className="font-pixel text-[7px] text-ink-mute mb-3 uppercase leading-loose">
                {loc.subtitle}
              </div>
              <StatusBadge status={loc.status} />
            </button>
          ))}
        </aside>
      </div>
    </section>
  );
};

const MapNode = ({
  loc,
  icon,
  onClick,
  onHover,
  hovered,
}: {
  loc: GuardianLocation;
  icon: string;
  onClick: () => void;
  onHover: (k: LocationKey | null) => void;
  hovered: boolean;
}) => {
  const colors = {
    locked: { fill: "hsl(0 65% 55%)", stroke: "hsl(var(--accent))" },
    unlocked: { fill: "hsl(125 60% 48%)", stroke: "hsl(155 55% 68%)" },
  }[loc.status];

  return (
    <g
      transform={`translate(${loc.x}, ${loc.y})`}
      onClick={onClick}
      onMouseEnter={() => onHover(loc.key)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: "pointer" }}
    >
      {/* Pixel pin (octagon-ish) */}
      <polygon
        points="-16,-8 -8,-16 8,-16 16,-8 16,8 8,16 -8,16 -16,8"
        fill={colors.fill}
        stroke={colors.stroke}
        strokeWidth="2"
      />
      {/* Icon image - 40x40 centered in the pin */}
      <image
        x="-20"
        y="-20"
        width="40"
        height="40"
        href={icon}
        style={{ cursor: "pointer" }}
      />

      {/* Label with icon and name */}
      <g transform="translate(0, 48)">
        <rect
          x="-60"
          y="-10"
          width="120"
          height="22"
          fill="hsl(var(--background))"
          stroke="hsl(var(--border))"
          strokeWidth="2"
          rx="2"
        />
        <text
          x="0"
          y="5"
          textAnchor="middle"
          fontFamily="Press Start 2P"
          fontSize="7"
          fill={hovered ? colors.fill : "hsl(var(--foreground))"}
          fontWeight="bold"
        >
          {loc.name.toUpperCase()}
        </text>
      </g>
    </g>
  );
};

const StatusBadge = ({ status }: { status: GuardianLocation["status"] }) => {
  if (status === "unlocked") {
    return (
      <span className="inline-flex items-center gap-1 font-pixel text-[7px] uppercase px-2 py-1 bg-emerald-500 text-background">
        ✓ Liberado
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1 font-pixel text-[7px] uppercase px-2 py-1 bg-destructive text-background border border-red-600">
      <Lock className="w-2.5 h-2.5" /> Bloqueado
    </span>
  );
};

const LegendDot = ({ tone, label }: { tone: "locked" | "unlocked"; label: string }) => {
  const cls = {
    locked: "bg-destructive border-red-700",
    unlocked: "bg-emerald-500 border-emerald-700",
  }[tone];
  return (
    <span className="flex items-center gap-2 font-pixel text-[6px] uppercase text-ink-mute">
      <span className={`w-3 h-3 border-2 ${cls}`} />
      {label}
    </span>
  );
};
