import { a as getFileJson, b as updateFile } from './github_Cuc07_ml.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const form = await request.formData();
    const id = form.get("id")?.toString();
    const { content: videos, sha } = await getFileJson("src/data/videos.json");
    const filtered = videos.filter((v) => v.id !== id);
    await updateFile(
      "src/data/videos.json",
      JSON.stringify(filtered, null, 2),
      `admin: remove video id=${id}`,
      sha
    );
    return new Response(null, { status: 302, headers: { Location: "/admin/videos?success=1" } });
  } catch (err) {
    console.error("delete-video failed:", err);
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
