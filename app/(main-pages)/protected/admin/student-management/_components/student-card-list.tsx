"use client";

import { StudentConductSummary } from "@/types";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import StudentCard from "./student-card";
import { CreateStudentDialog } from "./create-student-account-form";

type StudentCardListProps = {
  data: StudentConductSummary[];
};

export default function StudentCardList({ data }: StudentCardListProps) {
  const [query, setQuery] = useState("");

  const filteredRecords = data.filter((record) => {
    if (!query) return true;
    const lowerQuery = query.toLowerCase();
    const fullName = `${record.first_name} ${record.last_name}`.toLowerCase();
    const id = (record.student_id || "").toLowerCase();

    return fullName.includes(lowerQuery) || id.includes(lowerQuery);
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <CreateStudentDialog />
      </div>
      <Input
        placeholder="Search by id or name..."
        onChange={(event) => setQuery(event.target.value)}
        value={query}
      />

      {filteredRecords.map((record) => (
        <StudentCard key={record.id} {...record} />
      ))}

      {filteredRecords.length === 0 && (
        <p className="text-center text-muted-foreground">No students found.</p>
      )}
    </div>
  );
}
