import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const payload = verifyToken(request);
  if (!payload) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const rows = await query("SELECT id, name, email, created_at FROM users WHERE id = ?", [payload.id]);
    if (rows.length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Get me error:", err);
    return NextResponse.json({ error: "Failed to get user" }, { status: 500 });
  }
}
