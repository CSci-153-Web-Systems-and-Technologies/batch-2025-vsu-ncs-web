"use server";

import { createClient } from "@/lib/supabase/server";
import { ConductReport, SeriousInfractionTicket } from "@/types";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// 1. Zod Schema with Coercion
// We use z.coerce.number() to turn the form string "5" into number 5
const ConductFormSchema = z.object({
  student_uuid: z.string().uuid({ message: "Invalid Student ID" }),
  category: z.enum(["merit", "demerit", "serious"]),
  context: z.enum(["office", "rle"]),
  description: z.string().min(1, { message: "Description is required" }),
  // Allow optional because serious infractions might not have days yet
  sanction_days: z.coerce.number().optional().default(0),
});

const InfractionResponseFormSchema = z.object({
  final_sanction_days: z.coerce.number().optional().default(0),
  final_sanction_other: z.string(),
  notes: z.string().min(1, { message: "Note is required" }),
});

export async function submitConductReport(prevState: any, formData: FormData) {
  const supabase = await createClient();

  // 2. Debugging: Uncomment to see what the server is actually receiving
  // console.log(Object.fromEntries(formData));

  // 3. Validate Data
  const validatedFields = ConductFormSchema.safeParse({
    student_uuid: formData.get("student_uuid"),
    category: formData.get("category"),
    context: formData.get("context"),
    description: formData.get("description"),
    sanction_days: formData.get("sanction_days"),
  });

  if (!validatedFields.success) {
    return {
      error:
        validatedFields.error.flatten().fieldErrors.description?.[0] ||
        "Invalid form data",
    };
  }

  const { student_uuid, category, context, description, sanction_days } =
    validatedFields.data;

  // 4. Get Current User (Faculty)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  // 5. Transform Logic
  const isSerious = category === "serious";
  // DB likely only accepts 'merit' or 'demerit', so map 'serious' to 'demerit'
  const dbType = category === "merit" ? "merit" : "demerit";
  const finalDays = isSerious ? 0 : sanction_days;

  // 6. Insert
  const { error } = await supabase.from("conduct_reports").insert({
    student_id: student_uuid,
    faculty_id: user.id,
    type: dbType,
    is_serious_infraction: isSerious,
    sanction_context: context,
    description: description,
    sanction_days: finalDays,
    sanction_other: null,
  });

  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Failed to log record: " + error.message };
  }

  // 7. Revalidate
  revalidatePath("/protected/faculty/dashboard");
  revalidatePath("/protected/faculty/logged-records");

  return { success: true, message: "Record logged successfully" };
}

export async function submitInfractionResponse(
  prevState: any,
  formData: FormData,
  report: SeriousInfractionTicket
) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const validatedFields = InfractionResponseFormSchema.safeParse({
    final_sanction_days: formData.get("final_sanction_days"),
    final_sanction_other: formData.get("final_sanction_other"),
    notes: formData.get("notes"),
  });

  if (!validatedFields.success) {
    return {
      error: "Invalid form data",
    };
  }

  const { final_sanction_days, final_sanction_other, notes } =
    validatedFields.data;

  const { error } = await supabase.from("infraction_responses").insert({
    report_id: report.id,
    admin_id: user?.id,
    final_sanction_days: final_sanction_days,
    final_sanction_other: final_sanction_other,
    notes: notes,
  });

  if (error) {
    console.error("Supabase Error:", error);
    return { error: "Failed to log infraction response: " + error.message };
  }

  const { error: updateError } = await supabase
    .from("conduct_reports")
    .update({
      sanction_days: final_sanction_days,
      sanction_other: final_sanction_other,
    })
    .eq("report_id", report.id);

  if (updateError) {
    console.error("Supabase Error:", updateError);
    return { error: "Failed to update report: " + updateError.message };
  }

  revalidatePath("/protected/admin/serious-infractions");

  return { success: true, message: "Review logged successfully" };
}