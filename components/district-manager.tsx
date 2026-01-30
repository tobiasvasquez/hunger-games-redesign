"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, MapPin, Save, X, Palette } from "lucide-react"
import type { District } from "@/lib/game-types"
import { DISTRICT_NAMES, DISTRICT_COLORS } from "@/lib/game-types"

const COLOR_NAMES: Record<string, string> = {
  "bg-amber-500/10 border-amber-500/30": "Ámbar",
  "bg-stone-500/10 border-stone-500/30": "Piedra",
  "bg-blue-500/10 border-blue-500/30": "Azul",
  "bg-cyan-500/10 border-cyan-500/30": "Cian",
  "bg-yellow-500/10 border-yellow-500/30": "Amarillo",
  "bg-green-500/10 border-green-500/30": "Verde",
  "bg-orange-500/10 border-orange-500/30": "Naranja",
  "bg-purple-500/10 border-purple-500/30": "Morado",
  "bg-lime-500/10 border-lime-500/30": "Lima",
  "bg-red-500/10 border-red-500/30": "Rojo",
  "bg-teal-500/10 border-teal-500/30": "Verde azulado",
  "bg-gray-500/10 border-gray-500/30": "Gris",
}
import { cn } from "@/lib/utils"

interface DistrictManagerProps {
  districts: District[]
  onUpdateDistricts: (districts: District[]) => void
  onClose: () => void
}

export function DistrictManager({
  districts,
  onUpdateDistricts,
  onClose,
}: DistrictManagerProps) {
  const [localDistricts, setLocalDistricts] = useState<District[]>(districts)

  const handleDistrictNameChange = (id: number, name: string) => {
    setLocalDistricts(prev =>
      prev.map(d => d.id === id ? { ...d, name } : d)
    )
  }

  const handleDistrictColorChange = (id: number, color: string) => {
    setLocalDistricts(prev =>
      prev.map(d => d.id === id ? { ...d, color } : d)
    )
  }

  const handleResetToDefault = () => {
    const defaultDistricts: District[] = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      name: DISTRICT_NAMES[i + 1] || `Distrito ${i + 1}`,
      color: DISTRICT_COLORS[i + 1] || "bg-gray-500/10 border-gray-500/30",
    }))
    setLocalDistricts(defaultDistricts)
  }

  const handleSave = () => {
    onUpdateDistricts(localDistricts)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Gestionar Distritos
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

        {/* Info */}
        <div className="p-4 border-b border-border bg-secondary/30">
          <p className="text-sm text-muted-foreground">
            Personaliza los nombres de los 12 distritos. Los cambios se aplicarán al iniciar un nuevo juego.
          </p>
        </div>

        {/* Districts List */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {localDistricts.map((district) => (
              <div
                key={district.id}
                className={cn("p-3 rounded-lg border", district.color)}
              >
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                    D{district.id}
                  </span>
                  <Input
                    value={district.name}
                    onChange={(e) => handleDistrictNameChange(district.id, e.target.value)}
                    className="flex-1 text-sm h-8"
                    placeholder={`Distrito ${district.id}`}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-muted-foreground" />
                  <Select
                    value={district.color}
                    onValueChange={(value) => handleDistrictColorChange(district.id, value)}
                  >
                    <SelectTrigger className="flex-1 h-8">
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent className="z-[60]">
                      {Object.entries(DISTRICT_COLORS).map(([id, colorClass]) => (
                        <SelectItem key={id} value={colorClass}>
                          <div className="flex items-center gap-2">
                            <div className={cn("w-4 h-4 rounded border", colorClass)} />
                            <span>{COLOR_NAMES[colorClass]}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <Button
            variant="outline"
            onClick={handleResetToDefault}
            className="cursor-pointer"
          >
            Restaurar Nombres por Defecto
          </Button>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onClose}
              className="cursor-pointer"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              className="cursor-pointer bg-primary hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
