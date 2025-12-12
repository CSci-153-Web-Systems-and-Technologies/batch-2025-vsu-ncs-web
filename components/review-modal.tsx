"use client";

import React from "react";
import { Loader2, AlertTriangle, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

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
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md z-[55] overflow-hidden p-0 gap-0">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5 text-emerald-600" />
            <DialogTitle className="text-lg font-semibold text-slate-800">
              {title}
            </DialogTitle>
          </div>
          <DialogDescription className="sr-only">
            Review the details of your submission.
          </DialogDescription>
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
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isPending}
            type="button"
          >
            Edit
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isPending}
            className="bg-emerald-600 hover:bg-emerald-700 text-white"
            type="button"
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
      </DialogContent>
    </Dialog>
  );
}