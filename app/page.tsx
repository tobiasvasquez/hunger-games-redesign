"use client"

import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import { Flame, Sun, Moon, Sparkles, Users, UserPlus, History, FileText, MapPin, HelpCircle, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DistrictGrid } from "@/components/district-grid"
import { EventFeed } from "@/components/event-feed"
import { GameControls } from "@/components/game-controls"
import { FallenTributes } from "@/components/fallen-tributes"
import { CharacterManager } from "@/components/character-manager"
import { SponsorManager } from "@/components/sponsor-manager"
import { TributeSelector } from "@/components/tribute-selector"
import { DistrictManager } from "@/components/district-manager"
import { GameHistory } from "@/components/game-history"
import { NightSummary } from "@/components/night-summary"
import { DaySummary } from "@/components/day-summary"
import { playKillSound, playCannonSound } from "@/lib/sounds"
import { initializeGame, initializeGameWithCharacters, simulateTurn, advancePhase } from "@/lib/game-engine"
import type { GameState, Character, Sponsor, GameEvent, CustomEventTemplate, Tribute } from "@/lib/game-types"
import { getEventTemplates } from "@/lib/event-templates-persistence"
import { EventTemplateManager } from "@/components/event-template-manager"
import { GameTutorial } from "@/components/game-tutorial"
import { setCookie, getCookie } from "@/lib/cookies"
import { cn } from "@/lib/utils"
import { createClient } from "@/lib/supabase/client"
import {
  createGame,
  updateGame,
  saveEvents,
  saveTributes,
} from "@/lib/game-persistence"

