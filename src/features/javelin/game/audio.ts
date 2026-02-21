type BeatAudioContext = {
  ctx: AudioContext;
  lastTickAtMs: number;
  minIntervalMs: number;
};

let audioState: BeatAudioContext | null = null;

const ensureAudioContext = (): BeatAudioContext | null => {
  if (audioState !== null) {
    return audioState;
  }
  if (typeof window === 'undefined' || typeof window.AudioContext === 'undefined') {
    return null;
  }
  audioState = {
    ctx: new window.AudioContext(),
    lastTickAtMs: 0,
    minIntervalMs: 200
  };
  return audioState;
};

/**
 * Play a short rhythm tick sound.
 * Uses an oscillator to avoid loading audio assets.
 */
export const playBeatTick = (nowMs: number, isInZone: boolean): void => {
  const audio = ensureAudioContext();
  if (audio === null) {
    return;
  }
  if (nowMs - audio.lastTickAtMs < audio.minIntervalMs) {
    return;
  }
  audio.lastTickAtMs = nowMs;

  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.connect(gain);
  gain.connect(audio.ctx.destination);

  osc.frequency.value = isInZone ? 880 : 440;
  osc.type = 'sine';

  const now = audio.ctx.currentTime;
  gain.gain.setValueAtTime(isInZone ? 0.15 : 0.06, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

  osc.start(now);
  osc.stop(now + 0.06);
};

export const resumeAudioContext = (): void => {
  const audio = ensureAudioContext();
  if (audio?.ctx.state === 'suspended') {
    void audio.ctx.resume();
  }
};
