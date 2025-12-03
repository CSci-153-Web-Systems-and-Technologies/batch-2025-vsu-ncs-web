import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { SeriousInfractionTicket } from "@/types"; // <--- UPDATED IMPORT
import { useState } from "react";

export default function ReviewDialog({
  record,
  isResolved,
}: {
  record: SeriousInfractionTicket;
  isResolved: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={isResolved ? "outline" : "default"}
          className={!isResolved ? "bg-red-600 hover:bg-red-700" : ""}
        >
          <Gavel className="w-4 h-4 mr-2" />
          {isResolved ? "View Decision" : "Review Case"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admin Review</DialogTitle>
          <DialogDescription>
            Determine the sanction for {record.student?.last_name}.
          </DialogDescription>
        </DialogHeader>

        {/* Placeholder Form Content */}
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Incident Description</h4>
            <div className="p-3 bg-muted rounded-md text-sm text-muted-foreground">
              {record.description}
            </div>
          </div>

          <div className="p-4 border-2 border-dashed rounded-lg text-center text-sm text-muted-foreground">
            [Form inputs for Sanction Days, Context, and Notes will go here]
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button disabled={isResolved} className="bg-red-600">
            Submit Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
