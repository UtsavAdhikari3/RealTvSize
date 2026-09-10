import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.beforeEach(async ({ page }) => {
	await page.route('**/googletagmanager.com/**', (route) => route.abort());
});

test('units synchronize without drifting physical state; typed inputs and sliders stay connected', async ({ page }) => {
	await page.goto('/en?units=imperial&viewing=9.4123456789&room=8.7654321');
	await expect(page.locator('[data-units]')).toHaveCount(4);
	const before = new URL(page.url()).searchParams;
	for (let i = 0; i < 5; i++) {
		await page.locator('[data-units]').first().selectOption('metric');
		for (const select of await page.locator('[data-units]').all()) await expect(select).toHaveValue('metric');
		await page.locator('[data-units]').last().selectOption('imperial');
	}
	expect(new URL(page.url()).searchParams.get('viewing')).toBe(before.get('viewing'));
	expect(new URL(page.url()).searchParams.get('room')).toBe(before.get('room'));
	const first = page.locator('[data-comparison] [data-number]').first();
	await first.fill('75');
	await expect(page.locator('#tv-a-input')).toHaveValue('75');
	await page.locator('#tv-a-input').focus();
	await page.keyboard.press('ArrowRight');
	await expect(first).toHaveValue('76');
	await page.locator('[data-units]').first().selectOption('metric');
	const couch = page.locator('[data-distance-simulator] [data-number]').last();
	await couch.fill('2.87');
	await expect(page.locator('#viewer-distance-output')).toHaveText('2.87 m');
	expect(Number(new URL(page.url()).searchParams.get('viewing'))).toBeCloseTo(2.87 / .3048, 12);
	await page.locator('[data-units]').first().selectOption('imperial');
	await page.locator('[data-units]').first().selectOption('metric');
	await expect(couch).toHaveValue('2.87');
	await expect(page.locator('[data-distance-simulator] [data-room-scene]')).toHaveAttribute('aria-label', /2.87 m/);
});

test('overlay uses one scale, center and bottom alignments, equal sizes, and either larger identity', async ({ page }) => {
	await page.goto('/en/compare?a=85&b=65');
	await page.getByRole('button', { name: 'Overlay', exact: true }).click();
	const a = page.locator('[data-overlay-tv="a"]'), b = page.locator('[data-overlay-tv="b"]');
	const box = async (rect: typeof a) => ({ y: Number(await rect.getAttribute('y')), h: Number(await rect.getAttribute('height')), w: Number(await rect.getAttribute('width')) });
	let av = await box(a), bv = await box(b);
	expect(av.y + av.h / 2).toBeCloseTo(bv.y + bv.h / 2, 10);
	expect(av.w / bv.w).toBeCloseTo(85 / 65, 10);
	await page.getByRole('button', { name: 'Bottom', exact: true }).click();
	av = await box(a); bv = await box(b);
	expect(av.y + av.h).toBeCloseTo(bv.y + bv.h, 10);
	await page.locator('[data-number]').last().fill('85');
	await expect(page.locator('[data-overlay-label="a"]')).toContainText('TV A · 85');
	await expect(page.locator('[data-overlay-label="b"]')).toContainText('TV B · 85');
	expect(await a.getAttribute('width')).toBe(await b.getAttribute('width'));
	await page.locator('[data-number]').first().fill('55');
	expect((await box(a)).w).toBeLessThan((await box(b)).w);
	await page.getByRole('button', { name: 'Side by side', exact: true }).click();
	await expect(page.locator('#tv-a-input')).toHaveValue('55');
	await expect(page.locator('#tv-b-input')).toHaveValue('85');
});

