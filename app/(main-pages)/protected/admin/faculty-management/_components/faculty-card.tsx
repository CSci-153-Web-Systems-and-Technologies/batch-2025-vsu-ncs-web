import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

import { StaffProfile } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { User, CalendarDays } from "lucide-react";

export default function FacultyCard({
  id,
  employee_id,
  title,
  sex,
  created_at,
  role,
  first_name,
  middle_name,
  last_name,
  suffix,
}: StaffProfile) {
  const prefix = title ? `${title} ` : "";
  const fullName = `${prefix}${last_name}, ${first_name} ${
    middle_name?.[0] || ""
  }. ${suffix || ""}`;

  const joinedDate = new Date(created_at).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <CardTitle>{fullName}</CardTitle>
            <CardDescription>{employee_id || "No Employee ID"}</CardDescription>
          </div>
          <Button asChild size="sm" variant="outline">
            <Link href={`/records/staff/${id}`}>View</Link>
          </Button>
        </div>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <User className="w-3 h-3" /> Role
          </span>
          <Badge variant="secondary" className="w-fit capitalize">
            {role || "Faculty"}
          </Badge>
        </div>

        <div className="flex flex-col gap-1">
          <span className="text-xs text-muted-foreground flex items-center gap-1">
            <CalendarDays className="w-3 h-3" /> Joined
          </span>
          <span className="text-sm font-medium">{joinedDate}</span>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-start text-sm text-muted-foreground border-t pt-4">
        <p className="capitalize">{`Sex: ${sex ?? "Not specified"}`}</p>
      </CardFooter>
    </Card>
  );
}
