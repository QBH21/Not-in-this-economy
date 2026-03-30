"use client";

import type { SearchResult } from "@/lib/api";

function formatPrice(price: number | null) {
  if (price === null) return "N/A";
  return `$${price.toFixed(2)}`;
}

function Stars({ rating }: { rating: number | null }) {
  if (!rating) return null;
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill={i < full ? "#f59e0b" : i === full && half ? "url(#half)" : "none"}
          stroke={i < full || (i === full && half) ? "#f59e0b" : "#d1d5db"}
          strokeWidth="2"
        >
          {i === full && half && (
            <defs>
              <linearGradient id="half">
                <stop offset="50%" stopColor="#f59e0b" />
                <stop offset="50%" stopColor="transparent" />
              </linearGradient>
            </defs>
          )}
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span className="text-xs text-gray-400 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
}

export default function ProductCard({
  product,
  onAddToList,
}: {
  product: SearchResult;
  onAddToList?: (product: SearchResult) => void;
}) {
  return (
    <div className="group bg-white border-2 border-gray-100 rounded-2xl overflow-hidden hover:border-violet-200 hover:shadow-[4px_4px_0px_0px_#7c3aed] transition-all">
      {/* Image */}
      <div className="relative bg-gray-50 h-32 sm:h-44 flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform"
          />
        ) : (
          <div className="text-4xl text-gray-300">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-xs text-gray-500 font-medium px-2 py-0.5 rounded-full border border-gray-100">
          {product.store}
        </span>
      </div>

      {/* Info */}
      <div className="p-2.5 sm:p-4">
        <h3 className="text-xs sm:text-sm font-semibold text-gray-900 line-clamp-2 mb-1 sm:mb-1.5 leading-snug">
          {product.name}
        </h3>

        <Stars rating={product.rating} />

        <div className="flex items-baseline gap-1 sm:gap-2 mt-1.5 sm:mt-2">
          <span className="text-base sm:text-lg font-black text-gray-900">
            {formatPrice(product.price)}
          </span>
        </div>

        {product.reviewCount !== null && product.reviewCount > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {product.reviewCount.toLocaleString()} reviews
          </p>
        )}

        {product.shipping && (
          <p className="text-xs text-emerald-600 mt-1 font-medium">
            {product.shipping}
          </p>
        )}

        <div className="flex gap-1.5 sm:gap-2 mt-2 sm:mt-3">
          <a
            href={product.productUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center px-2 sm:px-3 py-1.5 sm:py-2 bg-gray-900 text-white text-[11px] sm:text-xs font-semibold rounded-lg sm:rounded-xl hover:bg-violet-600 transition-colors"
          >
            Treat Yourself
          </a>
          {onAddToList && (
            <button
              onClick={() => onAddToList(product)}
              className="px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-gray-200 text-gray-500 rounded-lg sm:rounded-xl hover:border-emerald-400 hover:text-emerald-600 hover:bg-emerald-50 transition-all text-[11px] sm:text-xs font-semibold"
            >
              + List
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
