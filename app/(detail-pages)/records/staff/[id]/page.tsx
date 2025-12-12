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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

  const { data: profileData } = await supabase
    .from("staff_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profileData) {
    notFound();
  }
  const faculty = profileData as StaffProfile;

  const { data: conductRaw } = await supabase
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

  const { data: serviceRaw } = await supabase
    .from("service_logs")
    .select(
      `
      *,
      student:student_profiles(*)
    `
    )
    .eq("faculty_id", id)
    .order("created_at", { ascending: false });

  const conductRecords: ConductReportWithStudent[] = safeMap(
    conductRaw,
    transformReportForFaculty
  );

  const serviceRecords: ConductReportWithStudent[] = (serviceRaw || []).map(
    (log: any) => ({
      id: log.id,
      created_at: log.created_at,
      type: "service",
      is_serious_infraction: false,
      sanction_context: "office",
      description: log.description || "Extension duty served",
      sanction_days: -log.days_deducted,
      sanction_other: null,
      status: "Resolved",
      faculty_id: log.faculty_id,
      student_id: log.student_id,
      student: log.student
        ? {
            first_name: log.student.first_name,
            last_name: log.student.last_name,
            student_id: log.student.student_id,
            year_level: log.student.year_level,
          }
        : null,
    })
  );

  const baseName = parseName(faculty);
  const fullNameWithTitle = faculty.title
    ? `${faculty.title} ${baseName}`.trim()
    : baseName;

  return (
    <div className="flex flex-col p-10 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Faculty Information</CardTitle>
            <CardDescription>
              Personal details and employment information
            </CardDescription>
            <CardContent className="flex flex-col md:flex-row px-0 pt-4 justify-between gap-4">
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

      <div className="flex flex-col gap-2">
        <h2 className="text-[#0A58A3] text-xl font-semibold">Activity Log</h2>
        <p className="text-[#6C757D] mb-4">
          Complete history of reports filed and services cleared by this
          faculty.
        </p>

        <Tabs defaultValue="conduct" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="conduct">Conduct Reports</TabsTrigger>
            <TabsTrigger value="service">Service Clearances</TabsTrigger>
          </TabsList>

          <TabsContent value="conduct">
            <ReportCardList data={conductRecords} />
          </TabsContent>

          <TabsContent value="service">
            <ReportCardList data={serviceRecords} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}