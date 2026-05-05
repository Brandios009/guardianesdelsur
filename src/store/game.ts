import { create } from "zustand";
import { supabase } from "@/integrations/supabase/client";
import bossLajas from "@/assets/boss-lajas.png";
import bossCocha from "@/assets/boss-cocha.png";
import bossGaleras from "@/assets/boss-galeras.png";
import bossJuanambu from "@/assets/boss-juanambu.png";
import lasLajasFoto from "@/assets/las_lajas_foto.jpg";

export type Screen = "register" | "map" | "loading" | "boss" | "game" | "victory" | "destiny";

export type LocationKey = "lajas" | "cocha" | "galeras" | "juanambu";
export type LocationStatus = "locked" | "unlocked";

export interface BossInfo {
  name: string;
  title: string;
  description: string;
  image: string;
  element: string;
  hp: number;
  threat: 1 | 2 | 3 | 4 | 5;
}

export interface TourismInfo {
  title: string;
  summary: string;
  description: string;
  images: string[];
  mapUrl: string;
  activities: string[];
}

export interface GuardianLocation {
  key: LocationKey;
  name: string;
  subtitle: string;
  lore: string;
  myth: string;
  status: LocationStatus;
  boss: BossInfo;
  tourism: TourismInfo;
  // SVG node coords (viewBox 0 0 800 500)
  x: number;
  y: number;
}

export interface Player {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  age: string;
  city: string;
}

interface GameState {
  screen: Screen;
  setScreen: (s: Screen) => void;

  player: Player | null;
  setPlayer: (p: Player | null) => void;

  unlocked: boolean;
  setUnlocked: (u: boolean) => void;

  locations: GuardianLocation[];
  activeLocation: LocationKey | null;
  setActiveLocation: (k: LocationKey | null) => void;
  completeLocation: (k: LocationKey) => void;

  // Game state for Unity integration
  gameUrl: string | null;
  setGameUrl: (url: string | null) => void;
  
  gameVictory: () => void;

  hydrateProgress: (keys: LocationKey[]) => void;
  resetLocations: () => void;
  logout: () => void;

  notif: string | null;
  showNotif: (msg: string) => void;
}

const initialLocations: GuardianLocation[] = [
  {
    key: "lajas",
    name: "Las Lajas",
    subtitle: "El demonio de Las Lajas",
    lore: "La vírgen de las lajas no ha logrado contener al demonio que habia sobre el cañón del río Guáitara",
    myth: "Antes del milagro de la vírgen, todos temían caminar cerca de la iglesia",
    status: "locked",
    x: 300,
    y: 340,
    boss: {
      name: "El Demonio de las Lajas",
      title: "",
      description:
        "Espíritu encadenado que durante siglos rugió en lo profundo del cañón. Nacido del miedo de los hombres y alimentado por sus culpas, intentó profanar el santuario hasta que fue sometido y clavado en la piedra por la Vírgen de Las Lajas.",
      image: bossLajas,
      element: "",
      hp: 1200,
      threat: 3,
    },
    tourism: {
      title: "Santuario de Las Lajas",
      summary:
        "Una joya neogótica incrustada en el cañón del río Guáitara, Las Lajas es un destino religioso y paisajístico imprescindible en Nariño.",
      description:
        "El Santuario de Las Lajas, ubicado en Ipiales, Nariño (Colombia), es una impresionante basílica neogótica construida sobre el cañón del río Guáitara. Considerada una de las iglesias más bellas del mundo, se edificó entre 1916 y 1949 en el sitio donde, según la tradición, la Virgen apareció en una roca en 1754. ",
      images: [lasLajasFoto],
      mapUrl: "https://www.google.com/maps?q=Bas%C3%ADlica+de+Las+Lajas,+Ipiales,+Nari%C3%B1o&output=embed",
      activities: [
        "Visita la página web de turismo: https://laslajas.org/guia-turistica/",
        "Visita el Santuario y admira su arquitectura única, junto al altar de Nuestra Señora de las Lajas.",
        "El teleférico de las lajas viaja 1400 metros sobre el cañón, a una altura de 260 metros.",
        "Visita el museo en el sótano del Santuario.",
        "El santuario tiene un alumbrado nocturno muy destacado, ideal para fotografías después del atardecer.",
        "Degusta platos típicos en los restaurantes cercanos",
        "Consigue valiosas artesanías en los mercados locales",
      ],
    },
  },
  {
    key: "cocha",
    name: "Laguna de la Cocha",
    subtitle: "El Duende de La Cocha",
    lore: "El espíritu del agua escucha a quien sabe callar y mirar.",
    myth: "En sus aguas nace el río Guamuez; los Quillasingas hablan con la luna desde su orilla.",
    status: "locked",
    x: 480,
    y: 180,
    boss: {
      name: "Yacumama, Madre de las Aguas",
      title: "La Serpiente del Lago Sagrado",
      description:
        "Antigua serpiente acuática de escamas turquesas que custodia los secretos del Guamuez. Cuando enfurece, el agua se vuelve espejo negro y devora a quien no sepa callar.",
      image: bossCocha,
      element: "Agua · Niebla",
      hp: 1450,
      threat: 4,
    },
    tourism: {
      title: "Laguna de la Cocha",
      summary:
        "Un espejo de agua en pleno corazón andino, donde la cultura indígena y el paisaje se fusionan en un destino sereno.",
      description:
        "La Laguna de la Cocha es uno de los cuerpos de agua más grandes de Colombia. Sus orillas ofrecen rutas en bicicleta, paseos en bote, mercados artesanales y el contacto con la comunidad indígena inga.",
      images: [bossCocha],
      mapUrl: "https://www.google.com/maps?q=Laguna+de+La+Cocha,+Nari%C3%B1o&output=embed",
      activities: [
        "Paseo en lancha por la laguna.",
        "Visitar la Isla de la Corota.",
        "Conocer artesanías en el muelle.",
        "Caminar por senderos naturales junto al agua.",
      ],
    },
  },
  {
    key: "galeras",
    name: "Volcán Galeras",
    subtitle: "La Tunda",
    lore: "Urcunina, montaña de fuego, custodia los sueños de Pasto.",
    myth: "Cuando el Galeras truena, los abuelos dicen que el corazón de la tierra está latiendo.",
    status: "locked",
    x: 360,
    y: 140,
    boss: {
      name: "Urcunina, Coloso del Magma",
      title: "El Titán del Fuego Andino",
      description:
        "Gigante de obsidiana con grietas de lava viva. Despierta cuando los Quillasingas son olvidados. Cada uno de sus pasos hace temblar a Pasto y enciende el cielo en cenizas.",
      image: bossGaleras,
      element: "Fuego · Tierra",
      hp: 1800,
      threat: 5,
    },
    tourism: {
      title: "Volcán Galeras",
      summary:
        "Galeras es el volcán vivo que vigila el sur de Nariño, con paisajes brumosos y miradores volcánicos.",
      description:
        "El Volcán Galeras es un icono del departamento: un gigante de ceniza y roca que ofrece vistas dramáticas, senderos de altura y una conexión profunda con la historia volcánica de la región.",
      images: [bossGaleras],
      mapUrl: "https://www.google.com/maps?q=Volc%C3%A1n+Galeras,+Nari%C3%B1o&output=embed",
      activities: [
        "Observar el amanecer desde el mirador.",
        "Recorrer los senderos interpretativos.",
        "Conocer la biodiversidad de la páramo.",
      ],
    },
  },
  {
    key: "juanambu",
    name: "Cañón Juanambú",
    subtitle: "Los Espíritus del Batallón",
    lore: "Río de selva y batallas, cuna del valor nariñense.",
    myth: "Sus paredes verdes esconden el eco de los héroes que defendieron el sur.",
    status: "locked",
    x: 520,
    y: 340,
    boss: {
      name: "Mayasquer, Espectro del Cañón",
      title: "Guardián de los Caídos",
      description:
        "Guerrero ancestral que cayó defendiendo el sur. Su espíritu camina entre la niebla del cañón con plumas de jade y machete espectral. Solo respeta al valiente que no huye.",
      image: bossJuanambu,
      element: "Espíritu · Selva",
      hp: 1600,
      threat: 4,
    },
    tourism: {
      title: "Cañón Juanambú",
      summary:
        "Un cañón selvático que mezcla historia militar, naturaleza y panoramas imponentes en el sur de Nariño.",
      description:
        "El Cañón Juanambú ofrece miradores profundos, cascadas ocultas y senderos que recorren una región de selva alta donde la historia y el paisaje se encuentran.",
      images: [bossJuanambu],
      mapUrl: "https://www.google.com/maps?q=C%C3%A1n%C3%B3n+Juanamb%C3%BA,+Nari%C3%B1o&output=embed",
      activities: [
        "Caminar por senderos entre cascadas.",
        "Observar aves y flora tropical.",
        "Descubrir la memoria de las batallas del sur.",
      ],
    },
  },
];

