"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const taglines = [
  "Finding deals so you can pretend to save money.",
  "Because your wallet has trust issues.",
  "Comparison shopping for the financially anxious.",
  "Saving money, one existential crisis at a time.",
  "Your bank account asked us to help.",
];

const chips = [
  { label: "Best laptop deals", icon: "💻" },
  { label: "Cheap headphones", icon: "🎧" },
  { label: "Affordable fashion", icon: "👕" },
  { label: "Grocery savings", icon: "🛒" },
];

export default function Home() {
  const router = useRouter();
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [taglineVisible, setTaglineVisible] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineVisible(false);
      setTimeout(() => {
        setTaglineIndex((prev) => (prev + 1) % taglines.length);
        setTaglineVisible(true);
      }, 400);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  function handleSearch(e?: React.FormEvent) {
    e?.preventDefault();
    if (query.trim()) {
      router.push(`/deals?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar />

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 -mt-8 sm:-mt-16 pb-20 sm:pb-0">
        {/* Eyebrow badge */}
        <div className="mb-4 sm:mb-6 flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full text-center">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block shrink-0"></span>
          <span className="hidden sm:inline">Stalking prices across 50+ stores so you don't have to</span>
          <span className="sm:hidden">Stalking 50+ stores for you</span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-gray-900 text-center tracking-tighter leading-none mb-3 sm:mb-4">
          Not in this{" "}
          <span className="text-violet-600 relative">
            economy
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 200 8"
              preserveAspectRatio="none"
              fill="none"
            >
              <path
                d="M0 6 Q50 0 100 4 Q150 8 200 2"
                stroke="#10b981"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h1>

        {/* Cycling tagline */}
        <p
          className="text-sm sm:text-base text-gray-400 italic text-center mb-6 sm:mb-8 h-6 transition-all duration-300 px-4"
          style={{
            opacity: taglineVisible ? 1 : 0,
            transform: taglineVisible ? "translateY(0)" : "translateY(4px)",
          }}
        >
          {taglines[taglineIndex]}
        </p>

        {/* Search bar */}
        <form onSubmit={handleSearch} className="w-full max-w-xl mb-4 px-1">
          <div className="flex items-center bg-white border-2 border-gray-900 rounded-2xl overflow-hidden shadow-[3px_3px_0px_0px_#7c3aed] sm:shadow-[4px_4px_0px_0px_#7c3aed] transition-shadow hover:shadow-[6px_6px_0px_0px_#7c3aed] focus-within:shadow-[4px_4px_0px_0px_#10b981] sm:focus-within:shadow-[6px_6px_0px_0px_#10b981]">
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
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you pretending you can afford?"
              className="flex-1 px-2 sm:px-3 py-3 sm:py-3.5 text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none min-w-0"
            />
            <button
              type="submit"
              className="m-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-violet-600 transition-colors shrink-0"
            >
              Search
            </button>
          </div>
        </form>

        {/* Chips */}
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2 mb-5 px-2">
          {chips.map((chip) => (
            <button
              key={chip.label}
              onClick={() => {
                setQuery(chip.label);
                router.push(`/deals?q=${encodeURIComponent(chip.label)}`);
              }}
              className="flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 sm:py-2 bg-white border border-gray-200 rounded-full text-xs sm:text-sm text-gray-600 hover:border-violet-400 hover:text-violet-700 hover:bg-violet-50 transition-all"
            >
              <span className="text-xs">{chip.icon}</span>
              {chip.label}
            </button>
          ))}
        </div>

        {/* Shopping list link */}
        <a
          href="/list"
          className="flex items-center gap-1.5 text-sm text-emerald-600 hover:text-emerald-700 font-medium transition-colors group"
        >
          Or doom-scroll your shopping list
          <svg
            className="group-hover:translate-x-0.5 transition-transform"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </a>
      </main>

      {/* Footer hint */}
      <div className="pb-6 sm:pb-6 flex justify-center px-4">
        <p className="text-[10px] sm:text-xs text-gray-300 text-center">
          Prices updated every 6 hours · No sponsored results · We're broke too, we get it.
        </p>
      </div>
    </div>
  );
}
