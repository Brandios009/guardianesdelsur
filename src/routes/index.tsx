import { createFileRoute, ClientOnly } from "@tanstack/react-router";
import { useEffect } from "react";
import { useGame } from "@/store/game";
import { RegisterScreen } from "@/screens/RegisterScreen";
import { MapScreen } from "@/screens/MapScreen";
import { LoadingScreen } from "@/screens/LoadingScreen";
import { BossScreen } from "@/screens/BossScreen";
import { GameScreen } from "@/screens/GameScreen";
import { VictoryScreen } from "@/screens/VictoryScreen";
import { ParticleCanvas } from "@/components/ParticleCanvas";
import { WorldToggle } from "@/components/WorldToggle";
import { Notif } from "@/components/Notif";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Guardianes del Sur — Descubre Nariño" },
      {
        name: "description",
        content:
          "Aventura pixel-art por los lugares mágicos de Nariño: Las Lajas, La Cocha, Galeras y Juanambú. Derrota a los guardianes y desbloquea el turismo del sur.",
      },
      { property: "og:title", content: "Guardianes del Sur — Descubre Nariño" },
      {
        property: "og:description",
        content:
          "Aventura pixel-art por los lugares mágicos de Nariño. Derrota a los guardianes y libera los secretos turísticos del sur.",
      },
      { property: "og:type", content: "website" },
    ],
  }),
  component: GuardianesIndex,
});

function GuardianesIndex() {
  const screen = useGame((s) => s.screen);
  const unlocked = useGame((s) => s.unlocked);
  const setPlayer = useGame((s) => s.setPlayer);
  const setScreen = useGame((s) => s.setScreen);
  const hydrateProgress = useGame((s) => s.hydrateProgress);

  useEffect(() => {
    document.body.classList.toggle("world-vital", unlocked);
  }, [unlocked]);

  // Auto-login si hay sesión guardada
  useEffect(() => {
    const username = typeof window !== "undefined" ? localStorage.getItem("guardianes_session") : null;
    if (!username) return;
    let cancelled = false;
    (async () => {
      const { supabase } = await import("@/integrations/supabase/client");
      const { data } = await supabase
        .from("players")
        .select("*")
        .eq("username_lower", username.toLowerCase())
        .maybeSingle();
      if (cancelled || !data) return;
      setPlayer({
        id: data.id,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        age: data.age,
        city: data.city,
      });
      const { data: prog } = await supabase
        .from("player_progress")
        .select("location_key")
        .eq("player_id", data.id);
      hydrateProgress((prog ?? []).map((p) => p.location_key as any));
      setScreen("map");
    })();
    return () => {
      cancelled = true;
    };
  }, [setPlayer, setScreen, hydrateProgress]);

  return (
    <div className="relative min-h-screen w-full bg-background text-foreground overflow-x-hidden">
      <div className="fixed inset-0 z-0 pixel-grid pointer-events-none" />
      <div className="fixed inset-0 z-[1] scanlines pointer-events-none" />

      {/* Canvas usa window/requestAnimationFrame: solo cliente */}
      <ClientOnly fallback={null}>
        <ParticleCanvas />
      </ClientOnly>

      <WorldToggle />
      {screen !== "register" && <UserPanel />}
      <Notif />

      <main className="relative z-10">
        {screen === "register" && <RegisterScreen />}
        {screen === "map" && <MapScreen />}
        {screen === "loading" && <LoadingScreen />}
        {screen === "boss" && <BossScreen />}
        {screen === "game" && <GameScreen />}
        {screen === "victory" && <VictoryScreen />}
      </main>
    </div>
  );
}

function UserPanel() {
  const player = useGame((s) => s.player);
  const logout = useGame((s) => s.logout);
  const locations = useGame((s) => s.locations);

  const completed = locations.filter((l) => l.status === "unlocked").length;
  const progress = Math.round((completed / locations.length) * 100);

  return (
    <div className="fixed top-4 right-4 z-[50] panel-pixel p-3 sm:p-4 max-w-[280px] backdrop-blur-sm shadow-2xl border-border-strong">
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <p className="font-pixel text-[7px] text-ink-mute uppercase">Registro</p>
          <p className="font-pixel text-[10px] text-accent uppercase">
            {player ? `${player.username || player.firstName}` : "Invitado"}
          </p>
        </div>
        {player ? (
          <button
            type="button"
            onClick={() => {
              localStorage.removeItem("guardianes_session");
              logout();
            }}
            className="btn-ghost-pixel px-2 py-1 text-[8px]"
          >
            Cerrar
          </button>
        ) : null}
      </div>

      <div className="font-pixel text-[7px] text-ink-mute uppercase mb-2">
        Progreso de desbloqueo
      </div>
      <div className="h-2 rounded-full bg-ink/10 overflow-hidden mb-2">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="font-pixel text-[7px] text-ink-soft uppercase">
        {progress}% Liberado
      </div>
    </div>
  );
}
