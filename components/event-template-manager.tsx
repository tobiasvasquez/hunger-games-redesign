"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2, Edit, Save, X, FileText } from "lucide-react"
import type { CustomEventTemplate, EventType } from "@/lib/game-types"
import { getEventTemplates, saveEventTemplate, updateEventTemplate, deleteEventTemplate } from "@/lib/event-templates-persistence"
import { cn } from "@/lib/utils"

interface EventTemplateManagerProps {
  onClose: () => void
}

export function EventTemplateManager({ onClose }: EventTemplateManagerProps) {
  const [templates, setTemplates] = useState<CustomEventTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  
  // Form state
  const [formTemplate, setFormTemplate] = useState("")
  const [formType, setFormType] = useState<EventType>("neutral")
  const [formPhase, setFormPhase] = useState<"day" | "night" | "both">("both")
  const [formRequiresKiller, setFormRequiresKiller] = useState(false)
  const [formRequiresVictim, setFormRequiresVictim] = useState(false)
  const [formRequiresTwoTributes, setFormRequiresTwoTributes] = useState(false)

  useEffect(() => {
    loadTemplates()
  }, [])

  const loadTemplates = async () => {
    setIsLoading(true)
    const loaded = await getEventTemplates()
    setTemplates(loaded)
    setIsLoading(false)
  }

  const handleAdd = async () => {
    if (!formTemplate.trim()) return

    const newTemplate: Omit<CustomEventTemplate, "id"> = {
      template: formTemplate.trim(),
      type: formType,
      phase: formPhase,
      requiresKiller: formRequiresKiller,
      requiresVictim: formRequiresVictim,
      requiresTwoTributes: formRequiresTwoTributes,
    }

    const id = await saveEventTemplate(newTemplate)
    if (id) {
      await loadTemplates()
      resetForm()
      setShowAddForm(false)
    }
  }

  const handleEdit = (template: CustomEventTemplate) => {
    setEditingId(template.id)
    setFormTemplate(template.template)
    setFormType(template.type)
    setFormPhase(template.phase)
    setFormRequiresKiller(template.requiresKiller || false)
    setFormRequiresVictim(template.requiresVictim || false)
    setFormRequiresTwoTributes(template.requiresTwoTributes || false)
    setShowAddForm(false)
  }

  const handleSaveEdit = async () => {
    if (!editingId || !formTemplate.trim()) return

    const success = await updateEventTemplate(editingId, {
      template: formTemplate.trim(),
      type: formType,
      phase: formPhase,
      requiresKiller: formRequiresKiller,
      requiresVictim: formRequiresVictim,
      requiresTwoTributes: formRequiresTwoTributes,
    })

    if (success) {
      await loadTemplates()
      resetForm()
      setEditingId(null)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta plantilla?")) return

    const success = await deleteEventTemplate(id)
    if (success) {
      await loadTemplates()
    }
  }

  const resetForm = () => {
    setFormTemplate("")
    setFormType("neutral")
    setFormPhase("both")
    setFormRequiresKiller(false)
    setFormRequiresVictim(false)
    setFormRequiresTwoTributes(false)
  }

  const handleCancel = () => {
    resetForm()
    setEditingId(null)
    setShowAddForm(false)
  }

  const getPlaceholderForType = (type: EventType) => {
    switch (type) {
      case "kill":
        return "Ej: {killer} elimina a {victim} con su arma."
      case "alliance":
        return "Ej: {tribute1} y {tribute2} forman una alianza."
      case "sponsor":
        return "Ej: {tribute} recibe suministros del Capitolio."
      default:
        return "Ej: {tribute} realiza una acción."
    }
  }

  const eventTypes: EventType[] = [
    "kill", "sponsor", "shelter", "injury", "alliance", 
    "trap", "escape", "neutral", "betrayal", "theft", "exploration"
  ]

  const groupedTemplates = templates.reduce((acc, template) => {
    const key = `${template.type}-${template.phase}`
    if (!acc[key]) {
      acc[key] = []
    }
    acc[key].push(template)
    return acc
  }, {} as Record<string, CustomEventTemplate[]>)

  return (
    <div 
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"
      onClick={(e) => {
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
            <FileText className="w-5 h-5 text-primary" />
            <h2 className="font-serif text-xl font-bold text-foreground">
              Gestionar Plantillas de Eventos
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

        {/* Add/Edit Form */}
        {(showAddForm || editingId) && (
          <div className="p-4 border-b border-border bg-secondary/30">
            <h3 className="font-medium mb-3 text-foreground">
              {editingId ? "Editar Plantilla" : "Agregar Nueva Plantilla"}
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Tipo de Evento</label>
                  <Select value={formType} onValueChange={(v) => setFormType(v as EventType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200] max-h-48">
                      {eventTypes.map((type) => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Fase</label>
                  <Select value={formPhase} onValueChange={(v) => setFormPhase(v as "day" | "night" | "both")}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="z-[200]" position="item-aligned">
                      <SelectItem value="day">Día</SelectItem>
                      <SelectItem value="night">Noche</SelectItem>
                      <SelectItem value="both">Ambas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="text-xs text-muted-foreground mb-1 block">Plantilla</label>
                <Input
                  value={formTemplate}
                  onChange={(e) => setFormTemplate(e.target.value)}
                  placeholder={getPlaceholderForType(formType)}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Usa: {"{tribute}"}, {"{tribute1}"}, {"{tribute2}"}, {"{killer}"}, {"{victim}"}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formRequiresKiller}
                    onChange={(e) => setFormRequiresKiller(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Requiere asesino
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formRequiresVictim}
                    onChange={(e) => setFormRequiresVictim(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Requiere víctima
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formRequiresTwoTributes}
                    onChange={(e) => setFormRequiresTwoTributes(e.target.checked)}
                    className="cursor-pointer"
                  />
                  Requiere dos tributos
                </label>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={editingId ? handleSaveEdit : handleAdd}
                  disabled={!formTemplate.trim()}
                  className="cursor-pointer"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {editingId ? "Guardar Cambios" : "Agregar"}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancel}
                  className="cursor-pointer"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Templates List */}
        <div className="flex-1 overflow-y-auto p-4">
          {!showAddForm && !editingId && (
            <div className="mb-4">
              <Button
                onClick={() => setShowAddForm(true)}
                className="cursor-pointer"
              >
                <Plus className="w-4 h-4 mr-2" />
                Agregar Nueva Plantilla
              </Button>
            </div>
          )}

          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>Cargando plantillas...</p>
            </div>
          ) : templates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>No hay plantillas personalizadas</p>
              <p className="text-sm mt-1">Agrega plantillas usando el botón de arriba</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedTemplates).map(([key, groupTemplates]) => {
                const [type, phase] = key.split("-")
                return (
                  <div key={key} className="border border-border/50 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">
                        {type}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {phase === "day" ? "Día" : phase === "night" ? "Noche" : "Ambas"}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {groupTemplates.map((template) => (
                        <div
                          key={template.id}
                          className="flex items-start gap-2 p-2 bg-secondary/30 rounded border border-border/30 group"
                        >
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-foreground font-mono">
                              {template.template}
                            </p>
                            {(template.requiresKiller || template.requiresVictim || template.requiresTwoTributes) && (
                              <div className="flex gap-2 mt-1">
                                {template.requiresKiller && (
                                  <span className="text-xs text-amber-400">Requiere asesino</span>
                                )}
                                {template.requiresVictim && (
                                  <span className="text-xs text-red-400">Requiere víctima</span>
                                )}
                                {template.requiresTwoTributes && (
                                  <span className="text-xs text-cyan-400">Requiere 2 tributos</span>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(template)}
                              className="h-7 w-7 cursor-pointer"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(template.id)}
                              className="h-7 w-7 text-destructive hover:text-destructive cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
