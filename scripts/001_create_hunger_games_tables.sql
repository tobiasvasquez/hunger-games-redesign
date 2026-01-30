-- Tabla para guardar los juegos
CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL DEFAULT 'Juegos del Hambre',
  status TEXT NOT NULL DEFAULT 'setup' CHECK (status IN ('setup', 'in_progress', 'finished')),
  current_turn INTEGER NOT NULL DEFAULT 1,
  current_phase TEXT NOT NULL DEFAULT 'day' CHECK (current_phase IN ('day', 'night')),
  winner_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para personajes/tributos personalizados
CREATE TABLE IF NOT EXISTS characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  avatar_color TEXT NOT NULL DEFAULT 'bg-slate-600',
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabla para tributos en un juego especifico
CREATE TABLE IF NOT EXISTS tributes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  character_id UUID REFERENCES characters(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  district INTEGER NOT NULL CHECK (district >= 1 AND district <= 12),
  avatar_color TEXT NOT NULL DEFAULT 'bg-slate-600',
  health INTEGER NOT NULL DEFAULT 100 CHECK (health >= 0 AND health <= 100),
  is_alive BOOLEAN NOT NULL DEFAULT true,
  kills INTEGER NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'healthy' CHECK (status IN ('healthy', 'injured', 'critical', 'dead')),
  position INTEGER NOT NULL DEFAULT 1 CHECK (position >= 1 AND position <= 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(game_id, district, position)
);

-- Tabla para eventos del juego
CREATE TABLE IF NOT EXISTS game_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  turn INTEGER NOT NULL,
  phase TEXT NOT NULL CHECK (phase IN ('day', 'night')),
  type TEXT NOT NULL CHECK (type IN ('kill', 'sponsor', 'shelter', 'injury', 'alliance', 'trap', 'escape', 'neutral', 'betrayal', 'theft', 'exploration')),
  description TEXT NOT NULL,
  involved_tribute_ids TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para mejor performance
CREATE INDEX IF NOT EXISTS idx_tributes_game_id ON tributes(game_id);
CREATE INDEX IF NOT EXISTS idx_tributes_district ON tributes(district);
CREATE INDEX IF NOT EXISTS idx_game_events_game_id ON game_events(game_id);
CREATE INDEX IF NOT EXISTS idx_game_events_turn ON game_events(turn);

-- Habilitar RLS
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE tributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_events ENABLE ROW LEVEL SECURITY;

-- Politicas publicas (sin autenticacion por ahora)
CREATE POLICY "Allow public read games" ON games FOR SELECT USING (true);
CREATE POLICY "Allow public insert games" ON games FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update games" ON games FOR UPDATE USING (true);
CREATE POLICY "Allow public delete games" ON games FOR DELETE USING (true);

CREATE POLICY "Allow public read characters" ON characters FOR SELECT USING (true);
CREATE POLICY "Allow public insert characters" ON characters FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update characters" ON characters FOR UPDATE USING (true);
CREATE POLICY "Allow public delete characters" ON characters FOR DELETE USING (true);

CREATE POLICY "Allow public read tributes" ON tributes FOR SELECT USING (true);
CREATE POLICY "Allow public insert tributes" ON tributes FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update tributes" ON tributes FOR UPDATE USING (true);
CREATE POLICY "Allow public delete tributes" ON tributes FOR DELETE USING (true);

CREATE POLICY "Allow public read events" ON game_events FOR SELECT USING (true);
CREATE POLICY "Allow public insert events" ON game_events FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update events" ON game_events FOR UPDATE USING (true);
CREATE POLICY "Allow public delete events" ON game_events FOR DELETE USING (true);
