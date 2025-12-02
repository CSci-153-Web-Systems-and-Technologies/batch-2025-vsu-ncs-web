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
import { transformReportForFaculty, safeMap } from "@/lib/transformers"; // <--- NEW UTILS

export default async function FacultyDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    .select(`
      *,
      student:student_profiles(*),
      infraction_responses (
        created_at,
        admin:staff_profiles(first_name, last_name)
      )
    `)
    .eq("faculty_id", user?.id)
    .order("created_at", { ascending: false });

    // 3. Transform Reports
  const records: ConductReportWithStudent[] = safeMap(rawReports, transformReportForFaculty);

  // 4. Fetch Total Students Count
  // (We use count option instead of fetching all rows for performance)
  const { count: studentCount } = await supabase
    .from("student_profiles")
    .select("*", { count: "exact", head: true });

  const recentRecordArr = records.slice(0, 5);