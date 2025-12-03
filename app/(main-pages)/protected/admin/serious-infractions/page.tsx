import { createClient } from "@/lib/supabase/server";
import { transformReportForFaculty, safeMap } from "@/lib/data"; // <--- UPDATED TRANSFORMER
import { ConductReportWithStudent } from "@/types"; // <--- UPDATED TYPE
import SeriousInfractionList from "./_components/serious-infraction-list";
import { AlertTriangle } from "lucide-react";

export default async function FacultySeriousInfractionsPage() {
  const supabase = await createClient();

  // 1. FETCH RAW DATA
  // - Filter by 'faculty_id' (me)
  // - Join 'student:student_profiles' (who I reported)
  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*), 
      infraction_responses (
        created_at, 
        admin:staff_profiles (first_name, last_name)
      )
    `
    )
    .eq("is_serious_infraction", true) // Filter: Serious only
    .order("created_at", { ascending: false });

  // 2. TRANSFORM
  // Use the faculty-specific transformer
  const seriousReports: ConductReportWithStudent[] = safeMap(
    rawData,
    transformReportForFaculty
  );

  return (
    <div className="flex flex-col w-full p-8 gap-8 max-w-5xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Filed Serious Infractions</h1>
        </div>
        <p className="text-muted-foreground">
          Track the status of serious infraction reports you have filed.
        </p>
      </div>

      {/* The List Component */}
      <SeriousInfractionList data={seriousReports} />
    </div>
  );
}
