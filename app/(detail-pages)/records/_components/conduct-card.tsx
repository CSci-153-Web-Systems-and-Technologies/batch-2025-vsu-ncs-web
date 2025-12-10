import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { capitalizeFirstLetter } from "@/lib/utils";
import { ConductReportWithReporter } from "@/types";

type ConductCardProps = {
  record: ConductReportWithReporter;
};

export default function ConductCard({ record }: ConductCardProps) {
  let colorClass = "";
  let borderClass = "";
  let typeText = "";

  if (record.is_serious_infraction) {
    colorClass = "bg-[#FB2C36] hover:bg-[#FB2C36]/90";
    borderClass = "border-[#FB2C36]";
    typeText = "Serious Infraction";
  } else if (record.type === "merit") {
    colorClass = "bg-[#00C950] hover:bg-[#00C950]/90";
    borderClass = "border-[#00C950]";
    typeText = "Merit";
  } else {
    colorClass = "bg-[#FF6900] hover:bg-[#FF6900]/90";
    borderClass = "border-[#FF6900]";
    typeText = "Demerit";
  }

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

  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
  );

  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.last_name}`.trim()
    : "Unknown Faculty";

  const context = capitalizeFirstLetter(record.sanction_context || "General");

  return (
    <div className="w-full">
      <Card className={`${borderClass} border-l-4 shadow-sm h-full`}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <CardTitle className="text-lg leading-snug font-semibold break-words">
              {record.description || "No description provided."}
            </CardTitle>
            <Badge
              className={`${colorClass} text-white w-fit shrink-0 border-transparent shadow-none px-3 py-1 text-sm font-medium`}
            >
              {badgeText}
            </Badge>
          </div>

          <CardDescription className="flex flex-col mt-2 text-sm text-muted-foreground">
            <span className="font-medium text-foreground/80">
              {formattedDate}
            </span>
            <span className="mx-2 text-muted-foreground/40"></span>
            <span>{context}</span>
            <span className="mx-2 text-muted-foreground/40"></span>
            <span>Reported by {reporterName}</span>
          </CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}