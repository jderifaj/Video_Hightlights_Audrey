<script>
  import { onDestroy } from 'svelte';

  export let activeVideo;
  export let autoplay = true;
  export let ondurationload = null;
  export let onnexttrack = null;
  export let ontimeupdate = null;

  let videoEl;
  let rafId = null;

  $: isYoutube = activeVideo?.url?.includes('youtube.com/embed/');

  $: if (autoplay && videoEl && videoEl.paused && videoEl.readyState >= 2) {
    videoEl.play().catch(() => {});
  }

  function startProgressLoop() {
    if (typeof requestAnimationFrame === 'undefined') return;
    cancelAnimationFrame(rafId);
    function tick() {
      if (videoEl && isFinite(videoEl.duration)) {
        ontimeupdate?.({ percent: (videoEl.currentTime / videoEl.duration) * 100 });
      }
      rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
  }

  function stopProgressLoop() {
    if (typeof cancelAnimationFrame !== 'undefined') cancelAnimationFrame(rafId);
    rafId = null;
  }

  onDestroy(stopProgressLoop);

  function handleLoadedMetadata() {
    if (!videoEl || !activeVideo) return;
    const secs = videoEl.duration;
    if (isFinite(secs)) {
      const m = Math.floor(secs / 60);
      const s = String(Math.floor(secs % 60)).padStart(2, '0');
      ondurationload?.({ url: activeVideo.url, duration: `${m}:${s}` });
    }
    startProgressLoop();
    if (autoplay) {
      videoEl.play().catch(() => {});
    }
  }

  function handleEnded() {
    stopProgressLoop();
    if (autoplay) onnexttrack?.();
  }
</script>

<div class="relative w-full rounded-2xl overflow-hidden bg-slate-900 shadow-2xl aspect-video border border-slate-800">
  {#if activeVideo}
    {#if isYoutube}
      <iframe
        class="w-full h-full object-cover"
        src="{activeVideo.url}?autoplay={autoplay ? 1 : 0}&rel=0"
        title={activeVideo.title}
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowfullscreen
      ></iframe>
    {:else}
      <video
        bind:this={videoEl}
        class="w-full h-full object-cover"
        src={activeVideo.url}
        controls
        poster={activeVideo.thumb}
        on:loadedmetadata={handleLoadedMetadata}
        on:ended={handleEnded}
      >
        <track kind="captions" />
      </video>
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
