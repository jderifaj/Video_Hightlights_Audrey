#!/usr/bin/env node
/**
 * Runs inside GitHub Actions: converts every *.mp4 in public/raw-videos/ to HLS,
 * updates videos.json, then removes the raw files so the repo stays clean.
 */

import { execSync, spawnSync } from 'child_process';
import { existsSync, readdirSync, readFileSync, writeFileSync, rmSync, mkdirSync } from 'fs';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const ROOT      = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW_DIR   = join(ROOT, 'public/raw-videos');
const VIDS_DIR  = join(ROOT, 'public/videos');
const JSON_FILE = join(ROOT, 'src/data/videos.json');

if (!existsSync(RAW_DIR)) {
  console.log('No raw-videos directory found — nothing to do.');
  process.exit(0);
}

const rawFiles = readdirSync(RAW_DIR).filter(f => f.endsWith('.mp4'));
if (rawFiles.length === 0) {
  console.log('No raw videos to convert.');
  process.exit(0);
}

const videos = JSON.parse(readFileSync(JSON_FILE, 'utf8'));

for (const filename of rawFiles) {
  const slug     = filename.slice(0, -4);
  const rawPath  = join(RAW_DIR, filename);
  const metaPath = join(RAW_DIR, `${slug}.json`);
  const outDir   = join(VIDS_DIR, slug);

  const meta = existsSync(metaPath)
    ? JSON.parse(readFileSync(metaPath, 'utf8'))
    : { title: slug, categories: [], thumb: '/images/cross.png' };

  console.log(`\nConverting: ${filename} → /videos/${slug}/`);
  mkdirSync(outDir, { recursive: true });

  execSync(
    [
      'ffmpeg', '-i', `"${rawPath}"`,
      '-c:v libx264', '-preset fast', '-crf 23',
      '-c:a aac', '-b:a 128k',
      '-hls_time 6', '-hls_list_size 0',
      `-hls_segment_filename "${join(outDir, 'seg%03d.ts')}"`,
      `"${join(outDir, 'index.m3u8')}"`,
      '-y',
    ].join(' '),
    { stdio: 'inherit' }
  );

  // Detect duration via ffprobe
  const probe = spawnSync(
    'ffprobe',
    ['-v', 'error', '-show_entries', 'format=duration', '-of', 'default=noprint_wrappers=1:nokey=1', rawPath],
    { encoding: 'utf8' }
  );
  const secs = parseFloat(probe.stdout?.trim() ?? '0') || 0;
  const m    = Math.floor(secs / 60);
  const s    = Math.floor(secs % 60);

  const maxId = videos.reduce((mx, v) => Math.max(mx, Number(v.id) || 0), 0);
  videos.push({
    id:         String(maxId + 1),
    title:      meta.title,
    categories: meta.categories ?? [],
    url:        `/videos/${slug}/index.m3u8`,
    thumb:      meta.thumb ?? '/images/cross.png',
    duration:   `${m}:${s.toString().padStart(2, '0')}`,
  });

  rmSync(rawPath);
  if (existsSync(metaPath)) rmSync(metaPath);
  console.log(`✓ ${slug} — ${m}:${s.toString().padStart(2, '0')}`);
}

writeFileSync(JSON_FILE, JSON.stringify(videos, null, 2));
console.log('\n✓ videos.json updated');
