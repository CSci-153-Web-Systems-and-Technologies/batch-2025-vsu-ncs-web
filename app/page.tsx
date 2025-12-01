"use client";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import logo from "./assets/logo.png";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Users,
  ClipboardCheck,
  ShieldCheck,
  Database,
} from "lucide-react";

export default function HomePage() {
  const year = new Date().getFullYear();

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <header className="bg-white/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <Image src={logo} alt="VSU NCS" height={48} width={48} />
          <h1 className="text-lg font-semibold">VSU Nursing Conduct System</h1>
          <nav className="ml-auto">
            <Link href="/auth/login">
              <Button>Login</Button>
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-6">
        {/* Hero */}
        <section className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <Badge>Official</Badge>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">
              VSU Nursing Conduct System (VSU NCS)
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl">
              A centralized platform for the Visayas State University Faculty of
              Nursing to transparently and efficiently manage student merits and
              demerits.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/auth/login">
                <Button size="lg">Login</Button>
              </Link>
              <a href="#features" className="inline-flex items-center">
                <Button variant="ghost" size="lg">
                  Learn more <ArrowRight className="ml-2" />
                </Button>
              </a>
            </div>
          </div>

          <div>
            <div className="rounded-2xl bg-linear-to-tr from-sky-50 to-white p-8 shadow-lg">
              <div className="flex items-center gap-4">
                <Image src={logo} alt="VSU NCS logo" width={120} height={120} />
                <div>
                  <h3 className="text-lg font-semibold">Why VSU NCS</h3>
                  <p className="text-sm text-muted-foreground max-w-md">
                    Secure, transparent, and efficient management of student
                    conduct records across the College of Nursing.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white/60 shadow-sm">
                    <Users className="size-5 text-sky-600" />
                  </div>
                  <div>
                    <p className="font-medium">Students</p>
                    <p className="text-sm text-muted-foreground">
                      View your full conduct history and cumulative demerit
                      hours anytime.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white/60 shadow-sm">
                    <ClipboardCheck className="size-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Faculty</p>
                    <p className="text-sm text-muted-foreground">
                      Log merits and demerits quickly and access a student
                      conduct history.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white/60 shadow-sm">
                    <ShieldCheck className="size-5 text-rose-600" />
                  </div>
                  <div>
                    <p className="font-medium">Administrators</p>
                    <p className="text-sm text-muted-foreground">
                      Oversee reports, manage accounts, and review serious
                      infractions centrally.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-md bg-white/60 shadow-sm">
                    <Database className="size-5 text-violet-600" />
                  </div>
                  <div>
                    <p className="font-medium">Reliable Data</p>
                    <p className="text-sm text-muted-foreground">
                      A single source of truth for student conduct with
                      role-based access.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Problem & Solution */}
        <section id="problem" className="max-w-6xl w-full mt-12">
          <h3 className="text-2xl font-semibold">
            Moving Beyond Manual Tracking
          </h3>
          <p className="mt-2 text-muted-foreground">
            The traditional manual process for tracking student conduct is
            time-consuming, prone to inconsistencies, and lacks a transparent,
            centralized record. This creates inefficiencies for faculty and a
            lack of clarity for students.
          </p>

          <h4 className="mt-6 text-xl font-semibold">
            A Clear, Centralized, and Efficient Solution
          </h4>
          <p className="mt-2 text-muted-foreground">
            VSU NCS digitalizes the entire merit and demerit process. It
            provides a secure, single source of truth for student conduct,
            ensuring consistency, accountability, and transparency for everyone
            in the College of Nursing.
          </p>
        </section>

        {/* Benefits by Role */}
        <section
          id="benefits"
          className="max-w-6xl w-full mt-12 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <h3 className="col-span-3 text-2xl font-semibold">
            A System Designed for Everyone
          </h3>

          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Full Transparency of Your Record
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Securely log in to your personal portal to view your complete
                merit and demerit history, see your current cumulative demerit
                hours, and understand the details of any infractions and their
                corresponding sanctions.
              </p>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Streamline Your Workflow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Easily and securely log student merits and demerits. View a
                student&apos;s complete conduct history, utilize an automated
                system for common violations, and report serious infractions
                directly to administrators, all in one place.
              </p>
            </CardContent>
          </Card>

          <Card className="p-4">
            <CardHeader>
              <CardTitle className="text-lg">
                Manage with Clarity and Oversight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Access a centralized dashboard to review all reports for serious
                infractions, manage faculty accounts, and view comprehensive
                data and student records for the entire student body.
              </p>
            </CardContent>
          </Card>
        </section>

        {/* Core Features */}
        <section id="features" className="max-w-6xl w-full mt-12">
          <h3 className="text-2xl font-semibold">Core Features</h3>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-5">
            <li>
              <strong>Digital Merit/Demerit Logging:</strong> A simple web
              interface for faculty to log student conduct.
            </li>
            <li>
              <strong>Rule-Based Sanctioning:</strong> Automatic demerit
              assignments for common, pre-defined violations.
            </li>
            <li>
              <strong>Secure Student Portal:</strong> A read-only view for
              students to access their personal conduct records 24/7.
            </li>
            <li>
              <strong>Admin Reporting Module:</strong> A dedicated system for
              reporting and reviewing serious violations that require
              deliberation.
            </li>
            <li>
              <strong>Cumulative Tracking:</strong> Real-time calculation and
              display of total demerit hours per student, per semester.
            </li>
          </ul>
        </section>
      </main>

      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
          <p>© {year} Visayas State University</p>
          <nav className="flex gap-4">
            <Link href="/auth/login">Login</Link>
            <a href="https://vsu.edu.ph" target="_blank" rel="noreferrer">
              vsu.edu.ph
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
