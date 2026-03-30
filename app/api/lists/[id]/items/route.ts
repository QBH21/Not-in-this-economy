import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id: listId } = await params;
  try {
    // Verify list ownership
    const lists = await query("SELECT id FROM shopping_lists WHERE id = ? AND user_id = ?", [listId, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    const { product_name, quantity = 1, notes = "" } = await request.json();
    if (!product_name || !product_name.trim()) {
      return NextResponse.json({ error: "Product name is required" }, { status: 400 });
    }

    const result = await query(
      "INSERT INTO shopping_list_items (list_id, product_name, quantity, notes) VALUES (?, ?, ?, ?)",
      [listId, product_name.trim(), quantity, notes]
    ) as unknown as { insertId: number };

    return NextResponse.json({
      id: result.insertId,
      list_id: parseInt(listId),
      product_name: product_name.trim(),
      quantity,
      notes,
      best_price: null,
      best_store: null,
      best_deal_url: null,
      is_purchased: false,
      created_at: new Date(),
    }, { status: 201 });
  } catch (err) {
    console.error("Add item error:", err);
    return NextResponse.json({ error: "Failed to add item" }, { status: 500 });
  }
}
