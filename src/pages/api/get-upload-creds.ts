export const prerender = false;

import type { APIRoute } from 'astro';
import { verifySessionToken } from '../../lib/auth';

/** Returns GitHub write credentials to authenticated admins only. */
export const GET: APIRoute = async ({ cookies }) => {
  const token = cookies.get('session')?.value;
  const user  = token ? verifySessionToken(token) : null;

  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  return new Response(JSON.stringify({
    token:  import.meta.env.GITHUB_TOKEN,
    owner:  import.meta.env.GITHUB_OWNER,
    repo:   import.meta.env.GITHUB_REPO,
    branch: import.meta.env.GITHUB_BRANCH ?? 'main',
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
