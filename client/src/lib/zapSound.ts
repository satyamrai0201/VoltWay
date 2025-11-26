/**
 * Generate an accurate Iron Man arc repulsor sound from Avengers
 * 3 seconds with fade in and fade out
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
    const duration = 3;
    const fadeInDuration = 0.3;
    const fadeOutStart = duration - 0.4;

    // Core resonant tone - the arc reactor hum
    const coreOsc = ctx.createOscillator();
    const coreGain = ctx.createGain();
    const coreFilter = ctx.createBiquadFilter();

    coreOsc.connect(coreFilter);
    coreFilter.connect(coreGain);
    coreGain.connect(ctx.destination);

    coreOsc.type = 'sine';
    coreOsc.frequency.setValueAtTime(200, now);
    coreOsc.frequency.linearRampToValueAtTime(280, now + duration);

    coreFilter.type = 'lowpass';
    coreFilter.frequency.setValueAtTime(400, now);
    coreFilter.Q.setValueAtTime(2, now);

    // Fade in, sustain, fade out
    coreGain.gain.setValueAtTime(0, now);
    coreGain.gain.linearRampToValueAtTime(0.2, now + fadeInDuration);
    coreGain.gain.linearRampToValueAtTime(0.25, now + fadeOutStart);
    coreGain.gain.linearRampToValueAtTime(0, now + duration);

    coreOsc.start(now);
    coreOsc.stop(now + duration);

    // Primary rising whine - main arc charging sound
    const whineOsc = ctx.createOscillator();
    const whineGain = ctx.createGain();
    const whineFilter = ctx.createBiquadFilter();

    whineOsc.connect(whineFilter);
    whineFilter.connect(whineGain);
    whineGain.connect(ctx.destination);

    whineOsc.type = 'sine';
    whineOsc.frequency.setValueAtTime(900, now);
    whineOsc.frequency.exponentialRampToValueAtTime(2200, now + duration * 0.75);
    whineOsc.frequency.linearRampToValueAtTime(1900, now + duration);

    whineFilter.type = 'highpass';
    whineFilter.frequency.setValueAtTime(500, now);
    whineFilter.Q.setValueAtTime(3, now);

    // Fade in, sustain, fade out
    whineGain.gain.setValueAtTime(0, now);
    whineGain.gain.linearRampToValueAtTime(0.25, now + fadeInDuration);
    whineGain.gain.linearRampToValueAtTime(0.35, now + fadeOutStart);
    whineGain.gain.linearRampToValueAtTime(0, now + duration);

    whineOsc.start(now);
    whineOsc.stop(now + duration);

    // Upper harmonic - adds brightness and energy
    const harmOsc = ctx.createOscillator();
    const harmGain = ctx.createGain();

    harmOsc.connect(harmGain);
    harmGain.connect(ctx.destination);

    harmOsc.type = 'triangle';
    harmOsc.frequency.setValueAtTime(1800, now);
    harmOsc.frequency.exponentialRampToValueAtTime(4000, now + duration * 0.8);
    harmOsc.frequency.linearRampToValueAtTime(3200, now + duration);

    // Fade in, sustain, fade out
    harmGain.gain.setValueAtTime(0, now);
    harmGain.gain.linearRampToValueAtTime(0.15, now + fadeInDuration);
    harmGain.gain.linearRampToValueAtTime(0.2, now + fadeOutStart);
    harmGain.gain.linearRampToValueAtTime(0, now + duration);

    harmOsc.start(now);
    harmOsc.stop(now + duration);

    // Sawtooth buzz for electrical character
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(ctx.destination);

    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(2800, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(5600, now + duration * 0.85);

    buzzFilter.type = 'highpass';
    buzzFilter.frequency.setValueAtTime(2000, now);
    buzzFilter.frequency.exponentialRampToValueAtTime(4000, now + duration);
    buzzFilter.Q.setValueAtTime(6, now);

    // Fade in, sustain, fade out
    buzzGain.gain.setValueAtTime(0, now);
    buzzGain.gain.linearRampToValueAtTime(0.12, now + fadeInDuration);
    buzzGain.gain.linearRampToValueAtTime(0.16, now + fadeOutStart);
    buzzGain.gain.linearRampToValueAtTime(0, now + duration);

    buzzOsc.start(now);
    buzzOsc.stop(now + duration);

    // Tremolo LFO for pulsing energy effect
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();

    lfo.frequency.setValueAtTime(4.5, now);
    lfoGain.gain.setValueAtTime(80, now);
    lfo.connect(lfoGain);
    lfoGain.connect(whineOsc.frequency);

    lfo.start(now);
    lfo.stop(now + duration);

    // Arc crackling noise - electrical texture
    createArcNoise(ctx, now, duration, fadeInDuration, fadeOutStart);

    console.log('Arc repulsor sound playing - 3 seconds with fade');
  } catch (error) {
    console.log('Audio error:', error);
  }
}

function createArcNoise(
  ctx: AudioContext,
  startTime: number,
  duration: number,
  fadeInDuration: number,
  fadeOutStart: number
) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Create bursting electrical noise
    let pos = 0;
    while (pos < bufferSize) {
      const burstLength = Math.random() * ctx.sampleRate * 0.04 + ctx.sampleRate * 0.02;
      const silenceLength = Math.random() * ctx.sampleRate * 0.06 + ctx.sampleRate * 0.015;
      const progress = pos / bufferSize;
      const intensity = Math.pow(progress, 0.3); // Builds toward end

      // Silence
      for (let i = 0; i < silenceLength && pos < bufferSize; i++) {
        noiseData[pos++] = 0;
      }
      // Noise burst
      for (let i = 0; i < burstLength && pos < bufferSize; i++) {
        noiseData[pos++] = (Math.random() * 2 - 1) * intensity * 0.5;
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(6000, startTime + duration * 0.85);
    noiseFilter.Q.setValueAtTime(10, startTime);

    // Fade in, sustain, fade out
    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.1, startTime + fadeInDuration);
    noiseGain.gain.linearRampToValueAtTime(0.14, startTime + fadeOutStart);
    noiseGain.gain.linearRampToValueAtTime(0, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Noise generation error:', error);
  }
}
