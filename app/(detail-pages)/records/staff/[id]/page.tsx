//import { notFound } from "next/navigation";

// 1. Define the props type correctly for Next.js 15
/*type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function StaffRecordPage({ params }: PageProps) {
  // 2. Await the params before using them
  const { id } = await params;
  const staffID = id;

  // 3. Add your safeguard back
  if (!staffID || staffID === "undefined") {
    notFound();
  }

  return (
    <div className="flex flex-col p-10 gap-5">
      Hello, {staffID}! You are in staff profile page.
    </div>
  );
}*/

export default async function StaffRecordPage() {
  return <div>Hello!</div>;
}
