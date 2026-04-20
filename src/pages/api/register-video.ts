export const prerender = false;

import type { APIRoute } from 'astro';
import { getFileJson, updateFile } from '../../lib/github';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { title, categories, url, thumb, duration } = await request.json();

    const { content: videos, sha } = await getFileJson('src/data/videos.json');
    const maxId = (videos as any[]).reduce((m, v) => Math.max(m, Number(v.id) || 0), 0);
    (videos as any[]).push({
      id: String(maxId + 1),
      title,
      categories,
      url,
      thumb: thumb ?? '/images/cross.png',
      duration: duration ?? '0:00',
    });

    await updateFile(
      'src/data/videos.json',
      JSON.stringify(videos, null, 2),
      `admin: add video "${title}"`,
      sha
    );

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('register-video failed:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
