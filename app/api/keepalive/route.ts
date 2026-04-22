import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  await supabase.from("products").select("id").limit(1);

  return Response.json({ ok: true, timestamp: new Date().toISOString() });
}
