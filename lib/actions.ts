"use server";

import { createClient } from "@/lib/supabase/server";
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
      error: validatedFields.error.flatten().fieldErrors.description?.[0] || "Invalid form data",
    };
  }

  const { student_uuid, category, context, description, sanction_days } = validatedFields.data;

  // 4. Get Current User (Faculty)
  const { data: { user } } = await supabase.auth.getUser();
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
  revalidatePath("/protected/faculty/reports");
  
  return { success: true, message: "Record logged successfully" };
}