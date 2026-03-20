import 'server-only';

import fs from 'fs/promises';
import path from 'path';
import { resolveContentEnvChain, type AppEnv } from './env';
import { ContentSchema, type Content } from './schemas';

function configPath(file: string) {
  return path.join(process.cwd(), 'config', file);
}

function dataPath(env: string, file: string) {
  return path.join(process.cwd(), 'data', env, file);
}

async function readJsonIfExists(filePath: string): Promise<any | null> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw);
  } catch (error: any) {
    if (error?.code === 'ENOENT') {
      return null;
    }
    throw error;
  }
}

function cloneValue<T>(value: T): T {
  if (Array.isArray(value)) {
    return value.map((item) => cloneValue(item)) as unknown as T;
  }

  if (value && typeof value === 'object') {
    const result: Record<string, any> = {};
    for (const [key, nestedValue] of Object.entries(value)) {
      result[key] = cloneValue(nestedValue);
    }
    return result as T;
  }

  return value;
}

function mergeContentValue(base: any, override: any): any {
  if (override === undefined || override === null) {
    return cloneValue(base);
  }

  if (base === undefined || base === null) {
    return cloneValue(override);
  }

  if (Array.isArray(override)) {
    return cloneValue(override);
  }

  if (Array.isArray(base)) {
    return cloneValue(override);
  }

  if (typeof base === 'object' && typeof override === 'object') {
    const result: Record<string, any> = { ...cloneValue(base) };
    for (const key of Object.keys(override)) {
      result[key] = mergeContentValue((result as any)[key], override[key]);
    }
    return result;
  }

  return cloneValue(override);
}

export async function loadMergedContentFromFilesystem(env: AppEnv): Promise<Content> {
  const baseContent = await readJsonIfExists(configPath('content.json'));
  if (!baseContent) {
    throw new Error('Missing config/content.json');
  }

  let merged = baseContent;
  const envChain = resolveContentEnvChain(env);

  for (const envName of envChain) {
    try {
      const override = await readJsonIfExists(dataPath(envName, 'content.json'));
      if (override) {
        merged = mergeContentValue(merged, override);
      }
    } catch (error) {
      console.warn(`Failed to load content override for ${envName}:`, error);
    }
  }

  return ContentSchema.parse(merged) as Content;
}
