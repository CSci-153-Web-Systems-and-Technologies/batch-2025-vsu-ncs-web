"use client";

import ServiceLogCard from "./service-log-card";
import { ServiceLogWithReporter } from "@/types";
import { FileText } from "lucide-react";

type ServiceLogListProps = {
  data: ServiceLogWithReporter[];
};

export default function ServiceLogList({ data }: ServiceLogListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">
          Service Records ({data.length})
        </h2>
      </div>

      <div className="space-y-4">
        {data.map((record) => (
          <ServiceLogCard key={record.id} record={record} />
        ))}

        {data.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 border-2 border-dashed rounded-lg bg-slate-50">
            <div className="p-3 rounded-full bg-slate-100 mb-4">
              <FileText className="w-6 h-6 text-slate-400" />
            </div>
            <h3 className="font-medium text-slate-900">No Service Logs</h3>
            <p className="text-sm text-slate-500 mt-1">
              You haven&apos;t logged any extension duties yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}