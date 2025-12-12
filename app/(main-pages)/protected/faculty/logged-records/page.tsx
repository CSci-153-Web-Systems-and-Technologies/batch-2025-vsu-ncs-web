import ReportCardList from "./_components/report-card-list";
import { createClient } from "@/lib/supabase/server";
import { transformReportForFaculty } from "@/lib/data";
import { ActivityLog } from "@/types";

export default async function ReportsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Conduct Reports
  const { data: conductRaw } = await supabase
    .from("conduct_reports")
    .select(`*, student:student_profiles(*)`)
    .eq("faculty_id", user?.id);

  // 2. Fetch Service Logs
  const { data: serviceRaw } = await supabase
    .from("service_logs")
    .select(`*, student:student_profiles(*)`)
    .eq("faculty_id", user?.id);

  // 3. Normalize & Merge
  const conductLogs: ActivityLog[] = (conductRaw || []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    type: r.is_serious_infraction ? "serious" : r.type, // 'merit' | 'demerit'
    description: r.description,
    student: r.student,
    is_serious_infraction: r.is_serious_infraction,
    sanction_days: r.sanction_days,
  }));

  const serviceLogs: ActivityLog[] = (serviceRaw || []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    type: "service",
    description: r.description || "Extension duty served", // Fallback
    student: r.student,
    days_deducted: r.days_deducted,
  }));

  // Combine and Sort by Date (Newest First)
  const combinedLogs = [...conductLogs, ...serviceLogs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">Activity History</h1>
        <p className="text-[#6C757D]">
          Complete record of all reports filed and services logged.
        </p>
      </div>
      <div>
        {/* We need to update ReportCardList to accept ActivityLog[] */}
        <ReportCardList data={combinedLogs} />
      </div>
    </div>
  );
}
