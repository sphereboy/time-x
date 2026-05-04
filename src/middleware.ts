import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/compare\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  const parts = slug.split("-vs-");
  if (parts.length !== 2) return NextResponse.next();

  const [a, b] = parts;
  if (a === b) return NextResponse.next();
  if (a < b) return NextResponse.next();

  const canonical = `/compare/${b}-vs-${a}`;
  const url = request.nextUrl.clone();
  url.pathname = canonical;
  return NextResponse.redirect(url, 301);
}

export const config = {
  matcher: ["/compare/:slug"],
};
