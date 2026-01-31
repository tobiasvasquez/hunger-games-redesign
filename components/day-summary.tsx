"use client"

import React, { useEffect } from "react"
import { Sun, Moon, ArrowRight, Skull, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { GameEvent } from "@/lib/game-types"
import { EventFeed } from "./event-feed"
import { playCannonSound } from "@/lib/sounds"
import { cn } from "@/lib/utils"

interface DaySummaryProps {
  events: GameEvent[]
  turn: number
  aliveCount: number
  deadCount: number
  onProceed: () => void
}

export function DaySummary({
  events,
  turn,
  aliveCount,
  deadCount,
  onProceed,
}: DaySummaryProps) {
  // Disable body scroll when modal is open
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow
    document.body.style.overflow = "hidden"

    return () => {
      document.body.style.overflow = originalStyle
    }
  }, [])

  // Play death sound when modal opens (if there are deaths)
  useEffect(() => {
    const killEvents = events.filter(e => e.type === "kill")
    if (killEvents.length > 0) {
      // Play death sound for each kill event with a slight delay
      killEvents.forEach((event, index) => {
        setTimeout(() => {
          playCannonSound()
        }, index * 300) // 300ms delay between each death sound
      })
    }
  }, [events])
  const killEvents = events.filter(e => e.type === "kill")
  const otherEvents = events.filter(e => e.type !== "kill")

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-border bg-gradient-to-r from-amber-950/50 to-orange-950/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-amber-500/20 border border-amber-500/30">
                <Sun className="w-8 h-8 text-amber-400" />
              </div>
              <div>
                <h2 className="font-serif text-2xl font-bold text-foreground">
                  Resumen del Día
                </h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Turno {turn} - Día
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
              <Sun className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">El día pasó sin incidentes</p>
              <p className="text-sm mt-2">Todos los tributos sobrevivieron este día</p>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Kill Events - Prominently Displayed */}
              {killEvents.length > 0 && (
                <div className="bg-red-950/20 border border-red-500/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-red-500/20 border border-red-500/30">
                      <Skull className="w-6 h-6 text-red-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-red-400">
                        Caídos en el Día
                      </h3>
                      <p className="text-sm text-red-300/80">
                        {killEvents.length} tributo{killEvents.length !== 1 ? 's' : ''} eliminado{killEvents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {killEvents.map((event) => (
                      <div
                        key={event.id}
                        className="p-4 rounded-lg border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 transition-colors"
                      >
                        <div className="flex items-start gap-3">
                          <div className="p-1.5 rounded-full bg-red-500/20 mt-0.5">
                            <Skull className="w-4 h-4 text-red-400" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm text-foreground font-medium leading-relaxed">
                              {event.description}
                            </p>
                            <p className="text-xs text-red-300/60 mt-2">
                              {new Date(event.timestamp).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {killEvents.length > 0 && otherEvents.length > 0 && (
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                  <div className="px-4 py-2 bg-card/50 border border-border/50 rounded-full">
                    <span className="text-xs text-muted-foreground font-medium">Otros Eventos</span>
                  </div>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-border to-transparent"></div>
                </div>
              )}

              {/* Other Events */}
              {otherEvents.length > 0 && (
                <div className="bg-card/30 border border-border/50 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 rounded-full bg-amber-500/20 border border-amber-500/30">
                      <Sun className="w-6 h-6 text-amber-400" />
                    </div>
                    <div>
                      <h3 className="font-serif text-xl font-bold text-foreground">
                        Eventos Diurnos
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {otherEvents.length} evento{otherEvents.length !== 1 ? 's' : ''} ocurrido{otherEvents.length !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="bg-card/50 border border-border/50 rounded-lg overflow-hidden">
                    <div className="p-4 max-h-96 overflow-y-auto">
                      <EventFeed
                        events={otherEvents}
                        currentTurn={turn}
                        currentPhase="day"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Proceed Button */}
        <div className="p-6 border-t border-border bg-gradient-to-r from-indigo-950/30 to-purple-950/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Moon className="w-4 h-4 text-indigo-400" />
              <span>La noche está cayendo...</span>
            </div>
            <Button
              onClick={onProceed}
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold cursor-pointer"
            >
              Continuar a la Noche
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}