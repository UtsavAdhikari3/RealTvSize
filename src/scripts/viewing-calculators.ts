import { diagonalForDistance, format, nearestCommonSize, viewingDistance } from './tv-math';
import { parseStates, type Style } from './calculator-state';
import { bindRange, displayDistance, distance, distanceUnit, fitLink, getUnits, setupCalculator, text } from './calculator-dom';
import { updateSimulationVisuals } from './simulation-dom';
import { interpolate } from '../i18n/types';

const modes: Style[] = ['immersive', 'balanced', 'relaxed'];
const simulator = document.querySelector<HTMLElement>('[data-distance-simulator]');
if (simulator) {
	const root = simulator;
	const state = parseStates(new URLSearchParams(location.search), undefined, { screen: Number(root.dataset.initialScreen) || 75, viewing: Number(root.dataset.initialDistance) || 9.4 }).viewingDistance;
	const { t, update, refreshers } = setupCalculator(root, 'viewingDistance', state, render);
	refreshers.push(bindRange(root, 'distance-tv-size', 'diagonal', () => state.screen, (n) => state.screen = n, update, t.tools.invalid));
	refreshers.push(bindRange(root, 'viewer-distance', 'distance', () => state.viewing, (n) => state.viewing = n, update, t.tools.invalid));
	function render() {
		const { fov, profile } = updateSimulationVisuals(root.querySelector('[data-room-scene]')!, root.querySelector('[data-viewer-pov]')!, state.screen, state.viewing, 3, t);
		const closest = modes.reduce((best, mode) => Math.abs(viewingDistance(state.screen, mode) - state.viewing) < Math.abs(viewingDistance(state.screen, best) - state.viewing) ? mode : best, 'balanced');
		modes.forEach((mode) => {
			text(root, `#${mode}-distance`, distance(viewingDistance(state.screen, mode)));
			text(root, `#${mode}-result`, distance(viewingDistance(state.screen, mode)));
		});
		text(root, '#distance-feel', interpolate(t.viewingDistance.feel, { profile: profile.label, fov: format(fov, 0) }));
		text(root, '#distance-live', interpolate(t.tools.simulation, { size: state.screen, distance: format(displayDistance(state.viewing), getUnits() === 'metric' ? 2 : 1), unit: distanceUnit(), fov: format(fov, 0), message: profile.message }));
		root.querySelectorAll<HTMLButtonElement>('[data-position]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.position === closest)));
	}
	root.querySelectorAll<HTMLButtonElement>('[data-position]').forEach((button) => button.addEventListener('click', () => {
		state.viewing = Math.max(3, Math.min(18, viewingDistance(state.screen, button.dataset.position as Style))); update();
	}));
	window.addEventListener('resize', render, { passive: true });
	update();
}
const recommender = document.querySelector<HTMLElement>('[data-size-recommender]');
if (recommender) {
	const root = recommender;
	const state = parseStates(new URLSearchParams(location.search)).findMyTvSize;
	const { t, update, refreshers } = setupCalculator(root, 'findMyTvSize', state, render);
	refreshers.push(bindRange(root, 'room-distance', 'distance', () => state.room, (n) => state.room = n, update, t.tools.invalid));
	function render() {
		const recommendations = modes.map((mode) => nearestCommonSize(diagonalForDistance(state.room, mode)));
		const size = nearestCommonSize(diagonalForDistance(state.room, state.style));
		const { fov, profile } = updateSimulationVisuals(root.querySelector('[data-room-scene]')!, root.querySelector('[data-viewer-pov]')!, size, state.room, 4, t);
		text(root, '#recommended-distance-hero', format(displayDistance(state.room), getUnits() === 'metric' ? 2 : 1));
		text(root, '[data-from-tv]', interpolate(t.tools.fromTv, { unit: distanceUnit() }));
		modes.forEach((mode, i) => {
			text(root, `#${mode}-size-button`, `${recommendations[i]} in`);
			text(root, `#${mode}-size-result`, `${recommendations[i]} in`);
		});
		text(root, '#recommended-size', String(size));
		text(root, '#recommended-size-card', `${size} in`);
		text(root, '#size-range', `${Math.min(...recommendations)}–${Math.max(...recommendations)} in`);
		text(root, '#recommended-mode-label', interpolate(t.recommender.modeLabel, { mode: t.profiles[state.style].label, fov: format(fov, 0) }));
		text(root, '#recommendation-live', `${t.recommender.recommendedSize}: ${interpolate(t.tools.simulation, { size, distance: format(displayDistance(state.room), getUnits() === 'metric' ? 2 : 1), unit: distanceUnit(), fov: format(fov, 0), message: t.profiles[state.style].label + '. ' + profile.message })}`);
		root.querySelector<HTMLAnchorElement>('[data-fit-link]')!.href = fitLink(size);
		root.querySelectorAll<HTMLButtonElement>('[data-recommendation-mode]').forEach((button) => button.setAttribute('aria-pressed', String(button.dataset.recommendationMode === state.style)));
	}
	root.querySelectorAll<HTMLButtonElement>('[data-recommendation-mode]').forEach((button) => button.addEventListener('click', () => { state.style = button.dataset.recommendationMode as Style; update(); }));
	window.addEventListener('resize', render, { passive: true });
	update();
}
