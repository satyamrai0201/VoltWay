/**
 * Generate a zap/electric sound using Web Audio API
 * Creates a realistic electric discharge sound effect
 */

export function playZapSound() {
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Create oscillator for the main zap sound
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();
    
    // Connect nodes
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);
    
    // Configure oscillator
    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(150, audioContext.currentTime);
    osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
    
    // Configure filter
    filter.type = "highpass";
    filter.frequency.setValueAtTime(200, audioContext.currentTime);
    filter.frequency.exponentialRampToValueAtTime(2000, audioContext.currentTime + 0.05);
    
    // Configure gain envelope
    gain.gain.setValueAtTime(0.3, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
    
    // Add noise for crackle effect
    const noiseBuffer = audioContext.createBuffer(1, audioContext.sampleRate * 0.1, audioContext.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }
    
    const noiseSource = audioContext.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    
    const noiseGain = audioContext.createGain();
    noiseSource.connect(noiseGain);
    noiseGain.connect(audioContext.destination);
    
    noiseGain.gain.setValueAtTime(0.15, audioContext.currentTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
    
    // Play sounds
    osc.start(audioContext.currentTime);
    osc.stop(audioContext.currentTime + 0.15);
    
    noiseSource.start(audioContext.currentTime);
    noiseSource.stop(audioContext.currentTime + 0.1);
  } catch (error) {
    console.log("Audio context not available");
  }
}
