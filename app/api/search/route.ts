import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const SERPER_URL = "https://google.serper.dev/shopping";

function parsePrice(value: unknown): number | null {
  if (value == null) return null;
  if (typeof value === "number") return value;
  const cleaned = String(value).replace(/[^0-9.]/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? null : parsed;
}

function formatDelivery(delivery: unknown): string | null {
  if (!delivery) return null;
  if (typeof delivery === "string") return delivery;
  if (typeof delivery === "object" && delivery !== null) {
    const d = delivery as Record<string, string>;
    const parts: string[] = [];
    if (d.price) parts.push(d.price === "Free" ? "Free Shipping" : `Shipping: ${d.price}`);
    if (d.by) parts.push(`by ${d.by}`);
    return parts.join(" ") || null;
  }
  return null;
}

interface SerperItem {
  productId?: string;
  position?: number;
  title?: string;
  price?: string;
  source?: string;
  link?: string;
  imageUrl?: string;
  rating?: number;
  ratingCount?: number;
  delivery?: unknown;
  offers?: string;
}

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q");
  if (!q || !q.trim()) {
    return NextResponse.json({ error: "Search query is required" }, { status: 400 });
  }

  const apiKey = process.env.SERPER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ query: q, count: 0, products: [] });
  }

  try {
    const response = await axios.post(
      SERPER_URL,
      { q: q.trim(), gl: "us", hl: "en", num: 20, autocorrect: true },
      {
        headers: { "X-API-KEY": apiKey, "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    const items: SerperItem[] = response.data?.shopping || [];
    const products = items
      .map((item) => ({
        id: `serper_${item.productId || item.position || Math.random().toString(36).slice(2)}`,
        name: item.title || "Unknown Product",
        price: parsePrice(item.price),
        currency: "USD",
        store: item.source || "Unknown Store",
        productUrl: item.link || null,
        imageUrl: item.imageUrl || null,
        rating: item.rating || null,
        reviewCount: item.ratingCount || null,
        shipping: formatDelivery(item.delivery),
        offers: item.offers || null,
        condition: "New",
        source: "serper",
      }))
      .filter((p) => p.name && p.price != null);

    return NextResponse.json({ query: q, count: products.length, products });
  } catch (err) {
    console.error("Search error:", err);
    return NextResponse.json({ query: q, count: 0, products: [] });
  }
}
