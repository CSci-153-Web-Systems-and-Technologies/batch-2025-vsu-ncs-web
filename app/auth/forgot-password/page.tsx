"use client";

import { useActionState, useState } from "react";
import { forgotPasswordAction } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import logo from "@/app/assets/logo.png";

export default function ForgotPasswordPage() {
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null
  );
  const [email, setEmail] = useState("");

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
          <h2 className="text-4xl font-bold">Account Recovery</h2>
          <p className="text-blue-100 text-lg">
            Don&apos;t worry, it happens. Enter your email and we&apos;ll help
            you get back in.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10 justify-center items-center">
        <Card className="w-full max-w-md border-none shadow-none sm:border sm:shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">
              Forgot Password?
            </CardTitle>
            <CardDescription>
              Enter your VSU email address to receive a reset link.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {state?.success ? (
              <div className="flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in-95">
                <div className="h-12 w-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">Check your email</h3>
                  <p className="text-muted-foreground text-sm">
                    We sent a reset link to{" "}
                    <span className="font-medium text-foreground">{email}</span>
                  </p>
                </div>
                <Link href="/auth/login" className="w-full mt-4">
                  <Button variant="outline" className="w-full">
                    Back to Login
                  </Button>
                </Link>
              </div>
            ) : (
              <form action={formAction}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="pl-9 h-11"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
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
                      "Send Reset Link"
                    )}
                  </Button>

                  <Link
                    href="/auth/login"
                    className="mx-auto flex items-center text-sm text-muted-foreground hover:text-foreground"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Login
                  </Link>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
