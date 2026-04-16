export const prerender = false;

import type { APIRoute } from 'astro';
import { getFileJson, updateFile, uploadBinaryFile, getFileSha } from '../../lib/github';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();

    const title      = form.get('title')?.toString() ?? '';
    const categories = (form.get('categories')?.toString() ?? '')
      .split(',').map(c => c.trim()).filter(Boolean);
    const videoFile  = form.get('videoFilename')?.toString() ?? '';
    const thumbFile  = form.get('thumbnail') as File | null;

    // Build the video URL from the filename the admin entered
    const url = videoFile.startsWith('/') ? videoFile : `/videos/${videoFile}`;

    // Upload thumbnail if a file was provided
    let thumb = form.get('thumbUrl')?.toString() ?? '/images/cross.png';
    if (thumbFile && thumbFile.size > 0) {
      const ext      = thumbFile.name.split('.').pop() ?? 'jpg';
      const slug     = title.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const gitPath  = `public/images/${slug}-thumb.${ext}`;
      const buf      = await thumbFile.arrayBuffer();
      const b64      = Buffer.from(buf).toString('base64');
      const existing = await getFileSha(gitPath);
      await uploadBinaryFile(gitPath, b64, `admin: add thumbnail for "${title}"`, existing ?? undefined);
      thumb = `/images/${slug}-thumb.${ext}`;
    }

    // Append to videos.json
    const { content: videos, sha } = await getFileJson('src/data/videos.json');
    const maxId = (videos as any[]).reduce((m, v) => Math.max(m, Number(v.id) || 0), 0);
    (videos as any[]).push({ id: String(maxId + 1), title, categories, url, thumb, duration: '0:00' });

    await updateFile(
      'src/data/videos.json',
      JSON.stringify(videos, null, 2),
      `admin: add video "${title}"`,
      sha
    );

    return new Response(null, { status: 302, headers: { Location: '/admin/videos?success=1' } });
  } catch (err) {
    console.error('add-video failed:', err);
    return new Response(null, { status: 302, headers: { Location: '/admin/videos?error=1' } });
  }
};
