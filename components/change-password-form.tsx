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
import { useActionState } from "react";
import { updateInitialPassword } from "@/lib/actions";
import { Loader2, AlertCircle } from "lucide-react";

export function ChangePasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [state, formAction, isPending] = useActionState(
    updateInitialPassword,
    null
  );

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="border-none shadow-none sm:border sm:shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold tracking-tight">
            Setup Your Account
          </CardTitle>
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
                  className="h-11"
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
                  className="h-11"
                />
              </div>

              {state?.error && (
                <div className="flex items-center gap-2 rounded-md bg-destructive/15 p-3 text-sm text-destructive animate-in fade-in slide-in-from-top-1">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <p>{state.error}</p>
                </div>
              )}

              <Button
                type="submit"
                className="w-full h-11 bg-[#0A58A3] hover:bg-[#094b8a] transition-all"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password & Login"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}