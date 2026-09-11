import type { Language } from './config';
import { languageCodes } from './languages';

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
	'55-vs-65': '/compare/55-vs-65',
	'65-vs-75': '/compare/65-vs-75',
	'75-vs-85': '/compare/75-vs-85',
	'55-vs-75': '/compare/55-vs-75',
	'65-vs-85': '/compare/65-vs-85',
} as const;

export type PageId = keyof typeof pagePaths;

// Only advertise translations that are actually published.
export function pageLanguages(page: PageId): Language[] {
	return page === 'methodology' || pagePaths[page].startsWith('/compare/') ? ['en'] : [...languageCodes];
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
