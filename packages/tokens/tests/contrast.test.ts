import { readFileSync } from 'node:fs';
// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { auditContrast, contrastContracts, contrastRatio, luminance } from '../src/contrast.mjs';

const themes = JSON.parse(
  readFileSync(new URL('../src/tokens.json', import.meta.url), 'utf8'),
) as Record<string, Record<string, string>>;

describe('WCAG sRGB contrast calculation', () => {
  it('matches independently known reference values', () => {
    expect(luminance('#000000')).toBe(0);
    expect(luminance('#ffffff')).toBe(1);
    expect(contrastRatio('#000000', '#ffffff')).toBe(21);
    expect(contrastRatio('#777777', '#ffffff')).toBeCloseTo(4.47808945, 7);
    expect(contrastRatio('#ff0000', '#ffffff')).toBeCloseTo(3.99847677, 7);
  });
  it('is symmetric and gives identical colors ratio one', () => {
    expect(contrastRatio('#123456', '#abcdef')).toBe(contrastRatio('#abcdef', '#123456'));
    expect(contrastRatio('#123456', '#123456')).toBe(1);
  });
  it('rejects colors whose alpha or format cannot satisfy the contract', () => {
    for (const invalid of ['#fff', '#ffffff80', 'transparent', 'rgb(0 0 0)', 'ffffff']) {
      expect(() => luminance(invalid)).toThrow(TypeError);
    }
  });
});

describe('semantic contrast contracts', () => {
  it('passes every allowed pair in every shipped theme', () => {
    expect(Object.keys(themes)).toEqual(['light', 'dark', 'high-contrast']);
    expect(auditContrast(themes)).toEqual([]);
  });
  it('fails an altered supporting text token and identifies the affected theme and surfaces', () => {
    const altered = structuredClone(themes);
    altered.light!.textMuted = '#aaaaaa';
    const failures = auditContrast(altered);
    expect(failures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          theme: 'light',
          foreground: 'textMuted',
          background: 'surface',
          minimum: 4.5,
        }),
        expect.objectContaining({
          theme: 'light',
          foreground: 'textMuted',
          background: 'surfaceRaised',
          minimum: 4.5,
        }),
      ]),
    );
    expect(failures).toHaveLength(2);
  });
  it('does not round a failing ratio into a pass', () => {
    expect(
      auditContrast({ sample: { text: '#777777', surface: '#ffffff' } }, [
        { foreground: 'text', background: 'surface', minimum: 4.5, purpose: 'Body text' },
      ]),
    ).toHaveLength(1);
  });
  it('fails loudly when a required token is absent', () => {
    expect(() => auditContrast({ sample: { text: '#000000' } })).toThrow('Missing token');
  });
  it('documents text and non-text thresholds separately', () => {
    expect(contrastContracts.find((pair) => pair.foreground === 'border')?.minimum).toBe(3);
    expect(contrastContracts.find((pair) => pair.foreground === 'textMuted')?.minimum).toBe(4.5);
  });
});
