/* 
  Drop your custom .mp4 highlight videos with your own music into the `public/videos/` folder.
  Place the corresponding thumbnail images into `public/images/`.
*/
export const videos = [
  {
    id: '1',
    title: 'Texas Showcase Highlights 2026',
    categories: ['passing', 'shooting'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    thumb: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=600&auto=format&fit=crop',
    duration: '1:45'
  },
  {
    id: '2',
    title: 'Highlights 2024 - N.C. Courage Academy',
    categories: ['passing', 'hustle'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumb: 'https://images.unsplash.com/photo-1518605368461-1ee7c5320e8c?q=80&w=600&auto=format&fit=crop',
    duration: '2:15'
  },
  {
    id: '3',
    title: 'Volley Practice 2022',
    categories: ['shooting'],
    url: '/videos/niceshot.mov',
    thumb: 'https://images.unsplash.com/photo-1551280857-2b9bbe52ccf1?q=80&w=600&auto=format&fit=crop',
    duration: '0:35'
  },
  {
    id: '4',
    title: 'Tracking Back from Midfield - Elite Engine',
    categories: ['hustle', 'passing'],
    url: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
    thumb: 'https://images.unsplash.com/photo-1600250554157-195c643b1070?q=80&w=600&auto=format&fit=crop',
    duration: '0:30'
  }
];

export const categories = [
  { id: 'all', label: 'All Videos' },
  { id: 'passing', label: 'Passing' },
  { id: 'shooting', label: 'Shooting' },
  { id: 'hustle', label: 'Hustle/Defense' }
];
