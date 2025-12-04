"use client";

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
import { Switch } from "@/components/ui/switch"; // Assuming you have this, or use Checkbox
import { ConductReportType, SanctionContext } from "@/types";
import { AlertCircle } from "lucide-react";

export function RecordForm() {
  // State for conditional logic
  const [type, setType] = useState<ConductReportType>("demerit");
  const [isSerious, setIsSerious] = useState(false);

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
            Submit a new merit or demerit record for a student.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-6 py-4">
          {/* 1. Student Identification */}
          {/* Ideally this is a Combobox to search students, but Input for now */}
          <div className="grid gap-2">
            <Label htmlFor="student_id">Student ID</Label>
            <Input id="student_id" placeholder="e.g., 2023-12345" required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* 2. Report Type */}
            <div className="grid gap-2">
              <Label htmlFor="type">Type</Label>
              <Select
                onValueChange={(val) => setType(val as ConductReportType)}
                defaultValue="demerit"
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demerit">Demerit</SelectItem>
                  <SelectItem value="merit">Merit</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* 3. Sanction Context */}
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

          {/* 4. Serious Infraction Toggle (Only for Demerits) */}
          {type === "demerit" && (
            <div className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
              <div className="space-y-0.5">
                <Label className="text-base">Serious Infraction</Label>
                <p className="text-sm text-muted-foreground">
                  Flag for admin review
                </p>
              </div>
              <Switch checked={isSerious} onCheckedChange={setIsSerious} />
            </div>
          )}

          {/* 5. Sanction Amount (Hidden if Serious) */}
          {!isSerious && (
            <div className="grid gap-2">
              <Label htmlFor="sanction_days">
                {type === "merit" ? "Merit Points" : "Demerit Days / Hours"}
              </Label>
              <Input id="sanction_days" type="number" placeholder="0" min={0} />
            </div>
          )}

          {/* 6. Description */}
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the incident or reason for merit..."
              className="resize-none h-24"
              required
            />
          </div>

          {/* Warning Message for Serious Infractions */}
          {isSerious && (
            <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 p-3 rounded-md text-sm">
              <AlertCircle className="h-4 w-4" />
              <span>
                This report will be forwarded to the admin for final
                sanctioning.
              </span>
            </div>
          )}

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              className={
                isSerious ? "bg-red-600 hover:bg-red-700" : "bg-[#0A58A3]"
              }
            >
              Submit Report
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
