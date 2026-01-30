"use client"

import { Skull, Heart, AlertTriangle, Shield } from "lucide-react"
import type { Tribute } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface TributeCardProps {
  tribute: Tribute
  onNameChange?: (name: string) => void
  editable?: boolean
}

export function TributeCard({ tribute, onNameChange, editable = false }: TributeCardProps) {
  const statusIcon = {
    healthy: <Heart className="w-3 h-3 text-emerald-400" />,
    injured: <AlertTriangle className="w-3 h-3 text-amber-400" />,
    critical: <Skull className="w-3 h-3 text-red-400" />,
  }

  return (
    <div
      className={cn(
        "relative group transition-all duration-300 rounded-md overflow-hidden",
        !tribute.isAlive && "opacity-50 grayscale"
      )}
    >
      {/* Content */}
      <div className="relative p-2 bg-secondary/50 border border-border/30 rounded-md">
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
