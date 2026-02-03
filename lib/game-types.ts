export interface Character {
  id: string
  name: string
  gender: "male" | "female"
  image_url?: string
  created_at?: string
}

export interface Ally {
  allyId: string
  reason: string
}

export interface InventoryItem {
  id: string
  type: "weapon" | "medkit" | "food" | "armor" | "tool"
  name: string
  description: string
  uses: number // How many times it can be used
  maxUses: number // Maximum uses
  effect: {
    health?: number // Healing amount
    damage?: number // Damage bonus
    protection?: number // Damage reduction
    luck?: number // Luck modifier
  }
}

export interface Tribute {
  id: string
  name: string
  district: number
  slot: number
  avatar: string
  imageUrl?: string
  characterId?: string
  gender: "male" | "female"
  isAlive: boolean
  kills: number
  health: number
  status: "healthy" | "injured" | "critical"
  allies: Ally[] // Allies with ally IDs and reasons
  inventory: InventoryItem[] // Items received from sponsors
}

export type EventType = "kill" | "sponsor" | "shelter" | "injury" | "alliance" | "trap" | "escape" | "neutral" | "betrayal" | "theft" | "exploration" | "romance" | "final"

export interface GameEvent {
  id: string
  turn: number
  phase: "day" | "night"
  type: EventType
  description: string
  involvedTributes: string[]
  timestamp: Date
}

export interface CustomEventTemplate {
  id: string
  template: string
  type: EventType
  phase: "day" | "night" | "both"
  requiresKiller?: boolean
  requiresVictim?: boolean
  requiresTwoTributes?: boolean
}

export interface District {
  id: number
  name: string
  color: string
}

export interface Sponsor {
  id: string
  name: string
  wealth: number // How generous they are (affects drop rates)
  favoriteTributes: string[] // Tribute IDs they prefer to sponsor
}

export interface GameState {
  tributes: Tribute[]
  districts: District[]
  sponsors: Sponsor[]
  events: GameEvent[]
  currentTurn: number
  currentPhase: "day" | "night"
  isGameOver: boolean
  winner: Tribute | null
  gameStarted: boolean
  customEventTemplates?: CustomEventTemplate[]
}

export const DISTRICT_NAMES: Record<number, string> = {
  1: "Lujo",
  2: "Cantería",
  3: "Tecnología",
  4: "Pesca",
  5: "Energía",
  6: "Transporte",
  7: "Madera",
  8: "Textiles",
  9: "Grano",
  10: "Ganadería",
  11: "Agricultura",
  12: "Minería",
}

export const DISTRICT_COLORS: Record<number, string> = {
  1: "bg-amber-500/10 border-amber-500/30",
  2: "bg-stone-500/10 border-stone-500/30",
  3: "bg-blue-500/10 border-blue-500/30",
  4: "bg-cyan-500/10 border-cyan-500/30",
  5: "bg-yellow-500/10 border-yellow-500/30",
  6: "bg-green-500/10 border-green-500/30",
  7: "bg-orange-500/10 border-orange-500/30",
  8: "bg-purple-500/10 border-purple-500/30",
  9: "bg-lime-500/10 border-lime-500/30",
  10: "bg-red-500/10 border-red-500/30",
  11: "bg-teal-500/10 border-teal-500/30",
  12: "bg-gray-500/10 border-gray-500/30",
}



export const AVATAR_COLORS = [
  "bg-amber-600", "bg-rose-600", "bg-emerald-600", "bg-cyan-600",
  "bg-indigo-600", "bg-fuchsia-600", "bg-lime-600", "bg-orange-600",
  "bg-teal-600", "bg-pink-600", "bg-violet-600", "bg-sky-600",
]