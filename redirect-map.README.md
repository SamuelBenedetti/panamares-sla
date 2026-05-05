# Legacy panamares.com redirect map (P0-10)

This file maps URLs from the legacy Wasi-driven `panamares.com` site to their
closest equivalent on the new Next.js site. Loaded at build time by
`next.config.mjs` and emitted as 301 (permanent) HTTP redirects.

## Why

When the new site replaces the old at `panamares.com`, every inbound backlink
from external sites + every URL in Google's index of the old site needs to be
preserved. 301 redirects pass ~90% of PageRank/link equity to the new URL.
Without them, the launch loses months of organic traffic until Google
rediscovers + reindexes the new structure.

## Schema

Two columns, comma-separated, with a header row:

```csv
old_url,new_url
https://panamares.com/casa-venta-versalles-juan-diaz/7220678,/propiedades/casas-en-venta-versalles-7220678
https://panamares.com/oficina-venta-punta-pacifica-san-francisco/8461136,/propiedades/oficinas-en-venta-punta-pacifica-8461136
https://panamares.com/s/casa/ventas?id_property_type=1&business_type%5B0%5D=for_sale,/casas-en-venta
```

- `old_url`: full URL or path-only. The protocol + host (`https://panamares.com`)
  is stripped automatically by the loader.
- `new_url`: path-relative (preferred) or full URL.

Comma is used as the field delimiter — URLs containing literal commas need to
be encoded (`%2C`) in the source column.

## How to use

1. Search Leads Agency delivers a populated `redirect-map.csv` (replaces this
   file).
2. `git add redirect-map.csv && git commit && git push`.
3. Vercel auto-rebuilds and the redirects activate.
4. Verify with the test script in `seo/implementation-guide.md` (P0-10 AC):
   ```bash
   while IFS=',' read -r old_url new_url; do
     status=$(curl -sI "$old_url" -o /dev/null -w "%{http_code}")
     echo "$old_url → $new_url : $status"
   done < redirect-map.csv | tail -n +2
   # All should print 301
   ```

## Constraints

- **No redirect chains** — every old URL must map directly to its final
  destination. If a URL needs N hops on the legacy site, the map should
  collapse them into a single 301.
- **No mass redirect to `/`** — URLs without a clear equivalent should map
  to the closest **category** page (e.g. `/casas-en-venta`,
  `/propiedades-en-venta`), never the homepage. Mass-redirecting to `/` is
  a soft-404 pattern Google penalises.
- **Use `permanent: true` (301)** — never `permanent: false` (302) for
  legacy migrations.

## Pre-cutover state

The committed `redirect-map.csv` contains only the header row. The loader
returns an empty array when the file has no data rows, so internal redirects
(neighborhood deep links) keep working unchanged until the legacy map lands.
