//import { notFound } from "next/navigation";

export default async function StudentRecordPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const staffID = id;

  /*if (!staffID || staffID === "undefined") {
    notFound();
  }*/

  return (
    <div className="flex flex-col p-10 gap-5">
      Hello, {staffID}! You are in student profile page.
    </div>
  );
}
