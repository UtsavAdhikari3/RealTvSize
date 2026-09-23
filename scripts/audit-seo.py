"""Audit the production HTML and sitemap without running client JavaScript."""
from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urljoin, urlsplit
import json
import re
import xml.etree.ElementTree as ET

SIZES = [32, 40, 43, 48, 50, 55, 60, 65, 70, 75, 77, 83, 85, 86, 98, 100]
PAIRS = ['32-vs-40', '40-vs-43', '43-vs-50', '48-vs-55', '50-vs-55', '55-vs-65',
         '65-vs-75', '75-vs-85', '55-vs-75', '65-vs-85', '75-vs-77', '85-vs-98']
LANGS = ['en', 'es', 'de', 'fr', 'ja']
BASE = ['', '/about', '/contact', '/privacy-policy', '/terms-and-conditions',
        '/will-it-fit', '/compare', '/viewing-distance', '/find-my-tv-size', '/tv-sizes']
ORIGIN = 'https://realtvsize.com'
ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / 'dist'
normalize = lambda text: ' '.join(text.split())

class Page(HTMLParser):
    def __init__(self, html):
        super().__init__(convert_charrefs=True)
        self.meta, self.links, self.anchors, self.schemas, self.text = {}, [], [], [], []
        self.h1 = 0
        self.title = ''
        self.lang = ''
        self.capture = None
        self.buffer = ''
        self.faqs = []
        self.faq = None
        self.faq_section = False
        self.question = False
        self.answer = False
        self.feed(html)
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == 'html': self.lang = attrs.get('lang')
        if tag == 'meta': self.meta[attrs.get('name', attrs.get('property'))] = attrs.get('content', '')
        if tag == 'link': self.links.append(attrs)
        if tag == 'a' and 'href' in attrs: self.anchors.append(attrs['href'])
        if tag == 'h1': self.h1 += 1
        if tag == 'title': self.capture, self.buffer = 'title', ''
        if tag == 'script':
            self.capture = 'schema' if attrs.get('type') == 'application/ld+json' else 'script'
            self.buffer = ''
        if tag == 'section' and attrs.get('aria-labelledby') == 'tv-size-faq-heading': self.faq_section = True
        if self.faq_section and tag == 'details': self.faq = {'question': '', 'answer': ''}
        if self.faq is not None and tag == 'summary': self.question = True
        if self.faq is not None and tag == 'p': self.answer = True
    def handle_data(self, data):
        if self.capture: self.buffer += data
        else: self.text.append(data)
        if self.faq is not None:
            if self.question: self.faq['question'] += data
            if self.answer: self.faq['answer'] += data
    def handle_endtag(self, tag):
        if tag == 'title':
            self.title, self.capture = self.buffer, None
        if tag == 'script':
            if self.capture == 'schema': self.schemas.append(json.loads(self.buffer))
            self.capture = None
        if tag == 'summary': self.question = False
        if tag == 'p': self.answer = False
        if tag == 'details' and self.faq is not None:
            self.faqs.append({k: normalize(v) for k, v in self.faq.items()})
            self.faq = None
        if tag == 'section': self.faq_section = False

def check(condition, message):
    if not condition: raise AssertionError(message)

