import type { Language } from '../../i18n/config';
import { interpolate } from '../../i18n/types';
import { localizedPath, type PageId } from '../../i18n/routes';
import { dimensions, format, inchesToCm, squareInchesToCm, feetToMeters, percentageIncrease, viewingDistance } from '../../scripts/tv-math';
import type { TvSize, Comparison } from '../catalog';
import type { SeoCopy } from './types';

// Render-only modules: never include this inventory in a calculator's data-i18n.
const loaders = { en: () => import('./en'), es: () => import('./es'), de: () => import('./de'), fr: () => import('./fr'), ja: () => import('./ja') };
export async function getSeoCopy(lang: Language): Promise<SeoCopy> { return (await loaders[lang]()).default; }
export const modes = ['immersive', 'balanced', 'relaxed'] as const;
export const angles = { immersive: 40, balanced: 30, relaxed: 25 } as const;
export function measurements(lang: Language) {
 const n = (value: number, digits = 1) => format(value, digits, lang);
 return {
  n,
  length: (value: number) => `${n(value)} in / ${n(inchesToCm(value))} cm`,
  area: (value: number) => `${n(value, 0)} in² / ${n(squareInchesToCm(value), 0)} cm²`,
  distance: (value: number) => `${n(value)} ft / ${n(feetToMeters(value))} m`,
 };
}
export function sizeContent(copy: SeoCopy, size: TvSize, lang: Language) {
 const d = dimensions(size), m = measurements(lang);
 const values = { size, width: m.length(d.width), height: m.length(d.height), area: m.area(d.area),
  ...Object.fromEntries(modes.map(mode => [mode, m.distance(viewingDistance(size, mode))])) };
 const fill = (value: string) => interpolate(value, values);
 const entry = copy.sizes[size];
 return { title: fill(copy.size.title), description: fill(copy.size.description), heading: fill(copy.size.heading),
  intro: fill(entry.intro), guidance: fill(entry.guidance), geometry: fill(copy.size.geometry), distance: fill(copy.size.distance),
  caption: fill(copy.labels.reference),
  faqs: [
   { question: fill(copy.size.widthQuestion), answer: fill(copy.size.geometry) },
   { question: fill(copy.size.distanceQuestion), answer: fill(copy.size.distance) + ' ' + copy.distanceNote },
   { question: fill(copy.size.placementQuestion), answer: fill(entry.guidance) + ' ' + copy.caveat },
  ],
 };
}
export function pairContent(copy: SeoCopy, pair: Comparison, lang: Language) {
 const a = dimensions(pair.a), b = dimensions(pair.b), m = measurements(lang);
 const values = { a: pair.a, b: pair.b, gain: m.n(percentageIncrease(a.area, b.area)), linear: m.n(percentageIncrease(pair.a, pair.b)),
  widthDiff: m.length(b.width - a.width), heightDiff: m.length(b.height - a.height),
  side: m.length((b.width - a.width) / 2), vertical: m.length((b.height - a.height) / 2),
  distanceA: m.distance(viewingDistance(pair.a, 'balanced')), distanceB: m.distance(viewingDistance(pair.b, 'balanced')) };
 const fill = (value: string) => interpolate(value, values);
 const entry = copy.pairs[pair.slug];
 return { title: fill(copy.pair.title), description: fill(copy.pair.description), heading: fill(copy.pair.heading),
  intro: fill(entry.intro), guidance: fill(entry.guidance), geometry: fill(copy.pair.geometry), distance: fill(copy.pair.distance),
  caption: fill(copy.labels.pairReference),
  faqs: [
   { question: fill(copy.pair.gainQuestion), answer: fill(copy.pair.geometry) },
   { question: fill(copy.pair.fitQuestion), answer: fill(copy.pair.fitAnswer) },
   { question: fill(copy.pair.tradeoffQuestion), answer: fill(entry.guidance) },
  ],
 };
}
export interface Crumb { name: string; page: PageId }
export function detailSchema(site: URL, lang: Language, page: PageId, content: ReturnType<typeof sizeContent>, crumbs: Crumb[]) {
 const url = new URL(localizedPath(lang, page), site).href;
 return { '@context': 'https://schema.org', '@graph': [
  { '@type': 'WebPage', '@id': url, url, name: content.heading, description: content.description, inLanguage: lang,
   breadcrumb: { '@id': url + '#breadcrumbs' } },
  { '@type': 'BreadcrumbList', '@id': url + '#breadcrumbs', itemListElement: crumbs.map((crumb, index) => ({
   '@type': 'ListItem', position: index + 1, name: crumb.name, item: new URL(localizedPath(lang, crumb.page), site).href,
  })) },
  { '@type': 'FAQPage', '@id': url + '#faq', inLanguage: lang, mainEntity: content.faqs.map(faq => ({
   '@type': 'Question', name: faq.question, acceptedAnswer: { '@type': 'Answer', text: faq.answer },
  })) },
 ] };
}
