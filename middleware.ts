import { NextRequest, NextResponse } from 'next/server';
import { verifySessionToken, createSessionToken, SESSION_MAX_AGE } from '@/lib/session';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // La página de login siempre es accesible
  if (pathname === '/admin/login') return NextResponse.next();

  const token = request.cookies.get('admin_token')?.value;
  const secret = process.env.ADMIN_SECRET_TOKEN;

  // Sin secreto configurado: bloquear todo el panel
  if (!secret) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  const isValid = !!token && (await verifySessionToken(token, secret));

  if (!isValid) {
    // API routes: devolver 401 en vez de redirigir a HTML
    if (pathname.startsWith('/api/admin/')) {
      return Response.json({ error: 'No autorizado' }, { status: 401 });
    }
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Sesión válida: renovar cookie en cada request (ventana deslizante de 8h)
  const response = NextResponse.next();
  const newToken = await createSessionToken(secret);
  response.cookies.set('admin_token', newToken, {
    httpOnly: true,
    path: '/',
    maxAge: SESSION_MAX_AGE,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return response;
}

export const config = {
  matcher: ['/admin/:path*', '/api/admin/:path*'],
};
