"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SeriousInfractionTicket } from "@/types";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import FacultyResolutionDialog from "./resolution-dialog";

type SeriousInfractionCardProps = {
  record: SeriousInfractionTicket;
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

  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`.trim()
    : "Unknown Student";

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
            <CardDescription>
              {formattedDate} · Student: {studentName} ({studentId})
            </CardDescription>
          </div>

          {/* ACTION BUTTON: Only show if Resolved */}
          {isResolved && <FacultyResolutionDialog record={record} />}
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