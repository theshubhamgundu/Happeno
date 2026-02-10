<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { CheckCircle2, Image as ImageIcon } from "lucide-svelte";

    let { photos } = $props<{ photos: { url: string; caption?: string }[] }>();

    let activeFilter = $state("all");
    const filters = ["all", "food", "ambiance", "menu", "customer"];
</script>

<div class="space-y-8 animate-in fade-in duration-500 pb-20">
    <!-- Filter Header -->
    <div class="flex items-center justify-between">
        <h3 class="text-sm font-black text-gray-900 uppercase tracking-widest">
            Photo Gallery ({photos.length})
        </h3>
        <button
            class="flex items-center gap-2 text-primary text-[10px] font-black uppercase tracking-widest"
        >
            <ImageIcon size={14} /> Add photo
        </button>
    </div>

    <!-- Category Filters -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar py-2">
        {#each filters as filter}
            <button
                onclick={() => (activeFilter = filter)}
                class="flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeFilter ===
                filter
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-white text-gray-400 border border-gray-100'}"
            >
                {filter}
            </button>
        {/each}
    </div>

    <!-- Photo Masonry Gridish -->
    <div class="grid grid-cols-2 gap-3">
        {#each photos as photo, i}
            <div
                class="relative aspect-square rounded-[32px] overflow-hidden group shadow-lg shadow-gray-200/20"
                in:fly={{ y: 20, delay: i * 50, duration: 500 }}
            >
                <img
                    src={photo.url}
                    alt={photo.caption || "restaurant photo"}
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                />
                {#if photo.caption}
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end"
                    >
                        <p
                            class="text-white text-[10px] font-bold uppercase tracking-wider"
                        >
                            {photo.caption}
                        </p>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>
