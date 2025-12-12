import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function TermsDialog({ children }: { children?: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <span className="cursor-pointer hover:underline text-muted-foreground text-s underline underline-offset-4 hover:text-primary">
            Terms of Service
          </span>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Terms of Service</DialogTitle>
          <DialogDescription>
            Agreement for usage of the VSU Nursing Conduct System.
          </DialogDescription>
        </DialogHeader>

        <div className="h-[60vh] pr-4 overflow-y-auto text-sm text-slate-600 space-y-4 leading-relaxed">
          <p>
            <strong>Last Updated: December 2025</strong>
          </p>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              1. Acceptance of Terms
            </h4>
            <p>
              By accessing or using the VSU Nursing Conduct System (&quot;the
              System&quot;), you agree to be bound by these terms. This System
              is designated for official use by the College of Nursing faculty,
              administration, and authorized student representatives only.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              2. Authorized Use & Confidentiality
            </h4>
            <p>
              You are granted access solely for the purpose of managing student
              conduct records, merit/demerit points, and service logs. You agree
              to:
            </p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>
                Maintain the strict confidentiality of all student records.
              </li>
              <li>Not share your login credentials with anyone.</li>
              <li>Only access records relevant to your official duties.</li>
              <li>
                Not disclose sensitive infraction details to unauthorized third
                parties.
              </li>
            </ul>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              3. Data Accuracy
            </h4>
            <p>
              Users responsible for data entry (Faculty/Admins) must ensure that
              all conduct reports, sanctions, and service logs are accurate and
              factual. Falsification of records is a serious offense and grounds
              for account termination and administrative action.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              4. System Integrity
            </h4>
            <p>
              You agree not to attempt to bypass security features, modify the
              system code, or perform actions that could compromise the
              integrity of the database.
            </p>
          </section>

          <section>
            <h4 className="font-semibold text-slate-900 mb-1">
              5. Limitation of Liability
            </h4>
            <p>
              The System is provided &quot;as is.&quot; While we strive for data
              accuracy, the College of Nursing is not liable for administrative
              errors resulting from incorrect data entry. Discrepancies should
              be reported to the System Administrator immediately for
              resolution.
            </p>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  );
}
