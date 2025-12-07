"use client";

import { useState, useActionState, useEffect } from "react";
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
import { Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { createStaffAccount } from "@/lib/actions";

export function CreateStaffDialog() {
  const [open, setOpen] = useState(false);

  const [state, formAction, isPending] = useActionState(
    createStaffAccount,
    null
  );

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (state?.success) {
      toast.success(state.message);
      timer = setTimeout(() => {
        setOpen(false);
      }, 2000);
    } else if (state?.error) {
      toast.error(state.error);
    }

    return () => clearTimeout(timer);
  }, [state]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-[#0A58A3] hover:bg-[#094b8a]">
          <UserPlus className="mr-2 h-4 w-4" />
          Create Staff
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Staff Account</DialogTitle>
          <DialogDescription>
            Manually add a new faculty or admin. They will receive a temporary
            password.
          </DialogDescription>
        </DialogHeader>

        <form action={formAction} className="grid gap-6 py-4">
          {/* --- ROW 1: ID & Email --- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="employee_id">Employee ID</Label>
              <Input
                id="employee_id"
                name="employee_id"
                placeholder="2X-1-XXXXX"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="email">VSU Email Address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="staff@vsu.edu.ph"
                required
              />
            </div>
          </div>

          {/* --- ROW 2: First & Last Name --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="first_name">First Name</Label>
              <Input
                id="first_name"
                name="first_name"
                placeholder="e.g. Maria"
                required
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="last_name">Last Name</Label>
              <Input
                id="last_name"
                name="last_name"
                placeholder="e.g. Clara"
                required
              />
            </div>
          </div>

          {/* --- ROW 3: Middle Name & Suffix --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="middle_name">
                Middle Name{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (Optional)
                </span>
              </Label>
              <Input
                id="middle_name"
                name="middle_name"
                placeholder="e.g. Reyes"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="suffix">
                Suffix{" "}
                <span className="text-muted-foreground text-xs font-normal">
                  (Optional)
                </span>
              </Label>
              <Input id="suffix" name="suffix" placeholder="e.g. PhD, RN" />
            </div>
          </div>

          {/* --- ROW 4: Title & Sex --- */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="e.g. Mr., Ms., Dr., Prof."
                required
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="sex">Sex</Label>
              <Select name="sex" required>
                <SelectTrigger>
                  <SelectValue placeholder="Select Sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* --- ROW 5: Role --- */}
          <div className="grid gap-2">
            <Label htmlFor="role">System Role</Label>
            <Select name="role" required defaultValue="faculty">
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="faculty">
                  Faculty (Standard Access)
                </SelectItem>
                <SelectItem value="admin">Admin (Full Access)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* --- ROW 6: Temp Password --- */}
          <div className="grid gap-2">
            <Label htmlFor="temp_password">Temporary Password</Label>
            <Input
              id="temp_password"
              name="temp_password"
              defaultValue="Faculty123!"
              type="text"
            />
            <p className="text-[0.8rem] text-muted-foreground">
              The user must change this upon first login.
            </p>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-[#0A58A3] hover:bg-[#094b8a]"
            >
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Account
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
