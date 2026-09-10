import type { FitInput, Units } from './tv-math';

export type View = 'side' | 'overlay';
export type Alignment = 'center' | 'bottom';
export type Style = 'immersive' | 'balanced' | 'relaxed';
export interface ComparisonState { a: number; b: number; view: View; align: Alignment }
export interface DistanceState { screen: number; viewing: number }
export interface RecommendationState { room: number; style: Style }
export interface CalculatorStates { compare: ComparisonState; viewingDistance: DistanceState; findMyTvSize: RecommendationState; willItFit: FitInput }
export type Calculator = keyof CalculatorStates;

export function isUnits(value: unknown): value is Units { return value === 'imperial' || value === 'metric'; }
export function resolveUnits(explicit: unknown, saved: unknown, locale: string): Units {
	return isUnits(explicit) ? explicit : isUnits(saved) ? saved : locale === 'en' ? 'imperial' : 'metric';
}
function number(params: URLSearchParams, key: string, fallback: number | null, min: number, max = Infinity, integer = false) {
	const raw = params.get(key);
	if (!raw?.trim() || !/^(?:\d+\.?\d*|\.\d+)(?:e[+-]?\d+)?$/i.test(raw)) return fallback;
	const value = Number(raw);
	return Number.isFinite(value) && value >= min && value <= max && (!integer || Number.isInteger(value)) ? value : fallback;
}
function choice<T extends string>(params: URLSearchParams, key: string, choices: readonly T[], fallback: T): T {
	const value = params.get(key) as T;
	return choices.includes(value) ? value : fallback;
}
export function parseStates(params: URLSearchParams): CalculatorStates {
	return {
		compare: { a: number(params, 'a', 65, 32, 115, true)!, b: number(params, 'b', 85, 32, 115, true)!, view: choice(params, 'view', ['side', 'overlay'], 'side'), align: choice(params, 'align', ['center', 'bottom'], 'center') },
		viewingDistance: { screen: number(params, 'screen', 75, 32, 115, true)!, viewing: number(params, 'viewing', 9.4, 3, 18)! },
		findMyTvSize: { room: number(params, 'room', 9, 4, 18)!, style: choice(params, 'style', ['immersive', 'balanced', 'relaxed'], 'balanced') },
		willItFit: { mode: choice(params, 'fit-mode', ['estimate', 'exact'], 'estimate'), diagonal: number(params, 'fit-size', 65, 32, 115, true)!, width: number(params, 'fit-width', null, Number.MIN_VALUE), height: number(params, 'fit-height', null, Number.MIN_VALUE), clearance: number(params, 'fit-clearance', 0, 0)!, tvWidth: number(params, 'fit-tv-width', null, Number.MIN_VALUE), tvHeight: number(params, 'fit-tv-height', null, Number.MIN_VALUE) },
	};
}
const fitKeys: Record<keyof FitInput, string> = { mode: 'fit-mode', diagonal: 'fit-size', width: 'fit-width', height: 'fit-height', clearance: 'fit-clearance', tvWidth: 'fit-tv-width', tvHeight: 'fit-tv-height' };
export function serializeState<K extends Calculator>(tool: K, state: CalculatorStates[K], units: Units, existing = new URLSearchParams()) {
	const params = new URLSearchParams(existing);
	params.set('units', units);
	Object.entries(state).forEach(([key, value]) => params.set(tool === 'willItFit' ? fitKeys[key as keyof FitInput] : key, value === null ? '' : String(value)));
	return params;
}
export function parseLocaleNumber(raw: string, locale: string): number | null {
	const decimal = new Intl.NumberFormat(locale).formatToParts(1.1).find((part) => part.type === 'decimal')?.value ?? '.';
	const normalized = raw.trim().replace(decimal, '.');
	// Group separators are deliberately rejected to avoid ambiguous measurements.
	return /^(?:\d+\.?\d*|\.\d+)$/.test(normalized) && Number.isFinite(Number(normalized)) ? Number(normalized) : null;
}
