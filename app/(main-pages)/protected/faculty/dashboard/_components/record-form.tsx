"use client";

import * as React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AlertCircle, Check, ChevronsUpDown } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils"; // Ensure you have this utility

// 1. Define the shape of the student data we need for searching
export type StudentOption = {
  id: string; // Database UUID
  student_id: string; // Readable ID (e.g., 2023-1024)
  full_name: string; // Pre-combined first + last name
};

type FormCategory = "merit" | "demerit" | "serious";

// 2. Accept students as a prop
type RecordFormProps = {
  students: StudentOption[];
};

export function RecordForm({ students }: RecordFormProps) {
  const [category, setCategory] = useState<FormCategory>("demerit");

  // State for Combobox
  const [openCombobox, setOpenCombobox] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null
  );

  const isSerious = category === "serious";
  const isMerit = category === "merit";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="w-full bg-[#0A58A3] hover:bg-[#094b8a]"
          variant="default"
        >
          Log Conduct
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Log Conduct Report</DialogTitle>
          <DialogDescription>
            Search for a student and submit a new record.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-6 py-4">
          {/* 3. COMBOBOX: Search by Name or ID */}
          <div className="grid gap-2">
            <Label>Student</Label>
            <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={openCombobox}
                  className="w-full justify-between font-normal text-left"
                >
                  {selectedStudent ? (
                    <span className="flex flex-col items-start leading-tight">
                      <span className="font-semibold">
                        {selectedStudent.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedStudent.student_id}
                      </span>
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      Search name or ID number...
                    </span>
                  )}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0" align="start">
                <Command>
                  <CommandInput placeholder="Type name or ID..." />
                  <CommandList>
                    <CommandEmpty>No student found.</CommandEmpty>
                    <CommandGroup>
                      {students.map((student) => (
                        <CommandItem
                          key={student.id}
                          // 4. IMPORTANT: We combine both strings into the value
                          // so the fuzzy search matches EITHER the name OR the ID
                          value={`${student.full_name} ${student.student_id}`}
                          onSelect={() => {
                            setSelectedStudent(student);
                            setOpenCombobox(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              selectedStudent?.id === student.id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          <div className="flex flex-col">
                            <span>{student.full_name}</span>
                            <span className="text-xs text-muted-foreground">
                              {student.student_id}
                            </span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            {/* Hidden Input to actually submit the UUID */}
            <input
              type="hidden"
              name="student_uuid"
              value={selectedStudent?.id || ""}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="category">Category</Label>
              <Select
                onValueChange={(val) => setCategory(val as FormCategory)}
                defaultValue="demerit"
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demerit">Demerit (Minor)</SelectItem>
                  <SelectItem value="serious">Serious Infraction</SelectItem>
                  <SelectItem value="merit">Merit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="context">Context</Label>
              <Select defaultValue="office">
                <SelectTrigger id="context">
                  <SelectValue placeholder="Select context" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="rle">RLE / Duty</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {!isSerious && (
            <div className="grid gap-2">
              <Label htmlFor="sanction_days">
                {isMerit ? "Merit Points" : "Demerit Days / Hours"}
              </Label>
              <Input
                id="sanction_days"
                type="number"
                placeholder="0"
                min={0}
                required
              />
            </div>
          )}

          {isSerious && (
            <div className="flex items-start gap-3 bg-red-50 text-red-800 p-4 rounded-md text-sm border border-red-100">
              <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="flex flex-col gap-1">
                <span className="font-semibold">Admin Review Required</span>
                <span className="text-red-700/80 leading-relaxed">
                  No immediate sanction will be applied. This report will be
                  queued for administrative investigation.
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder={
                isSerious
                  ? "Describe the serious incident details..."
                  : "Describe the incident or reason..."
              }
              className="resize-none h-24"
              required
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={!selectedStudent} // Prevent submit if no student selected
              className={
                isSerious
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0A58A3] hover:bg-[#094b8a]"
              }
            >
              {isSerious ? "Submit for Review" : "Log Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}