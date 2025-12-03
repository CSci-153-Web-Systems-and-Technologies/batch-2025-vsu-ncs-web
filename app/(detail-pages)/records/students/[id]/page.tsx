import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "../../_components/conduct-records-column";
import { ConductRecordsTable } from "../../_components/conduct-records-table"; // Updated import name if changed previously
import ConductCardList from "../../_components/conduct-card-list";
import TotalsCard from "../../_components/totals-card";
import InfoCard from "../../_components/info-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConductReportWithReporter, StudentProfile } from "@/types";
import { parseName } from "@/lib/utils";
import { transformReportForStudent, safeMap } from "@/lib/transformers"; // <--- NEW UTILS

export default async function StudentRecordPage({
  params,
}: {
  params: Promise<{ id: string }>; // Updated for Next.js 15+ async params
}) {
  const { id } = await params;

  if (!id || id === "undefined") {
    notFound();
  }

  const supabase = await createClient();

  // 1. FETCH PROFILE
  const { data: profileData } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profileData) {
    notFound();
  }
  const student = profileData as StudentProfile;

  // 2. FETCH RAW RECORDS + TRANSFORM
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
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  // Transform using the same utility as the Student Dashboard
  const conductRecords: ConductReportWithReporter[] = safeMap(
    rawData,
    transformReportForStudent
  );

  // 3. CALCULATE TOTALS (Updated for new Logic: RLE vs Office)
  function calculateTotals(records: ConductReportWithReporter[]) {
    let totalMerits = 0;
    let totalDemerits = 0;
    let office_demerits = 0;
    let office_merits = 0;
    let rle_demerits = 0;
    let rle_merits = 0;

    for (const r of records) {
      const days = r.sanction_days ?? 0;

      if (r.type === "demerit") {
        totalDemerits += days;
        if (r.sanction_context === "office") office_demerits += days;
        else if (r.sanction_context === "rle") rle_demerits += days;
      } else if (r.type === "merit") {
        totalMerits += days;
        if (r.sanction_context === "office") office_merits += days;
        else if (r.sanction_context === "rle") rle_merits += days;
      }
    }

    // Logic: Net = Demerits - Merits (clamped to 0)
    return {
      totalMerits,
      totalDemerits,
      netOffice: Math.max(0, office_demerits - office_merits),
      netRle: Math.max(0, rle_demerits - rle_merits),
    };
  }

  const totals = calculateTotals(conductRecords);

  // Parse full name using your utility, passing the object directly if supported
  // or passing fields individually as requested.
  const full_name = parseName(student);

  return (
    <div className="flex flex-col p-10 gap-5">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Student Information</CardTitle>
            <CardDescription>
              Personal details and academic details
            </CardDescription>
            <CardContent className="flex flex-col md:flex-row px-0 pt-4 justify-between ">
              <InfoCard
                title={"Full Name"}
                description={full_name || "Unknown"}
              />
              <InfoCard
                title={"Student ID"}
                description={student.student_id || "-"}
              />
              <InfoCard
                title={"Year Level"}
                description={student.year_level?.toString() || "-"}
              />
              <InfoCard title={"Sex"} description={student.sex || "-"} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* UPDATED CARDS to match the new separation of concerns */}
      <div className="flex flex-col sm:flex-row w-full gap-5">
        <TotalsCard
          title="Net Office Sanction"
          total={totals.netOffice}
          color="text-[#FF6900]"
          description={`Equivalent to ${totals.netOffice * 8} hours of service`}
        />
        <TotalsCard
          title="Net RLE Sanction"
          total={totals.netRle}
          color="text-blue-600" // You might want to match the dashboard color
          description={`Equivalent to ${totals.netRle * 8} hours of service`}
        />
        <TotalsCard
          title="Total Demerits"
          total={totals.totalDemerits}
          color="text-[#0A58A3]"
          description="This semester"
        />
        <TotalsCard
          title="Total Merits"
          total={totals.totalMerits}
          color="text-[#00C950]"
          description="This semester"
        />
      </div>

      <div className="hidden md:block">
        {/* Ensure you are importing ConductRecordsTable correctly from your refactor */}
        <ConductRecordsTable columns={columns} data={conductRecords} />
      </div>
      <div className="md:hidden">
        <ConductCardList data={conductRecords} />
      </div>
    </div>
  );
}
