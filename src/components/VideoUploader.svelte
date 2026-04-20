<script>
  let status   = 'idle'; // idle | uploading | done | error
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

  // Encode a File/Blob to base64 in the browser (chunked to avoid stack overflow)
  async function fileToBase64(file) {
    const buf   = await file.arrayBuffer();
    const bytes = new Uint8Array(buf);
    let binary  = '';
    const CHUNK = 8192;
    for (let i = 0; i < bytes.length; i += CHUNK) {
      binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
    }
    return btoa(binary);
  }

  // PUT a file directly to GitHub from the browser (bypasses Netlify's 6 MB function limit)
  async function githubPut(path, base64Content, commitMessage, creds) {
    const url = `https://api.github.com/repos/${creds.owner}/${creds.repo}/contents/${path}`;

    // Check for existing SHA (needed to overwrite)
    let sha;
    const check = await fetch(`${url}?ref=${creds.branch}`, {
      headers: { Authorization: `Bearer ${creds.token}`, 'X-GitHub-Api-Version': '2022-11-28' },
    });
    if (check.ok) sha = (await check.json()).sha;

    const body = { message: commitMessage, content: base64Content, branch: creds.branch };
    if (sha) body.sha = sha;

    const res = await fetch(url, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${creds.token}`,
        'Content-Type': 'application/json',
        Accept: 'application/vnd.github.v3+json',
        'X-GitHub-Api-Version': '2022-11-28',
      },
      body: JSON.stringify(body),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(`GitHub upload failed (${res.status}): ${err.message ?? path}`);
    }
  }

  // Small files (thumbnails) go through the existing Netlify API endpoint
  async function uploadThumbnail(file, path, commitMessage) {
    const form = new FormData();
    form.append('file', file);
    form.append('path', path);
    form.append('message', commitMessage);
    const res = await fetch('/api/upload-hls-file', { method: 'POST', body: form });
    if (!res.ok) {
      const { error } = await res.json().catch(() => ({}));
      throw new Error(error ?? `Thumbnail upload failed (${res.status})`);
    }
  }

  async function handleSubmit() {
    if (!videoFile || !title.trim()) return;

    try {
      const slug = slugify(title.trim());
      const cats = categories.split(',').map(c => c.trim()).filter(Boolean);

      status   = 'uploading';
      progress = 0;
      message  = 'Authenticating…';

      // Get GitHub credentials from the authenticated API endpoint
      const credsRes = await fetch('/api/get-upload-creds');
      if (!credsRes.ok) throw new Error('Could not retrieve upload credentials — are you logged in?');
      const creds = await credsRes.json();

      // ── Thumbnail ─────────────────────────────────────────────────────────
      let thumb = '/images/cross.png';
      if (thumbFile) {
        message  = 'Uploading thumbnail…';
        progress = 10;
        const ext = thumbFile.name.split('.').pop() || 'jpg';
        await uploadThumbnail(thumbFile, `public/images/${slug}-thumb.${ext}`, `upload: thumbnail for "${title}"`);
        thumb = `/images/${slug}-thumb.${ext}`;
      }

      // ── Metadata JSON (tiny, goes via browser→GitHub directly) ───────────
      message  = 'Uploading metadata…';
      progress = 20;
      const meta = { title: title.trim(), categories: cats, thumb };
      await githubPut(
        `public/raw-videos/${slug}.json`,
        btoa(JSON.stringify(meta)),
        `upload: metadata for "${title}"`,
        creds
      );

      // ── Raw video (large — uploaded directly from browser to GitHub) ──────
      message  = 'Encoding video for upload…';
      progress = 30;
      const videoBase64 = await fileToBase64(videoFile);

      message  = 'Uploading video to GitHub… (may take 30–60 s)';
      progress = 40;
      await githubPut(
        `public/raw-videos/${slug}.mp4`,
        videoBase64,
        `upload: raw video for "${title}"`,
        creds
      );

      progress = 100;
      status   = 'done';
      message  = `"${title}" uploaded! A GitHub Action will convert it to HLS. Video will appear on site in ~5 minutes.`;

    } catch (err) {
      status   = 'error';
      errorMsg = err.message ?? String(err);
    }
  }

  function reset() {
    status = 'idle'; progress = 0; message = ''; errorMsg = '';
    title = ''; categories = ''; videoFile = null; thumbFile = null;
  }

  $: busy = status === 'uploading';
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
        <input id="vu-title" type="text" bind:value={title}
          placeholder="Nice Through Ball" required disabled={busy} />
      </div>

      <div class="field full-width">
        <label for="vu-cats">Categories</label>
        <input id="vu-cats" type="text" bind:value={categories}
          placeholder="passing, hustle" disabled={busy} />
        <p class="hint">Comma-separated. Filter buttons appear automatically.</p>
      </div>

      <div class="field full-width">
        <label for="vu-video">Video File</label>
        <input id="vu-video" type="file" accept="video/*" required disabled={busy}
          on:change={e => videoFile = e.target.files[0]} />
        <p class="hint">MP4 recommended. Uploaded raw — a GitHub Action converts it to HLS automatically.</p>
      </div>

      <div class="field full-width">
        <label for="vu-thumb">Thumbnail <span class="optional">(optional)</span></label>
        <input id="vu-thumb" type="file" accept="image/*" disabled={busy}
          on:change={e => thumbFile = e.target.files[0]} />
        <p class="hint">JPG or PNG, under 6 MB.</p>
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
      {busy ? 'Uploading…' : 'Upload Video'}
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
  .alert-ok  { background: rgba(34,197,94,0.1); border: 1px solid rgba(34,197,94,0.25);
               color: #86efac; padding: 0.75rem 1rem; border-radius: 0.5rem;
               font-size: 0.875rem; display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
  .alert-err { background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.25);
               color: #fca5a5; padding: 0.75rem 1rem; border-radius: 0.5rem;
               font-size: 0.875rem; display: flex; align-items: center; gap: 1rem; }
  .btn-link      { background: none; border: none; color: inherit; text-decoration: underline;
                   cursor: pointer; padding: 0; font-size: inherit; opacity: 0.8; }
  .btn-link:hover { opacity: 1; }
</style>
