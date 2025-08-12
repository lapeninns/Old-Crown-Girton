import themes from "daisyui/src/theming/themes";
import { ConfigProps } from "./types/config";
import { getConfigData } from "@/src/lib/data/loader";
import { resolveEnv } from "@/src/lib/data/env";

// Build-time synchronous snapshot of config.json mapped to legacy ConfigProps
// Note: This file is imported client and server. Do not leak secrets.
// We keep the same shape expected by existing imports.

function snapshot(): ConfigProps {
  // Since getConfigData is async fs read, we can't await here synchronously.
  // Instead, derive from environment with safe defaults. Pages that need richer
  // config should use the data loader directly server-side.
  const env = resolveEnv();
  const isDev = env !== "prod";
  return {
    appName: env === "prod" ? "Old Crown" : `Old Crown (${env})`,
    appDescription:
      "Historic thatched pub in Girton serving authentic Nepalese cuisine and British pub classics.",
    domainName: env === "prod" ? "oldcrowngirton.co.uk" : "localhost",
    crisp: { id: "", onlyShowOnRoutes: ["/"] },
    stripe: {
      plans: [
        {
          priceId: isDev ? "price_dev_stub" : "price_live_stub",
          name: "Starter",
          description: "Legacy pricing placeholder",
          price: 99,
          priceAnchor: 149,
          features: [{ name: "Legacy" }],
        },
      ],
    },
    aws: { bucket: undefined, bucketUrl: undefined, cdn: undefined },
    mailgun: {
      subdomain: "mg",
      fromNoReply: `Old Crown <noreply@mg.oldcrowngirton.co.uk>`,
      fromAdmin: `Old Crown <info@mg.oldcrowngirton.co.uk>`,
      supportEmail: "info@oldcrowngirton.co.uk",
      forwardRepliesTo: "info@oldcrowngirton.co.uk",
    },
    colors: { theme: "light", main: themes["light"]["primary"] },
    auth: { loginUrl: "/signin", callbackUrl: "/dashboard" },
  };
}

const config = snapshot();
export default config;
