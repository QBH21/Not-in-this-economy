"use client";

import { useEffect, useState } from "react";

type ToastType = "success" | "error" | "info";

interface ToastMessage {
  id: number;
  text: string;
  type: ToastType;
}

let addToast: (text: string, type?: ToastType) => void = () => {};

export function toast(text: string, type: ToastType = "success") {
  addToast(text, type);
}

export default function ToastContainer() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  useEffect(() => {
    addToast = (text: string, type: ToastType = "success") => {
      const id = Date.now();
      setToasts((prev) => [...prev, { id, text, type }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 3000);
    };
  }, []);

  const colors: Record<ToastType, string> = {
    success: "bg-emerald-600",
    error: "bg-red-500",
    info: "bg-violet-600",
  };

  const icons: Record<ToastType, string> = {
    success: "\u2713",
    error: "\u2715",
    info: "\u2139",
  };

  return (
    <div className="fixed bottom-20 sm:bottom-6 left-4 right-4 sm:left-auto sm:right-6 z-[100] flex flex-col gap-2 sm:w-auto sm:min-w-[280px] sm:max-w-sm">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`animate-toast-in ${colors[t.type]} text-white text-sm font-medium px-4 py-3 rounded-xl shadow-lg flex items-center gap-2`}
        >
          <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-xs shrink-0">
            {icons[t.type]}
          </span>
          <span className="flex-1">{t.text}</span>
        </div>
      ))}
    </div>
  );
}
