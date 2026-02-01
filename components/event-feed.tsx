"use client"

import React from "react"

import { useRef, useEffect } from "react"
import { Skull, Gift, Home, AlertTriangle, Users, Zap, PersonStanding, Sun, Moon, MapPin, Shield, UserX, Heart } from "lucide-react"
import type { GameEvent } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface EventFeedProps {
  events: GameEvent[]
  currentTurn: number
  currentPhase: "day" | "night"
}

const eventIcons: Record<GameEvent["type"], React.ReactNode> = {
  kill: <Skull className="w-3.5 h-3.5 text-red-500" />,
  sponsor: <Gift className="w-3.5 h-3.5 text-amber-400" />,
  shelter: <Home className="w-3.5 h-3.5 text-emerald-400" />,
  injury: <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />,
  alliance: <Users className="w-3.5 h-3.5 text-cyan-400" />,
  trap: <Zap className="w-3.5 h-3.5 text-rose-400" />,
  escape: <PersonStanding className="w-3.5 h-3.5 text-indigo-400" />,
  neutral: <Sun className="w-3.5 h-3.5 text-muted-foreground" />,
  betrayal: <UserX className="w-3.5 h-3.5 text-purple-500" />,
  theft: <Shield className="w-3.5 h-3.5 text-yellow-500" />,
  exploration: <MapPin className="w-3.5 h-3.5 text-blue-400" />,
  romance: <Heart className="w-3.5 h-3.5 text-pink-500" />,
}

const eventColors: Record<GameEvent["type"], string> = {
  kill: "border-l-red-500 bg-red-500/5",
  sponsor: "border-l-amber-400 bg-amber-400/5",
  shelter: "border-l-emerald-400 bg-emerald-400/5",
  injury: "border-l-orange-400 bg-orange-400/5",
  alliance: "border-l-cyan-400 bg-cyan-400/5",
  trap: "border-l-rose-400 bg-rose-400/5",
  escape: "border-l-indigo-400 bg-indigo-400/5",
  neutral: "border-l-muted bg-muted/5",
  betrayal: "border-l-purple-500 bg-purple-500/5",
  theft: "border-l-yellow-500 bg-yellow-500/5",
  exploration: "border-l-blue-400 bg-blue-400/5",
  romance: "border-l-pink-500 bg-pink-500/5",
}

export function EventFeed({ events, currentTurn, currentPhase }: EventFeedProps) {
  const feedRef = useRef<HTMLDivElement>(null)

  // Scroll to top when new events are added (most recent are at top)
  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0
    }
  }, [events])

  // Group events by turn and phase
  const groupedEvents = events.reduce((acc, event) => {
    const key = `${event.turn}-${event.phase}`
    if (!acc[key]) {
      acc[key] = { turn: event.turn, phase: event.phase, events: [] }
    }
    acc[key].events.push(event)
    return acc
  }, {} as Record<string, { turn: number; phase: "day" | "night"; events: GameEvent[] }>)

  // Sort groups: most recent first (descending by turn, night before day)
  const sortedGroups = Object.values(groupedEvents).sort((a, b) => {
    if (a.turn !== b.turn) return b.turn - a.turn
    return a.phase === "night" ? -1 : 1
  })

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-lg overflow-hidden h-full flex flex-col">
      {/* Header */}
      <div className="px-3 py-2.5 border-b border-border/50 flex items-center justify-between bg-card/80">
        <h3 className="font-serif text-sm font-bold text-foreground">Registro de Eventos</h3>
        {currentTurn > 0 && (
          <div className={cn(
            "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium",
            currentPhase === "day" 
              ? "bg-amber-500/20 text-amber-400" 
              : "bg-indigo-500/20 text-indigo-400"
          )}>
            {currentPhase === "day" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
            <span>T{currentTurn}</span>
          </div>
        )}
      </div>

      {/* Events */}
      <div ref={feedRef} className="flex-1 overflow-y-auto px-2 py-2 max-h-[500px]">
        {events.length === 0 ? (
          <div className="text-center text-muted-foreground py-6">
            <p className="text-xs">Los juegos aun no han comenzado.</p>
            <p className="text-[10px] mt-1 opacity-70">Presiona "Comenzar Juegos" para iniciar.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sortedGroups.map((group) => (
              <div key={`${group.turn}-${group.phase}`}>
                {/* Phase header */}
                <div className={cn(
                  "sticky top-0 z-10 flex items-center gap-1.5 px-2 py-1 mb-1.5 rounded text-[10px] font-semibold uppercase tracking-wide",
                  group.phase === "day" 
                    ? "bg-amber-500/20 text-amber-400" 
                    : "bg-indigo-500/20 text-indigo-400"
                )}>
                  {group.phase === "day" ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
                  <span>Turno {group.turn} - {group.phase === "day" ? "Dia" : "Noche"}</span>
                </div>
                
                {/* Events in this phase */}
                <div className="space-y-1">
                  {group.events.map((event) => (
                    <div
                      key={event.id}
                      className={cn(
                        "px-2 py-1.5 rounded border-l-2 transition-all",
                        eventColors[event.type]
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        <div className="mt-px shrink-0">{eventIcons[event.type]}</div>
                        <p className="text-[11px] text-foreground leading-snug">
                          {event.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
