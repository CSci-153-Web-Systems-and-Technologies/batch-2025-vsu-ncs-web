import { createClient } from "@/lib/supabase/server";
import { transformSeriousTicket, safeMap } from "@/lib/data"; // Or wherever your utils are
import { SeriousInfractionTicket } from "@/types";
import SeriousInfractionList from "./_components/serious-infraction-list";
import { AlertTriangle } from "lucide-react";

export default async function AdminSeriousInfractionsPage() {
  const supabase = await createClient();

  // 1. FETCH RAW DATA
  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*),
      reporter:staff_profiles!faculty_id (first_name, last_name, title),
      infraction_responses (
        created_at, 
        admin:staff_profiles (first_name, last_name)
      )
    `
    )
    .eq("is_serious_infraction", true)
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
          <h1 className="text-2xl font-bold">Serious Infractions Queue</h1>
        </div>
        <p className="text-muted-foreground">
          Review and resolve pending serious infractions reported by faculty.
        </p>
      </div>

      {/* The List Component */}
      <SeriousInfractionList data={seriousReports} />
    </div>
  );
}