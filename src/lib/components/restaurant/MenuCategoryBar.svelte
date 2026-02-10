<script lang="ts">
    let { categories = [], activeCategory = $bindable() } = $props<{
        categories: string[];
        activeCategory: string;
    }>();
</script>

<div class="flex gap-2 overflow-x-auto no-scrollbar mt-4 -mx-5 px-5 py-2">
    {#each categories as cat}
        <button
            onclick={() => (activeCategory = cat)}
            class="flex-shrink-0 px-5 py-2.5 rounded-xl text-xs font-black transition-all {activeCategory ===
            cat
                ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                : 'bg-white text-gray-400 border border-gray-100'}"
        >
            {cat}
        </button>
    {/each}
</div>

<style>
    .no-scrollbar::-webkit-scrollbar {
        display: none;
    }
    .no-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }
</style>
