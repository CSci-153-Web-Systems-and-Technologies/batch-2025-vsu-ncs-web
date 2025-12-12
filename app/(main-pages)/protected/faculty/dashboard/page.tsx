import { createClient } from "@/lib/supabase/server";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import TotalsCard from "./_components/totals-card";
import QuickActionCard from "./_components/quick-action-card";
import RecordCard from "./_components/record-card";
import { StaffProfile, ActivityLog } from "@/types";
import LogServiceCard from "./_components/log-service-card";

export default async function FacultyDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profileData } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  const profile = profileData as StaffProfile;

  const { data: conductRaw } = await supabase
    .from("conduct_reports")
    .select(`*, student:student_profiles(*)`)
    .eq("faculty_id", user?.id);

  const { data: serviceRaw } = await supabase
    .from("service_logs")
    .select(`*, student:student_profiles(*)`)
    .eq("faculty_id", user?.id);

  const conductLogs: ActivityLog[] = (conductRaw || []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    type: r.is_serious_infraction ? "serious" : r.type,
    description: r.description,
    student: r.student,
    is_serious_infraction: r.is_serious_infraction,
    sanction_days: r.sanction_days,
  }));

  const serviceLogs: ActivityLog[] = (serviceRaw || []).map((r) => ({
    id: r.id,
    created_at: r.created_at,
    type: "service",
    description: r.description || "Extension duty served",
    student: r.student,
    days_deducted: r.days_deducted,
  }));

  const combinedLogs = [...conductLogs, ...serviceLogs].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  const { count: studentCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true });

  const recentRecordArr = combinedLogs.slice(0, 5);

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
        <QuickActionCard />
        <LogServiceCard />
        <TotalsCard
          title="Total Reports Logged"
          total={combinedLogs.length}
          color="text-[#FF6900]"
          description="This semester"
        />
        <TotalsCard
          title="Total Students"
          total={studentCount || 0}
          color="text-[#00C950]"
          description="Active nursing students"
        />
      </div>
      <div>
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your recently logged incidents</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {recentRecordArr.map((item) => (
              <RecordCard
                key={item.id}
                record={item} // <--- Much cleaner prop passing
              />
            ))}
            {recentRecordArr.length === 0 && (
              <p className="text-sm text-gray-500">No recent activity.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}