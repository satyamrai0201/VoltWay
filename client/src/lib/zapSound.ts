/**
 * Generate a zap/electric sound using Web Audio API
 * Creates a realistic electric discharge sound effect
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

export function playZapSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Main zap sound - frequency sweep
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    const gain2 = ctx.createGain();
    const masterGain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    // Connect audio graph
    osc1.connect(gain1);
    osc2.connect(gain2);
    gain1.connect(filter);
    gain2.connect(filter);
    filter.connect(masterGain);
    masterGain.connect(ctx.destination);

    // Primary oscillator - main zap tone
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(200, now);
    osc1.frequency.exponentialRampToValueAtTime(80, now + 0.12);
    gain1.gain.setValueAtTime(0.4, now);
    gain1.gain.exponentialRampToValueAtTime(0.05, now + 0.12);

    // Secondary oscillator - harmonic
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(400, now);
    osc2.frequency.exponentialRampToValueAtTime(150, now + 0.1);
    gain2.gain.setValueAtTime(0.2, now);
    gain2.gain.exponentialRampToValueAtTime(0.02, now + 0.1);

    // Filter sweep for crackle effect
    filter.type = 'highpass';
    filter.frequency.setValueAtTime(100, now);
    filter.frequency.linearRampToValueAtTime(3000, now + 0.08);
    filter.Q.setValueAtTime(5, now);

    // Master volume
    masterGain.gain.setValueAtTime(0.4, now);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    // Start oscillators
    osc1.start(now);
    osc1.stop(now + 0.12);
    osc2.start(now);
    osc2.stop(now + 0.1);

    // Add noise/crackle for electric effect
    createCrackleNoise(ctx, now);

    console.log('Zap sound played successfully');
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

function createCrackleNoise(ctx: AudioContext, startTime: number) {
  try {
    // Create white noise buffer
    const bufferSize = ctx.sampleRate * 0.15;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Fill with random noise
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    // Create noise source
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Create noise gain envelope
    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    // Connect noise
    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Configure filter for crackle
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(4000, startTime + 0.1);
    noiseFilter.Q.setValueAtTime(3, startTime);

    // Noise envelope
    noiseGain.gain.setValueAtTime(0.25, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.02, startTime + 0.1);

    // Play noise
    noiseSource.start(startTime);
    noiseSource.stop(startTime + 0.12);
  } catch (error) {
    console.log('Crackle noise failed:', error);
  }
}
