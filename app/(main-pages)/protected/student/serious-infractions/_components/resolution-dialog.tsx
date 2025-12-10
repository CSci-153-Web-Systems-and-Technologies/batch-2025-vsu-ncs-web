"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { FileText, User, Quote } from "lucide-react";

import { SeriousInfractionTicket } from "@/types";
import { useState } from "react";

export default function StudentResolutionDialog({
  record,
}: {
  record: SeriousInfractionTicket;
}) {
  const [open, setOpen] = useState(false);
  const response = record.response;

  if (!response) return null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <FileText className="w-4 h-4" />
          View Decision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admin Decision</DialogTitle>
          <DialogDescription>
            Review the official resolution for this infraction.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-500">
              Final Sanction
            </h4>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
              <span className="font-semibold text-green-800">
                {response.final_sanction || "No sanction applied"}
              </span>
            </div>
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-500">
              Other Sanctions
            </h4>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
              <span className="font-semibold text-green-800">
                {response.final_sanction_other || "No sanction applied"}
              </span>
            </div>
          </div>

          {response.notes && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-slate-500">
                Admin Remarks
              </h4>
              <div className="relative">
                <Quote className="absolute top-3 left-3 w-4 h-4 text-slate-300 transform -scale-x-100" />
                <p className="text-sm text-slate-600 italic bg-slate-50 p-4 pl-9 rounded-md border border-slate-100">
                  {response.notes}
                </p>
              </div>
            </div>
          )}

          <Separator />

          <div className="flex items-center gap-2 text-xs text-muted-foreground justify-end">
            <User className="w-3 h-3" />
            <span>
              Resolved by {response.admin_name} on{" "}
              {new Date(response.resolved_at).toLocaleDateString()}
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