// Client-only component for background sparkles to avoid hydration mismatch
function SparklesBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const sparkles = useMemo(() => {
    if (!mounted) return []
    return Array.from({ length: 20 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 2 + Math.random() * 3,
      size: i % 2 === 0 ? "w-3 h-3" : "w-2 h-2",
    }))
  }, [mounted])

  if (!mounted) {
    return null
  }

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 opacity-30">
        {sparkles.map((sparkle) => (
          <Sparkles
            key={sparkle.id}
            className={cn(
              "absolute text-primary/20 animate-pulse",
              sparkle.size
            )}
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              animationDelay: `${sparkle.delay}s`,
              animationDuration: `${sparkle.duration}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}

export default function HungerGamesSimulator() {
  const [gameState, setGameState] = useState<GameState>(() => initializeGame([], []))
  const [isSimulating, setIsSimulating] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [simulationController, setSimulationController] = useState<{ abort: () => void } | null>(null)
  const [characters, setCharacters] = useState<Character[]>([])
  const [sponsors, setSponsors] = useState<Sponsor[]>([])
  const [showCharacterManager, setShowCharacterManager] = useState(false)
  const [showSponsorManager, setShowSponsorManager] = useState(false)
  const [showTributeSelector, setShowTributeSelector] = useState(false)
  const [showDistrictManager, setShowDistrictManager] = useState(false)
  const [showGameHistory, setShowGameHistory] = useState(false)
  const [showNightSummary, setShowNightSummary] = useState(false)
  const [showDaySummary, setShowDaySummary] = useState(false)
  const [showEventTemplateManager, setShowEventTemplateManager] = useState(false)
  const [showTutorial, setShowTutorial] = useState(false)
  const [nightEvents, setNightEvents] = useState<GameEvent[]>([])
  const [dayEvents, setDayEvents] = useState<GameEvent[]>([])
  const [isLoadingCharacters, setIsLoadingCharacters] = useState(true)
  const [isLoadingSponsors, setIsLoadingSponsors] = useState(true)
  const [currentGameId, setCurrentGameId] = useState<string | null>(null)
  const [previousEventCount, setPreviousEventCount] = useState(0)
  const [customEventTemplates, setCustomEventTemplates] = useState<CustomEventTemplate[]>([])
  const [isLoadingTemplates, setIsLoadingTemplates] = useState(true)

  // Refs for simulation control
  const pauseRef = useRef<() => void>(() => {})
  const resumeRef = useRef<() => void>(() => {})
  const stopRef = useRef<() => void>(() => {})

  const supabase = createClient()

  // Load characters from database
  useEffect(() => {
    async function loadCharacters() {
      setIsLoadingCharacters(true)

      const { data, error } = await supabase
        .from("characters")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log("[v0] Error loading characters:", error)
      } else {
        const characterData = data || []
        setCharacters(characterData)
      }
      setIsLoadingCharacters(false)
    }
    loadCharacters()
  }, [supabase])

  // Load sponsors from Supabase
  useEffect(() => {
    async function loadSponsors() {
      setIsLoadingSponsors(true)

      const { data, error } = await supabase
        .from("sponsors")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.log("[v0] Error loading sponsors:", error)
      } else {
        const sponsorData = data || []
        setSponsors(sponsorData)
      }
      setIsLoadingSponsors(false)
    }
    loadSponsors()
  }, [supabase])

  // Load custom event templates
  useEffect(() => {
    async function loadTemplates() {
      setIsLoadingTemplates(true)
      const templates = await getEventTemplates()
      setCustomEventTemplates(templates)
      // Update game state with custom templates
      setGameState(prev => ({
        ...prev,
        customEventTemplates: templates
      }))
      setIsLoadingTemplates(false)
    }
    loadTemplates()
  }, [])

  const handleAddCharacter = useCallback(async (name: string, gender: "male" | "female", imageUrl?: string) => {
    // Save to database
    const { data, error } = await supabase
      .from("characters")
      .insert([{ name, gender, image_url: imageUrl }])
      .select()
      .single()

    if (error) {
      console.log("[v0] Error adding character:", error)
    } else {
      setCharacters(prev => [data, ...prev])
      console.log("[v0] Character added to database:", data)
    }
  }, [supabase])

  const handleRemoveCharacter = useCallback(async (id: string) => {
    // Remove from database
    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("[v0] Error removing character:", error)
    } else {
      setCharacters(prev => prev.filter(c => c.id !== id))
      console.log("[v0] Character removed from database:", id)
    }
  }, [supabase])

  const handleAddSponsor = useCallback(async (name: string, wealth: number) => {
    // Save to database
    const { data, error } = await supabase
      .from("sponsors")
      .insert([{ name, wealth }])
      .select()
      .single()

    if (error) {
      console.log("[v0] Error adding sponsor:", error)
    } else {
      setSponsors(prev => [data, ...prev])
      console.log("[v0] Sponsor added to database:", data)
    }
  }, [supabase])

  const handleRemoveSponsor = useCallback(async (id: string) => {
    // Remove from database
    const { error } = await supabase
      .from("sponsors")
      .delete()
      .eq("id", id)

    if (error) {
      console.log("[v0] Error removing sponsor:", error)
    } else {
      setSponsors(prev => prev.filter(s => s.id !== id))
      console.log("[v0] Sponsor removed from database:", id)
    }
  }, [supabase])

  const handleAssignTribute = useCallback((district: number, slot: number, character: Character | null) => {
    setGameState(prev => {
      let newTributes = [...prev.tributes]

      if (character) {
        // Add or update tribute
        const existingTribute = newTributes.find(t => t.district === district && t.slot === slot)
        if (existingTribute) {
          // Update existing tribute
          newTributes = newTributes.map(t =>
            t.district === district && t.slot === slot
              ? {
                  ...t,
                  name: character.name,
                  characterId: character.id,
                  imageUrl: character.image_url,
                }
              : t
          )
        } else {
          // Create new tribute
          const newTribute: Tribute = {
            id: Math.random().toString(36).substring(2, 15),
            name: character.name,
            district,
            slot,
            avatar: `bg-slate-600`, // Will be updated based on district
            imageUrl: character.image_url,
            characterId: character.id,
            gender: character.gender,
            isAlive: true,
            kills: 0,
            health: 60,
            status: "healthy",
            allies: [],
            inventory: [],
          }
          newTributes.push(newTribute)
        }
      } else {
        // Remove tribute if character is null
        newTributes = newTributes.filter(t => !(t.district === district && t.slot === slot))
      }

      return {
        ...prev,
        tributes: newTributes
      }
    })
  }, [])

  const handleRandomizeTributes = useCallback(() => {
    if (characters.length === 0) return
    setGameState(prev => initializeGameWithCharacters(characters, prev.districts, sponsors))
  }, [characters, sponsors])

  const handleDistrictNameChange = useCallback((districtId: number, name: string) => {
    setGameState(prev => ({
      ...prev,
      districts: prev.districts.map(d => 
        d.id === districtId ? { ...d, name } : d
      )
    }))
  }, [])

  const handleConfirmTributes = useCallback(() => {
    setShowTributeSelector(false)
  }, [])

  const handleTributeNameChange = useCallback((id: string, name: string) => {
    setGameState(prev => ({
      ...prev,
      tributes: prev.tributes.map(t => 
        t.id === id ? { ...t, name } : t
      )
    }))
  }, [])

  const handleStart = useCallback(async () => {
    // Create game in database
    const gameId = await createGame()
    if (!gameId) {
      console.error("Failed to create game")
      return
    }

    setCurrentGameId(gameId)
    setPreviousEventCount(0)

    // Start game with current tributes, districts, sponsors, and templates
    const gameReadyState: GameState = {
      ...gameState,
      gameStarted: true,
      currentTurn: 1,
      currentPhase: "day",
      sponsors: sponsors, // Update with latest sponsors
      customEventTemplates: customEventTemplates, // Include loaded templates
      events: [], // Clear any previous events
      isGameOver: false,
      winner: null
    }

    setGameState(gameReadyState)

    // Save initial game state
    await updateGame(gameId, {
      status: "in_progress",
      current_turn: 1,
      current_phase: "day",
    })

    // Save tributes to database
    await saveTributes(gameId, gameState.tributes)
  }, [gameState, sponsors, customEventTemplates])

  const handleSimulateTurn = useCallback(async () => {
    // Allow simulation even without database connection for testing
    // if (!currentGameId) return

    setIsSimulating(true)

    // Check current phase
    const wasDay = gameState.currentPhase === "day"
    const wasNight = gameState.currentPhase === "night"

    // Simulate turn and get new state with events
    const stateAfterTurn = simulateTurn(gameState)
    const newEvents = stateAfterTurn.events.slice(previousEventCount)

    // Note: Death sounds now play when summary modals open

    setGameState(stateAfterTurn)
    setPreviousEventCount(stateAfterTurn.events.length)

    // Save new events to database (only if gameId exists)
    if (currentGameId && newEvents.length > 0) {
      await saveEvents(currentGameId, newEvents)
    }

    await new Promise(resolve => setTimeout(resolve, 500))

    // Advance phase
    const stateAfterPhase = advancePhase(stateAfterTurn)
    
    // If we just ended a night, show the night summary
    if (wasNight && stateAfterPhase.currentPhase === "day") {
      // Get all night events from this turn
      const nightEventsForSummary = stateAfterTurn.events.filter(
        e => e.turn === stateAfterTurn.currentTurn && e.phase === "night"
      )
      setNightEvents(nightEventsForSummary)
      // Update state but keep it at the end of night for the summary
      setGameState({
        ...stateAfterPhase,
        currentPhase: "night", // Keep as night for display
        currentTurn: stateAfterTurn.currentTurn, // Keep current turn
      })
      setShowNightSummary(true)
      setIsSimulating(false)
      return
    }

    // If we just ended a day, show the day summary
    if (wasDay && stateAfterPhase.currentPhase === "night") {
      // Get all day events from this turn
      const dayEventsForSummary = stateAfterTurn.events.filter(
        e => e.turn === stateAfterTurn.currentTurn && e.phase === "day"
      )
      setDayEvents(dayEventsForSummary)
      // Update state but keep it at the end of day for the summary
      setGameState({
        ...stateAfterPhase,
        currentPhase: "day", // Keep as day for display
        currentTurn: stateAfterTurn.currentTurn, // Keep current turn
      })
      setShowDaySummary(true)
      setIsSimulating(false)
      return
    }
    
    setGameState(stateAfterPhase)

    // Update game state in database (only if gameId exists)
    if (currentGameId) {
      await updateGame(currentGameId, {
        current_turn: stateAfterPhase.currentTurn,
        current_phase: stateAfterPhase.currentPhase,
        status: stateAfterPhase.isGameOver ? "finished" : "in_progress",
        winner_id: stateAfterPhase.winner?.id || null,
      })

      // Update tributes if game is over
      if (stateAfterPhase.isGameOver) {
        await saveTributes(currentGameId, stateAfterPhase.tributes)
      }
    }

    setIsSimulating(false)
  }, [gameState, currentGameId, previousEventCount])

  const handleSimulateToEnd = useCallback(async () => {
    if (!currentGameId) return

    setIsSimulating(true)
    setIsPaused(false)

    let eventCount = previousEventCount
    let currentState = gameState
    let shouldStop = false

    const runSimulation = async (state: GameState): Promise<GameState> => {
      // Check if simulation was stopped
      if (shouldStop) return state

      // Wait if paused
      while (pauseRef.current !== resumeRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100))
        if (shouldStop) return state
      }

      if (state.isGameOver) {
        // Save final state
        await updateGame(currentGameId, {
          status: "finished",
          current_turn: state.currentTurn,
          current_phase: state.currentPhase,
          winner_id: state.winner?.id || null,
        })
        await saveTributes(currentGameId, state.tributes)
        return state
      }

      // Simulate turn
      let newState = simulateTurn(state)
      const newEvents = newState.events.slice(eventCount)
      eventCount = newState.events.length

      // Note: Death sounds now play when summary modals open (not during auto-simulate)

      // Save new events
      if (newEvents.length > 0) {
        await saveEvents(currentGameId, newEvents)
      }

      // Advance phase
      newState = advancePhase(newState)

      // Update game state in database
      await updateGame(currentGameId, {
        current_turn: newState.currentTurn,
        current_phase: newState.currentPhase,
        status: newState.isGameOver ? "finished" : "in_progress",
        winner_id: newState.winner?.id || null,
      })

      setGameState(newState)
      currentState = newState
      await new Promise(resolve => setTimeout(resolve, 300))

      return runSimulation(newState)
    }

    // Set up control flags
    const stopHandler = () => { shouldStop = true }
    const pauseHandler = () => { pauseRef.current = () => {} }
    const resumeHandler = () => { pauseRef.current = resumeHandler }

    // Initialize refs
    pauseRef.current = resumeHandler
    resumeRef.current = resumeHandler
    stopRef.current = stopHandler

    await runSimulation(gameState)

    // Clear refs
    pauseRef.current = () => {}
    resumeRef.current = () => {}
    stopRef.current = () => {}

    setPreviousEventCount(eventCount)
    setIsSimulating(false)
    setIsPaused(false)
  }, [gameState, currentGameId, previousEventCount])

  const handleProceedToDay = useCallback(async () => {
    if (!currentGameId) return

    setShowNightSummary(false)
    setNightEvents([])

    // Advance to the next day
    const nextState = {
      ...gameState,
      currentPhase: "day" as const,
      currentTurn: gameState.currentTurn + 1,
    }

    setGameState(nextState)

    // Update game state in database
    await updateGame(currentGameId, {
      current_turn: nextState.currentTurn,
      current_phase: "day",
      status: nextState.isGameOver ? "finished" : "in_progress",
      winner_id: nextState.winner?.id || null,
    })
  }, [currentGameId, gameState])

  const handleProceedToNight = useCallback(async () => {
    if (!currentGameId) return

    setShowDaySummary(false)
    setDayEvents([])

    // Advance to night
    const nextState = {
      ...gameState,
      currentPhase: "night" as const,
    }

    setGameState(nextState)

    // Update game state in database
    await updateGame(currentGameId, {
      current_phase: "night",
      status: nextState.isGameOver ? "finished" : "in_progress",
      winner_id: nextState.winner?.id || null,
    })
  }, [currentGameId, gameState])

  const handlePause = useCallback(() => {
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    setIsPaused(false)
  }, [])

  const handleStop = useCallback(() => {
    if (simulationController) {
      simulationController.abort()
    }
    setIsSimulating(false)
    setIsPaused(false)
    setSimulationController(null)
  }, [simulationController])

  const handleReset = useCallback(() => {
    // Reset game state
    let newState: GameState
    if (characters.length >= 24) {
      newState = initializeGameWithCharacters(characters, gameState.districts)
    } else {
      newState = {
        ...initializeGame([], []),
        districts: gameState.districts,
        sponsors: gameState.sponsors
      }
    }

    setGameState(newState)
    setCurrentGameId(null)
    setPreviousEventCount(0)
    setShowNightSummary(false)
    setNightEvents([])
    setIsSimulating(false)
    setIsPaused(false)
    setSimulationController(null)
  }, [characters, gameState.districts])

  const aliveTributes = gameState.tributes.filter(t => t.isAlive).length

  return (
    <div className={cn(
      "min-h-screen transition-all duration-1000",
      gameState.currentPhase === "night" && gameState.gameStarted
        ? "bg-gradient-to-br from-background via-background to-indigo-950/30"
        : "bg-gradient-to-br from-background via-background to-amber-950/20"
    )}>
      {/* Animated background particles */}
      <SparklesBackground />

      <div className="relative z-10">
        {/* Header */}
        <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-40">
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20 border border-primary/30">
                  <Flame className="w-5 h-5 text-primary" />
                </div>
                <div data-tutorial="header-title">
                  <h1 className="font-serif text-xl md:text-2xl font-bold text-foreground tracking-wide">
                    Los Juegos del Hambre
                  </h1>
                  <p className="text-xs text-muted-foreground">Simulador de la Arena</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Character management buttons */}
                {!gameState.gameStarted && (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowCharacterManager(true)}
                      className="cursor-pointer bg-transparent"
                      data-tutorial="character-button"
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Personajes</span>
                      <span className="ml-1 text-xs text-muted-foreground">({characters.length})</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowTributeSelector(true)}
                      className="cursor-pointer bg-transparent"
                      data-tutorial="tribute-button"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Tributos</span>
                      <span className="ml-1 text-xs text-muted-foreground">({characters.length})</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowDistrictManager(true)}
                      className="cursor-pointer bg-transparent"
                    >
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Distritos</span>
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowSponsorManager(true)}
                      className="cursor-pointer bg-transparent"
                    >
                      <Crown className="w-4 h-4 mr-2" />
                      <span className="hidden sm:inline">Patrocinadores</span>
                      <span className="ml-1 text-xs text-muted-foreground">({sponsors.length})</span>
                    </Button>
                  </>
                )}

                {/* Game History button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowGameHistory(true)}
                  className="cursor-pointer bg-transparent"
                >
                  <History className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Historial</span>
                </Button>

                {/* Event Templates button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowEventTemplateManager(true)}
                  className="cursor-pointer bg-transparent"
                >
                  <FileText className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Eventos</span>
                </Button>

                {/* Tutorial button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowTutorial(true)}
                  className="cursor-pointer bg-transparent"
                >
                  <HelpCircle className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Tutorial</span>
                </Button>

                {/* Day/Night indicator */}
                {gameState.gameStarted && (
                  <div className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-500",
                    gameState.currentPhase === "day"
                      ? "bg-amber-500/20 border-amber-500/30 text-amber-400"
                      : "bg-indigo-500/20 border-indigo-500/30 text-indigo-400"
                  )}>
                    {gameState.currentPhase === "day" ? (
                      <Sun className="w-4 h-4" />
                    ) : (
                      <Moon className="w-4 h-4" />
                    )}
                    <span className="text-sm font-medium hidden sm:inline">
                      {gameState.currentPhase === "day" ? "Dia" : "Noche"}
                    </span>
                    <span className="text-sm font-bold">#{gameState.currentTurn}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="container mx-auto px-4 py-4 space-y-4">
          {/* Game Controls */}
          <div data-tutorial="game-controls">
            <GameControls
              gameState={gameState}
              onStart={handleStart}
              onSimulateTurn={handleSimulateTurn}
              onSimulateToEnd={handleSimulateToEnd}
              onPause={handlePause}
              onResume={handleResume}
              onStop={handleStop}
              onReset={handleReset}
              isSimulating={isSimulating}
              isPaused={isPaused}
              isLoadingTemplates={isLoadingTemplates}
              pauseRef={pauseRef}
              resumeRef={resumeRef}
              stopRef={stopRef}
            />
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            {/* Districts - Only show when there are tributes */}
            {gameState.tributes.length > 0 && (
              <div className="lg:col-span-3 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-serif text-base font-bold text-foreground">
                    Tributos por Distrito
                  </h2>
                  <span className="text-xs text-muted-foreground">
                    {aliveTributes}/{gameState.tributes.length} vivos
                  </span>
                </div>

                <div data-tutorial="districts-grid">
                  <DistrictGrid
                    tributes={gameState.tributes}
                    districts={gameState.districts}
                    onTributeNameChange={handleTributeNameChange}
                    onDistrictNameChange={handleDistrictNameChange}
                    editable={!gameState.gameStarted}
                  />
                </div>
              </div>
            )}

            {/* Event Feed - Adjust column span when no districts */}
            <div className={cn(
              "h-[400px] lg:h-auto lg:min-h-[500px]",
              gameState.tributes.length > 0 ? "lg:col-span-1" : "lg:col-span-4"
            )} data-tutorial="event-feed">
              <EventFeed
                events={gameState.events}
                currentTurn={gameState.currentTurn}
                currentPhase={gameState.currentPhase}
              />
            </div>
          </div>

          {/* Fallen Tributes */}
          <div data-tutorial="fallen-tributes">
            <FallenTributes tributes={gameState.tributes} />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t border-border/50 bg-card/30 backdrop-blur-sm mt-auto">
          <div className="container mx-auto px-4 py-3 text-center">
            <p className="text-xs text-muted-foreground">
              "Que la suerte este siempre de tu lado"
            </p>
          </div>
        </footer>
      </div>

      {/* Character Manager Modal */}
      {showCharacterManager && (
        <CharacterManager
          characters={characters}
          onAddCharacter={handleAddCharacter}
          onRemoveCharacter={handleRemoveCharacter}
          onClose={() => setShowCharacterManager(false)}
          isLoading={isLoadingCharacters}
        />
      )}

      {/* Tribute Selector Modal */}
      {showTributeSelector && (
        <TributeSelector
          characters={characters}
          tributes={gameState.tributes}
          districts={gameState.districts}
          onAssignTribute={handleAssignTribute}
          onDistrictNameChange={handleDistrictNameChange}
          onRandomize={handleRandomizeTributes}
          onConfirm={handleConfirmTributes}
          onClose={() => setShowTributeSelector(false)}
        />
      )}

      {/* Game History Modal */}
      {showGameHistory && (
        <GameHistory onClose={() => setShowGameHistory(false)} />
      )}

      {/* Night Summary Modal */}
      {showNightSummary && (
        <NightSummary
          events={nightEvents}
          turn={gameState.currentTurn}
          aliveCount={gameState.tributes.filter(t => t.isAlive).length}
          deadCount={gameState.tributes.filter(t => !t.isAlive).length}
          onProceed={handleProceedToDay}
        />
      )}

      {/* Day Summary Modal */}
      {showDaySummary && (
        <DaySummary
          events={dayEvents}
          turn={gameState.currentTurn}
          aliveCount={gameState.tributes.filter(t => t.isAlive).length}
          deadCount={gameState.tributes.filter(t => !t.isAlive).length}
          onProceed={handleProceedToNight}
        />
      )}

      {/* District Manager Modal */}
      {showDistrictManager && (
        <DistrictManager
          districts={gameState.districts}
          onUpdateDistricts={(districts) => {
            setGameState(prev => ({ ...prev, districts }))
            setShowDistrictManager(false)
          }}
          onClose={() => setShowDistrictManager(false)}
        />
      )}

      {/* Event Template Manager Modal */}
      {showEventTemplateManager && (
        <EventTemplateManager
          onClose={async () => {
            setShowEventTemplateManager(false)
            // Reload templates when closing
            const templates = await getEventTemplates()
            setCustomEventTemplates(templates)
            setGameState(prev => ({
              ...prev,
              customEventTemplates: templates
            }))
          }}
        />
      )}

      {/* Tutorial Modal */}
      {showTutorial && (
        <GameTutorial onClose={() => setShowTutorial(false)} />
      )}

      {/* Sponsor Manager Modal */}
      {showSponsorManager && (
        <SponsorManager
          sponsors={sponsors}
          onAddSponsor={handleAddSponsor}
          onRemoveSponsor={handleRemoveSponsor}
          onClose={() => setShowSponsorManager(false)}
          isLoading={isLoadingSponsors}
        />
      )}
    </div>
  )
}