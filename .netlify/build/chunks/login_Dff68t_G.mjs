import { i as isValidCredentials, c as createSessionToken } from './auth_BA-UNyac.mjs';

const prerender = false;
const POST = async ({ request, cookies }) => {
  const form = await request.formData();
  const username = form.get("username")?.toString() ?? "";
  form.get("password")?.toString() ?? "";
  if (!isValidCredentials()) {
    return new Response(null, { status: 302, headers: { Location: "/login?error=1" } });
  }
  const token = createSessionToken(username);
  cookies.set("session", token, {
    httpOnly: true,
    secure: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24
  });
  return new Response(null, { status: 302, headers: { Location: "/admin" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
