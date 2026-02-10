<script lang="ts">
    import type { Restaurant } from "$lib/types";
    import { Star, MapPin, Clock } from "lucide-svelte";
    import { fade } from "svelte/transition";
    import { cn } from "$lib/utils";

    let { restaurant, class: className = "" } = $props<{
        restaurant: Restaurant;
        class?: string;
    }>();
</script>

<a
    href="/user/restaurant/{restaurant.id}"
    class={cn(
        "group block bg-white rounded-[32px] overflow-hidden border border-gray-100 shadow-xl shadow-gray-200/20 active:scale-[0.98] transition-all",
        className,
    )}
    transition:fade
>
    <!-- Image Header -->
    <div class="relative h-48 overflow-hidden">
        <img
            src={restaurant.image}
            alt={restaurant.name}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
            class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
        ></div>

        <!-- Badges -->
        <div class="absolute top-4 left-4 flex gap-2">
            <div
                class="bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl flex items-center gap-1 shadow-lg"
            >
                <Star size={12} fill="currentColor" class="text-yellow-500" />
                <span class="text-xs font-black text-gray-900"
                    >{restaurant.rating}</span
                >
            </div>
            {#if !restaurant.isOpen}
                <div
                    class="bg-red-500 text-white px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
                >
                    Closed
                </div>
            {/if}
        </div>

        <div class="absolute bottom-4 left-4 right-4">
            <div class="flex flex-wrap gap-1.5">
                {#each restaurant.cuisines.slice(0, 2) as cuisine}
                    <span
                        class="bg-white/20 backdrop-blur-md text-white px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider border border-white/20"
                    >
                        {cuisine}
                    </span>
                {/each}
            </div>
        </div>
    </div>

    <!-- Content -->
    <div class="p-5">
        <div class="flex justify-between items-start mb-2">
            <h3
                class="text-lg font-black text-gray-900 leading-tight group-hover:text-primary transition-colors"
            >
                {restaurant.name}
            </h3>
            <span
                class="text-[10px] font-black text-primary uppercase tracking-widest"
            >
                ₹{restaurant.price} for 2
            </span>
        </div>

        <p class="text-gray-400 text-xs font-medium mb-4 line-clamp-1 italic">
            "{restaurant.tagline}"
        </p>

        <div
            class="flex items-center justify-between pt-4 border-t border-gray-50"
        >
            <div class="flex items-center gap-1.5 text-gray-500">
                <MapPin size={14} />
                <span class="text-[10px] font-black uppercase tracking-wider"
                    >{restaurant.distance}</span
                >
            </div>
            <div class="flex items-center gap-1.5 text-orange-500">
                <Clock size={14} />
                <span class="text-[10px] font-black uppercase tracking-wider"
                    >30-40 MINS</span
                >
            </div>
        </div>
    </div>
</a>
