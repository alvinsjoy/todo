import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(request: Request) {
  const authHeader = request.headers.get("x-api-key");
  const PingKey = process.env.PING_API_KEY;

  if (!PingKey) {
    console.error("PING_API_KEY is not set");
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  if (authHeader !== PingKey) {
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