test('fit estimates, exact dimensions, width-only, overflow and invalid edits', async ({ page }) => {
	await page.goto('/en/will-it-fit?units=imperial');
	await expect(page.locator('[data-fit-results]')).toBeHidden();
	await page.locator('#fit-width').fill('60');
	await expect(page.locator('[data-fit-status]')).toContainText('Fits within');
	await expect(page.locator('[data-fit-scope]')).toContainText('Width-only');
	await expect(page.locator('[data-fit-largest]')).toHaveText('65 in');
	await page.locator('[data-fit-mode]').selectOption('exact');
	await expect(page.locator('[data-fit-results]')).toBeHidden();
	await page.locator('#fit-tvWidth').fill('58');
	await page.locator('#fit-tvHeight').fill('35');
	await page.locator('#fit-clearance').fill('1');
	await page.locator('#fit-height').fill('37');
	await expect(page.locator('[data-fit-horizontal]')).toHaveText('0.0 in');
	await expect(page.locator('[data-fit-vertical]')).toHaveText('0.0 in');
	await expect(page.locator('[data-largest-result]')).toBeHidden();
	await page.locator('#fit-height').fill('30');
	await expect(page.locator('[data-fit-status]')).toContainText('Does not fit');
	await expect(page.locator('[data-fit-overflow-y]')).toHaveText('7.0 in');
	await page.locator('#fit-clearance').fill('-1');
	await expect(page.locator('#fit-clearance')).toHaveAttribute('aria-invalid', 'true');
	await expect(page.locator('[data-fit-results]')).toBeHidden();
	await expect(page.locator('[data-copy]')).toBeDisabled();
	await page.locator('#fit-clearance').fill('0');
	await page.locator('[data-fit-mode]').selectOption('estimate');
	await page.locator('#fit-width').fill('10');
	await expect(page.locator('[data-fit-largest]')).toContainText('No supported');
});

test('cross-tool actions transfer only their selected diagonal and units', async ({ page }) => {
	await page.goto('/en?a=55&b=75&units=metric&room=10');
	const recommendation = await page.locator('#recommended-size-card').innerText();
	const recommendedLink = await page.locator('[data-size-recommender] [data-fit-link]').getAttribute('href');
	expect(new URL(recommendedLink!).searchParams.get('fit-size')).toBe(recommendation.split(' ')[0]);
	await page.locator('[data-fit-link="b"]').click();
	await expect(page).toHaveURL(/\/en\/will-it-fit\?/);
	await expect(page.locator('#fit-diagonal')).toHaveValue('75');
	await expect(page.locator('[data-units]')).toHaveValue('metric');
	await expect(page.locator('#fit-width')).toHaveValue('');
});

test('all calculators copy complete dedicated links including defaults, after success', async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async (value: string) => { (window as unknown as { copied: string }).copied = value; } } });
	});
	await page.goto('/en');
	const cases = [
		['[data-comparison]', '/en/compare', ['a', 'b', 'view', 'align']],
		['[data-distance-simulator]', '/en/viewing-distance', ['screen', 'viewing']],
		['[data-size-recommender]', '/en/find-my-tv-size', ['room', 'style']],
		['[data-fit]', '/en/will-it-fit', ['fit-size', 'fit-mode', 'fit-width', 'fit-height', 'fit-clearance', 'fit-tv-width', 'fit-tv-height']],
	] as const;
	for (const [selector, path, keys] of cases) {
		const root = page.locator(selector);
		await root.locator('[data-copy]').click();
		await expect(root.locator('[data-share-status]')).toHaveText('Setup link copied.');
		const copied = new URL(await page.evaluate(() => (window as unknown as { copied: string }).copied));
		expect(copied.pathname).toBe(path);
		for (const key of ['units', ...keys]) expect(copied.searchParams.has(key)).toBe(true);
	}
});

