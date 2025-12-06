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
import { StaffProfile, ConductReportWithStudent } from "@/types";
import { transformReportForFaculty, safeMap } from "@/lib/data";

export default async function FacultyDashboard() {
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

  // 2. Fetch Faculty Reports (History)
  const { data: rawReports } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*),
      infraction_responses (
        created_at,
        admin:staff_profiles(first_name, last_name)
      )
    `
    )
    .eq("faculty_id", user?.id)
    .order("created_at", { ascending: false });

  // 3. Transform Reports
  const records: ConductReportWithStudent[] = safeMap(
    rawReports,
    transformReportForFaculty
  );

  // 4. Fetch Total Students Count
  // (We use count option instead of fetching all rows for performance)
  const { count: studentCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true });

  const recentRecordArr = records.slice(0, 5);

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
        <TotalsCard
          title="Total Reports Logged"
          total={records.length}
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