import Link from "next/link";
import { ArrowLeft, BriefcaseMedical } from "lucide-react";
import { createClient } from "@/lib/supabase/server";

export default async function RecordsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role as string;
  console.log(userRole);
  let returnURL = "/unauthorized";
  if (userRole === "admin") {
    returnURL = "/protected/admin/student-management";
  } else {
    returnURL = "/unauthorized";
  }
  return (
    <div className="min-h-screen bg-[#F8F9FA]">
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center h-16">
            <div className="w-16 flex items-center">
              <Link
                href={returnURL}
                className="inline-flex items-center justify-center h-10 w-10 rounded-md border border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                aria-label="Go back"
              >
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </div>

            <div className="flex-1 flex items-center justify-center">
              <div className="flex items-center gap-2">
                <div>
                  <BriefcaseMedical className="h-10 w-10 text-[#0A58A3]" />
                </div>
                <h1 className="text-lg font-semibold">VSU NCS</h1>
              </div>
            </div>

            <div className="w-16" />
          </div>
        </div>
      </header>

      {/* Page content separated from header */}
      <main className=" md:p-8">
        <div className="bg-transparent rounded-lg">{children}</div>
      </main>
    </div>
  );
}
