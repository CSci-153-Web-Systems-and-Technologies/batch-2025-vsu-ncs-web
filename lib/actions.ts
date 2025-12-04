"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const FormSchema = z.object({
  student_uuid: z.string().uuid("Invalid student ID"),
  category: z.enum(["merit", "demerit", "serious"]),
  context: z.enum(["office", "rle"]),
  description: z.string().min(5, "Description must be at least 5 characters"),
  sanction_days: z.coerce.number().min(0).optional(),
});

export type ActionState = {
  message?: string;
  error?: string;
  success?: boolean;
};

export async function submitConductReport(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const supabase = await createClient();

  const validatedFields = FormSchema.safeParse({
    student_uuid: formData.get("student_uuid"),
    category: formData.get("category"),
    context: formData.get("context"),
    description: formData.get("description"),
    sanction_days: formData.get("sanction_days"),
  });

  if (!validatedFields.success) {
    return { error: "Invalid form data. Please check your inputs." };
  }

  const { student_uuid, category, context, description, sanction_days } =
    validatedFields.data;

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Unauthorized. Please log in." };
  }

  const isSerious = category === "serious";
  const dbType = category === "merit" ? "merit" : "demerit";

  const finalDays = isSerious ? 0 : sanction_days ?? 0;

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
    console.error("Database Error:", error);
    return { error: "Failed to create report. Please try again." };
  }

  revalidatePath("/protected/faculty/dashboard");
  revalidatePath("/protected/faculty/reports");

  return { success: true, message: "Record logged successfully!" };
}
