"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { ConductReportWithReporter } from "@/types"; // <--- Updated Import
import { capitalizeFirstLetter } from "@/lib/utils";

export const columns: ColumnDef<ConductReportWithReporter>[] = [
  {
    // 1. UPDATED: Access 'created_at' instead of 'date'
    accessorKey: "created_at",
    header: "Date",
    cell: ({ row }) => {
      // 2. UPDATED: Format ISO string to readable date
      const date = new Date(row.getValue("created_at"));
      return (
        <span>
          {date.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </span>
      );
    },
  },
  {
    // 3. UPDATED: Use accessorFn to extract name from object
    id: "reporter",
    header: "Reported By",
    accessorFn: (row) => {
      if (!row.reporter) return "Unknown";
      return `${row.reporter.last_name}`; // Return string for sorting/filtering
    },
    cell: ({ row }) => {
      const reporter = row.original.reporter;
      return reporter
        ? `${reporter.title || ""} ${reporter.last_name}`.trim()
        : "Unknown Faculty";
    },
  },
  {
    accessorKey: "sanction_days",
    header: "Sanction",
    cell: ({ row }) => {
      const {
        is_serious_infraction,
        type,
        sanction_days,
        sanction_context,
        sanction_other,
      } = row.original;

      const base =
        "inline-flex items-center rounded-full px-3 py-0.5 text-sm font-medium text-white";

      let colorClass = "";
      if (is_serious_infraction) {
        colorClass = "bg-[#FB2C36]";
      } else if (type === "merit") {
        colorClass = "bg-[#00C950]";
      } else {
        colorClass = "bg-[#FF6900]";
      }

      // 4. UPDATED: Handle null/undefined sanction_days safely
      const days = sanction_days ?? 0;
      let text = "";

      if (days > 0) {
        const dayText = days === 1 ? "day" : "days";
        const typeText = type === "merit" ? "Merit" : "Demerit";
        text = `${days} ${typeText} ${dayText}`;
      } else if (sanction_other) {
        text = sanction_other;
      } else {
        text = "Warning";
      }

      const contextText = capitalizeFirstLetter(sanction_context || "General");

      return (
        <Badge className={`${base} ${colorClass}`}>
          {text} ({contextText})
        </Badge>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  // --- HIDDEN FILTERS ---
  {
    id: "is_serious_infraction",
    accessorKey: "is_serious_infraction",
    header: () => null,
    cell: () => null,
  },
  {
    id: "type",
    accessorFn: (row) => {
      if (row.is_serious_infraction) return "Serious Infraction";
      if (row.type === "merit") return "Merit";
      return "Demerit";
    },
    header: () => null,
    cell: () => null,
    filterFn: "equalsString",
  },
  {
    id: "sanction_context",
    accessorKey: "sanction_context",
    header: () => null,
    cell: () => null,
    filterFn: "equalsString",
  },
];
