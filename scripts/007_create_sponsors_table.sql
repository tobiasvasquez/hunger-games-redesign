-- Tabla para patrocinadores del Capitolio
CREATE TABLE IF NOT EXISTS sponsors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  wealth INTEGER NOT NULL DEFAULT 5 CHECK (wealth >= 1 AND wealth <= 10),
  favorite_tribute_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertar patrocinadores por defecto
INSERT INTO sponsors (name, wealth) VALUES
  ('Presidente Snow', 10),
  ('Senador Crane', 8),
  ('Senador Heavensbee', 7),
  ('Comerciante Rico', 6),
  ('Creador de Juegos', 9),
  ('Estilista Principal', 5),
  ('Locutor', 4),
  ('Noble Capitolino', 6)
ON CONFLICT DO NOTHING;

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_sponsors_wealth ON sponsors(wealth);

-- Habilitar RLS
ALTER TABLE sponsors ENABLE ROW LEVEL SECURITY;

-- Politicas publicas (sin autenticacion por ahora)
CREATE POLICY "Allow public read sponsors" ON sponsors FOR SELECT USING (true);
CREATE POLICY "Allow public insert sponsors" ON sponsors FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update sponsors" ON sponsors FOR UPDATE USING (true);
CREATE POLICY "Allow public delete sponsors" ON sponsors FOR DELETE USING (true);