/**
 * Generate an accurate Iron Man arc repulsor sound using Web Audio API
 * 3-second charging + powerful blast
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
    const duration = 3; // 3 seconds

    // Core resonant hum - 60Hz fundamental (power frequency)
    const coreOsc = ctx.createOscillator();
    const coreGain = ctx.createGain();

    coreOsc.connect(coreGain);
    coreGain.connect(ctx.destination);

    coreOsc.type = 'sine';
    coreOsc.frequency.setValueAtTime(60, now);
    coreOsc.frequency.linearRampToValueAtTime(90, now + duration);

    coreGain.gain.setValueAtTime(0, now);
    coreGain.gain.linearRampToValueAtTime(0.12, now + duration * 0.15);
    coreGain.gain.linearRampToValueAtTime(0.18, now + duration);

    coreOsc.start(now);
    coreOsc.stop(now + duration);

    // First harmonic - builds tension
    const harmonic1Osc = ctx.createOscillator();
    const harmonic1Gain = ctx.createGain();
    const harmonic1Filter = ctx.createBiquadFilter();

    harmonic1Osc.connect(harmonic1Filter);
    harmonic1Filter.connect(harmonic1Gain);
    harmonic1Gain.connect(ctx.destination);

    harmonic1Osc.type = 'sine';
    harmonic1Osc.frequency.setValueAtTime(400, now);
    harmonic1Osc.frequency.exponentialRampToValueAtTime(1200, now + duration * 0.7);
    harmonic1Osc.frequency.linearRampToValueAtTime(1000, now + duration);

    harmonic1Filter.type = 'highpass';
    harmonic1Filter.frequency.setValueAtTime(300, now);

    harmonic1Gain.gain.setValueAtTime(0, now);
    harmonic1Gain.gain.linearRampToValueAtTime(0.15, now + duration * 0.2);
    harmonic1Gain.gain.linearRampToValueAtTime(0.22, now + duration);

    harmonic1Osc.start(now);
    harmonic1Osc.stop(now + duration);

    // High whine - charging energy
    const whineOsc = ctx.createOscillator();
    const whineGain = ctx.createGain();
    const whineLFO = ctx.createOscillator();
    const whineLFOGain = ctx.createGain();

    whineOsc.connect(whineGain);
    whineGain.connect(ctx.destination);

    whineOsc.type = 'sine';
    whineOsc.frequency.setValueAtTime(1600, now);
    whineOsc.frequency.exponentialRampToValueAtTime(3200, now + duration * 0.8);

    // Slight tremolo effect for pulsing
    whineLFO.frequency.setValueAtTime(5.5, now);
    whineLFOGain.gain.setValueAtTime(60, now);
    whineLFO.connect(whineLFOGain);
    whineLFOGain.connect(whineOsc.frequency);

    whineGain.gain.setValueAtTime(0, now);
    whineGain.gain.linearRampToValueAtTime(0.1, now + duration * 0.25);
    whineGain.gain.linearRampToValueAtTime(0.15, now + duration);

    whineOsc.start(now);
    whineOsc.stop(now + duration);
    whineLFO.start(now);
    whineLFO.stop(now + duration);

    // Electrical texture - sawtooth buzz
    const buzzOsc = ctx.createOscillator();
    const buzzGain = ctx.createGain();
    const buzzFilter = ctx.createBiquadFilter();

    buzzOsc.connect(buzzFilter);
    buzzFilter.connect(buzzGain);
    buzzGain.connect(ctx.destination);

    buzzOsc.type = 'sawtooth';
    buzzOsc.frequency.setValueAtTime(2200, now);
    buzzOsc.frequency.exponentialRampToValueAtTime(4400, now + duration * 0.85);

    buzzFilter.type = 'highpass';
    buzzFilter.frequency.setValueAtTime(1500, now);
    buzzFilter.frequency.exponentialRampToValueAtTime(3500, now + duration);
    buzzFilter.Q.setValueAtTime(6, now);

    buzzGain.gain.setValueAtTime(0, now);
    buzzGain.gain.linearRampToValueAtTime(0.08, now + duration * 0.3);
    buzzGain.gain.linearRampToValueAtTime(0.12, now + duration);

    buzzOsc.start(now);
    buzzOsc.stop(now + duration);

    // Arc crackling noise with intensity buildup
    createArcCrackle(ctx, now, duration);

    // Schedule blast at 3 seconds
    setTimeout(() => {
      playBlast(ctx);
    }, duration * 1000);

    console.log('Arc repulsor charging for 3 seconds...');
  } catch (error) {
    console.log('Audio error:', error);
  }
}

function createArcCrackle(ctx: AudioContext, startTime: number, duration: number) {
  try {
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Create bursting crackling pattern
    let pos = 0;
    while (pos < bufferSize) {
      const burstLength = Math.random() * ctx.sampleRate * 0.05 + ctx.sampleRate * 0.03;
      const silenceLength = Math.random() * ctx.sampleRate * 0.08 + ctx.sampleRate * 0.02;
      const progress = pos / bufferSize;
      const intensity = Math.pow(progress, 0.4); // Builds toward end

      // Silence
      for (let i = 0; i < silenceLength && pos < bufferSize; i++) {
        noiseData[pos++] = 0;
      }
      // Noise burst
      for (let i = 0; i < burstLength && pos < bufferSize; i++) {
        noiseData[pos++] = (Math.random() * 2 - 1) * intensity * 0.6;
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
    noiseFilter.frequency.setValueAtTime(3500, startTime);
    noiseFilter.frequency.exponentialRampToValueAtTime(6000, startTime + duration * 0.9);
    noiseFilter.Q.setValueAtTime(10, startTime);

    noiseGain.gain.setValueAtTime(0, startTime);
    noiseGain.gain.linearRampToValueAtTime(0.08, startTime + duration * 0.2);
    noiseGain.gain.linearRampToValueAtTime(0.12, startTime + duration);

    noiseSource.start(startTime);
    noiseSource.stop(startTime + duration);
  } catch (error) {
    console.log('Crackling error:', error);
  }
}

function playBlast(ctx: AudioContext) {
  try {
    const now = ctx.currentTime;
    const blastDuration = 0.6;

    // Explosive bass punch
    const punchOsc = ctx.createOscillator();
    const punchGain = ctx.createGain();
    const punchFilter = ctx.createBiquadFilter();

    punchOsc.connect(punchFilter);
    punchFilter.connect(punchGain);
    punchGain.connect(ctx.destination);

    punchOsc.type = 'sine';
    punchOsc.frequency.setValueAtTime(350, now);
    punchOsc.frequency.exponentialRampToValueAtTime(40, now + blastDuration);

    punchFilter.type = 'lowpass';
    punchFilter.frequency.setValueAtTime(1000, now);
    punchFilter.frequency.exponentialRampToValueAtTime(150, now + blastDuration);
    punchFilter.Q.setValueAtTime(3, now);

    punchGain.gain.setValueAtTime(0.25, now);
    punchGain.gain.exponentialRampToValueAtTime(0.02, now + blastDuration);

    punchOsc.start(now);
    punchOsc.stop(now + blastDuration);

    // High-frequency energy release
    const blastHiOsc = ctx.createOscillator();
    const blastHiGain = ctx.createGain();
    const blastHiFilter = ctx.createBiquadFilter();

    blastHiOsc.connect(blastHiFilter);
    blastHiFilter.connect(blastHiGain);
    blastHiGain.connect(ctx.destination);

    blastHiOsc.type = 'square';
    blastHiOsc.frequency.setValueAtTime(2800, now);
    blastHiOsc.frequency.exponentialRampToValueAtTime(800, now + blastDuration * 0.5);

    blastHiFilter.type = 'highpass';
    blastHiFilter.frequency.setValueAtTime(1200, now);
    blastHiFilter.Q.setValueAtTime(8, now);

    blastHiGain.gain.setValueAtTime(0.2, now);
    blastHiGain.gain.exponentialRampToValueAtTime(0.01, now + blastDuration);

    blastHiOsc.start(now);
    blastHiOsc.stop(now + blastDuration);

    // Blast noise explosion
    const bufferSize = ctx.sampleRate * blastDuration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      const decay = Math.pow(1 - (i / bufferSize), 2);
      noiseData[i] = (Math.random() * 2 - 1) * decay * 0.7;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = ctx.createGain();
    const noiseFilter = ctx.createBiquadFilter();

    noiseSource.connect(noiseFilter);
    noiseFilter.connect(noiseGain);
    noiseGain.connect(ctx.destination);

    noiseFilter.type = 'highpass';
    noiseFilter.frequency.setValueAtTime(3000, now);
    noiseFilter.Q.setValueAtTime(12, now);

    noiseGain.gain.setValueAtTime(0.2, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.01, now + blastDuration);

    noiseSource.start(now);
    noiseSource.stop(now + blastDuration);

    console.log('BLAST FIRED!');
  } catch (error) {
    console.log('Blast error:', error);
  }
}
