"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
}

export function ConductRecordsTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [type, setType] = React.useState("All Type");
  const [context, setContext] = React.useState("All Context");
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    getSortedRowModel: getSortedRowModel(),
    state: {
      sorting,
      columnFilters,
      columnVisibility,
    },
  });

  function filterByType(type: string) {
    setType(type);
    table.getColumn("type")?.setFilterValue(type === "All Type" ? "" : type);
  }

  function filterByContext(context: string) {
    setContext(context);
    table
      .getColumn("sanction_context")
      ?.setFilterValue(context === "All Context" ? "" : context);
  }

  return (
    <div>
      <Card className="space-y-6 p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* ... (Header Text) ... */}
          <div className="text-[18px]">
            <h1 className="font-semibold">Conduct Records</h1>
            <p className="text-[#6C757D]">{`${table.getRowCount()} record(s) found`}</p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {/* Type Filter */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  {type} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Filter by Type</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {["All Type", "Merit", "Demerit", "Serious Infraction"].map(
                  (t) => (
                    <DropdownMenuCheckboxItem
                      key={t}
                      checked={type === t}
                      onCheckedChange={() => filterByType(t)}
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
                <Button variant="outline" className="w-full sm:w-auto">
                  {context === "All Context"
                    ? "All Context"
                    : context === "office"
                    ? "Office"
                    : "RLE/Duty"}{" "}
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[200px]">
                <DropdownMenuLabel>Filter by Context</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={context === "All Context"}
                  onCheckedChange={() => filterByContext("All Context")}
                >
                  All Context
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={context === "office"}
                  onCheckedChange={() => filterByContext("office")}
                >
                  Office
                </DropdownMenuCheckboxItem>
                <DropdownMenuCheckboxItem
                  checked={context === "rle"}
                  onCheckedChange={() => filterByContext("rle")}
                >
                  RLE/Duty
                </DropdownMenuCheckboxItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="whitespace-nowrap">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="whitespace-nowrap">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
}
