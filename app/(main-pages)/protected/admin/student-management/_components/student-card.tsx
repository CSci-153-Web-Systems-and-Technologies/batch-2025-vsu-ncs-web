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
  net_office_sanction,
  net_rle_sanction,
}: StudentConductSummary) {
  const fullName = `${last_name}, ${first_name} ${middle_name?.[0] || ""}. ${
    suffix || ""
  }`;

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>{student_id || "No ID"}</CardDescription>
          </div>
          <Button asChild size="sm">
            <Link href={`/records/students/${id}`}>View</Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Net Office</span>
          <span className="text-xl font-bold text-orange-600">
            {net_office_sanction}
          </span>
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-muted-foreground">Net RLE</span>
          <span className="text-xl font-bold text-blue-600">
            {net_rle_sanction}
          </span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground">
        <p>{`Year Level: ${year_level ?? "-"}`}</p>
        <p>{`Sex: ${sex ?? "-"}`}</p>
      </CardFooter>
    </Card>
  );
}
