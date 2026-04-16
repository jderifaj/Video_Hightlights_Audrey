const prerender = false;
const POST = ({ cookies }) => {
  cookies.delete("session", { path: "/" });
  return new Response(null, { status: 302, headers: { Location: "/login" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
