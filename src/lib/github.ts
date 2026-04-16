const BASE = 'https://api.github.com';

function ghHeaders() {
  return {
    Authorization: `Bearer ${import.meta.env.GITHUB_TOKEN}`,
    Accept: 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
    'X-GitHub-Api-Version': '2022-11-28',
  };
}

const owner = () => import.meta.env.GITHUB_OWNER;
const repo  = () => import.meta.env.GITHUB_REPO;
const branch = () => import.meta.env.GITHUB_BRANCH ?? 'main';

function repoUrl(path: string) {
  return `${BASE}/repos/${owner()}/${repo()}/contents/${path}`;
}

/** Fetch a JSON file from the repo. Returns parsed content + SHA needed for updates. */
export async function getFileJson(path: string): Promise<{ content: any; sha: string }> {
  const res = await fetch(`${repoUrl(path)}?ref=${branch()}`, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(Buffer.from(data.content, 'base64').toString('utf8'));
  return { content, sha: data.sha };
}

/** Commit a text file (JSON/JS) back to the repo. */
export async function updateFile(
  path: string,
  content: string,
  message: string,
  sha: string
): Promise<void> {
  const res = await fetch(repoUrl(path), {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, 'utf8').toString('base64'),
      sha,
      branch: branch(),
    }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub PUT ${path} failed: ${res.status} — ${(err as any).message ?? ''}`);
  }
}

/** Upload a binary file (e.g. image). Pass existingSha to overwrite. */
export async function uploadBinaryFile(
  path: string,
  base64Content: string,
  message: string,
  existingSha?: string
): Promise<void> {
  const body: Record<string, string> = { message, content: base64Content, branch: branch() };
  if (existingSha) body.sha = existingSha;
  const res = await fetch(repoUrl(path), {
    method: 'PUT',
    headers: ghHeaders(),
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub upload ${path} failed: ${res.status} — ${(err as any).message ?? ''}`);
  }
}

/** Return the SHA of an existing file, or null if it doesn't exist. */
export async function getFileSha(path: string): Promise<string | null> {
  const res = await fetch(`${repoUrl(path)}?ref=${branch()}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub SHA check ${path} failed: ${res.status}`);
  const data = await res.json();
  return data.sha ?? null;
}