def audit():
    suffixes = BASE + [f'/tv-sizes/{size}-inch' for size in SIZES] + [f'/compare/{pair}' for pair in PAIRS]
    expected = {f'{ORIGIN}/{lang}{suffix}' for lang in LANGS for suffix in suffixes} | {f'{ORIGIN}/en/methodology'}
    ns = {'s': 'http://www.sitemaps.org/schemas/sitemap/0.9', 'x': 'http://www.w3.org/1999/xhtml'}
    xml = ET.parse(DIST / 'sitemap.xml')
    entries = xml.findall('s:url', ns)
    urls = [entry.find('s:loc', ns).text for entry in entries]
    check(len(urls) == len(set(urls)) == 191 and set(urls) == expected, 'Sitemap differs from the 191 approved routes')
    built = {ORIGIN + '/' + path.parent.relative_to(DIST).as_posix() for lang in LANGS for path in (DIST / lang).rglob('index.html')}
    check(built == expected, 'Unexpected or missing localized HTML route')
    pages = {}
    for url in urls:
        path = DIST / urlsplit(url).path.lstrip('/') / 'index.html'
        check(path.is_file(), f'Missing HTML: {url}')
        pages[url] = Page(path.read_text(encoding='utf-8'))
    titles, descriptions, graph = set(), set(), {}
    for entry, url in zip(entries, urls):
        page = pages[url]
        lang = urlsplit(url).path.split('/')[1]
        check(page.lang == lang and page.h1 == 1, f'Language or H1: {url}')
        check(page.title and (lang, page.title) not in titles, f'Duplicate/missing title: {url}')
        description = page.meta.get('description')
        check(description and (lang, description) not in descriptions, f'Duplicate/missing description: {url}')
        titles.add((lang, page.title)); descriptions.add((lang, description))
        check('noindex' not in page.meta.get('robots', ''), f'Noindex: {url}')
        check([link['href'] for link in page.links if link.get('rel') == 'canonical'] == [url], f'Canonical: {url}')
        alternates = {link['hreflang']: link['href'] for link in page.links if link.get('rel') == 'alternate'}
        target_langs = ['en'] if url.endswith('/methodology') else LANGS
        suffix = urlsplit(url).path[3:]
        wanted = {language: f'{ORIGIN}/{language}{suffix}' for language in target_langs}
        wanted['x-default'] = f'{ORIGIN}/en{suffix}'
        check(alternates == wanted, f'HTML alternates: {url}')
        sitemap_alternates = {link.get('hreflang'): link.get('href') for link in entry.findall('x:link', ns)}
        check(sitemap_alternates == wanted, f'Sitemap alternates: {url}')
        for target in alternates.values():
            check(any(link.get('href') == url for link in pages[target].links if link.get('rel') == 'alternate'), f'Nonreciprocal: {url}')
        for key in ['og:title', 'twitter:title']: check(page.meta.get(key) == page.title, f'{key}: {url}')
        for key in ['og:description', 'twitter:description']: check(page.meta.get(key) == description, f'{key}: {url}')
        check(page.meta.get('og:url') == url, f'OG URL: {url}')
        check(page.meta.get('og:image:alt') == page.meta.get('twitter:image:alt') and page.meta.get('og:image:alt'), f'Image alt: {url}')
        graph[url] = set()
        for href in page.anchors:
            target = urlsplit(urljoin(url, href))
            if target.netloc == 'realtvsize.com':
                target_url = ORIGIN + target.path
                check(target_url in pages, f'Unpublished internal link: {url} -> {href}')
                graph[url].add(target_url)
        nodes = []
        for schema in page.schemas:
            check(schema.get('@context') == 'https://schema.org', f'Schema context: {url}')
            nodes.extend(schema.get('@graph', [schema]))
        detail = '/tv-sizes/' in url or '/compare/' in url
        if detail:
            types = {node.get('@type') for node in nodes}
            check({'WebPage', 'BreadcrumbList', 'FAQPage'} <= types, f'Detail schema types: {url}')
            faq = next(node for node in nodes if node.get('@type') == 'FAQPage')
            schema_faqs = [{'question': normalize(item['name']), 'answer': normalize(item['acceptedAnswer']['text'])} for item in faq['mainEntity']]
            check(schema_faqs == page.faqs and len(schema_faqs) == 3, f'FAQ visible/schema mismatch: {url}')
            check(not re.search(r'\{\w+\}', ' '.join(page.text)), f'Unresolved interpolation: {url}')
            breadcrumb = next(node for node in nodes if node.get('@type') == 'BreadcrumbList')
            check(breadcrumb['itemListElement'][-1]['item'] == url, f'Breadcrumb endpoint: {url}')
        if url.endswith('/tv-sizes'):
            listing = next(node for node in nodes if node.get('@type') == 'ItemList')
            check(listing['numberOfItems'] == len(listing['itemListElement']) == 16, f'Hub count: {url}')
            check({item['url'] for item in listing['itemListElement']} == {f'{ORIGIN}/{lang}/tv-sizes/{size}-inch' for size in SIZES}, f'Hub entries: {url}')
    reachability = {}
    for lang in LANGS:
        visited, pending = set(), [f'{ORIGIN}/{lang}']
        while pending:
            url = pending.pop()
            if url in visited: continue
            visited.add(url)
            pending.extend(target for target in graph[url] if target.startswith(f'{ORIGIN}/{lang}') and target not in visited)
        required = {url for url in urls if url.startswith(f'{ORIGIN}/{lang}')}
        check(required <= visited, f'Unreachable from {lang} homepage: {required - visited}')
        reachability[lang] = len(visited)
    check('Sitemap: https://realtvsize.com/sitemap.xml' in (DIST / 'robots.txt').read_text(), 'Robots sitemap')
    check(not list(DIST.glob('sitemap-index*')), 'Unexpected sitemap index')
    for config in [ROOT / 'src/worker.js', ROOT / 'wrangler.jsonc', DIST / '_headers']:
        if config.exists():
            check(not re.search(r'x-robots-tag[^\n]*(?:noindex|none)', config.read_text(encoding='utf-8'), re.I), f'Blocking robots header in {config.name}')
    report = {'canonical_urls': len(urls), 'size_pages': 80, 'comparison_pages': 60, 'size_hubs': 5,
              'reachable_from_home': reachability, 'checks': ['static content', 'unique titles and descriptions', 'one H1',
              'self-canonicals', 'reciprocal alternates', 'English x-default', 'social metadata', 'visible FAQ parity',
              'detail and collection schema', 'internal links', 'robots and sitemap'], 'status': 'passed'}
    output = ROOT / 'artifacts' / 'seo-audit.json'
    output.parent.mkdir(exist_ok=True)
    output.write_text(json.dumps(report, indent=2) + '\n', encoding='utf-8')
    print(json.dumps(report, indent=2))

if __name__ == '__main__':
    audit()
