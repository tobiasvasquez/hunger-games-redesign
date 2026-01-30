import type { Tribute, GameEvent, GameState, District } from "./game-types"
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
  if (!newState.customEventTemplates || newState.customEventTemplates.length === 0) {
    // No templates loaded yet, return state without events
    console.warn("No event templates loaded. Please ensure templates are loaded from database.")
    return newState
  }
  
  const currentPhase = newState.currentPhase
  const availableTemplates = newState.customEventTemplates.filter(
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
    
    if (eventCategory.type === "kill" && newState.currentPhase === "night") {
      // Find a valid victim (not from same district, still alive)
      const validVictims = aliveTributes.filter(
        t => t.id !== tribute.id && t.district !== tribute.district && t.isAlive && !processedTributes.has(t.id)
      )
      
      if (validVictims.length > 0 && Math.random() > 0.6) {
        const victim = getRandomElement(validVictims)
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        const victimInState = newState.tributes.find(t => t.id === victim.id)
        
        if (tributeInState && victimInState) {
          victimInState.isAlive = false
          tributeInState.kills += 1
          
          // Replace all occurrences of placeholders (using global replace)
          let description = template
            .replace(/{killer}/g, tribute.name)
            .replace(/{victim}/g, victim.name)
          
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
