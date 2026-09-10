import { calculateFit, cmToInches, inchesToCm } from './tv-math';
import { parseLocaleNumber, parseStates } from './calculator-state';
import { bindRange, getUnits, length, lengthUnit, locale, setupCalculator, text } from './calculator-dom';

const element = document.querySelector<HTMLElement>('[data-fit]');
if (element) {
	const root = element;
	const state = parseStates(new URLSearchParams(location.search)).willItFit;
	const { t, update, refreshers } = setupCalculator(root, 'willItFit', state, render);
	const mode = root.querySelector<HTMLSelectElement>('[data-fit-mode]')!;
	type Field = 'width' | 'height' | 'clearance' | 'tvWidth' | 'tvHeight';
	const fields = root.querySelectorAll<HTMLInputElement>('[data-fit-field]');
	const invalid = new Set<Field>();
	refreshers.push(bindRange(root, 'fit-diagonal', 'diagonal', () => state.diagonal, (n) => state.diagonal = n, update, t.tools.invalid));
	refreshers.push(() => {
		mode.value = state.mode;
		root.querySelector<HTMLElement>('[data-exact-fields]')!.hidden = state.mode !== 'exact';
		root.querySelectorAll('[data-length-unit]').forEach((el) => el.textContent = lengthUnit());
		fields.forEach((input) => {
			const key = input.dataset.fitField as Field;
			const active = state.mode === 'exact' || (key !== 'tvWidth' && key !== 'tvHeight');
			input.disabled = !active;
			const requiredExact = active && (key === 'tvWidth' || key === 'tvHeight') && state[key] === null;
			const error = active && (invalid.has(key) || requiredExact);
			input.setAttribute('aria-invalid', String(error));
			const errorEl = root.querySelector<HTMLElement>(`[data-fit-error="${key}"]`)!;
			errorEl.textContent = t.tools.fitInvalid;
			errorEl.hidden = !error;
			if (!invalid.has(key)) {
				const value = state[key];
				input.value = value === null ? '' : new Intl.NumberFormat(locale(), { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(getUnits() === 'metric' ? inchesToCm(value) : value);
			}
		});
	});
	fields.forEach((input) => input.addEventListener('input', () => {
		const key = input.dataset.fitField as Field;
		const raw = input.value;
		const parsed = parseLocaleNumber(raw, locale());
		const optionalBlank = key === 'height' && raw.trim() === '';
		const valid = optionalBlank || (parsed !== null && (key === 'clearance' ? parsed >= 0 : parsed > 0));
		if (valid) invalid.delete(key); else invalid.add(key);
		if (valid) {
			const value = parsed === null ? null : getUnits() === 'metric' ? cmToInches(parsed) : parsed;
			if (key === 'clearance') state.clearance = value!;
			else state[key] = value;
		}
		update(); input.value = raw;
	}));
	fields.forEach((input) => input.addEventListener('keydown', (event) => {
		if (event.key !== 'ArrowUp' && event.key !== 'ArrowDown') return;
		event.preventDefault();
		const current = parseLocaleNumber(input.value, locale()) ?? 0;
		const value = Math.max(input.dataset.fitField === 'clearance' ? 0 : .1, current + (event.key === 'ArrowUp' ? .1 : -.1));
		input.value = new Intl.NumberFormat(locale(), { useGrouping: false, minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
		input.dispatchEvent(new Event('input'));
	}));
	mode.addEventListener('change', () => { state.mode = mode.value as typeof state.mode; update(); });
	function render() {
		const result = root.querySelector('[aria-invalid="true"]') ? null : calculateFit(state);
		root.querySelector<HTMLElement>('[data-fit-results]')!.hidden = result === null;
		if (!result) {
			const message = root.querySelector('[aria-invalid="true"]') ? t.tools.fitInvalid : t.tools.blank;
			text(root, '[data-fit-status]', message);
			text(root, '[data-fit-live]', message);
			return;
		}
		const status = result.fits ? t.tools.fits : t.tools.noFit;
		const scope = result.widthOnly ? t.tools.widthOnly : t.tools.fullCheck;
		text(root, '[data-fit-scope]', scope);
		text(root, '[data-fit-dimensions]', `${length(result.tv.width)} × ${length(result.tv.height)}`);
		text(root, '[data-fit-horizontal]', length(Math.max(0, result.horizontalRemaining)));
		text(root, '[data-fit-vertical]', length(Math.max(0, result.verticalRemaining ?? 0)));
		text(root, '[data-fit-overflow-x]', length(result.horizontalOverflow));
		text(root, '[data-fit-overflow-y]', length(result.verticalOverflow));
		text(root, '[data-fit-largest]', result.largest === null ? t.tools.none : `${result.largest} in`);
		root.querySelector<HTMLElement>('[data-largest-result]')!.hidden = state.mode === 'exact';
		root.querySelectorAll<HTMLElement>('[data-height-result]').forEach((el) => el.hidden = result.widthOnly);
		text(root, '[data-fit-status]', status);
		text(root, '[data-fit-live]', `${status}. ${scope} ${t.tools.horizontal}: ${length(Math.max(0, result.horizontalRemaining))}. ${t.tools.overflowX}: ${length(result.horizontalOverflow)}${result.widthOnly ? '' : `. ${t.tools.vertical}: ${length(Math.max(0, result.verticalRemaining!))}. ${t.tools.overflowY}: ${length(result.verticalOverflow)}`}`);
		const width = state.width!, height = state.height ?? result.tv.height + 2 * state.clearance;
		const extentWidth = Math.max(width, result.tv.width + 2 * state.clearance);
		const extentHeight = Math.max(height, result.tv.height + 2 * state.clearance);
		const scale = Math.min(700 / extentWidth, 340 / extentHeight);
		function rect(selector: string, w: number, h: number) {
			const el = root.querySelector(selector)!;
			el.setAttribute('x', String(400 - w * scale / 2)); el.setAttribute('y', String(220 - h * scale / 2));
			el.setAttribute('width', String(w * scale)); el.setAttribute('height', String(h * scale));
		}
		rect('[data-space-rect]', width, height);
		rect('[data-clearance-rect]', result.tv.width + 2 * state.clearance, result.tv.height + 2 * state.clearance);
		rect('[data-tv-rect]', result.tv.width, result.tv.height);
		root.querySelector('[data-space-rect]')!.setAttribute('visibility', result.widthOnly ? 'hidden' : 'visible');
		root.querySelector('[data-width-guides]')!.setAttribute('d', result.widthOnly ? `M${400 - width * scale / 2},35 V405 M${400 + width * scale / 2},35 V405` : '');
		root.querySelector('[data-fit-diagram]')!.setAttribute('aria-label', `${status}. ${scope} ${t.tools.space}: ${length(width)}${state.height === null ? '' : ' × ' + length(height)}. ${t.tools.dimensions}: ${length(result.tv.width)} × ${length(result.tv.height)}. ${t.tools.clearance}: ${length(state.clearance)}.`);
	}
	update();
}
