import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ConductReportWithReporter } from "@/types"; 


// 1. UPDATED: Use the new strict interface
type ConductCardProps = {
  record: ConductReportWithReporter;
};

export default function ConductCard({ record }: ConductCardProps) {
  // 2. LOGIC: Determine Colors & Base Text
  let colorClass = "";
  let borderClass = "";
  let typeText = "";

  if (record.is_serious_infraction) {
    colorClass = "bg-[#FB2C36]"; // Red
    borderClass = "border-[#FB2C36]";
    typeText = "Serious Infraction";
  } else if (record.type === "merit") {
    colorClass = "bg-[#00C950]"; // Green
    borderClass = "border-[#00C950]";
    typeText = "Merit";
  } else {
    colorClass = "bg-[#FF6900]"; // Orange
    borderClass = "border-[#FF6900]";
    typeText = "Demerit";
  }

  // 3. LOGIC: Determine Badge Text
  // We handle potential nulls for sanction_days using (?? 0)
  const days = record.sanction_days ?? 0;

  let badgeText = "";
  if (days > 0) {
    const dayText = days === 1 ? "day" : "days";
    badgeText = `${days} ${typeText} ${dayText}`;
  } else if (record.sanction_other) {
    badgeText = record.sanction_other;
  } else {
    badgeText = `${typeText} (Warning)`;
  }

  // 4. LOGIC: Format Date & Reporter
  // Convert ISO timestamp to readable date
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  // Handle reporter object (it might be null if the faculty account was deleted)
  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.last_name}`.trim()
    : "Unknown Faculty";

  // Handle context (capitalize or fallback)
  const context = capitalizeFirstLetter(record.sanction_context || "General");

  return (
    <div>
      <Card className={`${borderClass} flex-1 border-l-4`}>
        <CardHeader>
          <div className="flex flex-row justify-between items-start gap-4">
            <CardTitle className="text-lg leading-tight">
              {record.description || "No description provided."}
            </CardTitle>
            <Badge className={`${colorClass} text-white whitespace-nowrap`}>
              {badgeText}
            </Badge>
          </div>
          <CardDescription>
            {/* 5. UPDATED DISPLAY: Date · Context · Reporter */}
            {`${formattedDate} · ${context} · Reported by ${reporterName}`}
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
