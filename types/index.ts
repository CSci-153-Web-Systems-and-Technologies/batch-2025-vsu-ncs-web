import { LucideProps } from "lucide-react";

export interface SidebarProps {
  title: string;
  url: string;
  icon: React.ComponentType<LucideProps>;
}

//Raw Data
export type SanctionContext = "office" | "rle";
export type ConductType = "merit" | "demerit";

export type StudentProfile = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  student_id: string | null;
  year_level: number | null;
  sex: string | null;
};

export type StaffProfile = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  role: string | null;
  employee_id: string | null;
  title: string | null;
  sex: string | null;
};

export type ConductReport = {
  id: string;
  created_at: string;
  student_id: string;
  faculty_id: string | null;
  description: string;
  is_serious_infraction: boolean;
  sanction_days: number;
  sanction_other: string | null;
  sanction_context: SanctionContext;
  type: ConductType;
};

export type ConductReportWithReporter = ConductReport & {
  staff_profiles: Pick<
    StaffProfile,
    "first_name" | "middle_name" | "last_name" | "suffix" | "title"
  > | null;
};

export type ConductReportWithStudent = ConductReport & {
  student_profiles: StudentProfile;
};

//Clean Data
export type StudentConductRecord = {
  id: string;
  date: string;
  reporter: string;
  description: string;
  sanction_days: number;
  is_serious_infraction: boolean;
  type: ConductType;
  sanction_context: SanctionContext;
  sanction_other: string | null;
};

export type FacultyStudentRecord = {
  id: string;
  first_name: string;
  middle_name: string;
  last_name: string;
  suffix: string;
  student_id: string | null;
  year_level: number | null;
  sex: string | null;
  net_sanction_duty: number;
  net_sanction_office: number;
};