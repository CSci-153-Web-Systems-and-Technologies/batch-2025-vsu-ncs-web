"use client";

import { useActionState, useEffect, useState } from "react";
import { submitConductReport } from "@/lib/actions"; // Import the action
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
import { AlertCircle, Check, ChevronsUpDown, Loader2 } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast"; // Assuming you have Shadcn Toast

// --- Types ---
export type StudentOption = {
  id: string;
  student_id: string;
  full_name: string;
};

type FormCategory = "merit" | "demerit" | "serious";

type RecordFormProps = {
  students: StudentOption[];
};

// --- Component ---
export function RecordForm({ students }: RecordFormProps) {
  const [open, setOpen] = useState(false); // Controls Dialog open state
  const { toast } = useToast();

  // 1. Setup Server Action Hook
  const [state, action, isPending] = useActionState(submitConductReport, null);

  // Local state for UI logic
  const [category, setCategory] = useState<FormCategory>("demerit");
  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null
  );

  const isSerious = category === "serious";
  const isMerit = category === "merit";

  // Filter students for autocomplete
  const filteredStudents = students.filter((student) => {
    if (!inputValue) return false;
    const search = inputValue.toLowerCase();
    return (
      student.full_name.toLowerCase().includes(search) ||
      student.student_id.toLowerCase().includes(search)
    );
  });

  // 2. Handle Action Success/Error
  useEffect(() => {
    if (state?.success) {
      toast({ title: "Success", description: state.message });
      setOpen(false); // Close modal
      // Reset form state if needed
      setSelectedStudent(null);
      setInputValue("");
      setCategory("demerit");
    } else if (state?.error) {
      toast({
        title: "Error",
        description: state.error,
        variant: "destructive",
      });
    }
  }, [state, toast]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full bg-[#0A58A3] hover:bg-[#094b8a]">
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

        {/* 3. Connect the form to the Server Action */}
        <form action={action} className="grid gap-6 py-4">
          {/* --- Hidden Inputs to pass non-input state to Server Action --- */}
          <input
            type="hidden"
            name="student_uuid"
            value={selectedStudent?.id || ""}
          />
          <input type="hidden" name="category" value={category} />

          {/* Student Search UI (Same as before) */}
          <div className="grid gap-2 relative">
            <Label>Student</Label>
            {selectedStudent ? (
              <div className="flex items-center justify-between p-2 border rounded-md bg-muted/50">
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {selectedStudent.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {selectedStudent.student_id}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs hover:text-destructive"
                  onClick={() => {
                    setSelectedStudent(null);
                    setInputValue("");
                  }}
                  type="button" // Important: type="button" prevents form submit
                >
                  Change
                </Button>
              </div>
            ) : (
              <Command className="rounded-lg border shadow-md overflow-visible">
                <CommandInput
                  placeholder="Type name or ID to search..."
                  value={inputValue}
                  onValueChange={(val) => {
                    setInputValue(val);
                    setComboboxOpen(!!val);
                  }}
                />
                {comboboxOpen && inputValue.length > 0 && (
                  <div className="absolute top-full z-50 w-full mt-1 bg-popover text-popover-foreground rounded-md border shadow-md animate-in fade-in-0 zoom-in-95">
                    <CommandList>
                      {filteredStudents.length === 0 ? (
                        <CommandEmpty className="p-2 text-sm text-center">
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
                                setComboboxOpen(false);
                              }}
                              className="cursor-pointer"
                            >
                              <Check className={cn("mr-2 h-4 w-4 opacity-0")} />
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label>Category</Label>
              {/* UI Control for Category */}
              <Select
                value={category}
                onValueChange={(val) => setCategory(val as FormCategory)}
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
              <Label htmlFor="context">Context</Label>
              {/* Native name attribute allows automatic capture */}
              <Select name="context" defaultValue="office">
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
                name="sanction_days" // Name attribute captures this value
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
                  No immediate sanction applied. Queued for admin investigation.
                </span>
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              name="description" // Name attribute captures this value
              placeholder="Describe the details..."
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