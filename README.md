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

## First-release verification

- 15 automated calculation/state tests cover conversions, fit boundaries, clearance, overflow, width-only checks, malformed links, legacy links, and complete URL round trips.
- 22 Chromium browser tests cover unit synchronization and persistence, precision across repeated conversions, typed values and keyboard controls, overlay scale/alignment and equal sizes, exact fit, cross-tool links, clipboard success/failure, restoration with conflicting preferences, denied storage, and translated navigation.
- All four calculators pass automated accessibility checks at 360px in five languages and both themes, with reduced motion enabled. Desktop layouts were also inspected. Browser checks do not substitute for a manual screen-reader or Safari/Firefox audit.
- Astro type checking and the production build pass. The build emits 47 pages, including all five fit routes, with localized canonical URLs, language alternatives, and sitemap entries.

The storage-denial test excludes Astro’s development toolbar script, which requires storage and is absent from production. Application storage access remains covered.
