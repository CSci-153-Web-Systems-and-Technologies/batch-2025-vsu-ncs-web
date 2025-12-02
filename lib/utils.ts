import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// This check can be removed, it is just for tutorial purposes
export const hasEnvVars =
  process.env.NEXT_PUBLIC_SUPABASE_URL &&
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// Define the type for the name parts
type NameParts = {
  first_name: string | null | undefined;
  middle_name: string | null | undefined;
  last_name: string | null | undefined;
  suffix: string | null | undefined;
};

// The 'parseName' function
export function parseName(parts: NameParts | null | undefined): string {
  // If no profile, return empty
  if (!parts) {
    return "";
  }

  // Use COALESCE (??) to default null/undefined to an empty string
  const firstName = parts.first_name ?? "";
  const middleName = parts.middle_name ?? "";
  const lastName = parts.last_name ?? "";
  const suffix = parts.suffix ?? "";

  // Build the name, filtering out empty parts
  const nameArray = [
    firstName,
    // Only add middle initial if middle_name exists
    middleName ? `${middleName.charAt(0).toUpperCase()}.` : "",
    lastName,
    suffix,
  ];

  // Join all parts that are not empty
  return nameArray.filter(Boolean).join(" ");
}

// --- Here is the function you asked for ---
export function capitalizeFirstLetter(
  string: string | null | undefined
): string {
  // Add a safety check for null or undefined strings
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
