import { c as createComponent } from './astro-component_BvlII8sD.mjs';
import 'piccolore';
import { P as renderTemplate, y as maybeRenderHead, a2 as addAttribute } from './sequence_DBLTLYBt.mjs';
import { r as renderComponent } from './ssr-function_BjQGvr6V.mjs';
import { $ as $$AdminLayout } from './AdminLayout_CAFMOzHL.mjs';

const name = "Audrey Derifaj";
const classYear = "2029";
const gpa = "4.4";
const height = "5' 2\"";
const major = "Biology";
const team = "U16 NC Courage Academy";
const coach = "Kendell Fletcher White";
const honors = ["Cary HS Cross Country All-time 3K & 5K Record Holder","2025 Top 10 Finisher — NC 7A Cross Country State Championships","NC Courage Super Cup USL-U20 Academy Team Member","Alpha Beta Club","Cary Elementary Weekly Classroom Support Volunteer"];
const player = {
  name,
  classYear,
  gpa,
  height,
  major,
  team,
  coach,
  honors,
};

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(raw || cooked.slice()) }));
var _a;
const prerender = false;
const $$Player = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$props, $$slots);
  Astro2.self = $$Player;
  const success = Astro2.url.searchParams.get("success");
  const error = Astro2.url.searchParams.get("error");
  return renderTemplate(_a || (_a = __template(["", `  <script>
  function addHonor() {
    const list = document.getElementById('honors-list');
    const row  = document.createElement('div');
    row.className = 'honor-row';
    row.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:0.5rem';
    row.innerHTML = \`<input name="honors" type="text" style="flex:1;padding:0.6rem 0.85rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:0.5rem;color:#f1f5f9;font-size:0.9rem;outline:none;" placeholder="New achievement..." />
      <button type="button" class="btn-danger" onclick="this.closest('.honor-row').remove()" style="padding:0.4rem 0.8rem;background:none;border:1px solid rgba(239,68,68,0.4);border-radius:0.5rem;color:#f87171;font-size:0.8rem;cursor:pointer;">✕</button>\`;
    list?.appendChild(row);
    /** @type {HTMLInputElement|null} */ (row.querySelector('input'))?.focus();
  }
<\/script>`], ["", `  <script>
  function addHonor() {
    const list = document.getElementById('honors-list');
    const row  = document.createElement('div');
    row.className = 'honor-row';
    row.style.cssText = 'display:flex;gap:0.5rem;margin-bottom:0.5rem';
    row.innerHTML = \\\`<input name="honors" type="text" style="flex:1;padding:0.6rem 0.85rem;background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.1);border-radius:0.5rem;color:#f1f5f9;font-size:0.9rem;outline:none;" placeholder="New achievement..." />
      <button type="button" class="btn-danger" onclick="this.closest('.honor-row').remove()" style="padding:0.4rem 0.8rem;background:none;border:1px solid rgba(239,68,68,0.4);border-radius:0.5rem;color:#f87171;font-size:0.8rem;cursor:pointer;">✕</button>\\\`;
    list?.appendChild(row);
    /** @type {HTMLInputElement|null} */ (row.querySelector('input'))?.focus();
  }
<\/script>`])), renderComponent($$result, "AdminLayout", $$AdminLayout, { "title": "Player Info", "data-astro-cid-aib7n2tg": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<h1 class="page-title" data-astro-cid-aib7n2tg>Player Info</h1> <p class="page-sub" data-astro-cid-aib7n2tg>Save commits to GitHub and triggers a site rebuild.</p> ${success && renderTemplate`<div class="alert-ok" data-astro-cid-aib7n2tg>✓ Saved — site rebuild triggered. Changes live in ~2 min.</div>`}${error && renderTemplate`<div class="alert-err" data-astro-cid-aib7n2tg>✗ Save failed. Check that your GitHub env vars are set correctly.</div>`}<form method="POST" action="/api/player" data-astro-cid-aib7n2tg> <div class="section-card" data-astro-cid-aib7n2tg> <p class="section-heading" data-astro-cid-aib7n2tg>Identity</p> <div class="form-grid" data-astro-cid-aib7n2tg> <div class="field" data-astro-cid-aib7n2tg> <label for="name" data-astro-cid-aib7n2tg>Full Name</label> <input id="name" name="name" type="text"${addAttribute(player.name, "value")} required data-astro-cid-aib7n2tg> </div> <div class="field" data-astro-cid-aib7n2tg> <label for="classYear" data-astro-cid-aib7n2tg>Class Year</label> <input id="classYear" name="classYear" type="text"${addAttribute(player.classYear, "value")} data-astro-cid-aib7n2tg> </div> <div class="field" data-astro-cid-aib7n2tg> <label for="team" data-astro-cid-aib7n2tg>Team</label> <input id="team" name="team" type="text"${addAttribute(player.team, "value")} data-astro-cid-aib7n2tg> </div> <div class="field" data-astro-cid-aib7n2tg> <label for="coach" data-astro-cid-aib7n2tg>Coach</label> <input id="coach" name="coach" type="text"${addAttribute(player.coach, "value")} data-astro-cid-aib7n2tg> </div> </div> </div> <div class="section-card" data-astro-cid-aib7n2tg> <p class="section-heading" data-astro-cid-aib7n2tg>Academic</p> <div class="form-grid" data-astro-cid-aib7n2tg> <div class="field" data-astro-cid-aib7n2tg> <label for="gpa" data-astro-cid-aib7n2tg>GPA</label> <input id="gpa" name="gpa" type="text"${addAttribute(player.gpa, "value")} data-astro-cid-aib7n2tg> </div> <div class="field" data-astro-cid-aib7n2tg> <label for="height" data-astro-cid-aib7n2tg>Height</label> <input id="height" name="height" type="text"${addAttribute(player.height, "value")} data-astro-cid-aib7n2tg> </div> <div class="field full-width" data-astro-cid-aib7n2tg> <label for="major" data-astro-cid-aib7n2tg>Major / Intended Major</label> <input id="major" name="major" type="text"${addAttribute(player.major, "value")} data-astro-cid-aib7n2tg> </div> </div> </div> <div class="section-card" data-astro-cid-aib7n2tg> <p class="section-heading" data-astro-cid-aib7n2tg>Honors & Achievements</p> <p class="hint" style="margin-bottom:1rem" data-astro-cid-aib7n2tg>One achievement per line.</p> <div class="field" id="honors-list" data-astro-cid-aib7n2tg> ${player.honors.map((h) => renderTemplate`<div class="honor-row" style="display:flex;gap:0.5rem;margin-bottom:0.5rem" data-astro-cid-aib7n2tg> <input name="honors" type="text"${addAttribute(h, "value")} style="flex:1" data-astro-cid-aib7n2tg> <button type="button" class="btn-danger" onclick="this.closest('.honor-row').remove()" data-astro-cid-aib7n2tg>✕</button> </div>`)} </div> <button type="button" class="btn-add" onclick="addHonor()" data-astro-cid-aib7n2tg>+ Add Achievement</button> </div> <button type="submit" class="btn-primary" data-astro-cid-aib7n2tg>Save & Commit to GitHub</button> </form> ` }));
}, "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/player.astro", void 0);

const $$file = "/Users/derifaj/Sites/videoHighlightsAudrey/Video_Hightlights_Audrey/src/pages/admin/player.astro";
const $$url = "/admin/player";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Player,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
