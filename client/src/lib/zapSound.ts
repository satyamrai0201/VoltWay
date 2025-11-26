/**
 * Generate a short circuit/continuous shock sound using Web Audio API
 * Creates a realistic electrical shock/electrocution effect
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
    const duration = 0.4; // Longer continuous shock

    // Create main master gain for overall volume control
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.setValueAtTime(0.5, now);
    masterGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Create noise buffer for crackling/static
    const bufferSize = ctx.sampleRate * duration;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const noiseData = noiseBuffer.getChannelData(0);

    // Fill with aggressive random noise for crackling
    for (let i = 0; i < bufferSize; i++) {
      noiseData[i] = Math.random() * 2 - 1;
    }

    // Create noise source
    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    // Create high-pass filter for electrical crackle
    const filter1 = ctx.createBiquadFilter();
    filter1.type = 'highpass';
    filter1.frequency.setValueAtTime(3000, now);
    filter1.frequency.linearRampToValueAtTime(5000, now + duration);
    filter1.Q.setValueAtTime(8, now);

    // Create another filter for more crackle
    const filter2 = ctx.createBiquadFilter();
    filter2.type = 'highpass';
    filter2.frequency.setValueAtTime(5000, now);
    filter2.Q.setValueAtTime(10, now);

    // Connect noise filters
    noiseSource.connect(filter1);
    filter1.connect(filter2);

    // Create pulse oscillator for shock tone
    const pulse = ctx.createOscillator();
    pulse.type = 'square';
    pulse.frequency.setValueAtTime(220, now);
    pulse.frequency.linearRampToValueAtTime(100, now + duration * 0.3);
    pulse.frequency.linearRampToValueAtTime(50, now + duration);

    const pulseGain = ctx.createGain();
    pulse.connect(pulseGain);
    pulseGain.gain.setValueAtTime(0.2, now);
    pulseGain.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Create AM (amplitude modulation) for electrical buzzing
    const modOsc = ctx.createOscillator();
    modOsc.frequency.setValueAtTime(60, now); // 60Hz hum
    modOsc.frequency.linearRampToValueAtTime(120, now + duration);

    const modGain = ctx.createGain();
    modOsc.connect(modGain);
    modGain.gain.setValueAtTime(0.4, now);
    modGain.gain.exponentialRampToValueAtTime(0.1, now + duration);

    // Mix everything through master
    filter2.connect(masterGain);
    pulseGain.connect(masterGain);
    modGain.connect(masterGain);

    // Start all oscillators and sources
    noiseSource.start(now);
    noiseSource.stop(now + duration);

    pulse.start(now);
    pulse.stop(now + duration);

    modOsc.start(now);
    modOsc.stop(now + duration);

    // Create additional crackling noise bursts
    createCrackleBursts(ctx, now, duration, masterGain);

    console.log('Short circuit shock sound played');
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}

function createCrackleBursts(ctx: AudioContext, startTime: number, duration: number, masterGain: GainNode) {
  try {
    // Create random crackle bursts throughout the sound
    const numBursts = 8;
    for (let i = 0; i < numBursts; i++) {
      const burstTime = startTime + (duration / numBursts) * i;
      const burstDuration = 0.05;

      // Create short noise burst
      const burstBuffer = ctx.createBuffer(1, ctx.sampleRate * burstDuration, ctx.sampleRate);
      const burstData = burstBuffer.getChannelData(0);

      // Fill with aggressive crackling
      for (let j = 0; j < burstBuffer.length; j++) {
        burstData[j] = (Math.random() * 2 - 1) * (Math.random() > 0.3 ? 1 : 0);
      }

      const burstSource = ctx.createBufferSource();
      burstSource.buffer = burstBuffer;

      const burstFilter = ctx.createBiquadFilter();
      burstFilter.type = 'highpass';
      burstFilter.frequency.setValueAtTime(4000, burstTime);
      burstFilter.Q.setValueAtTime(12, burstTime);

      const burstGain = ctx.createGain();
      burstGain.gain.setValueAtTime(0.3, burstTime);
      burstGain.gain.exponentialRampToValueAtTime(0.01, burstTime + burstDuration);

      burstSource.connect(burstFilter);
      burstFilter.connect(burstGain);
      burstGain.connect(masterGain);

      burstSource.start(burstTime);
      burstSource.stop(burstTime + burstDuration);
    }
  } catch (error) {
    console.log('Crackle bursts failed:', error);
  }
}
