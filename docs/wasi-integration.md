# Integración WASI → Panamares

## ¿Qué es WASI?

WASI (wasi.co) es el CRM inmobiliario que usa Carlos para gestionar todas las propiedades de Panamares. La integración consiste en sincronizar automáticamente las propiedades de WASI hacia Sanity (el CMS del sitio web), para que cualquier cambio que Carlos haga en su CRM se refleje en panamares.com sin intervención manual.

---

## Cómo funciona la API de WASI

- **Tipo:** REST API · JSON · HTTPS
- **Base URL:** `https://api.wasi.co/v1/`
- **Autenticación:** dos parámetros en cada request (`id_company` + `wasi_token`)
- **Plan requerido:** Pro Plan en wasi.co

### Obtener las credenciales

Carlos debe ir a su cuenta de WASI:
> Configuración → Ajustes generales → sección "Wasi API" → Generar token

Esto genera:
```
id_company  →  número (ej: 1234567890)
wasi_token  →  string (ej: ABCD_EFGH_IJKL_MNOP)
```

Esas credenciales se guardan como variables de entorno en el proyecto:
```env
WASI_ID_COMPANY=1234567890
WASI_TOKEN=ABCD_EFGH_IJKL_MNOP
```

---

## Endpoints clave

| Propósito | Método | URL |
|---|---|---|
| Listar propiedades | GET | `/property/search` |
| Detalle de propiedad | GET | `/property/get/{id}` |
| Listar galerías | GET | `/gallery/all/{id_property}` |
| Fotos de una galería | GET | `/gallery/image/all/{id_gallery}` |

### Parámetros de búsqueda más importantes

| Parámetro | Tipo | Descripción |
|---|---|---|
| `scope=1` | Number | Solo propiedades de Panamares (no aliadas) |
| `for_sale=true` | Boolean | Solo en venta |
| `for_rent=true` | Boolean | Solo en alquiler |
| `take=100` | Number | Resultados por página (máximo 100) |
| `skip=0` | Number | Offset para paginación |
| `short=true` | Boolean | Omite fotos y features (más rápido para listar) |

### Estructura de una imagen

Cada imagen devuelta tiene tres URLs:
```json
{
  "url":          "https://images.wasi.co/inmuebles/imagen.jpg",
  "url_big":      "https://images.wasi.co/inmuebles/imagen_big.jpg",
  "url_original": "https://images.wasi.co/inmuebles/imagen_original.jpg",
  "description":  "Sala",
  "position":     1
}
```

---

## Estrategia de integración elegida: Sincronización programada

### Por qué esta estrategia

El sitio de Panamares **no llama a WASI directamente**. En cambio, un script de sincronización corre periódicamente, importa las propiedades de WASI hacia **Sanity**, y el sitio solo se comunica con Sanity.

Ventajas:
- El sitio funciona aunque WASI esté caído
- Las fotos se sirven desde el CDN de Sanity (más rápido, mejor SEO)
- Sanity permite edición manual de cualquier campo (título, descripción, zona, etc.)
- Ya tenemos la infraestructura: el script `import-wasi.mjs` fue la prueba de concepto con CSV

### Flujo completo

```
Carlos actualiza una propiedad en WASI
        ↓
Cron job (cada 6h) ejecuta scripts/sync-wasi.mjs
        ↓
Script llama a GET /property/search?scope=1&take=100&skip=0
        ↓  (paginación hasta traer todas)
Por cada propiedad, llama a GET /property/get/{id}  ← fotos incluidas
        ↓
Mapea los campos WASI → campos Sanity
        ↓
Sube imágenes nuevas a Sanity Assets API
        ↓
client.createOrReplace(doc) en Sanity
        ↓
Next.js detecta el cambio (ISR revalidation) → sitio actualizado
```

---

## Script de sincronización

El script existente `scripts/import-wasi.mjs` ya tiene toda la lógica base:
- Parser CSV → reemplazar por fetch a API
- Mapeo de campos → reutilizar casi todo
- Upload de imágenes a Sanity → reutilizar `uploadImageFromUrl()`
- `client.createOrReplace()` con `_id: wasi-{id}` → deduplicación automática

