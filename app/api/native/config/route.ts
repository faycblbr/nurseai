import { NextResponse } from "next/server";
import { env } from "@/lib/env";
import { getRequestAppUrl } from "@/lib/app-url";

export function GET(request: Request) {
  return NextResponse.json({
    app: "NurseAI",
    appUrl: getRequestAppUrl(request),
    apple: {
      bundleId: env.APPLE_BUNDLE_ID,
      premiumProductId: env.APPLE_PREMIUM_PRODUCT_ID
    }
  });
}
