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

import { Separator } from "@/components/ui/separator";
import { SeriousInfractionTicket } from "@/types"; // <--- Admin Ticket Type
import { AlertCircle, CheckCircle2, FileText, User } from "lucide-react";
import ReviewDialog from "./review-dialog";

type SeriousInfractionCardProps = {
  record: SeriousInfractionTicket;
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

  // Extract Names
  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`
    : "Unknown Student";

  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.last_name}`.trim()
    : "Unknown Faculty";

  return (
    <Card
      className={`border-l-4 ${
        isResolved ? "border-green-500" : "border-red-500"
      }`}
    >
      <CardHeader>
        <div className="flex flex-col md:flex-row justify-between items-start gap-4">
          {/* LEFT SIDE: INFO */}
          <div className="space-y-1 w-full">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-red-600">
                Serious Infraction Ticket
              </CardTitle>
              <Badge
                variant="outline"
                className={
                  isResolved
                    ? "text-green-600 border-green-200 bg-green-50"
                    : "text-red-600 border-red-200 bg-red-50"
                }
              >
                {isResolved ? (
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Resolved
                  </span>
                ) : (
                  <span className="flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Pending Action
                  </span>
                )}
              </Badge>
            </div>

            {/* DESCRIPTION WITH BOTH NAMES */}
            <CardDescription className="grid grid-cols-1 sm:grid-cols-2 gap-1 pt-1">
              <span>
                <span className="font-semibold text-foreground">Accused:</span>{" "}
                {studentName} ({record.student?.student_id || "N/A"})
              </span>
              <span>
                <span className="font-semibold text-foreground">Reporter:</span>{" "}
                {reporterName}
              </span>
              <span className="text-xs text-muted-foreground sm:col-span-2">
                Date Filed: {formattedDate}
              </span>
            </CardDescription>
          </div>

          {/* RIGHT SIDE: ACTION BUTTON */}
          <div className="flex shrink-0">
            {isResolved ? (
              <ViewDecisionDialog record={record} />
            ) : (
              <ReviewDialog record={record} studentName={studentName} />
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <h4 className="text-sm font-semibold mb-1">Incident Report</h4>
          <p className="text-sm text-muted-foreground bg-slate-50 p-3 rounded-md border">
            {record.description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// =========================================================
// 1. REVIEW DIALOG (For Pending Cases)
// =========================================================


// =========================================================
// 2. VIEW DECISION DIALOG (For Resolved Cases)
// =========================================================
function ViewDecisionDialog({ record }: { record: SeriousInfractionTicket }) {
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