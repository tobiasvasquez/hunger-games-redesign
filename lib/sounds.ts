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
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
  
  // Create a deep, cannon-like sound
  const oscillator = audioContext.createOscillator()
  const gainNode = audioContext.createGain()
  
  oscillator.connect(gainNode)
  gainNode.connect(audioContext.destination)
  
  // Cannon sound: deep boom
  oscillator.type = 'sine'
  oscillator.frequency.setValueAtTime(80, audioContext.currentTime)
  oscillator.frequency.exponentialRampToValueAtTime(40, audioContext.currentTime + 0.3)
  
  gainNode.gain.setValueAtTime(0.4, audioContext.currentTime)
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5)
  
  oscillator.start(audioContext.currentTime)
  oscillator.stop(audioContext.currentTime + 0.5)
}
