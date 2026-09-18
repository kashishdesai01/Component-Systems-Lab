/** WCAG relative luminance for opaque six-digit sRGB colors. */
export function luminance(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex))
    throw new TypeError(`Expected opaque #rrggbb color; received ${hex}`);
  const channels = [1, 3, 5].map((offset) => {
    const value = parseInt(hex.slice(offset, offset + 2), 16) / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
}

export function contrastRatio(foreground, background) {
  const first = luminance(foreground);
  const second = luminance(background);
  return (Math.max(first, second) + 0.05) / (Math.min(first, second) + 0.05);
}

/** Intended rendered pairs only. Values assume opaque colors and normal text. */
export const contrastContracts = Object.freeze(
  [
    ...['surface', 'surfaceRaised'].flatMap((background) => [
      { foreground: 'text', background, minimum: 4.5, purpose: 'Body text' },
      { foreground: 'textMuted', background, minimum: 4.5, purpose: 'Supporting text' },
      { foreground: 'accent', background, minimum: 4.5, purpose: 'Links and selected labels' },
      { foreground: 'danger', background, minimum: 4.5, purpose: 'Error text' },
      { foreground: 'border', background, minimum: 3, purpose: 'Control boundaries' },
      { foreground: 'focus', background, minimum: 3, purpose: 'Offset focus outline' },
    ]),
    { foreground: 'onAccent', background: 'accent', minimum: 4.5, purpose: 'Primary action text' },
    {
      foreground: 'onAccent',
      background: 'accentHover',
      minimum: 4.5,
      purpose: 'Hovered primary action text',
    },
    {
      foreground: 'onDanger',
      background: 'danger',
      minimum: 4.5,
      purpose: 'Destructive action text',
    },
  ].map(Object.freeze),
);

/** Reports every failed pair without rounding ratios into passing results. */
export function auditContrast(themes, contracts = contrastContracts) {
  return Object.entries(themes).flatMap(([theme, tokens]) =>
    contracts.flatMap((contract) => {
      const foreground = tokens[contract.foreground];
      const background = tokens[contract.background];
      if (foreground === undefined || background === undefined)
        throw new TypeError(
          `Missing token in ${theme}: ${contract.foreground}/${contract.background}`,
        );
      const ratio = contrastRatio(foreground, background);
      return ratio < contract.minimum ? [{ theme, ...contract, ratio }] : [];
    }),
  );
}
