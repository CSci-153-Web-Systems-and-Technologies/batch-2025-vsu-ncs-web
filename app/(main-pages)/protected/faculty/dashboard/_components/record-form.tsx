"use client";

import * as React from "react";
import { useState, useEffect } from "react";
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
import { AlertCircle, Check } from "lucide-react";
import { StaffProfile, ConductReport } from "@/types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

// 1. Define Student Shape
export type StudentOption = {
  id: string;
  student_id: string;
  full_name: string;
};

type FormCategory = "merit" | "demerit" | "serious";

type RecordFormProps = {
  students: StudentOption[];
  faculty: StaffProfile;
};

export function RecordForm({ students, faculty }: RecordFormProps) {
  const [category, setCategory] = useState<FormCategory>("demerit");

  // State for Autocomplete
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null
  );
  const [conductRecord, setConductRecord] = useState<ConductReport | null>(
    null
  );

  const isSerious = category === "serious";
  const isMerit = category === "merit";

  // Filter logic for the autocomplete
  const filteredStudents = students.filter((student) => {
    if (!inputValue) return false;
    const search = inputValue.toLowerCase();
    return (
      student.full_name.toLowerCase().includes(search) ||
      student.student_id.toLowerCase().includes(search)
    );
  });

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
          {/* 3. AUTOCOMPLETE INPUT */}
          <div className="grid gap-2 relative">
            <Label>Student</Label>

            {/* If selected, show a locked view or allow clearing */}
            {selectedStudent ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex items-center gap-2">
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {selectedStudent.full_name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {selectedStudent.student_id}
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs hover:text-destructive"
                  onClick={() => {
                    setSelectedStudent(null);
                    setInputValue("");
                  }}
                >
                  Change
                </Button>
              </div>
            ) : (
              <Command>
                <CommandInput
                  placeholder="Type name or ID to search..."
                  value={inputValue}
                  onValueChange={(val) => {
                    setInputValue(val);
                    setOpen(!!val); // Open dropdown if there is text
                  }}
                />

                {/* Only show list if open AND we have text */}
                {open && inputValue.length > 0 && (
                  <div className="absolute top-full z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95">
                    <CommandList>
                      {filteredStudents.length === 0 ? (
                        <CommandEmpty className="p-2 text-sm text-center text-muted-foreground">
                          No student found.
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {filteredStudents.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={`${student.full_name} ${student.student_id}`}
                              onSelect={() => {
                                setSelectedStudent(student);
                                setOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4 opacity-0" // Icon hidden by default
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
                      )}
                    </CommandList>
                  </div>
                )}
              </Command>
            )}

            {/* Hidden Input for Form Submission */}
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
              disabled={!selectedStudent}
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