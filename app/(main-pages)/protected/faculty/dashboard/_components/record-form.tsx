"use client";

import * as React from "react";
import { useState, useEffect, useActionState } from "react";
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
import { AlertCircle, Check, Loader2, ChevronsUpDown } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { submitConductReport } from "@/lib/actions";
import { toast, Toaster } from "sonner";

export type StudentOption = {
  id: string;
  student_id: string;
  full_name: string;
};

type FormCategory = "merit" | "demerit" | "serious";
type SanctionContext = "office" | "rle";

type RecordFormProps = {
  students: StudentOption[];
};

export function RecordForm({ students }: RecordFormProps) {
  const [state, formAction, isPending] = useActionState(
    submitConductReport,
    null
  );

  const [open, setOpen] = useState(false);
  const [category, setCategory] = useState<FormCategory>("demerit");
  const [context, setContext] = useState<SanctionContext>("office");

  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null
  );

  const isSerious = category === "serious";
  const isMerit = category === "merit";

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state?.success) {
      toast.success(state.message);

      timer = setTimeout(() => {
        setOpen(false);
        setSelectedStudent(null);
        setCategory("demerit");
        setContext("office");
      }, 1000);
    } else if (state?.error) {
      toast.error(state.error);
    }

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#0A58A3] hover:bg-[#094b8a]">
          Log Conduct
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <Toaster position="top-right" />
          <DialogTitle>Log Conduct Report</DialogTitle>
          <DialogDescription>
            Search for a student and submit a new record.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-6 py-4">
          <input
            type="hidden"
            name="student_uuid"
            value={selectedStudent?.id || ""}
          />
          <input type="hidden" name="category" value={category} />
          <input type="hidden" name="context" value={context} />

          <div className="grid gap-2 relative">
            <Label>Student</Label>
            <Popover open={comboboxOpen} onOpenChange={setComboboxOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={comboboxOpen}
                  className="w-full justify-between font-normal"
                >
                  {selectedStudent ? (
                    <div className="flex flex-col items-start text-left">
                      <span className="font-semibold">
                        {selectedStudent.full_name}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {selectedStudent.student_id}
                      </span>
                    </div>
                  ) : (
                    "Search name or ID..."
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
                          value={`${student.full_name} ${student.student_id}`}
                          onSelect={() => {
                            setSelectedStudent(student);
                            setComboboxOpen(false);
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              <Select
                value={category}
                onValueChange={(v) => setCategory(v as FormCategory)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demerit">Demerit (Minor)</SelectItem>
                  <SelectItem value="serious">Serious Infraction</SelectItem>
                  <SelectItem value="merit">Merit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Context</Label>
              <Select
                value={context}
                onValueChange={(v) => setContext(v as SanctionContext)}
              >
                <SelectTrigger>
                  <SelectValue />
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
                name="sanction_days"
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
                  queued for investigation.
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Describe the incident..."
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
              disabled={isPending || !selectedStudent}
              className={
                isSerious
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-[#0A58A3] hover:bg-[#094b8a]"
              }
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isSerious ? "Submit for Review" : "Log Record"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}