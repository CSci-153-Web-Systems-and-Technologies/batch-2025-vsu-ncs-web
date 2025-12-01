import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  const userRole = user?.app_metadata?.role;

  const loginURL = new URL("/auth/login", request.url);
  const unauthorized = new URL("/unauthorized", request.url);
  const studentDashBoard = new URL("/protected/student/dashboard", request.url);
  const facultyDashBoard = new URL("/protected/faculty/dashboard", request.url);
  const adminDashBoard = new URL("/protected/admin/dashboard", request.url);

  if (user && pathname === "/auth/login") {
    if (userRole === "student") return NextResponse.redirect(studentDashBoard);
    if (userRole === "faculty") return NextResponse.redirect(facultyDashBoard);
    if (userRole === "admin") return NextResponse.redirect(adminDashBoard);
  }

  if (pathname.startsWith("/protected/student")) {
    if (!user) return NextResponse.redirect(loginURL);
    if (userRole != "student") return NextResponse.redirect(unauthorized);
  }

  if (pathname.startsWith("/protected/faculty")) {
    if (!user) return NextResponse.redirect(loginURL);
    if (userRole != "faculty") return NextResponse.redirect(unauthorized);
  }

  if (pathname.startsWith("/protected/admin")) {
    if (!user) return NextResponse.redirect(loginURL);
    if (userRole != "admin") return NextResponse.redirect(unauthorized);
  }

  if (pathname.startsWith("/records")) {
    if (!user) return NextResponse.redirect(loginURL);
    if (userRole == "student") return NextResponse.redirect(unauthorized);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - images - .svg, .png, .jpg, .jpeg, .gif, .webp
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
