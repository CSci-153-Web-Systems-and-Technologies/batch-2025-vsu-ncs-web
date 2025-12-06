"use client";

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
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

type StudentDialogProps = {
  id: string;
};

export function StudentDialog({ id }: StudentDialogProps) {
  const [name, setName] = useState("");
  const [studentID, setStudentID] = useState("");

  useEffect(() => {
    async function fetchName(studentID: string) {
      const supabase = await createClient();
      const { data: profile } = await supabase
        .from("student_profiles")
        .select("full_name, student_id")
        .eq("id", studentID)
        .single();

      setName(profile?.full_name);
      setStudentID(profile?.student_id);
    }

    fetchName(id);
  });
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button className="w-full bg-[#0A58A3]" variant="default">
            View
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{name}</DialogTitle>
            <DialogDescription>{studentID}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
