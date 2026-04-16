/* 
  Drop your custom .mp4 highlight videos with your own music into the `public/videos/` folder.
  Place the corresponding thumbnail images into `public/images/`.
*/
export const videos = [
  {
    id: "1",
    title: "Fake Shot",
    categories: ["shooting"],
    url: "/videos/niceshot.mov",
    thumb: "/images/fake-shot-thumb.png",
    duration: "0:35",
  },
  {
    id: "2",
    title: "Nice Tackle",
    categories: ["defense"],
    url: "/videos/defensiveHighlight.mp4",
    thumb: "/images/defensive-tackle-thumb.png",
    duration: "1:45",
  },
  {
    id: "3",
    title: "Cross",
    categories: ["Cross"],
    url: "/videos/cross.mp4",
    thumb: "/images/cross.png",
    duration: "2:15",
  },

  {
    id: "4",
    title: "Tracking Back",
    categories: ["hustle", "passing"],
    url: "/videos/active.mp4",
    thumb: "/images/cross.png",
    duration: "0:30",
  },
  {
    id: "",
    title: "Turnout",
    categories: ["turnout"],
    url: "/videos/turnout.mp4",
    thumb: "/images/cross.png",
    duration: "0:30",
  },
];

export const categories = [
  { id: "all", label: "All Videos" },
  { id: "passing", label: "Passing" },
  { id: "shooting", label: "Shooting" },
  { id: "hustle", label: "Hustle/Defense" },
];
