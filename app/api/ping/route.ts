import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/client";

export async function GET(request: Request) {
  const supabase = createClient();
  const authHeader = request.headers.get("authorization");
  const expectedAuthHeader = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedAuthHeader) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data, error } = await supabase.from("todos").select("id").limit(1);
    if (error) throw error;

    return NextResponse.json({
      message: "Ping successful",
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("Ping error:", error);
    return NextResponse.json(
      { error: "Ping failed", details: error.message },
      { status: 500 }
    );
  }
}
