// Retro Cyberpunk SFX Synthesizer using Web Audio API
// No external assets required, pure mathematical synth.

let audioCtx: AudioContext | null = null;
let soundEnabled = true;

// Initialize sound state from localStorage if available
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem('fenix_sfx_enabled');
  if (saved !== null) {
    soundEnabled = saved === 'true';
  }
}

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    // Standard AudioContext initialization
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export const synth = {
  isEnabled(): boolean {
    return soundEnabled;
  },

  setEnabled(enabled: boolean) {
    soundEnabled = enabled;
    if (typeof window !== 'undefined') {
      localStorage.setItem('fenix_sfx_enabled', String(enabled));
    }
  },

  playClick() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Create oscillator and gain node
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(150, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {
      console.warn('Audio click error:', e);
    }
  },

  playHover() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);

      gain.gain.setValueAtTime(0.015, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    } catch (e) {
      console.warn('Audio hover error:', e);
    }
  },

  playSuccess() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      // Note 1 (Root)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(523.25, now); // C5
      gain1.gain.setValueAtTime(0.06, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.3);

      // Note 2 (Fifth, slightly delayed)
      setTimeout(() => {
        if (!soundEnabled) return;
        try {
          const t = ctx.currentTime;
          const osc2 = ctx.createOscillator();
          const gain2 = ctx.createGain();
          osc2.type = 'sine';
          osc2.frequency.setValueAtTime(783.99, t); // G5
          gain2.gain.setValueAtTime(0.06, t);
          gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.25);
          osc2.connect(gain2);
          gain2.connect(ctx.destination);
          osc2.start(t);
          osc2.stop(t + 0.3);
        } catch {}
      }, 80);

      // Note 3 (Octave, slightly delayed more)
      setTimeout(() => {
        if (!soundEnabled) return;
        try {
          const t = ctx.currentTime;
          const osc3 = ctx.createOscillator();
          const gain3 = ctx.createGain();
          osc3.type = 'sine';
          osc3.frequency.setValueAtTime(1046.50, t); // C6
          gain3.gain.setValueAtTime(0.08, t);
          gain3.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
          osc3.connect(gain3);
          gain3.connect(ctx.destination);
          osc3.start(t);
          osc3.stop(t + 0.4);
        } catch {}
      }, 160);

    } catch (e) {
      console.warn('Audio success error:', e);
    }
  },

  playTerminalType() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      // Add slight randomness to make typing feel organic
      const freq = 600 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.02);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.03);
    } catch (e) {
      console.warn('Audio terminal click error:', e);
    }
  },

  playBoot() {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;
      const notes = [220, 293.66, 329.63, 440]; // A3, D4, E4, A4

      notes.forEach((freq, idx) => {
        setTimeout(() => {
          if (!soundEnabled) return;
          try {
            const t = ctx.currentTime;
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, t);
            
            // Low-pass filter to make it sound warm and analog
            const filter = ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1000, t);

            gain.gain.setValueAtTime(0.04, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(ctx.destination);

            osc.start(t);
            osc.stop(t + 0.5);
          } catch {}
        }, idx * 100);
      });
    } catch (e) {
      console.warn('Audio boot error:', e);
    }
  }
};
