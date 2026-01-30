"use client"

import React, { useEffect } from "react"
import { Moon, Sun, ArrowRight, Skull, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameEvent } from "@/lib/game-types"
import { EventFeed } from "./event-feed"
import { cn } from "@/lib/utils"

interface NightSummaryProps {
  events: GameEvent[]
  turn: number
  aliveCount: number
  deadCount: number
  onProceed: () => void
}

export function NightSummary({
  events,
  turn,
  aliveCount,
  deadCount,
  onProceed,
}: NightSummaryProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"
    
    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])
  const killEvents = events.filter(e => e.type === "kill")
  const otherEvents = events.filter(e => e.type !== "kill")

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-indigo-950/50 to-purple-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-indigo-500/20 border border-indigo-500/30">
                <Moon className="w-8 h-8 text-indigo-400" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Resumen de la Noche
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Turno {turn} - Noche
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                <Users className="w-4 h-4" />
                <span className="font-medium">{aliveCount} vivos</span>
              </div>
              {deadCount > 0 && (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/20 border border-red-500/30 text-red-400">
                  <Skull className="w-4 h-4" />
                  <span className="font-medium">{deadCount} caídos</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {events.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Moon className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">La noche pasó sin incidentes</p>
              <p className="text-sm mt-2">Todos los tributos sobrevivieron esta noche</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Kill Events - Highlighted */}
              {killEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Skull className="w-5 h-5 text-red-500" />
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      Eliminaciones ({killEvents.length})
                    </h3>
                  </div>
                  <div className="space-y-2">
                    {killEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border-l-4 border-red-500 bg-red-500/10"
                      >
                        <p className="text-sm text-foreground font-medium">
                          {event.description}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(event.timestamp).toLocaleTimeString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Other Events */}
              {otherEvents.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <Moon className="w-5 h-5 text-indigo-400" />
                    <h3 className="font-serif text-lg font-bold text-foreground">
                      Otros Eventos ({otherEvents.length})
                    </h3>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden">
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <EventFeed
                        events={otherEvents}
                        currentTurn={turn}
                        currentPhase="night"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Proceed Button */}
        <div className="p-6 border-t border-border bg-gradient-to-r from-amber-950/30 to-orange-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Sun className="w-4 h-4 text-amber-400" />
              <span>Preparándose para el nuevo día...</span>
            </div>
            <Button
              onClick={onProceed}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer"
            >
              Continuar al Día
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
