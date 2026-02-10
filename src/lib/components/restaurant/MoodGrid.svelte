<script lang="ts">
    import { ChevronRight } from "lucide-svelte";

    let { categories = [] } = $props<{
        categories: Array<{ name: string; image: string; color?: string }>;
    }>();
</script>

<section class="space-y-5">
    <div class="flex items-center justify-between px-4">
        <h3 class="text-sm font-bold text-text-primary tracking-tight">
            In the mood for
        </h3>
        <button
            class="text-xs font-semibold text-primary flex items-center gap-1 hover:gap-2 transition-all"
        >
            See All <ChevronRight size={14} />
        </button>
    </div>

    <div class="px-4">
        <div class="grid grid-cols-2 gap-3">
            {#each categories as mood}
                <button
                    class="relative h-[150px] rounded-2xl overflow-hidden active:scale-[0.97] transition-all duration-300 shadow-md hover:shadow-lg group"
                >
                    <img
                        src={mood.image}
                        alt={mood.name}
                        class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                    />
                    <div
                        class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent"
                    ></div>
                    <div class="absolute bottom-0 left-0 right-0 p-3 text-left">
                        <h4
                            class="text-xs font-bold text-white uppercase tracking-wide"
                        >
                            {mood.name}
                        </h4>
                    </div>
                </button>
            {/each}
        </div>
    </div>
</section>
