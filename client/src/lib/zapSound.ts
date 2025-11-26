/**
 * Generate a realistic electric charge sound using Web Audio API
 * Mimics actual electrical discharge with crackling, buzzing, and arcing
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
    const duration = 0.5;

    // Sharp high-frequency buzz - main electric sound
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(ctx.destination);

    buzzOsc.type = 'sawtooth'; // Sawtooth has more harmonics for electric buzz
    buzzOsc.frequency.setValueAtTime(150, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(50, now + duration * 0.8);

    buzzGain.gain.setValueAtTime(0.4, now);
    buzzGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    buzzFilter.type = 'highpass';
    buzzFilter.frequency.setValueAtTime(1500, now);
    buzzFilter.Q.setValueAtTime(2, now);

    buzzOsc.start(now);
    buzzOsc.stop(now + duration);

    // High-frequency crackle layer - electrical arcing
    const crackleOsc = ctx.createOscillator();
    const crackleGain = ctx.createGain();
    const crackleFilter = ctx.createBiquadFilter();

    crackleOsc.connect(crackleFilter);
    crackleFilter.connect(crackleGain);
    crackleGain.connect(ctx.destination);

    crackleOsc.type = 'square'; // Square wave for digital crackling
    crackleOsc.frequency.setValueAtTime(8000, now);
    crackleOsc.frequency.exponentialRampToValueAtTime(4000, now + duration * 0.4);

    crackleGain.gain.setValueAtTime(0.3, now);
    crackleGain.gain.exponentialRampToValueAtTime(0.02, now + duration * 0.5);
    crackleGain.gain.setValueAtTime(0, now + duration * 0.5);

    crackleFilter.type = 'highpass';
    crackleFilter.frequency.setValueAtTime(5000, now);
    crackleFilter.Q.setValueAtTime(6, now);

    crackleOsc.start(now);
    crackleOsc.stop(now + duration * 0.5);

    // Electrical noise/white noise crackle
    createElectricalNoise(ctx, now, duration);

    console.log('Electric charge sound played');
  } catch (error) {
    console.log('Audio error:', error);
  }
}

function createElectricalNoise(ctx: AudioContext, startTime: number, duration: number) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Create bursts of noise for crackling effect
    let burstLength = ctx.sampleRate * 0.02; // 20ms bursts
    let position = 0;

    while (position < bufferSize) {
      // Silence
      for (let i = 0; i < burstLength * 0.3 && position < bufferSize; i++) {
        noiseData[position++] = 0;
      }
      // Noise burst
      for (let i = 0; i < burstLength * 0.7 && position < bufferSize; i++) {
        noiseData[position++] = (Math.random() * 2 - 1) * (1 - position / bufferSize); // Fade out
      }
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    // Very high-pass for electric crackle
    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(6000, startTime + duration * 0.3);
    noiseFilter.Q.setValueAtTime(10, startTime);

    noiseGain.gain.setValueAtTime(0.4, startTime);
    noiseGain.gain.exponentialRampToValueAtTime(0.05, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Noise generation error:', error);
  }
}
