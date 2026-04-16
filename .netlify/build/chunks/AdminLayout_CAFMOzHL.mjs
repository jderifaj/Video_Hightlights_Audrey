import { c as createComponent } from './astro-component_BvlII8sD.mjs';
import 'piccolore';
import { aY as renderHead, a2 as addAttribute, B as renderSlot, P as renderTemplate } from './sequence_DBLTLYBt.mjs';
import 'clsx';

const $$AdminLayout = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$AdminLayout;
  const { title } = Astro2.props;
  return renderTemplate`<html lang="en" class="dark" data-astro-cid-2kanml4j> <head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${title} — Admin</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">${renderHead()}</head> <body data-astro-cid-2kanml4j> <aside class="sidebar" data-astro-cid-2kanml4j> <div class="sidebar-brand" data-astro-cid-2kanml4j>Audrey Derifaj</div> <div class="sidebar-sub" data-astro-cid-2kanml4j>Admin</div> <p class="nav-label" data-astro-cid-2kanml4j>Manage</p> <nav class="nav" data-astro-cid-2kanml4j> <a href="/admin"${addAttribute(Astro2.url.pathname === "/admin" ? "active" : "", "class")} data-astro-cid-2kanml4j>🏠 Dashboard</a> <a href="/admin/player"${addAttribute(Astro2.url.pathname.includes("/player") ? "active" : "", "class")} data-astro-cid-2kanml4j>👤 Player Info</a> <a href="/admin/videos"${addAttribute(Astro2.url.pathname.includes("/videos") ? "active" : "", "class")} data-astro-cid-2kanml4j>🎬 Videos</a> </nav> <form method="POST" action="/api/logout" data-astro-cid-2kanml4j> <button class="logout-btn" type="submit" data-astro-cid-2kanml4j>⎋ Sign out</button> </form> </aside> <main class="main" data-astro-cid-2kanml4j> ${renderSlot($$result, $$slots["default"])} </main> </body></html>`;
}, "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/layouts/AdminLayout.astro", void 0);

export { $$AdminLayout as $ };
