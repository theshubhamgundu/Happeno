<script lang="ts">
    import { Star, Clock, BadgeCheck, ChevronRight } from "lucide-svelte";
    import { cn } from "$lib/utils";

    let { restaurant, class: className = "" } = $props<{
        restaurant: any;
        class?: string;
    }>();
</script>

<a href="/user/restaurant/{restaurant.id}" class={cn("block group", className)}>
    <!-- Restaurant Card Container -->
    <div
        class="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-100/50 hover-lift transition-all duration-300 scroll-animate"
    >
        <!-- Image Section -->
        <div class="relative aspect-[16/9] overflow-hidden">
            <img
                src={restaurant.image}
                alt={restaurant.name}
                class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
            />

            <!-- Gradient Overlay -->
            <div
                class="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"
            ></div>

            <!-- Distance Badge - Top Left -->
            <div
                class="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full"
            >
                <span class="text-white text-[10px] font-semibold">
                    {restaurant.distanceValue?.toFixed(1) ||
                        restaurant.distance} KM
                </span>
            </div>

            <!-- Rating Badge - Top Right -->
            <div
                class="absolute top-3 right-3 bg-success px-2.5 py-1 rounded-full flex items-center gap-1 shadow-lg"
            >
                <span class="text-white text-xs font-bold"
                    >{restaurant.rating}</span
                >
                <Star size={10} class="text-white fill-white" />
            </div>

            <!-- Offer Banner - Bottom -->
            {#if restaurant.offer}
                <div class="absolute bottom-3 left-3 right-3">
                    <div
                        class="bg-gradient-to-r from-primary to-[#FF4D9E] text-white text-[10px] font-semibold px-4 py-2.5 rounded-xl flex items-center justify-between shadow-lg"
                    >
                        <span class="flex items-center gap-2">
                            <span
                                class="w-1.5 h-1.5 rounded-full bg-white animate-pulse"
                            ></span>
                            {restaurant.offer}
                        </span>
                        <ChevronRight size={14} />
                    </div>
                </div>
            {/if}
        </div>

        <!-- Content Section -->
        <div class="p-4">
            <!-- Title & Price Row -->
            <div class="flex justify-between items-start mb-2">
                <div class="flex-1 min-w-0 pr-3">
                    <h4 class="text-base font-bold text-text-primary truncate">
                        {restaurant.name}
                    </h4>
                    <p
                        class="text-[11px] text-text-muted font-medium mt-0.5 truncate"
                    >
                        {restaurant.cuisines} • {restaurant.area}
                    </p>
                </div>
                <div class="text-right flex-shrink-0">
                    <div class="text-base font-bold text-text-primary">
                        ₹{restaurant.price || "1,200"}
                    </div>
                    <p
                        class="text-[9px] text-text-muted font-medium uppercase tracking-wide"
                    >
                        For two
                    </p>
                </div>
            </div>

            <!-- Meta Info Row -->
            <div class="flex items-center gap-3 pt-3 border-t border-gray-100">
                <div
                    class="flex items-center gap-1 text-[10px] font-semibold text-primary bg-primary/5 px-2 py-1 rounded-md"
                >
                    <Clock size={11} /> 25-35 MIN
                </div>
                <div
                    class="flex items-center gap-1 text-[10px] font-semibold text-success"
                >
                    <BadgeCheck size={12} class="fill-success/20" /> Safe handling
                </div>
            </div>
        </div>
    </div>
</a>
