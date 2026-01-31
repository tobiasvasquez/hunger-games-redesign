import type { Tribute, GameEvent, GameState, District, CustomEventTemplate, Grudge } from "./game-types"
import { DEFAULT_TRIBUTE_NAMES, AVATAR_COLORS, DISTRICT_NAMES, DISTRICT_COLORS } from "./game-types"

const DEFAULT_DISTRICTS: District[] = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  name: DISTRICT_NAMES[i + 1] || `Distrito ${i + 1}`,
  color: DISTRICT_COLORS[i + 1] || "bg-gray-500/10 border-gray-500/30",
}))

// Event templates are now loaded from the database
// See scripts/006_insert_default_event_templates.sql for default events

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function initializeGame(): GameState {
  const tributes: Tribute[] = []
  
  for (let district = 1; district <= 12; district++) {
    for (let slot = 0; slot < 2; slot++) {
      const index = (district - 1) * 2 + slot
      tributes.push({
        id: generateUUID(),
        name: DEFAULT_TRIBUTE_NAMES[index],
        district,
        slot,
        avatar: AVATAR_COLORS[district - 1],
        isAlive: true,
        kills: 0,
        health: 60,
        status: "healthy",
        grudges: [] as Grudge[],
      })
    }
  }

  return {
    tributes,
    districts: DEFAULT_DISTRICTS,
    events: [],
    currentTurn: 0,
    currentPhase: "day",
    isGameOver: false,
    winner: null,
    gameStarted: false,
  }
}

export function initializeGameWithCharacters(
  characters: { id: string; name: string; image_url?: string }[],
  customDistricts?: District[]
): GameState {
  const tributes: Tribute[] = []
  const shuffled = [...characters].sort(() => Math.random() - 0.5)
  const districts = customDistricts || DEFAULT_DISTRICTS
  
  for (let district = 1; district <= 12; district++) {
    for (let slot = 0; slot < 2; slot++) {
      const index = (district - 1) * 2 + slot
      const char = shuffled[index]
      tributes.push({
        id: generateUUID(),
        name: char?.name || DEFAULT_TRIBUTE_NAMES[index],
        district,
        slot,
        avatar: AVATAR_COLORS[district - 1],
        imageUrl: char?.image_url,
        characterId: char?.id,
        isAlive: true,
        kills: 0,
        health: 60,
        status: "healthy",
        grudges: [],
      })
    }
  }

  return {
    tributes,
    districts,
    events: [],
    currentTurn: 0,
    currentPhase: "day",
    isGameOver: false,
    winner: null,
    gameStarted: false,
  }
}

