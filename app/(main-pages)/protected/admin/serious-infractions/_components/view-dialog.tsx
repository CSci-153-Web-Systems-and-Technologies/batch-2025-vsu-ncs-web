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
import { Badge } from "@/components/ui/badge";
import { FileText, User, CalendarDays, Gavel, Quote } from "lucide-react";
import { SeriousInfractionTicket } from "@/types";

export default function ViewDecisionDialog({
  record,
}: {
  record: SeriousInfractionTicket;
}) {
  const decision = record.response;

  if (!decision) return null;

  const formattedDate = new Date(decision.resolved_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

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
          <DialogTitle className="flex items-center gap-2">
            <Gavel className="w-5 h-5 text-green-600" />
            Case Resolution
          </DialogTitle>
          <DialogDescription className="flex items-center gap-1">
            <CalendarDays className="w-3.5 h-3.5" />
            Case closed on {formattedDate}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-2">
          <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-lg border">
            <div className="h-10 w-10 rounded-full bg-white border flex items-center justify-center shadow-sm">
              <User className="h-5 w-5 text-slate-500" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase font-semibold">
                Resolved By
              </p>
              <p className="text-sm font-medium text-slate-900">
                {decision.admin_name}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-muted-foreground">Final Sanction</Label>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
              <span className="font-semibold text-green-800">
                {decision.final_sanction || "No sanction applied"}
              </span>

              <Badge
                variant="outline"
                className="border-green-600 text-green-700 bg-white"
              >
                Resolved
              </Badge>
            </div>
            <Label className="text-muted-foreground">Other Sanctions</Label>
            <div className="p-4 bg-green-50 border border-green-200 rounded-md flex justify-between items-center">
              <span className="font-semibold text-green-800">
                {decision.final_sanction_other || "No sanction applied"}
              </span>

              <Badge
                variant="outline"
                className="border-green-600 text-green-700 bg-white"
              >
                Resolved
              </Badge>
            </div>
          </div>

          {decision.notes && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Admin Notes</Label>
              <div className="relative">
                <Quote className="absolute top-2 left-2 w-4 h-4 text-slate-300 transform -scale-x-100" />
                <p className="text-sm text-slate-600 italic bg-slate-50 p-4 pl-8 rounded-md border border-slate-100">
                  {decision.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}