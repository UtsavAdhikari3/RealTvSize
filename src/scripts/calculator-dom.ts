import { feetToMeters, format, inchesToCm, metersToFeet, squareInchesToCm, type Units } from './tv-math';
import { isUnits, parseLocaleNumber, resolveUnits, serializeState, type Calculator, type CalculatorStates } from './calculator-state';
import { localizedPath } from '../i18n/routes';
import type { Language } from '../i18n/config';
import type { Translation } from '../i18n/types';

let currentUnits: Units;
export const locale = () => document.documentElement.lang as Language;
export function getUnits() {
	if (!currentUnits) {
		let saved: string | null = null;
		try { saved = localStorage.getItem('realtvsize-units'); } catch { /* Private browsing may deny storage. */ }
		currentUnits = resolveUnits(new URLSearchParams(location.search).get('units'), saved, locale());
	}
	return currentUnits;
}
export function setUnits(units: Units) {
	currentUnits = units;
	try { localStorage.setItem('realtvsize-units', units); } catch { /* Tools work without persistence. */ }
	document.dispatchEvent(new Event('calculator-units'));
}
export const distanceUnit = () => getUnits() === 'metric' ? 'm' : 'ft';
export const lengthUnit = () => getUnits() === 'metric' ? 'cm' : 'in';
export const displayDistance = (feet: number) => getUnits() === 'metric' ? feetToMeters(feet) : feet;
export const length = (inches: number) => `${format(getUnits() === 'metric' ? inchesToCm(inches) : inches)} ${lengthUnit()}`;
export const distance = (feet: number) => `${format(displayDistance(feet), getUnits() === 'metric' ? 2 : 1)} ${distanceUnit()}`;
export const area = (inches: number) => `${format(getUnits() === 'metric' ? squareInchesToCm(inches) : inches, 0)} ${getUnits() === 'metric' ? 'cm²' : 'in²'}`;
export function text(root: Element, selector: string, value: string) { const el = root.querySelector(selector); if (el) el.textContent = value; }

export function fitLink(diagonal: number) {
	const url = new URL(localizedPath(locale(), 'willItFit'), location.origin);
	url.searchParams.set('fit-size', String(diagonal));
	url.searchParams.set('units', getUnits());
	return url.href;
}

export function setupCalculator<K extends Calculator>(root: HTMLElement, tool: K, state: CalculatorStates[K], render: () => void) {
	const t = JSON.parse(root.dataset.i18n!) as Translation;
	const refreshers: Array<() => void> = [];
	const select = root.querySelector<HTMLSelectElement>('[data-units]')!;
	const copy = root.querySelector<HTMLButtonElement>('[data-copy]')!;
	const fallback = root.querySelector<HTMLElement>('[data-share-fallback]')!;
	const link = fallback.querySelector<HTMLInputElement>('input')!;
	const feedback = root.querySelector<HTMLElement>('[data-share-status]')!;
	let revision = 0;
	const url = () => {
		const result = new URL(localizedPath(locale(), tool), location.origin);
		result.search = serializeState(tool, state, getUnits()).toString();
		return result.href;
	};
	function sync() {
		const result = new URL(location.href);
		result.search = serializeState(tool, state, getUnits(), result.searchParams).toString();
		history.replaceState({}, '', result);
	}
	function update() {
		revision++;
		feedback.textContent = '';
		fallback.hidden = true;
		refreshers.forEach((refresh) => refresh());
		render();
		copy.disabled = Boolean(root.querySelector('[aria-invalid="true"]'));
		if (!copy.disabled) sync();
	}
	select.value = getUnits();
	select.addEventListener('change', () => { if (isUnits(select.value)) setUnits(select.value); });
	document.addEventListener('calculator-units', () => { select.value = getUnits(); update(); });
	copy.addEventListener('click', async () => {
		const value = url();
		const copiedRevision = revision;
		feedback.textContent = '';
		fallback.hidden = true;
		try {
			await navigator.clipboard.writeText(value);
			if (copiedRevision === revision) feedback.textContent = t.tools.copied;
		} catch {
			if (copiedRevision !== revision) return;
			fallback.hidden = false;
			link.value = value;
			link.focus();
			link.select();
		}
	});
	return { update, refreshers, t };
}

