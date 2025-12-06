import { LucideProps } from "lucide-react";

export interface SidebarProps {
  title: string;
  url: string;
  icon: React.ComponentType<LucideProps>;
}

export type ConductReportType = "merit" | "demerit";
export type SanctionContext = "office" | "rle";
export type InfractionStatus = "Pending" | "Resolved";

export interface StudentProfile {
  id: string;
  student_id: string | null;
  year_level: number | null;
  sex: string | null;
  created_at: string;
  updated_at: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
}

export interface StaffProfile {
  id: string;
  employee_id: string;
  title: string | null;
  sex: string | null;
  created_at: string;
  updated_at: string | null;
  role: string | null;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
}

export interface ConductReport {
  id: string;
  created_at: string;
  student_id: string | null;
  faculty_id: string | null;
  description: string | null;
  is_serious_infraction: boolean | null;
  sanction_days: number | null;
  sanction_other: string | null;
  sanction_context: SanctionContext | null;
  type: ConductReportType;
}

export interface InfractionResponse {
  id: number | null;
  report_id: string | null;
  admin_id: string | null;
  created_at: string;
  final_sanction_days: number | null;
  final_sanction_other: string | null;
  notes: string | null;
  final_sanction_context: SanctionContext | null;
}

export interface DashboardMetrics {
  total_students: number;
  total_merits: number;
  total_demerits: number;
  total_serious_cases: number;
}

export interface StudentConductSummary extends StudentProfile {
  total_merits: number;
  total_demerits: number;
  net_rle_sanction: number;
  net_office_sanction: number;
}

export interface ConductReportWithReporter extends ConductReport {
  reporter: {
    first_name: string;
    last_name: string;
    title: string | null;
  } | null;

  status: InfractionStatus;

  response?: {
    resolved_at: string;
    admin_name: string;
    final_sanction: number | null;
    notes: string | null;
  } | null;
}

export interface ConductReportWithStudent extends ConductReport {
  student: {
    first_name: string;
    last_name: string;
    student_id: string | null;
    year_level: number | null;
  } | null;

  status: InfractionStatus;

  admin_name?: string | null;
  response?: {
    resolved_at: string;
    admin_name: string;
    final_sanction: string | null;
    notes: string | null;
  } | null;
}

export interface SeriousInfractionTicket extends ConductReport {
  student: {
    id: string;
    first_name: string;
    last_name: string;
    student_id: string | null;
  } | null;

  reporter: {
    first_name: string;
    last_name: string;
    title: string | null;
  } | null;

  status: InfractionStatus;

  response_id?: number | null;
  response?: {
    id: number;
    admin_name: string;
    resolved_at: string;
    final_sanction: string | null;
    notes: string | null;
  } | null;
}
