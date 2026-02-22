import { describe, expect, it } from 'vitest';
import {
  playBeatTick,
  playChargeStart,
  playCrowdReaction,
  playFaultOof,
  playLandingImpact,
  setFlightWindIntensity,
  playThrowWhoosh,
  resumeAudioContext
} from './audio';

describe('audio no-op fallback', () => {
  it('does not throw when AudioContext is unavailable', () => {
    expect(() => resumeAudioContext()).not.toThrow();
    expect(() => playBeatTick(1000, 'perfect')).not.toThrow();
    expect(() => playBeatTick(1020, true)).not.toThrow();
    expect(() => playChargeStart()).not.toThrow();
    expect(() => playThrowWhoosh(0.75)).not.toThrow();
    expect(() => setFlightWindIntensity(0.5)).not.toThrow();
    expect(() => playLandingImpact(true)).not.toThrow();
    expect(() => playCrowdReaction('cheer')).not.toThrow();
    expect(() => playCrowdReaction('groan')).not.toThrow();
    expect(() => playFaultOof()).not.toThrow();
  });
});
