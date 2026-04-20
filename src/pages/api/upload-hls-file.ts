export const prerender = false;

import type { APIRoute } from 'astro';
import { uploadBinaryFile, getFileSha } from '../../lib/github';

export const POST: APIRoute = async ({ request }) => {
  try {
    const form = await request.formData();
    const file    = form.get('file') as File | null;
    const path    = form.get('path')?.toString() ?? '';
    const message = form.get('message')?.toString() ?? 'upload: HLS file';

    if (!file || !path) {
      return new Response(JSON.stringify({ error: 'Missing file or path' }), { status: 400 });
    }

    const b64         = Buffer.from(await file.arrayBuffer()).toString('base64');
    const existingSha = await getFileSha(path);
    await uploadBinaryFile(path, b64, message, existingSha ?? undefined);

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('upload-hls-file failed:', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
};
