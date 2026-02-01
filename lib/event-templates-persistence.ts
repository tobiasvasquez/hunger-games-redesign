import { createClient } from "@/lib/supabase/client"
import type { CustomEventTemplate } from "./game-types"

function getSupabase() {
  return createClient()
}

/**
 * Get all custom event templates
 */
export async function getEventTemplates(): Promise<CustomEventTemplate[]> {
  console.log("getEventTemplates: Starting to load event templates")
  const supabase = getSupabase()
  console.log("getEventTemplates: Supabase client created")

  // First, let's check if the table exists by trying a simple count
  const { count, error: countError } = await supabase
    .from("event_templates")
    .select("*", { count: "exact", head: true })

  console.log("getEventTemplates: Table check", { count, countError })

  const { data, error } = await supabase
    .from("event_templates")
    .select("*")
    .order("type", { ascending: true })
    .order("phase", { ascending: true })
    .order("created_at", { ascending: true })

  console.log("getEventTemplates: Query executed", { 
    dataLength: data?.length || 0, 
    error,
    firstTemplate: data?.[0] 
  })

  if (error) {
    console.error("Error loading event templates:", error)
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint
    })
    return []
  }

  const result = (data || []).map((template) => ({
    id: template.id,
    template: template.template,
    type: template.type as CustomEventTemplate["type"],
    phase: template.phase as "day" | "night" | "both",
    requiresKiller: template.requires_killer || false,
    requiresVictim: template.requires_victim || false,
    requiresTwoTributes: template.requires_two_tributes || false,
  }))

  console.log("getEventTemplates: Returning", result.length, "templates")
  return result
}

/**
 * Save a custom event template
 */
export async function saveEventTemplate(
  template: Omit<CustomEventTemplate, "id">
): Promise<string | null> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("event_templates")
    .insert({
      template: template.template,
      type: template.type,
      phase: template.phase,
      requires_killer: template.requiresKiller || false,
      requires_victim: template.requiresVictim || false,
      requires_two_tributes: template.requiresTwoTributes || false,
      is_custom: true,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error saving event template:", error)
    return null
  }

  return data.id
}

/**
 * Update an event template
 */
export async function updateEventTemplate(
  id: string,
  template: Partial<Omit<CustomEventTemplate, "id">>
): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from("event_templates")
    .update({
      template: template.template,
      type: template.type,
      phase: template.phase,
      requires_killer: template.requiresKiller,
      requires_victim: template.requiresVictim,
      requires_two_tributes: template.requiresTwoTributes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating event template:", error)
    return false
  }

  return true
}

/**
 * Delete an event template
 */
export async function deleteEventTemplate(id: string): Promise<boolean> {
  const supabase = getSupabase()
  const { error } = await supabase
    .from("event_templates")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("Error deleting event template:", error)
    return false
  }

  return true
}

/**
 * Get templates by type and phase
 */
export async function getTemplatesByTypeAndPhase(
  type: CustomEventTemplate["type"],
  phase: "day" | "night"
): Promise<CustomEventTemplate[]> {
  const supabase = getSupabase()
  const { data, error } = await supabase
    .from("event_templates")
    .select("*")
    .eq("type", type)
    .or(`phase.eq.${phase},phase.eq.both`)
    .order("created_at", { ascending: true })

  if (error) {
    console.error("Error loading templates by type and phase:", error)
    return []
  }

  return (data || []).map((template) => ({
    id: template.id,
    template: template.template,
    type: template.type as CustomEventTemplate["type"],
    phase: template.phase as "day" | "night" | "both",
    requiresKiller: template.requires_killer || false,
    requiresVictim: template.requires_victim || false,
    requiresTwoTributes: template.requires_two_tributes || false,
  }))
}