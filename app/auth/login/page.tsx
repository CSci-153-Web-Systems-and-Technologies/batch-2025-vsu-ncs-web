import { LoginForm } from "@/components/login-form";
import Image from "next/image";
import logo from "../../assets/logo.png";
import { ShieldCheck } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="relative hidden lg:flex flex-col p-10 text-white dark:border-r bg-[#0A58A3] overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-transparent to-black/40" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none" />

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

        <div className="relative z-20 flex-1 flex flex-col justify-center items-start gap-8">
          <div className="space-y-2">
            <h2 className="text-5xl font-extrabold tracking-tight text-white/90">
              Integrity.
            </h2>
            <h2 className="text-5xl font-extrabold tracking-tight text-white/70">
              Fairness.
            </h2>
            <h2 className="text-5xl font-extrabold tracking-tight text-white/40">
              Excellence.
            </h2>
          </div>

          <div className="h-1 w-20 bg-emerald-400 rounded-full" />

          <p className="max-w-sm text-lg text-blue-100 font-light leading-relaxed">
            Upholding the highest standards of the nursing profession through
            transparent conduct management.
          </p>
        </div>

        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <ShieldCheck
                  key={i}
                  className="w-5 h-5 text-emerald-400 fill-emerald-400/20"
                />
              ))}
            </div>
            <p className="text-lg font-medium leading-relaxed text-blue-50">
              &ldquo;Integrity is the essence of everything successful. This
              system ensures that every merit and demerit is recorded with
              transparency and fairness.&rdquo;
            </p>
            <footer className="text-sm text-blue-200 mt-4">
              — VSU Faculty of Nursing
            </footer>
          </blockquote>
        </div>
      </div>

      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs space-y-6">
            <div className="lg:hidden flex flex-col items-center text-center gap-2 mb-8">
              <div className="h-12 w-12 bg-blue-50 text-[#0A58A3] rounded-xl flex items-center justify-center mb-2">
                <Image src={logo} alt="Logo" width={32} height={32} />
              </div>
              <h1 className="text-xl font-bold">VSU NCS</h1>
              <p className="text-sm text-muted-foreground">
                Sign in to your account
              </p>
            </div>

            <LoginForm />

            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking login, you agree to our{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </a>{" "}
              and{" "}
              <a
                href="#"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}