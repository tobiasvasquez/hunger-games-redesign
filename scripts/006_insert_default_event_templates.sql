-- Script para insertar todos los eventos predeterminados en la tabla event_templates
-- Estos eventos reemplazan los arrays hardcodeados en el código

-- ============================================
-- EVENTOS DE DÍA
-- ============================================

-- Neutral (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} explora el bosque en busca de recursos.', 'neutral', 'day', false, false, false, false),
('{tribute} encuentra agua limpia en un arroyo.', 'neutral', 'day', false, false, false, false),
('{tribute} se oculta entre los arbustos.', 'neutral', 'day', false, false, false, false),
('{tribute} construye una trampa rudimentaria.', 'neutral', 'day', false, false, false, false),
('{tribute} descansa bajo la sombra de un árbol.', 'neutral', 'day', false, false, false, false),
('{tribute} practica con su arma.', 'neutral', 'day', false, false, false, false),
('{tribute} observa el cielo buscando señales del Capitolio.', 'neutral', 'day', false, false, false, false),
('{tribute} camina sigilosamente por el sendero.', 'neutral', 'day', false, false, false, false),
('{tribute} estudia el terreno buscando ventajas.', 'neutral', 'day', false, false, false, false),
('{tribute} se detiene a escuchar los sonidos de la arena.', 'neutral', 'day', false, false, false, false),
('{tribute} marca su territorio con señales discretas.', 'neutral', 'day', false, false, false, false),
('{tribute} encuentra huellas de otros tributos.', 'neutral', 'day', false, false, false, false),
('{tribute} busca comida entre la vegetación.', 'neutral', 'day', false, false, false, false),
('{tribute} se baña en un arroyo para refrescarse.', 'neutral', 'day', false, false, false, false);

-- Shelter (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} encuentra una cueva segura para refugiarse.', 'shelter', 'day', false, false, false, false),
('{tribute} construye un refugio con ramas y hojas.', 'shelter', 'day', false, false, false, false),
('{tribute} descubre un escondite abandonado.', 'shelter', 'day', false, false, false, false),
('{tribute} encuentra un árbol hueco perfecto para ocultarse.', 'shelter', 'day', false, false, false, false),
('{tribute} construye un refugio elevado entre las ramas.', 'shelter', 'day', false, false, false, false),
('{tribute} descubre una grieta en la roca que ofrece protección.', 'shelter', 'day', false, false, false, false),
('{tribute} encuentra un refugio natural bajo raíces de árboles.', 'shelter', 'day', false, false, false, false),
('{tribute} construye una cabaña improvisada con materiales del bosque.', 'shelter', 'day', false, false, false, false);

-- Sponsor (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} recibe un paquete de patrocinadores con comida.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe medicina de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe un arma de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe agua purificada de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe una manta térmica de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe un kit de supervivencia del Capitolio.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe comida gourmet de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe un cuchillo afilado de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe una brújula y un mapa de la arena.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe vendas y antiséptico de sus patrocinadores.', 'sponsor', 'day', false, false, false, false);

-- Injury (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} se lesiona al caer de un árbol.', 'injury', 'day', false, false, false, false),
('{tribute} come bayas venenosas y se enferma.', 'injury', 'day', false, false, false, false),
('{tribute} se corta con una roca afilada.', 'injury', 'day', false, false, false, false),
('{tribute} se quema con el sol y desarrolla ampollas.', 'injury', 'day', false, false, false, false),
('{tribute} se tuerce el tobillo al correr por terreno irregular.', 'injury', 'day', false, false, false, false),
('{tribute} se pincha con espinas venenosas de una planta.', 'injury', 'day', false, false, false, false),
('{tribute} se golpea la cabeza al resbalar en una roca mojada.', 'injury', 'day', false, false, false, false),
('{tribute} se corta profundamente mientras prepara una trampa.', 'injury', 'day', false, false, false, false),
('{tribute} desarrolla una infección en una herida menor.', 'injury', 'day', false, false, false, false),
('{tribute} se deshidrata y se siente débil.', 'injury', 'day', false, false, false, false);

