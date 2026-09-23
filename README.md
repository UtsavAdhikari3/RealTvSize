# RealTVSize

Static Astro calculators for TV comparison, viewing distance, size recommendations, and front-facing fit checks in English, Spanish, German, French, and Japanese. Browser interactions use TypeScript and CSS/SVG; no account or backend is required.

## Development and verification

Use Node 22.12 or newer. Prefix commands with `rtk` in the Codex workspace.

```sh
rtk npm install
rtk npm run dev -- --background
rtk npm run astro -- dev status
rtk npm run astro -- dev logs
rtk npm run check
rtk npm test
rtk npm run test:browser
rtk npm run build
rtk npm run audit:seo
rtk npm run astro -- dev stop
```

Browser tests expect the background dev server at `http://localhost:4321`. Install Chromium with `rtk npm exec playwright install chromium` if it is not already available. Screenshots and failure traces are written to the ignored `test-results/` directory. Deployment is a separate operation.

## Measurements and setup links

Physical state is retained at full precision. TV diagonals always use inches. Widths and heights display in inches or centimeters, distances in feet or meters, and areas in square inches or square centimeters. Display rounding never writes back to the physical state unless the user edits a value. Locale decimal separators are accepted; ambiguous grouping separators are rejected.

Units resolve from `units=imperial|metric`, then the saved `realtvsize-units` preference, then the locale (English: imperial; other languages: metric). Preference storage is optional. All calculators on a page share units while retaining separate settings.

Setup links target the corresponding localized dedicated page and include every setting, including defaults. Existing URL meanings remain compatible:

| Page | Parameters | Physical units |
| --- | --- | --- |
| `/[lang]/compare` | `a`, `b`, `view=side|overlay`, `align=center|bottom` | Diagonals in inches |
| `/[lang]/viewing-distance` | `screen`, `viewing` | Inches, feet |
| `/[lang]/find-my-tv-size` | `room`, `style=immersive|balanced|relaxed` | Feet |
| `/[lang]/will-it-fit` | `fit-size`, `fit-mode=estimate|exact`, `fit-width`, `fit-height`, `fit-clearance`, `fit-tv-width`, `fit-tv-height` | All lengths in inches |

Every setup includes `units`. Empty fit lengths serialize as empty strings. Invalid URL fields fall back independently to defaults. Updating one calculator preserves the other calculators’ parameters. Language switching retains the current query settings. Clipboard failures reveal a selectable link.

The fit calculator checks width and optional height, subtracting clearance on both sides of each checked axis. Screen estimates exclude bezel and stand; exact mode uses supplied manufacturer dimensions and makes no recommendation for other models. Depth, stand footprint, and ventilation requirements must be checked separately.

## Localized size guides and comparisons

The shared inventory in `src/data/catalog.ts` publishes 16 size guides and 12 comparison guides per language. Size hubs live at `/[lang]/tv-sizes`; the existing `/[lang]/compare` calculator is the comparison hub. The route helpers and custom `/sitemap.xml` use this inventory. There are 191 canonical URLs; error pages, redirects, query variants and unsupported sizes/pairs are excluded. Methodology remains English-only.

Editorial copy lives in typed, render-only `src/data/seo/{en,es,de,fr,ja}.ts` modules. Each entry has distinct placement or upgrade guidance. Calculated values are interpolated through the shared math and locale formatting helpers. The copy is not serialized into calculator client translations. To add a published size or comparison, update the explicit catalog and every locale, then run the content and built-HTML audits.

Size guides initialize the viewing simulator with the page diagonal and the full-precision 30-degree distance. Valid query settings take precedence; invalid fields independently fall back to page defaults. The standalone simulator keeps its 75-inch / 9.4-foot defaults. Reference tables and their fit links stay tied to the URL's sizes when calculator controls change. Shared setup links still target the dedicated calculator routes.

## Verification

- 39 unit tests cover calculations, conversions, fit boundaries, query parsing, route inventory, all five editorial modules and size-page defaults.
- 51 Chromium tests cover existing calculator behavior, presets, query overrides, reloads, language and unit changes, static references, fit links, unsupported routes and metadata.
- All 140 detail pages are checked with JavaScript disabled. Representative size, comparison and hub pages pass accessibility and overflow checks at 360px and 1280px in all five languages. Existing calculator checks cover both themes.
- `npm run audit:seo` audits built HTML for all 191 canonical URLs, unique metadata within each locale, one H1, canonical and reciprocal alternate links, English x-default, visible FAQ/schema parity, collection lists, crawlable internal links, homepage reachability and robots configuration. It writes `artifacts/seo-audit.json`.
- The browser suite was also run against the production build served by local Wrangler, exercising the deployment worker and asset handling. Set `PLAYWRIGHT_BASE_URL` to test a server other than the default development URL.

Production verification example in PowerShell:

```powershell
rtk npm run build
rtk npx.cmd wrangler dev --local --port 4322
# In a second terminal:
$env:PLAYWRIGHT_BASE_URL = 'http://127.0.0.1:4322'
rtk npm run test:browser
```

Screenshots and traces are in `test-results/`. Browser checks do not substitute for a manual screen-reader or Safari/Firefox audit. The storage-denial test excludes Astro's development toolbar script, which is absent from production. Deployment remains a separate operation.
