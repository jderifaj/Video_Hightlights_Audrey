<script>
  import { onMount, tick } from 'svelte';
  import { gsap } from 'gsap';
  import VideoPlayer from './VideoPlayer.svelte';
  import CategoryFilter from './CategoryFilter.svelte';
  
  export let videos = [];
  export let categories = [];

  let activeCategory = 'all';
  let activeVideo = videos.length > 0 ? videos[0] : null;
  let videoGrid;

  // Filter videos based on category
  $: filteredVideos = activeCategory === 'all' 
    ? videos 
    : videos.filter(v => v.categories?.includes(activeCategory));

  function handleCategorySelect(categoryId) {
    if (activeCategory === categoryId) return; // Do nothing if same
    
    // Animate out current items
    const currentItems = videoGrid.querySelectorAll('.video-card');
    
    if (currentItems.length > 0) {
      gsap.to(currentItems, {
        opacity: 0,
        y: 20,
        scale: 0.95,
        duration: 0.3,
        stagger: 0.05,
        ease: 'power2.in',
        onComplete: () => {
          activeCategory = categoryId;
          animateIn();
        }
      });
    } else {
      activeCategory = categoryId;
      animateIn();
    }
  }

  async function animateIn() {
    await tick(); // Wait for Svelte to render new items
    const newItems = videoGrid.querySelectorAll('.video-card');
    
    // Start them invisible
    gsap.set(newItems, { opacity: 0, y: 20, scale: 0.95 });
    
    // Animate in
    gsap.to(newItems, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.4,
      stagger: 0.08,
      ease: 'back.out(1.7)',
      clearProps: 'all' // important to clean up GSAP inline styles
    });
  }

  function handleVideoSelect(video) {
    activeVideo = video;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  onMount(() => {
    // Initial entrance animation
    const items = videoGrid.querySelectorAll('.video-card');
    gsap.fromTo(items, 
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' }
    );
  });
</script>

<div class="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-7xl mx-auto items-start">
  
  <!-- Left Side: Sticky Video Player -->
  <div class="lg:col-span-2 lg:sticky lg:top-8 flex flex-col gap-6">
    <VideoPlayer {activeVideo} />
    
    <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm">
      <h2 class="text-2xl font-bold text-white mb-2">{activeVideo ? activeVideo.title : 'Select a video'}</h2>
      <p class="text-slate-400 capitalize">{activeVideo ? `Categories: ${(activeVideo.categories || []).join(', ')}` : ''}</p>
    </div>
  </div>

  <!-- Right Side: Playlist & Filters -->
  <div class="flex flex-col gap-6">
    
    <div class="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 backdrop-blur-sm sticky top-8 z-20">
      <h3 class="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-courage-red" viewBox="0 0 20 20" fill="currentColor">
          <path d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" />
        </svg>
        Filter Playbook
      </h3>
      <CategoryFilter 
        {categories} 
        {activeCategory} 
        onSelectCategory={handleCategorySelect} 
      />
    </div>

    <!-- Video Grid -->
    <div bind:this={videoGrid} class="flex flex-col gap-4 pb-20">
      {#each filteredVideos as video, index (video.id)}
        <button 
          class="video-card flex gap-4 p-3 rounded-xl border transition-all duration-300 text-left group
                 {activeVideo?.id === video.id 
                   ? 'bg-courage-blue/10 border-courage-blue/50 shadow-[0_0_20px_rgba(0,163,224,0.15)] ring-1 ring-courage-blue/50' 
                   : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 hover:border-slate-500 hover:shadow-lg'}"
          on:click={() => handleVideoSelect(video)}
        >
          <!-- Thumbnail -->
          <div class="relative w-32 shrink-0 rounded-lg overflow-hidden aspect-video bg-slate-900 border border-slate-700/50">
            <img src={video.thumb} alt={video.title} class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
            
            <div class="absolute bottom-1.5 right-1.5 bg-black/80 px-1.5 py-0.5 rounded text-[10px] font-medium text-white shadow">
              {video.duration}
            </div>

            <!-- Play Overlay on Hover -->
            <div class="absolute inset-0 bg-courage-blue/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white drop-shadow-md" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          
          <!-- Details -->
          <div class="flex flex-col justify-center flex-grow py-1">
            <h4 class="font-semibold text-sm leading-tight mb-1 text-slate-100 group-hover:text-courage-blue transition-colors line-clamp-2">{video.title}</h4>
            <span class="text-xs text-slate-400 uppercase tracking-wider font-medium mt-auto">{(video.categories || []).join(', ')}</span>
          </div>

          <!-- Active Indicator -->
          {#if activeVideo?.id === video.id}
            <div class="flex h-full items-center pr-2">
              <div class="flex gap-0.5 items-end h-4">
                <div class="w-1 bg-courage-red rounded-full animate-[bounce_1s_infinite_0ms]"></div>
                <div class="w-1 bg-courage-red rounded-full animate-[bounce_1s_infinite_150ms] h-full"></div>
                <div class="w-1 bg-courage-red rounded-full animate-[bounce_1s_infinite_300ms]"></div>
              </div>
            </div>
          {/if}
        </button>
      {/each}
      
      {#if filteredVideos.length === 0}
        <div class="p-8 text-center text-slate-500 bg-slate-800/20 rounded-xl border border-slate-800 border-dashed">
          No videos found for this category.
        </div>
      {/if}
    </div>
  </div>
</div>

<style>
  /* Custom bounce animation for the "playing" equalizer bars */
  @keyframes bounce {
    0%, 100% { height: 4px; }
    50% { height: 16px; }
  }
</style>
