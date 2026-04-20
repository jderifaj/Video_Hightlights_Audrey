<script>
  // Status: idle | loading-ffmpeg | converting | uploading | registering | done | error
  let status   = 'idle';
  let progress = 0;
  let message  = '';
  let errorMsg = '';

  let title      = '';
  let categories = '';
  let videoFile  = null;
  let thumbFile  = null;

  function slugify(s) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function formatDuration(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }

  function getVideoDuration(file) {
    return new Promise((resolve) => {
      const url = URL.createObjectURL(file);
      const vid = document.createElement('video');
      vid.preload = 'metadata';
      vid.onloadedmetadata = () => { URL.revokeObjectURL(url); resolve(vid.duration); };
      vid.onerror          = () => { URL.revokeObjectURL(url); resolve(0); };
      vid.src = url;
    });
  }

  // Fetches a remote URL and returns a local blob URL — keeps WASM off Vite's bundle
  async function toBlobURL(url, mimeType) {
    const buf  = await fetch(url).then(r => r.arrayBuffer());
    const blob = new Blob([buf], { type: mimeType });
    return URL.createObjectURL(blob);
  }

  // Reads a File into a Uint8Array for ffmpeg.writeFile()
  async function fetchFile(file) {
    return new Uint8Array(await file.arrayBuffer());
  }

  async function uploadFileToGitHub(blob, path, commitMessage) {
    const form = new FormData();
    form.append('file', new File([blob], path.split('/').pop()));
    form.append('path', path);
    form.append('message', commitMessage);
    const res = await fetch('/api/upload-hls-file', { method: 'POST', body: form });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error ?? `Upload failed (${res.status})`);
    }
  }

  async function handleSubmit() {
    if (!videoFile || !title.trim()) return;

    try {
      const slug = slugify(title.trim());
      const cats = categories.split(',').map(c => c.trim()).filter(Boolean);

      // ── 1. Load ffmpeg-wasm from CDN (bypasses Vite bundling) ────────────
      status   = 'loading-ffmpeg';
      progress = 0;
      message  = 'Loading FFmpeg…';

      // vite-ignore prevents Vite from trying to resolve this CDN URL at build time
      const { FFmpeg } = await import(/* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/esm/index.js');

      const ffmpeg = new FFmpeg();
      const base   = 'https://cdn.jsdelivr.net/npm/@ffmpeg/core@0.12.6/dist/umd';

      await ffmpeg.load({
        coreURL: await toBlobURL(`${base}/ffmpeg-core.js`,   'text/javascript'),
        wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
      });

      // ── 2. Convert to HLS ────────────────────────────────────────────────
      status  = 'converting';
      message = 'Converting to HLS… (this may take a minute)';

      ffmpeg.on('progress', ({ progress: p }) => { progress = Math.round(p * 100); });

      await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
      await ffmpeg.exec([
        '-i',    'input.mp4',
        '-c:v',  'libx264',
        '-preset', 'ultrafast',
        '-crf',  '28',
        '-c:a',  'aac',
        '-b:a',  '128k',
        '-hls_time',             '4',
        '-hls_list_size',        '0',
        '-hls_segment_filename', 'seg%03d.ts',
        'index.m3u8',
      ]);

      const dir      = await ffmpeg.listDir('/');
      const hlsFiles = dir.filter(e => !e.isDir && (e.name.endsWith('.m3u8') || e.name.endsWith('.ts')));

      // ── 3. Detect duration ───────────────────────────────────────────────
      const duration = formatDuration(await getVideoDuration(videoFile));

      // ── 4. Upload HLS files ──────────────────────────────────────────────
      status   = 'uploading';
      progress = 0;
      message  = `Uploading ${hlsFiles.length} HLS file(s) to GitHub…`;

      for (let i = 0; i < hlsFiles.length; i++) {
        const { name } = hlsFiles[i];
        message  = `Uploading ${name} (${i + 1} / ${hlsFiles.length})…`;
        progress = Math.round((i / hlsFiles.length) * 100);
        await uploadFileToGitHub(await ffmpeg.readFile(name), `public/videos/${slug}/${name}`, `upload: HLS ${name} for "${title}"`);
      }
      progress = 100;

      // ── 5. Upload thumbnail ──────────────────────────────────────────────
      let thumb = '/images/cross.png';
      if (thumbFile) {
        message = 'Uploading thumbnail…';
        const ext = thumbFile.name.split('.').pop() || 'jpg';
        await uploadFileToGitHub(thumbFile, `public/images/${slug}-thumb.${ext}`, `upload: thumbnail for "${title}"`);
        thumb = `/images/${slug}-thumb.${ext}`;
      }

      // ── 6. Register in videos.json ───────────────────────────────────────
      status  = 'registering';
      message = 'Saving to videos.json…';
      progress = 0;

      const res = await fetch('/api/register-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), categories: cats, url: `/videos/${slug}/index.m3u8`, thumb, duration }),
      });
      if (!res.ok) throw new Error('Failed to register video in videos.json');

      status  = 'done';
      message = `"${title}" uploaded! Netlify will rebuild in ~2 min.`;

    } catch (err) {
      status   = 'error';
      errorMsg = err.message ?? String(err);
    }
  }

  function reset() {
    status = 'idle'; progress = 0; message = ''; errorMsg = '';
    title = ''; categories = ''; videoFile = null; thumbFile = null;
  }

  $: busy = status !== 'idle' && status !== 'done' && status !== 'error';
</script>

{#if status === 'done'}
  <div class="alert-ok">
    ✓ {message}
    <button class="btn-link" on:click={reset}>Add another</button>
  </div>
{:else if status === 'error'}
  <div class="alert-err">
    ✗ {errorMsg}
    <button class="btn-link" on:click={reset}>Try again</button>
  </div>
{:else}
  <form on:submit|preventDefault={handleSubmit}>
    <div class="form-grid">

      <div class="field full-width">
        <label for="vu-title">Title</label>
        <input id="vu-title" type="text" bind:value={title} placeholder="Nice Through Ball" required disabled={busy} />
      </div>

      <div class="field full-width">
        <label for="vu-cats">Categories</label>
        <input id="vu-cats" type="text" bind:value={categories} placeholder="passing, hustle" disabled={busy} />
        <p class="hint">Comma-separated. Filter buttons appear automatically.</p>
      </div>

      <div class="field full-width">
        <label for="vu-video">Video File</label>
        <input id="vu-video" type="file" accept="video/*" required disabled={busy}
          on:change={e => videoFile = e.target.files[0]} />
        <p class="hint">MP4 recommended. Converted to HLS in your browser — no server upload size limit.</p>
      </div>

      <div class="field full-width">
        <label for="vu-thumb">Thumbnail <span class="optional">(optional)</span></label>
        <input id="vu-thumb" type="file" accept="image/*" disabled={busy}
          on:change={e => thumbFile = e.target.files[0]} />
        <p class="hint">JPG or PNG, under 7 MB.</p>
      </div>

    </div>

    {#if busy}
      <div class="progress-wrap">
        <p class="progress-msg">{message}</p>
        <div class="progress-bar"><div class="progress-fill" style="width:{progress}%"></div></div>
        <p class="progress-pct">{progress}%</p>
      </div>
    {/if}

    <button type="submit" class="btn-primary" style="margin-top:1rem" disabled={busy}>
      {busy ? 'Working…' : 'Convert & Upload to GitHub'}
    </button>
  </form>
{/if}

<style>
  .optional      { font-size: 0.75rem; color: #475569; font-weight: 400; }
  .progress-wrap { margin-top: 1rem; }
  .progress-msg  { font-size: 0.82rem; color: #94a3b8; margin-bottom: 0.4rem; }
  .progress-bar  { height: 6px; background: rgba(255,255,255,0.08); border-radius: 3px; overflow: hidden; }
  .progress-fill { height: 100%; background: #3b82f6; border-radius: 3px; transition: width 0.3s ease; }
  .progress-pct  { font-size: 0.75rem; color: #475569; margin-top: 0.25rem; text-align: right; }
  .alert-ok      { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
                   color: #86efac; padding: 0.75rem 1rem; border-radius: 0.5rem;
                   font-size: 0.875rem; display: flex; align-items: center; gap: 1rem; }
  .alert-err     { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
                   color: #fca5a5; padding: 0.75rem 1rem; border-radius: 0.5rem;
                   font-size: 0.875rem; display: flex; align-items: center; gap: 1rem; }
  .btn-link      { background: none; border: none; color: inherit; text-decoration: underline;
                   cursor: pointer; padding: 0; font-size: inherit; opacity: 0.8; }
  .btn-link:hover { opacity: 1; }
</style>
