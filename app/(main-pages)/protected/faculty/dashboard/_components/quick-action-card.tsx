import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { RecordForm } from "./record-form";

/*type QuickActionCardProps = {
  title: string;
  total: number;
  color: string;
  description: string;
};*/

export default function QuickActionCard() {
  return (
    <Card className="flex-1">
      <CardHeader>
        <CardTitle>Log Merit/Demerit</CardTitle>
        <CardDescription>Record student conduct.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <RecordForm />
      </CardContent>
    </Card>
  );
}
