export type AppEnv = "dev" | "staging" | "prod";

export function resolveEnv(): AppEnv {
  const fromVar = (process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || "").toLowerCase();
  if (fromVar === "staging" || fromVar === "prod" || fromVar === "dev") return fromVar as AppEnv;
  return process.env.NODE_ENV === "production" ? "prod" : "dev";
}
