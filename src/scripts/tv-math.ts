const ASPECT_WIDTH = 16;
const ASPECT_HEIGHT = 9;
const ASPECT_DIAGONAL = Math.sqrt(ASPECT_WIDTH ** 2 + ASPECT_HEIGHT ** 2);

export const viewingMultipliers = {
	immersive: ASPECT_WIDTH / ASPECT_DIAGONAL / (2 * Math.tan((40 * Math.PI) / 360)),
	balanced: ASPECT_WIDTH / ASPECT_DIAGONAL / (2 * Math.tan((30 * Math.PI) / 360)),
	relaxed: ASPECT_WIDTH / ASPECT_DIAGONAL / (2 * Math.tan((25 * Math.PI) / 360)),
} as const;

export const commonTvSizes = [32, 40, 43, 48, 50, 55, 58, 60, 65, 70, 75, 77, 80, 83, 85, 86, 90, 98, 100, 115];

export function dimensions(diagonal: number) {
	const width = diagonal * (ASPECT_WIDTH / ASPECT_DIAGONAL);
	const height = diagonal * (ASPECT_HEIGHT / ASPECT_DIAGONAL);
	return { diagonal, width, height, area: width * height };
}

export function viewingDistance(diagonal: number, mode: keyof typeof viewingMultipliers) {
	return (diagonal * viewingMultipliers[mode]) / 12;
}

export function diagonalForDistance(distanceFeet: number, mode: keyof typeof viewingMultipliers) {
	return (distanceFeet * 12) / viewingMultipliers[mode];
}

export function horizontalFov(diagonal: number, distanceFeet: number) {
	const { width } = dimensions(diagonal);
	const distanceInches = distanceFeet * 12;
	return 2 * Math.atan(width / (2 * distanceInches)) * (180 / Math.PI);
}

export function apparentViewScale(diagonal: number, distanceFeet: number, viewingWindowDegrees = 60) {
	const fovRadians = horizontalFov(diagonal, distanceFeet) * (Math.PI / 180);
	const windowRadians = viewingWindowDegrees * (Math.PI / 180);
	return Math.tan(fovRadians / 2) / Math.tan(windowRadians / 2);
}

export function viewProfile(fov: number) {
	if (fov >= 45) {
		return { key: 'veryImmersive' as const };
	}

	if (fov >= 35) {
		return { key: 'immersive' as const };
	}

	if (fov >= 27.5) {
		return { key: 'balanced' as const };
	}

	if (fov >= 20) {
		return { key: 'relaxed' as const };
	}

	return { key: 'distant' as const };
}

export function nearestCommonSize(size: number) {
	return commonTvSizes.reduce((closest, candidate) =>
		Math.abs(candidate - size) < Math.abs(closest - size) ? candidate : closest,
	);
}

export function format(value: number, digits = 1, locale = typeof document === 'undefined' ? 'en' : document.documentElement.lang) {
	return new Intl.NumberFormat(locale, {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits,
	}).format(value);
}

export type Units = 'imperial' | 'metric';
export const inchesToCm = (value: number) => value * 2.54;
export const cmToInches = (value: number) => value / 2.54;
export const feetToMeters = (value: number) => value * 0.3048;
export const metersToFeet = (value: number) => value / 0.3048;
export const squareInchesToCm = (value: number) => value * 2.54 ** 2;

export interface FitInput {
	mode: 'estimate' | 'exact';
	diagonal: number;
	width: number | null;
	height: number | null;
	clearance: number;
	tvWidth: number | null;
	tvHeight: number | null;
}

export function calculateFit(input: FitInput) {
	const positive = (n: number | null): n is number => n !== null && Number.isFinite(n) && n > 0;
	if (!positive(input.width) || (input.height !== null && !positive(input.height)) ||
		!Number.isFinite(input.clearance) || input.clearance < 0 ||
		!Number.isInteger(input.diagonal) || input.diagonal < 32 || input.diagonal > 115 ||
		!['estimate', 'exact'].includes(input.mode)) return null;
	if (input.mode === 'exact' && (!positive(input.tvWidth) || !positive(input.tvHeight))) return null;
	const tv = input.mode === 'exact'
		? { width: input.tvWidth!, height: input.tvHeight! }
		: dimensions(input.diagonal);
	const availableWidth = input.width - 2 * input.clearance;
	const availableHeight = input.height === null ? null : input.height - 2 * input.clearance;
	const horizontalRemaining = availableWidth - tv.width;
	const verticalRemaining = availableHeight === null ? null : availableHeight - tv.height;
	// A tiny floating point tolerance preserves exact converted boundaries.
	const fits = horizontalRemaining >= -1e-10 && (verticalRemaining === null || verticalRemaining >= -1e-10);
	const largest = input.mode === 'exact' ? null : [...commonTvSizes].reverse().find((size) => {
		const d = dimensions(size);
		return d.width <= availableWidth + 1e-10 && (availableHeight === null || d.height <= availableHeight + 1e-10);
	}) ?? null;
	return { tv, fits, widthOnly: input.height === null, largest,
		horizontalRemaining: Math.abs(horizontalRemaining) < 1e-10 ? 0 : horizontalRemaining,
		verticalRemaining: verticalRemaining !== null && Math.abs(verticalRemaining) < 1e-10 ? 0 : verticalRemaining,
		horizontalOverflow: Math.max(0, -horizontalRemaining), verticalOverflow: Math.max(0, -(verticalRemaining ?? 0)) };
}

export function updateUrl(values: Record<string, string | number>) {
	const url = new URL(window.location.href);
	Object.entries(values).forEach(([key, value]) => url.searchParams.set(key, String(value)));
	history.replaceState({}, '', url);
}
