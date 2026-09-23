import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { tvSizes, comparisons } from '../src/data/catalog';
import { viewingDistance } from '../src/scripts/tv-math';

const languages = ['en', 'es', 'de', 'fr', 'ja'];
test.beforeEach(async ({ page }) => {
 await page.route('**/googletagmanager.com/**', route => route.abort());
});
for (const lang of languages) {
 test(`${lang}: size preset, override, reload, units, language and fit`, async ({ page }) => {
  await page.goto(`/${lang}/tv-sizes/55-inch`);
  await expect(page.locator('#distance-tv-size')).toHaveValue('55');
  expect(Number(new URL(page.url()).searchParams.get('viewing'))).toBeCloseTo(viewingDistance(55, 'balanced'), 12);
  const reference = await page.locator('[data-editorial-reference]').innerText();
  await page.locator('[data-distance-simulator] [data-number]').first().fill('83');
  await expect(page.locator('#distance-tv-size')).toHaveValue('83');
  await page.locator('[data-units]').selectOption('imperial');
  await page.locator('[data-units]').selectOption('metric');
  await expect(page.locator('#distance-tv-size')).toHaveValue('83');
  await expect(page.locator('[data-editorial-reference]')).toHaveText(reference, { useInnerText: true });
  await page.reload();
  await expect(page.locator('#distance-tv-size')).toHaveValue('83');
  await page.locator('[data-language-select]').first().selectOption('/fr/tv-sizes/55-inch');
  await expect(page.locator('#distance-tv-size')).toHaveValue('83');
  await expect(page.locator('[data-units]')).toHaveValue('metric');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://realtvsize.com/fr/tv-sizes/55-inch');
  await page.locator('[data-reference-fit]').click();
  await expect(page.locator('#fit-diagonal')).toHaveValue('55');
  await page.goto(`/${lang}/tv-sizes/55-inch?screen=bad&viewing=-2`);
  await expect(page.locator('#distance-tv-size')).toHaveValue('55');
  expect(Number(new URL(page.url()).searchParams.get('viewing'))).toBeCloseTo(viewingDistance(55, 'balanced'), 12);
  await page.goto(`/${lang}/tv-sizes/55-inch?screen=98&viewing=12.123456789&units=metric`);
  await expect(page.locator('#distance-tv-size')).toHaveValue('98');
  expect(new URL(page.url()).searchParams.get('viewing')).toBe('12.123456789');
 });
 test(`${lang}: comparison presets and static references survive edits`, async ({ page }) => {
  await page.goto(`/${lang}/compare/75-vs-77`);
  await expect(page.locator('#tv-a-input')).toHaveValue('75');
  await expect(page.locator('#tv-b-input')).toHaveValue('77');
  const reference = await page.locator('[data-editorial-reference]').innerText();
  await page.locator('[data-number]').first().fill('50');
  await page.locator('[data-units]').selectOption('metric');
  await page.reload();
  await expect(page.locator('#tv-a-input')).toHaveValue('50');
  await expect(page.locator('[data-editorial-reference]')).toHaveText(reference, { useInnerText: true });
  await page.locator('[data-language-select]').first().selectOption('/de/compare/75-vs-77');
  await expect(page.locator('#tv-a-input')).toHaveValue('50');
  await expect(page.locator('#tv-b-input')).toHaveValue('77');
  await page.goto(`/${lang}/compare/75-vs-77?a=bad&b=98`);
  await expect(page.locator('#tv-a-input')).toHaveValue('75');
  await expect(page.locator('#tv-b-input')).toHaveValue('98');
 });
 test(`${lang}: representative pages at mobile and desktop widths`, async ({ page }, info) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  for (const width of [360, 1280]) {
   await page.setViewportSize({ width, height: 900 });
   for (const slug of ['tv-sizes', 'tv-sizes/100-inch', 'compare/85-vs-98']) {
    await page.goto(`/${lang}/${slug}`);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect((await new AxeBuilder({ page }).analyze()).violations).toEqual([]);
    await page.screenshot({ path: info.outputPath(`${lang}-${slug.replaceAll('/', '-')}-${width}.png`), fullPage: true, style: 'astro-dev-toolbar { display: none; }' });
   }
  }
  expect(errors).toEqual([]);
 });
}

test.describe('all catalog pages without JavaScript', () => {
 test.use({ javaScriptEnabled: false });
 for (const lang of languages) test(`${lang}: server-rendered values and FAQs`, async ({ page }) => {
  for (const size of tvSizes) {
   await page.goto(`/${lang}/tv-sizes/${size}-inch`);
   await expect(page.locator('#distance-tv-size')).toHaveValue(String(size));
   const initial = Number(await page.locator('[data-distance-simulator]').getAttribute('data-initial-distance'));
   expect(initial).toBeCloseTo(viewingDistance(size, 'balanced'), 12);
   expect(Number(await page.locator('#viewer-distance').inputValue())).toBeCloseTo(initial, 12);
   await expect(page.locator('[data-distance-simulator] [data-number]').last()).toHaveValue(new Intl.NumberFormat(lang, { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(initial));
   await expect(page.locator('[data-position="balanced"]')).toHaveAttribute('aria-pressed', 'true');
   await expect(page.locator('#tv-size-faq-heading')).toBeVisible();
   await expect(page.locator('link[hreflang]')).toHaveCount(6);
   await expect(page.locator('[data-editorial-reference] table')).toHaveCount(2);
  }
  for (const pair of comparisons) {
   await page.goto(`/${lang}/compare/${pair.slug}`);
   await expect(page.locator('#tv-a-input')).toHaveValue(String(pair.a));
   await expect(page.locator('#tv-b-input')).toHaveValue(String(pair.b));
   await expect(page.locator('[data-reference-fit]')).toHaveCount(2);
   await expect(page.locator('link[hreflang]')).toHaveCount(6);
  }
 });
});

test('unsupported routes stay unpublished', async ({ request }) => {
 for (const path of ['/en/tv-sizes/58-inch', '/fr/tv-sizes/115-inch', '/de/compare/77-vs-75', '/ja/compare/32-vs-100', '/es/methodology']) {
  expect((await request.get(path)).status()).toBe(404);
 }
});
