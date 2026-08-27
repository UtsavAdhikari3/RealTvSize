import de from './de';
import en from './en';
import es from './es';
import fr from './fr';
import ja from './ja';
import type { Translation } from './types';

export const languageConfig = {
	en: { label: en.languageName, translation: en },
	es: { label: es.languageName, translation: es },
	de: { label: de.languageName, translation: de },
	fr: { label: fr.languageName, translation: fr },
	ja: { label: ja.languageName, translation: ja },
} satisfies Record<string, { label: string; translation: Translation }>;

export type Language = keyof typeof languageConfig;

export const languages = Object.keys(languageConfig) as Language[];
export const defaultLanguage: Language = 'en';

export function isLanguage(value: string | undefined): value is Language {
	return Boolean(value && value in languageConfig);
}

export function getTranslation(language: Language): Translation {
	return languageConfig[language].translation;
}

export function getLanguageStaticPaths() {
	return languages.map((lang) => ({
		params: { lang },
		props: { lang, t: getTranslation(lang) },
	}));
}