test('clipboard failure reveals a selectable link and shared units beat saved preference', async ({ page }) => {
	await page.addInitScript(() => {
		localStorage.setItem('realtvsize-units', 'imperial');
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: async () => { throw new Error('Denied'); } } });
	});
	await page.goto('/de/will-it-fit?units=metric&fit-mode=exact&fit-width=60&fit-tv-width=58&fit-tv-height=35&fit-clearance=1');
	await expect(page.locator('[data-units]')).toHaveValue('metric');
	await expect(page.locator('#fit-width')).toHaveValue('152,4');
	await page.locator('#fit-height').fill('93,98');
	await expect(page.locator('[data-fit-status]')).toContainText('Passt in');
	await page.locator('[data-copy]').click();
	await expect(page.locator('[data-share-status]')).toBeEmpty();
	const input = page.locator('[data-share-fallback] input');
	await expect(input).toBeVisible();
	await expect(input).toBeFocused();
	const url = await input.inputValue();
	await page.goto(url);
	await expect(page.locator('[data-units]')).toHaveValue('metric');
	await expect(page.locator('[data-fit-mode]')).toHaveValue('exact');
	await expect(page.locator('[data-fit-status]')).toContainText('Passt in');
	await page.locator('[data-language-select]').first().selectOption('/fr/will-it-fit');
	await expect(page.locator('[data-units]')).toHaveValue('metric');
	await expect(page.locator('[data-fit-mode]')).toHaveValue('exact');
	await expect(page.locator('#fit-width')).toHaveValue('152,4');
});

test('storage denial leaves tools and theme operational', async ({ page }) => {
	// Astro's development toolbar requires storage and is absent from production.
	await page.route('**/astro/runtime/client/dev-toolbar/entrypoint.js', (route) => route.abort());
	await page.addInitScript(() => { Object.defineProperty(window, 'localStorage', { get() { throw new Error('Storage denied'); } }); });
	const errors: string[] = [];
	page.on('pageerror', (error) => errors.push(error.message));
	await page.goto('/ja');
	await expect(page.locator('[data-units]').first()).toHaveValue('metric');
	await page.locator('[data-units]').last().selectOption('imperial');
	await expect(page.locator('[data-units]').first()).toHaveValue('imperial');
	await page.locator('#theme-toggle').click();
	await page.locator('#fit-width').fill('60');
	await expect(page.locator('[data-fit-results]')).toBeVisible();
	expect(errors).toEqual([]);
});

for (const lang of ['en', 'es', 'de', 'fr', 'ja']) {
	for (const theme of ['light', 'dark'] as const) {
		test(`${lang} ${theme}: narrow layout, accessible controls, metadata, and keyboard`, async ({ page }) => {
			await page.setViewportSize({ width: 360, height: 800 });
			await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
			const errors: string[] = [];
			page.on('pageerror', (error) => errors.push(error.message));
			await page.goto(`/${lang}?a=65&b=65&view=overlay&fit-width=60&fit-height=40&fit-clearance=1`);
			await expect(page.locator('[data-fit-results]')).toBeVisible();
			await expect(page.locator('[data-units]').first()).toHaveValue(lang === 'en' ? 'imperial' : 'metric');
			await page.locator('#fit-diagonal').focus();
			await page.keyboard.press('ArrowRight');
			await expect(page.locator('#fit-diagonal')).toHaveValue('66');
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
			const violations = (await new AxeBuilder({ page }).include('[data-comparison]').include('[data-fit]').include('[data-distance-simulator]').include('[data-size-recommender]').analyze()).violations;
			expect(violations.map((v) => ({ id: v.id, nodes: v.nodes.map((n) => n.target) }))).toEqual([]);
			await page.screenshot({ path: `test-results/${lang}-${theme}-mobile.png`, fullPage: true });
			await page.goto(`/${lang}/will-it-fit?fit-size=75&units=metric`);
			await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `https://realtvsize.com/${lang}/will-it-fit`);
			await expect(page.locator('link[rel="alternate"][hreflang]')).toHaveCount(6);
			expect(errors).toEqual([]);
		});
	}
}

test('sitemap contains all localized fit routes', async ({ request }) => {
	const response = await request.get('/sitemap.xml');
	const xml = await response.text();
	for (const lang of ['en', 'es', 'de', 'fr', 'ja']) expect(xml).toContain(`<loc>https://realtvsize.com/${lang}/will-it-fit</loc>`);
});

