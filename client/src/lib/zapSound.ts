/**
 * Play the zap/electric sound from audio file
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  // Resume audio context if suspended (required by browser autoplay policies)
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(err => console.log('Audio context resume failed:', err));
  }
  return audioContext;
}

export async function playZapSound() {
  try {
    const ctx = getAudioContext();
    
    // Fetch and decode the audio file
    const response = await fetch('/zap-sound.wav');
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    
    // Create source and play
    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);
    source.start(0);
    
    console.log('Zap sound played successfully');
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}
