"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { AlertCircle, CheckCircle2, User, Gavel } from "lucide-react";
import { useState } from "react";

type SeriousInfractionCardProps = {
  record: SeriousInfractionTicket; // <--- UPDATED PROP TYPE
};

export default function SeriousInfractionCard({
  record,
}: SeriousInfractionCardProps) {
  const isResolved = record.status === "Resolved";

  // Formatting
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  // Extract Names safely
  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`
    : "Unknown Student";

  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.last_name}`.trim()
    : "Unknown Faculty";

  return (
    <Card
      className={`border-l-4 ${
        isResolved ? "border-green-500" : "border-yellow-500"
      }`}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-red-600">
                Serious Infraction Ticket
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  isResolved
                    ? "text-green-600 border-green-200 bg-green-50"
                    : "text-yellow-600 border-yellow-200 bg-yellow-50"
                }
              >
                {isResolved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Pending Review
                  </span>
                )}
              </Badge>
            </div>

            {/* UPDATED: Shows BOTH parties involved */}
            <CardDescription className="flex flex-col gap-1">
              <span>{formattedDate}</span>
              <span className="font-medium text-slate-700">
                Accused: {studentName} ({record.student?.student_id || "N/A"})
              </span>
              <span className="text-slate-500">Reporter: {reporterName}</span>
            </CardDescription>
          </div>

          {/* ACTION BUTTON */}
          <ReviewDialog record={record} isResolved={isResolved} />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Incident Report</h4>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </div>

        {/* Existing Admin Decision Display (if resolved) */}
        {isResolved && (
          <>
            <Separator />
            <div className="bg-slate-50 p-4 rounded-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User className="w-4 h-4" />
                <span>Current Resolution</span>
              </div>
              <div className="text-sm text-muted-foreground">
                This ticket has been marked as resolved.
                {/* Add more details here if your ticket DTO includes the response body */}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------
// SUB-COMPONENT: The Review Dialog
// --------------------------------------------------------
function ReviewDialog({
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
