import { c as createComponent } from './astro-component_BvlII8sD.mjs';
import 'piccolore';
import { aY as renderHead, P as renderTemplate } from './sequence_DBLTLYBt.mjs';
import 'clsx';

const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Login;
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`<html lang="en" class="dark" data-astro-cid-sgpqyurt> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Admin Login</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-sgpqyurt> <div class="card" data-astro-cid-sgpqyurt> <div class="logo" data-astro-cid-sgpqyurt>Audrey Derifaj</div> <div class="subtitle" data-astro-cid-sgpqyurt>Admin Panel</div> ${error && renderTemplate`<div class="error" data-astro-cid-sgpqyurt>Incorrect username or password.</div>`} <form method="POST" action="/api/login" data-astro-cid-sgpqyurt> <div class="field" data-astro-cid-sgpqyurt> <label for="username" data-astro-cid-sgpqyurt>Username</label> <input id="username" name="username" type="text" autocomplete="username" required data-astro-cid-sgpqyurt> </div> <div class="field" data-astro-cid-sgpqyurt> <label for="password" data-astro-cid-sgpqyurt>Password</label> <input id="password" name="password" type="password" autocomplete="current-password" required data-astro-cid-sgpqyurt> </div> <button type="submit" data-astro-cid-sgpqyurt>Sign In</button> </form> </div> </body></html>`;
}, "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/login.astro", void 0);

const $$file = "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