export function simulateTurn(state: GameState): GameState {
  const newState = { ...state }
  const aliveTributes = newState.tributes.filter(t => t.isAlive)
  
  if (aliveTributes.length <= 1) {
    newState.isGameOver = true
    newState.winner = aliveTributes[0] || null
    return newState
  }

  const newEvents: GameEvent[] = []
  
  // Load event templates from database (all templates, including defaults)
  let templatesToUse = newState.customEventTemplates || []

  // Fallback to hardcoded templates if database is empty
  if (templatesToUse.length === 0) {
    console.warn("No event templates loaded from database. Using fallback templates.")
    templatesToUse = getFallbackEventTemplates()
  }

  const currentPhase = newState.currentPhase
  const availableTemplates = templatesToUse.filter(
    t => t.phase === currentPhase || t.phase === "both"
  )
  
  // Group templates by type
  const eventPool = availableTemplates.reduce((acc, template) => {
    if (!acc[template.type]) {
      acc[template.type] = []
    }
    acc[template.type].push(template.template)
    return acc
  }, {} as Record<string, string[]>)
  
  // Convert to array format for compatibility
  const eventPoolArray = Object.entries(eventPool).map(([type, templates]) => ({
    type: type as any,
    templates: templates as string[]
  }))
  
  // Each alive tribute has a chance for an event
  const shuffledTributes = [...aliveTributes].sort(() => Math.random() - 0.5)
  const processedTributes = new Set<string>()

  for (const tribute of shuffledTributes) {
    if (processedTributes.has(tribute.id)) continue
    if (!tribute.isAlive) continue

    if (eventPoolArray.length === 0) {
      // No events available for this phase
      continue
    }
    
    const eventCategory = getRandomElement(eventPoolArray)
    const template = getRandomElement(eventCategory.templates)
    
    if (eventCategory.type === "kill") {
      // Check if this is a deadly single-tribute event (no killer/victim placeholders)
      if (!template.includes("{killer}") && !template.includes("{victim}")) {
        // Instant death event for single tribute
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        if (tributeInState) {
          tributeInState.isAlive = false

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "kill",
            description: template.replace("{tribute}", tribute.name),
            involvedTributes: [tribute.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
        }
      } else if (newState.currentPhase === "night") {
      // Find a valid victim (not from same district, still alive)
      let validVictims = aliveTributes.filter(
        t => t.id !== tribute.id && t.district !== tribute.district && t.isAlive && !processedTributes.has(t.id)
      )

      // REVENGE SYSTEM: Prioritize victims that have previously attacked this tribute
      const revengeTargets = validVictims.filter(v => tribute.grudges.some(g => g.targetId === v.id))
      let victim

      if (revengeTargets.length > 0 && Math.random() > 0.3) {
        // 70% chance to target someone who attacked them
        victim = getRandomElement(revengeTargets)
      } else {
        // Otherwise pick a random valid victim
        victim = getRandomElement(validVictims)
      }

      if (validVictims.length > 0 && Math.random() > 0.6) {
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        const victimInState = newState.tributes.find(t => t.id === victim.id)

        if (tributeInState && victimInState) {
          victimInState.isAlive = false
          tributeInState.kills += 1

          // REVENGE SYSTEM: Since victim dies, we can't add grudges to them,
          // but we could track this for narrative purposes or future revenge mechanics

          // Replace all occurrences of placeholders (using global replace)
          let description = template
            .replace(/{killer}/g, tribute.name)
            .replace(/{victim}/g, victim.name)

          // Add revenge context to description if this was a revenge kill
          if (revengeTargets.includes(victim)) {
            description = description.replace("{killer}", `{killer} (buscando venganza)`)
          }

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "kill",
            description,
            involvedTributes: [tribute.id, victim.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
          processedTributes.add(victim.id)
        }
      }
      }
    } else if (eventCategory.type === "alliance" && template.includes("{tribute2}")) {
      const validAllies = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id)
      )
      
      if (validAllies.length > 0 && Math.random() > 0.7) {
        const ally = getRandomElement(validAllies)
        
        newEvents.push({
          id: generateUUID(),
          turn: newState.currentTurn,
          phase: newState.currentPhase,
          type: "alliance",
          description: template
            .replace("{tribute1}", tribute.name)
            .replace("{tribute2}", ally.name),
          involvedTributes: [tribute.id, ally.id],
          timestamp: new Date(),
        })
        
        processedTributes.add(tribute.id)
        processedTributes.add(ally.id)
      }
    } else if (eventCategory.type === "injury") {
      if (Math.random() > 0.5) {
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        if (tributeInState) {
          tributeInState.health = Math.max(10, tributeInState.health - 40)
          tributeInState.status = tributeInState.health < 30 ? "critical" : "injured"

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "injury",
            description: template.replace("{tribute}", tribute.name),
            involvedTributes: [tribute.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
        }
      }
    } else if (eventCategory.type === "sponsor") {
      if (Math.random() > 0.75) {
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        if (tributeInState) {
          tributeInState.health = Math.min(100, tributeInState.health + 20)
          if (tributeInState.health >= 80) tributeInState.status = "healthy"
          else if (tributeInState.health >= 50) tributeInState.status = "injured"
          
          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "sponsor",
            description: template.replace("{tribute}", tribute.name),
            involvedTributes: [tribute.id],
            timestamp: new Date(),
          })
          
          processedTributes.add(tribute.id)
        }
      }
    } else if (eventCategory.type === "theft" && template.includes("{tribute2}")) {
      // Theft events require two tributes
      const validTargets = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id)
      )
      
      if (validTargets.length > 0 && Math.random() > 0.7) {
        const target = getRandomElement(validTargets)
        const targetInState = newState.tributes.find(t => t.id === target.id)
        
        if (targetInState) {
          // Theft causes health loss to victim
          targetInState.health = Math.max(10, targetInState.health - 25)
          if (targetInState.health < 30) targetInState.status = "critical"
          else if (targetInState.health < 50) targetInState.status = "injured"

          // REVENGE SYSTEM: Add the thief to victim's grudges with reason
          const existingGrudge = targetInState.grudges.find(g => g.targetId === tribute.id)
          if (!existingGrudge) {
            targetInState.grudges.push({
              targetId: tribute.id,
              reason: "robo"
            })
          }

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "theft",
            description: template
              .replace("{tribute1}", tribute.name)
              .replace("{tribute2}", target.name),
            involvedTributes: [tribute.id, target.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
          processedTributes.add(target.id)
        }
      }
    } else if (eventCategory.type === "betrayal" && template.includes("{tribute2}")) {
      // Betrayal events require two tributes
      const validTargets = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id)
      )
      
      if (validTargets.length > 0 && Math.random() > 0.75) {
        const target = getRandomElement(validTargets)
        const targetInState = newState.tributes.find(t => t.id === target.id)
        
        if (targetInState) {
          // Betrayal causes significant health loss and stress
          targetInState.health = Math.max(15, targetInState.health - 35)
          if (targetInState.health < 30) targetInState.status = "critical"
          else if (targetInState.health < 50) targetInState.status = "injured"

          // REVENGE SYSTEM: Add the betrayer to victim's grudges with reason
          const existingGrudge = targetInState.grudges.find(g => g.targetId === tribute.id)
          if (!existingGrudge) {
            targetInState.grudges.push({
              targetId: tribute.id,
              reason: "traición"
            })
          }

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "betrayal",
            description: template
              .replace("{tribute1}", tribute.name)
              .replace("{tribute2}", target.name),
            involvedTributes: [tribute.id, target.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
          processedTributes.add(target.id)
        }
      }
    } else if (eventCategory.type === "exploration") {
      // Exploration events can provide benefits
      if (Math.random() > 0.6) {
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        if (tributeInState) {
          // Exploration can restore some health
          tributeInState.health = Math.min(100, tributeInState.health + 10)
          if (tributeInState.health >= 80) tributeInState.status = "healthy"
          else if (tributeInState.health >= 50) tributeInState.status = "injured"
          
          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "exploration",
            description: template.replace("{tribute}", tribute.name),
            involvedTributes: [tribute.id],
            timestamp: new Date(),
          })
          
          processedTributes.add(tribute.id)
        }
      }
    } else {
      // Neutral events, shelter, trap, escape
      if (Math.random() > 0.5) {
        newEvents.push({
          id: generateUUID(),
          turn: newState.currentTurn,
          phase: newState.currentPhase,
          type: eventCategory.type as GameEvent["type"],
          description: template.replace("{tribute}", tribute.name),
          involvedTributes: [tribute.id],
          timestamp: new Date(),
        })
        
        processedTributes.add(tribute.id)
      }
    }
  }

  newState.events = [...newState.events, ...newEvents]
  
  // Check for winner after events
  const stillAlive = newState.tributes.filter(t => t.isAlive)
  if (stillAlive.length === 1) {
    newState.isGameOver = true
    newState.winner = stillAlive[0]
  }

  return newState
}

