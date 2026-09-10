import { dimensions, format } from './tv-math';
import { parseStates } from './calculator-state';
import { area, bindRange, fitLink, length, setupCalculator, text } from './calculator-dom';
import { interpolate } from '../i18n/types';

const root = document.querySelector<HTMLElement>('[data-comparison]');
if (root) {
	const state = parseStates(new URLSearchParams(location.search)).compare;
	const { t, update, refreshers } = setupCalculator(root, 'compare', state, render);
	refreshers.push(bindRange(root, 'tv-a-input', 'diagonal', () => state.a, (n) => state.a = n, update, t.tools.invalid));
	refreshers.push(bindRange(root, 'tv-b-input', 'diagonal', () => state.b, (n) => state.b = n, update, t.tools.invalid));
	function render() {
		const a = dimensions(state.a), b = dimensions(state.b), max = Math.max(state.a, state.b);
		const increase = (Math.max(a.area, b.area) / Math.min(a.area, b.area) - 1) * 100;
		root!.querySelector<HTMLElement>('.comparison-stage')!.hidden = state.view === 'overlay';
		root!.querySelector<HTMLElement>('[data-overlay-stage]')!.hidden = state.view !== 'overlay';
		root!.querySelector<HTMLElement>('[data-alignment]')!.hidden = state.view !== 'overlay';
		(['a', 'b'] as const).forEach((key) => {
			const size = state[key], name = key === 'a' ? t.comparison.tvA : t.comparison.tvB;
			const visual = root!.querySelector<HTMLElement>(`#tv-${key}-visual`)!;
			visual.style.setProperty('--tv-scale', String(size / max));
			visual.setAttribute('aria-label', interpolate(t.simulation.tvAria, { label: name, size }));
			text(root!, `#tv-${key}-size-badge`, `${name} · ${size} in`);
			text(root!, `#tv-${key}-width`, length(dimensions(size).width));
			text(root!, `[data-overlay-label="${key}"]`, `${name} · ${size} in · ${key === 'a' ? t.tools.solid : t.tools.dashed}`);
			const width = 760 * size / max, height = width * 9 / 16;
			const rect = root!.querySelector(`[data-overlay-tv="${key}"]`)!;
			rect.setAttribute('x', String(500 - width / 2));
			rect.setAttribute('y', String(state.align === 'center' ? 260 - height / 2 : 474 - height));
			rect.setAttribute('width', String(width)); rect.setAttribute('height', String(height));
			root!.querySelector<HTMLAnchorElement>(`[data-fit-link="${key}"]`)!.href = fitLink(size);
		});
		text(root!, '#diagonal-diff', `${format(Math.abs(state.a - state.b))} in`);
		text(root!, '#width-diff', length(Math.abs(a.width - b.width)));
		text(root!, '#height-diff', length(Math.abs(a.height - b.height)));
		text(root!, '#area-increase', `${format(increase)}%`);
		text(root!, '#area-diff', area(Math.abs(a.area - b.area)));
		text(root!, '#height-pair', `${length(a.height)} / ${length(b.height)}`);
		const announcement = interpolate(t.comparison.liveResult, { sizeA: state.a, sizeB: state.b, increase: format(increase) });
		text(root!, '#comparison-live', `${announcement} ${t.comparison.widthDifference}: ${length(Math.abs(a.width - b.width))}. ${t.tools[state.view]}. ${state.view === 'overlay' ? t.tools[state.align] : ''}`);
		root!.querySelector('[data-overlay-stage] svg')!.setAttribute('aria-label', `${announcement} ${t.tools[state.align]}`);
		root!.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.view === state.view)));
		root!.querySelectorAll<HTMLButtonElement>('[data-align]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.align === state.align)));
	}
	root.querySelectorAll<HTMLButtonElement>('[data-pair]').forEach((button) => button.addEventListener('click', () => {
		[state.a, state.b] = button.dataset.pair!.split(',').map(Number); update();
	}));
	root.querySelectorAll<HTMLButtonElement>('[data-view]').forEach((button) => button.addEventListener('click', () => { state.view = button.dataset.view as typeof state.view; update(); }));
	root.querySelectorAll<HTMLButtonElement>('[data-align]').forEach((button) => button.addEventListener('click', () => { state.align = button.dataset.align as typeof state.align; update(); }));
	update();
}
