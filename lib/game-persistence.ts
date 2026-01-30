import { createClient } from "@/lib/supabase/client"
import type { GameEvent, GameState, Tribute } from "./game-types"

function getSupabase() {
  return createClient()
}

/**
 * Create a new game in the database
 */
export async function createGame(name: string = "Juegos del Hambre"): Promise<string | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("games")
    .insert({
      name,
      status: "setup",
      current_turn: 0,
      current_phase: "day",
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating game:", error)
    return null
  }

  return data.id
}

/**
 * Update game state in database
 */
export async function updateGame(
  gameId: string,
  updates: {
    status?: "setup" | "in_progress" | "finished"
    current_turn?: number
    current_phase?: "day" | "night"
    winner_id?: string | null
  }
): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from("games")
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq("id", gameId)

  if (error) {
    console.error("Error updating game:", error)
    return false
  }

  return true
}

/**
 * Save a single event to the database
 */
export async function saveEvent(
  gameId: string,
  event: GameEvent
): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from("game_events")
    .insert({
      game_id: gameId,
      turn: event.turn,
      phase: event.phase,
      type: event.type,
      description: event.description,
      involved_tribute_ids: event.involvedTributes,
    })

  if (error) {
    console.error("Error saving event:", error)
    return false
  }

  return true
}

/**
 * Save multiple events to the database in a batch
 */
export async function saveEvents(
  gameId: string,
  events: GameEvent[]
): Promise<boolean> {
  if (events.length === 0) return true

  const supabase = getSupabase()
  const eventsToInsert = events.map((event) => {
    // Ensure involved_tribute_ids is an array and filter out any undefined/null values
    // Note: These IDs are not real UUIDs (they're generated client-side), but Supabase
    // should accept them as strings in the UUID[] array field
    const tributeIds = (event.involvedTributes || []).filter(id => id != null && id !== '')
    
    // Validate event type - if constraint hasn't been updated, default to neutral
    const validTypes = ['kill', 'sponsor', 'shelter', 'injury', 'alliance', 'trap', 'escape', 'neutral', 'betrayal', 'theft', 'exploration']
    const eventType = validTypes.includes(event.type) ? event.type : 'neutral'
    
    if (!validTypes.includes(event.type)) {
      console.warn(`Invalid event type: ${event.type}, defaulting to 'neutral'`)
    }
    
    return {
      game_id: gameId,
      turn: event.turn,
      phase: event.phase,
      type: eventType,
      description: event.description,
      involved_tribute_ids: tributeIds.length > 0 ? tributeIds : [],
    }
  })

  // Log first event for debugging
  if (eventsToInsert.length > 0) {
    console.log("Sample event being saved:", JSON.stringify(eventsToInsert[0], null, 2))
  }

  try {
    const { error, data } = await supabase
      .from("game_events")
      .insert(eventsToInsert)
      .select()

    if (error) {
      // Log full error object
      console.error("Error saving events:", error)
      console.error("Error object keys:", Object.keys(error))
      console.error("Error stringified:", JSON.stringify(error, null, 2))
      
      // Extract error information
      const errorInfo: any = {}
      if (error.message) errorInfo.message = error.message
      if (error.details) errorInfo.details = error.details
      if (error.hint) errorInfo.hint = error.hint
      if (error.code) errorInfo.code = error.code
      
      console.error("Error details:", errorInfo)
      
      // Check for UUID format error
      if (error.code === '22P02' && error.message?.includes('invalid input syntax for type uuid')) {
        console.error("⚠️ UUID format error! The involved_tribute_ids field expects UUIDs but received client-generated IDs.")
        console.error("💡 Solution: Run scripts/004_change_involved_tribute_ids_to_text.sql to change the column type to TEXT[]")
      }
      console.error("First event being saved:", JSON.stringify(eventsToInsert[0], null, 2))
      console.error("Total events:", eventsToInsert.length)
      
      // Check if it's a constraint violation
      if (error.code === '23514' || error.message?.includes('check constraint')) {
        console.error("⚠️ Constraint violation! Make sure you've run the migration script to update event types.")
        console.error("Run: scripts/003_update_game_events_types.sql")
      }
      
      return false
    }
    
    return true
  } catch (err) {
    console.error("Exception saving events:", err)
    return false
  }

  return true
}

/**
 * Load events for a specific game
 */
export async function loadGameEvents(gameId: string): Promise<GameEvent[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("game_events")
    .select("*")
    .eq("game_id", gameId)
    .order("turn", { ascending: true })
    .order("phase", { ascending: true })
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error loading events:", error)
    return []
  }

  // Convert database format to GameEvent format
  return (data || []).map((event) => ({
    id: event.id,
    turn: event.turn,
    phase: event.phase as "day" | "night",
    type: event.type as GameEvent["type"],
    description: event.description,
    involvedTributes: event.involved_tribute_ids || [],
    timestamp: new Date(event.created_at),
  }))
}

/**
 * Save tributes for a game
 */
export async function saveTributes(
  gameId: string,
  tributes: Tribute[]
): Promise<boolean> {
  const supabase = getSupabase()
  // Delete existing tributes for this game
  await supabase.from("tributes").delete().eq("game_id", gameId)

  const tributesToInsert = tributes.map((tribute) => ({
    game_id: gameId,
    character_id: tribute.characterId || null,
    name: tribute.name,
    district: tribute.district,
    avatar_color: tribute.avatar,
    health: tribute.health,
    is_alive: tribute.isAlive,
    kills: tribute.kills,
    status: tribute.status,
    position: tribute.slot + 1, // slot is 0-based, position is 1-based
  }))

  const { error } = await supabase.from("tributes").insert(tributesToInsert)

  if (error) {
    console.error("Error saving tributes:", error)
    return false
  }

  return true
}

/**
 * Load tributes for a game
 */
export async function loadGameTributes(gameId: string): Promise<Tribute[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("tributes")
    .select("*")
    .eq("game_id", gameId)
    .order("district", { ascending: true })
    .order("position", { ascending: true })

  if (error) {
    console.error("Error loading tributes:", error)
    return []
  }

  // Convert database format to Tribute format
  // Note: imageUrl is not stored directly - it comes from the character relationship
  return (data || []).map((tribute) => ({
    id: tribute.id,
    name: tribute.name,
    district: tribute.district,
    slot: tribute.position - 1, // position is 1-based, slot is 0-based
    avatar: tribute.avatar_color,
    characterId: tribute.character_id || undefined,
    imageUrl: undefined, // Would need to join with characters table to get this
    isAlive: tribute.is_alive,
    kills: tribute.kills,
    health: tribute.health,
    status: tribute.status as "healthy" | "injured" | "critical",
  }))
}

/**
 * Get all games
 */
export async function getAllGames() {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error loading games:", error)
    return []
  }

  return data || []
}

/**
 * Get a single game by ID
 */
export async function getGame(gameId: string) {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("games")
    .select("*")
    .eq("id", gameId)
    .single()

  if (error) {
    console.error("Error loading game:", error)
    return null
  }

  return data
}

/**
 * Delete a game and all related data (cascade)
 */
export async function deleteGame(gameId: string): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase.from("games").delete().eq("id", gameId)

  if (error) {
    console.error("Error deleting game:", error)
    return false
  }

  return true
}
