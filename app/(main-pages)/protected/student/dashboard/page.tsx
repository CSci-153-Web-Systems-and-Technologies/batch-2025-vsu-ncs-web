import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ConductCard from "@/app/(detail-pages)/records/_components/conduct-card";
import TotalsCard from "@/app/(detail-pages)/records/_components/totals-card";
import { ConductReportWithReporter, StudentProfile } from "@/types";
import { parseName } from "@/lib/utils";
import { transformReportForStudent, safeMap } from "@/lib/data";

export default async function StudentDashBoard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Profile
  const { data: profileData } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const profile = profileData as StudentProfile;

  // 2. Fetch Reports (Raw Data)
  const { data: rawReports } = await supabase
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

  // 3. Transform Data using our new Utility
  const records: ConductReportWithReporter[] = safeMap(
    rawReports,
    transformReportForStudent
  );

  // 4. Calculate Totals (Logic adapted to use strict types)
  function calculateDashboardTotals(reports: ConductReportWithReporter[]) {
    let totalMerits = 0;
    let totalDemerits = 0;
    let office_demerits = 0;
    let office_merits = 0;
    let rle_demerits = 0;
    let rle_merits = 0;

    for (const r of reports) {
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

  const totals = calculateDashboardTotals(records);
  const recentActivity = records.slice(0, 5);

  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">
          {`Welcome, ${parseName(profile) || "Student"}!`}
        </h1>
        <p className="text-[#6C757D]">
          Here&apos;s an overview of your conduct record this semester.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row w-full gap-5">
        <TotalsCard
          title="Net Office Sanction"
          total={totals.netOffice}
          color="text-[#FF6900]"
          description={`Equivalent to ${totals.netOffice * 8} hours of service`}
        />
        <TotalsCard
          title="Net RLE/Duty Sanction"
          total={totals.netRle}
          color="text-[#0A58A3]"
          description={`Equivalent to ${totals.netRle * 8} hours of service`}
        />
        <TotalsCard
          title="Total Merits"
          total={totals.totalMerits}
          color="text-[#00C950]"
          description="This semester"
        />
        <TotalsCard
          title="Total Demerits"
          total={totals.totalDemerits}
          color="text-red-600"
          description="This semester"
        />
      </div>

      <div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest merits and demerits</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {recentActivity.map((conduct) => (
              <ConductCard
                key={conduct.id}
                record={conduct} // Now perfectly matches the type
              />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
