export const toolSeo = {
	compare: {
		heading: 'TV Size Comparison Tool',
		description: 'Compare TV sizes to scale, side by side or overlaid. See differences in screen width, height and area, and explore popular TV size comparisons.',
	},
	viewingDistance: {
		heading: 'TV Viewing Distance Calculator',
		description: 'Find a comfortable TV viewing distance. Adjust screen size and seating to compare field of view with immersive, balanced and relaxed distance guides.',
	},
	findMyTvSize: {
		heading: 'What TV Size Should I Get?',
		description: 'Find a TV size for your room using your couch-to-screen viewing distance. Compare three viewing styles and check the recommended screen dimensions.',
	},
	willItFit: {
		heading: 'TV Dimensions & Fit Calculator',
		description: 'Calculate TV width and height from screen size, then check whether it fits your space. Use estimated 16:9 dimensions or exact measurements with clearance.',
	},
} as const;

export function calculatorSchema(name: string, description: string, path: string) {
	return {
		'@context': 'https://schema.org', '@type': 'WebApplication',
		name, description, url: `https://realtvsize.com${path}`,
		applicationCategory: 'UtilitiesApplication', operatingSystem: 'Any',
		browserRequirements: 'Requires JavaScript', inLanguage: 'en',
		isAccessibleForFree: true,
	};
}
