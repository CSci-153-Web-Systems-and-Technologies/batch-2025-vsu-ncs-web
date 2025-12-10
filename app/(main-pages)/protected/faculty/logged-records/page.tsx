import ReportCardList from "@/app/(detail-pages)/records/_components/report-card-list";
import { createClient } from "@/lib/supabase/server";
import { transformReportForFaculty, safeMap } from "@/lib/data"; // <--- NEW UTILS
import { ConductReportWithStudent } from "@/types";

export default async function ReportsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*),
      infraction_responses (
        created_at,
        admin:staff_profiles(first_name, last_name)
      )
    `
    )
    .eq("faculty_id", user?.id)
    .order("created_at", { ascending: false });

  const records: ConductReportWithStudent[] = safeMap(
    rawData,
    transformReportForFaculty
  );

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">My Conduct Reports</h1>
        <p className="text-[#6C757D]">
          Complete record of all merits, demerits, and serious infractions
          reports.
        </p>
      </div>
      <div>
        <ReportCardList data={records} />
      </div>
    </div>
  );
}
