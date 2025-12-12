"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldAlert, ArrowLeft, LockKeyhole } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gray-50 dark:bg-zinc-900 p-4">
      <Card className="max-w-md w-full shadow-xl border-none ring-1 ring-gray-200 dark:ring-gray-800">
        <CardHeader className="flex flex-col items-center text-center pb-2">
          <div className="h-16 w-16 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-500 rounded-full flex items-center justify-center mb-4 animate-in zoom-in-50 duration-300">
            <ShieldAlert className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-foreground">
            Access Denied
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Error 403: Unauthorized Action
          </p>
        </CardHeader>

        <CardContent className="text-center space-y-6 pt-2">
          <p className="text-muted-foreground">
            You do not have the necessary permissions to view this page. If you
            believe this is an error, please contact your system administrator.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mt-6">
            <Button
              variant="outline"
              className="w-full gap-2 sm:w-auto"
              onClick={logout}
            >
              <LockKeyhole className="h-4 w-4" />
              Login as different user
            </Button>

            <Link href="/" className="w-full sm:w-auto">
              <Button className="w-full gap-2 bg-[#0A58A3] hover:bg-[#094b8a]">
                <ArrowLeft className="h-4 w-4" />
                Return Home
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-200/20 dark:bg-red-900/10 blur-[100px] -z-10 rounded-full pointer-events-none" />
    </div>
  );
}
