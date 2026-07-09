import { headers } from "next/headers";
import { env } from "@/lib/env";

export function getRequestAppUrl(request: Request) {
  return new URL(request.url).origin;
}

export async function getServerActionAppUrl() {
  const headerList = await headers();
  const host = headerList.get("x-forwarded-host") ?? headerList.get("host");
  const protocol = headerList.get("x-forwarded-proto") ?? (host?.includes("localhost") ? "http" : "https");

  if (!host) {
    return env.NEXT_PUBLIC_APP_URL;
  }

  return `${protocol}://${host}`;
}
