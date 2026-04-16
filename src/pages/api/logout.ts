export const prerender = false;

import type { APIRoute } from 'astro';

export const POST: APIRoute = ({ cookies }) => {
  cookies.delete('session', { path: '/' });
  return new Response(null, { status: 302, headers: { Location: '/login' } });
};
