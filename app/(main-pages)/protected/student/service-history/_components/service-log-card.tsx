"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceLogWithReporter } from "@/types";

type ServiceLogCardProps = {
  record: ServiceLogWithReporter;
};

export default function ServiceLogCard({ record }: ServiceLogCardProps) {
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.last_name}`.trim()
    : "Unknown Faculty";

  return (
    <Card
      className={`border-l-4 "border-slate-600"
      `}
    >
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg text-slate-600">
                Service Record
              </CardTitle>
            </div>
            <CardDescription>
              {formattedDate} · Reported by {reporterName}
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <h4 className="text-sm font-semibold mb-1">Description of Service</h4>
          <p className="text-sm text-muted-foreground">{record.description}</p>
        </div>
      </CardContent>
    </Card>
  );
}
