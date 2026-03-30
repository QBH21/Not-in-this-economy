import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

export async function GET(request: NextRequest) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const lists = await query("SELECT * FROM shopping_lists WHERE user_id = ? ORDER BY updated_at DESC", [payload.id]);
    return NextResponse.json(lists);
  } catch (err) {
    console.error("Get lists error:", err);
    return NextResponse.json({ error: "Failed to load lists" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "List name is required" }, { status: 400 });
    }

    const result = await query("INSERT INTO shopping_lists (name, user_id) VALUES (?, ?)", [name.trim(), payload.id]) as unknown as { insertId: number };

    return NextResponse.json({
      id: result.insertId,
      name: name.trim(),
      user_id: payload.id,
      created_at: new Date(),
      updated_at: new Date(),
    }, { status: 201 });
  } catch (err) {
    console.error("Create list error:", err);
    return NextResponse.json({ error: "Failed to create list" }, { status: 500 });
  }
}