test('shared comparison, viewing, and recommendation settings restore over conflicting preference', async ({ page }) => {
	await page.addInitScript(() => localStorage.setItem('realtvsize-units', 'imperial'));
	await page.goto('/fr/compare?a=100&b=48&view=overlay&align=bottom&units=metric');
	await expect(page.locator('[data-units]')).toHaveValue('metric');
	await expect(page.locator('#tv-a-input')).toHaveValue('100');
	await expect(page.locator('[data-align="bottom"]')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('[data-overlay-stage]')).toBeVisible();
	await page.goto('/es/viewing-distance?screen=85&viewing=9.87654321&units=metric');
	await expect(page.locator('#distance-tv-size')).toHaveValue('85');
	await expect(page.locator('#viewer-distance-output')).toHaveText('3,01 m');
	expect(new URL(page.url()).searchParams.get('viewing')).toBe('9.87654321');
	await page.goto('/de/find-my-tv-size?room=12.123456789&style=relaxed&units=metric');
	await expect(page.locator('[data-recommendation-mode="relaxed"]')).toHaveAttribute('aria-pressed', 'true');
	await expect(page.locator('#room-distance-output')).toHaveText('3,70 m');
	expect(new URL(page.url()).searchParams.get('room')).toBe('12.123456789');
});

test('fit precision survives repeated units, and metric distance keyboard advances by .01 meters', async ({ page }) => {
	await page.goto('/en?units=metric&fit-mode=exact&fit-width=60.123456789&fit-height=40.123456789&fit-tv-width=58.7654321&fit-tv-height=35.7654321&fit-clearance=0.123456789&viewing=10');
	const before = new URL(page.url()).searchParams;
	for (let i = 0; i < 6; i++) {
		await page.locator('[data-units]').last().selectOption('imperial');
		await page.locator('[data-units]').last().selectOption('metric');
	}
	for (const key of ['fit-width', 'fit-height', 'fit-tv-width', 'fit-tv-height', 'fit-clearance']) expect(new URL(page.url()).searchParams.get(key)).toBe(before.get(key));
	await page.locator('[data-distance-simulator] [data-number]').last().fill('3.00');
	await page.locator('#viewer-distance').focus();
	await page.keyboard.press('ArrowRight');
	await expect(page.locator('#viewer-distance-output')).toHaveText('3.01 m');
	await page.goto('/en/compare');
	await expect(page.locator('[data-units]')).toHaveValue('metric');
});

test('copy feedback waits for clipboard completion', async ({ page }) => {
	await page.addInitScript(() => {
		Object.defineProperty(navigator, 'clipboard', { configurable: true, value: { writeText: () => new Promise<void>((resolve) => { (window as unknown as { finishCopy: () => void }).finishCopy = resolve; }) } });
	});
	await page.goto('/en/compare');
	await page.locator('[data-copy]').click();
	await expect(page.locator('[data-share-status]')).toBeEmpty();
	await page.evaluate(() => (window as unknown as { finishCopy: () => void }).finishCopy());
	await expect(page.locator('[data-share-status]')).toHaveText('Setup link copied.');
});

test('translated desktop navigation stays clear of the language control', async ({ page }) => {
	for (const width of [1024, 1280]) {
		await page.setViewportSize({ width, height: 850 });
		for (const lang of ['en', 'es', 'de', 'fr', 'ja']) {
			await page.goto(`/${lang}/will-it-fit`);
			const nav = page.locator('header nav');
			if (width === 1024) {
				await expect(nav).toBeHidden();
				await expect(page.locator('.mobile-navigation')).toBeVisible();
			} else {
				await expect(nav).toBeVisible();
				const navBox = (await nav.boundingBox())!;
				const languageBox = (await page.locator('[data-language-select]').first().boundingBox())!;
				expect(navBox.x + navBox.width).toBeLessThanOrEqual(languageBox.x);
			}
		}
	}
});
