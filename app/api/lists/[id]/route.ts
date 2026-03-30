import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  try {
    const lists = await query("SELECT * FROM shopping_lists WHERE id = ? AND user_id = ?", [id, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    const items = await query(
      "SELECT * FROM shopping_list_items WHERE list_id = ? ORDER BY is_purchased ASC, created_at DESC",
      [id]
    );

    return NextResponse.json({ ...lists[0], items });
  } catch (err) {
    console.error("Get list error:", err);
    return NextResponse.json({ error: "Failed to load list" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  try {
    const { name } = await request.json();
    if (!name || !name.trim()) {
      return NextResponse.json({ error: "List name is required" }, { status: 400 });
    }

    await query("UPDATE shopping_lists SET name = ? WHERE id = ? AND user_id = ?", [name.trim(), id, payload.id]);
    const lists = await query("SELECT * FROM shopping_lists WHERE id = ? AND user_id = ?", [id, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    return NextResponse.json(lists[0]);
  } catch (err) {
    console.error("Update list error:", err);
    return NextResponse.json({ error: "Failed to update list" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  try {
    await query("DELETE FROM shopping_lists WHERE id = ? AND user_id = ?", [id, payload.id]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete list error:", err);
    return NextResponse.json({ error: "Failed to delete list" }, { status: 500 });
  }
}
