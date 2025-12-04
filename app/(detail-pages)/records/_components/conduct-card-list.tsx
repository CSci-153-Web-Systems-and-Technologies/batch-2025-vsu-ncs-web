"use client";

import ConductCard from "./conduct-card";
import * as React from "react";
import { ConductReportWithReporter, SanctionContext } from "@/types";
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

// 1. UPDATED: Props use the new interface
type ConductCardListProps = {
  data: ConductReportWithReporter[];
};

type FilterType = "All Types" | "Merit" | "Demerit" | "Serious Infraction";
type FilterContext = "All Context" | SanctionContext;

export default function ConductCardList({ data }: ConductCardListProps) {
  const [type, setType] = React.useState<FilterType>("All Types");
  const [context, setContext] = React.useState<FilterContext>("All Context");

  const filteredRecords = React.useMemo(() => {
    return (
      data
        // Filter by Type
        .filter((record) => {
          if (type === "All Types") return true;
          if (type === "Serious Infraction")
            return record.is_serious_infraction;
          if (type === "Merit")
            return !record.is_serious_infraction && record.type === "merit";
          if (type === "Demerit")
            return !record.is_serious_infraction && record.type === "demerit";
          return true;
        })
        // Filter by Context
        .filter((record) => {
          if (context === "All Context") return true;
          return record.sanction_context === context;
        })
    );
  }, [data, type, context]);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Type Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {type} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["All Types", "Merit", "Demerit", "Serious Infraction"].map(
              (t) => (
                <DropdownMenuCheckboxItem
                  key={t}
                  checked={type === t}
                  onCheckedChange={() => setType(t as FilterType)}
                >
                  {t}
                </DropdownMenuCheckboxItem>
              )
            )}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Context Filter */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="w-full">
              {context === "All Context"
                ? "All Context"
                : context === "office"
                ? "Office"
                : "RLE/Duty"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[200px]">
            <DropdownMenuLabel>Filter by Context</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
              checked={context === "All Context"}
              onCheckedChange={() => setContext("All Context")}
            >
              All Context
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={context === "office"}
              onCheckedChange={() => setContext("office")}
            >
              Office
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={context === "rle"}
              onCheckedChange={() => setContext("rle")}
            >
              RLE/Duty
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Render Cards */}
      {filteredRecords.map((record) => (
        <ConductCard key={record.id} record={record} />
      ))}
      {filteredRecords.length === 0 && (
        <p className="text-center text-gray-500">No records found.</p>
      )}
    </div>
  );
}
