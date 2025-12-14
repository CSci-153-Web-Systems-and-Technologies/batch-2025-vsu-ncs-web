import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

type NameParts = {
  first_name: string | null | undefined;
  middle_name: string | null | undefined;
  last_name: string | null | undefined;
  suffix: string | null | undefined;
};

export function parseName(parts: NameParts | null | undefined): string {
  if (!parts) {
    return "";
  }

  const firstName = parts.first_name ?? "";
  const middleName = parts.middle_name ?? "";
  const lastName = parts.last_name ?? "";
  const suffix = parts.suffix ?? "";

  const nameArray = [
    firstName,
    middleName ? `${middleName.charAt(0).toUpperCase()}.` : "",
    lastName,
    suffix,
  ];

  return nameArray.filter(Boolean).join(" ");
}

export function capitalizeFirstLetter(
  string: string | null | undefined
): string {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
