export type AppEnv = 'app' | 'dev' | 'staging' | 'prod';
export type ContentEnv = 'dev' | 'staging' | 'prod';

const ENV_ALIASES: Record<string, AppEnv> = {
  app: 'app',
  prod: 'prod',
  production: 'prod',
  main: 'prod',
  release: 'prod',
  live: 'prod',
  staging: 'staging',
  preview: 'staging',
  preprod: 'staging',
  qa: 'staging',
  test: 'dev',
  testing: 'dev',
  ci: 'dev',
  development: 'dev',
  dev: 'dev',
  local: 'dev'
};

function normalizeAppEnv(value?: string | null): AppEnv | null {
  if (!value) return null;
  return ENV_ALIASES[value.toLowerCase()] ?? null;
}

/**
 * Resolve the current application environment.
 * Falls back to 'dev' for local workflows unless explicitly overridden.
 */
export function resolveEnv(): AppEnv {
  const candidates = [
    process.env.CONTENT_ENV,
    process.env.NEXT_PUBLIC_CONTENT_ENV,
    process.env.APP_ENV,
    process.env.NEXT_PUBLIC_APP_ENV,
    process.env.VERCEL_ENV
  ];

  for (const candidate of candidates) {
    const normalized = normalizeAppEnv(candidate);
    if (normalized) {
      // Preserve explicit 'app' usage for backward compatibility
      if (candidate && candidate.toLowerCase() === 'app') {
        return 'app';
      }
      return normalized;
    }
  }

  return 'app';
}

/**
 * Convert any environment hint into a concrete content environment folder.
 */
export function toContentEnv(value?: string | AppEnv | null): ContentEnv | null {
  if (!value) return null;
  const normalized =
    typeof value === 'string' ? normalizeAppEnv(value) : value;
  if (!normalized) return null;
  return normalized === 'app' ? 'prod' : normalized;
}

/**
 * Determine the ordered list of environment folders to consult for content overrides.
 * Later entries have higher precedence and should be merged last.
 */
export function resolveContentEnvChain(explicitEnv?: AppEnv): ContentEnv[] {
  const chain: ContentEnv[] = [];
  const pushEnv = (value?: string | AppEnv | null) => {
    const env = toContentEnv(value);
    if (env && !chain.includes(env)) {
      chain.push(env);
    }
  };

  // Runtime hints (lowest precedence)
  const runtimeCandidates = [
    process.env.CONTENT_ENV,
    process.env.NEXT_PUBLIC_CONTENT_ENV,
    process.env.APP_ENV,
    process.env.NEXT_PUBLIC_APP_ENV,
    process.env.VERCEL_ENV,
    process.env.NODE_ENV
  ];

  for (const candidate of runtimeCandidates) {
    pushEnv(candidate);
  }

  // Explicit env parameter (highest precedence)
  if (explicitEnv) {
    pushEnv(explicitEnv);
  }

  if (chain.length === 0) {
    chain.push('dev');
  }

  return chain;
}
