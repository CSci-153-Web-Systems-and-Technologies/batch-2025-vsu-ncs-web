"use client";

import SeriousInfractionCard from "./serious-infraction-card";
import { SeriousInfractionTicket, InfractionStatus } from "@/types"; // <--- UPDATED IMPORT
import * as React from "react";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input"; // <--- Added Input

import { ChevronDown, Filter, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

type SeriousInfractionListProps = {
  data: SeriousInfractionTicket[]; // <--- UPDATED TYPE (Admin Ticket)
};

type FilterStatus = "All" | InfractionStatus;

export default function SeriousInfractionList({
  data,
}: SeriousInfractionListProps) {
  const [status, setStatus] = React.useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = React.useState(""); // <--- Added Search State

  const filteredRecords = React.useMemo(() => {
    const lowerSearch = searchQuery.toLowerCase();

    return data.filter((record) => {
      // 1. Status Filter
      const matchesStatus = status === "All" || record.status === status;

      // 2. Search Filter (Check Student Name AND Reporter Name)
      const studentName = record.student
        ? `${record.student.first_name} ${record.student.last_name}`.toLowerCase()
        : "";
      const reporterName = record.reporter
        ? `${record.reporter.first_name} ${record.reporter.last_name}`.toLowerCase()
        : "";

      const matchesSearch =
        searchQuery === "" ||
        studentName.includes(lowerSearch) ||
        reporterName.includes(lowerSearch);

      return matchesStatus && matchesSearch;
    });
  }, [data, status, searchQuery]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-lg font-semibold text-gray-700 whitespace-nowrap">
          Case Queue
        </h2>

        <div className="flex flex-row gap-3 w-full sm:w-auto">
          {/* SEARCH INPUT */}
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search student or reporter..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>

          {/* STATUS FILTER */}
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
      </div>

      {/* Render Cards */}
      <div className="space-y-4">
        {filteredRecords.map((record) => (
          <SeriousInfractionCard key={record.id} record={record} />
        ))}

        {filteredRecords.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg bg-slate-50">
            <p className="text-muted-foreground">
              No tickets found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}