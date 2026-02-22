import { clamp, lerp } from './math';
import {
  AUDIO_CROWD_AMBIENT_GAIN,
  AUDIO_CROWD_VOLUME,
  AUDIO_EFFECTS_VOLUME,
  AUDIO_MASTER_VOLUME,
  AUDIO_RHYTHM_VOLUME
} from './tuning';
import type { TimingQuality } from './types';

type BeatTickQuality = TimingQuality;
type CrowdReaction = 'cheer' | 'groan';

type AudioEngine = {
  ctx: AudioContext;
  master: GainNode;
  channels: {
    rhythm: GainNode;
    crowd: GainNode;
    effects: GainNode;
  };
  crowdSource: AudioBufferSourceNode | null;
  crowdAmbientGain: GainNode | null;
  flightWindSource: AudioBufferSourceNode | null;
  flightWindGain: GainNode | null;
  noiseBuffer: AudioBuffer | null;
  lastBeatAtMs: number;
  minBeatIntervalMs: number;
  crowdBaseGain: number;
};

type BrowserWindowWithWebkit = Window &
  typeof globalThis & {
    webkitAudioContext?: typeof AudioContext;
  };

let audioState: AudioEngine | null = null;

const getAudioContextCtor = (): typeof AudioContext | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  const browserWindow = window as BrowserWindowWithWebkit;
  return browserWindow.AudioContext ?? browserWindow.webkitAudioContext ?? null;
};

const createNoiseBuffer = (ctx: AudioContext, durationS: number): AudioBuffer => {
  const sampleRate = ctx.sampleRate;
  const length = Math.max(1, Math.ceil(sampleRate * durationS));
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let index = 0; index < length; index += 1) {
    data[index] = Math.random() * 2 - 1;
  }
  return buffer;
};

const ensureNoiseBuffer = (audio: AudioEngine, durationS = 2): AudioBuffer => {
  if (audio.noiseBuffer === null) {
    audio.noiseBuffer = createNoiseBuffer(audio.ctx, durationS);
  }
  return audio.noiseBuffer;
};

const ensureAudioEngine = (): AudioEngine | null => {
  if (audioState !== null) {
    return audioState;
  }

  const AudioContextCtor = getAudioContextCtor();
  if (AudioContextCtor === null) {
    return null;
  }

  const ctx = new AudioContextCtor();
  const master = ctx.createGain();
  const rhythm = ctx.createGain();
  const crowd = ctx.createGain();
  const effects = ctx.createGain();

  master.gain.value = clamp(AUDIO_MASTER_VOLUME, 0, 1);
  rhythm.gain.value = clamp(AUDIO_RHYTHM_VOLUME, 0, 1);
  crowd.gain.value = clamp(AUDIO_CROWD_VOLUME, 0, 1);
  effects.gain.value = clamp(AUDIO_EFFECTS_VOLUME, 0, 1);

  rhythm.connect(master);
  crowd.connect(master);
  effects.connect(master);
  master.connect(ctx.destination);

  audioState = {
    ctx,
    master,
    channels: {
      rhythm,
      crowd,
      effects
    },
    crowdSource: null,
    crowdAmbientGain: null,
    flightWindSource: null,
    flightWindGain: null,
    noiseBuffer: null,
    lastBeatAtMs: 0,
    minBeatIntervalMs: 200,
    crowdBaseGain: clamp(AUDIO_CROWD_AMBIENT_GAIN, 0.001, 0.25)
  };

  return audioState;
};

const startCrowdAmbience = (audio: AudioEngine): void => {
  if (audio.crowdSource !== null) {
    return;
  }

  const source = audio.ctx.createBufferSource();
  source.buffer = ensureNoiseBuffer(audio, 2);
  source.loop = true;

  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(400, audio.ctx.currentTime);
  filter.Q.setValueAtTime(0.8, audio.ctx.currentTime);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(audio.crowdBaseGain, audio.ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.channels.crowd);

  source.start();
  source.onended = () => {
    if (audio.crowdSource === source) {
      audio.crowdSource = null;
      audio.crowdAmbientGain = null;
    }
  };

  audio.crowdSource = source;
  audio.crowdAmbientGain = gain;
};

