import { createClient } from "@/lib/supabase/server";
import { transformServiceLog, safeMap } from "@/lib/data"; // Or your utils path
import { ServiceLogWithReporter } from "@/types";
import ServiceLogList from "./_components/service-log-list";
import { AlertTriangle } from "lucide-react";

export default async function ServiceHistory() {
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
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false });

  // 2. TRANSFORM
  const seriousReports: SeriousInfractionTicket[] = safeMap(
    rawData,
    transformSeriousTicket
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
          These are major violations that require administrative review.
        </p>
      </div>

      {/* The List Component */}
      <SeriousInfractionList data={seriousReports} />
    </div>
  );
}
