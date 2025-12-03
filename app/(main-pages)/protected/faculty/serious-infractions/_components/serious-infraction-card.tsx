import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConductReportWithStudent } from "@/types"; // <--- UPDATED INTERFACE
import { AlertCircle, CheckCircle2, User } from "lucide-react";

type SeriousInfractionCardProps = {
  record: ConductReportWithStudent; // <--- UPDATED PROP TYPE
};

export default function SeriousInfractionCard({
  record,
}: SeriousInfractionCardProps) {
  // 1. Status Logic
  const isResolved = record.status === "Resolved";

  // 2. Formatting
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // 3. UPDATED: Display Student Name instead of Reporter
  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`.trim()
    : "Unknown Student";

  // Optional: Display Student ID
  const studentId = record.student?.student_id || "No ID";

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
            {/* UPDATED DESCRIPTION */}
            <CardDescription>
              {formattedDate} · Student: {studentName} ({studentId})
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* The Allegation */}
        <div>
          <h4 className="text-sm font-semibold mb-1">
            Description of Incident
          </h4>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </div>

        {/* The Verdict (Only show if resolved) */}
        {/* Note: ConductReportWithStudent usually only needs the status, 
            but if your transformer includes response details, we show them here */}
        {isResolved && record.status === "Resolved" && (
          <>
            <Separator />
            <div className="bg-slate-50 p-4 rounded-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User className="w-4 h-4" />
                <span>Admin Decision</span>
              </div>

              <div className="grid gap-2 text-sm">
                <div>
                  {/* Note: In the Faculty view, we might not have the full 'final_sanction' text 
                       unless we adjusted the transformer. Assuming basic status here.
                       If you need full details, ensure transformReportForFaculty maps 'sanction' too. */}
                  <span className="font-medium">Status: </span>
                  <span className="text-green-600 font-medium">
                    Ticket Resolved
                  </span>
                </div>

                {record.admin_name && (
                  <div className="text-xs text-muted-foreground pt-1">
                    Resolved by {record.admin_name}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
