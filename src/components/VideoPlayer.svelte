<script>
  export let activeVideo;

  $: isYoutube = activeVideo?.url?.includes('youtube.com/embed/');
</script>

<div class="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl aspect-video border border-slate-800">
  {#if activeVideo}
    {#if isYoutube}
      <iframe
        class="w-full h-full object-cover"
        src="{activeVideo.url}?autoplay=1&rel=0"
        title={activeVideo.title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    {:else}
      <video 
        class="w-full h-full object-cover"
        src={activeVideo.url} 
        controls 
        autoplay
        poster={activeVideo.thumb}
      >
        <track kind="captions" />
      </video>
      <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-sm font-semibold tracking-wide border border-white/10 z-10 transition-all opacity-0 peer-hover:opacity-100 pointer-events-none">
        {activeVideo.title}
      </div>
    {/if}
  {:else}
    <div class="w-full h-full flex flex-col items-center justify-center text-slate-500">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="font-medium text-lg">Select a video to play</p>
    </div>
  {/if}
</div>
