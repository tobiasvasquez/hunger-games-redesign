"use client"

import { useState, useRef, useEffect } from "react"
import { createPortal } from "react-dom"
import { Skull, Heart, AlertTriangle, Shield, Angry, Target, Sword, Cross, Apple, Shield as ShieldIcon, Wrench, User, Users as UsersIcon } from "lucide-react"
import type { Tribute } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface TributeCardProps {
  tribute: Tribute
  allTributes?: Tribute[] // To show ally information
  onNameChange?: (name: string) => void
  onUseItem?: (tributeId: string, itemId: string, targetId?: string) => void
  editable?: boolean
}

export function TributeCard({ tribute, allTributes = [], onNameChange, onUseItem, editable = false }: TributeCardProps) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const statusIcon = {
    healthy: <Heart className="w-3 h-3 text-emerald-400" />,
    injured: <AlertTriangle className="w-3 h-3 text-amber-400" />,
    critical: <Skull className="w-3 h-3 text-red-400" />,
  }

  // Check if this tribute is allied with others
  const hasAllies = tribute.allies.length > 0

  // Get names of tributes who are allies
  const allyNames = tribute.allies
    .map(ally => {
      const allyName = allTributes.find(t => t.id === ally.allyId)?.name
      return allyName ? `${allyName} (${ally.reason})` : null
    })
    .filter(name => name) // Remove undefined names
    .join(', ')

  // Determine tooltip content
  const tooltipContent = hasAllies
    ? `Aliados: ${allyNames}`
    : null

  // Get icon for item type
  const getItemIcon = (type: string) => {
    switch (type) {
      case "weapon": return <Sword className="w-2.5 h-2.5" />
      case "medkit": return <Cross className="w-2.5 h-2.5" />
      case "food": return <Apple className="w-2.5 h-2.5" />
      case "armor": return <ShieldIcon className="w-2.5 h-2.5" />
      case "tool": return <Wrench className="w-2.5 h-2.5" />
      default: return <Target className="w-2.5 h-2.5" />
    }
  }

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
          hasAllies && tribute.isAlive && "border-green-400/50 shadow-lg shadow-green-400/20 bg-green-950/10"
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
                  <span className={cn(
                    "text-[10px] flex items-center gap-0.5",
                    tribute.gender === "male" ? "text-blue-400" : "text-pink-400"
                  )}>
                    {tribute.gender === "male" ? <User className="w-2.5 h-2.5" /> : <UsersIcon className="w-2.5 h-2.5" />}
                    {tribute.gender === "male" ? "M" : "F"}
                  </span>
                  {tribute.kills > 0 && (
                    <span className="text-[10px] text-accent flex items-center gap-0.5">
                      <Shield className="w-2.5 h-2.5" />
                      {tribute.kills}
                    </span>
                  )}
                  {hasAllies && (
                    <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                      <Heart className="w-2.5 h-2.5" />
                      {tribute.allies.length}
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
        
        {/* Inventory */}
        {tribute.isAlive && tribute.inventory.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-0.5">
            {tribute.inventory.map((item) => (
              <button
                key={item.id}
                onClick={() => onUseItem?.(tribute.id, item.id)}
                className={cn(
                  "px-1 py-0.5 text-[8px] rounded border transition-colors",
                  item.type === "weapon" && "bg-red-500/20 border-red-500/50 text-red-300 hover:bg-red-500/30",
                  item.type === "medkit" && "bg-blue-500/20 border-blue-500/50 text-blue-300 hover:bg-blue-500/30",
                  item.type === "food" && "bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30",
                  item.type === "armor" && "bg-yellow-500/20 border-yellow-500/50 text-yellow-300 hover:bg-yellow-500/30",
                  item.type === "tool" && "bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                )}
                title={`${item.name}: ${item.description} (${item.uses}/${item.maxUses} usos)`}
              >
                <div className="flex items-center gap-0.5">
                  {getItemIcon(item.type)}
                  <span className="text-[6px] leading-none">{item.uses}</span>
                </div>
              </button>
            ))}
          </div>
        )}

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
