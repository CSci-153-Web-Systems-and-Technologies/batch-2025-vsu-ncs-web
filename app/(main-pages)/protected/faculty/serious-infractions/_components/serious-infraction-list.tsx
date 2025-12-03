"use client";

import SeriousInfractionCard from "./serious-infraction-card";
import { ConductReportWithReporter, InfractionStatus } from "@/types";
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";

type SeriousInfractionListProps = {
  data: ConductReportWithReporter[];
};

type FilterStatus = "All" | InfractionStatus; // "All" | "Pending" | "Resolved"

export default function SeriousInfractionList({ data }: SeriousInfractionListProps) {
  const [status, setStatus] = React.useState<FilterStatus>("All");

  const filteredRecords = React.useMemo(() => {
    if (status === "All") return data;
    return data.filter((record) => record.status === status);
  }, [data, status]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-700">Case History</h2>
        
        {/* Status Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="min-w-[140px]">
              <Filter className="mr-2 h-4 w-4" />
              {status === "All" ? "All Status" : status} 
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[180px]">
            <DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["All", "Pending", "Resolved"].map((s) => (
              <DropdownMenuCheckboxItem
                key={s}
                checked={status === s}
                onCheckedChange={() => setStatus(s as FilterStatus)}
              >
                {s === "All" ? "All Status" : s}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Render Cards */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <SeriousInfractionCard key={record.id} record={record} />
        ))}
        
        {filteredRecords.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg">
            <p className="text-muted-foreground">No serious infractions found matching this filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}