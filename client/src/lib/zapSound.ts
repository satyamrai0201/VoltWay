/**
 * Play zap/shock sound from audio file
 */

let audioElement: HTMLAudioElement | null = null;

export function playZapSound() {
  try {
    // Create or reuse audio element
    if (!audioElement) {
      audioElement = new Audio('/zap-sound.wav');
      audioElement.volume = 0.9; // Max volume - 90%
    }
    
    // Reset and play
    audioElement.currentTime = 0;
    audioElement.volume = 0.9;
    
    const playPromise = audioElement.play();
    
    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('Zap sound playing successfully');
        })
        .catch(error => {
          console.log('Audio playback prevented:', error);
        });
    }
  } catch (error) {
    console.log('Audio playback error:', error);
  }
}
