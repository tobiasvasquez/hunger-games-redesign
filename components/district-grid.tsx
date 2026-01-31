"use client"

import React from "react"

import { useState } from "react"
import { TributeCard } from "./tribute-card"
import { Pencil, Check } from "lucide-react"
import type { Tribute, District } from "@/lib/game-types"
import { cn } from "@/lib/utils"

interface DistrictGridProps {
  tributes: Tribute[]
  districts: District[]
  onTributeNameChange?: (id: string, name: string) => void
  onDistrictNameChange?: (districtId: number, name: string) => void
  editable?: boolean
}

export function DistrictGrid({ 
  tributes, 
  districts,
  onTributeNameChange, 
  onDistrictNameChange,
  editable = false 
}: DistrictGridProps) {
  const [editingDistrict, setEditingDistrict] = useState<number | null>(null)
  const [editValue, setEditValue] = useState("")

  const getTributesByDistrict = (district: number) => {
    return tributes.filter(t => t.district === district)
  }

  const getAliveCount = (district: number) => {
    return getTributesByDistrict(district).filter(t => t.isAlive).length
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
      onDistrictNameChange?.(editingDistrict, editValue.trim())
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

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4">
      {districts.map((district) => {
        const districtTributes = getTributesByDistrict(district.id)
        const aliveCount = getAliveCount(district.id)
        const isEditing = editingDistrict === district.id
        
        return (
          <div
            key={district.id}
            className={cn(
              "backdrop-blur-sm border rounded-lg p-3 transition-all duration-300 hover:border-primary/30 group",
              district.color
            )}
          >
            {/* District Header */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-border/30">
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded shrink-0">
                  D{district.id}
                </span>
                {isEditing && editable ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      type="text"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onBlur={handleSaveEdit}
                      autoFocus
                      className="flex-1 text-xs bg-secondary/50 border border-primary/50 rounded px-1.5 py-0.5 text-foreground outline-none focus:ring-1 focus:ring-primary"
                    />
                    <button
                      onClick={handleSaveEdit}
                      className="p-0.5 text-primary hover:text-primary/80 cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 min-w-0 flex-1">
                    <span className="text-xs text-muted-foreground truncate">
                      {district.name}
                    </span>
                    {editable && (
                      <button
                        onClick={() => handleStartEdit(district.id)}
                        className="p-0.5 text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shrink-0"
                      >
                        <Pencil className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                )}
              </div>
              <span className={cn(
                "text-xs font-medium shrink-0 ml-2",
                aliveCount === 0 ? 'text-destructive' : 'text-muted-foreground'
              )}>
                {aliveCount}/2
              </span>
            </div>

            {/* Tributes */}
            <div className="flex flex-col gap-2">
              {districtTributes.map((tribute) => (
                <TributeCard
                  key={tribute.id}
                  tribute={tribute}
                  allTributes={tributes}
                  editable={editable}
                  onNameChange={(name) => onTributeNameChange?.(tribute.id, name)}
                />
              ))}
            </div>
          </div>
        )
      })}
    </div>
  )
}
