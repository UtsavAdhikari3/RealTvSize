import type en from './en';

type WidenStrings<T> = T extends string
	? string
	: T extends readonly unknown[]
		? { [K in keyof T]: WidenStrings<T[K]> }
		: T extends object
			? { [K in keyof T]: WidenStrings<T[K]> }
			: T;

export type Translation = WidenStrings<typeof en>;
export type ProfileKey = keyof Translation['profiles'];

export type TemplateValues = Record<string, string | number>;

export function interpolate(template: string, values: TemplateValues) {
	return template.replace(/\{(\w+)\}/g, (match, key: string) =>
		Object.hasOwn(values, key) ? String(values[key]) : match,
	);
}
