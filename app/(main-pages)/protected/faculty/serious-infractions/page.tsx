import { createClient } from "@/lib/supabase/server";
import { transformSeriousTicket, safeMap } from "@/lib/data";
import { SeriousInfractionTicket } from "@/types";
import SeriousInfractionList from "./_components/serious-infraction-list";
import { AlertTriangle } from "lucide-react";

export default async function FacultySeriousInfractionsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*), 
      
      infraction_responses (
        id,
        created_at, 
        final_sanction_days, 
        final_sanction_other,
        notes,
        admin:staff_profiles (first_name, last_name)
      )
    `
    )
    .eq("faculty_id", user?.id) // Filter: My reports
    .eq("is_serious_infraction", true) // Filter: Serious only
    .order("created_at", { ascending: false });

  const seriousReports: ConductReportWithStudent[] = safeMap(
    rawData,
    transformReportForFaculty
  );*/

  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
        *,
        student:student_profiles(*), 
        reporter:staff_profiles!faculty_id (first_name, last_name, title),
        
        infraction_responses (
          id,
          created_at, 
          final_sanction_days,
          final_sanction_other,
          notes,
          admin:staff_profiles (first_name, last_name)
        )
      `
    )
    .eq("is_serious_infraction", true)
    .eq("faculty_id", user?.id)
    .order("created_at", { ascending: false });

  // 2. TRANSFORM
  const seriousReports: SeriousInfractionTicket[] = safeMap(
    rawData,
    transformSeriousTicket
  );

  return (
    <div className="flex flex-col w-full p-8 gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Filed Serious Infractions</h1>
        </div>
        <p className="text-muted-foreground">
          Track the status and resolution of serious infractions you have
          reported.
        </p>
      </div>

      <SeriousInfractionList data={seriousReports} />
    </div>
  );
}