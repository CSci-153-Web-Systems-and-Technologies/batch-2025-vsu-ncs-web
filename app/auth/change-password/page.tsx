import { ChangePasswordForm } from "@/components/change-password-form";
import Image from "next/image";
import logo from "../../assets/logo.png"; // Adjust path to your logo
import { LockKeyhole, ShieldCheck } from "lucide-react";
import Link from "next/link";

export default function ChangePasswordPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col p-10 text-white dark:border-r bg-[#0A58A3] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

        <Link href="/">
          <div className="relative z-20 flex items-center text-lg font-medium gap-2">
            <div className="bg-white/10 p-1.5 rounded-lg backdrop-blur-sm border border-white/20">
              <Image
                src={logo}
                alt="VSU Logo"
                width={24}
                height={24}
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="tracking-tight font-semibold">
              VSU Nursing Conduct System
            </span>
          </div>
        </Link>

        <div className="relative z-20 flex-1 flex flex-col justify-center items-start gap-6">
          <div className="h-12 w-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center border border-white/20 mb-2">
            <LockKeyhole className="w-6 h-6 text-white" />
          </div>

          <h2 className="text-4xl font-bold tracking-tight leading-tight">
            Secure Your <br />
            <span className="text-emerald-300">Account Access.</span>
          </h2>

          <p className="max-w-sm text-lg text-blue-100 font-light leading-relaxed">
            To ensure the integrity of the conduct system, please update your
            temporary password to a secure, personal one.
          </p>
        </div>

        <div className="relative z-20 mt-auto flex items-center gap-2 text-sm text-blue-200">
          <ShieldCheck className="w-4 h-4" />
          <span>Encrypted & Secure Connection</span>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <div className="lg:hidden flex flex-col items-center text-center gap-2 mb-8">
              <div className="h-12 w-12 bg-blue-50 text-[#0A58A3] rounded-xl flex items-center justify-center mb-2">
                <Image src={logo} alt="Logo" width={32} height={32} />
              </div>
              <h1 className="text-xl font-bold">Account Setup</h1>
              <p className="text-sm text-muted-foreground">
                Create your new password
              </p>
            </div>

            <ChangePasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
}