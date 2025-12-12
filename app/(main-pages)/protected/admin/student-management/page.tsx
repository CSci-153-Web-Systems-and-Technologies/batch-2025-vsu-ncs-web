import { createClient } from "@/lib/supabase/server";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import StudentCardList from "./_components/student-card-list";
import { transformStudentSummary, safeMap } from "@/lib/data";
import { StudentConductSummary } from "@/types";

export default async function StudentListPage() {
  const supabase = await createClient();

  const { data: rawData } = await supabase
    .from("student_profiles")
    .select("*, conduct_reports(*), service_logs(*)")
    .order("last_name", { ascending: true });

  const data: StudentConductSummary[] = safeMap(
    rawData,
    transformStudentSummary
  );

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">Student Records</h1>
        <p className="text-[#6C757D]">
          Overview of all students and their current standing.
        </p>
      </div>
      <div className="hidden md:block container mx-auto p-4 bg-white rounded-2xl">
        <DataTable columns={columns} data={data} />
      </div>
      <div className="md:hidden">
        <StudentCardList data={data} />
      </div>
    </div>
  );
}
