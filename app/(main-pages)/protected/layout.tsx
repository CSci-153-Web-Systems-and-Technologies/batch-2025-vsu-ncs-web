import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/app-sidebar";
import { LayoutDashboard, History, BriefcaseMedical } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { SidebarProps } from "@/types";
import { parseName } from "@/lib/utils";
import { Suspense } from "react";
//export const dynamic = "force-dynamic";
export default async function StudentLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role as string;
  let userProfile = null;
  let items: SidebarProps[] = [];

  if (userRole === "student") {
    const { data: profile } = await supabase
      .from("student_profiles")
      .select("first_name, middle_name, last_name, suffix")
      .eq("id", user?.id)
      .single();
    userProfile = profile;
    items = [
      {
        title: "Dashboard",
        url: "/protected/student/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Conduct Records",
        url: "/protected/student/conduct-records",
        icon: History,
      },
    ];
  }

  if (userRole === "faculty") {
    const { data: profile } = await supabase
      .from("staff_profiles")
      .select("first_name, middle_name, last_name, suffix, title")
      .eq("id", user?.id)
      .single();
    userProfile = profile;

    items = [
      {
        title: "Dashboard",
        url: "/protected/faculty/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Student Records",
        url: "/protected/faculty/student-list",
        icon: History,
      },
      {
        title: "Reports",
        url: "/protected/faculty/reports",
        icon: History,
      },
    ];
  }

  if (userRole === "admin") {
    const { data: profile } = await supabase
      .from("staff_profiles")
      .select("first_name, middle_name, last_name, suffix, title")
      .eq("id", user?.id)
      .single();
    userProfile = profile;

    items = [
      {
        title: "Dashboard",
        url: "/protected/admin/dashboard",
        icon: LayoutDashboard,
      },
      {
        title: "Student Management",
        url: "/protected/admin/student-management",
        icon: History,
      },
      {
        title: "Faculty Management",
        url: "/protected/admin/faculty-management",
        icon: History,
      },
      {
        title: "Serious Infractions",
        url: "/protected/admin/serious-infractions",
        icon: History,
      },
    ];
  }

  function capitalizeFirstLetter(str: string) {
    if (typeof str !== "string" || str.length === 0) {
      return str;
    }
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <Suspense>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          {/* Mobile Header */}
          <div className="fixed top-0 left-0 right-0 z-50 flex h-16 items-center justify-between border-b bg-white px-4 md:hidden">
            <SidebarTrigger />
            <div className="flex items-center gap-2">
              <BriefcaseMedical className="h-6 w-6" />
              <span className="font-semibold">VSU NCS</span>
            </div>
            <div className="w-10" />
          </div>
          <AppSidebar
            items={items}
            profile={parseName(userProfile) ?? "Student"}
            role={capitalizeFirstLetter(userRole)}
          />
          <main className="flex-1 overflow-y-auto bg-[#F8F9FA] pt-16 md:ml-64 md:pt-0">
            {children}
          </main>
        </div>
      </SidebarProvider>
    </Suspense>
  );
}
