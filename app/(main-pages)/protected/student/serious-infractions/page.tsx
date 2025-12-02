import { createClient } from "@/lib/supabase/server";
import { transformReportForStudent, safeMap } from "@/lib/data";
import { ConductReportWithReporter } from "@/types";
import SeriousInfractionList from "./_components/serious-infraction-list"; // Adjust path as needed
import { AlertTriangle } from "lucide-react";

export default async function SeriousInfractionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. FETCH RAW DATA
  // We fetch everything first, then filter, or you can filter in the query
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
    .eq("is_serious_infraction", true) // SERVER-SIDE FILTER: Only Serious Infractions
    .order("created_at", { ascending: false });

  // 2. TRANSFORM
  const seriousReports: ConductReportWithReporter[] = safeMap(
    rawData,
    transformReportForStudent
  );

  return (
    <div className="flex flex-col w-full p-8 gap-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Serious Infractions</h1>
        </div>
        <p className="text-muted-foreground">
          These are major violations that require administrative review. Please
          monitor the status of pending cases closely.
        </p>
      </div>

      {/* The List Component */}
      <SeriousInfractionList data={seriousReports} />
    </div>
  );
}
