"use client";

import { useCallback, useState } from "react";
import RecordCard from "../../dashboard/_components/record-card"; // Ensure this path points to your refactored RecordCard
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConductReportWithStudent } from "@/types"; // <--- NEW IMPORT

type ReportCardListProps = {
  data: ConductReportWithStudent[]; // <--- NEW TYPE
};

export default function ReportCardList({ data }: ReportCardListProps) {
  const [type, setType] = useState("All Types");
  const [searchQuery, setSearchQuery] = useState("");
  const [reports, setReports] = useState(data);
  const [reportCount, setReportCount] = useState(data.length);

  // Combined filter function
  const applyFilters = useCallback(
    (search: string, filterType: string) => {
      const lowerSearch = search.toLowerCase();

      const filtered = data.filter((item) => {
        // 1. Search Filter (Safe Navigation for student object)
        const s = item.student;
        const matchesSearch =
          search === "" ||
          (s?.student_id || "").includes(search) ||
          (s?.first_name || "").toLowerCase().includes(lowerSearch) ||
          (s?.middle_name || "").toLowerCase().includes(lowerSearch) ||
          (s?.last_name || "").toLowerCase().includes(lowerSearch) ||
          (s?.suffix || "").toLowerCase().includes(lowerSearch);

        // 2. Type Filter (Using strict 'type' field)
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-row justify-between">
        <div className="text-[18px]">
          <h1 className="font-semibold">Conduct Reports</h1>
          <p className="text-[#6C757D]">{`${reportCount} record(s) found`}</p>
        </div>
        <div className="flex flex-row gap-4">
          <Input
            placeholder="Search by id or name..."
            value={searchQuery}
            onChange={(event) => handleSearch(event.target.value ?? "")}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                {type} <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[200px]">
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
          // UPDATED: Now passing the whole object to the refactored RecordCard
          <RecordCard key={item.id} record={item} />
        ))}
        {reports.length === 0 && (
          <p className="text-center text-gray-500">No records found.</p>
        )}
      </div>
    </div>
  );
}