-- Deadly Events (Día) - High chance of instant death
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} es atacado por un lobo mutante y no sobrevive.', 'kill', 'day', false, false, false, false),
('{tribute} cae en un pozo de fuego del Capitolio. El cañón suena.', 'kill', 'day', false, false, false, false),
('{tribute} come setas venenosas por error y muere en agonía.', 'kill', 'day', false, false, false, false),
('{tribute} es aplastado por una avalancha provocada por el Capitolio.', 'kill', 'day', false, false, false, false),
('{tribute} es picado por serpientes venenosas y sucumbe rápidamente.', 'kill', 'day', false, false, false, false),
('{tribute} activa una mina terrestre del Capitolio y es despedazado.', 'kill', 'day', false, false, false, false),
('{tribute} bebe agua contaminada y muere de envenenamiento.', 'kill', 'day', false, false, false, false),
('{tribute} es alcanzado por un rayo láser del Capitolio.', 'kill', 'day', false, false, false, false),
('{tribute} es devorado por un oso mutante hambriento.', 'kill', 'day', false, false, false, false),
('{tribute} cae desde un acantilado mientras huye de otros tributos.', 'kill', 'day', false, false, false, false);

-- Alliance (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} forman una alianza temporal.', 'alliance', 'day', false, false, true, false),
('{tribute1} comparte sus recursos con {tribute2}.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} deciden trabajar juntos.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} hacen un pacto de no agresión.', 'alliance', 'day', false, false, true, false),
('{tribute1} ofrece protección a {tribute2} a cambio de recursos.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} intercambian información sobre la arena.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} deciden vigilar turnos para descansar.', 'alliance', 'day', false, false, true, false),
('{tribute1} comparte su refugio con {tribute2}.', 'alliance', 'day', false, false, true, false);

-- Exploration (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} descubre una cornucopia abandonada con suministros.', 'exploration', 'day', false, false, false, false),
('{tribute} encuentra un área rica en recursos naturales.', 'exploration', 'day', false, false, false, false),
('{tribute} explora una zona peligrosa pero con recompensas.', 'exploration', 'day', false, false, false, false),
('{tribute} descubre un sendero que lleva a un área segura.', 'exploration', 'day', false, false, false, false),
('{tribute} encuentra un punto de agua dulce permanente.', 'exploration', 'day', false, false, false, false),
('{tribute} explora las ruinas de una estructura antigua.', 'exploration', 'day', false, false, false, false),
('{tribute} descubre un área con múltiples escondites.', 'exploration', 'day', false, false, false, false),
('{tribute} encuentra un lugar elevado con buena visibilidad.', 'exploration', 'day', false, false, false, false),
('{tribute} explora una cueva que resulta ser un laberinto.', 'exploration', 'day', false, false, false, false),
('{tribute} descubre un área con frutas comestibles.', 'exploration', 'day', false, false, false, false);

-- Theft (Día)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} roba suministros de {tribute2} mientras duerme.', 'theft', 'day', false, false, true, false),
('{tribute1} encuentra y se apodera del refugio de {tribute2}.', 'theft', 'day', false, false, true, false),
('{tribute1} roba el arma de {tribute2} cuando no está mirando.', 'theft', 'day', false, false, true, false),
('{tribute1} toma los recursos de {tribute2} sin que se dé cuenta.', 'theft', 'day', false, false, true, false),
('{tribute1} roba comida del escondite de {tribute2}.', 'theft', 'day', false, false, true, false);

-- ============================================
-- EVENTOS DE NOCHE
-- ============================================

