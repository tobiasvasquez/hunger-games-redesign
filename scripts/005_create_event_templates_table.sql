-- Tabla para plantillas de eventos personalizadas
CREATE TABLE IF NOT EXISTS event_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  template TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('kill', 'sponsor', 'shelter', 'injury', 'alliance', 'trap', 'escape', 'neutral', 'betrayal', 'theft', 'exploration')),
  phase TEXT NOT NULL CHECK (phase IN ('day', 'night', 'both')),
  requires_killer BOOLEAN DEFAULT false,
  requires_victim BOOLEAN DEFAULT false,
  requires_two_tributes BOOLEAN DEFAULT false,
  is_custom BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indice para búsquedas rápidas
CREATE INDEX IF NOT EXISTS idx_event_templates_type_phase ON event_templates(type, phase);

-- Habilitar RLS
ALTER TABLE event_templates ENABLE ROW LEVEL SECURITY;

-- Politicas publicas
CREATE POLICY "Allow public read event_templates" ON event_templates FOR SELECT USING (true);
CREATE POLICY "Allow public insert event_templates" ON event_templates FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update event_templates" ON event_templates FOR UPDATE USING (true);
CREATE POLICY "Allow public delete event_templates" ON event_templates FOR DELETE USING (true);
