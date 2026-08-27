import { apparentViewScale, format, horizontalFov, viewProfile } from './tv-math';
import { interpolate, type Translation } from '../i18n/types';

export type SimulationTranslations = Pick<Translation, 'common' | 'profiles' | 'simulation'>;

const activeAnimations = new WeakMap<Element, number>();

export function cancelAnimation(owner: Element) {
	const activeAnimation = activeAnimations.get(owner);
	if (activeAnimation) cancelAnimationFrame(activeAnimation);
	activeAnimations.delete(owner);
}

function easeOutCubic(value: number) {
	return 1 - (1 - value) ** 3;
}

export function animateValue(
	owner: Element,
	from: number,
	to: number,
	onFrame: (value: number) => void,
	onComplete?: () => void,
	duration = 380,
) {
	cancelAnimation(owner);

	if (matchMedia('(prefers-reduced-motion: reduce)').matches || Math.abs(from - to) < 0.01) {
		onFrame(to);
		onComplete?.();
		return;
	}

	const startedAt = performance.now();
	const frame = (now: number) => {
		const progress = Math.min(1, (now - startedAt) / duration);
		onFrame(from + (to - from) * easeOutCubic(progress));
		if (progress < 1) {
			activeAnimations.set(owner, requestAnimationFrame(frame));
		} else {
			activeAnimations.delete(owner);
			onComplete?.();
		}
	};

	activeAnimations.set(owner, requestAnimationFrame(frame));
}

export function animateRangeInput(
	input: HTMLInputElement,
	target: number,
	onFrame: (complete: boolean) => void,
) {
	const start = Number(input.value);
	animateValue(
		input,
		start,
		target,
		(value) => {
			input.value = value.toFixed(1);
			onFrame(false);
		},
		() => {
			input.value = target.toFixed(1);
			onFrame(true);
		},
	);
}

export function updateSimulationVisuals(
	room: HTMLElement,
	pov: HTMLElement,
	tvSize: number,
	distance: number,
	minDistance: number,
	t: SimulationTranslations,
	maxDistance = 18,
) {
	const fov = horizontalFov(tvSize, distance);
	const profile = t.profiles[viewProfile(fov).key];
	const tvScale = tvSize / 115;
	const progress = Math.max(0, Math.min(1, (distance - minDistance) / (maxDistance - minDistance)));
	const distanceScale = 0.38 + progress * 0.62;
	const couchShift = -64 + progress * 64;
	const couchScale = 0.9 + progress * 0.1;
	const viewerY = 418 + progress * 72;
	const baseTvSpan = matchMedia('(max-width: 640px)').matches ? 660 : 480;
	const tvSpan = baseTvSpan * tvScale;
	const tvCenterY = 290 - ((baseTvSpan * 9) / 16 * tvScale) / 2;
	const leftEdge = 500 - tvSpan / 2;
	const rightEdge = 500 + tvSpan / 2;

	const tvVisual = room.querySelector<HTMLElement>('[data-tv-visual]')!;
	const track = room.querySelector<HTMLElement>('[data-distance-track]')!;
	const couch = room.querySelector<HTMLElement>('[data-couch]')!;
	const distanceReadout = room.querySelector<HTMLElement>('[data-distance-readout]')!;
	const cone = room.querySelector<SVGPolygonElement>('[data-fov-cone]')!;
	const leftRay = room.querySelector<SVGLineElement>('[data-fov-left]')!;
	const rightRay = room.querySelector<SVGLineElement>('[data-fov-right]')!;
	const origin = room.querySelector<SVGCircleElement>('[data-fov-origin]')!;
	const fovReadout = room.querySelector<HTMLElement>('[data-fov-readout]')!;
	const roomFov = room.querySelector<HTMLElement>('[data-room-fov]')!;
	const roomProfile = room.querySelector<HTMLElement>('[data-room-profile]')!;

	tvVisual.style.setProperty('--tv-scale', String(tvScale));
	tvVisual.setAttribute('aria-label', interpolate(t.simulation.tvAria, { label: t.simulation.simulatedTv, size: tvSize }));
	track.style.setProperty('--distance-scale', String(distanceScale));
	couch.style.setProperty('--couch-y', `${couchShift}%`);
	couch.style.setProperty('--couch-scale', String(couchScale));
	distanceReadout.textContent = `${format(distance)}\u00a0${t.common.feetShort}`;
	cone.setAttribute('points', `500,${viewerY} ${leftEdge},${tvCenterY} ${rightEdge},${tvCenterY}`);
	leftRay.setAttribute('x1', '500');
	leftRay.setAttribute('y1', String(viewerY));
	leftRay.setAttribute('x2', String(leftEdge));
	leftRay.setAttribute('y2', String(tvCenterY));
	rightRay.setAttribute('x1', '500');
	rightRay.setAttribute('y1', String(viewerY));
	rightRay.setAttribute('x2', String(rightEdge));
	rightRay.setAttribute('y2', String(tvCenterY));
	origin.setAttribute('cy', String(viewerY));
	fovReadout.style.setProperty('--fov-label-y', `${(viewerY / 620) * 100}%`);
	roomFov.textContent = interpolate(t.simulation.fieldOfView, { fov: format(fov, 0) });
	roomProfile.textContent = profile.label;
	room.setAttribute('aria-label', interpolate(t.simulation.roomAria, {
		size: tvSize,
		distance: format(distance),
		fov: format(fov, 0),
	}));

	const povTv = pov.querySelector<HTMLElement>('[data-pov-tv] [data-tv-visual]')!;
	const povDistance = pov.querySelector<HTMLElement>('[data-pov-distance]')!;
	const povFov = pov.querySelector<HTMLElement>('[data-pov-fov]')!;
	const povProfile = pov.querySelector<HTMLElement>('[data-pov-profile]')!;
	const povMessage = pov.querySelector<HTMLElement>('[data-pov-message]')!;
	povTv.style.setProperty('--tv-scale', String(apparentViewScale(tvSize, distance)));
	povTv.setAttribute('aria-label', interpolate(t.simulation.tvAria, { label: t.simulation.viewpointTv, size: tvSize }));
	povDistance.textContent = `${format(distance)}\u00a0${t.common.feetShort}`;
	povFov.textContent = interpolate(t.simulation.fieldOfView, { fov: format(fov, 0) });
	povProfile.textContent = profile.label;
	povMessage.textContent = profile.message;
	pov.setAttribute('aria-label', interpolate(t.simulation.povAria, {
		size: tvSize,
		distance: format(distance),
		fov: format(fov, 0),
	}));

	return { fov, profile };
}
