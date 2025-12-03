"use client";

import { Button } from "@/components/ui/button";
import { Gavel } from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SeriousInfractionTicket } from "@/types"; // <--- Admin Ticket Type
import { useState } from "react";

export default function ReviewDialog({
  record,
  studentName,
}: {
  record: SeriousInfractionTicket;
  studentName: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 hover:bg-red-700 text-white gap-2">
          <Gavel className="w-4 h-4" />
          Review Case
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Admin Review</DialogTitle>
          <DialogDescription>
            Adjudicate the case for <strong>{studentName}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Sanction Type</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="demerit">Demerit</SelectItem>
                  <SelectItem value="merit">Merit (Correction)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Days / Points</Label>
              <Input type="number" placeholder="0" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Context</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="office">Office</SelectItem>
                <SelectItem value="rle">RLE / Duty</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Admin Notes / Verdict</Label>
            <Textarea
              placeholder="Enter the official resolution details here..."
              className="h-[100px]"
            />
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button className="bg-red-600 hover:bg-red-700">
            Submit Decision
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
