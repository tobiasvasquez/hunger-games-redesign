"use client"

import { Skull } from "lucide-react"
import type { Tribute } from "@/lib/game-types"
import { DISTRICT_NAMES } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface FallenTributesProps {
  tributes: Tribute[]
}

export function FallenTributes({ tributes }: FallenTributesProps) {
  const fallenTributes = tributes.filter(t => !t.isAlive)

  if (fallenTributes.length === 0) {
    return null
  }

  return (
    <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl overflow-hidden">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Skull className="w-5 h-5 text-muted-foreground" />
        <h3 className="font-serif text-lg font-bold text-foreground">Los Caídos</h3>
        <span className="ml-auto text-sm text-muted-foreground">{fallenTributes.length} tributos</span>
      </div>

      <div className="p-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {fallenTributes.map((tribute) => (
          <div
            key={tribute.id}
            className="text-center p-3 rounded-lg bg-muted/30 border border-border/30 opacity-60"
          >
            <div className={cn(
              "w-10 h-10 mx-auto rounded-full flex items-center justify-center text-sm font-bold mb-2 grayscale",
              tribute.avatar,
              "text-white"
            )}>
              {tribute.name.charAt(0).toUpperCase()}
            </div>
            <p className="text-xs font-medium text-foreground truncate">{tribute.name}</p>
            <p className="text-[10px] text-muted-foreground">
              D{tribute.district} - {DISTRICT_NAMES[tribute.district]}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}
