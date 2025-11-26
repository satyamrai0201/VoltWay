/**
 * Two live wires touching - electric short circuit sound
 * 2 seconds with smooth fade in/out, soft and not harsh
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
    const duration = 2;
    const fadeInDuration = 0.15;
    const fadeOutStart = duration - 0.25;

    // Sharp electrical crackle - primary short circuit sound
    const crackleOsc = ctx.createOscillator();
    const crackleGain = ctx.createGain();
    const crackleFilter = ctx.createBiquadFilter();

    crackleOsc.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(ctx.destination);

    crackleOsc.type = 'square';
    crackleOsc.frequency.setValueAtTime(2200, now);
    crackleOsc.frequency.exponentialRampToValueAtTime(4200, now + duration * 0.5);
    crackleOsc.frequency.linearRampToValueAtTime(3000, now + duration);

    crackleFilter.type = 'highpass';
    crackleFilter.frequency.setValueAtTime(1500, now);
    crackleFilter.Q.setValueAtTime(5, now);

    // Smooth fade in/out
    crackleGain.gain.setValueAtTime(0, now);
    crackleGain.gain.linearRampToValueAtTime(0.12, now + fadeInDuration);
    crackleGain.gain.linearRampToValueAtTime(0.15, now + fadeOutStart);
    crackleGain.gain.linearRampToValueAtTime(0, now + duration);

    crackleOsc.start(now);
    crackleOsc.stop(now + duration);

    // Lower electrical hum - wire contact tone
    const hummOsc = ctx.createOscillator();
    const hummGain = ctx.createGain();
    const hummFilter = ctx.createBiquadFilter();

    hummOsc.connect(hummFilter);
    hummFilter.connect(hummGain);
    hummGain.connect(ctx.destination);

    hummOsc.type = 'sine';
    hummOsc.frequency.setValueAtTime(180, now);
    hummOsc.frequency.linearRampToValueAtTime(250, now + duration * 0.6);
    hummOsc.frequency.linearRampToValueAtTime(200, now + duration);

    hummFilter.type = 'lowpass';
    hummFilter.frequency.setValueAtTime(600, now);
    hummFilter.Q.setValueAtTime(2, now);

    // Fade in/out
    hummGain.gain.setValueAtTime(0, now);
    hummGain.gain.linearRampToValueAtTime(0.08, now + fadeInDuration);
    hummGain.gain.linearRampToValueAtTime(0.1, now + fadeOutStart);
    hummGain.gain.linearRampToValueAtTime(0, now + duration);

    hummOsc.start(now);
    hummOsc.stop(now + duration);

    // Mid-range buzz - arcing electricity
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(ctx.destination);

    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(1400, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(2800, now + duration * 0.7);

    buzzFilter.type = 'highpass';
    buzzFilter.frequency.setValueAtTime(1200, now);
    buzzFilter.frequency.exponentialRampToValueAtTime(2200, now + duration);
    buzzFilter.Q.setValueAtTime(4, now);

    // Fade in/out
    buzzGain.gain.setValueAtTime(0, now);
    buzzGain.gain.linearRampToValueAtTime(0.06, now + fadeInDuration);
    buzzGain.gain.linearRampToValueAtTime(0.08, now + fadeOutStart);
    buzzGain.gain.linearRampToValueAtTime(0, now + duration);

    buzzOsc.start(now);
    buzzOsc.stop(now + duration);

    // Short circuit crackling noise
    createShortCircuitNoise(ctx, now, duration, fadeInDuration, fadeOutStart);

    console.log('Short circuit sound - 2 seconds with fade');
  } catch (error) {
    console.log('Audio error:', error);
  }
}

function createShortCircuitNoise(
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

    // Create bursting crackle pattern for short circuit effect
    let pos = 0;
    while (pos < bufferSize) {
      const burstLength = Math.random() * ctx.sampleRate * 0.03 + ctx.sampleRate * 0.015;
      const silenceLength = Math.random() * ctx.sampleRate * 0.05 + ctx.sampleRate * 0.01;
      const progress = pos / bufferSize;
      const intensity = Math.pow(progress, 0.4);

      // Silence
      for (let i = 0; i < silenceLength && pos < bufferSize; i++) {
        noiseData[pos++] = 0;
      }
      // Noise burst
      for (let i = 0; i < burstLength && pos < bufferSize; i++) {
        noiseData[pos++] = (Math.random() * 2 - 1) * intensity * 0.35;
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
    noiseFilter.frequency.setValueAtTime(2500, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(5000, startTime + duration * 0.8);
    noiseFilter.Q.setValueAtTime(8, startTime);

    // Fade in/out
    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.09, startTime + fadeInDuration);
    noiseGain.gain.linearRampToValueAtTime(0.12, startTime + fadeOutStart);
    noiseGain.gain.linearRampToValueAtTime(0, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Noise generation error:', error);
  }
}
