#!/usr/bin/env node
/**
 * Converts a local video to HLS with FFmpeg, uploads the segments to GitHub,
 * and adds the entry to videos.json — triggering a Netlify rebuild.
 *
 * Usage:
 *   node scripts/upload-video.mjs <video.mp4> --title "My Title" --categories "cat1,cat2" [--thumb thumb.jpg]
 *
 * Requires FFmpeg: brew install ffmpeg
 */

import { execSync, spawnSync } from 'child_process';
import { readFileSync, mkdirSync, rmSync, readdirSync, existsSync } from 'fs';
import { join, resolve, extname, dirname } from 'path';
import { tmpdir } from 'os';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, '..');

// ── .env parser ──────────────────────────────────────────────────────────────

function loadEnv() {
  const envFile = join(ROOT, '.env');
  if (!existsSync(envFile)) throw new Error('.env not found at ' + envFile);
  return Object.fromEntries(
    readFileSync(envFile, 'utf8')
      .split('\n')
      .map(l => l.trim())
      .filter(l => l && !l.startsWith('#') && l.includes('='))
      .map(l => {
        const idx = l.indexOf('=');
        return [l.slice(0, idx).trim(), l.slice(idx + 1).trim().replace(/^["']|["']$/g, '')];
      })
  );
}

// ── CLI arg parser ────────────────────────────────────────────────────────────

function parseArgs(argv) {
  const positional = [];
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      flags[argv[i].slice(2)] = argv[i + 1] ?? '';
      i++;
    } else {
      positional.push(argv[i]);
    }
  }
  return { positional, ...flags };
}

// ── GitHub API helpers ────────────────────────────────────────────────────────

function ghHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

async function getFileSha(path, cfg) {
  const res = await fetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
    { headers: ghHeaders(cfg.token) }
  );
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub SHA check failed for ${path}: ${res.status}`);
  return (await res.json()).sha ?? null;
}

async function uploadFile(path, base64Content, message, cfg) {
  const sha = await getFileSha(path, cfg);
  const body = { message, content: base64Content, branch: cfg.branch };
  if (sha) body.sha = sha;
  const res = await fetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
    { method: 'PUT', headers: ghHeaders(cfg.token), body: JSON.stringify(body) }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub upload ${path} failed: ${res.status} — ${err.message ?? ''}`);
  }
}

async function getFileJson(path, cfg) {
  const res = await fetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}?ref=${cfg.branch}`,
    { headers: ghHeaders(cfg.token) }
  );
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  const data = await res.json();
  return {
    content: JSON.parse(Buffer.from(data.content, 'base64').toString('utf8')),
    sha: data.sha,
  };
}

async function putFileJson(path, content, message, sha, cfg) {
  const res = await fetch(
    `https://api.github.com/repos/${cfg.owner}/${cfg.repo}/contents/${path}`,
    {
      method: 'PUT',
      headers: ghHeaders(cfg.token),
      body: JSON.stringify({
        message,
        content: Buffer.from(JSON.stringify(content, null, 2), 'utf8').toString('base64'),
        sha,
        branch: cfg.branch,
      }),
    }
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub PUT ${path} failed: ${res.status} — ${err.message ?? ''}`);
  }
}

// ── Duration via ffprobe ──────────────────────────────────────────────────────

function probeDuration(videoPath) {
  const r = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', videoPath],
    { encoding: 'utf8' }
  );
  const secs = parseFloat(r.stdout?.trim());
  if (isNaN(secs)) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const inputFile = args.positional[0];
  const title = args.title;
  const categories = (args.categories ?? '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean);
  const thumbArg = args.thumb ?? null;

  if (!inputFile || !title) {
    console.error(
      'Usage: node scripts/upload-video.mjs <video.mp4> --title "Title" --categories "cat1,cat2" [--thumb thumb.jpg]'
    );
    process.exit(1);
  }

  const videoPath = resolve(inputFile);
  if (!existsSync(videoPath)) {
    console.error(`Video not found: ${videoPath}`);
    process.exit(1);
  }

  // Verify FFmpeg is available
  if (spawnSync('ffmpeg', ['-version'], { encoding: 'utf8' }).error) {
    console.error('FFmpeg not found. Install it with: brew install ffmpeg');
    process.exit(1);
  }

  const env = loadEnv();
  const cfg = {
    token: env.GITHUB_TOKEN,
    owner: env.GITHUB_OWNER,
    repo: env.GITHUB_REPO,
    branch: env.GITHUB_BRANCH ?? 'main',
  };

  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const tempDir = join(tmpdir(), `hls-${slug}-${Date.now()}`);
  mkdirSync(tempDir, { recursive: true });

  try {
    // 1. Convert to HLS
    console.log(`\nConverting "${title}" to HLS…`);
    execSync(
      [
        'ffmpeg',
        '-i', `"${videoPath}"`,
        '-c:v libx264',
        '-preset fast',
        '-crf 23',
        '-c:a aac',
        '-b:a 128k',
        '-hls_time 6',
        '-hls_list_size 0',
        `-hls_segment_filename "${join(tempDir, 'seg%03d.ts')}"`,
        `"${join(tempDir, 'index.m3u8')}"`,
        '-y',
      ].join(' '),
      { stdio: 'inherit' }
    );

    // 2. Detect duration
    const duration = probeDuration(videoPath);
    console.log(`\nDuration: ${duration}`);

    // 3. Upload HLS segments + playlist
    const hlsFiles = readdirSync(tempDir)
      .filter(f => f.endsWith('.m3u8') || f.endsWith('.ts'))
      .sort();

    console.log(`\nUploading ${hlsFiles.length} HLS file(s) to GitHub…`);
    for (const file of hlsFiles) {
      const b64 = readFileSync(join(tempDir, file)).toString('base64');
      process.stdout.write(`  ${file} … `);
      await uploadFile(
        `public/videos/${slug}/${file}`,
        b64,
        `upload: HLS ${file} for "${title}"`,
        cfg
      );
      console.log('✓');
    }

    // 4. Upload thumbnail (optional)
    let thumb = '/images/cross.png';
    if (thumbArg) {
      const thumbPath = resolve(thumbArg);
      if (!existsSync(thumbPath)) {
        console.warn(`\nThumbnail not found at ${thumbPath}, skipping.`);
      } else {
        const ext = extname(thumbPath).replace('.', '') || 'jpg';
        const gitThumbPath = `public/images/${slug}-thumb.${ext}`;
        const b64 = readFileSync(thumbPath).toString('base64');
        console.log(`\nUploading thumbnail…`);
        await uploadFile(gitThumbPath, b64, `upload: thumbnail for "${title}"`, cfg);
        thumb = `/images/${slug}-thumb.${ext}`;
        console.log('✓');
      }
    }

    // 5. Append to videos.json
    console.log(`\nUpdating videos.json…`);
    const { content: videos, sha } = await getFileJson('src/data/videos.json', cfg);
    const maxId = videos.reduce((m, v) => Math.max(m, Number(v.id) || 0), 0);
    videos.push({ id: String(maxId + 1), title, categories, url: `/videos/${slug}/index.m3u8`, thumb, duration });
    await putFileJson('src/data/videos.json', videos, `admin: add video "${title}"`, sha, cfg);
    console.log('✓');

    console.log(`\nDone! "${title}" uploaded.`);
    console.log(`Netlify will rebuild in ~2 minutes.\n`);
  } finally {
    rmSync(tempDir, { recursive: true, force: true });
  }
}

main().catch(err => {
  console.error('\nError:', err.message);
  process.exit(1);
});
