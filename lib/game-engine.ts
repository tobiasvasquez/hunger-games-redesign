import type { Tribute, GameEvent, GameState, District, CustomEventTemplate, Ally, InventoryItem, Sponsor, Character } from "./game-types"
import { AVATAR_COLORS, DISTRICT_NAMES, DISTRICT_COLORS } from "./game-types"



// Event templates are now loaded from the database
// See scripts/006_insert_default_event_templates.sql for default events

function getRandomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUUID(): string {
  return Math.random().toString(36).substring(2, 15)
}

// Available sponsor items
const SPONSOR_ITEMS: InventoryItem[] = [
  // Weapons
  {
    id: "sword",
    type: "weapon",
    name: "Espada",
    description: "Una espada afilada para combate",
    uses: 3,
    maxUses: 3,
    effect: { damage: 25 }
  },
  {
    id: "bow",
    type: "weapon",
    name: "Arco",
    description: "Un arco con flechas para ataques a distancia",
    uses: 3,
    maxUses: 3,
    effect: { damage: 20, luck: 0.1 }
  },
  {
    id: "axe",
    type: "weapon",
    name: "Hacha",
    description: "Un hacha poderosa pero difícil de usar",
    uses: 3,
    maxUses: 3,
    effect: { damage: 35, luck: -0.1 }
  },
  // Medkits
  {
    id: "medkit",
    type: "medkit",
    name: "Botiquín",
    description: "Kit médico para curar heridas",
    uses: 1,
    maxUses: 1,
    effect: { health: 40 }
  },
  {
    id: "bandages",
    type: "medkit",
    name: "Vendajes",
    description: "Vendajes para heridas menores",
    uses: 2,
    maxUses: 2,
    effect: { health: 20 }
  },
  // Food
  {
    id: "bread",
    type: "food",
    name: "Pan",
    description: "Pan fresco que restaura energía",
    uses: 1,
    maxUses: 1,
    effect: { health: 15 }
  },
  {
    id: "fruit",
    type: "food",
    name: "Fruta",
    description: "Fruta fresca nutritiva",
    uses: 1,
    maxUses: 1,
    effect: { health: 10 }
  },
  // Armor
  {
    id: "helmet",
    type: "armor",
    name: "Casco",
    description: "Protección para la cabeza",
    uses: 5,
    maxUses: 5,
    effect: { protection: 15 }
  },
  {
    id: "vest",
    type: "armor",
    name: "Chaleco",
    description: "Chaleco protector",
    uses: 3,
    maxUses: 3,
    effect: { protection: 20 }
  },
  // Tools
  {
    id: "rope",
    type: "tool",
    name: "Cuerda",
    description: "Útil para escalar y atrapar",
    uses: 2,
    maxUses: 2,
    effect: { luck: 0.15 }
  },
  {
    id: "knife",
    type: "weapon",
    name: "Cuchillo",
    description: "Cuchillo pequeño pero letal",
    uses: 5,
    maxUses: 5,
    effect: { damage: 15 }
  }
]



export function initializeGame(sponsors: Sponsor[], districts: District[]): GameState {
  // No tributes created until characters are assigned
  const tributes: Tribute[] = []

  return {
    tributes,
    districts,
    sponsors,
    events: [],
    currentTurn: 0,
    currentPhase: "day",
    isGameOver: false,
    winner: null,
    gameStarted: false,
  }
}

