import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id: listId, itemId } = await params;
  try {
    // Verify list ownership
    const lists = await query("SELECT id FROM shopping_lists WHERE id = ? AND user_id = ?", [listId, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    const body = await request.json();
    const allowed = ["quantity", "notes", "is_purchased", "best_price", "best_store", "best_deal_url", "last_price_check"];
    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];

    for (const [key, value] of Object.entries(body)) {
      if (allowed.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value as string | number | boolean | null);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    values.push(itemId);
    await query(`UPDATE shopping_list_items SET ${fields.join(", ")} WHERE id = ?`, values);

    const rows = await query("SELECT * FROM shopping_list_items WHERE id = ?", [itemId]);
    if (rows.length === 0) return NextResponse.json({ error: "Item not found" }, { status: 404 });

    return NextResponse.json(rows[0]);
  } catch (err) {
    console.error("Update item error:", err);
    return NextResponse.json({ error: "Failed to update item" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; itemId: string }> }
) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id: listId, itemId } = await params;
  try {
    const lists = await query("SELECT id FROM shopping_lists WHERE id = ? AND user_id = ?", [listId, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    await query("DELETE FROM shopping_list_items WHERE id = ?", [itemId]);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete item error:", err);
    return NextResponse.json({ error: "Failed to delete item" }, { status: 500 });
  }
}
