<script lang="ts">
    import { ChevronRight } from "lucide-svelte";
</script>

<section class="px-4">
    <button
        class="w-full relative h-[150px] rounded-3xl overflow-hidden active:scale-[0.98] transition-transform group shadow-2xl"
    >
        <!-- Premium Multi-Layer Gradient Background -->
        <div
            class="absolute inset-0 bg-gradient-to-br from-[#7928CA] via-[#FF0080] to-[#FF4D4D] bg-[length:200%_200%] animate-gradient-x"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-tr from-[#4A00E0]/60 via-transparent to-[#FF6B35]/40"
        ></div>

        <div
            class="absolute top-0 left-1/4 w-32 h-32 bg-[#FF0080] rounded-full blur-3xl opacity-50 animate-pulse"
        ></div>
        <div
            class="absolute bottom-0 right-1/4 w-40 h-40 bg-[#7928CA] rounded-full blur-3xl opacity-40"
        ></div>
        <div
            class="absolute top-1/2 right-0 w-24 h-24 bg-[#FF4D4D] rounded-full blur-2xl opacity-60 animate-float"
        ></div>

        <div
            class="absolute inset-0 opacity-[0.03]"
            style="background-image: url('data:image/svg+xml,%3Csvg viewBox=%270 0 256 256%27 xmlns=%27http://www.w3.org/2000/svg%27%3E%3Cfilter id=%27noise%27%3E%3CfeTurbulence type=%27fractalNoise%27 baseFrequency=%270.9%27 numOctaves=%274%27 stitchTiles=%27stitch%27/%3E%3C/filter%3E%3Crect width=%27100%25%27 height=%27100%25%27 filter=%27url(%23noise)%27/%3E%3C/svg%3E');"
        ></div>
        <div
            class="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent bg-[length:200%_100%] animate-shimmer-fast"
        ></div>
        <div
            class="absolute inset-[1px] rounded-3xl border border-white/20"
        ></div>

        <div class="relative z-10 h-full flex flex-col justify-between p-5">
            <div class="flex items-start justify-between">
                <div>
                    <div class="flex items-center gap-2 mb-2">
                        <span class="relative flex h-2.5 w-2.5">
                            <span
                                class="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"
                            ></span>
                            <span
                                class="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"
                            ></span>
                        </span>
                        <span
                            class="text-[10px] font-bold text-white/90 uppercase tracking-widest"
                            >Live Offers</span
                        >
                    </div>
                    <h2
                        class="text-white font-black text-2xl leading-tight tracking-tight"
                    >
                        Up to <span class="text-3xl">50%</span> OFF
                    </h2>
                </div>
                <div
                    class="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 group-hover:bg-white/30 transition-all group-hover:scale-110"
                >
                    <ChevronRight
                        size={18}
                        class="text-white group-hover:translate-x-0.5 transition-transform"
                    />
                </div>
            </div>

            <div class="overflow-hidden">
                <div
                    class="flex items-center gap-4 animate-marquee whitespace-nowrap"
                >
                    {#each ["🍕 Pizza Hut - 40% OFF", "🍔 McDonald's - Buy 1 Get 1", "🍜 Chinese Wok - 30% OFF", "☕ Starbucks - Free Delivery"] as offer}
                        <span
                            class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
                        >
                            {offer}
                        </span>
                    {/each}
                    <!-- Duplicate for loop -->
                    {#each ["🍕 Pizza Hut - 40% OFF", "🍔 McDonald's - Buy 1 Get 1", "🍜 Chinese Wok - 30% OFF", "☕ Starbucks - Free Delivery"] as offer}
                        <span
                            class="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wide border border-white/20"
                        >
                            {offer}
                        </span>
                    {/each}
                </div>
            </div>
        </div>
    </button>
</section>