export function initializeGameWithCharacters(
  characters: Character[],
  customDistricts?: District[],
  sponsors?: Sponsor[]
): GameState {
  const tributes: Tribute[] = []
  const shuffled = [...characters].sort(() => Math.random() - 0.5)
  const districts = customDistricts || []

  // Only create tribute objects for characters that exist
  shuffled.forEach((char, index) => {
    if (char && districts.length > 0) {
      // Assign to districts in order
      const districtIndex = Math.floor(index / 2)
      const slot = index % 2
      const district = districts[districtIndex]

      if (district) {
        tributes.push({
          id: generateUUID(),
          name: char.name,
          district: district.id,
          slot,
          avatar: AVATAR_COLORS[districtIndex % AVATAR_COLORS.length],
          imageUrl: char.image_url,
          characterId: char.id,
          gender: char.gender, // Use stored gender from character
          isAlive: true,
          kills: 0,
          health: 60,
          status: "healthy",
          allies: [],
          inventory: [],
        })
      }
    }
  })

  return {
    tributes,
    districts,
    sponsors: sponsors || [],
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

  // Check if event templates are loaded from database
  if (templatesToUse.length === 0) {
    console.warn("No event templates loaded from database. Please run the SQL scripts to populate the event_templates table.")
    // Return early with no events if no templates are available
    return newState
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

      let victim = getRandomElement(validVictims)

      if (validVictims.length > 0 && Math.random() > 0.6) {
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        const victimInState = newState.tributes.find(t => t.id === victim.id)

        if (tributeInState && victimInState) {
          // Check if killer has weapons for potential multi-kill
          const hasWeapon = tributeInState.inventory.some(item => item.type === "weapon" && item.uses > 0)
          let additionalVictims: Tribute[] = []
          let victimsKilled = 1

          if (hasWeapon && Math.random() > 0.7) { // 30% chance for multi-kill with weapon
            // Find additional victims who are "close" (same district as victim or allies)
            const closeTributes = aliveTributes.filter(t =>
              t.id !== tribute.id &&
              t.id !== victim.id &&
              t.isAlive &&
              !processedTributes.has(t.id) &&
              (t.district === victim.district || // Same district
               tributeInState.allies.some(ally => ally.allyId === t.id) || // Killer's ally
               victimInState.allies.some(ally => ally.allyId === t.id)) // Victim's ally
            )

            // Kill up to 2 additional victims (3 total max)
            const numAdditional = Math.min(closeTributes.length, Math.floor(Math.random() * 3))
            additionalVictims = closeTributes.slice(0, numAdditional)
            victimsKilled += additionalVictims.length
          }

          // Kill primary victim
          victimInState.isAlive = false
          tributeInState.kills += victimsKilled

          // Kill additional victims
          additionalVictims.forEach(victim => {
            const victimState = newState.tributes.find(t => t.id === victim.id)
            if (victimState) {
              victimState.isAlive = false
            }
          })

          // Use weapon if available (reduce uses)
          if (hasWeapon) {
            const weapon = tributeInState.inventory.find(item => item.type === "weapon" && item.uses > 0)
            if (weapon) {
              weapon.uses -= 1
              if (weapon.uses <= 0) {
                tributeInState.inventory = tributeInState.inventory.filter(item => item.id !== weapon.id)
              }
            }
          }

          // Create event description
          let description = template
          let involvedTributes = [tribute.id, victim.id]

          if (additionalVictims.length > 0) {
            // Multi-kill event - need special template or modify existing one
            const victimNames = [victim.name, ...additionalVictims.map(v => v.name)].join(", ")
            description = `${tribute.name} embosca a ${victimNames} con su arma. El cañón suena ${victimsKilled} vez${victimsKilled > 1 ? 'es' : ''}.`
            involvedTributes.push(...additionalVictims.map(v => v.id))
          } else {
            // Single kill - use template
            description = description
              .replace(/{killer}/g, tribute.name)
              .replace(/{victim}/g, victim.name)
          }

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "kill",
            description,
            involvedTributes,
            timestamp: new Date(),
          })

          // Mark all victims as processed
          processedTributes.add(tribute.id)
          processedTributes.add(victim.id)
          additionalVictims.forEach(v => processedTributes.add(v.id))
        }
      }
      }
    } else if (eventCategory.type === "alliance" && template.includes("{tribute2}")) {
      // ALLY SYSTEM: Prioritize forming alliances with existing allies
      let validAllies = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id)
      )

      // Prioritize allies of our allies (reciprocal help)
      const reciprocalTargets = validAllies.filter(target =>
        tribute.allies.some(ally =>
          newState.tributes.find(t => t.id === ally.allyId)?.allies.some(a => a.allyId === target.id)
        )
      )

      let ally
      if (reciprocalTargets.length > 0 && Math.random() > 0.4) {
        // 60% chance to help allies by allying with their allies
        ally = getRandomElement(reciprocalTargets)
      } else {
        ally = getRandomElement(validAllies)
      }

      if (validAllies.length > 0 && Math.random() > 0.7) {
        // Create mutual ally relationship
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        const allyInState = newState.tributes.find(t => t.id === ally.id)

        if (tributeInState && allyInState) {
          // Add ally relationship for both tributes
          const existingAlly1 = tributeInState.allies.find(a => a.allyId === ally.id)
          if (!existingAlly1) {
            tributeInState.allies.push({
              allyId: ally.id,
              reason: "alianza"
            })
          }

          const existingAlly2 = allyInState.allies.find(a => a.allyId === tribute.id)
          if (!existingAlly2) {
            allyInState.allies.push({
              allyId: tribute.id,
              reason: "alianza"
            })
          }
        }

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
      // ALLY SYSTEM: Prioritize sponsoring allies
      let validRecipients = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id) && t.health < 80
      )

      // Prioritize allies for reciprocal help
      const allyRecipients = validRecipients.filter(recipient =>
        tribute.allies.some(ally => ally.allyId === recipient.id)
      )

      let recipient
      if (allyRecipients.length > 0 && Math.random() > 0.4) {
        // 60% chance to help allies
        recipient = getRandomElement(allyRecipients)
      } else {
        recipient = getRandomElement(validRecipients)
      }

      if (validRecipients.length > 0 && Math.random() > 0.5) {
        const recipientInState = newState.tributes.find(t => t.id === recipient.id)
        if (recipientInState) {
          // Select a sponsor based on wealth (richer sponsors more likely)
          const availableSponsors = newState.sponsors.filter(s => s.wealth > 0)
          let selectedSponsor

          if (availableSponsors.length > 0) {
            // Weight selection by wealth
            const totalWealth = availableSponsors.reduce((sum, s) => sum + s.wealth, 0)
            let random = Math.random() * totalWealth

            for (const sponsor of availableSponsors) {
              random -= sponsor.wealth
              if (random <= 0) {
                selectedSponsor = sponsor
                break
              }
            }
          }

          if (!selectedSponsor) {
            selectedSponsor = getRandomElement(availableSponsors)
          }

          // Give a random sponsor item
          const randomItem = getRandomElement(SPONSOR_ITEMS)
          const itemToGive = { ...randomItem, id: generateUUID() } // Create unique instance

          // Check if recipient already has this type of item
          const existingItem = recipientInState.inventory.find(item => item.type === itemToGive.type)
          if (!existingItem) {
            recipientInState.inventory.push(itemToGive)
          } else {
            // Upgrade existing item (add uses)
            existingItem.uses = Math.min(existingItem.maxUses, existingItem.uses + itemToGive.uses)
          }

          // ALLY SYSTEM: Create ally relationship (recipient becomes ally of sponsor)
          const existingAlly = recipientInState.allies.find(a => a.allyId === tribute.id)
          if (!existingAlly) {
            recipientInState.allies.push({
              allyId: tribute.id,
              reason: "patrocinio"
            })
          }

          newEvents.push({
            id: generateUUID(),
            turn: newState.currentTurn,
            phase: newState.currentPhase,
            type: "sponsor",
            description: `${recipient.name} recibe ${itemToGive.name} de ${selectedSponsor.name}`,
            involvedTributes: [recipient.id],
            timestamp: new Date(),
          })

          processedTributes.add(tribute.id)
          processedTributes.add(recipient.id)
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
    } else if (eventCategory.type === "romance" && template.includes("{tribute2}")) {
      // ROMANCE SYSTEM: Create romantic connections between opposite genders only
      let validPartners = aliveTributes.filter(
        t => t.id !== tribute.id && !processedTributes.has(t.id) && t.gender !== tribute.gender
      )

      // Prioritize existing allies for romantic connections
      const allyPartners = validPartners.filter(partner =>
        tribute.allies.some(ally => ally.allyId === partner.id)
      )

      let partner
      if (allyPartners.length > 0 && Math.random() > 0.3) {
        // 70% chance to romance existing allies
        partner = getRandomElement(allyPartners)
      } else {
        partner = getRandomElement(validPartners)
      }

      if (validPartners.length > 0 && Math.random() > 0.6) {
        // Create mutual romantic ally relationship
        const tributeInState = newState.tributes.find(t => t.id === tribute.id)
        const partnerInState = newState.tributes.find(t => t.id === partner.id)

        if (tributeInState && partnerInState) {
          // Add romantic ally relationship for both tributes
          const existingAlly1 = tributeInState.allies.find(a => a.allyId === partner.id)
          if (!existingAlly1) {
            tributeInState.allies.push({
              allyId: partner.id,
              reason: "romance"
            })
          }

          const existingAlly2 = partnerInState.allies.find(a => a.allyId === tribute.id)
          if (!existingAlly2) {
            partnerInState.allies.push({
              allyId: tribute.id,
              reason: "romance"
            })
          }

          // Romance can provide a small health boost (emotional support)
          tributeInState.health = Math.min(100, tributeInState.health + 5)
          partnerInState.health = Math.min(100, partnerInState.health + 5)
        }

        newEvents.push({
          id: generateUUID(),
          turn: newState.currentTurn,
          phase: newState.currentPhase,
          type: "romance",
          description: template
            .replace("{tribute1}", tribute.name)
            .replace("{tribute2}", partner.name),
          involvedTributes: [tribute.id, partner.id],
          timestamp: new Date(),
        })

        processedTributes.add(tribute.id)
        processedTributes.add(partner.id)
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

// Item usage functions
export function useItem(tributeId: string, itemId: string, state: GameState, targetId?: string): { newState: GameState; success: boolean; message: string } {
  const newState = { ...state }
  const tribute = newState.tributes.find(t => t.id === tributeId)
  const target = targetId ? newState.tributes.find(t => t.id === targetId) : tribute

  if (!tribute || !target) {
    return { newState, success: false, message: "Tributo no encontrado" }
  }

  const itemIndex = tribute.inventory.findIndex(item => item.id === itemId)
  if (itemIndex === -1) {
    return { newState, success: false, message: "Item no encontrado en inventario" }
  }

  const item = tribute.inventory[itemIndex]
  if (item.uses <= 0) {
    return { newState, success: false, message: "El item no tiene usos restantes" }
  }

  // Apply item effects
  let success = true
  let message = ""

  switch (item.type) {
    case "medkit":
      if (target.health >= 100) {
        return { newState, success: false, message: "El objetivo ya está completamente sano" }
      }
      target.health = Math.min(100, target.health + (item.effect.health || 0))
      if (target.health >= 80) target.status = "healthy"
      else if (target.health >= 50) target.status = "injured"
      message = `${tribute.name} usa ${item.name} en ${target.name} (+${item.effect.health} HP)`
      break

    case "food":
      if (target.health >= 100) {
        return { newState, success: false, message: "El objetivo ya está completamente sano" }
      }
      target.health = Math.min(100, target.health + (item.effect.health || 0))
      if (target.health >= 80) target.status = "healthy"
      else if (target.health >= 50) target.status = "injured"
      message = `${tribute.name} come ${item.name} (+${item.effect.health} HP)`
      break

    case "weapon":
      // Weapons can only be used in combat situations - this would need to be integrated with kill events
      return { newState, success: false, message: "Las armas solo pueden usarse en combate" }

    case "armor":
      // Armor provides ongoing protection - already applied in combat calculations
      return { newState, success: false, message: "La armadura proporciona protección automática" }

    case "tool":
      // Tools provide luck bonuses - already applied in event calculations
      return { newState, success: false, message: "Las herramientas proporcionan bonos automáticos" }

    default:
      return { newState, success: false, message: "Tipo de item desconocido" }
  }

  // Reduce uses
  item.uses -= 1

  // Remove item if no uses left
  if (item.uses <= 0) {
    tribute.inventory.splice(itemIndex, 1)
  }

  return { newState, success: true, message }
}

// Calculate combat modifiers from inventory
export function getCombatModifiers(tribute: Tribute): { damage: number; protection: number; luck: number } {
  let damage = 0
  let protection = 0
  let luck = 0

  for (const item of tribute.inventory) {
    if (item.effect.damage) damage += item.effect.damage
    if (item.effect.protection) protection += item.effect.protection
    if (item.effect.luck) luck += item.effect.luck
  }

  return { damage, protection, luck }
}