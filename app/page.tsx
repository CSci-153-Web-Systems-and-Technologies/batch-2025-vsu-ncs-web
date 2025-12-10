import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import { ThemeSwitcher } from "@/components/theme-switcher";
import logo from "./assets/logo.png";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  ClipboardCheck,
  ShieldCheck,
  Database,
  CheckCircle2,
  Lock,
  Gavel,
  History,
} from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground overflow-x-hidden selection:bg-emerald-100 selection:text-emerald-900">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src={logo}
              alt="VSU NCS Logo"
              height={40}
              width={40}
              className="w-10 h-10 object-contain"
            />
            <span className="hidden md:block font-bold text-lg tracking-tight">
              VSU NCS
            </span>
          </div>
          <nav className="flex items-center gap-4">
            <ThemeSwitcher />
            <Link href="/auth/login">
              <Button
                variant="default"
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium shadow-lg shadow-emerald-600/20 transition-all hover:scale-105"
              >
                Log In
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1">
        <section className="relative py-20 lg:py-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-100/40 rounded-full blur-3xl opacity-50 dark:bg-emerald-900/20 animate-pulse" />
            <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-100/40 rounded-full blur-3xl opacity-50 dark:bg-blue-900/20" />
          </div>

          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-8 text-center lg:text-left animate-in slide-in-from-bottom-5 duration-700 fade-in">
                <div className="inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium bg-secondary/50 backdrop-blur-sm text-secondary-foreground">
                  <Badge
                    variant="secondary"
                    className="mr-2 rounded-full px-2 py-0.5 text-xs font-normal"
                  >
                    New
                  </Badge>
                  Official Conduct System v1.0
                </div>

                <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-balance leading-[1.1]">
                  Integrity & <br />
                  <span className=" bg-clip-text bg-linear-to-r from-emerald-600 to-blue-600">
                    Accountability
                  </span>
                </h1>

                <p className="text-lg md:text-xl text-muted-foreground text-balance max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                  The centralized platform for the Visayas State University
                  Faculty of Nursing. Transparently manage merits, demerits, and
                  student records in one secure place.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                  <Link href="/auth/login" className="w-full sm:w-auto">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto text-base h-12 px-8 bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-transform hover:-translate-y-1"
                    >
                      Get Started
                    </Button>
                  </Link>
                  <a href="#features" className="w-full sm:w-auto">
                    <Button
                      variant="outline"
                      size="lg"
                      className="w-full sm:w-auto text-base h-12 px-8 group hover:bg-secondary/50"
                    >
                      View Features
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </a>
                </div>
              </div>

              <div className="relative mx-auto w-full max-w-[500px] lg:max-w-none animate-in zoom-in-95 duration-1000 delay-150 fade-in">
                <div className="relative rounded-2xl border bg-white/50 dark:bg-card/50 backdrop-blur-xl p-8 shadow-2xl ring-1 ring-gray-900/5 dark:ring-white/10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="h-16 w-16 bg-white rounded-2xl shadow-sm flex items-center justify-center p-2">
                      <Image
                        src={logo}
                        alt="Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <h3 className="font-bold text-xl">VSU NCS</h3>
                      <p className="text-sm text-muted-foreground">
                        System Status:{" "}
                        <span className="text-emerald-600 font-medium">
                          Online
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-card shadow-xs border transition-all hover:scale-[1.02] cursor-default flex items-center gap-4">
                      <div className="p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <Users className="w-5 h-5 text-emerald-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Student Portal</p>
                        <p className="text-xs text-muted-foreground">
                          View records 24/7
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-card shadow-xs border transition-all hover:scale-[1.02] cursor-default flex items-center gap-4">
                      <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                        <ClipboardCheck className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Faculty Logging</p>
                        <p className="text-xs text-muted-foreground">
                          Automated tracking
                        </p>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-white/60 dark:bg-card shadow-xs border transition-all hover:scale-[1.02] cursor-default flex items-center gap-4">
                      <div className="p-2 bg-rose-100 dark:bg-rose-900/30 rounded-lg">
                        <ShieldCheck className="w-5 h-5 text-rose-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Admin Dashboard</p>
                        <p className="text-xs text-muted-foreground">
                          Centralized oversight
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute -top-12 -right-12 w-64 h-64 bg-emerald-400/20 rounded-full blur-3xl -z-10" />
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-secondary/30 border-y">
          <div className="container mx-auto px-6">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl font-bold tracking-tight mb-4">
                Moving Beyond Manual Tracking
              </h2>
              <p className="text-lg text-muted-foreground">
                The traditional paper-based process is time-consuming and prone
                to errors. VSU NCS digitalizes the entire workflow.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <Card className="bg-background border-none shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
                    <History className="w-6 h-6" />
                  </div>
                  <CardTitle>The Old Way</CardTitle>
                  <CardDescription>
                    Manual logbooks, lost papers, and inconsistent records.
                  </CardDescription>
                </CardHeader>
              </Card>

              <div className="flex items-center justify-center md:rotate-0 rotate-90 text-muted-foreground">
                <ArrowRight className="w-8 h-8 opacity-20" />
              </div>

              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-100 dark:border-emerald-900 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 text-emerald-600">
                    <Database className="w-6 h-6" />
                  </div>
                  <CardTitle className="text-emerald-900 dark:text-emerald-100">
                    The NCS Way
                  </CardTitle>
                  <CardDescription className="text-emerald-700/80 dark:text-emerald-300/80">
                    A single, secure digital source of truth accessible
                    anywhere.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>
        </section>

        <section id="features" className="py-24 container mx-auto px-6">
          <div className="mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Core Capabilities
            </h2>
            <div className="h-1 w-20 bg-emerald-500 rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Gavel className="w-6 h-6 text-emerald-500" />}
              title="Rule-Based Sanctioning"
              description="Automatic demerit calculations for common, pre-defined violations ensure fairness."
            />
            <FeatureCard
              icon={<Lock className="w-6 h-6 text-blue-500" />}
              title="Secure Student Portal"
              description="Students can access a read-only view of their personal conduct record 24/7."
            />
            <FeatureCard
              icon={<ShieldCheck className="w-6 h-6 text-rose-500" />}
              title="Admin Reporting"
              description="Dedicated module for reviewing serious violations that require deliberation."
            />
            <FeatureCard
              icon={<History className="w-6 h-6 text-violet-500" />}
              title="Cumulative Tracking"
              description="Real-time calculation of total demerit hours per student per semester."
            />
            <FeatureCard
              icon={<ClipboardCheck className="w-6 h-6 text-orange-500" />}
              title="Digital Logging"
              description="Faculty can log merits and demerits in seconds from any device."
            />
            <FeatureCard
              icon={<CheckCircle2 className="w-6 h-6 text-teal-500" />}
              title="Transparency"
              description="Clear audit trails for every action taken within the system."
            />
          </div>
        </section>

        <section className="py-24 border-t bg-emerald-50 dark:bg-emerald-950/10">
          <div className="container mx-auto px-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight mb-6">
              Ready to get started?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto mb-8">
              Join the Faculty of Nursing in modernizing student conduct
              management. Secure, efficient, and transparent.
            </p>
            <Link href="/auth/login">
              <Button
                size="lg"
                className="h-14 px-8 text-lg bg-emerald-600 hover:bg-emerald-700 shadow-xl shadow-emerald-600/20"
              >
                Access the Portal
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background py-12">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Image
              src={logo}
              alt="VSU Logo"
              width={32}
              height={32}
              className="opacity-80 grayscale hover:grayscale-0 transition-all"
            />
            <p className="text-sm text-muted-foreground">
              © 2025 Visayas State University
            </p>
          </div>

          <nav className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link
              href="/auth/login"
              className="hover:text-emerald-600 transition-colors"
            >
              Login
            </Link>
            <a href="#" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </a>
            <a
              href="https://vsu.edu.ph"
              target="_blank"
              rel="noreferrer"
              className="hover:text-emerald-600 transition-colors"
            >
              vsu.edu.ph
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group p-6 rounded-2xl border bg-card hover:shadow-lg hover:border-emerald-500/30 transition-all duration-300">
      <div className="mb-4 p-3 rounded-xl bg-secondary/50 w-fit group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/20 transition-colors">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
        {title}
      </h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
}