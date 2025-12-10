"use client";

import { useCallback, useState } from "react";
import RecordCard from "./record-card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConductReportWithStudent } from "@/types";

type ReportCardListProps = {
  data: ConductReportWithStudent[];
};

export default function ReportCardList({ data }: ReportCardListProps) {
  const [type, setType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState(data);
  const [reportCount, setReportCount] = useState(data.length);

  const applyFilters = useCallback(
    (search: string, filterType: string) => {
      const lowerSearch = search.toLowerCase();

      const filtered = data.filter((item) => {
        const s = item.student;
        const matchesSearch =
          search === "" ||
          (s?.student_id || "").includes(search) ||
          (s?.first_name || "").toLowerCase().includes(lowerSearch) ||
          (s?.last_name || "").toLowerCase().includes(lowerSearch);

        const matchesType =
          filterType === "All Types"
            ? true
            : filterType === "Serious Infraction"
            ? item.is_serious_infraction
            : filterType === "Merit"
            ? !item.is_serious_infraction && item.type === "merit"
            : filterType === "Demerit"
            ? !item.is_serious_infraction && item.type === "demerit"
            : true;

        return matchesSearch && matchesType;
      });

      setReports(filtered);
      setReportCount(filtered.length);
    },
    [data]
  );

  const handleSearch = useCallback(
    (value: string) => {
      setSearchQuery(value);
      applyFilters(value, type);
    },
    [type, applyFilters]
  );

  const handleTypeFilter = useCallback(
    (value: string) => {
      setType(value);
      applyFilters(searchQuery, value);
    },
    [searchQuery, applyFilters]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-end">
        <div className="space-y-1">
          <h1 className="font-semibold text-lg md:text-xl tracking-tight">
            Conduct Reports
          </h1>
          <p className="text-sm text-muted-foreground">{`${reportCount} record(s) found`}</p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center w-full sm:w-auto">
          <div className="relative w-full sm:w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by ID or name..."
              value={searchQuery}
              onChange={(event) => handleSearch(event.target.value ?? "")}
              className="pl-9 w-full"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="w-full sm:w-auto justify-between sm:justify-center"
              >
                <span className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 sm:hidden" />
                  {type}
                </span>
                <ChevronDown className="ml-2 h-4 w-4 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[200px]">
              <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuCheckboxItem
                checked={type === "All Types"}
                onCheckedChange={() => handleTypeFilter("All Types")}
              >
                All Types
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={type === "Merit"}
                onCheckedChange={() => handleTypeFilter("Merit")}
              >
                Merit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={type === "Demerit"}
                onCheckedChange={() => handleTypeFilter("Demerit")}
              >
                Demerit
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={type === "Serious Infraction"}
                onCheckedChange={() => handleTypeFilter("Serious Infraction")}
              >
                Serious Infraction
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {reports.map((item) => (
          <RecordCard key={item.id} record={item} />
        ))}
        {reports.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-muted-foreground">
              No records found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}