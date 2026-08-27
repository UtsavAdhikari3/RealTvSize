import type { APIRoute } from 'astro';
import { defaultLanguage, languages } from '../i18n/config';
import { localizedPath, pagePaths, type PageId } from '../i18n/routes';

const pages = Object.keys(pagePaths) as PageId[];

function escapeXml(value: string) {
	return value
		.replaceAll('&', '&amp;')
		.replaceAll('<', '&lt;')
		.replaceAll('>', '&gt;')
		.replaceAll('"', '&quot;')
		.replaceAll("'", '&apos;');
}

export const GET: APIRoute = ({ site }) => {
	const siteUrl = site ?? new URL('https://realtvsize.com');
	const urls = pages.flatMap((page) =>
		languages.map((language) => {
			const location = new URL(localizedPath(language, page), siteUrl).href;
			const alternates = languages
				.map((alternateLanguage) => {
					const href = new URL(localizedPath(alternateLanguage, page), siteUrl).href;

					return `    <xhtml:link rel="alternate" hreflang="${alternateLanguage}" href="${escapeXml(href)}" />`;
				})
				.concat(
					`    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(
						new URL(localizedPath(defaultLanguage, page), siteUrl).href,
					)}" />`,
				)
				.join('\n');

			return `  <url>\n    <loc>${escapeXml(location)}</loc>\n${alternates}\n  </url>`;
		}),
	);

	const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.join('\n')}
</urlset>
`;

	return new Response(body, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
		},
	});
};
