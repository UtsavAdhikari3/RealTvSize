// Only these curated entries create indexable pages. Calculator options are independent.
export const tvSizes = [32, 40, 43, 48, 50, 55, 60, 65, 70, 75, 77, 83, 85, 86, 98, 100] as const;
export type TvSize = typeof tvSizes[number];
export const comparisonPairs = [
 [32, 40], [40, 43], [43, 50], [48, 55], [50, 55], [55, 65],
 [65, 75], [75, 85], [55, 75], [65, 85], [75, 77], [85, 98],
] as const satisfies readonly (readonly [TvSize, TvSize])[];
type Pair = typeof comparisonPairs[number];
type Slug<T> = T extends readonly [infer A extends number, infer B extends number] ? `${A}-vs-${B}` : never;
export type ComparisonSlug = Slug<Pair>;
export type SizePageId = `${TvSize}-inch`;
export const sizePageId = (size: TvSize): SizePageId => `${size}-inch`;
export const comparisons = comparisonPairs.map(([a, b]) => ({ a, b, slug: `${a}-vs-${b}` as ComparisonSlug }));
export type Comparison = typeof comparisons[number];
