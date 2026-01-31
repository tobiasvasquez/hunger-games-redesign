/**
 * Sound effects for game events
 */

// Play a weapon/kill sound effect
export function playKillSound() {
  // Create audio context for sound generation
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  // Create a sharp, weapon-like sound (like a sword clash or gunshot)
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  // Weapon sound: sharp attack with quick decay
  oscillator.type = 'sawtooth'
  oscillator.frequency.setValueAtTime(200, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1)
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.15)
}

// Play a cannon sound (for tribute death announcement)
export function playCannonSound() {
  try {
    const audio = new Audio('/death_sound.mp3')
    audio.volume = 0.4
    audio.play().catch(error => {
      console.warn('Failed to play death sound:', error)
    })
  } catch (error) {
    console.warn('Audio playback not supported:', error)
  }
}
