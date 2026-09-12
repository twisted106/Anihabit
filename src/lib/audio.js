// Lightweight Web Audio API sound generator for RPG actions
class SoundSystem {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
  }

  init() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  playTone(frequency, type = 'sine', duration = 0.15, gainVal = 0.1) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio tone could not play', e);
    }
  }

  // RPG Sound presets
  playTaskComplete() {
    this.playTone(523.25, 'triangle', 0.1, 0.12); // C5
    setTimeout(() => this.playTone(659.25, 'triangle', 0.12, 0.12), 80); // E5
    setTimeout(() => this.playTone(783.99, 'triangle', 0.25, 0.14), 160); // G5
  }

  playCoin() {
    this.playTone(987.77, 'sine', 0.08, 0.12); // B5
    setTimeout(() => this.playTone(1318.51, 'sine', 0.15, 0.12), 70); // E6
  }

  playLevelUp() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'square', 0.2, 0.08), idx * 110);
    });
  }

  playTradeoffAlert() {
    this.playTone(220, 'sawtooth', 0.3, 0.15);
    setTimeout(() => this.playTone(185, 'sawtooth', 0.4, 0.18), 180);
  }
}

export const sound = new SoundSystem();
