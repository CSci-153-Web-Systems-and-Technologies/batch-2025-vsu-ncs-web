"use server";

import { createClient, createAdminClient } from "@/lib/supabase/server";
import { SeriousInfractionTicket } from "@/types";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { Resend } from "resend";
import { sendEmail } from "./email-transporter";

import { generateWelcomeEmail } from "./email-template/welcome-email";
import { generateConductNotificationEmail } from "./email-template/conduct-report-email";
import { generateStudentInfractionResolutionEmail } from "./email-template/infraction-review-email";
import { generateReporterNotificationEmail } from "./email-template/infraction-review-email";
import { z } from "zod";

const ConductFormSchema = z.object({
  student_uuid: z.string().uuid({ message: "Invalid Student ID" }),
  category: z.enum(["merit", "demerit", "serious"]),
  context: z.enum(["office", "rle"]),
  description: z.string().min(1, { message: "Description is required" }),
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
    path: ["confirm"],
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
    await supabaseAdmin.auth.admin.deleteUser(newID);
    return { error: "Failed to create student profile: " + error.message };
  }

  const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  //const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await sendEmail(
      email,
      "Your VSU NCS Account Credentials",
      generateWelcomeEmail(
        first_name,
        email,
        temp_password,
        `${loginUrl}/auth/login`
      )
    );
    /*await resend.emails.send({
      from: "VSU NCS <onboarding@resend.dev>",
      to: "jamirandrade4270@gmail.com",
      subject: "Your VSU NCS Account Credentials",
      html: generateWelcomeEmail(
        first_name,
        email,
        temp_password,
        `${loginUrl}/auth/login`
      ),
    });*/
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  revalidatePath("/protected/admin/student-management");

  return {
    success: true,
    message: `Account created & email sent for ${first_name} ${middle_name.charAt(
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
    await supabaseAdmin.auth.admin.deleteUser(newID);
    return { error: "Failed to create student profile: " + error.message };
  }

  const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";
  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    await sendEmail(
      email,
      "Your VSU NCS Account Credentials",
      generateWelcomeEmail(
        first_name,
        email,
        temp_password,
        `${loginUrl}/auth/login`
      )
    );
    /*await resend.emails.send({
      from: "VSU NCS <onboarding@resend.dev>",
      to: "jamirandrade4270@gmail.com",
      subject: "Your VSU NCS Account Credentials",
      html: generateWelcomeEmail(
        first_name,
        email,
        temp_password,
        `${loginUrl}/auth/login`
      ),
    });*/
  } catch (emailError) {
    console.error("Failed to send email:", emailError);
  }

  revalidatePath("/protected/admin/faculty-management");
  return {
    success: true,
    message: `Account created and email sent for ${first_name} ${middle_name.charAt(
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

  const { data: facultyProfile } = await supabase
    .from("staff_profiles")
    .select("first_name, last_name, title")
    .eq("id", user.id)
    .single();

  const facultyName = facultyProfile
    ? `${facultyProfile.title || ""} ${facultyProfile.first_name} ${
        facultyProfile.last_name
      }`.trim()
    : "Faculty Member";

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

  const supabaseAdmin = await createAdminClient();

  const { data: studentUser, error: userError } =
    await supabaseAdmin.auth.admin.getUserById(student_uuid);
  const { data: studentProfile } = await supabase
    .from("student_profiles")
    .select("first_name, last_name")
    .eq("id", student_uuid)
    .single();

  if (studentUser && studentUser.user && studentProfile) {
    const studentEmail = studentUser.user.email as string;
    const studentName = `${studentProfile.first_name} ${studentProfile.last_name}`;
    //const resend = new Resend(process.env.RESEND_API_KEY);
    const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
      ? process.env.NEXT_PUBLIC_SITE_URL
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "http://localhost:3000";

    try {
      await sendEmail(
        studentEmail,
        `New ${category.toUpperCase()} Record Logged`,
        generateConductNotificationEmail(
          studentName,
          category as "merit" | "demerit" | "serious",
          description,
          new Date().toLocaleDateString(),
          facultyName,
          `${loginUrl}`
        )
      );
      /*await resend.emails.send({
        from: "VSU NCS <notifications@resend.dev>",
        to: studentEmail,
        subject: `New ${category.toUpperCase()} Record Logged`,
        html: generateConductNotificationEmail(
          studentName,
          category as "merit" | "demerit" | "serious",
          description,
          new Date().toLocaleDateString(),
          facultyName,
          `${loginUrl}`
        ),
      });*/
      console.log(`Notification sent to ${studentEmail}`);
    } catch (emailError) {
      console.error("Failed to send notification email:", emailError);
    }
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

  const supabaseAdmin = await createAdminClient();
  const resend = new Resend(process.env.RESEND_API_KEY);

  const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  let verdictString = "";
  if (final_sanction_days > 0) {
    verdictString = `${final_sanction_days} days demerit deduction`;
  }
  if (final_sanction_other) {
    if (verdictString) verdictString += " AND ";
    verdictString += final_sanction_other;
  }
  if (!verdictString) verdictString = "No Sanction Imposed";

  const [
    studentUserData,
    studentProfileData,
    facultyUserData,
    facultyProfileData,
  ] = await Promise.all([
    supabaseAdmin.auth.admin.getUserById(report.student_id as string),
    supabase
      .from("student_profiles")
      .select("first_name, last_name")
      .eq("id", report.student_id as string)
      .single(),
    supabaseAdmin.auth.admin.getUserById(report.faculty_id as string),
    supabase
      .from("staff_profiles")
      .select("first_name, last_name, title")
      .eq("id", report.faculty_id as string)
      .single(),
  ]);

  const studentName = studentProfileData.data
    ? `${studentProfileData.data.first_name} ${studentProfileData.data.last_name}`
    : "Student";

  const facultyName = facultyProfileData.data
    ? `${facultyProfileData.data.title || ""} ${
        facultyProfileData.data.first_name
      } ${facultyProfileData.data.last_name}`.trim()
    : "Faculty Member";

  try {
    const emailPromises = [];

    if (studentUserData.data?.user?.email) {
      emailPromises.push(
        sendEmail(
          studentUserData.data.user.email,
          "Action Required: Serious Infraction Case Update",
          generateStudentInfractionResolutionEmail(
            studentName,
            new Date(report.created_at).toLocaleDateString(),
            verdictString,
            notes,
            loginUrl
          )
        )
      );
    }

    if (facultyUserData.data?.user?.email) {
      emailPromises.push(
        sendEmail(
          facultyUserData.data.user.email, // Using real email via Gmail SMTP
          "Case Resolved: Status Update on Filed Report",
          generateReporterNotificationEmail(
            facultyName,
            studentName,
            new Date(report.created_at).toLocaleDateString(),
            verdictString,
            notes,
            loginUrl
          )
        )
      );
    }

    await Promise.all(emailPromises);
    console.log("Notifications sent to Student and Reporter.");
  } catch (emailError) {
    console.error("Failed to send resolution emails:", emailError);
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

export async function forgotPasswordAction(prevState: any, formData: FormData) {
  const email = formData.get("email") as string;
  const supabase = await createClient();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
    ? process.env.NEXT_PUBLIC_SITE_URL
    : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const callbackUrl = `${siteUrl}/auth/callback?next=/auth/reset-password`;

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: callbackUrl,
  });

  if (error) {
    return { error: error.message };
  }

  return {
    success: true,
    message: "If an account exists, a reset link has been sent to your email.",
  };
}

export async function resetPasswordAction(prevState: any, formData: FormData) {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirm = formData.get("confirm_password") as string;

  if (password !== confirm) {
    return { error: "Passwords do not match" };
  }

  const { error } = await supabase.auth.updateUser({
    password: password,
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