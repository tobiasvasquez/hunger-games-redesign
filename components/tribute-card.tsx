"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Skull, Heart, AlertTriangle, Shield, Angry, Target } from "lucide-react"
import type { Tribute } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface TributeCardProps {
  tribute: Tribute
  allTributes?: Tribute[] // To check if this tribute is targeted by grudges
  onNameChange?: (name: string) => void
  editable?: boolean
}

export function TributeCard({ tribute, allTributes = [], onNameChange, editable = false }: TributeCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const statusIcon = {
    healthy: <Heart className="w-3 h-3 text-emerald-400" />,
    injured: <AlertTriangle className="w-3 h-3 text-amber-400" />,
    critical: <Skull className="w-3 h-3 text-red-400" />,
  }

  // Check if this tribute is targeted by someone else's grudge
  const isTargeted = allTributes.some(otherTribute =>
    otherTribute.isAlive && otherTribute.grudges.some(g => g.targetId === tribute.id)
  )

  // Get names of tributes who have grudges against this one
  const grudgeHolders = allTributes
    .filter(otherTribute => otherTribute.isAlive && otherTribute.grudges.some(g => g.targetId === tribute.id))
    .map(t => t.name)

  // Convert grudge IDs to names with reasons for the tooltip
  const grudgeTargetNames = tribute.grudges
    .map(grudge => {
      const targetName = allTributes.find(t => t.id === grudge.targetId)?.name
      return targetName ? `${targetName} (${grudge.reason})` : null
    })
    .filter(name => name) // Remove undefined names
    .join(', ')

  // Determine tooltip content
  const tooltipContent = isTargeted && tribute.isAlive
    ? `¡Peligro! ${grudgeHolders.join(', ')} ${grudgeHolders.length === 1 ? 'tiene' : 'tienen'} rencor contra ti`
    : tribute.grudges.length > 0
    ? `Tiene rencor contra: ${grudgeTargetNames}`
    : null

  // Update tooltip position when showing
  useEffect(() => {
    if (showTooltip && cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect()
      setTooltipPosition({
        x: rect.left + rect.width / 2,
        y: rect.bottom + 8 // 8px below the card
      })
    }
  }, [showTooltip])

  // Debug - remove after confirming tooltips work
  // console.log(`Tooltip for ${tribute.name}: isTargeted=${isTargeted}, grudges=${tribute.grudges.length}, content="${tooltipContent}"`)

  return (
    <div
      ref={cardRef}
      className={cn(
        "relative group transition-all duration-300 rounded-md overflow-hidden",
        !tribute.isAlive && "opacity-50 grayscale"
      )}
      onMouseEnter={() => tooltipContent && setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      {/* Custom Tooltip - Rendered via Portal */}
      {showTooltip && tooltipContent && createPortal(
        <div
          className="fixed px-2 py-1 bg-black/90 text-white text-xs rounded shadow-lg z-[9999] whitespace-nowrap pointer-events-none"
          style={{
            left: tooltipPosition.x,
            top: tooltipPosition.y,
            transform: 'translateX(-50%)'
          }}
        >
          {tooltipContent}
          <div
            className="absolute border-4 border-transparent border-b-black/90"
            style={{
              bottom: '100%',
              left: '50%',
              transform: 'translateX(-50%)'
            }}
          ></div>
        </div>,
        document.body
      )}

      {/* Content */}
      <div
        className={cn(
          "relative p-2 bg-secondary/50 border border-border/30 rounded-md transition-all duration-300",
          isTargeted && tribute.isAlive && "border-red-400/50 shadow-lg shadow-red-400/20 bg-red-950/10"
        )}
      >
        {/* Avatar + Info Row */}
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden",
            "ring-1 ring-offset-1 ring-offset-background",
            tribute.isAlive ? "ring-primary/50" : "ring-muted",
            !tribute.imageUrl && tribute.avatar,
            "text-white"
          )}>
            {tribute.imageUrl ? (
              <img 
                src={tribute.imageUrl || "/placeholder.svg"} 
                alt={tribute.name}
                className="w-full h-full object-cover"
              />
            ) : (
              tribute.name.charAt(0).toUpperCase()
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            {editable ? (
              <input
                type="text"
                value={tribute.name}
                onChange={(e) => onNameChange?.(e.target.value)}
                className="w-full bg-transparent border-b border-border/50 focus:border-primary outline-none text-foreground font-medium text-xs"
              />
            ) : (
              <p className="font-medium text-foreground text-xs truncate">{tribute.name}</p>
            )}
            
            <div className="flex items-center gap-1.5 mt-0.5">
              {tribute.isAlive ? (
                <>
                  {statusIcon[tribute.status]}
                  <span className="text-[10px] text-muted-foreground">
                    {Math.round((tribute.health / 60) * 100)}%
                  </span>
                  {tribute.kills > 0 && (
                    <span className="text-[10px] text-accent flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" />
                      {tribute.kills}
                    </span>
                  )}
                  {tribute.grudges.length > 0 && (
                    <span className="text-[10px] text-red-400 flex items-center gap-0.5">
                      <Angry className="w-2.5 h-2.5" />
                      {tribute.grudges.length}
                    </span>
                  )}
                  {isTargeted && tribute.isAlive && (
                    <span className="text-[10px] text-orange-400 flex items-center gap-0.5 animate-pulse">
                      <Target className="w-2.5 h-2.5" />
                      ¡Objetivo!
                    </span>
                  )}
                </>
              ) : (
                <span className="text-[10px] text-destructive flex items-center gap-0.5">
                  <Skull className="w-2.5 h-2.5" />
                  Caído
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Health bar */}
        {tribute.isAlive && (
          <div className="mt-1.5 h-0.5 bg-muted rounded-full overflow-hidden">
            <div
              className={cn(
                "h-full transition-all duration-500",
                tribute.health > 42 ? "bg-emerald-500" :
                tribute.health > 24 ? "bg-amber-500" : "bg-red-500"
              )}
              style={{ width: `${Math.round((tribute.health / 60) * 100)}%` }}
            />
          </div>
        )}
        
        {/* Dead overlay */}
        {!tribute.isAlive && (
          <div className="absolute inset-0 bg-background/40 flex items-center justify-center rounded-md">
            <Skull className="w-5 h-5 text-muted-foreground/50" />
          </div>
        )}
      </div>
    </div>
  )
}
