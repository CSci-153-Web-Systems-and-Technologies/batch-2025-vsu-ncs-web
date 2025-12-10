"use client";

import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { Suspense } from "react";

export function LogoutButton() {
  const router = useRouter();

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/auth/login");
  };

  return (
    <Suspense>
      <Button
        className="w-full justify-center gap-3 hover:bg-red-50 hover:text-red-600 transition-colors duration-200"
        variant="ghost"
        onClick={logout}
      >
        <LogOut />
        Logout
      </Button>
    </Suspense>
  );
}