### Cambios que hay que hacer al script para producción

1. **Reemplazar lectura del CSV** por fetch a WASI API
2. **Agregar paginación** (loop con `skip += 100` hasta que no haya más resultados)
3. **Importar galería completa** (actualmente solo sube `image_url`, la principal)
4. **Marcar propiedades inactivas**: si una propiedad ya no aparece en WASI, cambiar `listingStatus` a `"retirada"` en Sanity automáticamente
5. **Variables de entorno** para las credenciales (no hardcodeadas)

### Ejemplo del fetch principal

```ts
const BASE = 'https://api.wasi.co/v1';
const CREDS = `id_company=${process.env.WASI_ID_COMPANY}&wasi_token=${process.env.WASI_TOKEN}`;

async function fetchAllProperties() {
  const all = [];
  let skip = 0;
  while (true) {
    const res = await fetch(`${BASE}/property/search?${CREDS}&scope=1&take=100&skip=${skip}`);
    const data = await res.json();
    if (data.status !== 'success' || !data.total) break;
    const props = Object.values(data).filter(v => typeof v === 'object' && v.id_property);
    all.push(...props);
    if (all.length >= data.total) break;
    skip += 100;
  }
  return all;
}
```

---

## Configuración del cron job (GitHub Actions)

```yaml
# .github/workflows/sync-wasi.yml
name: Sync WASI → Sanity

on:
  schedule:
    - cron: '0 */6 * * *'   # cada 6 horas
  workflow_dispatch:          # también ejecutable manualmente

jobs:
  sync:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: node scripts/sync-wasi.mjs
        env:
          WASI_ID_COMPANY: ${{ secrets.WASI_ID_COMPANY }}
          WASI_TOKEN: ${{ secrets.WASI_TOKEN }}
          SANITY_TOKEN: ${{ secrets.SANITY_TOKEN }}
```

Los secrets se configuran en GitHub → Settings → Secrets del repositorio.

---

## Mapeo de campos WASI → Sanity

| Campo WASI | Campo Sanity | Notas |
|---|---|---|
| `id_property` | `_id` = `wasi-{id}` | Clave de deduplicación |
| `title` | `title` | O construido como antes |
| `for_sale` / `for_rent` | `businessType` | `"venta"` / `"alquiler"` |
| `id_property_type` | `propertyType` | Requiere mapeo de ID → string |
| `id_availability` | `listingStatus` | `activa` / `vendida` / `retirada` |
| `sale_price` / `rent_price` | `price` | Según `businessType` |
| `maintenance_fee` | `adminFee` | |
| `bedrooms` | `bedrooms` | |
| `bathrooms` | `bathrooms` | |
| `garages` | `parking` | |
| `area` / `built_area` | `area` | |
| `floor` | `floor` | |
| `building_date` | `yearBuilt` | |
| `observations` | `description` | Texto plano → Portable Text |
| `zone_label` | `zone` | Barrio |
| `location_label` | `corregimiento` | |
| `latitude` + `longitude` | `location` | `{lat, lng}` |
| `main_image` / `galleries` | `mainImage` + `gallery` | Subir a Sanity Assets |
| `features` | `featuresInterior/Building/Location` | Requiere mapeo |
| `id_user` → usuario WASI | `agent` | Si hay mapeo de agentes |

---

## Safety guarantees (post-PR-K1)

El sync `scripts/sync-wasi.mjs` corre en cron cada 6h (cuando se active). Estas son las garantías que protegen el catálogo y el trabajo manual de Carlos/Igor:

### 1. HUMAN_FIELDS — Carlos y Igor son dueños

Estos campos se escriben **solo en la creación inicial** del doc. Después, el sync **nunca los toca**:

| Campo | Quién lo controla post-create |
|---|---|
| `title`, `description`, `slug` | Carlos en Studio |
| `titleI18n`, `descriptionI18n` | Igor en Studio (review pass) |
| `humanReviewed` | Igor en Studio |
| `recommended`, `fairPrice`, `rented`, `featured`, `noindex` | Carlos en Studio |
| `publishedAt` | Sanity al crear (immutable) |

