# Localized catalog verification

Verified on 2026-09-23. No production deployment performed.

- Astro check: 81 files, zero errors, warnings or hints.
- Unit tests: 39 passed.
- Production build: completed successfully; 191 canonical content URLs.
- Built HTML audit: passed for all 191 URLs. See [seo-audit.json](seo-audit.json).
- Chromium: 51 tests passed against the production build served by `wrangler dev --local --port 4322`.
- All 80 size pages and 60 comparison pages checked with JavaScript disabled in all five languages.
- Representative size guides, comparison guides and size hubs checked at 360px and 1280px in every locale, with no accessibility violations or page overflow.
- Existing calculator tests passed, including both themes, storage denial, unit precision, query restoration, clipboard behavior and language switching.
- All sitemap URLs returned HTTP 200 through the local deployment worker, with no blocking robots header. Unsupported catalog routes and untranslated methodology routes returned 404.
- Static references stay tied to the URL while interactive controls remain editable. Valid query settings override page defaults; invalid fields fall back independently.
- Reviewed mobile size-page screenshots across all five languages, plus representative desktop comparison and mobile table layouts. See [mobile contact sheet](size-pages-mobile.jpg). Full screenshots are in the ignored `test-results/` directory.

The built site is in `dist/`. Run `npm run build` followed by `npm run audit:seo` to regenerate the HTML audit. See README for local worker and browser-test commands.