export function bindRange(root: HTMLElement, id: string, kind: 'diagonal' | 'distance', get: () => number, set: (n: number) => void, update: () => void, invalid: string) {
	const slider = root.querySelector<HTMLInputElement>(`#${id}`)!;
	const control = slider.closest<HTMLElement>('.range-control')!;
	const entry = control.querySelector<HTMLInputElement>('[data-number]')!;
	const error = control.querySelector<HTMLElement>('[data-error]')!;
	const output = control.querySelector('output')!;
	const min = Number(slider.min), max = Number(slider.max);
	const display = (n: number) => kind === 'distance' ? displayDistance(n) : n;
	const physical = (n: number) => kind === 'distance' && getUnits() === 'metric' ? metersToFeet(n) : n;
	const digits = () => kind === 'diagonal' ? 0 : getUnits() === 'metric' ? 2 : 1;
	const unit = () => kind === 'diagonal' ? 'in' : distanceUnit();
	let invalidValue = false;
	function refresh() {
		const value = display(get());
		slider.min = String(display(min)); slider.max = String(display(max));
		slider.step = kind === 'diagonal' ? '1' : 'any';
		slider.value = String(value);
		slider.setAttribute('aria-valuetext', `${format(value, digits())} ${unit()}`);
		slider.style.setProperty('--range-progress', `${(get() - min) / (max - min) * 100}%`);
		if (!invalidValue) entry.value = new Intl.NumberFormat(locale(), { useGrouping: false, minimumFractionDigits: digits(), maximumFractionDigits: digits() }).format(value);
		entry.setAttribute('aria-label', `${slider.labels?.[0]?.textContent} (${unit()})`);
		output.textContent = `${format(value, digits())} ${unit()}`;
		text(control, '[data-number-unit]', unit());
		text(control, '[data-min]', `${format(display(min), digits())} ${unit()}`);
		text(control, '[data-max]', `${format(display(max), digits())} ${unit()}`);
	}
	function clearError() { invalidValue = false; entry.removeAttribute('aria-invalid'); error.hidden = true; }
	slider.addEventListener('input', () => {
		clearError();
		set(Math.max(min, Math.min(max, physical(Number(Number(slider.value).toFixed(digits()))))));
		update();
	});
	slider.addEventListener('keydown', (event) => {
		if (kind !== 'distance' || !['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(event.key)) return;
		event.preventDefault(); clearError();
		const direction = event.key === 'ArrowUp' || event.key === 'ArrowRight' ? 1 : -1;
		set(Math.max(min, Math.min(max, physical(Number((display(get()) + direction * 10 ** -digits()).toFixed(digits()))))));
		update();
	});
	entry.addEventListener('input', () => {
		const parsed = parseLocaleNumber(entry.value, locale());
		let value = parsed === null ? NaN : physical(parsed);
		// Rounded endpoint labels still select the original physical endpoints.
		if (parsed === Number(display(min).toFixed(digits()))) value = min;
		if (parsed === Number(display(max).toFixed(digits()))) value = max;
		invalidValue = !Number.isFinite(value) || value < min || value > max || (kind === 'diagonal' && !Number.isInteger(value));
		entry.setAttribute('aria-invalid', String(invalidValue));
		error.textContent = invalid; error.hidden = !invalidValue;
		if (!invalidValue) set(value);
		// Preserve the edit buffer (including a trailing decimal) while typing.
		const raw = entry.value; update(); entry.value = raw;
	});
	entry.addEventListener('blur', () => { if (!invalidValue) refresh(); });
	entry.addEventListener('keydown', (event) => {
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
		event.preventDefault(); clearError();
		const step = 10 ** -digits();
		set(Math.max(min, Math.min(max, physical(display(get()) + (event.key === 'ArrowUp' ? step : -step)))));
		update();
	});
	return refresh;
}
