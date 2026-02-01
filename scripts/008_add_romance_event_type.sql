-- Script para agregar el tipo de evento 'romance' a la base de datos

-- Actualizar el constraint CHECK para incluir 'romance'
ALTER TABLE event_templates DROP CONSTRAINT IF EXISTS event_templates_type_check;
ALTER TABLE event_templates ADD CONSTRAINT event_templates_type_check 
  CHECK (type IN ('kill', 'sponsor', 'shelter', 'injury', 'alliance', 'trap', 'escape', 'neutral', 'betrayal', 'theft', 'exploration', 'romance'));

-- Actualizar el constraint CHECK en la tabla game_events
ALTER TABLE game_events DROP CONSTRAINT IF EXISTS game_events_type_check;
ALTER TABLE game_events ADD CONSTRAINT game_events_type_check
  CHECK (type IN ('kill', 'sponsor', 'shelter', 'injury', 'alliance', 'trap', 'escape', 'neutral', 'betrayal', 'theft', 'exploration', 'romance'));

-- ============================================
-- EVENTOS DE ROMANCE (DÍA)
-- ============================================

INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} comparten un momento romántico bajo el sol.', 'romance', 'day', false, false, true, false),
('{tribute1} le confiesa sus sentimientos a {tribute2} en un momento de intimidad.', 'romance', 'day', false, false, true, false),
('{tribute1} y {tribute2} se toman de las manos mientras caminan por la arena.', 'romance', 'day', false, false, true, false),
('{tribute1} le regala una flor silvestre a {tribute2} como gesto de amor.', 'romance', 'day', false, false, true, false),
('{tribute1} y {tribute2} comparten un beso apasionado escondidos entre los árboles.', 'romance', 'day', false, false, true, false),
('{tribute1} protege a {tribute2} de un peligro menor, mostrando su amor.', 'romance', 'day', false, false, true, false),
('{tribute1} y {tribute2} bailan juntos bajo la luz del día, olvidando los peligros.', 'romance', 'day', false, false, true, false),
('{tribute1} le susurra palabras de amor a {tribute2} al oído.', 'romance', 'day', false, false, true, false),
('{tribute1} y {tribute2} se prometen protegerse mutuamente hasta el final.', 'romance', 'day', false, false, true, false),
('{tribute1} acaricia el cabello de {tribute2} con ternura.', 'romance', 'day', false, false, true, false);

-- ============================================
-- EVENTOS DE ROMANCE (NOCHE)
-- ============================================

INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} se abrazan bajo la luz de la luna llena.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} comparten su refugio para mantenerse calientes durante la noche.', 'romance', 'night', false, false, true, false),
('{tribute1} le cuenta a {tribute2} sobre su vida antes de los Juegos, creando un vínculo emocional.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} se miran a los ojos bajo las estrellas, prometiéndose amor eterno.', 'romance', 'night', false, false, true, false),
('{tribute1} besa suavemente la frente de {tribute2} mientras duerme.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} se acurrucan juntos, buscando consuelo mutuo en la oscuridad.', 'romance', 'night', false, false, true, false),
('{tribute1} le promete a {tribute2} que si uno muere, el otro vivirá para ambos.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} comparten un beso desesperado, sabiendo que podría ser el último.', 'romance', 'night', false, false, true, false),
('{tribute1} acuna a {tribute2} en sus brazos después de una pesadilla.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} entrelazan sus dedos mientras velan el sueño del otro.', 'romance', 'night', false, false, true, false);

-- ============================================
-- EVENTOS DE ROMANCE TRÁGICOS (DÍA Y NOCHE)
-- ============================================

INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} llora silenciosamente mientras {tribute2} duerme, temiendo perderlo/a.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} comparten un momento de tristeza, sabiendo que solo uno puede sobrevivir.', 'romance', 'both', false, false, true, false),
('{tribute1} le pide a {tribute2} que si debe morir, que sea por su mano para ahorrarle sufrimiento.', 'romance', 'night', false, false, true, false),
('{tribute1} y {tribute2} escriben sus nombres en un árbol, marcando su amor para siempre.', 'romance', 'day', false, false, true, false),
('{tribute1} le da a {tribute2} su último pedazo de comida, sacrificando su propia supervivencia.', 'romance', 'both', false, false, true, false);
