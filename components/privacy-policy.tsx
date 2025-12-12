import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function PrivacyDialog({ children }: { children?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <span className="cursor-pointer hover:underline text-muted-foreground text-xs">
            Privacy Policy
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Privacy Policy</DialogTitle>
          <DialogDescription>
            How we handle student data in compliance with the Data Privacy Act
            of 2012.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[60vh] pr-4 overflow-y-auto text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            <strong>Effective Date: December 2025</strong>
          </p>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              1. Data Collection
            </h4>
            <p>
              The VSU Nursing Conduct System collects and processes the
              following personal information:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Student Name, ID Number, and Year Level.</li>
              <li>Records of behavioral infractions (Minor and Serious).</li>
              <li>
                Details of sanctions and community service hours rendered.
              </li>
              <li>
                Digital copies of incident reports and explanatory letters.
              </li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              2. Purpose of Processing
            </h4>
            <p>
              This data is collected solely for legitimate academic and
              administrative purposes, including:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Tracking compliance with the College of Nursing&apos;s rules and
                regulations.
              </li>
              <li>
                Calculating merit/demerit scores for RLE (Related Learning
                Experience) grading.
              </li>
              <li>Determining eligibility for graduation and honors.</li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              3. Data Sharing & Disclosure
            </h4>
            <p>
              Student records are strictly confidential. Data is shared only
              with:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Authorized Faculty and Clinical Instructors.</li>
              <li>The Office of Student Affairs (for serious cases).</li>
              <li>
                Parents or Guardians (only when required by university policy
                regarding serious disciplinary actions).
              </li>
            </ul>
            <p className="mt-2">
              <strong>
                We do not sell or share student data with third-party
                advertisers.
              </strong>
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              4. Data Security
            </h4>
            <p>
              We implement industry-standard security measures (encryption,
              access controls, audit logs) to protect data from unauthorized
              access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              5. Student Rights
            </h4>
            <p>
              Under the Data Privacy Act of 2012, students have the right to
              access their disciplinary records and request corrections to
              erroneous entries via the proper administrative channels.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
