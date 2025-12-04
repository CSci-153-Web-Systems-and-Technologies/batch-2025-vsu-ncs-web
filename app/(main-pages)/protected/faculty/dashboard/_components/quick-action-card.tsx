import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecordForm } from "./record-form";
import { createClient } from "@/lib/supabase/server";

/*type QuickActionCardProps = {
  title: string;
  total: number;
  color: string;
  description: string;
};*/

export default async function QuickActionCard() {
  const supabase = await createClient();

  const { data: studentsRaw } = await supabase
    .from("student_profiles")
    .select("id, student_id, first_name, last_name")
    .order("last_name", { ascending: true });

  const studentOptions = (studentsRaw || []).map((s) => ({
    id: s.id,
    student_id: s.student_id || "No ID",
    full_name: `${s.first_name} ${s.last_name}`,
  }));
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Log Merit/Demerit</CardTitle>
        <CardDescription>Record student conduct.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <RecordForm students={studentOptions} />
      </CardContent>
    </Card>
  );
}
