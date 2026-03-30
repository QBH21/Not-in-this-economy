"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";

const links = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/list",
    label: "My List",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  },
  {
    href: "/deals",
    label: "Deals",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
      </svg>
    ),
  },
];

export default function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <>
      {/* Desktop top bar */}
      <nav className="hidden sm:flex w-full border-b border-gray-100 px-6 py-3 items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-sm">
            N
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            Not in this economy
          </span>
        </Link>
        <div className="flex items-center gap-1">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? "text-violet-600 bg-violet-50"
                    : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  {link.icon.props.children}
                </svg>
                {link.label}
              </Link>
            );
          })}
          <div className="w-px h-5 bg-gray-200 mx-2" />
          {user ? (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">{user.name}</span>
              <button
                onClick={logout}
                className="text-xs text-gray-400 hover:text-red-500 px-2 py-1 rounded-lg hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="px-3 py-1.5 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-violet-600 transition-colors"
            >
              Log in
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile top bar */}
      <nav className="sm:hidden w-full border-b border-gray-100 px-4 py-3 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur-sm z-50">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-violet-600 flex items-center justify-center text-white font-bold text-xs">
            N
          </div>
          <span className="font-semibold text-gray-900 text-sm tracking-tight">
            Not in this economy
          </span>
        </Link>
        {user ? (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-violet-100 flex items-center justify-center text-violet-600 text-xs font-bold">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={logout}
              className="text-xs text-gray-400 hover:text-red-500"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-3 py-1.5 bg-gray-900 text-white text-xs font-semibold rounded-lg hover:bg-violet-600 transition-colors"
          >
            Log in
          </Link>
        )}
      </nav>

      {/* Mobile bottom tab bar */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-100 safe-area-bottom">
        <div className="flex items-center justify-around px-2 py-1.5 pb-[env(safe-area-inset-bottom,8px)]">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl min-w-[64px] transition-colors ${
                  isActive
                    ? "text-violet-600"
                    : "text-gray-400"
                }`}
              >
                {link.icon}
                <span className="text-[10px] font-semibold">{link.label}</span>
                {isActive && (
                  <div className="w-1 h-1 rounded-full bg-violet-600" />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
