"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActivityLog } from "@/types";
export type RecordCardProps = {
  record: ActivityLog;
};

export default function RecordCard({ record }: RecordCardProps) {
  let badgeColor = "";
  let borderColor = "";
  let badgeText = "";

  if (record.is_serious_infraction) {
    badgeColor = "bg-[#FB2C36]";
    borderColor = "border-[#FB2C36]";
  } else if (record.type === "merit") {
    badgeColor = "bg-[#00C950]";
    borderColor = "border-[#00C950]";
  } else if (record.type === "service") {
    badgeColor = "bg-blue-500";
    borderColor = "border-blue-500";
    badgeText = `Cleared ${record.days_deducted} Day/s`;
  } else {
    badgeColor = "bg-[#FF6900]";
    borderColor = "border-[#FF6900]";
  }

  const value = Math.abs(record.sanction_days ?? 0);

  const serviceValue = Math.abs(record.days_deducted ?? 0);

  if (serviceValue != 0) {
    const typeText = "day/s";
    badgeText = `${serviceValue} ${typeText}`;
  } else if (record.is_serious_infraction) {
    badgeText = "Serious Infraction";
  } else if (value > 0) {
    const typeText = record.type === "merit" ? "merit/s" : "demerit/s";
    badgeText = `${value} ${typeText}`;
  } else if (record.sanction_other) {
    badgeText = record.sanction_other;
  } else {
    badgeText = "Warning";
  }

  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`
    : "Unknown Student";

  const studentId = record.student?.student_id || "No ID";

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
