/**
 * Generate an electronics power-up sound using Web Audio API
 * Mimics the mixkit power-up sound with rising frequencies and digital character
 */

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioContext.state === 'suspended') {
    audioContext.resume().catch(err => console.log('Audio context resume failed:', err));
  }
  return audioContext;
}

export function playZapSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;
    const duration = 0.6;

    // Main rising tone - primary frequency sweep (power-up effect)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(400, now);
    osc1.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.6);
    osc1.frequency.linearRampToValueAtTime(900, now + duration);

    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.1, now + duration);

    // Secondary harmonic tone - adds richness
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(800, now);
    osc2.frequency.exponentialRampToValueAtTime(1800, now + duration * 0.5);
    osc2.frequency.linearRampToValueAtTime(1400, now + duration);

    gain2.gain.setValueAtTime(0.25, now);
    gain2.gain.exponentialRampToValueAtTime(0.05, now + duration);

    // Third tone for digital character
    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.connect(gain3);
    gain3.connect(ctx.destination);

    osc3.type = 'square';
    osc3.frequency.setValueAtTime(1200, now);
    osc3.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.7);
    osc3.frequency.linearRampToValueAtTime(1600, now + duration);

    gain3.gain.setValueAtTime(0.15, now);
    gain3.gain.exponentialRampToValueAtTime(0.02, now + duration);

    // Quick pulse effect at start
    const pulseGain = ctx.createGain();
    osc1.connect(pulseGain);
    pulseGain.connect(ctx.destination);
    pulseGain.gain.setValueAtTime(0, now);
    pulseGain.gain.linearRampToValueAtTime(0.2, now + 0.05);
    pulseGain.gain.exponentialRampToValueAtTime(0.02, now + duration);

    // Start and stop oscillators
    osc1.start(now);
    osc1.stop(now + duration);
    osc2.start(now);
    osc2.stop(now + duration);
    osc3.start(now + 0.05);
    osc3.stop(now + duration);

    // Add subtle noise for electronic crackling
    createElectronicNoise(ctx, now, duration);

    console.log('Zap sound played successfully');
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

function createElectronicNoise(ctx: AudioContext, startTime: number, duration: number) {
  try {
    // Create noise buffer for electronic crackle
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Fill with filtered random noise
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // High-pass filter for electronic character
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(2000, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(4000, startTime + duration * 0.6);
    noiseFilter.Q.setValueAtTime(8, startTime);

    // Noise envelope
    noiseGain.gain.setValueAtTime(0.15, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, startTime + duration * 0.7);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Noise generation failed:', error);
  }
}
