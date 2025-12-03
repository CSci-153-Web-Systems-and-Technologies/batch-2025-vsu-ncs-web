"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConductReportWithStudent } from "@/types"; // <--- NEW IMPORT

export type RecordCardProps = {
  record: ConductReportWithStudent; // <--- NEW PROP
};

export default function RecordCard({ record }: RecordCardProps) {
  // 1. LOGIC: Determine Colors
  let badgeColor = "";
  let borderColor = "";

  if (record.is_serious_infraction) {
    badgeColor = "bg-[#FB2C36]"; // Red
    borderColor = "border-[#FB2C36]";
  } else if (record.type === "merit") {
    badgeColor = "bg-[#00C950]"; // Green
    borderColor = "border-[#00C950]";
  } else {
    badgeColor = "bg-[#FF6900]"; // Orange
    borderColor = "border-[#FF6900]";
  }

  // 2. LOGIC: Determine Badge Text
  const value = Math.abs(record.sanction_days ?? 0);
  let badgeText = "";

  if (record.is_serious_infraction) {
    badgeText = "Serious Infraction";
  } else if (value > 0) {
    const typeText = record.type === "merit" ? "merit/s" : "demerit/s";
    badgeText = `${value} ${typeText}`;
  } else if (record.sanction_other) {
    badgeText = record.sanction_other;
  } else {
    badgeText = "Warning";
  }

  // 3. LOGIC: Student Name & ID
  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`
    : "Unknown Student";

  const studentId = record.student?.student_id || "No ID";

  // 4. LOGIC: Date Formatting
  const dateStr = new Date(record.created_at).toISOString().split("T")[0];

  return (
    <div>
      <Card className={`${borderColor} flex-1 gap-1 border-l-4`}>
        <CardHeader className="pb-2">
          <div className="flex flex-row justify-between">
            <CardTitle>{`${studentName} · (${studentId})`}</CardTitle>
            <Badge className={`${badgeColor}`}>{badgeText}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-2">
          <h1>{record.description}</h1>
          <p className="text-[#6C757D]">{dateStr}</p>
        </CardContent>
      </Card>
    </div>
  );
}
