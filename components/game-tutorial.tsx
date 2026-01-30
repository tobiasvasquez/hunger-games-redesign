"use client"

import React, { useEffect, useRef } from "react"
import { driver } from "driver.js"
import "driver.js/dist/driver.css"

interface GameTutorialProps {
  onClose: () => void
}

export function GameTutorial({ onClose }: GameTutorialProps) {
  const driverRef = useRef<any>(null)

  useEffect(() => {
    // Initialize Driver.js
    driverRef.current = driver({
      showProgress: true,
      steps: [
        {
          element: '[data-tutorial="header-title"]',
          popover: {
            title: '¡Bienvenido a Los Juegos del Hambre!',
            description: 'Este simulador te permite experimentar los Juegos del Hambre con personajes personalizados. Vamos a hacer un tour rápido por la interfaz.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="character-button"]',
          popover: {
            title: 'Paso 1: Agregar Personajes',
            description: 'Los tributos son el corazón del juego. Cada distrito necesita 2 tributos. Haz clic aquí para abrir el gestor de personajes.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="tribute-button"]',
          popover: {
            title: 'Paso 2: Asignar Tributos',
            description: 'Una vez que tengas personajes, debes asignarlos a los 12 distritos. Cada distrito tiene 2 slots para tributos.',
            side: 'bottom',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="game-controls"]',
          popover: {
            title: 'Paso 3: Controles del Juego',
            description: 'Una vez asignados los tributos, haz clic en "Comenzar Juegos" para iniciar. Luego puedes controlar el ritmo con "Siguiente Fase" o "Simular Todo".',
            side: 'top',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="districts-grid"]',
          popover: {
            title: 'Paso 4: Los Distritos',
            description: 'Aquí puedes ver todos los distritos con sus tributos asignados. Cada distrito tiene un color único y muestra la salud de sus tributos.',
            side: 'left',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="event-feed"]',
          popover: {
            title: 'Paso 5: Eventos del Juego',
            description: 'Aquí se muestran todos los eventos que ocurren durante el juego. Cada turno trae drama aleatorio: muertes, alianzas, heridas, etc.',
            side: 'left',
            align: 'center'
          }
        },
        {
          element: '[data-tutorial="fallen-tributes"]',
          popover: {
            title: 'Paso 6: Tributos Caídos',
            description: 'Aquí puedes ver todos los tributos que han caído durante los juegos. El juego continúa hasta que solo queda un vencedor.',
            side: 'top',
            align: 'center'
          }
        }
      ],
      onDestroyStarted: () => {
        if (driverRef.current) {
          driverRef.current.destroy()
        }
      },
      onDestroyed: () => {
        onClose()
      },
      allowClose: true,
      overlayColor: 'rgba(0, 0, 0, 0.5)',
      stagePadding: 10,
      stageRadius: 8,
      nextBtnText: 'Siguiente',
      prevBtnText: 'Anterior',
      doneBtnText: '¡Comenzar!'
    })

    // Start the tour
    driverRef.current.drive()

    // Cleanup on unmount
    return () => {
      if (driverRef.current) {
        driverRef.current.destroy()
      }
    }
  }, [onClose])

  return null // Driver.js handles the UI
}
