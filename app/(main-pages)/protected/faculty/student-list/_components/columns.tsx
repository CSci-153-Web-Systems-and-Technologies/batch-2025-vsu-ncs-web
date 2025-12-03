"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StudentConductSummary } from "@/types"; // <--- Updated Import
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<StudentConductSummary>[] = [
  {
    // Combine names for sorting/filtering
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
    accessorKey: "net_office_sanction",
    header: "Net Office",
    cell: ({ row }) => {
      const amount = row.getValue("net_office_sanction") as number;
      return (
        <span
          className={
            amount > 0 ? "text-orange-600 font-medium" : "text-gray-500"
          }
        >
          {amount}
        </span>
      );
    },
  },
  {
    accessorKey: "net_rle_sanction",
    header: "Net RLE",
    cell: ({ row }) => {
      const amount = row.getValue("net_rle_sanction") as number;
      return (
        <span
          className={amount > 0 ? "text-blue-600 font-medium" : "text-gray-500"}
        >
          {amount}
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
