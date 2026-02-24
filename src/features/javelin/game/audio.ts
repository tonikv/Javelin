import { clamp, lerp } from './math';
import { GAMEPLAY_TUNING } from './tuning';

const {
  masterVolume: AUDIO_MASTER_VOLUME,
  runupTapVolume: AUDIO_RUNUP_TAP_VOLUME,
  crowdVolume: AUDIO_CROWD_VOLUME,
  effectsVolume: AUDIO_EFFECTS_VOLUME,
  crowdAmbientGain: AUDIO_CROWD_AMBIENT_GAIN
} = GAMEPLAY_TUNING.audio;

type CrowdReaction = 'cheer' | 'groan';

type AudioEngine = {
  ctx: AudioContext;
  master: GainNode;
  channels: {
    runup: GainNode;
    crowd: GainNode;
    effects: GainNode;
  };
  crowdSource: AudioBufferSourceNode | null;
  crowdAmbientGain: GainNode | null;
  flightWindSource: AudioBufferSourceNode | null;
  flightWindGain: GainNode | null;
  noiseBuffer: AudioBuffer | null;
  lastRunupTapAtMs: number;
  minRunupTapIntervalMs: number;
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
  const runup = ctx.createGain();
  const crowd = ctx.createGain();
  const effects = ctx.createGain();

  master.gain.value = clamp(AUDIO_MASTER_VOLUME, 0, 1);
  runup.gain.value = clamp(AUDIO_RUNUP_TAP_VOLUME, 0, 1);
  crowd.gain.value = clamp(AUDIO_CROWD_VOLUME, 0, 1);
  effects.gain.value = clamp(AUDIO_EFFECTS_VOLUME, 0, 1);

  runup.connect(master);
  crowd.connect(master);
  effects.connect(master);
  master.connect(ctx.destination);

  audioState = {
    ctx,
    master,
    channels: {
      runup,
      crowd,
      effects
    },
    crowdSource: null,
    crowdAmbientGain: null,
    flightWindSource: null,
    flightWindGain: null,
    noiseBuffer: null,
    lastRunupTapAtMs: 0,
    minRunupTapIntervalMs: 36,
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
  startOffsetS?: number;
};

const playNoiseBurst = (audio: AudioEngine, destination: AudioNode, params: NoiseBurstParams): void => {
  const now = audio.ctx.currentTime + (params.startOffsetS ?? 0);
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

export const playRunupTap = (intensity01: number): void => {
  runWithAudio((audio) => {
    const nowMs = audio.ctx.currentTime * 1000;
    if (nowMs - audio.lastRunupTapAtMs < audio.minRunupTapIntervalMs) {
      return;
    }
    audio.lastRunupTapAtMs = nowMs;

    const intensity = clamp(intensity01, 0, 1);
    const baseFrequencyHz = lerp(260, 520, intensity);
    const baseVolume = lerp(0.055, 0.11, intensity);

    playTone(audio, audio.channels.runup, {
      frequencyHz: baseFrequencyHz,
      type: 'triangle',
      volume: baseVolume,
      durationS: 0.045,
      attackS: 0.003
    });
    playTone(audio, audio.channels.runup, {
      frequencyHz: baseFrequencyHz * 1.35,
      type: 'square',
      volume: baseVolume * 0.55,
      durationS: 0.028,
      attackS: 0.002,
      startOffsetS: 0.015
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
    const currentGain = Math.max(0.0001, gain.gain.value);
    const targetGain = lerp(0.0001, 0.09, intensity);
    const rampDurationS = targetGain < currentGain ? 0.025 : 0.08;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(currentGain, now);
    gain.gain.linearRampToValueAtTime(targetGain, now + rampDurationS);
  });
};

export const playLandingImpact = (tipFirst: boolean): void => {
  runWithAudio((audio) => {
    playTone(audio, audio.channels.effects, {
      frequencyHz: 112,
      endFrequencyHz: 86,
      type: 'sine',
      volume: 0.135,
      durationS: 0.12,
      attackS: 0.003
    });
    playTone(audio, audio.channels.effects, {
      frequencyHz: 220,
      endFrequencyHz: 168,
      type: 'triangle',
      volume: 0.082,
      durationS: 0.08,
      attackS: 0.002
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'lowpass',
      filterHz: 560,
      volume: 0.072,
      durationS: 0.11,
      attackS: 0.003
    });
    playNoiseBurst(audio, audio.channels.effects, {
      filterType: 'bandpass',
      filterHz: 1450,
      volume: 0.09,
      durationS: 0.06,
      attackS: 0.002
    });
    if (tipFirst) {
      playTone(audio, audio.channels.effects, {
        frequencyHz: 1500,
        endFrequencyHz: 1280,
        type: 'triangle',
        volume: 0.07,
        durationS: 0.05,
        attackS: 0.003,
        startOffsetS: 0.018
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
      crowdChannel.linearRampToValueAtTime(base * 0.92, now + 0.09);
      crowdChannel.linearRampToValueAtTime(Math.min(1, base * 1.8), now + 0.29);
      crowdChannel.linearRampToValueAtTime(base, now + 1.45);
      playNoiseBurst(audio, audio.channels.crowd, {
        filterType: 'bandpass',
        filterHz: 1500,
        volume: 0.07,
        durationS: 0.28,
        startOffsetS: 0.09
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
