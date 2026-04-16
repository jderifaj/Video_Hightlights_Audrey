const BASE = "https://api.github.com";
function ghHeaders() {
  return {
    Authorization: `Bearer ${undefined                            }`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "X-GitHub-Api-Version": "2022-11-28"
  };
}
const owner = () => undefined                            ;
const repo = () => undefined                           ;
const branch = () => "main";
function repoUrl(path) {
  return `${BASE}/repos/${owner()}/${repo()}/contents/${path}`;
}
async function getFileJson(path) {
  const res = await fetch(`${repoUrl(path)}?ref=${branch()}`, { headers: ghHeaders() });
  if (!res.ok) throw new Error(`GitHub GET ${path} failed: ${res.status}`);
  const data = await res.json();
  const content = JSON.parse(Buffer.from(data.content, "base64").toString("utf8"));
  return { content, sha: data.sha };
}
async function updateFile(path, content, message, sha) {
  const res = await fetch(repoUrl(path), {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify({
      message,
      content: Buffer.from(content, "utf8").toString("base64"),
      sha,
      branch: branch()
    })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub PUT ${path} failed: ${res.status} — ${err.message ?? ""}`);
  }
}
async function uploadBinaryFile(path, base64Content, message, existingSha) {
  const body = { message, content: base64Content, branch: branch() };
  if (existingSha) body.sha = existingSha;
  const res = await fetch(repoUrl(path), {
    method: "PUT",
    headers: ghHeaders(),
    body: JSON.stringify(body)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`GitHub upload ${path} failed: ${res.status} — ${err.message ?? ""}`);
  }
}
async function getFileSha(path) {
  const res = await fetch(`${repoUrl(path)}?ref=${branch()}`, { headers: ghHeaders() });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GitHub SHA check ${path} failed: ${res.status}`);
  const data = await res.json();
  return data.sha ?? null;
}

export { getFileJson as a, updateFile as b, getFileSha as g, uploadBinaryFile as u };
