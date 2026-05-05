import { FormEvent, useState } from "react";
import { useGame, type LocationKey } from "@/store/game";
import { Colibri } from "@/components/Colibri";
import { ChevronRight, Sparkles, LogIn, UserPlus, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

export const RegisterScreen = () => {
  const setPlayer = useGame((s) => s.setPlayer);
  const setScreen = useGame((s) => s.setScreen);
  const showNotif = useGame((s) => s.showNotif);
  const hydrateProgress = useGame((s) => s.hydrateProgress);

  const [mode, setMode] = useState<"register" | "login">("register");
  const [loginName, setLoginName] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    firstName: "",
    lastName: "",
    email: "",
    age: "",
    city: "",
    oath: false,
  });

  const loadProgress = async (playerId: string) => {
    const { data } = await supabase
      .from("player_progress")
      .select("location_key")
      .eq("player_id", playerId);
    const keys = (data ?? []).map((r) => r.location_key as LocationKey);
    hydrateProgress(keys);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    if (!form.oath) {
      showNotif("Acepta términos y condiciones para continuar el tour");
      return;
    }
    const uname = form.username.trim();
    const email = form.email.trim();
    if (!uname) {
      showNotif("Ingresa un nombre de registro válido");
      return;
    }

    setLoading(true);
    try {
      // Validar duplicados
      const { data: existing, error: checkErr } = await supabase
        .from("players")
        .select("username_lower, email_lower")
        .or(`username_lower.eq.${uname.toLowerCase()},email_lower.eq.${email.toLowerCase()}`);

      if (checkErr) throw checkErr;

      if (existing && existing.length > 0) {
        const dupUser = existing.some((r) => r.username_lower === uname.toLowerCase());
        const dupEmail = existing.some((r) => r.email_lower === email.toLowerCase());
        if (dupUser) {
          showNotif("Ese nombre de registro ya está en uso. Prueba otro.");
        } else if (dupEmail) {
          showNotif("Ese correo ya está registrado.");
        }
        setLoading(false);
        return;
      }

      const { data: inserted, error: insErr } = await supabase
        .from("players")
        .insert({
          username: uname,
          username_lower: uname.toLowerCase(),
          first_name: form.firstName,
          last_name: form.lastName,
          email,
          email_lower: email.toLowerCase(),
          age: form.age,
          city: form.city,
        })
        .select()
        .single();

      if (insErr || !inserted) throw insErr ?? new Error("No se pudo crear el jugador");

      const player = {
        id: inserted.id,
        username: inserted.username,
        firstName: inserted.first_name,
        lastName: inserted.last_name,
        email: inserted.email,
        age: inserted.age,
        city: inserted.city,
      };
      localStorage.setItem("guardianes_session", inserted.username);
      setPlayer(player);
      hydrateProgress([]);
      setScreen("map");
    } catch (err: any) {
      console.error(err);
      showNotif("No se pudo registrar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const onLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (loading) return;
    const uname = loginName.trim();
    if (!uname) {
      showNotif("Ingresa tu nombre de registro");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("players")
        .select("*")
        .eq("username_lower", uname.toLowerCase())
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        showNotif("No existe un Guardián con ese nombre");
        setLoading(false);
        return;
      }

      const player = {
        id: data.id,
        username: data.username,
        firstName: data.first_name,
        lastName: data.last_name,
        email: data.email,
        age: data.age,
        city: data.city,
      };
      localStorage.setItem("guardianes_session", data.username);
      setPlayer(player);
      await loadProgress(data.id);
      setScreen("map");
    } catch (err) {
      console.error(err);
      showNotif("No se pudo ingresar. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const set = <K extends keyof typeof form>(k: K, v: (typeof form)[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  return (
    <section className="relative min-h-screen w-full flex items-center justify-center px-4 py-16 overflow-hidden">
      {/* Decorative hero band */}
      <div className="absolute inset-x-0 top-0 h-[55vh] bg-hero-gradient pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.08] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, hsl(var(--accent)) 0, transparent 40%), radial-gradient(circle at 80% 70%, hsl(var(--hb-purple)) 0, transparent 45%)",
        }}
      />

      <div className="relative z-10 w-full max-w-5xl grid lg:grid-cols-[1fr_1.1fr] gap-10 items-center animate-fade-in">
        {/* Left: hero / mascot */}
        <div className="text-center lg:text-left">
          <div className="flex justify-center lg:justify-start mb-6">
            <Colibri size={260} />
          </div>
          <p className="eyebrow mb-3 animate-title-rise">— UCC Pasto —</p>
          <h1
            className="font-pixel leading-[1.15] mb-5 animate-title-rise text-pixel-shadow"
            style={{ animationDelay: "0.1s", fontSize: "clamp(22px, 4.2vw, 40px)" }}
          >
            <span className="block text-ink">GUARDIANES</span>
            <span className="block text-accent text-glow">DEL SUR</span>
          </h1>
          <p
            className="font-pixel text-[9px] text-ink-soft max-w-md mx-auto lg:mx-0 animate-title-rise normal-case"
            style={{ animationDelay: "0.25s", lineHeight: 2 }}
          >
            Descubre Nariño.
            Recorre, juega y deja que cada sitio te cuente su historia
                  
            
          </p>

          <div className="mt-7 flex flex-wrap gap-3 justify-center lg:justify-start animate-title-rise" style={{ animationDelay: "0.4s" }}>
            <Stat label="Destinos" value="4" />
            <Stat label="Guardianes" value="4" />
           
          </div>
        </div>

        {/* Right: form panel */}
        <div className="panel-pixel p-6 sm:p-8 animate-scale-in" style={{ animationDelay: "0.2s" }}>
          {/* Tabs */}
          <div className="flex gap-2 mb-5">
            <button
              type="button"
              onClick={() => setMode("register")}
              className={`flex-1 font-pixel text-[8px] px-3 py-2 border-2 flex items-center justify-center gap-2 uppercase transition-colors ${
                mode === "register"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-ink-soft border-border-strong hover:border-accent"
              }`}
            >
              <UserPlus className="w-3 h-3" /> Registro
            </button>
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 font-pixel text-[8px] px-3 py-2 border-2 flex items-center justify-center gap-2 uppercase transition-colors ${
                mode === "login"
                  ? "bg-accent text-accent-foreground border-accent"
                  : "bg-background text-ink-soft border-border-strong hover:border-accent"
              }`}
            >
              <LogIn className="w-3 h-3" /> Ingresar
            </button>
          </div>

          {mode === "login" ? (
            <form onSubmit={onLogin}>
              <h2 className="font-pixel text-[10px] text-accent flex items-center gap-2 mb-2">
                <LogIn className="w-3 h-3" /> ▸ Continuar Aventura
              </h2>
              <p className="font-pixel text-[8px] text-ink-mute mb-6 normal-case" style={{ lineHeight: 2 }}>
                Ingresa tu nombre de Usuario para retomar tu progreso
              </p>

              <Field label="Nombre de Usuario" full>
                <input
                  required
                  autoFocus
                  className="input-pixel"
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  placeholder="usuario123"
                />
              </Field>

              <button type="submit" className="btn-pixel mt-7 w-full">
                [ Ingresar ]
                <ChevronRight className="w-3 h-3" />
              </button>

              <p className="font-pixel text-[7px] text-ink-mute mt-4 text-center normal-case">
                ¿Sin cuenta?{" "}
                <button type="button" onClick={() => setMode("register")} className="text-accent underline">
                  Regístrate aquí
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={onSubmit}>
              <h2 className="font-pixel text-[10px] text-accent flex items-center gap-2 mb-2">
                <Sparkles className="w-3 h-3" /> ▸ Registro
              </h2>
              <p className="font-pixel text-[8px] text-ink-mute mb-6 normal-case" style={{ lineHeight: 2 }}>
                Guarda tu progreso en el tour por Nariño
              </p>

              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Nombre de Usuario" full>
                  <input required className="input-pixel" value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="usuario123" />
                </Field>
                <Field label="Nombre">
                  <input required className="input-pixel" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="nombre" />
                </Field>
                <Field label="Apellido">
                  <input required className="input-pixel" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="apellido" />
                </Field>
                <Field label="Correo Electrónico" full>
                  <input required type="email" className="input-pixel" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="@uccpasto" />
                </Field>
                <Field label="Edad">
                  <input required type="number" min={1} className="input-pixel" value={form.age} onChange={(e) => set("age", e.target.value)} placeholder="21" />
                </Field>
                <Field label="Ciudad">
                  <input required className="input-pixel" value={form.city} onChange={(e) => set("city", e.target.value)} placeholder="Pasto" />
                </Field>
              </div>

              <h3 className="font-pixel text-[10px] text-accent mt-7 mb-3">▸ Acepta los términos</h3>

              <label className="flex items-start gap-3 cursor-pointer group">
                <span
                  className={`shrink-0 w-5 h-5 border-2 flex items-center justify-center transition-colors ${
                    form.oath ? "bg-accent border-accent" : "bg-background border-border-strong group-hover:border-accent"
                  }`}
                >
                  {form.oath && <span className="font-pixel text-[10px] text-accent-foreground">✓</span>}
                </span>
                <span className="font-pixel text-[8px] text-ink-soft leading-[2] normal-case">
                  La información dada será utilizada para bases de datos para mejora del turismo en Nariño. Y se guardará para futuras encuestas de satisfacción.
                </span>
                <input type="checkbox" className="sr-only" checked={form.oath} onChange={(e) => set("oath", e.target.checked)} />
              </label>

              <button type="submit" className="btn-pixel mt-7 w-full">
                [ Registrarse ]
                <ChevronRight className="w-3 h-3" />
              </button>

              <p className="font-pixel text-[7px] text-ink-mute mt-4 text-center normal-case">
                ¿Ya tienes cuenta?{" "}
                <button type="button" onClick={() => setMode("login")} className="text-accent underline">
                  Inicia sesión
                </button>
              </p>
            </form>
          )}
        </div>
      </div>

      <Footer />
    </section>
  );
};

const Field = ({
  label,
  full,
  children,
}: {
  label: string;
  full?: boolean;
  children: React.ReactNode;
}) => (
  <label className={`block ${full ? "sm:col-span-2" : ""}`}>
    <span className="font-pixel text-[8px] text-ink-mute uppercase block mb-2">
      {label}
    </span>
    {children}
  </label>
);

const Stat = ({ label, value }: { label: string; value: string }) => (
  <div className="panel-deep px-4 py-2">
    <div className="font-pixel text-[14px] text-accent leading-none">
      {value}
    </div>
    <div className="font-pixel text-[7px] text-ink-mute mt-1">{label}</div>
  </div>
);

const Footer = () => (
  <div className="absolute bottom-3 left-0 right-0 text-center font-pixel text-[7px] text-ink-mute uppercase pointer-events-none">
    ✦Versión Beta✦
  </div>
);
