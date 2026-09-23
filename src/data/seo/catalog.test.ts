import { describe, it, expect } from 'vitest';
import { comparisons, tvSizes } from '../catalog';
import { getSeoCopy, sizeContent, pairContent } from './index';
import { languages } from '../../i18n/config';
import { pagePaths, pageLanguages, localizedPath, canonicalUrlForRoute, type PageId } from '../../i18n/routes';
import { parseStates } from '../../scripts/calculator-state';
import { viewingDistance } from '../../scripts/tv-math';

describe('published catalog', () => {
 it('publishes exactly 191 canonical routes and preserves methodology availability', () => {
  const urls = (Object.keys(pagePaths) as PageId[]).flatMap(page => pageLanguages(page).map(lang => localizedPath(lang, page)));
  expect(urls).toHaveLength(191);
  expect(new Set(urls).size).toBe(191);
  expect(pageLanguages('methodology')).toEqual(['en']);
  expect(pageLanguages('55-vs-65')).toEqual(languages);
  expect(urls).not.toContain('/en/tv-sizes/58-inch');
  expect(urls).not.toContain('/en/compare/65-vs-55');
 });
 it('strips query, fragment and trailing slash from canonicals', () => {
  expect(canonicalUrlForRoute(new URL('https://preview.test/es/tv-sizes/55-inch/?screen=85#distance'), new URL('https://realtvsize.com')).href).toBe('https://realtvsize.com/es/tv-sizes/55-inch');
 });
 for (const lang of languages) it(`${lang}: complete, distinct editorial content with resolved measurements`, async () => {
  const copy = await getSeoCopy(lang);
  expect(Object.keys(copy.sizes)).toHaveLength(16);
  expect(Object.keys(copy.pairs)).toHaveLength(12);
  const entries = [...tvSizes.map(size => sizeContent(copy, size, lang)), ...comparisons.map(pair => pairContent(copy, pair, lang))];
  for (const field of ['title', 'description', 'intro', 'guidance'] as const) expect(new Set(entries.map(entry => entry[field])).size).toBe(28);
  for (const entry of entries) {
   expect(JSON.stringify(entry)).not.toMatch(/\{\w+\}/);
   expect(entry.faqs).toHaveLength(3);
   expect(entry.geometry.length).toBeGreaterThan(50);
  }
 });
});

describe('size-page initialization', () => {
 it.each(tvSizes)('%i inches keeps precise balanced distance and independent valid overrides', size => {
  const defaults = { screen: size, viewing: viewingDistance(size, 'balanced') };
  expect(defaults.viewing).toBeGreaterThanOrEqual(3);
  expect(defaults.viewing).toBeLessThanOrEqual(18);
  expect(parseStates(new URLSearchParams(), undefined, defaults).viewingDistance).toEqual(defaults);
  expect(parseStates(new URLSearchParams('screen=garbage&viewing=0'), undefined, defaults).viewingDistance).toEqual(defaults);
  expect(parseStates(new URLSearchParams('screen=100&viewing=8.123456789'), undefined, defaults).viewingDistance).toEqual({ screen: 100, viewing: 8.123456789 });
  expect(parseStates(new URLSearchParams('screen=58&viewing=NaN'), undefined, defaults).viewingDistance).toEqual({ screen: 58, viewing: defaults.viewing });
 });
 it('retains standalone defaults', () => expect(parseStates(new URLSearchParams()).viewingDistance).toEqual({ screen: 75, viewing: 9.4 }));
});
