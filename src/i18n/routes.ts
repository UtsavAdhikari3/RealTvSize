import type { Language } from './config';

export const pagePaths = {
	home: '',
	compare: '/compare',
	viewingDistance: '/viewing-distance',
	findMyTvSize: '/find-my-tv-size',
	about: '/about',
	contact: '/contact',
	privacyPolicy: '/privacy-policy',
	termsAndConditions: '/terms-and-conditions',
} as const;

export type PageId = keyof typeof pagePaths;

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
