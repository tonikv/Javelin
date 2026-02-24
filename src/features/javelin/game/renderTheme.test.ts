import { describe, expect, it } from 'vitest';
import { getRenderPalette } from './renderTheme';

describe('render theme palettes', () => {
  it('provides required scene and meter palette keys for both themes', () => {
    const light = getRenderPalette('light');
    const dark = getRenderPalette('dark');

    expect(light.scene.skyTop).toBeTruthy();
    expect(light.scene.fieldGrass).toBeTruthy();
    expect(light.scene.throwLineStroke).toBeTruthy();
    expect(light.meter.trackArc).toBeTruthy();
    expect(light.wind.mastStroke).toBeTruthy();

    expect(dark.scene.skyTop).toBeTruthy();
    expect(dark.scene.fieldGrass).toBeTruthy();
    expect(dark.scene.throwLineStroke).toBeTruthy();
    expect(dark.meter.trackArc).toBeTruthy();
    expect(dark.wind.mastStroke).toBeTruthy();
  });

  it('uses distinct light and dark colors for core scene readability', () => {
    const light = getRenderPalette('light');
    const dark = getRenderPalette('dark');

    expect(dark.scene.skyTop).not.toBe(light.scene.skyTop);
    expect(dark.scene.fieldGrass).not.toBe(light.scene.fieldGrass);
    expect(dark.scene.distanceLabelFill).not.toBe(light.scene.distanceLabelFill);
    expect(dark.meter.valueTextFill).not.toBe(light.meter.valueTextFill);
    expect(dark.wind.labelFill).not.toBe(light.wind.labelFill);
  });
});
