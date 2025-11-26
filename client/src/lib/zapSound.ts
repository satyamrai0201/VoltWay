import zapAudioUrl from "@assets/mixkit-electronics-power-up-2602_1764186237842.wav";

let audioContext: AudioContext | null = null;
let audioBuffer: AudioBuffer | null = null;

async function getAudioContext(): Promise<AudioContext> {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  if (audioContext.state === 'suspended') {
    try {
      await audioContext.resume();
    } catch (e) {
      console.error('Failed to resume audio context:', e);
    }
  }
  
  return audioContext;
}

export async function playZapSound() {
  try {
    const ctx = await getAudioContext();
    
    if (!audioBuffer) {
      const response = await fetch(zapAudioUrl);
      const arrayBuffer = await response.arrayBuffer();
      audioBuffer = await ctx.decodeAudioData(arrayBuffer);
      console.log('Audio loaded successfully');
    }

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;

    const compressor = ctx.createDynamicsCompressor();
    compressor.threshold.value = -24;
    compressor.knee.value = 30;
    compressor.ratio.value = 12;
    compressor.attack.value = 0.003;
    compressor.release.value = 0.25;

    const gain = ctx.createGain();
    gain.gain.value = 1.0;

    source.connect(compressor);
    compressor.connect(gain);
    gain.connect(ctx.destination);

    source.start(0);
    console.log('Zap sound playing');
  } catch (error) {
    console.error('Zap sound error:', error);
  }
}
