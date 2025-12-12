import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { columns } from "../../_components/conduct-records-column";
import { ConductRecordsTable } from "../../_components/conduct-records-table";
import ServiceLogList from "@/app/(main-pages)/protected/student/service-history/_components/service-log-list";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ConductReportWithReporter,
  ServiceLogWithReporter,
  StudentProfile,
} from "@/types";
import { parseName } from "@/lib/utils";
import {
  transformReportForStudent,
  safeMap,
  transformServiceLogForStudent,
} from "@/lib/data";

export default async function StudentRecordPage({
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
    .from("student_profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (!profileData) {
    notFound();
  }
  const student = profileData as StudentProfile;

  const { data: conductRaw } = await supabase
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

  const conductRecords: ConductReportWithReporter[] = safeMap(
    conductRaw,
    transformReportForStudent
  );

  const { data: serviceRaw } = await supabase
    .from("service_logs")
    .select(
      `
        *,
        reporter:staff_profiles!faculty_id (first_name, last_name, title)
      `
    )
    .eq("student_id", id)
    .order("created_at", { ascending: false });

  const serviceReports: ServiceLogWithReporter[] = safeMap(
    serviceRaw,
    transformServiceLogForStudent
  );

  function calculateTotals(
    cRecords: ConductReportWithReporter[],
    sLogs: ServiceLogWithReporter[]
  ) {
    let totalMerits = 0;
    let totalDemerits = 0;
    let office_demerits = 0;
    let office_merits = 0;
    let rle_demerits = 0;
    let rle_merits = 0;

    for (const r of cRecords) {
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

    const totalServed = sLogs.reduce((acc, log) => acc + log.days_deducted, 0);

    return {
      totalMerits,
      totalDemerits,
      totalServed,
      netOffice: Math.max(0, office_demerits - office_merits),
      netRle: Math.max(0, rle_demerits - rle_merits),
      remainingBalance: Math.max(0, totalDemerits - totalServed - totalMerits),
    };
  }

  const totals = calculateTotals(conductRecords, serviceReports);
  const full_name = parseName(student);

  return (
    <div className="flex flex-col p-10 gap-6">
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Student Information</CardTitle>
            <CardDescription>
              Personal details and academic details
            </CardDescription>
            <CardContent className="flex flex-col md:flex-row px-0 pt-4 justify-between gap-4">
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

      <div className="flex flex-col sm:flex-row w-full gap-5">
        <TotalsCard
          title="Current Balance"
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

      <Tabs defaultValue="conduct" className="w-full">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="conduct">Conduct History</TabsTrigger>
            <TabsTrigger value="service">Service History</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="conduct">
          <div className="hidden md:block">
            <ConductRecordsTable columns={columns} data={conductRecords} />
          </div>
          <div className="md:hidden">
            <ConductCardList data={conductRecords} />
          </div>
        </TabsContent>

        <TabsContent value="service">
          <ServiceLogList data={serviceReports} />
        </TabsContent>
      </Tabs>
    </div>
  );
}