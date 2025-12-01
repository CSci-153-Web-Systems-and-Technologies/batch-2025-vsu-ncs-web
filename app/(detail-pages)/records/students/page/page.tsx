//import { notFound } from "next/navigation";
/**temporarily removed params:
 * {
  params,
}: {
  params: { id: string };
}
 */

export default async function StudentRecordPage() {
  /*const { id } = await params;
  const staffID = id;

  /*if (!staffID || staffID === "undefined") {
    notFound();
  }*/

  return (
    <div className="flex flex-col p-10 gap-5">
      Hello! You are in student profile page.
    </div>
  );
}
