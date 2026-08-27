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
	return page === 'home' ? `/${language}/` : `/${language}${pagePaths[page]}`;
}
