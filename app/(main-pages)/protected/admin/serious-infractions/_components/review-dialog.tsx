"use client";

import { Button } from "@/components/ui/button";
import { Gavel, User, FileText, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SeriousInfractionTicket } from "@/types";
import { useActionState, useState, useEffect } from "react";
import { Separator } from "@/components/ui/separator";
import { submitInfractionResponse } from "@/lib/actions";
import { toast, Toaster } from "sonner";

export default function ReviewDialog({
  record,
  studentName,
}: {
  record: SeriousInfractionTicket;
  studentName: string;
}) {
  const [state, formAction, isPending] = useActionState(
    submitInfractionResponse,
    null
  );
  const [open, setOpen] = useState(false);

  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state?.success) {
      toast.success(state.message);

      timer = setTimeout(() => {
        setOpen(false);
      }, 1000);
    } else if (state?.error) {
      toast.error(state.error);
    }

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Gavel className="w-4 h-4" />
          Review Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Toaster position="top-right" />
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-red-600" />
            Admin Adjudication
          </DialogTitle>
          <DialogDescription>
            Finalize the verdict for the serious infraction committed by{" "}
            <span className="font-semibold text-foreground">{studentName}</span>
            .
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-6 py-4">
          <div className="rounded-lg border bg-muted/40 p-4 space-y-4 text-sm">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold flex items-center gap-2">
                <FileText className="w-4 h-4" /> Original Report Details
              </h4>
              <span className="text-muted-foreground text-xs">
                {formattedDate}
              </span>
            </div>

            <Separator />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Reporter
                </p>
                <div className="flex items-center gap-2">
                  <User className="w-3 h-3 text-muted-foreground" />
                  <span>
                    {record.reporter?.first_name} {record.reporter?.last_name}
                  </span>
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-medium uppercase">
                  Context
                </p>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-3 h-3 text-muted-foreground" />
                  <span className="capitalize">
                    {record.sanction_context === "rle"
                      ? "RLE / Duty"
                      : "Office"}
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-muted-foreground text-xs font-medium uppercase">
                Description of Incident
              </p>
              <p className="text-foreground leading-relaxed">
                {record.description || "No description provided."}
              </p>
            </div>
          </div>

          <Separator />
          <form action={formAction}>
            <div className="space-y-4">
              <h4 className="font-semibold text-sm">Verdict & Sanctions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="days">Final Sanction Days</Label>
                  <Input
                    id="days"
                    type="number"
                    name="final_sanction_days"
                    placeholder={record.sanction_days?.toString() || "0"}
                  />
                  <p className="text-[0.8rem] text-muted-foreground">
                    Leave 0 if not applicable.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="other_sanction">
                  Other Sanctions / Actions
                </Label>
                <Textarea
                  id="other_sanction"
                  name="final_sanction_other"
                  placeholder="E.g., Suspension, Community Service, Referral to Guidance..."
                  className="h-[80px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Official Resolution Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  placeholder="Enter the official justification or notes for this decision..."
                  className="h-[100px]"
                />
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button className="bg-red-600 hover:bg-red-700">
                Submit Final Decision
              </Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}