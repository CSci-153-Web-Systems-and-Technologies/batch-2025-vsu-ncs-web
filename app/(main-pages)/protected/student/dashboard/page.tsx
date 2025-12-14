import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import ConductCard from "@/app/(detail-pages)/records/_components/conduct-card";
import ServiceLogCard from "../service-history/_components/service-log-card";
import TotalsCard from "@/app/(detail-pages)/records/_components/totals-card";
import {
  ConductReportWithReporter,
  StudentProfile,
  ServiceLogWithReporter,
} from "@/types";
import { parseName } from "@/lib/utils";
import {
  transformReportForStudent,
  transformServiceLogForStudent,
  safeMap,
} from "@/lib/data";

export default async function StudentDashBoard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileData } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", user?.id)
    .single();

  const profile = profileData as StudentProfile;

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

  const { data: rawServices } = await supabase
    .from("service_logs")
    .select(
      `
        *,
        reporter:staff_profiles!faculty_id (first_name, last_name, title)
      `
    )
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false });

  const conductRecords: ConductReportWithReporter[] = safeMap(
    rawReports,
    transformReportForStudent
  );

  const serviceRecords: ServiceLogWithReporter[] = safeMap(
    rawServices,
    transformServiceLogForStudent
  );

  function calculateDashboardTotals(
    cReports: ConductReportWithReporter[],
    sLogs: ServiceLogWithReporter[]
  ) {
    let totalMerits = 0;
    let totalDemerits = 0;

    for (const r of cReports) {
      const days = r.sanction_days ?? 0;
      if (r.type === "demerit") {
        totalDemerits += days;
      } else if (r.type === "merit") {
        totalMerits += days;
      }
    }

    const totalServed = sLogs.reduce((acc, log) => acc + log.days_deducted, 0);

    return {
      totalMerits,
      totalDemerits,
      totalServed,
      remainingBalance: Math.max(0, totalDemerits - totalServed - totalMerits),
    };
  }

  const totals = calculateDashboardTotals(conductRecords, serviceRecords);

  const combinedActivity = [
    ...conductRecords.map((r) => ({ ...r, listType: "conduct" as const })),
    ...serviceRecords.map((s) => ({ ...s, listType: "service" as const })),
  ]
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    )
    .slice(0, 5);

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <TotalsCard
          title="Current Demerit Balance"
          total={totals.remainingBalance}
          color={
            totals.remainingBalance > 0 ? "text-red-600" : "text-emerald-600"
          }
          description="Days remaining to serve"
        />
        <TotalsCard
          title="Total Served"
          total={totals.totalServed}
          color="text-blue-600"
          description="Total extension days cleared"
        />
        <TotalsCard
          title="Total Demerits"
          total={totals.totalDemerits}
          color="text-[#0A58A3]"
          description="Lifetime accrued violations"
        />
        <TotalsCard
          title="Total Merits"
          total={totals.totalMerits}
          color="text-[#00C950]"
          description="Bonus points earned"
        />
      </div>

      <div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest reports and service logs
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {combinedActivity.map((item) => {
              if (item.listType === "service") {
                return (
                  <ServiceLogCard
                    key={`service-${item.id}`}
                    record={item as ServiceLogWithReporter}
                  />
                );
              }
              return (
                <ConductCard
                  key={`conduct-${item.id}`}
                  record={item as ConductReportWithReporter}
                />
              );
            })}

            {combinedActivity.length === 0 && (
              <p className="text-center text-muted-foreground py-8">
                No recent activity found.
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}