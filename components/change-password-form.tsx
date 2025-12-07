"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useActionState, useEffect } from "react";
import { updateInitialPassword } from "@/lib/actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    updateInitialPassword,
    null
  );

  useEffect(() => {
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Setup Your Account</CardTitle>
          <CardDescription>
            Please create a new, secure password to activate your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={formAction}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="password">New password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter new password"
                  required
                  minLength={6}
                />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="confirm_password">Confirm password</Label>
                <Input
                  id="confirm_password"
                  name="confirm_password"
                  type="password"
                  placeholder="Confirm new password"
                  required
                  minLength={6}
                />
              </div>

              {state?.error && (
                <p className="text-sm text-destructive font-medium">
                  {state.error}
                </p>
              )}

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isPending ? "Updating..." : "Update Password & Login"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
