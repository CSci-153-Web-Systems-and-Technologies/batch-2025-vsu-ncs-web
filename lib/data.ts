import {
  ConductReport,
  StudentProfile,
  StaffProfile,
  InfractionResponse,
  StudentConductSummary,
  ConductReportWithReporter,
  ConductReportWithStudent,
  SeriousInfractionTicket,
  InfractionStatus,
} from "@/types";

// ==============================================================================
// 1. TRANSFORMER: Student Summary (The Math Logic)
// ==============================================================================
export function transformStudentSummary(
  raw: any
): StudentConductSummary | null {
  try {
    if (!raw) return null;

    const reports: ConductReport[] = raw.conduct_reports || [];

    // A. Filter by Type
    const merits = reports.filter((r) => r.type === "merit");
    const demerits = reports.filter((r) => r.type === "demerit");

    // B. Filter Demerits by Context
    const rleDemerits = demerits.filter((r) => r.sanction_context === "rle");
    const officeDemerits = demerits.filter(
      (r) => r.sanction_context === "office"
    );

    // C. Helper to sum days
    const sumDays = (arr: ConductReport[]) =>
      arr.reduce((acc, curr) => acc + (curr.sanction_days || 0), 0);

    const totalMerits = sumDays(merits);
    const totalDemerits = sumDays(demerits);
    const totalRleDemerits = sumDays(rleDemerits);
    const totalOfficeDemerits = sumDays(officeDemerits);

    // D. CALCULATE NET SANCTIONS
    // Business Logic: Merits are usually applied to reduce liabilities.
    // Assuming Merits reduce RLE liabilities first (Standard Nursing School Logic).
    // You can adjust this math if your logic is different.

    const netRle = Math.max(0, totalRleDemerits - totalMerits);

    // If you want remaining merits to apply to Office, calculate remainder here.
    // For now, assuming distinct pools or RLE priority:
    const netOffice = totalOfficeDemerits;

    return {
      ...raw, // Spreads id, names, etc.
      total_merits: totalMerits,
      total_demerits: totalDemerits,
      net_rle_sanction: netRle,
      net_office_sanction: netOffice,
    };
  } catch (error) {
    console.error(
      `Error transforming student summary for ID ${raw?.id}:`,
      error
    );
    return null;
  }
}

// ==============================================================================
// 2. TRANSFORMER: Student View (See who Reported Me)
// ==============================================================================
export function transformReportForStudent(raw: any): ConductReportWithReporter | null {
  try {
    if (!raw) return null;

    // Check if an admin has responded
    const responseData = raw.infraction_responses?.[0]; // Assumes join
    const hasResponse = !!responseData;
    
    // Determine Status
    const status: InfractionStatus = hasResponse ? "Resolved" : "Pending";

    // Safely extract reporter details
    const reporterRaw = raw.reporter; // Assumes .select('..., reporter:staff_profiles!faculty_id(*)')

    return {
      ...raw,
      status,
      reporter: reporterRaw ? {
        first_name: reporterRaw.first_name,
        last_name: reporterRaw.last_name,
        title: reporterRaw.title,
      } : null,
      response: hasResponse ? {
        resolved_at: responseData.created_at,
        // If Admin was joined in the response
        admin_name: responseData.admin 
          ? `${responseData.admin.first_name} ${responseData.admin.last_name}` 
          : "Admin",
        final_sanction: responseData.final_sanction_days 
          ? `${responseData.final_sanction_days} days` 
          : responseData.final_sanction_other,
        notes: responseData.notes,
      } : null
    };

  } catch (error) {
    console.error(`Error transforming report for student view (Report ID: ${raw?.id}):`, error);
    return null;
  }
}