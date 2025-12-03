import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ReportCardList from "../../_components/report-card-list";
import InfoCard from "../../_components/info-card";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ConductReportWithStudent, StaffProfile } from "@/types";
import { parseName } from "@/lib/utils";
import { transformReportForFaculty, safeMap } from "@/lib/data";

export default async function FacultyRecordPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  if (!id || id === "undefined") {
    notFound();
  }

  const supabase = await createClient();

  // 1. FETCH FACULTY PROFILE
  const { data: profileData } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profileData) {
    notFound();
  }
  const faculty = profileData as StaffProfile;

  // 2. FETCH REPORTS
  const { data: rawData } = await supabase
    .from("conduct_reports")
    .select(
      `
      *,
      student:student_profiles(*),
      infraction_responses (
        created_at, 
        admin:staff_profiles (first_name, last_name)
      )
    `
    )
    .eq("faculty_id", id)
    .order("created_at", { ascending: false });

  // 3. TRANSFORM
  const records: ConductReportWithStudent[] = safeMap(
    rawData,
    transformReportForFaculty
  );

  // 4. PARSE NAME & TITLE
  // We get the base name from the utility
  const baseName = parseName(faculty);
  // We prepend the title if it exists (e.g. "Dr. " + "Juan Cruz")
  const fullNameWithTitle = faculty.title
    ? `${faculty.title} ${baseName}`.trim()
    : baseName;

  return (
    <div className="flex flex-col p-10 gap-5">
      {/* SECTION 1: FACULTY INFORMATION */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Faculty Information</CardTitle>
            <CardDescription>
              Personal details and employment information
            </CardDescription>
            <CardContent className="flex flex-col md:flex-row px-0 pt-4 justify-between ">
              {/* UPDATED: Displays "Dr. First Last" */}
              <InfoCard
                title={"Full Name"}
                description={fullNameWithTitle || "Unknown"}
              />

              <InfoCard
                title={"Employee ID"}
                description={faculty.employee_id || "-"}
              />
              <InfoCard
                title={"Role"}
                description={
                  faculty.role ? faculty.role.toUpperCase() : "FACULTY"
                }
              />
              <InfoCard title={"Sex"} description={faculty.sex || "-"} />
            </CardContent>
          </CardHeader>
        </Card>
      </div>

      {/* SECTION 2: LOGGED RECORDS */}
      <div className="flex flex-col gap-2">
        <h2 className="text-[#0A58A3] text-xl font-semibold">Logged History</h2>
        <p className="text-[#6C757D] mb-2">
          Records created by this faculty member.
        </p>
        <ReportCardList data={records} />
      </div>
    </div>
  );
}