export function advancePhase(state: GameState): GameState {
  const newState = { ...state }

  if (newState.currentPhase === "day") {
    newState.currentPhase = "night"
  } else {
    newState.currentPhase = "day"
    newState.currentTurn += 1
  }

  return newState
}

// Fallback event templates when database is not available
function getFallbackEventTemplates(): CustomEventTemplate[] {
  return [
    // Day events
    { id: "1", template: "{tribute} explora el bosque en busca de recursos.", type: "neutral", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "2", template: "{tribute} encuentra una cueva segura para refugiarse.", type: "shelter", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "3", template: "{tribute} recibe un paquete de patrocinadores con comida.", type: "sponsor", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "4", template: "{tribute} se lesiona al caer de un árbol.", type: "injury", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "5", template: "{tribute1} y {tribute2} forman una alianza temporal.", type: "alliance", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: true },
    { id: "6", template: "{tribute} descubre una cornucopia abandonada con suministros.", type: "exploration", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "7", template: "{tribute1} roba suministros de {tribute2} mientras duerme.", type: "theft", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: true },
    { id: "8", template: "{tribute} es atacado por un lobo mutante y no sobrevive.", type: "kill", phase: "day", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },

    // Night events
    { id: "9", template: "{killer} embosca a {victim} mientras dormía. {victim} ha caído.", type: "kill", phase: "night", requiresKiller: true, requiresVictim: true, requiresTwoTributes: false },
    { id: "9b", template: "{killer} (buscando venganza) ataca a {victim} en la oscuridad. {victim} no sobrevive.", type: "kill", phase: "night", requiresKiller: true, requiresVictim: true, requiresTwoTributes: false },
    { id: "10", template: "{tribute} activa una trampa del Capitolio pero logra escapar herido/a.", type: "trap", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "11", template: "{tribute} escucha pasos y huye justo a tiempo.", type: "escape", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "12", template: "{tribute} no puede dormir pensando en su familia.", type: "neutral", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "13", template: "{tribute1} traiciona a {tribute2} y roba sus suministros.", type: "betrayal", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: true },
    { id: "14", template: "{tribute1} roba suministros de {tribute2} mientras duerme.", type: "theft", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: true },
    { id: "15", template: "{tribute1} y {tribute2} forman una alianza nocturna.", type: "alliance", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: true },
    { id: "16", template: "{tribute} se lesiona al tropezar en la oscuridad.", type: "injury", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
    { id: "17", template: "{tribute} es devorado por mutos hambrientos en la oscuridad.", type: "kill", phase: "night", requiresKiller: false, requiresVictim: false, requiresTwoTributes: false },
  ]
}
