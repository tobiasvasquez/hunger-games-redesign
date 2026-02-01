"use client"

import { Play, RotateCcw, FastForward, SkipForward, Sun, Moon, Trophy, Users, Skull, Pause, Square } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameState } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface GameControlsProps {
  gameState: GameState
  onStart: () => void
  onSimulateTurn: () => void
  onSimulateToEnd: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onReset: () => void
  isSimulating: boolean
  isPaused: boolean
  isLoadingTemplates?: boolean
  pauseRef: React.MutableRefObject<() => void>
  resumeRef: React.MutableRefObject<() => void>
  stopRef: React.MutableRefObject<() => void>
}

export function GameControls({
  gameState,
  onStart,
  onSimulateTurn,
  onSimulateToEnd,
  onPause,
  onResume,
  onStop,
  onReset,
  isSimulating,
  isPaused,
  isLoadingTemplates = false,
  pauseRef,
  resumeRef,
  stopRef,
}: GameControlsProps) {
  const aliveTributes = gameState.tributes.filter(t => t.isAlive)
  const deadTributes = gameState.tributes.filter(t => !t.isAlive)
  const totalKills = gameState.tributes.reduce((sum, t) => sum + t.kills, 0)

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-center gap-2 text-primary mb-1">
            <Users className="w-4 h-4" />
            <span className="text-2xl font-bold">{aliveTributes.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Tributos Vivos</p>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-center gap-2 text-destructive mb-1">
            <Skull className="w-4 h-4" />
            <span className="text-2xl font-bold">{deadTributes.length}</span>
          </div>
          <p className="text-xs text-muted-foreground">Caídos</p>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <div className={cn(
            "flex items-center justify-center gap-2 mb-1",
            gameState.currentPhase === "day" ? "text-amber-400" : "text-indigo-400"
          )}>
            {gameState.currentPhase === "day" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            <span className="text-2xl font-bold">{gameState.currentTurn}</span>
          </div>
          <p className="text-xs text-muted-foreground">Turno Actual</p>
        </div>
        
        <div className="text-center p-3 rounded-lg bg-secondary/50">
          <div className="flex items-center justify-center gap-2 text-accent mb-1">
            <Trophy className="w-4 h-4" />
            <span className="text-2xl font-bold">{totalKills}</span>
          </div>
          <p className="text-xs text-muted-foreground">Eliminaciones</p>
        </div>
      </div>

      {/* Winner announcement */}
      {gameState.isGameOver && gameState.winner && (
        <div className="mb-6 p-4 rounded-lg bg-primary/10 border border-primary/30 text-center">
          <Trophy className="w-8 h-8 text-primary mx-auto mb-2" />
          <p className="text-lg font-serif font-bold text-primary">
            ¡{gameState.winner.name} del Distrito {gameState.winner.district} ha ganado!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Con {gameState.winner.kills} eliminación{gameState.winner.kills !== 1 ? "es" : ""}
          </p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap gap-3 justify-center">
        {!gameState.gameStarted ? (
          <Button
            onClick={onStart}
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer"
          >
            <Play className="w-5 h-5 mr-2" />
            Comenzar Juegos
          </Button>
        ) : (
          <>
            <Button
              onClick={onSimulateTurn}
              disabled={gameState.isGameOver || isSimulating || isLoadingTemplates}
              variant="default"
              className="bg-primary hover:bg-primary/90 text-primary-foreground cursor-pointer disabled:cursor-not-allowed"
            >
              <SkipForward className="w-4 h-4 mr-2" />
              Siguiente Fase
            </Button>
            
            {isSimulating ? (
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    if (isPaused) {
                      onResume()
                      resumeRef.current()
                    } else {
                      onPause()
                      pauseRef.current()
                    }
                  }}
                  variant="secondary"
                  className="cursor-pointer"
                >
                  {isPaused ? (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Reanudar
                    </>
                  ) : (
                    <>
                      <Pause className="w-4 h-4 mr-2" />
                      Pausar
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => {
                    onStop()
                    stopRef.current()
                  }}
                  variant="destructive"
                  className="cursor-pointer"
                >
                  <Square className="w-4 h-4 mr-2" />
                  Detener
                </Button>
              </div>
            ) : (
              <Button
                onClick={onSimulateToEnd}
                disabled={gameState.isGameOver || isLoadingTemplates}
                variant="secondary"
                className="cursor-pointer disabled:cursor-not-allowed"
              >
                <FastForward className="w-4 h-4 mr-2" />
                Simular Todo
              </Button>
            )}
          </>
        )}
        
        <Button
          onClick={onReset}
          variant="outline"
          className="border-destructive/50 text-destructive hover:bg-destructive/10 bg-transparent cursor-pointer"
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reiniciar
        </Button>
      </div>
    </div>
  )
}
