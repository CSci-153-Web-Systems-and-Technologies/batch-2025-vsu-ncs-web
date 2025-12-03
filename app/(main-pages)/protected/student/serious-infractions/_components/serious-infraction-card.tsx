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
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { ConductReportWithReporter } from "@/types";
import { AlertCircle, CheckCircle2, FileText, User, Quote } from "lucide-react";
import { useState } from "react";

type SeriousInfractionCardProps = {
  record: ConductReportWithReporter;
};

export default function SeriousInfractionCard({
  record,
}: SeriousInfractionCardProps) {
  // 1. Status Logic
  const isResolved = record.status === "Resolved";

  // 2. Formatting
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

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
                Serious Infraction
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
            <CardDescription>
              {formattedDate} · Reported by {reporterName}
            </CardDescription>
          </div>

          {/* ACTION BUTTON: Only show if Resolved */}
          {isResolved && <StudentResolutionDialog record={record} />}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">
            Description of Incident
          </h4>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

// --------------------------------------------------------
// SUB-COMPONENT: The Resolution Dialog (Student View)
// --------------------------------------------------------
function StudentResolutionDialog({
  record,
}: {
  record: ConductReportWithReporter;
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
          {/* 1. The Verdict */}
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

          {/* 2. Admin Notes */}
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

          {/* 3. Footer Info */}
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
