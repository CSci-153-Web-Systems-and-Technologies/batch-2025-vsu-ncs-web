import { createClient } from "@/lib/supabase/server";
import { transformServiceLogWithReporter, safeMap } from "@/lib/data"; // Or your utils path
import { ServiceLogWithReporter } from "@/types";
import ServiceLogList from "./_components/service-log-list";
import { AlertTriangle } from "lucide-react";

export default async function ServiceHistory() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: rawData } = await supabase
    .from("service_logs")
    .select(
      `
      *,
      reporter:staff_profiles!faculty_id (first_name, last_name, title)
    `
    )
    .eq("student_id", user?.id)
    .order("created_at", { ascending: false });

  const serviceReports: ServiceLogWithReporter[] = safeMap(
    rawData,
    transformServiceLogWithReporter
  );

  return (
    <div className="flex flex-col w-full p-8 gap-8 max-w-5xl mx-auto">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2 text-slate-600">
          <AlertTriangle className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Service History</h1>
        </div>
        <p className="text-muted-foreground">
          These are major violations that require administrative review.
        </p>
      </div>

      <ServiceLogList data={serviceReports} />
    </div>
  );
}
