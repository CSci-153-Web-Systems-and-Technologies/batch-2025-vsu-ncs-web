"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, Lock } from "lucide-react";
import Image from "next/image";
import logo from "@/app/assets/logo.png";

export default function ResetPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    null
  );

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col p-10 text-white dark:border-r bg-[#0A58A3]">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/20" />
        <div className="relative z-20 flex items-center text-lg font-medium gap-2">
          <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/20">
            <Image src={logo} alt="VSU Logo" width={24} height={24} />
          </div>
          <span className="font-semibold">VSU Nursing Conduct System</span>
        </div>
        <div className="relative z-20 flex-1 flex flex-col justify-center gap-6">
          <h2 className="text-4xl font-bold">Secure Your Account</h2>
          <p className="text-blue-100 text-lg">
            Please create a new strong password.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center items-center">
        <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Type your new password below.</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={formAction}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      required
                      minLength={6}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="confirm_password">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm_password"
                      name="confirm_password"
                      type="password"
                      required
                      minLength={6}
                      className="pl-9 h-11"
                    />
                  </div>
                </div>

                {state?.error && (
                  <p className="text-sm text-red-500 bg-red-50 p-3 rounded-md">
                    {state.error}
                  </p>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#0A58A3]"
                  disabled={isPending}
                >
                  {isPending ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Update Password"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
