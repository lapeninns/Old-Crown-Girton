export type AppEnv = "app";

export function resolveEnv(): AppEnv {
  // Always return 'app' for single environment setup
  return "app";
}