export const useGame = create<GameState>((set, get) => ({
  screen: "register",
  setScreen: (s) => set({ screen: s }),

  player: null,
  setPlayer: (p) => set({ player: p }),

  unlocked: false,
  setUnlocked: (u) => set({ unlocked: u }),

  locations: initialLocations,
  activeLocation: null,
  setActiveLocation: (k) => set({ activeLocation: k }),

  gameUrl: null,
  setGameUrl: (url) => set({ gameUrl: url }),

  completeLocation: (k) => {
    const locations = get().locations.map((l) => {
      if (l.key === k) return { ...l, status: "unlocked" as LocationStatus };
      return l;
    });
    const allUnlocked = locations.every((l) => l.status === "unlocked");
    set({ locations, unlocked: allUnlocked });
  },

  gameVictory: async () => {
    const activeKey = get().activeLocation;
    if (activeKey) {
      const state = get();
      state.completeLocation(activeKey);
      state.showNotif("¡Has vencido! El sitio ha sido desbloqueado.");
      
      // Guardar en Supabase si hay player
      if (state.player) {
        try {
          const { error } = await supabase
            .from("player_progress")
            .insert({ player_id: state.player.id, location_key: activeKey });
          if (error && !error.message.includes("duplicate")) {
            console.error("Error guardando progreso:", error);
          }
        } catch (e) {
          console.error("Error en gameVictory:", e);
        }
      }
    }
    set({ screen: "victory" });
  },

  hydrateProgress: (keys) => {
    const locations = get().locations.map((l) =>
      keys.includes(l.key) ? { ...l, status: "unlocked" as LocationStatus } : { ...l, status: "locked" as LocationStatus }
    );
    const allUnlocked = locations.length > 0 && locations.every((l) => l.status === "unlocked");
    set({ locations, unlocked: allUnlocked });
  },

  resetLocations: () => {
    set({ locations: initialLocations.map((l) => ({ ...l, status: "locked" as LocationStatus })), unlocked: false });
  },

  logout: () => {
    set({
      player: null,
      activeLocation: null,
      unlocked: false,
      locations: initialLocations.map((l) => ({ ...l, status: "locked" as LocationStatus })),
      screen: "register",
    });
  },

  notif: null,
  showNotif: (msg) => {
    set({ notif: msg });
    setTimeout(() => set({ notif: null }), 3500);
  },
}));
