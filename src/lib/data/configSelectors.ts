import { getConfigData } from './loader';
import { resolveEnv, type AppEnv } from './env';
import type { AppConfig } from './schemas';

export async function isFeatureEnabled(name: string, env: AppEnv = resolveEnv()): Promise<boolean> {
  const cfg = await getConfigData(env);
  return Boolean(cfg.featureFlags?.[name]);
}

export async function getApiConfig(env: AppEnv = resolveEnv()): Promise<AppConfig['api']> {
  const cfg = await getConfigData(env);
  return cfg.api;
}

export async function getEnvMetadata(env: AppEnv = resolveEnv()): Promise<{ env: AppEnv; metadata: AppConfig['metadata'] }> {
  const cfg = await getConfigData(env);
  return { env: cfg.env as AppEnv, metadata: cfg.metadata };
}
