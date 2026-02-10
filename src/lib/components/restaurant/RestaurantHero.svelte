<script lang="ts">
    import type { Restaurant } from "$lib/types";
    import { ChevronLeft, Share2, Heart, Star, MapPin } from "lucide-svelte";
    import { goto } from "$app/navigation";
    import { fade, fly } from "svelte/transition";

    let { restaurant } = $props<{ restaurant: Restaurant }>();
    let isFavorite = $state(false);

    function back() {
        goto("/user/nearby");
    }
</script>

<div class="relative h-[450px] overflow-hidden">
    <!-- Image -->
    <img
        src={restaurant.image}
        alt={restaurant.name}
        class="absolute inset-0 w-full h-full object-cover scale-105"
    />
    <div
        class="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#FDFCFB]"
    ></div>

    <!-- Top Controls -->
    <div
        class="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10"
    >
        <button
            onclick={back}
            class="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
        >
            <ChevronLeft size={24} />
        </button>
        <div class="flex gap-3">
            <button
                class="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center text-white active:scale-90 transition-all"
            >
                <Share2 size={20} />
            </button>
            <button
                onclick={() => (isFavorite = !isFavorite)}
                class="w-12 h-12 rounded-2xl bg-black/20 backdrop-blur-xl border border-white/20 flex items-center justify-center active:scale-90 transition-all {isFavorite
                    ? 'text-rose-500'
                    : 'text-white'}"
            >
                <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
        </div>
    </div>

    <!-- Hero Content -->
    <div
        class="absolute bottom-10 left-6 right-6"
        in:fly={{ y: 30, duration: 600 }}
    >
        <div class="flex flex-wrap gap-2 mb-4">
            {#each restaurant.cuisines as cuisine}
                <span
                    class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-lg text-[9px] font-black text-white uppercase tracking-widest border border-white/20"
                >
                    {cuisine}
                </span>
            {/each}
        </div>

        <h1
            class="text-5xl font-black text-gray-900 tracking-tighter mb-2 leading-none"
        >
            {restaurant.name}
        </h1>
        <p class="text-gray-500 font-bold text-sm italic mb-6">
            "{restaurant.tagline}"
        </p>

        <div class="flex items-center gap-6">
            <div class="flex items-center gap-2">
                <div
                    class="bg-emerald-500 w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20"
                >
                    <Star size={16} fill="currentColor" />
                </div>
                <div>
                    <p
                        class="text-xs font-black text-gray-900 leading-none mb-0.5"
                    >
                        {restaurant.rating}
                    </p>
                    <p
                        class="text-[9px] font-black text-gray-400 uppercase tracking-widest uppercase"
                    >
                        {restaurant.reviews} reviews
                    </p>
                </div>
            </div>

            <div class="h-8 w-[1px] bg-gray-200"></div>

            <div class="flex items-center gap-2">
                <div
                    class="bg-primary/10 w-8 h-8 rounded-xl flex items-center justify-center text-primary"
                >
                    <MapPin size={16} />
                </div>
                <div>
                    <p
                        class="text-xs font-black text-gray-900 leading-none mb-0.5"
                    >
                        {restaurant.distance}
                    </p>
                    <p
                        class="text-[9px] font-black text-gray-400 uppercase tracking-widest"
                    >
                        away
                    </p>
                </div>
            </div>
        </div>
    </div>
</div>
