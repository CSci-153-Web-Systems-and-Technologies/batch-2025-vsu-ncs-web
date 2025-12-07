"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { SeriousInfractionTicket } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

const StudentAccountSchema = z.object({
  student_id: z
    .string()
    .min(1, { message: "Student ID required" })
    .regex(/^2\d-1-\d{5}$/, {
      message: "Invalid Student ID. Must be like 23-1-12345.",
    }),
  year_level: z.coerce
    .number()
    .max(4, { message: "Invalid year level" })
    .min(1, { message: "Invalid year level" }),
  sex: z.string().min(4, "Invalid sex").max(6, "Invalid sex"),
  first_name: z.string().min(1, { message: "First name required" }),
  middle_name: z.string().optional().default(""),
  last_name: z.string().min(1, { message: "First name required" }),
  suffix: z.string().optional().default(""),
  email: z.email(),
  temp_password: z.string().min(1, { message: "Password required" }),
});

const StaffAccountSchema = z.object({
  employee_id: z
    .string()
    .min(1, { message: "Student ID required" })
    .regex(/^2\d-1-\d{5}$/, {
      message: "Invalid Student ID. Must be like 23-1-12345.",
    }),
  title: z.string().optional().default(""),

  sex: z.string().min(4, "Invalid sex").max(6, "Invalid sex"),
  role: z
    .string()
    .min(5, { message: "Invalid role" })
    .max(7, { message: "Invalid role" }),
  first_name: z.string().min(1, { message: "First name required" }),
  middle_name: z.string().optional().default(""),
  last_name: z.string().min(1, { message: "First name required" }),
  suffix: z.string().optional().default(""),
  email: z.email(),
  temp_password: z.string().min(1, { message: "Password required" }),
});

const PasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"], // Error will appear on the 'confirm' field
  });

export async function createStudentAccount(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role;

  if (userRole !== "admin") {
    return { error: "Unauthorized: Only Admins can create accounts." };
  }

  const validated = StudentAccountSchema.safeParse({
    student_id: formData.get("student_id"),
    year_level: formData.get("year_level"),
    sex: formData.get("sex"),
    first_name: formData.get("first_name"),
    middle_name: formData.get("middle_name"),
    last_name: formData.get("last_name"),
    suffix: formData.get("suffix"),
    email: formData.get("email"),
    temp_password: formData.get("temp_password"),
  });

  if (!validated.success) {
    return { error: "Invalid data provided." };
  }

  const {
    student_id,
    year_level,
    sex,
    first_name,
    middle_name,
    last_name,
    suffix,
    email,
    temp_password,
  } = validated.data;

  const supabaseAdmin = await createAdminClient();

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temp_password,
      email_confirm: true,
      app_metadata: { role: "student" },
      user_metadata: { must_change_password: true },
    });

  if (authError) {
    console.error("Auth Creation Error", authError);
    return { error: "failed to create auth user: " + authError.message };
  }

  const newID = authData.user.id;

  const { error } = await supabaseAdmin.from("student_profiles").insert({
    id: newID,
    student_id: student_id,
    year_level: year_level,
    sex: sex,
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name,
    suffix: suffix,
  });

  if (error) {
    return { error: "Failed to create student profile: " + error.message };
  }

  revalidatePath("/protected/admin/student-management");
  return {
    success: true,
    message: `Account created for ${first_name} ${middle_name.charAt(
      0
    )}. ${last_name} ${suffix}`,
  };
}

export async function createStaffAccount(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userRole = user?.app_metadata?.role;

  if (userRole !== "admin") {
    return { error: "Unauthorized: Only Admins can create accounts." };
  }

  const validated = StaffAccountSchema.safeParse({
    employee_id: formData.get("employee_id"),
    title: formData.get("title"),
    sex: formData.get("sex"),
    role: formData.get("role"),
    first_name: formData.get("first_name"),
    middle_name: formData.get("middle_name"),
    last_name: formData.get("last_name"),
    suffix: formData.get("suffix"),
    email: formData.get("email"),
    temp_password: formData.get("temp_password"),
  });

  if (!validated.success) {
    return { error: "Invalid data provided." };
  }

  const {
    employee_id,
    title,
    sex,
    role,
    first_name,
    middle_name,
    last_name,
    suffix,
    email,
    temp_password,
  } = validated.data;

  const supabaseAdmin = await createAdminClient();

  const { data: authData, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: temp_password,
      email_confirm: true,
      app_metadata: { role: role },
      user_metadata: { must_change_password: true },
    });

  if (authError) {
    console.error("Auth Creation Error", authError);
    return { error: "failed to create auth user: " + authError.message };
  }

  const newID = authData.user.id;

  const { error } = await supabaseAdmin.from("staff_profiles").insert({
    id: newID,
    employee_id: employee_id,
    title: title,
    sex: sex,
    role: role,
    first_name: first_name,
    middle_name: middle_name,
    last_name: last_name,
    suffix: suffix,
  });

  if (error) {
    return { error: "Failed to create staff profile: " + error.message };
  }

  revalidatePath("/protected/admin/faculty-management");
  return {
    success: true,
    message: `Account created for ${first_name} ${middle_name.charAt(
      0
    )}. ${last_name} ${suffix}`,
  };
}

export async function submitConductReport(prevState: any, formData: FormData) {
  const supabase = await createClient();

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

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Unauthorized" };

  const isSerious = category === "serious";
  const dbType = category === "merit" ? "merit" : "demerit";
  const finalDays = isSerious ? 0 : sanction_days;

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
    .eq("id", report.id);

  if (updateError) {
    console.error("Supabase Error:", updateError);
    return { error: "Failed to update report: " + updateError.message };
  }

  revalidatePath("/protected/admin/serious-infractions");

  return { success: true, message: "Review logged successfully" };
}

export async function updateInitialPassword(
  prevState: any,
  formData: FormData
) {
  const supabase = await createClient();

  const validated = PasswordSchema.safeParse({
    password: formData.get("password"),
    confirm: formData.get("confirm_password"),
  });

  if (!validated.success) {
    const firstError =
      validated.error.flatten().fieldErrors.confirm?.[0] ||
      validated.error.flatten().fieldErrors.password?.[0];
    return { error: firstError || "Invalid password data" };
  }

  const { error } = await supabase.auth.updateUser({
    password: validated.data.password,
    data: { must_change_password: false },
  });

  if (error) {
    return { error: error.message };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const role = user?.app_metadata?.role || "student";

  redirect(`/protected/${role}/dashboard`);
}

export async function getDashboardChartData() {
  const supabase = await createClient();

  const { data: reports, error } = await supabase
    .from("conduct_reports")
    .select("created_at, type, is_serious_infraction, sanction_context")
    .neq("type", "merit")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Error fetching chart data:", error);
    return [];
  }

  return reports;
}