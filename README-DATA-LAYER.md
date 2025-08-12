# Data layer, smart loaders, and config API

This project centralizes content in `/data/{env}` with Zod validation and provides hybrid loaders (FS or API) that switch based on feature flags.

## Smart loaders

- `getMenuSmart`
- `getMarketingSmart`
- `getRestaurantSmart`

Behavior:
- If `cms.enabled` or `featureFlags.cms` is true and an API endpoint is configured (or `api.baseUrl` exists), the loader fetches from the API first.
- On failure or when disabled, it falls back to the filesystem JSON under `data/{env}`.

## API endpoints

- `/api/menu`
- `/api/marketing`
- `/api/restaurant`
- `/api/config` (safe client config)

These endpoints return Zod-validated JSON and emit cache headers for ISR-friendly behavior using `s-maxage` and `stale-while-revalidate`.

## Config API

`/api/config` returns:
- `env`: `dev | staging | prod`
- `featureFlags`: `{ [key: string]: boolean }`
- `api`: `{ baseUrl?, menuEndpoint?, marketingEndpoint?, restaurantEndpoint? }`
- `cms`: `{ enabled: boolean }`
- `metadata`: `{ appName: string, domainName: string }`

## Toggle behavior

Edit `data/{env}/config.json` to switch modes. Example dev config:

```json
{
  "env": "dev",
  "featureFlags": { "cms": true },
  "api": {
    "baseUrl": "http://localhost:3000",
    "menuEndpoint": "http://localhost:3000/api/menu",
    "marketingEndpoint": "http://localhost:3000/api/marketing",
    "restaurantEndpoint": "http://localhost:3000/api/restaurant"
  },
  "cms": { "enabled": true },
  "metadata": { "appName": "Old Crown", "domainName": "localhost" }
}
```

## Client usage

- Use SWR hooks where convenient, or call the API directly.
- Server components should prefer the smart loaders.

## Tests

Jest tests cover:
- Schema validation, loader behavior, and smart loader fallbacks.
- ErrorBoundary renders fallback correctly.

