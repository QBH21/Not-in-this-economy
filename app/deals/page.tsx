"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import EmptyState from "@/components/EmptyState";
import ToastContainer, { toast } from "@/components/Toast";
import Modal from "@/components/Modal";
import { CardSkeleton } from "@/components/Skeleton";
import { searchProducts, getLists, addItem, type SearchResult, type ShoppingList } from "@/lib/api";
import { useAuth } from "@/lib/auth";

const sortOptions = [
  { value: "relevance", label: "Relevance" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "rating", label: "Best Rated" },
];

function DealsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [searchInput, setSearchInput] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  // Add-to-list modal state
  const [showListModal, setShowListModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SearchResult | null>(null);
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [listsLoading, setListsLoading] = useState(false);

  const doSearch = useCallback(
    async (q: string) => {
      if (!q.trim()) return;
      setLoading(true);
      setSearched(true);
      try {
        const data = await searchProducts(q.trim());
        setResults(data);
      } catch {
        setResults([]);
        toast("Search broke. Just like your budget.", "error");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (initialQuery) doSearch(initialQuery);
  }, [initialQuery, doSearch]);

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (searchInput.trim()) {
      setQuery(searchInput.trim());
      router.replace(`/deals?q=${encodeURIComponent(searchInput.trim())}`);
      doSearch(searchInput.trim());
    }
  }

  function handleAddToList(product: SearchResult) {
    if (!user) {
      router.push("/login");
      return;
    }
    setSelectedProduct(product);
    setShowListModal(true);
    setListsLoading(true);
    getLists()
      .then(setLists)
      .catch(() => toast("Lists ghosted us rn", "error"))
      .finally(() => setListsLoading(false));
  }

  async function handlePickList(listId: number) {
    if (!selectedProduct) return;
    try {
      await addItem(listId, { product_name: selectedProduct.name });
      toast("Added to list! Your future self is already judging you.");
      setShowListModal(false);
    } catch {
      toast("Couldn't add it. The universe is protecting your wallet.", "error");
    }
  }

  const sorted = [...results].sort((a, b) => {
    if (sortBy === "price-low") return (a.price ?? Infinity) - (b.price ?? Infinity);
    if (sortBy === "price-high") return (b.price ?? 0) - (a.price ?? 0);
    if (sortBy === "rating") return (b.rating ?? 0) - (a.rating ?? 0);
    return 0;
  });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Search header */}
      <div className="bg-white border-b border-gray-100 px-3 sm:px-4 py-3 sm:py-5">
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
          <div className="flex items-center bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#7c3aed] focus-within:shadow-[4px_4px_0px_0px_#10b981] transition-shadow">
            <svg
              className="ml-3 sm:ml-4 shrink-0 text-gray-400"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search for something your wallet will regret..."
              className="flex-1 px-2 sm:px-3 py-2.5 sm:py-3 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
            <button
              type="submit"
              className="m-1.5 px-4 sm:px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-violet-600 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-4 sm:py-6 pb-24 sm:pb-6">
        {searched && !loading && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-5">
            <p className="text-sm text-gray-500">
              {results.length > 0 ? (
                <>
                  <span className="font-semibold text-gray-900">{results.length}</span>{" "}
                  results for &quot;{query}&quot;
                </>
              ) : (
                <>No results for &quot;{query}&quot;</>
              )}
            </p>
            {results.length > 0 && (
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 text-gray-600 bg-white focus:outline-none focus:ring-2 focus:ring-violet-200"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : sorted.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
            {sorted.map((product, i) => (
              <ProductCard
                key={`${product.name}-${i}`}
                product={product}
                onAddToList={handleAddToList}
              />
            ))}
          </div>
        ) : searched ? (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                <line x1="8" y1="11" x2="14" y2="11" />
              </svg>
            }
            title="The deals said no"
            subtitle="Nothing found. Maybe try something less bougie? We check prices every 6 hours tho."
            action={
              <button
                onClick={() => {
                  setSearchInput("");
                  setSearched(false);
                  setResults([]);
                }}
                className="px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                Clear search
              </button>
            }
          />
        ) : (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            }
            title="Go ahead, start searching"
            subtitle="Type something above and we'll find you the cheapest option. No judgment. Mostly."
          />
        )}
      </main>

      {/* Add to List Modal */}
      <Modal open={showListModal} onClose={() => setShowListModal(false)} title="Add to shopping list">
        {listsLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton h-12 rounded-xl" />
            ))}
          </div>
        ) : lists.length > 0 ? (
          <div className="space-y-2">
            <p className="text-xs text-gray-400 mb-3">
              Adding: <span className="font-medium text-gray-600">{selectedProduct?.name}</span>
            </p>
            {lists.map((list) => (
              <button
                key={list.id}
                onClick={() => handlePickList(list.id)}
                className="w-full text-left px-4 py-3 border-2 border-gray-100 rounded-xl hover:border-violet-300 hover:bg-violet-50 transition-all flex items-center justify-between group"
              >
                <span className="text-sm font-medium text-gray-900">{list.name}</span>
                <svg
                  className="text-gray-300 group-hover:text-violet-500 transition-colors"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-sm text-gray-400 mb-3">No lists yet. Living dangerously, are we?</p>
            <a
              href="/list"
              className="inline-block px-4 py-2 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
            >
              Create a list
            </a>
          </div>
        )}
      </Modal>

      <ToastContainer />
    </div>
  );
}

export default function DealsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <DealsContent />
    </Suspense>
  );
}
