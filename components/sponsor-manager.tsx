"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Crown, Save, X } from "lucide-react"
import type { Sponsor } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface SponsorManagerProps {
  sponsors: Sponsor[]
  onAddSponsor: (name: string, wealth: number) => void
  onRemoveSponsor: (id: string) => void
  onClose: () => void
  isLoading?: boolean
}

export function SponsorManager({
  sponsors,
  onAddSponsor,
  onRemoveSponsor,
  onClose,
  isLoading
}: SponsorManagerProps) {
  const [newName, setNewName] = useState("")
  const [newWealth, setNewWealth] = useState(5)

  const handleAdd = () => {
    if (newName.trim()) {
      onAddSponsor(newName.trim(), newWealth)
      setNewName("")
      setNewWealth(5)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  const getWealthLabel = (wealth: number) => {
    if (wealth <= 3) return "Pobre"
    if (wealth <= 5) return "Moderado"
    if (wealth <= 7) return "Rico"
    if (wealth <= 9) return "Muy Rico"
    return "Extremadamente Rico"
  }

  const getWealthColor = (wealth: number) => {
    if (wealth <= 3) return "text-red-500"
    if (wealth <= 5) return "text-orange-500"
    if (wealth <= 7) return "text-yellow-500"
    if (wealth <= 9) return "text-green-500"
    return "text-emerald-500"
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Crown className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Gestionar Patrocinadores
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

        {/* Add new sponsor */}
        <div className="p-4 border-b border-border bg-secondary/30">
          <p className="text-sm text-muted-foreground mb-3">
            Agrega patrocinadores del Capitolio. La riqueza determina qué tan generosos son con los tributos.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Nombre del patrocinador"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <div className="flex items-center gap-2">
              <label className="text-sm text-muted-foreground whitespace-nowrap">
                Riqueza:
              </label>
              <Input
                type="number"
                min="1"
                max="10"
                value={newWealth}
                onChange={(e) => setNewWealth(Math.max(1, Math.min(10, parseInt(e.target.value) || 5)))}
                className="w-20"
              />
              <span className={cn("text-xs font-medium", getWealthColor(newWealth))}>
                {getWealthLabel(newWealth)}
              </span>
            </div>
            <Button
              onClick={handleAdd}
              disabled={!newName.trim() || isLoading}
              className="cursor-pointer bg-primary hover:bg-primary/90"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar
            </Button>
          </div>
        </div>

        {/* Sponsor list */}
        <div className="flex-1 overflow-y-auto p-4">
          {sponsors.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Crown className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay patrocinadores agregados</p>
              <p className="text-sm mt-1">Agrega patrocinadores usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {sponsors.map((sponsor) => (
                <div
                  key={sponsor.id}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50 group"
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0",
                    "bg-gradient-to-br from-amber-500/50 to-yellow-500/50 text-foreground"
                  )}>
                    <Crown className="w-5 h-5" />
                  </div>

                  {/* Name and Wealth */}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-sm text-foreground truncate block">
                      {sponsor.name}
                    </span>
                    <span className={cn("text-xs font-medium", getWealthColor(sponsor.wealth))}>
                      {getWealthLabel(sponsor.wealth)} ({sponsor.wealth}/10)
                    </span>
                  </div>

                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveSponsor(sponsor.id)}
                    disabled={isLoading}
                    className="opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {sponsors.length} patrocinador{sponsors.length !== 1 ? "es" : ""} guardado{sponsors.length !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={onClose}
            className="cursor-pointer"
          >
            <Save className="w-4 h-4 mr-2" />
            Listo
          </Button>
        </div>
      </div>
    </div>
  )
}