import { LucideProps } from "lucide-react";

export interface SidebarProps {
  title: string;
  url: string;
  icon: React.ComponentType<LucideProps>;
}

// types.ts

// ==========================================
// 1. Enums and Shared Unions
// ==========================================

export type ConductReportType = 'merit' | 'demerit';
export type SanctionContext = "office" | "rle";
export type InfractionStatus = "Pending" | "Resolved";

// ==========================================
// 2. Base Database Entities (Mirror of SQL)
// ==========================================

export interface StudentProfile {
  id: string; // UUID
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
  id: string; // UUID
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
  id: string; // UUID
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
  id: number; // bigint
  report_id: string | null;
  admin_id: string | null;
  created_at: string;
  final_sanction_days: number | null;
  final_sanction_other: string | null;
  notes: string | null;
  final_sanction_context: SanctionContext | null; 
}

// ==========================================
// 3. Application DTOs (Data Transfer Objects)
// ==========================================

// --- DASHBOARD METRICS ---
export interface DashboardMetrics {
  total_students: number;
  total_merits: number;
  total_demerits: number;
  total_serious_cases: number;
}

// --- STUDENT VIEW MODELS ---

// 1. For the "My Sanctions Summary" Table (Aggregates)
export interface StudentConductSummary extends StudentProfile {
  total_merits: number;
  total_demerits: number;
  net_rle_sanction: number;
  net_office_sanction: number;
}

// 2. For the "My Conduct History" Table (Ticket View)
// Shows: "I was reported by [Reporter Name]"
export interface ConductReportWithReporter extends ConductReport {
  // Who filed this?
  reporter: {
    first_name: string;
    last_name: string;
    title: string | null;
  } | null;

  // Has the admin decided?
  status: InfractionStatus; 

  // What was the decision? (Optional/Nullable)
  response?: {
    resolved_at: string;
    admin_name: string;
    final_sanction: string | null;
    notes: string | null;
  } | null;
}

// --- FACULTY VIEW MODELS ---

// 1. For the "My Sent Reports" Table (Ticket View)
// Shows: "I reported [Student Name]"
export interface ConductReportWithStudent extends ConductReport {
  // Who did I report?
  student: {
    first_name: string;
    last_name: string;
    student_id: string | null;
    year_level: number | null;
  } | null;

  // Has the admin acted on my serious report?
  status: InfractionStatus; 
  
  // Optional: Who resolved it?
  admin_name?: string | null;
}

// --- ADMIN VIEW MODELS ---

// 1. For the "Serious Infractions Queue" Table (Full Ticket View)
// Shows: "[Faculty] reported [Student]"
export interface SeriousInfractionTicket extends ConductReport {
  // The Accused
  student: {
    id: string; // Needed for navigation to profile
    first_name: string;
    last_name: string;
    student_id: string | null;
  } | null;

  // The Reporter
  reporter: {
    first_name: string;
    last_name: string;
    title: string | null;
  } | null;

  // Workflow Status
  status: InfractionStatus;
  
  // If resolved, include the response ID for reference
  response_id?: number | null; 
}