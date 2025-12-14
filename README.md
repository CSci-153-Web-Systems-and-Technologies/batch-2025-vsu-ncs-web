# VSU NCS (Nursing Conduct System)

A digital platform designed for the Visayas State University Faculty of Nursing to transparently manage student merit and demerit records. Developed as a final project for the Web Systems and Technologies course, this application digitalizes the traditional logbook system to ensure data integrity, accessibility, and real-time tracking of student conduct.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Environment](#environment)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)
- [Acknowledgments](#acknowledgments)

## Features

### For Students

- **Digital Conduct Record:** View personal history of merits, demerits, and infractions 24/7.
- **Real-time Notifications:** Receive automated emails via Google SMTP with nodemailer when a new record is logged.
- **Secure Access:** Personal dashboard protected by role-based authentication.
- **Transparency:** View details of reported "Serious Infractions" and their resolutions.

### For Faculty

- **Efficient Logging:** Quickly file merits or demerits using a streamlined digital form.
- **Student Directory:** Access a searchable list of nursing students.
- **Serious Infraction Reporting:** Escalate severe violations directly to administration for review.
- **Mobile Responsive:** Log records on-the-go using mobile devices or tablets.

### For Admins

- **User Management:** Manually create and manage accounts for Students and Faculty.
- **Infraction Review Queue:** Dedicated interface to review and resolve serious infractions.
- **Data Visualization:** Dashboard with charts to track trends and severity ratios (desktop optimized).
- **System Oversight:** Full control over conduct records and user data.

## System Capabilities

- **Role-Based Access Control (RBAC):** Separation of privileges between Students, Faculty, and Admins.
- **Automated Onboarding:** New users receive welcome emails with temporary credentials.
- **Force Password Change:** Enforced on first login for security.
- **Responsive Design:** UI adapts across devices.

## Tech Stack

- Frontend: Next.js 16 (App Router), React 18, TypeScript
- Backend: Supabase (PostgreSQL, Auth, Real-time)
- Styling: Tailwind CSS with shadcn/ui components
- Email: Google SMTP (nodemailer)
- State Management: React Server Actions (no client-side global state store)
- Deployment: Vercel

## Prerequisites

Before you begin, ensure you have:

- Node.js 18+
- A Supabase account and project
- A Google account (for emails)
- Git installed

## Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/your-username/vsu-ncs.git
cd vsu-ncs
npm install
# or
pnpm install
```

## Environment

Create a `.env.local` file in the project root and add the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_for_admin_actions
GMAIL_APP_PASSWORD=your_google_app_password
```

## Database Setup

Run the following SQL in your Supabase SQL editor to create the core tables and policies.

```sql
-- Profiles & Roles
CREATE TABLE student_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  student_id TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  year_level INTEGER,
  sex TEXT
);

CREATE TABLE staff_profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  employee_id TEXT UNIQUE NOT NULL,
  role TEXT CHECK (role IN ('faculty', 'admin')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT
);

-- Conduct Reports
CREATE TABLE conduct_reports (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  student_id UUID REFERENCES auth.users(id) NOT NULL,
  faculty_id UUID REFERENCES auth.users(id) NOT NULL,
  type TEXT CHECK (type IN ('merit', 'demerit')),
  is_serious_infraction BOOLEAN DEFAULT false,
  description TEXT NOT NULL,
  sanction_days INTEGER DEFAULT 0,
  sanction_context TEXT
);

-- Enable Row Level Security
ALTER TABLE conduct_reports ENABLE ROW LEVEL SECURITY;

-- Policies (Simplified)
CREATE POLICY "Students view own" ON conduct_reports
  FOR SELECT USING (auth.uid() = student_id);

CREATE POLICY "Staff view all" ON conduct_reports
  FOR SELECT USING (EXISTS (SELECT 1 FROM staff_profiles WHERE id = auth.uid()));

```

## Running the Application

Start the development server:

```bash
npm run dev
```

Open your browser at `http://localhost:3000`.

## Usage

### Initial Setup

The first user must be created via the Supabase Dashboard (Auth) or SQL to establish an Admin account. Log in as Admin to access administrative tools.

### Administrative Workflow

- Create Accounts from Student/Faculty Management pages.
- Onboarding emails are sent automatically with temporary passwords.

### Faculty Workflow

- Log in, search for a student, and file a merit or demerit.
- Check "Serious Infraction" to flag reports for Admin review.

### Student Workflow

- Log in to view personal records and history.

## Project Structure

```
vsu-ncs/
├── app/                  # Next.js App Router
│   ├── (auth)/           # Login, Forgot Password, Reset Password
│   ├── (public)/         # Landing page
│   ├── protected/        # Role-protected routes (Admin/Faculty/Student)
│   ├── assets/           # Static images/logos
│   └── layout.tsx        # Root layout with ThemeProvider
├── components/           # Reusable UI components
│   ├── ui/               # shadcn/ui components (Button, Card, Sidebar)
│   ├── app-sidebar.tsx   # Main navigation logic
│   └── ...               # Custom components
├── lib/                  # Utilities
│   ├── supabase/         # Client & Server Supabase clients
│   └── actions/          # Server Actions (Auth, Data Mutation)
├── types/                # TypeScript definitions
└── public/               # Public assets
```

## Deployment

Deploy to Vercel:

1. Push code to GitHub/GitLab.
2. Import the project into Vercel.
3. Add environment variables in Vercel project settings (same keys as `.env.local`).

Vercel will provide `VERCEL_URL` for production redirects.

## Contributing

This is a university project for Web Systems and Technologies. Contributions are welcome via forks and pull requests.

Basic workflow:

```bash
git checkout -b feature/AmazingFeature
git commit -m "Add some AmazingFeature"
git push origin feature/AmazingFeature
```

Open a Pull Request for review.

## License

This project is licensed under the MIT License.

## Acknowledgments

- Visayas State University — For the academic opportunity
- shadcn/ui — Accessible component library
- Supabase — Backend infrastructure
- Goodle SMTP (nodemailer) — Email delivery

VSU NCS — Integrity & Accountability