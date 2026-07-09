import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/server/supabase/server";

type QueryResult = {
  data: unknown;
  error: { message: string } | null;
};

type QueryBuilder = {
  select: (columns: string) => {
    eq: (column: string, value: string) => Promise<QueryResult>;
  };
};

type GenericSupabaseClient = {
  from: (table: string) => QueryBuilder;
};

const userTables = [
  "profiles",
  "settings",
  "subscriptions",
  "courses",
  "documents",
  "care_plans",
  "transmissions",
  "revision_cards",
  "results",
  "dose_attempts",
  "stages",
  "notes",
  "notifications"
] as const;

export const runtime = "nodejs";

export async function GET() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Non connecté." }, { status: 401 });
  }

  const genericSupabase = supabase as unknown as GenericSupabaseClient;
  const exportedAt = new Date().toISOString();
  const payload: Record<string, unknown> = {
    exported_at: exportedAt,
    account: {
      id: user.id,
      email: user.email
    }
  };

  for (const table of userTables) {
    const ownerColumn = table === "profiles" ? "id" : "user_id";
    const { data, error } = await genericSupabase.from(table).select("*").eq(ownerColumn, user.id);
    payload[table] = error ? { error: error.message } : data;
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "content-disposition": `attachment; filename="nurseai-export-${exportedAt.slice(0, 10)}.json"`,
      "content-type": "application/json; charset=utf-8"
    }
  });
}
