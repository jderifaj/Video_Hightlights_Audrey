import { a as getFileJson, b as updateFile } from './github_Cuc07_ml.mjs';

const prerender = false;
const POST = async ({ request }) => {
  try {
    const form = await request.formData();
    const player = {
      name: form.get("name")?.toString() ?? "",
      classYear: form.get("classYear")?.toString() ?? "",
      gpa: form.get("gpa")?.toString() ?? "",
      height: form.get("height")?.toString() ?? "",
      major: form.get("major")?.toString() ?? "",
      team: form.get("team")?.toString() ?? "",
      coach: form.get("coach")?.toString() ?? "",
      honors: form.getAll("honors").map((h) => h.toString()).filter(Boolean)
    };
    const { sha } = await getFileJson("src/data/player.json");
    await updateFile(
      "src/data/player.json",
      JSON.stringify(player, null, 2),
      "admin: update player info",
      sha
    );
    return new Response(null, { status: 302, headers: { Location: "/admin/player?success=1" } });
  } catch (err) {
    console.error("player update failed:", err);
    return new Response(null, { status: 302, headers: { Location: "/admin/player?error=1" } });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
