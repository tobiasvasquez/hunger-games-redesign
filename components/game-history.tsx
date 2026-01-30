"use client"

import React, { useState, useEffect } from "react"
import { History, Trash2, Eye, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { loadGameEvents, deleteGame, getAllGames, getGame } from "@/lib/game-persistence"
import type { GameEvent } from "@/lib/game-types"
import { EventFeed } from "./event-feed"
import { cn } from "@/lib/utils"

interface GameHistoryProps {
  onClose: () => void
}

export function GameHistory({ onClose }: GameHistoryProps) {
  const [games, setGames] = useState<any[]>([])
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null)
  const [selectedGameEvents, setSelectedGameEvents] = useState<GameEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingEvents, setIsLoadingEvents] = useState(false)

  useEffect(() => {
    loadGames()
  }, [])

  const loadGames = async () => {
    setIsLoading(true)
    const allGames = await getAllGames()
    setGames(allGames)
    setIsLoading(false)
  }

  const handleViewGame = async (gameId: string) => {
    setSelectedGameId(gameId)
    setIsLoadingEvents(true)
    const events = await loadGameEvents(gameId)
    setSelectedGameEvents(events)
    setIsLoadingEvents(false)
  }

  const handleDeleteGame = async (gameId: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar este juego?")) return
    
    const success = await deleteGame(gameId)
    if (success) {
      await loadGames()
      if (selectedGameId === gameId) {
        setSelectedGameId(null)
        setSelectedGameEvents([])
      }
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "finished":
        return "text-emerald-400"
      case "in_progress":
        return "text-amber-400"
      default:
        return "text-muted-foreground"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "finished":
        return "Finalizado"
      case "in_progress":
        return "En progreso"
      case "setup":
        return "Configuración"
      default:
        return status
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-6xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <History className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Historial de Juegos
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="cursor-pointer"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-hidden flex">
          {/* Games List */}
          <div className="w-1/3 border-r border-border overflow-y-auto p-4">
            {isLoading ? (
              <div className="text-center text-muted-foreground py-8">
                <p>Cargando juegos...</p>
              </div>
            ) : games.length === 0 ? (
              <div className="text-center text-muted-foreground py-8">
                <History className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No hay juegos guardados</p>
              </div>
            ) : (
              <div className="space-y-2">
                {games.map((game) => (
                  <div
                    key={game.id}
                    className={cn(
                      "p-3 rounded-lg border border-border/50 cursor-pointer transition-all",
                      selectedGameId === game.id
                        ? "bg-primary/10 border-primary/50"
                        : "bg-secondary/30 hover:bg-secondary/50"
                    )}
                    onClick={() => handleViewGame(game.id)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-foreground truncate">
                          {game.name}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {formatDate(game.created_at)}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn("text-xs font-medium", getStatusColor(game.status))}>
                            {getStatusLabel(game.status)}
                          </span>
                          {game.status === "in_progress" && (
                            <span className="text-xs text-muted-foreground">
                              Turno {game.current_turn}
                            </span>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteGame(game.id)
                        }}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Events View */}
          <div className="flex-1 flex flex-col">
            {selectedGameId ? (
              <>
                <div className="p-4 border-b border-border">
                  <div className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-primary" />
                    <h3 className="font-medium text-foreground">
                      Eventos del Juego
                    </h3>
                  </div>
                </div>
                <div className="flex-1 overflow-hidden p-4">
                  {isLoadingEvents ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Cargando eventos...</p>
                    </div>
                  ) : selectedGameEvents.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>Este juego no tiene eventos registrados</p>
                    </div>
                  ) : (
                    <div className="h-full">
                      <EventFeed
                        events={selectedGameEvents}
                        currentTurn={selectedGameEvents[selectedGameEvents.length - 1]?.turn || 0}
                        currentPhase={selectedGameEvents[selectedGameEvents.length - 1]?.phase || "day"}
                      />
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <Eye className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>Selecciona un juego para ver sus eventos</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
