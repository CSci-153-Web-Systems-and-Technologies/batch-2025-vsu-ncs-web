import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { FileText, User } from "lucide-react";
import { SeriousInfractionTicket } from "@/types";

export default function ViewDecisionDialog({
  record,
}: {
  record: SeriousInfractionTicket;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2">
          <FileText className="w-4 h-4" />
          View Decision
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Case Resolution</DialogTitle>
          <DialogDescription>
            This case was closed on{" "}
            {/* If you have resolved_at in your ticket DTO, use it. Fallback to updated_at */}
            {new Date(record.created_at).toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Admin Info */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-sm font-medium">Resolved by Admin</p>
              <p className="text-xs text-muted-foreground">
                (Admin details would appear here)
              </p>
            </div>
          </div>

          <Separator />

          {/* Outcome Mockup (Since Ticket DTO might only have status for list view) */}
          <div className="space-y-2">
            <Label className="text-muted-foreground">Final Verdict</Label>
            <div className="p-4 bg-green-50 border border-green-100 rounded-md">
              <p className="text-sm font-medium text-green-800">
                Ticket Resolved
              </p>
              <p className="text-xs text-green-700 mt-1">
                The necessary sanctions have been applied to the student&apos;s
                record.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
