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

-- ============================================
-- EVENTOS DE ALIANZA CON TOQUE ROMÁNTICO (DÍA)
-- ============================================

INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} comparten un momento de silencio mirando el atardecer, sus hombros rozándose.', 'alliance', 'day', false, false, true, false),
('{tribute1} venda una herida de {tribute2} con cuidado, sus dedos demorándose más de lo necesario.', 'alliance', 'day', false, false, true, false),
('{tribute1} confiesa a {tribute2} que en otra vida hubieran sido amigos... o algo más.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} se toman de la mano brevemente para darse ánimos antes de seguir explorando.', 'alliance', 'day', false, false, true, false),
('{tribute1} le regala a {tribute2} una flor silvestre que encontró, diciendo que le recuerda a su sonrisa.', 'alliance', 'day', false, false, true, false),
('{tribute1} protege a {tribute2} de un peligro menor y luego se miran fijamente, sin palabras.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} comparten una fruta, alimentándose mutuamente en un gesto íntimo.', 'alliance', 'day', false, false, true, false),
('{tribute1} le promete a {tribute2} que si uno sale vivo, llevará el recuerdo del otro siempre.', 'alliance', 'day', false, false, true, false),
('{tribute1} se sonroja cuando {tribute2} le dice que es la persona más valiente que ha conocido.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} se abrazan fuerte tras escapar de un peligro, sin querer soltarse.', 'alliance', 'day', false, false, true, false);

-- ============================================
-- EVENTOS DE ALIANZA CON TOQUE ROMÁNTICO (NOCHE)
-- ============================================

INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} se acurrucan juntos para compartir calor durante la fría noche.', 'alliance', 'night', false, false, true, false),
('{tribute1} susurra a {tribute2} que no quiere perderlo/a mientras velan el sueño del otro.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} hablan en voz baja de sus sueños antes de los Juegos, acercándose más.', 'alliance', 'night', false, false, true, false),
('{tribute1} acaricia el cabello de {tribute2} para calmarlo/a tras una pesadilla.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} se miran a los ojos bajo la luz de la luna, como si el mundo no existiera.', 'alliance', 'night', false, false, true, false),
('{tribute1} le dice a {tribute2} en un susurro: "Si morimos, al menos no fue solos".', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} entrelazan sus dedos mientras hacen guardia, un gesto silencioso de confianza.', 'alliance', 'night', false, false, true, false),
('{tribute1} besa suavemente la frente de {tribute2} creyendo que duerme, pero {tribute2} lo/a siente.', 'alliance', 'night', false, false, true, false),
('{tribute1} y {tribute2} comparten un beso impulsivo bajo las estrellas, sabiendo que puede ser el último.', 'alliance', 'night', false, false, true, false),
('{tribute1} confiesa a {tribute2} que siente algo que nunca esperó en la arena.', 'alliance', 'night', false, false, true, false);

-- ============================================
-- EVENTOS DE DÍA - Nuevos
-- ============================================

-- Neutral (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} recolecta musgo para usar como venda improvisada.', 'neutral', 'day', false, false, false, false),
('{tribute} prueba diferentes plantas para identificar cuáles son comestibles.', 'neutral', 'day', false, false, false, false),
('{tribute} observa aves migratorias para predecir cambios de clima.', 'neutral', 'day', false, false, false, false),
('{tribute} talla una lanza improvisada con una rama afilada.', 'neutral', 'day', false, false, false, false),
('{tribute} encuentra un nido con huevos de ave comestibles.', 'neutral', 'day', false, false, false, false),
('{tribute} se frota barro en la piel para camuflarse mejor.', 'neutral', 'day', false, false, false, false),
('{tribute} detecta humo lejano y decide si investigarlo o huir.', 'neutral', 'day', false, false, false, false);

-- Sponsor (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} recibe un sleeping bag impermeable de patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe insecticida potente contra mutos insectoides.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe una linterna solar de sus patrocinadores.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe antídotos contra venenos comunes del Capitolio.', 'sponsor', 'day', false, false, false, false),
('{tribute} recibe un silbato ultrasónico para repeler mutos.', 'sponsor', 'day', false, false, false, false);

-- Injury (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} sufre una insolación tras horas sin sombra.', 'injury', 'day', false, false, false, false),
('{tribute} es atacado por hormigas carnívoras mutantes y sufre picaduras graves.', 'injury', 'day', false, false, false, false),
('{tribute} se intoxica levemente al inhalar esporas tóxicas de un hongo.', 'injury', 'day', false, false, false, false),
('{tribute} se disloca un hombro al trepar una pared rocosa.', 'injury', 'day', false, false, false, false);

