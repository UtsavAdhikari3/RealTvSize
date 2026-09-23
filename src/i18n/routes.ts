import type { Language } from './config';
import { languageCodes } from './languages';
import { comparisons, tvSizes, sizePageId, type ComparisonSlug, type SizePageId } from '../data/catalog';

export const pagePaths = {
	home: '',
	willItFit: '/will-it-fit',
	compare: '/compare',
	viewingDistance: '/viewing-distance',
	findMyTvSize: '/find-my-tv-size',
	about: '/about',
	contact: '/contact',
	privacyPolicy: '/privacy-policy',
	termsAndConditions: '/terms-and-conditions',
	methodology: '/methodology',
	tvSizes: '/tv-sizes',
	...Object.fromEntries(tvSizes.map(size => [sizePageId(size), `/tv-sizes/${sizePageId(size)}`])) as Record<SizePageId, string>,
	...Object.fromEntries(comparisons.map(pair => [pair.slug, `/compare/${pair.slug}`])) as Record<ComparisonSlug, string>,
} as const;

export type PageId = keyof typeof pagePaths;

// Only advertise translations that are actually published.
export function pageLanguages(page: PageId): Language[] {
	return page === 'methodology' ? ['en'] : [...languageCodes];
}

export function localizedPath(language: Language, page: PageId) {
	return `/${language}${pagePaths[page]}`;
}

export function withoutTrailingSlash(pathname: string) {
	return pathname === '/' ? pathname : pathname.replace(/\/+$/, '');
}

export function canonicalUrlForRoute(routeUrl: URL, siteUrl: URL) {
	const canonicalUrl = new URL(withoutTrailingSlash(routeUrl.pathname), siteUrl);
	canonicalUrl.search = '';
	canonicalUrl.hash = '';

	return canonicalUrl;
}