-- Kill (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{killer} embosca a {victim} mientras dormía. {victim} ha caído.', 'kill', 'night', true, true, false, false),
('{killer} encuentra a {victim} desprotegido/a y lo/la elimina.', 'kill', 'night', true, true, false, false),
('{killer} lanza un ataque sorpresa contra {victim}. El cañón suena.', 'kill', 'night', true, true, false, false),
('{killer} y {victim} luchan brutalmente. {killer} resulta victorioso/a.', 'kill', 'night', true, true, false, false),
('{killer} ataca a {victim} con su arma. {victim} no sobrevive.', 'kill', 'night', true, true, false, false),
('{killer} sorprende a {victim} en la oscuridad y lo/la elimina.', 'kill', 'night', true, true, false, false),
('{killer} y {victim} se enfrentan. Solo {killer} sobrevive.', 'kill', 'night', true, true, false, false),
('{killer} ejecuta un ataque letal contra {victim}. El cañón resuena.', 'kill', 'night', true, true, false, false),
('{killer} encuentra a {victim} herido/a y acaba con él/ella.', 'kill', 'night', true, true, false, false),
('{killer} y {victim} luchan cuerpo a cuerpo. {killer} gana.', 'kill', 'night', true, true, false, false);

-- Trap (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} activa una trampa del Capitolio pero logra escapar herido/a.', 'trap', 'night', false, false, false, false),
('{tribute} casi cae en un pozo de fuego del Capitolio.', 'trap', 'night', false, false, false, false),
('{tribute} es perseguido/a por mutos pero escapa.', 'trap', 'night', false, false, false, false),
('{tribute} activa una trampa de pinchos pero logra esquivarla a tiempo.', 'trap', 'night', false, false, false, false),
('{tribute} casi es atrapado/a por una red del Capitolio.', 'trap', 'night', false, false, false, false),
('{tribute} escapa de una nube de gas venenoso del Capitolio.', 'trap', 'night', false, false, false, false),
('{tribute} evita por poco una avalancha provocada por el Capitolio.', 'trap', 'night', false, false, false, false),
('{tribute} es atacado/a por mutos pero logra refugiarse.', 'trap', 'night', false, false, false, false),
('{tribute} activa una trampa explosiva pero sobrevive con heridas.', 'trap', 'night', false, false, false, false),
('{tribute} casi cae en un foso con pinchos del Capitolio.', 'trap', 'night', false, false, false, false);

-- Escape (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} escucha pasos y huye justo a tiempo.', 'escape', 'night', false, false, false, false),
('{tribute} evita un encuentro peligroso escondiéndose.', 'escape', 'night', false, false, false, false),
('{tribute} escapa de una persecución en la oscuridad.', 'escape', 'night', false, false, false, false),
('{tribute} detecta movimiento cercano y se retira silenciosamente.', 'escape', 'night', false, false, false, false),
('{tribute} escucha ruidos sospechosos y cambia de ubicación.', 'escape', 'night', false, false, false, false),
('{tribute} evita ser detectado/a por otros tributos.', 'escape', 'night', false, false, false, false),
('{tribute} escapa de un área peligrosa antes de ser descubierto/a.', 'escape', 'night', false, false, false, false),
('{tribute} se esconde en el último momento y evita un enfrentamiento.', 'escape', 'night', false, false, false, false),
('{tribute} huye cuando escucha voces cercanas.', 'escape', 'night', false, false, false, false),
('{tribute} se mueve sigilosamente para evitar ser rastreado/a.', 'escape', 'night', false, false, false, false);

-- Neutral (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} no puede dormir pensando en su familia.', 'neutral', 'night', false, false, false, false),
('{tribute} hace guardia toda la noche.', 'neutral', 'night', false, false, false, false),
('{tribute} escucha el himno de Panem y ve los caídos del día.', 'neutral', 'night', false, false, false, false),
('{tribute} se mantiene despierto/a por miedo.', 'neutral', 'night', false, false, false, false),
('{tribute} observa las estrellas recordando su distrito.', 'neutral', 'night', false, false, false, false),
('{tribute} reza en silencio por su supervivencia.', 'neutral', 'night', false, false, false, false),
('{tribute} escucha los sonidos de la noche con atención.', 'neutral', 'night', false, false, false, false),
('{tribute} se mantiene alerta esperando cualquier amenaza.', 'neutral', 'night', false, false, false, false),
('{tribute} piensa en estrategias para el día siguiente.', 'neutral', 'night', false, false, false, false),
('{tribute} intenta descansar pero está demasiado tenso/a.', 'neutral', 'night', false, false, false, false);

-- Betrayal (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} traiciona a {tribute2} y roba sus suministros.', 'betrayal', 'night', false, false, true, false),
('{tribute1} abandona a {tribute2} en un momento de peligro.', 'betrayal', 'night', false, false, true, false),
('{tribute1} rompe la alianza con {tribute2} sin avisar.', 'betrayal', 'night', false, false, true, false),
('{tribute1} engaña a {tribute2} y se queda con sus recursos.', 'betrayal', 'night', false, false, true, false),
('{tribute1} traiciona la confianza de {tribute2} y huye.', 'betrayal', 'night', false, false, true, false),
('{tribute1} deja a {tribute2} atrás cuando los mutos atacan.', 'betrayal', 'night', false, false, true, false),
('{tribute1} rompe el pacto con {tribute2} para salvarse.', 'betrayal', 'night', false, false, true, false);

-- Theft (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} roba suministros de {tribute2} mientras duerme.', 'theft', 'night', false, false, true, false),
('{tribute1} encuentra y se apodera del refugio de {tribute2}.', 'theft', 'night', false, false, true, false),
('{tribute1} roba el arma de {tribute2} cuando no está mirando.', 'theft', 'night', false, false, true, false),
('{tribute1} toma los recursos de {tribute2} sin que se dé cuenta.', 'theft', 'night', false, false, true, false),
('{tribute1} roba comida del escondite de {tribute2}.', 'theft', 'night', false, false, true, false),
('{tribute1} se apodera de los suministros de {tribute2} en la oscuridad.', 'theft', 'night', false, false, true, false),
('{tribute1} roba la medicina de {tribute2} mientras está distraído/a.', 'theft', 'night', false, false, true, false);

-- Alliance (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} forman una alianza nocturna.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} deciden vigilar turnos durante la noche.', 'alliance', 'night', false, false, true, false),
('{tribute1} comparte su refugio con {tribute2} por la noche.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} hacen guardia juntos para protegerse.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} acuerdan no atacarse durante la noche.', 'alliance', 'night', false, false, true, false);