-- Deadly Events (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} es alcanzado por un enjambre de avispas mutantes rastreadoras. El cañón suena.', 'kill', 'day', false, false, false, false),
('{tribute} cae en arenas movedizas creadas por el Capitolio y desaparece.', 'kill', 'day', false, false, false, false),
('{tribute} es quemado vivo por una lluvia de fuego líquido lanzada desde el cielo.', 'kill', 'day', false, false, false, false),
('{tribute} despierta una manada de ciervos mutantes con cuernos envenenados.', 'kill', 'day', false, false, false, false),
('{tribute} es atrapado por raíces vivientes mutantes que lo estrangulan.', 'kill', 'day', false, false, false, false);

-- Alliance (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} enseña a {tribute2} técnicas de sigilo del Distrito 6.', 'alliance', 'day', false, false, true, false),
('{tribute1} y {tribute2} planean una emboscada conjunta contra otro tributo.', 'alliance', 'day', false, false, true, false),
('{tribute1} salva a {tribute2} de una trampa natural y ganan confianza mutua.', 'alliance', 'day', false, false, true, false);

-- Theft (Día) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} distrae a {tribute2} con ruido falso y le roba su mochila.', 'theft', 'day', false, false, true, false),
('{tribute1} intercambia falsamente un objeto inútil por algo valioso de {tribute2}.', 'theft', 'day', false, false, true, false);

-- ============================================
-- EVENTOS DE NOCHE - Nuevos
-- ============================================

-- Kill (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{killer} degüella silenciosamente a {victim} mientras ronca.', 'kill', 'night', true, true, false, false),
('{killer} envenena la cantimplora de {victim} durante la noche.', 'kill', 'night', true, true, false, false),
('{killer} asfixia a {victim} con su propia manta mientras duerme.', 'kill', 'night', true, true, false, false);

-- Trap (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} activa sensores de movimiento y casi es alcanzado por flechas automáticas.', 'trap', 'night', false, false, false, false),
('{tribute} entra en una zona de infrasonidos que le provoca alucinaciones terroríficas.', 'trap', 'night', false, false, false, false),
('{tribute} es perseguido por drones luminosos que revelan su posición.', 'trap', 'night', false, false, false, false);

-- Neutral (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} tiene pesadillas recurrentes con los tributos que ya murieron.', 'neutral', 'night', false, false, false, false),
('{tribute} ve fuegos artificiales lejanos anunciando patrocinios masivos.', 'neutral', 'night', false, false, false, false),
('{tribute} llora en silencio recordando su hogar mientras ve el cielo.', 'neutral', 'night', false, false, false, false);

-- Betrayal (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} finge dormir y apuñala a {tribute2} por la espalda.', 'betrayal', 'night', false, false, true, false),
('{tribute1} entrega la ubicación de {tribute2} a otro tributo a cambio de protección.', 'betrayal', 'night', false, false, true, false),
('{tribute1} sabotea el refugio de {tribute2} para que colapse mientras duerme.', 'betrayal', 'night', false, false, true, false);

-- Alliance (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute1} y {tribute2} comparten historias de sus distritos para mantenerse despiertos.', 'alliance', 'night', false, false, true, false),
('{tribute1} cura las heridas de {tribute2} durante la noche.', 'alliance', 'night', false, false, true, false);

-- Injury (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} sufre hipotermia al bajar drásticamente la temperatura por la noche.', 'injury', 'night', false, false, false, false),
('{tribute} es mordido por un roedor mutante mientras duerme.', 'injury', 'night', false, false, false, false);

-- Deadly Events (Noche) - adicionales
INSERT INTO event_templates (template, type, phase, requires_killer, requires_victim, requires_two_tributes, is_custom) VALUES
('{tribute} es congelado vivo por una tormenta polar repentina del Capitolio.', 'kill', 'night', false, false, false, false),
('{tribute} es atacado por un enjambre de polillas luminosas venenosas.', 'kill', 'night', false, false, false, false),
('{tribute} cae en un lago congelado que se rompe bajo su peso.', 'kill', 'night', false, false, false, false),
('{tribute} es alcanzado por niebla tóxica que se arrastra por el suelo.', 'kill', 'night', false, false, false, false);