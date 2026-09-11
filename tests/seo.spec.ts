import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pairs = [[55, 65], [65, 75], [75, 85], [55, 75], [65, 85]];
const origin = 'https://realtvsize.com';

test.beforeEach(async ({ page }) => {
	await page.route('**/googletagmanager.com/**', (route) => route.abort());
});

test('sitemap pages have unique metadata within each language, one H1 and reciprocal hreflang', async ({ request }) => {
	const sitemap = await (await request.get('/sitemap.xml')).text();
	const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => match[1]);
	expect(urls).toHaveLength(51);
	const pages = new Map<string, string>();
	for (const url of urls) {
		const response = await request.get(new URL(url).pathname);
		expect(response.status(), url).toBe(200);
		pages.set(url, await response.text());
	}
	const titles = new Set<string>(), descriptions = new Set<string>();
	for (const [url, html] of pages) {
		const title = html.match(/<title>(.*?)<\/title>/s)?.[1];
		const description = html.match(/<meta name="description" content="([^"]+)"/s)?.[1];
		const language = new URL(url).pathname.split('/')[1];
		const titleKey = `${language}:${title}`, descriptionKey = `${language}:${description}`;
		expect(title, url).toBeTruthy();
		expect(description, url).toBeTruthy();
		expect(titles.has(titleKey), `Duplicate title: ${url}`).toBe(false);
		expect(descriptions.has(descriptionKey), `Duplicate description: ${url}`).toBe(false);
		titles.add(titleKey); descriptions.add(descriptionKey);
		expect([...html.matchAll(/<h1(?:\s|>)/g)], url).toHaveLength(1);
		expect(html, url).toContain(`rel="canonical" href="${url}"`);
		const alternates = [...html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)];
		expect(alternates.length, url).toBeGreaterThan(1);
		for (const [, lang, href] of alternates) {
			expect(pages.has(href), `${url} advertises missing ${lang}: ${href}`).toBe(true);
			expect(pages.get(href)).toContain(`href="${url}"`);
		}
		for (const [, rawHref] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
			const href = new URL(rawHref.replaceAll('&amp;', '&'), url);
			if (href.origin === origin) expect(pages.has(`${origin}${href.pathname}`), `Broken internal link from ${url}: ${href}`).toBe(true);
		}
		for (const [, json] of html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)) {
			expect(JSON.parse(json)['@context']).toBe('https://schema.org');
		}
	}
	for (const [a, b] of pairs) expect(urls).toContain(`${origin}/en/compare/${a}-vs-${b}`);
	expect(urls).toContain(`${origin}/en/methodology`);
});

for (const [a, b] of pairs) {
	test(`${a} vs ${b} presets survive initialization and reload while controls remain editable`, async ({ page }) => {
		const path = `/en/compare/${a}-vs-${b}`;
		await page.goto(path);
		await expect(page.locator('#tv-a-input')).toHaveValue(String(a));
		await expect(page.locator('#tv-b-input')).toHaveValue(String(b));
		await expect(page.locator('main h1')).toHaveText(`${a} vs ${b} Inch TV Size Comparison`);
		await expect(page.locator('#area-increase')).toHaveText(`${((b * b / (a * a) - 1) * 100).toFixed(1)}%`);
		await page.reload();
		await expect(page.locator('#tv-a-input')).toHaveValue(String(a));
		await page.getByRole('button', { name: 'Overlay', exact: true }).click();
		const widthA = Number(await page.locator('[data-overlay-tv="a"]').getAttribute('width'));
		const widthB = Number(await page.locator('[data-overlay-tv="b"]').getAttribute('width'));
		expect(widthA / widthB).toBeCloseTo(a / b, 10);
		await page.locator('[data-number]').first().fill('50');
		await expect(page.locator('#tv-a-input')).toHaveValue('50');
		await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${origin}${path}`);
		await expect(page.locator('[data-fit-link="a"]')).toHaveAttribute('href', /\/en\/will-it-fit\?fit-size=50/);
		await expect(page.locator('caption')).toContainText(`Fixed reference for ${a} and ${b} inches`);
		await page.goto(`${path}?a=invalid&b=75&units=metric`);
		await expect(page.locator('#tv-a-input')).toHaveValue(String(a));
		await expect(page.locator('#tv-b-input')).toHaveValue('75');
	});
}

test.describe('content without JavaScript', () => {
	test.use({ javaScriptEnabled: false });
	test('comparison dimensions and defaults are already present in HTML', async ({ page }) => {
		for (const [a, b] of pairs) {
			await page.goto(`/en/compare/${a}-vs-${b}`);
			await expect(page.locator('#tv-a-input')).toHaveValue(String(a));
			await expect(page.locator('#tv-b-input')).toHaveValue(String(b));
			await expect(page.locator('#tv-a-size-badge')).toContainText(String(a));
			await expect(page.locator('#tv-b-size-badge')).toContainText(String(b));
			await expect(page.getByRole('table')).toContainText('Screen area');
			await expect(page.getByRole('link', { name: 'main TV size comparison calculator' })).toHaveAttribute('href', '/en/compare');
			await expect(page.locator('link[hreflang]')).toHaveCount(2);
		}
		await page.goto('/en/compare');
		const words = (await page.locator('.guide-body').innerText()).trim().split(/\s+/).length;
		expect(words).toBeGreaterThanOrEqual(300);
		expect(words).toBeLessThanOrEqual(600);
	});
});

test('new content remains accessible and fits mobile and desktop widths', async ({ page }, testInfo) => {
	for (const width of [375, 1280]) {
		await page.setViewportSize({ width, height: 900 });
		for (const path of ['/en/compare/55-vs-65', '/en/methodology', '/en/viewing-distance']) {
			await page.goto(path);
			expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true);
			expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
			await page.screenshot({ path: testInfo.outputPath(`${path.split('/').pop()}-${width}.png`), fullPage: true, style: 'astro-dev-toolbar { display: none; }' });
		}
	}
});
