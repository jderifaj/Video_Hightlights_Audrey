import { g as getFileSha, u as uploadBinaryFile, a as getFileJson, b as updateFile } from './github_Cuc07_ml.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const form = await request.formData();
    const title = form.get("title")?.toString() ?? "";
    const categories = (form.get("categories")?.toString() ?? "").split(",").map((c) => c.trim()).filter(Boolean);
    const videoFile = form.get("videoFilename")?.toString() ?? "";
    const thumbFile = form.get("thumbnail");
    const url = videoFile.startsWith("/") ? videoFile : `/videos/${videoFile}`;
    let thumb = form.get("thumbUrl")?.toString() ?? "/images/cross.png";
    if (thumbFile && thumbFile.size > 0) {
      const ext = thumbFile.name.split(".").pop() ?? "jpg";
      const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const gitPath = `public/images/${slug}-thumb.${ext}`;
      const buf = await thumbFile.arrayBuffer();
      const b64 = Buffer.from(buf).toString("base64");
      const existing = await getFileSha(gitPath);
      await uploadBinaryFile(gitPath, b64, `admin: add thumbnail for "${title}"`, existing ?? void 0);
      thumb = `/images/${slug}-thumb.${ext}`;
    }
    const { content: videos, sha } = await getFileJson("src/data/videos.json");
    const maxId = videos.reduce((m, v) => Math.max(m, Number(v.id) || 0), 0);
    videos.push({ id: String(maxId + 1), title, categories, url, thumb, duration: "0:00" });
    await updateFile(
      "src/data/videos.json",
      JSON.stringify(videos, null, 2),
      `admin: add video "${title}"`,
      sha
    );
    return new Response(null, { status: 302, headers: { Location: "/admin/videos?success=1" } });
  } catch (err) {
    console.error("add-video failed:", err);
    return new Response(null, { status: 302, headers: { Location: "/admin/videos?error=1" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
