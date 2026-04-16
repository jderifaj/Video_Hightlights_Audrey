export const prerender = false;

import type { APIRoute } from 'astro';
import { createSessionToken, isValidCredentials } from '../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const form = await request.formData();
  const username = form.get('username')?.toString() ?? '';
  const password = form.get('password')?.toString() ?? '';

  if (!isValidCredentials(username, password)) {
    return new Response(null, { status: 302, headers: { Location: '/login?error=1' } });
  }

  const token = createSessionToken(username);
  cookies.set('session', token, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24,
  });

  return new Response(null, { status: 302, headers: { Location: '/admin' } });
};
