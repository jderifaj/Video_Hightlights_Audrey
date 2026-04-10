<script>
  export let categories = [];
  export let activeCategory = 'all';
  export let onSelectCategory;
</script>

<div class="flex flex-wrap gap-3 pb-4">
  {#each categories as category}
    <button
      class="px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ease-out 
             {activeCategory === category.id 
               ? 'bg-courage-red text-white shadow-[0_0_15px_rgba(227,24,55,0.5)] border-transparent' 
               : 'bg-slate-800/50 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white'}"
      on:click={() => onSelectCategory(category.id)}
    >
      {category.label}
    </button>
  {/each}
</div>