Patrón: Wasi siembra el valor inicial al primer sync, después es del editor. Excepción intencional: si Carlos vacía el campo en Studio (ej. `title: ""`), el siguiente sync lo re-llena desde Wasi como reset.

**Nota sobre `featured` y `rented`:** se siembran desde Wasi en el primer sync (desde `id_status_on_page === 3` y `id_availability === 3` respectivamente), después quedan bajo control de Carlos. La curaduría del homepage es decisión humana — Wasi es operacional, no editorial. Si Carlos quiere agregar/quitar una propiedad de la vitrina del homepage, lo hace en Sanity Studio.

### 2. Wasi-owned fields — sync siempre actualiza

Todo lo demás (precio, dimensiones, status, fotos, features, agente) se sincroniza desde Wasi en cada corrida.

### 3. Catalog-size assertion

Antes de hacer cualquier deactivation, el script compara la cantidad de propiedades que devolvió Wasi contra la última corrida exitosa. Si Wasi devuelve **<90%** del último count → **abort total**, sin escribir nada. Defiende contra:
- Auth hiccup en Wasi
- Bug en paginación de Wasi
- Timeout regional

Estado persistido en `logs/wasi-sync-state.json`.

### 4. Deactivation threshold

Si después de procesar el catálogo el script va a marcar más de `max(10, 5% del catálogo)` propiedades como `retirada`, **abort**. Pasable con `--force` (loguea warning ruidoso para audit trail).

### 5. mapPropertyType hard-fail

Si Wasi devuelve un tipo de propiedad desconocido (label nuevo o `id_property_type` no mapeado), el script **skipea esa propiedad y emite warning**, en lugar de defaultear silenciosamente a "apartamento". Crítico porque el `slug` se freeze después de la creación: una mis-classification al crear queda permanente.

### 6. Image cache by URL hash

El `originalFilename` de cada asset incluye un hash de 8 chars del path de la URL Wasi. Si Carlos cambia una foto en Wasi (URL distinta), el hash cambia → upload fresh. Old asset queda orphan (TODO: cleanup script mensual).

### 7. Field unset on absence

Si Wasi tenía `bedrooms:3` y luego ese campo desaparece de la respuesta, Sanity hace `unset` explícito. Sin esto, el valor stale quedaría indefinido.

### 8. publishedAt validation

Si Wasi devuelve fecha basura/null, `publishedAt` se deja `null` (Sanity aplica `initialValue`) en lugar de defaultear a `new Date()` (que arruinaría el `<lastmod>` del sitemap con "todas publicadas hoy").

### Webhook → revalidación

Cualquier publish en Sanity Studio (incluyendo cambios manuales de Carlos sobre HUMAN_FIELDS) dispara un webhook que llama `/api/revalidate` con el secret. El endpoint:
- Revalida los paths ES + EN del doc
- Llama `revalidateTag("sanity")` para purgar todo el cache de fetches
- Combinado con `useCdn: false` (ver [ADR-001](./adr-001-sanity-cdn.md)) → cambios visibles al usuario en **<1 segundo**.

### `--force` flag

Para casos legítimos donde sí se quiere bypass del threshold (ej. Carlos vendió 30 propiedades de golpe, o limpieza grande):

```
node scripts/sync-wasi.mjs --force
```

El flag loguea `⚠ --force enabled — safety thresholds bypassed` para que quede en el audit trail.

---

## Pendiente para arrancar

- [x] Carlos genera el token en su cuenta de WASI y lo comparte
- [x] Agregar `WASI_ID_COMPANY` y `WASI_TOKEN` a `.env.local`
- [x] Adaptar `scripts/import-wasi.mjs` → `scripts/sync-wasi.mjs` con paginación y galería completa
- [x] Probar con 1 propiedad antes de sincronización completa
- [ ] Agregar secrets a GitHub (`WASI_ID_COMPANY`, `WASI_TOKEN`, `SANITY_WRITE_TOKEN`, `REVALIDATION_SECRET`)
- [ ] Configurar GitHub Action (cron 6h con safety nets activos)
- [ ] Cleanup mensual de assets orphan (post-launch)
