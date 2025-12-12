"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StudentConductSummary } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<StudentConductSummary>[] = [
  {
    id: "full_name",
    accessorFn: (row) =>
      `${row.last_name}, ${row.first_name} ${row.middle_name || ""}`,
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { last_name, first_name, middle_name, suffix } = row.original;
      return `${last_name}, ${first_name} ${middle_name?.[0] || ""}. ${
        suffix || ""
      }`;
    },
  },
  {
    accessorKey: "student_id",
    header: "Student ID",
  },
  {
    accessorKey: "year_level",
    header: "Year Level",
  },
  {
    accessorKey: "sex",
    header: "Sex",
  },
  {
    accessorKey: "extension_days",
    header: "Extension (Days)",
    cell: ({ row }) => {
      const amount = row.getValue("extension_days") as number;
      return (
        <span
          className={
            amount > 0
              ? "text-red-600 font-bold"
              : "text-emerald-600 font-medium"
          }
        >
          {amount > 0 ? `${amount} Days` : "Cleared"}
        </span>
      );
    },
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={`/records/students/${row.original.id}`}>View</Link>
        </Button>
      );
    },
  },
];