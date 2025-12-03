import { createClient } from "@/lib/supabase/server";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table"; // Assumes you have this generic component
import FacultyCardList from "./_components/faculty-card-list";
import { transformStudentSummary, safeMap } from "@/lib/data"; // <--- NEW UTILS
import { StudentConductSummary } from "@/types";

export default async function FacultyListPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Raw Data + Reports
  const { data: rawData } = await supabase
    .from("staff_profiles")
    .select("*")
    .order("last_name", { ascending: true })
    .neq("id", user?.id);

  // 2. Transform into Summary Shape
  const data: StudentConductSummary[] = safeMap(
    rawData,
    transformStudentSummary
  );

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">Faculty Records</h1>
        <p className="text-[#6C757D]">
          Overview of all faculty and their information.
        </p>
      </div>
      <div className="hidden md:block container mx-auto p-4 bg-white rounded-2xl">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="md:hidden">
        <FacultyCardList data={data} />
      </div>
    </div>
  );
}