const ensureFlightWind = (audio: AudioEngine): GainNode => {
  if (audio.flightWindSource !== null && audio.flightWindGain !== null) {
    return audio.flightWindGain;
  }

  const source = audio.ctx.createBufferSource();
  source.buffer = ensureNoiseBuffer(audio, 2);
  source.loop = true;

  const filter = audio.ctx.createBiquadFilter();
  filter.type = 'highpass';
  filter.frequency.setValueAtTime(1800, audio.ctx.currentTime);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, audio.ctx.currentTime);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(audio.channels.effects);
  source.start();
  source.onended = () => {
    if (audio.flightWindSource === source) {
      audio.flightWindSource = null;
      audio.flightWindGain = null;
    }
  };

  audio.flightWindSource = source;
  audio.flightWindGain = gain;
  return gain;
};

type ToneParams = {
  frequencyHz: number;
  endFrequencyHz?: number;
  type: OscillatorType;
  volume: number;
  durationS: number;
  attackS?: number;
  startOffsetS?: number;
};

const playTone = (audio: AudioEngine, destination: AudioNode, params: ToneParams): void => {
  const now = audio.ctx.currentTime + (params.startOffsetS ?? 0);
  const attackS = Math.max(0.001, params.attackS ?? 0.005);
  const durationS = Math.max(0.015, params.durationS);
  const endTime = now + durationS;

  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = params.type;
  osc.frequency.setValueAtTime(Math.max(20, params.frequencyHz), now);
  if (typeof params.endFrequencyHz === 'number') {
    osc.frequency.exponentialRampToValueAtTime(Math.max(20, params.endFrequencyHz), endTime);
  }

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, params.volume), now + attackS);
  gain.gain.exponentialRampToValueAtTime(0.0001, endTime);

  osc.connect(gain);
  gain.connect(destination);
  osc.start(now);
  osc.stop(endTime + 0.03);
};

type NoiseBurstParams = {
  filterType: BiquadFilterType;
  filterHz: number;
  volume: number;
  durationS: number;
  attackS?: number;
};

const playNoiseBurst = (audio: AudioEngine, destination: AudioNode, params: NoiseBurstParams): void => {
  const now = audio.ctx.currentTime;
  const durationS = Math.max(0.02, params.durationS);
  const attackS = Math.max(0.002, params.attackS ?? 0.01);
  const source = audio.ctx.createBufferSource();
  source.buffer = createNoiseBuffer(audio.ctx, durationS);

  const filter = audio.ctx.createBiquadFilter();
  filter.type = params.filterType;
  filter.frequency.setValueAtTime(Math.max(20, params.filterHz), now);

  const gain = audio.ctx.createGain();
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.linearRampToValueAtTime(Math.max(0.0001, params.volume), now + attackS);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + durationS);

  source.connect(filter);
  filter.connect(gain);
  gain.connect(destination);
  source.start(now);
  source.stop(now + durationS + 0.03);
};

const runWithAudio = (callback: (audio: AudioEngine) => void): void => {
  const audio = ensureAudioEngine();
  if (audio === null) {
    return;
  }
  callback(audio);
};

/**
 * Play a short rhythm tick sound.
 * `qualityOrInZone` supports legacy boolean call sites.
 */
export const playBeatTick = (nowMs: number, qualityOrInZone: BeatTickQuality | boolean): void => {
  runWithAudio((audio) => {
    if (nowMs - audio.lastBeatAtMs < audio.minBeatIntervalMs) {
      return;
    }
    audio.lastBeatAtMs = nowMs;

    const quality: BeatTickQuality =
      typeof qualityOrInZone === 'boolean'
        ? qualityOrInZone
          ? 'perfect'
          : 'good'
        : qualityOrInZone;

    if (quality === 'perfect') {
      playTone(audio, audio.channels.rhythm, {
        frequencyHz: 660,
        type: 'square',
        volume: 0.12,
        durationS: 0.04,
        attackS: 0.004
      });
      playTone(audio, audio.channels.rhythm, {
        frequencyHz: 880,
        type: 'square',
        volume: 0.09,
        durationS: 0.03,
        attackS: 0.003,
        startOffsetS: 0.035
      });
      return;
    }

    if (quality === 'good') {
      playTone(audio, audio.channels.rhythm, {
        frequencyHz: 440,
        type: 'triangle',
        volume: 0.08,
        durationS: 0.05
      });
      return;
    }

    playTone(audio, audio.channels.rhythm, {
      frequencyHz: 220,
      type: 'sine',
      volume: 0.04,
      durationS: 0.06
    });
  });
};

