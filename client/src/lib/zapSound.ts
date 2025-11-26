/**
 * Play zap/shock sound using Web Audio API
 * Handles browser autoplay policies
 */

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;
let isLoaded = false;

async function initAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // Resume if suspended (required by browser autoplay policy)
  if (audioContext.state === 'suspended') {
    await audioContext.resume();
  }
  
  return audioContext;
}

async function loadAudioFile(): Promise<AudioBuffer> {
  if (isLoaded && audioBuffer) {
    return audioBuffer;
  }

  try {
    const ctx = await initAudioContext();
    
    // Fetch the audio file
    const response = await fetch('/zap-sound.wav');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    audioBuffer = await ctx.decodeAudioData(arrayBuffer);
    isLoaded = true;
    console.log('Audio file loaded and decoded successfully');
    return audioBuffer;
  } catch (error) {
    console.error('Failed to load audio file:', error);
    throw error;
  }
}

export async function playZapSound() {
  try {
    const ctx = await initAudioContext();
    const buffer = await loadAudioFile();

    // Create source and gain nodes
    const source = ctx.createBufferSource();
    const gainNode = ctx.createGain();

    source.buffer = buffer;

    // Set volume to maximum (1.0 is 100%)
    gainNode.gain.setValueAtTime(1.0, ctx.currentTime);

    // Connect nodes: source -> gain -> destination (speakers)
    source.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Play the sound
    source.start(ctx.currentTime);
    console.log('Zap sound playing at max volume');
  } catch (error) {
    console.error('Audio playback error:', error);
  }
}
