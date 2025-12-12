import {
  ConductReport,
  StaffProfile,
  StudentConductSummary,
  ConductReportWithReporter,
  ConductReportWithStudent,
  SeriousInfractionTicket,
  InfractionStatus,
  ServiceLogWithReporter,
  ServiceLogWithStudent,
  ServiceLog,
} from "@/types";

export function transformStudentSummary(
  raw: any
): StudentConductSummary | null {
  try {
    if (!raw) return null;

    const reports: ConductReport[] = raw.conduct_reports || [];
    const serviceLogs: ServiceLog[] = raw.service_logs || [];

    const sumSanctionDays = (arr: ConductReport[]) =>
      arr.reduce((acc, curr) => acc + (curr.sanction_days || 0), 0);

    const sumServiceDays = (arr: ServiceLog[]) =>
      arr.reduce((acc, curr) => acc + (curr.days_deducted || 0), 0);

    const merits = reports.filter((r) => r.type === "merit");
    const demerits = reports.filter((r) => r.type === "demerit");

    const totalMerits = sumSanctionDays(merits);
    const totalDemerits = sumSanctionDays(demerits);
    const totalService = sumServiceDays(serviceLogs);

    const balance = Math.max(0, totalDemerits - (totalService + totalMerits));
    console.log(balance);

    return {
      ...raw,
      total_merits: totalMerits,
      total_demerits: totalDemerits,
      total_service: totalService,
      extension_days: balance,
    };
  } catch (error) {
    console.error(
      `Error transforming student summary for ID ${raw?.id}:`,
      error
    );
    return null;
  }
}

export function transformReportForStudent(
  raw: any
): ConductReportWithReporter | null {
  try {
    if (!raw) return null;

    const responseData = raw.infraction_responses?.[0];
    const hasResponse = !!responseData;

    const status: InfractionStatus = hasResponse ? "Resolved" : "Pending";

    const reporterRaw = raw.reporter;

    return {
      ...raw,
      status,
      reporter: reporterRaw
        ? {
            first_name: reporterRaw.first_name,
            last_name: reporterRaw.last_name,
            title: reporterRaw.title,
          }
        : null,
      response: hasResponse
        ? {
            resolved_at: responseData.created_at,
            admin_name: responseData.admin
              ? `${responseData.admin.first_name} ${responseData.admin.last_name}`
              : "Admin",
            final_sanction: responseData.final_sanction_days
              ? `${responseData.final_sanction_days}`
              : responseData.final_sanction_other,
            notes: responseData.notes,
          }
        : null,
    };
  } catch (error) {
    console.error(
      `Error transforming report for student view (Report ID: ${raw?.id}):`,
      error
    );
    return null;
  }
}

export function transformReportForFaculty(
  raw: any
): ConductReportWithStudent | null {
  try {
    if (!raw) return null;

    const responseData = raw.infraction_responses?.[0];
    const hasResponse = !!responseData;
    const status: InfractionStatus = hasResponse ? "Resolved" : "Pending";
    const studentRaw = raw.student;

    return {
      ...raw,
      status,
      student: studentRaw
        ? {
            first_name: studentRaw.first_name,
            last_name: studentRaw.last_name,
            student_id: studentRaw.student_id,
            year_level: studentRaw.year_level,
          }
        : null,

      response: hasResponse
        ? {
            resolved_at: responseData.created_at,
            admin_name: responseData.admin
              ? `${responseData.admin.first_name} ${responseData.admin.last_name}`
              : "Admin",
            final_sanction: responseData.final_sanction_days
              ? `${responseData.final_sanction_days}`
              : responseData.final_sanction_other,
            notes: responseData.notes,
          }
        : null,
    };
  } catch (error) {
    console.error(`Error transforming faculty report:`, error);
    return null;
  }
}

export function transformSeriousTicket(
  raw: any
): SeriousInfractionTicket | null {
  try {
    if (!raw) return null;

    const responseData = raw.infraction_responses?.[0];
    const hasResponse = !!responseData;
    const status: InfractionStatus = hasResponse ? "Resolved" : "Pending";

    return {
      ...raw,
      status,
      response_id: responseData?.id || null,
      student: raw.student
        ? {
            id: raw.student.id,
            first_name: raw.student.first_name,
            last_name: raw.student.last_name,
            student_id: raw.student.student_id,
          }
        : null,
      reporter: raw.reporter
        ? {
            first_name: raw.reporter.first_name,
            last_name: raw.reporter.last_name,
            title: raw.reporter.title,
          }
        : null,
      response: responseData
        ? {
            id: responseData.id,
            resolved_at: responseData.created_at,
            admin_name: responseData.admin
              ? `${responseData.admin.first_name} ${responseData.admin.last_name}`
              : "Unknown Admin",
            final_sanction: responseData.final_sanction_days,
            final_sanction_other: responseData.final_sanction_other,
            notes: responseData.notes,
          }
        : null,
    };
  } catch (error) {
    console.error(
      `Error transforming serious ticket (Report ID: ${raw?.id}):`,
      error
    );
    return null;
  }
}

export function safeMap<Raw, Transformed>(
  data: Raw[] | null,
  transformer: (item: Raw) => Transformed | null
): Transformed[] {
  if (!data || !Array.isArray(data)) return [];

  return data
    .map(transformer)
    .filter((item): item is Transformed => item !== null);
}

export function transformStaffProfile(raw: any): StaffProfile | null {
  try {
    if (!raw) return null;

    return {
      id: raw.id,
      employee_id: raw.employee_id || "",
      title: raw.title || null,
      sex: raw.sex || null,
      created_at: raw.created_at,
      updated_at: raw.updated_at,
      role: raw.role || "faculty",
      first_name: raw.first_name,
      middle_name: raw.middle_name,
      last_name: raw.last_name,
      suffix: raw.suffix,
    };
  } catch (error) {
    console.error(`Error transforming staff profile ${raw?.id}:`, error);
    return null;
  }
}

export function transformServiceLogForStudent(
  raw: any
): ServiceLogWithReporter | null {
  try {
    if (!raw) return null;

    return {
      id: raw.id,
      student_id: raw.student_id,
      faculty_id: raw.faculty_id,
      days_deducted: raw.days_deducted,
      description: raw.description,
      created_at: raw.created_at,
      reporter: raw.reporter
        ? {
            first_name: raw.reporter.first_name,
            last_name: raw.reporter.last_name,
            title: raw.reporter.title,
          }
        : null,
    };
  } catch (error) {
    console.error(`Error transforming service log ${raw?.id}:`, error);
    return null;
  }
}

export function transformServiceLogForFaculty(
  raw: any
): ServiceLogWithStudent | null {
  try {
    if (!raw) return null;

    return {
      id: raw.id,
      student_id: raw.student_id,
      faculty_id: raw.faculty_id,
      days_deducted: raw.days_deducted,
      description: raw.description,
      created_at: raw.created_at,
      student: raw.student
        ? {
            first_name: raw.student.first_name,
            last_name: raw.student.last_name,
            student_id: raw.student.student_id,
            year_level: raw.year_level,
          }
        : null,
    };
  } catch (error) {
    console.error(`Error transforming service log ${raw?.id}:`, error);
    return null;
  }
}