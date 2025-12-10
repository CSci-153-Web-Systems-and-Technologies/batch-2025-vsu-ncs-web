import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ConductReportWithStudent } from "@/types";

export type RecordCardProps = {
  record: ConductReportWithStudent;
};

export default function RecordCard({ record }: RecordCardProps) {
  let badgeColor = "";
  let borderColor = "";

  if (record.is_serious_infraction) {
    badgeColor = "bg-[#FB2C36] hover:bg-[#FB2C36]/90";
    borderColor = "border-[#FB2C36]";
  } else if (record.type === "merit") {
    badgeColor = "bg-[#00C950] hover:bg-[#00C950]/90";
    borderColor = "border-[#00C950]";
  } else {
    badgeColor = "bg-[#FF6900] hover:bg-[#FF6900]/90";
    borderColor = "border-[#FF6900]";
  }

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

  const studentName = record.student
    ? `${record.student.first_name} ${record.student.last_name}`
    : "Unknown Student";

  const studentId = record.student?.student_id || "No ID";

  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      month: "short",
      day: "numeric",
      year: "numeric",
    }
  );

  return (
    <div className="w-full">
      <Card
        className={`${borderColor} flex-1 gap-1 border-l-4 shadow-sm h-full`}
      >
        <CardHeader className="pb-3">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <CardTitle className="text-lg font-semibold leading-snug">
              {studentName}
              <span className="block text-sm font-normal text-muted-foreground sm:inline sm:ml-2">
                {studentId}
              </span>
            </CardTitle>

            <Badge
              className={`${badgeColor} text-white w-fit shrink-0 border-transparent px-3 py-1`}
            >
              {badgeText}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="flex flex-col gap-2">
          <p className="font-medium text-foreground leading-relaxed">
            {record.description}
          </p>
          <p className="text-sm text-muted-foreground">
            Reported on {formattedDate}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
