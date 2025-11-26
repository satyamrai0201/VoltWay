/**
 * Generate an Iron Man arc repulsor sound using Web Audio API
 * Long, powerful arc charging sound (5 seconds)
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
    const duration = 5; // 5 seconds

    // Deep bass hum - the core of arc reactor
    const bassOsc = ctx.createOscillator();
    const bassGain = ctx.createGain();
    const bassFilter = ctx.createBiquadFilter();

    bassOsc.connect(bassFilter);
    bassFilter.connect(bassGain);
    bassGain.connect(ctx.destination);

    bassOsc.type = 'sine';
    bassOsc.frequency.setValueAtTime(80, now);
    bassOsc.frequency.linearRampToValueAtTime(120, now + duration);

    bassGain.gain.setValueAtTime(0, now);
    bassGain.gain.linearRampToValueAtTime(0.35, now + duration * 0.2);
    bassGain.gain.linearRampToValueAtTime(0.45, now + duration);

    bassFilter.type = 'lowpass';
    bassFilter.frequency.setValueAtTime(200, now);
    bassFilter.Q.setValueAtTime(3, now);

    bassOsc.start(now);
    bassOsc.stop(now + duration);

    // Main high-pitched arc charge - rises throughout
    const arcOsc = ctx.createOscillator();
    const arcGain = ctx.createGain();
    const arcFilter = ctx.createBiquadFilter();

    arcOsc.connect(arcFilter);
    arcFilter.connect(arcGain);
    arcGain.connect(ctx.destination);

    arcOsc.type = 'sine';
    arcOsc.frequency.setValueAtTime(800, now);
    arcOsc.frequency.exponentialRampToValueAtTime(2400, now + duration * 0.8);
    arcOsc.frequency.linearRampToValueAtTime(2000, now + duration);

    arcGain.gain.setValueAtTime(0.1, now);
    arcGain.gain.linearRampToValueAtTime(0.4, now + duration * 0.3);
    arcGain.gain.linearRampToValueAtTime(0.5, now + duration);

    arcFilter.type = 'highpass';
    arcFilter.frequency.setValueAtTime(600, now);
    arcFilter.Q.setValueAtTime(4, now);

    arcOsc.start(now);
    arcOsc.stop(now + duration);

    // Harmonic overtone - adds sci-fi quality
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();

    harmOsc.connect(harmGain);
    harmGain.connect(ctx.destination);

    harmOsc.type = 'triangle';
    harmOsc.frequency.setValueAtTime(1600, now);
    harmOsc.frequency.exponentialRampToValueAtTime(4800, now + duration * 0.7);
    harmOsc.frequency.linearRampToValueAtTime(3200, now + duration);

    harmGain.gain.setValueAtTime(0.08, now);
    harmGain.gain.linearRampToValueAtTime(0.25, now + duration * 0.4);
    harmGain.gain.linearRampToValueAtTime(0.35, now + duration);

    harmOsc.start(now);
    harmOsc.stop(now + duration);

    // Electronic buzz overlay - pulsing energy
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();
    const buzzLFO = ctx.createOscillator();
    const buzzLFOGain = ctx.createGain();

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(ctx.destination);

    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(3200, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(6400, now + duration * 0.9);

    buzzFilter.type = 'highpass';
    buzzFilter.frequency.setValueAtTime(2000, now);
    buzzFilter.frequency.exponentialRampToValueAtTime(5000, now + duration);
    buzzFilter.Q.setValueAtTime(8, now);

    // LFO modulation for pulsing effect
    buzzLFO.frequency.setValueAtTime(4, now);
    buzzLFOGain.gain.setValueAtTime(0.08, now);
    buzzLFO.connect(buzzLFOGain);
    buzzLFOGain.connect(buzzGain.gain);

    buzzGain.gain.setValueAtTime(0.05, now);
    buzzGain.gain.linearRampToValueAtTime(0.25, now + duration * 0.5);
    buzzGain.gain.linearRampToValueAtTime(0.3, now + duration);

    buzzOsc.start(now);
    buzzOsc.stop(now + duration);
    buzzLFO.start(now);
    buzzLFO.stop(now + duration);

    // Electrical crackle noise - arc intensity
    createArcNoise(ctx, now, duration);

    console.log('Arc repulsor sound playing for 5 seconds');
  } catch (error) {
    console.log('Audio error:', error);
  }
}

function createArcNoise(ctx: AudioContext, startTime: number, duration: number) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Create filtered noise that builds in intensity
    for (let i = 0; i < bufferSize; i++) {
      const progress = i / bufferSize;
      // More intense noise as time goes on
      const intensity = Math.pow(progress, 0.5);
      noiseData[i] = (Math.random() * 2 - 1) * intensity * 0.8;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // High-pass filter for crisp arc sound
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(7000, startTime + duration * 0.8);
    noiseFilter.Q.setValueAtTime(12, startTime);

    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.15, startTime + duration * 0.2);
    noiseGain.gain.linearRampToValueAtTime(0.25, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Noise generation error:', error);
  }
}
