import { c as createComponent } from './astro-component_BvlII8sD.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DBLTLYBt.mjs';
import { r as renderComponent } from './ssr-function_BjQGvr6V.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CAFMOzHL.mjs';

const videos = [
	{
		id: "1",
		title: "Fake Shot",
		categories: [
			"shooting"
		],
		url: "/videos/niceshot.mov",
		thumb: "/images/fake-shot-thumb.png",
		duration: "0:35"
	},
	{
		id: "2",
		title: "Nice Tackle",
		categories: [
			"defense"
		],
		url: "/videos/defensiveHighlight.mp4",
		thumb: "/images/defensive-tackle-thumb.png",
		duration: "1:45"
	},
	{
		id: "3",
		title: "Cross",
		categories: [
			"Cross"
		],
		url: "/videos/cross.mp4",
		thumb: "/images/cross.png",
		duration: "2:15"
	},
	{
		id: "4",
		title: "Tracking Back",
		categories: [
			"hustle",
			"passing"
		],
		url: "/videos/active.mp4",
		thumb: "/images/cross.png",
		duration: "0:30"
	},
	{
		id: "5",
		title: "Turnout",
		categories: [
			"turnout"
		],
		url: "/videos/turnout.mp4",
		thumb: "/images/cross.png",
		duration: "0:30"
	}
];

const prerender = false;
const $$Videos = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Videos;
  const success = Astro2.url.searchParams.get("success");
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate`${renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Videos", "data-astro-cid-34grhwxg": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title" data-astro-cid-34grhwxg>Videos</h1> <p class="page-sub" data-astro-cid-34grhwxg>Add or remove highlight clips. Each change commits to GitHub and triggers a rebuild.</p> ${success && renderTemplate`<div class="alert-ok" data-astro-cid-34grhwxg>✓ Saved — site rebuild triggered. Changes live in ~2 min.</div>`}${error && renderTemplate`<div class="alert-err" data-astro-cid-34grhwxg>✗ Action failed. Check GitHub env vars or file size (thumbnails must be under 7 MB).</div>`} <div class="section-card" data-astro-cid-34grhwxg> <p class="section-heading" data-astro-cid-34grhwxg>Current Videos (${videos.length})</p> ${videos.length === 0 && renderTemplate`<p class="empty" data-astro-cid-34grhwxg>No videos yet.</p>`} <div class="video-list" data-astro-cid-34grhwxg> ${videos.map((v) => renderTemplate`<div class="video-row" data-astro-cid-34grhwxg> <img${addAttribute(v.thumb, "src")}${addAttribute(v.title, "alt")} class="thumb" onerror="this.src='/favicon.svg'" data-astro-cid-34grhwxg> <div class="video-meta" data-astro-cid-34grhwxg> <span class="video-title" data-astro-cid-34grhwxg>${v.title}</span> <span class="video-cats" data-astro-cid-34grhwxg>${(v.categories ?? []).join(", ")}</span> <span class="video-url" data-astro-cid-34grhwxg>${v.url}</span> </div> <form method="POST" action="/api/delete-video" class="delete-form" data-astro-cid-34grhwxg> <input type="hidden" name="id"${addAttribute(v.id, "value")} data-astro-cid-34grhwxg> <button type="submit" class="btn-danger" onclick="return confirm('Remove this video from the list?')" data-astro-cid-34grhwxg>Remove</button> </form> </div>`)} </div> </div>  <div class="section-card" data-astro-cid-34grhwxg> <p class="section-heading" data-astro-cid-34grhwxg>Add a Video</p> <form method="POST" action="/api/add-video" enctype="multipart/form-data" data-astro-cid-34grhwxg> <div class="form-grid" data-astro-cid-34grhwxg> <div class="field full-width" data-astro-cid-34grhwxg> <label for="title" data-astro-cid-34grhwxg>Title</label> <input id="title" name="title" type="text" placeholder="Nice Through Ball" required data-astro-cid-34grhwxg> </div> <div class="field full-width" data-astro-cid-34grhwxg> <label for="categories" data-astro-cid-34grhwxg>Categories</label> <input id="categories" name="categories" type="text" placeholder="passing, hustle" data-astro-cid-34grhwxg> <p class="hint" data-astro-cid-34grhwxg>Comma-separated. Matching filter buttons appear automatically.</p> </div> <div class="field full-width" data-astro-cid-34grhwxg> <label for="videoFilename" data-astro-cid-34grhwxg>Video Filename</label> <input id="videoFilename" name="videoFilename" type="text" placeholder="myvideo.mp4" required data-astro-cid-34grhwxg> <p class="hint" data-astro-cid-34grhwxg>
Commit the <code data-astro-cid-34grhwxg>.mp4</code> file to <code data-astro-cid-34grhwxg>public/videos/</code> in your repo first,
            then enter its filename here (e.g. <code data-astro-cid-34grhwxg>myvideo.mp4</code>).
</p> </div> <div class="field full-width" data-astro-cid-34grhwxg> <label for="thumbnail" data-astro-cid-34grhwxg>Thumbnail Image</label> <input id="thumbnail" name="thumbnail" type="file" accept="image/*" data-astro-cid-34grhwxg> <p class="hint" data-astro-cid-34grhwxg>Upload a JPG or PNG (under 7 MB). It will be committed to <code data-astro-cid-34grhwxg>public/images/</code>.</p> </div> </div> <button type="submit" class="btn-primary" style="margin-top:1rem" data-astro-cid-34grhwxg>Add Video & Commit to GitHub</button> </form> </div> ` })}`;
}, "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/videos.astro", void 0);

const $$file = "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/videos.astro";
const $$url = "/admin/videos";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Videos,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
