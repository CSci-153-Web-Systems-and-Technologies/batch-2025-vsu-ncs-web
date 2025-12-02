import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ConductReportWithReporter } from "@/types";
//import { capitalizeFirstLetter } from "@/lib/utils";
import { AlertCircle, CheckCircle2, User } from "lucide-react";

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
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    }
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
        {isResolved && record.response && (
          <>
            <Separator />
            <div className="bg-slate-50 p-4 rounded-md space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
                <User className="w-4 h-4" />
                <span>Admin Decision</span>
              </div>

              <div className="grid gap-2 text-sm">
                <div>
                  <span className="font-medium">Final Sanction: </span>
                  <span className="text-red-600 font-medium">
                    {record.response.final_sanction || "No sanction specified"}
                  </span>
                </div>
                {record.response.notes && (
                  <div>
                    <span className="font-medium">Admin Notes: </span>
                    <span className="text-muted-foreground">
                      {record.response.notes}
                    </span>
                  </div>
                )}
                <div className="text-xs text-muted-foreground pt-1">
                  Resolved by {record.response.admin_name} on{" "}
                  {new Date(record.response.resolved_at).toLocaleDateString()}
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
