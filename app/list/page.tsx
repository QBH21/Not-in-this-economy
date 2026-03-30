"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth";
import Navbar from "@/components/Navbar";
import EmptyState from "@/components/EmptyState";
import Modal from "@/components/Modal";
import ToastContainer, { toast } from "@/components/Toast";
import { ListSkeleton } from "@/components/Skeleton";
import {
  getLists,
  getList,
  createList,
  deleteList,
  addItem,
  updateItem,
  deleteItem,
  checkListPrices,
  type ShoppingList,
  type ShoppingListItem,
} from "@/lib/api";

function formatPrice(p: number | null) {
  if (p === null) return null;
  return `$${p.toFixed(2)}`;
}

/* ─── Item row ─── */
function ItemRow({
  item,
  listId,
  onUpdate,
}: {
  item: ShoppingListItem;
  listId: number;
  onUpdate: () => void;
}) {
  const [deleting, setDeleting] = useState(false);

  async function togglePurchased() {
    try {
      await updateItem(listId, item.id, { is_purchased: !item.is_purchased });
      onUpdate();
    } catch {
      toast("Update failed", "error");
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteItem(listId, item.id);
      toast("Removed. Self-control unlocked.");
      onUpdate();
    } catch {
      toast("Delete failed", "error");
      setDeleting(false);
    }
  }

  return (
    <div
      className={`flex items-center gap-2 sm:gap-3 px-2.5 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all ${
        item.is_purchased ? "bg-gray-50 opacity-60" : "hover:bg-gray-50"
      } ${deleting ? "opacity-30 pointer-events-none" : ""}`}
    >
      <button
        onClick={togglePurchased}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${
          item.is_purchased
            ? "bg-emerald-500 border-emerald-500 text-white"
            : "border-gray-300 hover:border-violet-400"
        }`}
      >
        {item.is_purchased && (
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            item.is_purchased ? "line-through text-gray-400" : "text-gray-900"
          }`}
        >
          {item.product_name}
        </p>
        {item.notes && (
          <p className="text-xs text-gray-400 truncate">{item.notes}</p>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {item.best_price !== null && (
          <div className="text-right">
            <p className="text-sm font-bold text-emerald-600">
              {formatPrice(item.best_price)}
            </p>
            {item.best_store && (
              <p className="text-[10px] text-gray-400">{item.best_store}</p>
            )}
          </div>
        )}
        {item.best_deal_url && (
          <a
            href={item.best_deal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 hover:text-violet-600 hover:bg-violet-50 transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        )}
        <button
          onClick={handleDelete}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-2 14a2 2 0 01-2 2H9a2 2 0 01-2-2L5 6" />
            <path d="M10 11v6" />
            <path d="M14 11v6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

/* ─── List card ─── */
function ListCard({
  list,
  onRefresh,
}: {
  list: ShoppingList;
  onRefresh: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [detail, setDetail] = useState<ShoppingList | null>(null);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [addingItem, setAddingItem] = useState(false);
  const [checking, setChecking] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const loadDetail = useCallback(async () => {
    setLoadingDetail(true);
    try {
      const d = await getList(list.id);
      setDetail(d);
    } catch {
      toast("Failed to load list", "error");
    } finally {
      setLoadingDetail(false);
    }
  }, [list.id]);

  useEffect(() => {
    if (expanded && !detail) loadDetail();
  }, [expanded, detail, loadDetail]);

  async function handleAddItem(e: React.FormEvent) {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setAddingItem(true);
    try {
      await addItem(list.id, {
        product_name: newItemName.trim(),
        notes: newItemNotes.trim() || undefined,
      });
      setNewItemName("");
      setNewItemNotes("");
      setShowAddItem(false);
      toast("Added! One step closer to financial ruin.");
      loadDetail();
    } catch {
      toast("Couldn't add it. Maybe it's a sign.", "error");
    } finally {
      setAddingItem(false);
    }
  }

  async function handleCheckPrices() {
    setChecking(true);
    try {
      await checkListPrices(list.id);
      toast("Prices updated! Brace yourself.");
      loadDetail();
    } catch {
      toast("Price check failed. Ignorance is bliss anyway.", "error");
    } finally {
      setChecking(false);
    }
  }

  async function handleDeleteList() {
    if (!confirm(`Delete "${list.name}"? Gone forever, like your savings.`)) return;
    setDeleting(true);
    try {
      await deleteList(list.id);
      toast("List deleted. Out of sight, out of budget.");
      onRefresh();
    } catch {
      toast("Delete failed", "error");
      setDeleting(false);
    }
  }

  const items = detail?.items || [];
  const purchasedCount = items.filter((i) => i.is_purchased).length;

  return (
    <div
      className={`bg-white border-2 rounded-2xl transition-all ${
        expanded ? "border-violet-200 shadow-[4px_4px_0px_0px_#7c3aed]" : "border-gray-100 hover:border-gray-200"
      } ${deleting ? "opacity-30 pointer-events-none" : ""}`}
    >
      {/* Header */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-3 sm:px-5 py-3 sm:py-4 text-left"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div
            className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
              expanded ? "bg-violet-100 text-violet-600" : "bg-gray-100 text-gray-400"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 01-8 0" />
            </svg>
          </div>
          <div className="min-w-0">
            <h3 className="text-sm font-bold text-gray-900 truncate">{list.name}</h3>
            <p className="text-xs text-gray-400">
              {new Date(list.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <svg
          className={`shrink-0 text-gray-400 transition-transform ${expanded ? "rotate-180" : ""}`}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="border-t border-gray-100">
          {/* Action bar */}
          <div className="flex flex-wrap items-center gap-2 px-3 sm:px-5 py-2.5 sm:py-3 border-b border-gray-50">
            <button
              onClick={() => setShowAddItem(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-violet-600 transition-colors"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add item
            </button>
            <button
              onClick={handleCheckPrices}
              disabled={checking || items.length === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-emerald-200 text-emerald-600 text-xs font-semibold rounded-lg hover:bg-emerald-50 transition-colors disabled:opacity-40"
            >
              {checking ? (
                <div className="w-3 h-3 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              ) : (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
                </svg>
              )}
              Check prices
            </button>
            <div className="flex-1" />
            <button
              onClick={handleDeleteList}
              className="px-3 py-1.5 text-xs text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              Delete list
            </button>
          </div>

          {/* Progress */}
          {items.length > 0 && (
            <div className="px-3 sm:px-5 pt-3">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs text-gray-400">
                  {purchasedCount} of {items.length} purchased
                </span>
                <span className="text-xs font-semibold text-violet-600">
                  {items.length > 0 ? Math.round((purchasedCount / items.length) * 100) : 0}%
                </span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-emerald-500 rounded-full transition-all duration-500"
                  style={{
                    width: `${items.length > 0 ? (purchasedCount / items.length) * 100 : 0}%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* Add item inline form */}
          {showAddItem && (
            <form onSubmit={handleAddItem} className="px-3 sm:px-5 pt-3">
              <div className="border-2 border-violet-200 rounded-xl p-3 bg-violet-50/50 space-y-2">
                <input
                  autoFocus
                  type="text"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="What do you 'need'?"
                  className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-400"
                />
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="Justify this purchase (optional)"
                  className="w-full text-sm bg-white border border-gray-200 rounded-lg px-3 py-2 outline-none focus:border-violet-400"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={addingItem || !newItemName.trim()}
                    className="px-3 py-1.5 bg-violet-600 text-white text-xs font-semibold rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-40"
                  >
                    {addingItem ? "Adding..." : "Add"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddItem(false)}
                    className="px-3 py-1.5 text-xs text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </form>
          )}

          {/* Items list */}
          <div className="px-2 py-2">
            {loadingDetail ? (
              <div className="px-4 py-6 flex justify-center">
                <div className="w-5 h-5 border-2 border-violet-400 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : items.length > 0 ? (
              <div className="space-y-0.5">
                {items.map((item) => (
                  <ItemRow key={item.id} item={item} listId={list.id} onUpdate={loadDetail} />
                ))}
              </div>
            ) : (
              <p className="text-center text-sm text-gray-400 py-6">
                Empty like your bank account. Add something!
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main page ─── */
export default function ListPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [creating, setCreating] = useState(false);

  const loadLists = useCallback(async () => {
    try {
      const data = await getLists();
      setLists(data);
    } catch {
      toast("Can't load lists. Even the server is broke.", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace("/login");
      return;
    }
    if (user) loadLists();
  }, [user, authLoading, loadLists, router]);

  if (authLoading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newListName.trim()) return;
    setCreating(true);
    try {
      await createList(newListName.trim());
      setNewListName("");
      setShowCreate(false);
      toast("New list who dis? Let the spending begin.");
      loadLists();
    } catch {
      toast("Failed to create list", "error");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl w-full mx-auto px-3 sm:px-4 py-5 sm:py-8 pb-24 sm:pb-8">
        {/* Header */}
        <div className="flex items-start sm:items-center justify-between gap-3 mb-5 sm:mb-6">
          <div className="min-w-0">
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">My Shopping Lists</h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Organized chaos for your impulse purchases
            </p>
          </div>
          <button
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 sm:py-2.5 bg-gray-900 text-white text-xs sm:text-sm font-semibold rounded-xl hover:bg-violet-600 transition-colors shadow-[3px_3px_0px_0px_#7c3aed] shrink-0"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span className="hidden sm:inline">New list</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        {/* Lists */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <ListSkeleton key={i} />
            ))}
          </div>
        ) : lists.length > 0 ? (
          <div className="space-y-3">
            {lists.map((list) => (
              <ListCard key={list.id} list={list} onRefresh={loadLists} />
            ))}
          </div>
        ) : (
          <EmptyState
            icon={
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
            }
            title="No lists? Bold move."
            subtitle="Create one and pretend you're being financially responsible."
            action={
              <button
                onClick={() => setShowCreate(true)}
                className="px-5 py-2.5 bg-violet-600 text-white text-sm font-semibold rounded-xl hover:bg-violet-700 transition-colors"
              >
                Start the delusion
              </button>
            }
          />
        )}
      </main>

      {/* Create List Modal */}
      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create new list">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">List name</label>
            <input
              autoFocus
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder='e.g. "Things I definitely need"'
              className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-3 outline-none focus:border-violet-400 transition-colors"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={() => setShowCreate(false)}
              className="px-4 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating || !newListName.trim()}
              className="px-5 py-2 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-violet-600 transition-colors disabled:opacity-40"
            >
              {creating ? "Creating..." : "Create list"}
            </button>
          </div>
        </form>
      </Modal>

      <ToastContainer />
    </div>
  );
}
