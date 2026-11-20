import { NextRequest, NextResponse } from "next/server";

const PROTECTED_ROUTES: Record<string, string[]> = {
  "/dashboard/admin": ["admin"],
  "/dashboard/vendor": ["vendor"],
  "/dashboard/customer": ["customer"],
};

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Check if route is protected
  const allowedRoles = Object.entries(PROTECTED_ROUTES).find(([route]) =>
    pathname.startsWith(route)
  )?.[1];

  if (!allowedRoles) {
    return NextResponse.next();
  }

  // Fast-path: Check for Better Auth session token cookie
  const sessionCookie =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  if (!sessionCookie) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  try {
    // Verify session via Better Auth API endpoint (runs safely in Node.js runtime)
    const sessionRes = await fetch(
      new URL("/api/auth/get-session", request.url).toString(),
      {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      }
    );

    if (!sessionRes.ok) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const session = await sessionRes.json();

    if (!session?.user) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

    const user = session.user as { role?: string; isBlocked?: boolean };

    // Disallow blocked accounts
    if (user.isBlocked) {
      return NextResponse.redirect(
        new URL("/auth/signin?error=blocked", request.url)
      );
    }

    // Role-based route authorization
    const userRole = user.role ?? "customer";
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(
        new URL(`/dashboard/${userRole}`, request.url)
      );
    }

    return NextResponse.next();
  } catch (err) {
    console.error("Middleware auth check error:", err);
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
