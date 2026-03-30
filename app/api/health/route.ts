import { NextResponse } from "next/server";
import { query } from "@/lib/db";

export async function GET() {
  let db = "not tested";
  try {
    await query("SELECT 1");
    db = "connected";
  } catch (err) {
    db = `error: ${err instanceof Error ? err.message : String(err)}`;
  }

  return NextResponse.json({
    status: "ok",
    app: "Not in this economy",
    timestamp: new Date().toISOString(),
    db,
    hasDbUrl: !!process.env.MYSQL_PUBLIC_URL,
    hasJwt: !!process.env.JWT_SECRET,
    hasSerper: !!process.env.SERPER_API_KEY,
  });
}
