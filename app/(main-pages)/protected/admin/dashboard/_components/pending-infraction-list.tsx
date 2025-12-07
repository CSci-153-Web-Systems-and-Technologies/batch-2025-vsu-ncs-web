"use client";

import SeriousInfractionCard from "./pending-infraction-card";
import { SeriousInfractionTicket } from "@/types"; // <--- UPDATED IMPORT
import * as React from "react";
type SeriousInfractionListProps = {
  data: SeriousInfractionTicket[]; // <--- UPDATED TYPE (Admin Ticket)
};

export default function PendingInfractionList({
  data,
}: SeriousInfractionListProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-4">
        {data.map((record) => (
          <SeriousInfractionCard key={record.id} record={record} />
        ))}

        {data.length === 0 && (
          <div className="text-center py-10 border-2 border-dashed rounded-lg bg-slate-50">
            <p className="text-muted-foreground">
              No tickets found matching your filters.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
