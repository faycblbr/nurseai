import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default("http://localhost:3000"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  OPENAI_MODEL: z.string().default("gpt-4.1-mini"),
  AI_MONTHLY_QUOTA: z.coerce.number().int().positive().default(100),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_PRICE_ID: z.string().optional(),
  APPLE_BUNDLE_ID: z.string().default("com.webfabricpro.nurseai"),
  APPLE_PREMIUM_PRODUCT_ID: z.string().default("premium_monthly"),
  APPLE_APP_STORE_CONNECT_ISSUER_ID: z.string().optional(),
  APPLE_APP_STORE_CONNECT_KEY_ID: z.string().optional(),
  APPLE_APP_STORE_CONNECT_PRIVATE_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
