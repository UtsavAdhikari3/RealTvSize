import type { TvSize, ComparisonSlug } from '../catalog';
export interface EditorialEntry { intro: string; guidance: string }
export interface SeoCopy {
 labels: { sizes: string; comparisons: string; related: string; tools: string; size: string; pair: string; dimensions: string; placement: string; viewing: string; width: string; height: string; area: string; diagonal: string; difference: string; measurement: string; faq: string; answers: string; fit: string; reference: string; pairReference: string; imageAlt: string; breadcrumb: string };
 hub: { title: string; description: string; intro: string };
 size: { title: string; description: string; heading: string; geometry: string; distance: string; widthQuestion: string; distanceQuestion: string; placementQuestion: string };
 pair: { title: string; description: string; heading: string; geometry: string; distance: string; gainQuestion: string; fitQuestion: string; tradeoffQuestion: string; fitAnswer: string };
 caveat: string;
 distanceNote: string;
 sizes: Record<TvSize, EditorialEntry>;
 pairs: Record<ComparisonSlug, EditorialEntry>;
}
