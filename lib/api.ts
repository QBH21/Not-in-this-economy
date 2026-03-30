const API_BASE = "/api";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
}

async function request<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers,
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(error.error || error.message || "Something went wrong");
  }

  return res.json();
}

/* ---------- Types ---------- */

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ShoppingList {
  id: number;
  name: string;
  created_at: string;
  updated_at: string;
  items?: ShoppingListItem[];
}

export interface ShoppingListItem {
  id: number;
  list_id: number;
  product_name: string;
  quantity: number;
  notes: string | null;
  best_price: number | null;
  best_store: string | null;
  best_deal_url: string | null;
  last_price_check: string | null;
  is_purchased: boolean;
}

export interface SearchResult {
  id: string;
  name: string;
  price: number | null;
  currency: string;
  store: string;
  productUrl: string | null;
  imageUrl: string | null;
  rating: number | null;
  reviewCount: number | null;
  shipping: string | null;
  offers: string | null;
  condition: string;
  source: string;
}

export interface PriceResult {
  store_name: string;
  price: number;
  currency: string;
  product_url: string;
  image_url: string | null;
  in_stock: boolean;
}

/* ---------- Auth ---------- */

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function getMe(): Promise<User> {
  return request<User>("/auth/me");
}

/* ---------- Shopping Lists ---------- */

export async function getLists(): Promise<ShoppingList[]> {
  return request<ShoppingList[]>("/lists");
}

export async function getList(id: number): Promise<ShoppingList> {
  return request<ShoppingList>(`/lists/${id}`);
}

export async function createList(name: string): Promise<ShoppingList> {
  return request<ShoppingList>("/lists", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function updateList(
  id: number,
  name: string
): Promise<ShoppingList> {
  return request<ShoppingList>(`/lists/${id}`, {
    method: "PUT",
    body: JSON.stringify({ name }),
  });
}

export async function deleteList(id: number): Promise<void> {
  return request<void>(`/lists/${id}`, { method: "DELETE" });
}

export async function addItem(
  listId: number,
  item: { product_name: string; quantity?: number; notes?: string }
): Promise<ShoppingListItem> {
  return request<ShoppingListItem>(`/lists/${listId}/items`, {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function updateItem(
  listId: number,
  itemId: number,
  data: Partial<ShoppingListItem>
): Promise<ShoppingListItem> {
  return request<ShoppingListItem>(`/lists/${listId}/items/${itemId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteItem(
  listId: number,
  itemId: number
): Promise<void> {
  return request<void>(`/lists/${listId}/items/${itemId}`, {
    method: "DELETE",
  });
}

/* ---------- Search ---------- */

export async function searchProducts(
  query: string
): Promise<SearchResult[]> {
  const data = await request<{ query: string; count: number; products: SearchResult[] }>(
    `/search?q=${encodeURIComponent(query)}`
  );
  return data.products;
}

/* ---------- Prices ---------- */

export async function getProductPrices(
  productId: string
): Promise<PriceResult[]> {
  return request<PriceResult[]>(`/prices/${encodeURIComponent(productId)}`);
}

export async function checkListPrices(
  listId: number
): Promise<ShoppingListItem[]> {
  return request<ShoppingListItem[]>(`/prices/check-list/${listId}`, {
    method: "POST",
  });
}
