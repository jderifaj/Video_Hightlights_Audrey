import { c as createComponent } from './astro-component_BvlII8sD.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead } from './sequence_DBLTLYBt.mjs';
import { r as renderComponent } from './ssr-function_BjQGvr6V.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CAFMOzHL.mjs';

const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Dashboard", "data-astro-cid-u2h3djql": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title" data-astro-cid-u2h3djql>Dashboard</h1> <p class="page-sub" data-astro-cid-u2h3djql>Changes commit to GitHub and trigger a Netlify rebuild (~2 min).</p> <div class="cards" data-astro-cid-u2h3djql> <a href="/admin/player" class="card" data-astro-cid-u2h3djql> <div class="card-icon" data-astro-cid-u2h3djql>👤</div> <div class="card-label" data-astro-cid-u2h3djql>Player Info</div> <div class="card-desc" data-astro-cid-u2h3djql>Edit name, GPA, height, major, honors</div> </a> <a href="/admin/videos" class="card" data-astro-cid-u2h3djql> <div class="card-icon" data-astro-cid-u2h3djql>🎬</div> <div class="card-label" data-astro-cid-u2h3djql>Videos</div> <div class="card-desc" data-astro-cid-u2h3djql>Add, remove, and manage highlight clips</div> </a> </div> ` })}`;
}, "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/index.astro", void 0);

const $$file = "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/index.astro";
const $$url = "/admin";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
