import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { query } from "@/lib/db";
import { verifyToken } from "@/lib/auth-server";

const SERPER_URL = "https://google.serper.dev/shopping";

function parsePrice(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

async function findBestDeal(productName: string) {
  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) return null;

  try {
    const response = await axios.post(
      SERPER_URL,
      { q: productName, gl: "us", hl: "en", num: 10, autocorrect: true },
      {
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const items = (response.data?.shopping || []) as Array<{
      title?: string;
      price?: string;
      source?: string;
      link?: string;
    }>;

    const results = items
      .map((item) => ({
        name: item.title || "",
        price: parsePrice(item.price),
        store: item.source || "Unknown",
        productUrl: item.link || null,
      }))
      .filter((p) => p.price != null)
      .sort((a, b) => (a.price || Infinity) - (b.price || Infinity));

    return results[0] || null;
  } catch {
    return null;
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ listId: string }> }
) {
  const payload = verifyToken(request);
  if (!payload) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { listId } = await params;
  try {
    // Verify list ownership
    const lists = await query("SELECT id FROM shopping_lists WHERE id = ? AND user_id = ?", [listId, payload.id]);
    if (lists.length === 0) return NextResponse.json({ error: "List not found" }, { status: 404 });

    const items = await query(
      "SELECT * FROM shopping_list_items WHERE list_id = ? ORDER BY created_at DESC",
      [listId]
    );

    const updatedItems = await Promise.all(
      items.map(async (item) => {
        try {
          const best = await findBestDeal(item.product_name as string);
          if (best) {
            await query(
              "UPDATE shopping_list_items SET best_price = ?, best_store = ?, best_deal_url = ?, last_price_check = ? WHERE id = ?",
              [best.price, best.store, best.productUrl, new Date().toISOString(), item.id as number]
            );
            return {
              ...item,
              best_price: best.price,
              best_store: best.store,
              best_deal_url: best.productUrl,
              last_price_check: new Date(),
            };
          }
        } catch {
          // skip failed items
        }
        return item;
      })
    );

    return NextResponse.json(updatedItems);
  } catch (err) {
    console.error("Check list prices error:", err);
    return NextResponse.json({ error: "Failed to check prices" }, { status: 500 });
  }
}
