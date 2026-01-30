"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Shuffle, Check, Users, Pencil } from "lucide-react"
import type { Character, Tribute, District } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface TributeSelectorProps {
  characters: Character[]
  tributes: Tribute[]
  districts: District[]
  onAssignTribute: (district: number, slot: number, character: Character | null) => void
  onDistrictNameChange: (districtId: number, name: string) => void
  onRandomize: () => void
  onConfirm: () => void
  onClose: () => void
}

export function TributeSelector({
  characters,
  tributes,
  districts,
  onAssignTribute,
  onDistrictNameChange,
  onRandomize,
  onConfirm,
  onClose,
}: TributeSelectorProps) {
  const [editingDistrict, setEditingDistrict] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")
  const [selectedSlot, setSelectedSlot] = useState<{ district: number; slot: number } | null>(null)
  
  const assignedCharacterIds = new Set(
    tributes.filter(t => t.characterId).map(t => t.characterId).filter(Boolean)
  )
  
  const availableCharacters = characters.filter(c => c && c.id && !assignedCharacterIds.has(c.id))
  
  // Debug: Log when characters change
  useEffect(() => {
    console.log("[TributeSelector] Characters updated:", {
      total: characters.length,
      available: availableCharacters.length,
      assigned: assignedCharacterIds.size,
      characterNames: characters.map(c => c.name)
    })
  }, [characters.length, availableCharacters.length])
  
  const getTributeForSlot = (district: number, slot: number) => {
    return tributes.find(t => t.district === district && t.slot === slot)
  }

  const getCharacterForTribute = (tribute: Tribute | undefined) => {
    if (!tribute?.characterId) return null
    return characters.find(c => c.id === tribute.characterId) || null
  }

  const getDistrictName = (districtId: number) => {
    return districts.find(d => d.id === districtId)?.name || `Distrito ${districtId}`
  }

  const handleStartEdit = (districtId: number) => {
    setEditingDistrict(districtId)
    setEditValue(getDistrictName(districtId))
  }

  const handleSaveEdit = () => {
    if (editingDistrict && editValue.trim()) {
      onDistrictNameChange(editingDistrict, editValue.trim())
    }
    setEditingDistrict(null)
    setEditValue("")
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSaveEdit()
    } else if (e.key === "Escape") {
      setEditingDistrict(null)
      setEditValue("")
    }
  }

  const allSlotsFilled = tributes.every(t => t.characterId)

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
        // Close modal when clicking on backdrop
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div 
        className="bg-card border border-border rounded-xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl relative z-[101]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Seleccionar Tributos
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={onRandomize}
              disabled={characters.length < 24}
              className="cursor-pointer bg-transparent"
              title={characters.length < 24 ? `Necesitas 24 personajes para aleatorizar (tienes ${characters.length})` : "Asignar personajes aleatoriamente"}
            >
              <Shuffle className="w-4 h-4 mr-2" />
              Aleatorio
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="cursor-pointer"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {characters.length < 24 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Necesitas al menos 24 personajes</p>
              <p className="text-sm mt-1">
                Tienes {characters.length} personaje{characters.length !== 1 ? "s" : ""}. 
                Agrega {24 - characters.length} mas para continuar.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
              {districts.map((district) => {
                const isEditing = editingDistrict === district.id
                
                return (
                  <div
                    key={district.id}
                    className="bg-secondary/30 border border-border/50 rounded-lg p-3 group"
                  >
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-border/30">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                        D{district.id}
                      </span>
                      {isEditing ? (
                        <div className="flex items-center gap-1 flex-1">
                          <input
                            type="text"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleSaveEdit}
                            autoFocus
                            className="flex-1 text-xs bg-secondary/50 border border-primary/50 rounded px-1.5 py-0.5 text-foreground outline-none focus:ring-1 focus:ring-primary min-w-0"
                          />
                          <button
                            onClick={handleSaveEdit}
                            className="p-0.5 text-primary hover:text-primary/80 cursor-pointer shrink-0"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 min-w-0 flex-1">
                          <span className="text-xs text-muted-foreground truncate">
                            {district.name}
                          </span>
                          <button
                            onClick={() => handleStartEdit(district.id)}
                            className="p-0.5 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {[0, 1].map((slot) => {
                        const tribute = getTributeForSlot(district.id, slot)
                        const character = getCharacterForTribute(tribute)
                        const isSelected = selectedSlot?.district === district.id && selectedSlot?.slot === slot
                        
                        return (
                          <button
                            key={slot}
                            onClick={() => setSelectedSlot(isSelected ? null : { district: district.id, slot })}
                            className={cn(
                              "w-full flex items-center gap-2 p-2 rounded-md transition-all cursor-pointer",
                              "border border-border/50 hover:border-primary/50",
                              isSelected && "ring-2 ring-primary border-primary",
                              character ? "bg-secondary/50" : "bg-muted/30"
                            )}
                          >
                            <div className={cn(
                              "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden",
                              character 
                                ? "bg-gradient-to-br from-primary/50 to-accent/50" 
                                : "bg-muted border-2 border-dashed border-muted-foreground/30"
                            )}>
                              {character?.image_url ? (
                                <img 
                                  src={character.image_url || "/placeholder.svg"} 
                                  alt={character.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : character ? (
                                character.name.charAt(0).toUpperCase()
                              ) : (
                                <span className="text-muted-foreground/50">?</span>
                              )}
                            </div>
                            <span className={cn(
                              "text-xs truncate",
                              character ? "text-foreground font-medium" : "text-muted-foreground"
                            )}>
                              {character?.name || "Sin asignar"}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Character selector when slot is selected */}
          {selectedSlot && (
            <div className="mt-4 p-4 bg-secondary/30 rounded-lg border border-border/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm text-foreground">
                  Seleccionar personaje para {getDistrictName(selectedSlot.district)}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onAssignTribute(selectedSlot.district, selectedSlot.slot, null)
                    setSelectedSlot(null)
                  }}
                  className="text-xs cursor-pointer"
                >
                  Quitar asignado
                </Button>
              </div>
              
              <div className="mb-2 text-xs text-muted-foreground">
                {availableCharacters.length} personaje{availableCharacters.length !== 1 ? "s" : ""} disponible{availableCharacters.length !== 1 ? "s" : ""} de {characters.length} total
              </div>
              
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-48 overflow-y-auto">
                {availableCharacters.length === 0 ? (
                  <div className="col-span-full text-center text-muted-foreground py-4 text-xs">
                    <p>No hay personajes disponibles para este slot.</p>
                    <p className="mt-1 opacity-70">
                      {characters.length === 0 
                        ? "Agrega personajes desde el gestor de personajes."
                        : "Todos los personajes ya están asignados."}
                    </p>
                  </div>
                ) : (
                  availableCharacters.map((char) => (
                    <button
                      key={char.id}
                      onClick={() => {
                        onAssignTribute(selectedSlot.district, selectedSlot.slot, char)
                        setSelectedSlot(null)
                      }}
                      className="flex flex-col items-center gap-1 p-2 rounded-md bg-card border border-border/50 hover:border-primary/50 transition-all cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/50 to-accent/50 flex items-center justify-center text-sm font-bold overflow-hidden">
                        {char.image_url ? (
                          <img 
                            src={char.image_url || "/placeholder.svg"} 
                            alt={char.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          char.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-xs text-foreground truncate w-full text-center">
                        {char.name}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border bg-secondary/30 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">
              {tributes.filter(t => t.characterId).length} de 24 tributos asignados
            </span>
            {characters.length < 24 && (
              <span className="text-xs text-amber-400 mt-1">
                ⚠️ Necesitas {24 - characters.length} personaje{24 - characters.length !== 1 ? "s" : ""} más para completar todos los distritos
              </span>
            )}
          </div>
          <Button
            onClick={onConfirm}
            disabled={!allSlotsFilled}
            className="cursor-pointer bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
            title={!allSlotsFilled ? "Asigna personajes a todos los slots para continuar" : ""}
          >
            <Check className="w-4 h-4 mr-2" />
            Confirmar Tributos
          </Button>
        </div>
      </div>
    </div>
  )
}
