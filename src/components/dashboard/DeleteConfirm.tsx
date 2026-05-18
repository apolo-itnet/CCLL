"use client";

import toast from "react-hot-toast";
import { Trash2, X } from "lucide-react";

export function confirmDelete(message: string, onConfirm: () => void) {
  toast.custom(
    (t) => (
      <div
        style={{
          animation: t.visible
            ? "toastEnter 0.2s cubic-bezier(0.16,1,0.3,1) forwards"
            : "toastLeave 0.15s ease-in forwards",
        }}
        className="max-w-sm w-full bg-slate-900 border border-red-500/30 shadow-2xl shadow-black/40 rounded-2xl pointer-events-auto p-5"
      >
        <style>{`
          @keyframes toastEnter {
            from { opacity: 0; transform: scale(0.92) translateY(-8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
          @keyframes toastLeave {
            from { opacity: 1; transform: scale(1) translateY(0); }
            to   { opacity: 0; transform: scale(0.92) translateY(-8px); }
          }
        `}</style>

        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <Trash2 className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">Delete করবেন?</p>
            <p className="text-slate-400 text-xs mt-1 leading-relaxed">{message}</p>
          </div>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="text-slate-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="px-4 py-1.5 text-sm text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              toast.dismiss(t.id);
              onConfirm();
            }}
            className="px-4 py-1.5 text-sm text-white bg-red-600 hover:bg-red-500 rounded-lg transition-all font-medium cursor-pointer"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    ),
    { duration: 8000, position: "top-center" }
  );
}
