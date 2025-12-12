"use client";

import React from "react";
import { Loader2, AlertTriangle, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending: boolean;
  data: Record<string, any>;
  title?: string;
  warningText?: string;
}

export default function ReviewModal({
  isOpen,
  onClose,
  onConfirm,
  isPending,
  data,
  title = "Confirm Submission",
  warningText = "This action cannot be undone immediately.",
}: ReviewModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            {title}
          </h3>
          <button
            onClick={onClose}
            disabled={isPending}
            className="text-slate-400 hover:text-slate-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div className="space-y-4 text-sm">
            {Object.entries(data).map(([key, value]) => (
              <div
                key={key}
                className="flex justify-between border-b border-slate-50 pb-2 last:border-0"
              >
                <span className="text-slate-500 font-medium capitalize">
                  {key}
                </span>
                <span className="text-slate-900 font-semibold text-right max-w-[200px] truncate">
                  {value || "-"}
                </span>
              </div>
            ))}
          </div>

          <div className="flex items-start gap-3 p-3 bg-amber-50 border border-amber-100 rounded-lg text-amber-800 text-xs">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            <p>{warningText}</p>
          </div>
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} disabled={isPending}>
            Edit
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