export const playChargeStart = (): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 150,
      endFrequencyHz: 120,
      type: 'sine',
      volume: 0.045,
      durationS: 0.12,
      attackS: 0.01
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'lowpass',
      filterHz: 520,
      volume: 0.025,
      durationS: 0.12
    });
  });
};

export const playThrowWhoosh = (speedNorm: number): void => {
  runWithAudio((audio) => {
    const speedT = clamp(speedNorm, 0, 1);
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'highpass',
      filterHz: lerp(2000, 6000, speedT),
      volume: lerp(0.08, 0.15, speedT),
      durationS: 0.15
    });
  });
};

export const setFlightWindIntensity = (speedNorm: number): void => {
  runWithAudio((audio) => {
    const gain = ensureFlightWind(audio);
    const intensity = clamp(speedNorm, 0, 1);
    const now = audio.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(Math.max(0.0001, gain.gain.value), now);
    gain.gain.linearRampToValueAtTime(lerp(0.0001, 0.09, intensity), now + 0.08);
  });
};

export const playLandingImpact = (tipFirst: boolean): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 80,
      type: 'sine',
      volume: 0.12,
      durationS: 0.1,
      attackS: 0.004
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'lowpass',
      filterHz: 400,
      volume: 0.06,
      durationS: 0.08
    });
    if (tipFirst) {
      playTone(audio, audio.channels.effects, {
        frequencyHz: 1200,
        type: 'triangle',
        volume: 0.05,
        durationS: 0.04,
        attackS: 0.003,
        startOffsetS: 0.02
      });
    }
  });
};

export const playCrowdReaction = (reaction: CrowdReaction): void => {
  runWithAudio((audio) => {
    const now = audio.ctx.currentTime;
    const crowdChannel = audio.channels.crowd.gain;
    const base = clamp(AUDIO_CROWD_VOLUME, 0, 1);
    crowdChannel.cancelScheduledValues(now);
    crowdChannel.setValueAtTime(crowdChannel.value, now);

    if (reaction === 'cheer') {
      crowdChannel.linearRampToValueAtTime(Math.min(1, base * 1.8), now + 0.2);
      crowdChannel.linearRampToValueAtTime(base, now + 1.4);
      playNoiseBurst(audio, audio.channels.crowd, {
        filterType: 'bandpass',
        filterHz: 1500,
        volume: 0.07,
        durationS: 0.28
      });
      return;
    }

    crowdChannel.linearRampToValueAtTime(base * 0.45, now + 0.06);
    crowdChannel.linearRampToValueAtTime(base, now + 0.85);
    playTone(audio, audio.channels.crowd, {
      frequencyHz: 110,
      type: 'square',
      volume: 0.05,
      durationS: 0.12
    });
  });
};

export const playFaultOof = (): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 140,
      endFrequencyHz: 100,
      type: 'square',
      volume: 0.1,
      durationS: 0.18,
      attackS: 0.002
    });
  });
};

export const resumeAudioContext = (): void => {
  const audio = ensureAudioEngine();
  if (audio === null) {
    return;
  }

  const bootAmbience = (): void => {
    startCrowdAmbience(audio);
  };

  if (audio.ctx.state === 'suspended') {
    void audio.ctx.resume().then(bootAmbience).catch(() => {
      // Swallow resume errors in unsupported/blocked environments.
    });
    return;
  }

  bootAmbience();
};
