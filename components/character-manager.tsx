"use client"

import React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, Trash2, Users, Save, X } from "lucide-react"
import type { Character } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface CharacterManagerProps {
  characters: Character[]
  onAddCharacter: (name: string, imageUrl?: string) => void
  onRemoveCharacter: (id: string) => void
  onClose: () => void
  isLoading?: boolean
}

export function CharacterManager({
  characters,
  onAddCharacter,
  onRemoveCharacter,
  onClose,
  isLoading
}: CharacterManagerProps) {
  const [newName, setNewName] = useState("")
  const [newImageUrl, setNewImageUrl] = useState("")

  const handleAdd = () => {
    if (newName.trim()) {
      onAddCharacter(newName.trim(), newImageUrl.trim() || undefined)
      setNewName("")
      setNewImageUrl("")
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleAdd()
    }
  }

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-card border border-border rounded-xl w-full max-w-2xl max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-3">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Gestionar Personajes
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

        {/* Add new character */}
        <div className="p-4 border-b border-border bg-secondary/30">
          <p className="text-sm text-muted-foreground mb-3">
            Agrega personajes para usar en los juegos. Necesitas al menos 24 para llenar todos los distritos.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Input
              placeholder="Nombre del personaje"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
            <Input
              placeholder="URL de imagen (opcional)"
              value={newImageUrl}
              onChange={(e) => setNewImageUrl(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1"
            />
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

        {/* Character list */}
        <div className="flex-1 overflow-y-auto p-4">
          {characters.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay personajes agregados</p>
              <p className="text-sm mt-1">Agrega personajes usando el formulario de arriba</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {characters.map((char) => (
                <div
                  key={char.id}
                  className="flex items-center gap-3 p-3 bg-secondary/50 rounded-lg border border-border/50 group"
                >
                  {/* Avatar */}
                  <div className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold shrink-0 overflow-hidden",
                    "bg-gradient-to-br from-primary/50 to-accent/50 text-foreground"
                  )}>
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
                  
                  {/* Name */}
                  <span className="flex-1 font-medium text-sm text-foreground truncate">
                    {char.name}
                  </span>
                  
                  {/* Delete */}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveCharacter(char.id)}
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
            {characters.length} personaje{characters.length !== 1 ? "s" : ""} guardado{characters.length !== 1 ? "s" : ""}
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
