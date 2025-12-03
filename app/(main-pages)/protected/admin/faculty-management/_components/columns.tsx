"use client";

import { ColumnDef } from "@tanstack/react-table";
import { StaffProfile } from "@/types"; // <--- Updated Import
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<StaffProfile>[] = [
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
  { accessorKey: "role", header: "Role" },
  { accessorKey: "title", header: "Title" },
  {
    accessorKey: "employee_id",
    header: "ID",
  },
  {
    accessorKey: "sex",
    header: "Sex",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button asChild size="sm" variant="outline">
          <Link href={`/records/staff/${row.original.id}`}>View</Link>
        </Button>
      );
    },
  },
];
