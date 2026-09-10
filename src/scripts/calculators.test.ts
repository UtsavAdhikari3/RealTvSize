import { describe, expect, it } from 'vitest';
import { calculateFit, cmToInches, dimensions, feetToMeters, inchesToCm, metersToFeet, squareInchesToCm, type FitInput } from './tv-math';
import { parseLocaleNumber, parseStates, resolveUnits, serializeState, type Calculator } from './calculator-state';

const fit: FitInput = { mode: 'estimate', diagonal: 65, width: 60, height: null, clearance: 0, tvWidth: null, tvHeight: null };
describe('physical measurements', () => {
	it('converts lengths, distances, and areas in both directions', () => {
		expect(inchesToCm(10)).toBe(25.4);
		expect(cmToInches(25.4)).toBe(10);
		expect(feetToMeters(10)).toBe(3.048);
		expect(metersToFeet(3.048)).toBe(10);
		expect(squareInchesToCm(10)).toBeCloseTo(64.516, 10);
	});
	it('checks an exact boundary without rounding up the common size', () => {
		const d = dimensions(65);
		expect(calculateFit({ ...fit, width: d.width, height: d.height })).toMatchObject({ fits: true, largest: 65, horizontalRemaining: 0, verticalRemaining: 0 });
		expect(calculateFit({ ...fit, width: d.width - .00001 })?.largest).toBe(60);
	});
	it('supports width-only checks and positive clearance', () => {
		expect(calculateFit({ ...fit, width: 60, clearance: 1 })).toMatchObject({ fits: true, widthOnly: true, verticalRemaining: null });
	});
	it('reports space consumed by clearance, oversized TVs, and no supported size', () => {
		expect(calculateFit({ ...fit, width: 20, clearance: 10 })).toMatchObject({ fits: false, largest: null });
		expect(calculateFit({ ...fit, width: 20 })?.horizontalOverflow).toBeGreaterThan(30);
		expect(calculateFit({ ...fit, height: 5 })).toMatchObject({ fits: false, largest: null });
	});
	it('uses supplied dimensions only in exact mode', () => {
		expect(calculateFit({ ...fit, mode: 'exact', tvWidth: 58, tvHeight: 35, height: 37, clearance: 1 })).toMatchObject({ fits: true, largest: null, horizontalRemaining: 0, verticalRemaining: 0 });
		expect(calculateFit({ ...fit, mode: 'exact', tvWidth: 70, tvHeight: 35 })).toMatchObject({ fits: false, horizontalOverflow: 10, widthOnly: true });
		expect(calculateFit({ ...fit, mode: 'exact' })).toBeNull();
	});
	it.each([NaN, Infinity, -1, 0])('rejects invalid widths: %s', (width) => expect(calculateFit({ ...fit, width })).toBeNull());
	it('rejects invalid clearance, height, diagonal and exact measurements', () => {
		for (const change of [{ clearance: -1 }, { clearance: NaN }, { height: 0 }, { diagonal: 65.5 }, { diagonal: 116 }, { mode: 'exact' as const, tvWidth: Infinity, tvHeight: 35 }]) expect(calculateFit({ ...fit, ...change })).toBeNull();
	});
});
describe('calculator links and locale input', () => {
	it('preserves legacy inches and feet regardless of units', () => {
		const state = parseStates(new URLSearchParams('a=55&b=75&screen=85&viewing=9.4&room=12&style=immersive&units=metric'));
		expect(state.compare).toMatchObject({ a: 55, b: 75, view: 'side', align: 'center' });
		expect(state.viewingDistance).toEqual({ screen: 85, viewing: 9.4 });
		expect(state.findMyTvSize).toEqual({ room: 12, style: 'immersive' });
	});
	it('defaults missing or malformed URL fields', () => {
		const defaults = parseStates(new URLSearchParams());
		expect(parseStates(new URLSearchParams('a=Infinity&b=65.5&screen=-1&viewing=0&room=bad&style=cinema&fit-width=NaN&fit-height=-3&fit-clearance=-1&view=bad&align=bad&fit-size=1000&fit-mode=bad'))).toEqual(defaults);
	});
	it('round trips every default and exact full precision state while retaining other tools', () => {
		const states = parseStates(new URLSearchParams());
		states.compare = { a: 100, b: 32, view: 'overlay', align: 'bottom' };
		states.willItFit = { ...fit, mode: 'exact', width: cmToInches(152.3), height: 42.35, tvWidth: 55.25, tvHeight: 31.75, clearance: 1.123456789 };
		states.viewingDistance.viewing = metersToFeet(2.87);
		let params = new URLSearchParams('utm_source=test');
		for (const tool of Object.keys(states) as Calculator[]) params = serializeState(tool, states[tool], 'metric', params);
		expect(parseStates(params)).toEqual(states);
		expect(params.get('utm_source')).toBe('test');
		expect(params.get('units')).toBe('metric');
		expect(params.get('fit-width')).toBe(String(cmToInches(152.3)));
	});
	it('resolves explicit URL units ahead of preference and locale', () => {
		expect(resolveUnits('metric', 'imperial', 'en')).toBe('metric');
		expect(resolveUnits(undefined, 'imperial', 'ja')).toBe('imperial');
		expect(resolveUnits('bad', 'bad', 'en')).toBe('imperial');
		for (const lang of ['de', 'es', 'fr', 'ja']) expect(resolveUnits(null, null, lang)).toBe('metric');
	});
	it('accepts locale decimals without silently interpreting grouping or exponent input', () => {
		expect(parseLocaleNumber('12,5', 'de')).toBe(12.5);
		expect(parseLocaleNumber('12,5', 'fr')).toBe(12.5);
		expect(parseLocaleNumber('12.5', 'en')).toBe(12.5);
		for (const raw of ['', '1,000', 'NaN', 'Infinity', '1e3', '0x10', '-1']) expect(parseLocaleNumber(raw, 'en')).toBeNull();
	});
});
