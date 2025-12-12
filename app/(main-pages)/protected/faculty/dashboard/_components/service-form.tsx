"use client";

import * as React from "react";
import { useState, useEffect, useActionState, startTransition } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Check, Loader2, ChevronsUpDown } from "lucide-react";
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
import { submitServiceLog } from "@/lib/actions";
import { toast } from "sonner";
import ReviewModal from "@/components/review-modal";

export type StudentOption = {
  id: string;
  student_id: string;
  full_name: string;
};

type ServiceFormProps = {
  students: StudentOption[];
};

export function ServiceForm({ students }: ServiceFormProps) {
  const [state, formAction, isPending] = useActionState(submitServiceLog, null);

  const [open, setOpen] = useState(false);

  const [comboboxOpen, setComboboxOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<StudentOption | null>(
    null
  );

  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [reviewData, setReviewData] = useState<FormData | null>(null);
  const [previewDetails, setPreviewDetails] = useState<Record<string, any>>({});

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state?.success) {
      toast.success(state.message);
      setIsReviewOpen(false);

      timer = setTimeout(() => {
        setOpen(false);
        setSelectedStudent(null);
      }, 1000);
    } else if (state?.error) {
      toast.error(state.error);
      setIsReviewOpen(false);
    }

    return () => clearTimeout(timer);
  }, [state]);

  const handleInitialSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    setReviewData(formData);

    setPreviewDetails({
      Student: selectedStudent?.full_name,
      "Service Duration": `${formData.get("served_days")} Days`,
      Description: formData.get("description") || "No description",
    });

    setIsReviewOpen(true);
  };

  const handleFinalConfirm = () => {
    if (reviewData) {
      startTransition(() => {
        formAction(reviewData);
      });
    }
  };

  return (
    <>
      <ReviewModal
        isOpen={isReviewOpen}
        onClose={() => setIsReviewOpen(false)}
        onConfirm={handleFinalConfirm}
        isPending={isPending}
        data={previewDetails}
        title="Confirm Service Log"
        warningText="Please verify the student name and number of days served."
      />
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#0A58A3] hover:bg-[#094b8a]">
            Log Service
          </Button>
        </DialogTrigger>

        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Log Service</DialogTitle>
            <DialogDescription>
              Search for a student and submit a new extension service.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleInitialSubmit} className="grid gap-6 py-4">
            <input
              type="hidden"
              name="student_uuid"
              value={selectedStudent?.id || ""}
            />

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

            <div className="grid gap-2">
              <Label htmlFor="served_days">{"Service (Days)"}</Label>
              <Input
                id="served_days"
                name="served_days"
                type="number"
                placeholder="0"
                min={0}
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe the incident..."
                className="resize-none h-24"
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
                className="bg-[#0A58A3] hover:bg-[#094b8a]"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {"Log Service"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
