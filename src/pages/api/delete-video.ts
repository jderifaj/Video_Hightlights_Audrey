export const prerender = false;

import type { APIRoute } from 'astro';
import { getFileJson, updateFile } from '../../lib/github';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const id   = form.get('id')?.toString();

    const { content: videos, sha } = await getFileJson('src/data/videos.json');
    const filtered = (videos as any[]).filter(v => v.id !== id);

    await updateFile(
      'src/data/videos.json',
      JSON.stringify(filtered, null, 2),
      `admin: remove video id=${id}`,
      sha
    );

    return new Response(null, { status: 302, headers: { Location: '/admin/videos?success=1' } });
  } catch (err) {
    console.error('delete-video failed:', err);
    return new Response(null, { status: 302, headers: { Location: '/admin/videos?error=1' } });
  }
};