-- Injury (Noche)
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} se lesiona al tropezar en la oscuridad.', 'injury', 'night', false, false, false, false),
('{tribute} se corta con una rama mientras huye.', 'injury', 'night', false, false, false, false),
('{tribute} se lastima al caer mientras intenta escapar.', 'injury', 'night', false, false, false, false),
('{tribute} se quema con una fuente de calor del Capitolio.', 'injury', 'night', false, false, false, false),
('{tribute} se lastima al chocar contra algo en la oscuridad.', 'injury', 'night', false, false, false, false);

-- Deadly Events (Noche) - High chance of instant death
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} es devorado por mutos hambrientos en la oscuridad.', 'kill', 'night', false, false, false, false),
('{tribute} activa una trampa explosiva del Capitolio durante la noche.', 'kill', 'night', false, false, false, false),
('{tribute} es alcanzado por un rayo láser del Capitolio mientras duerme.', 'kill', 'night', false, false, false, false),
('{tribute} bebe agua envenenada de una fuente del Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} es aplastado por rocas que caen de una trampa del Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} es atacado por un jaguar mutante y despedazado.', 'kill', 'night', false, false, false, false),
('{tribute} inhala gas venenoso liberado por el Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} cae en un foso de ácido del Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} es electrocutado por cables de alta tensión del Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} es atacado por un enjambre de avispas mutantes venenosas.', 'kill', 'night', false, false, false, false);
