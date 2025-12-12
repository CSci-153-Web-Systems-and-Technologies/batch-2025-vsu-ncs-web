"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ServiceLogWithReporter } from "@/types";
import { CalendarCheck, User } from "lucide-react";

type ServiceLogCardProps = {
  record: ServiceLogWithReporter;
};

export default function ServiceLogCard({ record }: ServiceLogCardProps) {
  const formattedDate = new Date(record.created_at).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  );

  const reporterName = record.reporter
    ? `${record.reporter.title || ""} ${record.reporter.first_name} ${
        record.reporter.last_name
      }`.trim()
    : "Unknown Faculty";

  return (
    <Card className="border-l-4 border-l-blue-500 hover:bg-slate-50 transition-colors">
      <CardHeader className="pb-3">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-blue-600" />
              <CardTitle className="text-lg text-slate-800">
                Extension Duty
              </CardTitle>
              <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                -{record.days_deducted} Days
              </span>
            </div>
            <CardDescription className="flex items-center gap-1.5 pt-1">
              <span>{formattedDate}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <User className="w-3 h-3" /> Signed by {reporterName}
              </span>
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div>
          <h4 className="text-xs uppercase tracking-wider font-semibold text-slate-500 mb-1">
            Service Details
          </h4>
          <p className="text-sm text-slate-700">
            {record.description || "No description provided."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}