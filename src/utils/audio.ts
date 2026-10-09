/**
 * Web Audio Engine for TIMEWILD
 * Generates procedural, zero-latency ambient soundscapes and creature calls
 * Safe for child ears with soft limiters, graceful mute & volume controls.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.5;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private currentAmbientType: string | null = null;
  private ambientNodes: { stop: () => void } | null = null;

  constructor() {
    // Initialized lazily on first user interaction to comply with browser autoplay policies
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.ambientGain = this.ctx.createGain();
        this.ambientGain.gain.setValueAtTime(0.35, this.ctx.currentTime);
        this.ambientGain.connect(this.masterGain);
      }
    } else if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : this.volume, this.ctx.currentTime);
    }
  }

  public isSoundMuted(): boolean {
    return this.isMuted;
  }

  // Soft brown/pink noise buffer helper for organic winds, rivers, volcanos
  private createNoiseBuffer(seconds: number = 3): AudioBuffer | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * seconds;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      // Brown noise integration
      lastOut = (lastOut + 0.02 * white) / 1.02;
      data[i] = lastOut * 3.5;
    }
    return buffer;
  }

  // Play ambient audio by era
  public playAmbient(type: 'ocean' | 'swamp' | 'jungle' | 'volcano' | 'ice' | 'cave' | 'portal') {
    this.initCtx();
    if (!this.ctx || !this.ambientGain) return;

    if (this.currentAmbientType === type && this.ambientNodes) {
      return; // already playing this era ambience
    }

    // Stop previous ambience smoothly
    this.stopAmbient();
    this.currentAmbientType = type;

    const ctx = this.ctx;
    const ambientGain = this.ambientGain;
    const noiseBuffer = this.createNoiseBuffer(4);

    let active = true;
    let timerId: number | null = null;

    if (type === 'ocean') {
      // Gentle swell + deep water resonant filter + bubble drops
      if (!noiseBuffer) return;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(220, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.18, ctx.currentTime); // slow wave surge
      lfoGain.gain.setValueAtTime(140, ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.4, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(localGain);
      localGain.connect(ambientGain);
      noiseSource.start();

      // Occasional water bubble pop
      const bubbleInterval = window.setInterval(() => {
        if (!active || !this.ctx) return;
        this.playBubble();
      }, 2400);

      this.ambientNodes = {
        stop: () => {
          active = false;
          clearInterval(bubbleInterval);
          try {
            lfo.stop();
            noiseSource.stop();
          } catch {}
        }
      };
    } else if (type === 'swamp') {
      // Warm humid drone + cricket chitter
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(75, ctx.currentTime);

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, ctx.currentTime);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.18, ctx.currentTime);

      osc.connect(filter);
      filter.connect(localGain);
      localGain.connect(ambientGain);
      osc.start();

      // Cricket pulse
      const cricketTimer = window.setInterval(() => {
        if (!active || !this.ctx) return;
        this.playCricketChirp();
      }, 3500);

      this.ambientNodes = {
        stop: () => {
          active = false;
          clearInterval(cricketTimer);
          try { osc.stop(); } catch {}
        }
      };
    } else if (type === 'jungle') {
      // Canopy rustle & distant prehistoric bird whistles
      if (!noiseBuffer) return;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
      filter.Q.setValueAtTime(1.5, ctx.currentTime);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.25, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(localGain);
      localGain.connect(ambientGain);
      noiseSource.start();

      const birdTimer = window.setInterval(() => {
        if (!active || !this.ctx) return;
        this.playJungleCall();
      }, 4200);

      this.ambientNodes = {
        stop: () => {
          active = false;
          clearInterval(birdTimer);
          try { noiseSource.stop(); } catch {}
        }
      };
    } else if (type === 'volcano') {
      // Deep sub-bass earth rumble
      if (!noiseBuffer) return;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(120, ctx.currentTime);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.5, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(localGain);
      localGain.connect(ambientGain);
      noiseSource.start();

      this.ambientNodes = {
        stop: () => {
          active = false;
          try { noiseSource.stop(); } catch {}
        }
      };
    } else if (type === 'ice') {
      // Howling arctic tundra wind
      if (!noiseBuffer) return;
      const noiseSource = ctx.createBufferSource();
      noiseSource.buffer = noiseBuffer;
      noiseSource.loop = true;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(700, ctx.currentTime);
      filter.Q.setValueAtTime(4.0, ctx.currentTime);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.frequency.setValueAtTime(0.22, ctx.currentTime);
      lfoGain.gain.setValueAtTime(320, ctx.currentTime);
      lfo.connect(filter.frequency);
      lfo.start();

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.28, ctx.currentTime);

      noiseSource.connect(filter);
      filter.connect(localGain);
      localGain.connect(ambientGain);
      noiseSource.start();

      this.ambientNodes = {
        stop: () => {
          active = false;
          try {
            lfo.stop();
            noiseSource.stop();
          } catch {}
        }
      };
    } else if (type === 'cave') {
      // Campfire crackle and cave echo
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(55, ctx.currentTime);

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.2, ctx.currentTime);
      osc.connect(localGain);
      localGain.connect(ambientGain);
      osc.start();

      // Dripping water ping
      const dripTimer = window.setInterval(() => {
        if (!active || !this.ctx) return;
        this.playWaterDrip();
      }, 3100);

      this.ambientNodes = {
        stop: () => {
          active = false;
          clearInterval(dripTimer);
          try { osc.stop(); } catch {}
        }
      };
    } else if (type === 'portal') {
      // Swirling cosmic temporal hum
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(110, ctx.currentTime);
      osc2.frequency.setValueAtTime(220, ctx.currentTime);

      const lfo = ctx.createOscillator();
      lfo.frequency.setValueAtTime(1.5, ctx.currentTime);
      const lfoGain = ctx.createGain();
      lfoGain.gain.setValueAtTime(15, ctx.currentTime);
      lfo.connect(osc1.frequency);
      lfo.start();

      const localGain = ctx.createGain();
      localGain.gain.setValueAtTime(0.22, ctx.currentTime);

      osc1.connect(localGain);
      osc2.connect(localGain);
      localGain.connect(ambientGain);
      osc1.start();
      osc2.start();

      this.ambientNodes = {
        stop: () => {
          try {
            lfo.stop();
            osc1.stop();
            osc2.stop();
          } catch {}
        }
      };
    }
  }

  public stopAmbient() {
    if (this.ambientNodes) {
      try {
        this.ambientNodes.stop();
      } catch {}
      this.ambientNodes = null;
    }
    this.currentAmbientType = null;
  }

  // --- Creature Audio Synthesizers ---
  public playCreatureCall(soundType: string) {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    switch (soundType) {
      case 'roar': {
        // Deep T-Rex / Carnivore thunderous roar
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc2.type = 'triangle';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 1.2);
        osc2.frequency.setValueAtTime(80, now);
        osc2.frequency.exponentialRampToValueAtTime(35, now + 1.2);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(600, now);
        filter.frequency.exponentialRampToValueAtTime(150, now + 1.2);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.7, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(now);
        osc2.start(now);
        osc.stop(now + 1.3);
        osc2.stop(now + 1.3);
        break;
      }
      case 'rumble': {
        // Sauropod deep infrasound earth rumble
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(55, now);
        osc.frequency.linearRampToValueAtTime(70, now + 0.5);
        osc.frequency.linearRampToValueAtTime(45, now + 1.5);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.65, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.6);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.6);
        break;
      }
      case 'trumpet': {
        // Woolly Mammoth majestic trumpet
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(420, now + 0.3);
        osc.frequency.exponentialRampToValueAtTime(190, now + 1.0);

        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(400, now);
        filter.Q.setValueAtTime(2, now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.5, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.1);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 1.1);
        break;
      }
      case 'screech': {
        // Pteranodon soaring screech
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1100, now);
        osc.frequency.linearRampToValueAtTime(1800, now + 0.25);
        osc.frequency.exponentialRampToValueAtTime(650, now + 0.8);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.85);
        break;
      }
      case 'buzz': {
        // Meganeura giant wings flutter
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);

        const tremolo = ctx.createOscillator();
        tremolo.frequency.setValueAtTime(28, now);
        const tremoloGain = ctx.createGain();
        tremoloGain.gain.setValueAtTime(30, now);
        tremolo.connect(osc.frequency);
        tremolo.start(now);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.4, now + 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.9);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.9);
        tremolo.stop(now + 0.9);
        break;
      }
      case 'chitter':
      case 'click': {
        // Underwater click or trilobite chitter
        for (let i = 0; i < 4; i++) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          const clickTime = now + i * 0.07;
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1200 - i * 150, clickTime);

          gain.gain.setValueAtTime(0.35, clickTime);
          gain.gain.exponentialRampToValueAtTime(0.001, clickTime + 0.05);

          osc.connect(gain);
          gain.connect(this.masterGain);
          osc.start(clickTime);
          osc.stop(clickTime + 0.06);
        }
        break;
      }
      case 'purr': {
        // Smilodon Saber-tooth cat warm growl
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(95, now);
        osc.frequency.linearRampToValueAtTime(75, now + 0.7);

        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(0.45, now + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);

        osc.connect(gain);
        gain.connect(this.masterGain);
        osc.start(now);
        osc.stop(now + 0.8);
        break;
      }
      default:
        this.playDiscoveryChime();
    }
  }

  // --- Interface & Mini-game SFX ---
  public playDiscoveryChime() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = this.masterGain;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 (sparkling arpeggio)

    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const noteTime = now + idx * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, noteTime);

      gain.gain.setValueAtTime(0.001, noteTime);
      gain.gain.linearRampToValueAtTime(0.3, noteTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.5);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(noteTime);
      osc.stop(noteTime + 0.55);
    });
  }

  public playFossilDig(tool: 'shovel' | 'brush' | 'glass' | 'plaster' = 'shovel') {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    if (tool === 'brush') {
      // Soft sand whisper
      const buffer = this.createNoiseBuffer(0.3);
      if (!buffer) return;
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1400, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);
      source.start(now);
      source.stop(now + 0.25);
    } else if (tool === 'glass') {
      // Optical ping
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.15);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } else {
      // Crisp stone chip / trowel click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.09);
      gain.gain.setValueAtTime(0.4, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(now);
      osc.stop(now + 0.12);
    }
  }

  public playTimeWarp() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + 0.7);
    osc.frequency.exponentialRampToValueAtTime(240, now + 1.2);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);
    filter.frequency.linearRampToValueAtTime(2500, now + 0.7);
    filter.frequency.exponentialRampToValueAtTime(300, now + 1.2);

    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.5, now + 0.4);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.3);
  }

  public playPipBeep(mood: 'happy' | 'curious' | 'celebrate' | 'thinking' = 'happy') {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = this.masterGain;

    let frequencies = [587.33, 880];
    if (mood === 'celebrate') frequencies = [523.25, 659.25, 783.99, 1046.5];
    if (mood === 'curious') frequencies = [440, 554.37, 659.25];
    if (mood === 'thinking') frequencies = [392, 440, 392];

    frequencies.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startT = now + idx * 0.07;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.01, startT);
      gain.gain.linearRampToValueAtTime(0.25, startT + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, startT + 0.12);

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startT);
      osc.stop(startT + 0.13);
    });
  }

  public playSuccessFanfare() {
    this.initCtx();
    if (!this.ctx || !this.masterGain) return;
    const ctx = this.ctx;
    const now = ctx.currentTime;
    const masterGain = this.masterGain;
    const melody = [523.25, 659.25, 783.99, 1046.5, 1318.51];

    melody.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const startT = now + idx * 0.1;
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, startT);

      gain.gain.setValueAtTime(0.01, startT);
      gain.gain.linearRampToValueAtTime(0.35, startT + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, startT + (idx === melody.length - 1 ? 0.8 : 0.25));

      osc.connect(gain);
      gain.connect(masterGain);
      osc.start(startT);
      osc.stop(startT + (idx === melody.length - 1 ? 0.85 : 0.3));
    });
  }

  private playBubble() {
    if (!this.ctx || !this.ambientGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    const startFreq = 300 + Math.random() * 300;
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 2.2, now + 0.08);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.1);
  }

  private playCricketChirp() {
    if (!this.ctx || !this.ambientGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(3200 + Math.random() * 400, now);

    gain.gain.setValueAtTime(0.03, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.06);
  }

  private playJungleCall() {
    if (!this.ctx || !this.ambientGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    osc.type = 'sine';
    const baseFreq = 900 + Math.random() * 600;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.linearRampToValueAtTime(baseFreq + 350, now + 0.15);
    osc.frequency.exponentialRampToValueAtTime(baseFreq - 150, now + 0.4);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.09, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.48);
  }

  private playWaterDrip() {
    if (!this.ctx || !this.ambientGain) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;
    const freq = 1400 + Math.random() * 400;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, now + 0.06);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ambientGain);
    osc.start(now);
    osc.stop(now + 0.13);
  }
}

export const soundManager = new SoundEngine();
