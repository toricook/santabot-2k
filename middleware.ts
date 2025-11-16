import { NextResponse } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";

const publicRouteMatchers = [
  /^\/$/,
  /^\/login(?:\/.*)?$/,
  /^\/register(?:\/.*)?$/,
  /^\/join(?:\/.*)?$/,
  /^\/\.well-known(?:\/.*)?$/,
];

export const config = {
  matcher: ["/((?!_next|.*\\..*).*)", "/"],
};

export default clerkMiddleware(async (auth, request) => {
  const pathname = request.nextUrl.pathname;
  const isPublic = publicRouteMatchers.some((matcher) => matcher.test(pathname));
  const session = await auth();

  if (isPublic) {
    console.log(
      "[proxy] public route",
      pathname,
      "userId:",
      session.userId ?? "none",
    );
    return NextResponse.next();
  }

  if (!session.userId) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect_url", request.url);
    console.log("[proxy] protected route", pathname, "redirecting to", loginUrl.toString());
    return NextResponse.redirect(loginUrl);
  }

  console.log("[proxy] protected route", pathname, "userId:", session.userId);
  return NextResponse.next();
});
