import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { StudentConductSummary } from "@/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentCard({
  id,
  first_name,
  last_name,
  middle_name,
  suffix,
  student_id,
  year_level,
  sex,
  extension_days,
}: StudentConductSummary) {
  const fullName = `${last_name}, ${first_name} ${middle_name?.[0] || ""}. ${
    suffix || ""
  }`;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{fullName}</CardTitle>
            <CardDescription>{student_id || "No ID"}</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/records/students/${id}`}>View</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col gap-1">
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Extension Balance
          </span>
          <span
            className={`text-2xl font-bold ${
              extension_days > 0 ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {extension_days > 0 ? `${extension_days} Days` : "Cleared"}
          </span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-row gap-4 text-sm text-muted-foreground border-t pt-4">
        <p>{`Year: ${year_level ?? "-"}`}</p>
        <div className="h-4 w-[1px] bg-border" />
        <p>{`Sex: ${sex ?? "-"}`}</p>
      </CardFooter>
    </Card>
  );
}