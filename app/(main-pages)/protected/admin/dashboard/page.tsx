import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TotalsCard from "./_components/totals-card";
import { StaffProfile, SeriousInfractionTicket } from "@/types";
import { safeMap, transformSeriousTicket } from "@/lib/data";
import PendingInfractionList from "./_components/pending-infraction-list";
import { AdminCharts } from "./_components/admin-charts";
import { getDashboardChartData } from "@/lib/actions";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Fetch Profile
  const { data: profileData } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const profile = profileData as StaffProfile;

  const { data: rawReports } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(first_name, last_name, student_id, year_level, sex),
      reporter:staff_profiles(first_name, last_name, title),
      infraction_responses(id) 
    `
    )
    .eq("is_serious_infraction", true)
    .order("created_at", { ascending: false });

  const pendingRawReports =
    rawReports?.filter(
      (report) =>
        !report.infraction_responses || report.infraction_responses.length === 0
    ) || [];

  const pendingReports: SeriousInfractionTicket[] = safeMap(
    pendingRawReports,
    transformSeriousTicket
  );
  const chartData = await getDashboardChartData();
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);
  const { count: recordsCount } = await supabase
    .from("conduct_reports")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString());
  const { count: studentCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true });
  const { count: staffCount } = await supabase
    .from("staff_profiles")
    .select("*", { count: "exact", head: true });
  return (
    <div className="flex flex-col w-full p-8 gap-5">
      <div className="flex flex-col gap-2">
        <h1 className="text-[#0A58A3] text-2xl">{`Welcome, ${
          profile?.first_name ?? "Faculty"
        }!`}</h1>
        <p className="text-[#6C757D]">
          Quick access to conduct management tools
        </p>
      </div>
      <div className="flex flex-col sm:flex-row w-full gap-5">
        <TotalsCard
          title="Total Reports Logged"
          total={recordsCount ?? 0}
          color="text-[#FF6900]"
          description="Last 30 days"
        />
        <TotalsCard
          title="Total Students"
          total={studentCount || 0}
          color="text-[#00C950]"
          description="Active nursing students"
        />
        <TotalsCard
          title="Total Staff"
          total={staffCount || 0}
          color="text-[#00C950]"
          description="Active staff"
        />
        <TotalsCard
          title="Pending Infractions"
          total={pendingReports.length || 0}
          color="text-red-600"
          description="In need of review"
        />
      </div>
      <div className="space-y-6 p-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Dashboard Overview
        </h1>
        <AdminCharts data={chartData} />
      </div>
      <div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Pending Infraction Reports</CardTitle>
            <CardDescription>Review pending infraction reports</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <PendingInfractionList data={pendingReports} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
