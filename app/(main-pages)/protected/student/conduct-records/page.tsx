import { createClient } from "@/lib/supabase/server";
import { columns } from "@/app/(detail-pages)/records/_components/conduct-records-column";
import ConductCardList from "@/app/(detail-pages)/records/_components/conduct-card-list";
import { ConductRecordsTable } from "@/app/(detail-pages)/records/_components/conduct-records-table";
import { transformReportForStudent, safeMap } from "@/lib/data"; // <--- Import Transformer
import { ConductReportWithReporter } from "@/types";

export default async function ConductRecords() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. FETCH RAW DATA (with joins)
  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      reporter:staff_profiles!faculty_id (first_name, last_name, title),
      infraction_responses (
        created_at, 
        final_sanction_days, 
        final_sanction_other,
        notes,
        admin:staff_profiles (first_name, last_name)
      )
    `
    )
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false });

  // 2. TRANSFORM DATA (using util)
  const data: ConductReportWithReporter[] = safeMap(
    rawData,
    transformReportForStudent
  );

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">My Conduct Records</h1>
        <p className="text-[#6C757D]">
          Complete record of all merits, demerits, and serious infractions.
        </p>
      </div>
      <div className="hidden md:block container mx-auto p-4">
        {/* Pass new 'data' and 'columns' */}
        <ConductRecordsTable columns={columns} data={data} />
      </div>
      <div className="md:hidden">
        {/* Pass new 'data' */}
        <ConductCardList data={data} />
      </div>
    </div>
  );
}
