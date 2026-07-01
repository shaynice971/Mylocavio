import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  let user = null;
  try {
    const { data } = await supabase.auth.getUser();
    user = data.user;
  } catch {
    // Si Supabase est injoignable, on laisse passer vers les pages publiques
  }

  const { pathname } = request.nextUrl;

  // Pages d'authentification : un utilisateur déjà connecté est redirigé vers le dashboard.
  const authPaths = ["/connexion", "/inscription", "/mot-de-passe-oublie", "/reinitialiser-mot-de-passe"];
  const isAuthPath = authPaths.some((p) => pathname.startsWith(p));

  // Pages toujours publiques (accessibles connecté ou non), pas de redirection.
  const alwaysPublicPaths = ["/mentions-legales", "/confidentialite", "/cgu", "/contact"];
  const isAlwaysPublicPath =
    pathname === "/" || alwaysPublicPaths.some((p) => pathname.startsWith(p));

  const isPublicPath = isAuthPath || isAlwaysPublicPath;

  if (!user && !isPublicPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/connexion";
    return NextResponse.redirect(url);
  }

  if (user && isAuthPath) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
