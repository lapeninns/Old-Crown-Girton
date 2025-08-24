export type AppEnv = "dev" | "staging" | "prod";

export function resolveEnv(): AppEnv {
  // Check for explicit environment variables first
  const fromVar = (process.env.NEXT_PUBLIC_APP_ENV || process.env.APP_ENV || "").toLowerCase();
  if (fromVar === "staging" || fromVar === "prod" || fromVar === "dev") {
    return fromVar as AppEnv;
  }
  
  // In development server (npm run dev), always return dev
  if (process.env.NODE_ENV === "development") {
    return "dev";
  }
  
  // Default fallback based on NODE_ENV
  return process.env.NODE_ENV === "production" ? "prod" : "dev";
}
