<script lang="ts">
    import type { Offer } from "$lib/types";
    import { Sparkles, ArrowRight, Clock } from "lucide-svelte";
    import { formatDiscountString, formatExpiryTime } from "$lib/data/offers";
    import { fade, fly } from "svelte/transition";

    let { offers } = $props<{ offers: Offer[] }>();
    let activeIndex = $state(0);
</script>

{#if offers.length > 0}
    <section class="space-y-4">
        <div class="px-2 flex items-center justify-between">
            <h3
                class="text-[11px] font-black text-text-muted uppercase tracking-[0.2em]"
            >
                Exclusive Offers
            </h3>
            {#if offers.length > 1}
                <div class="flex gap-1.5">
                    {#each offers as _, i}
                        <div
                            class="w-1.5 h-1.5 rounded-full transition-all duration-300 {activeIndex ===
                            i
                                ? 'w-4 bg-primary'
                                : 'bg-gray-200'}"
                        ></div>
                    {/each}
                </div>
            {/if}
        </div>

        <div
            class="flex gap-4 overflow-x-auto no-scrollbar pb-4 -mx-2 px-2 snap-x"
        >
            {#each offers as offer, i}
                <div
                    class="flex-shrink-0 w-[300px] relative overflow-hidden rounded-[40px] p-8 bg-gradient-to-br from-primary to-pink-600 shadow-2xl shadow-primary/20 snap-center"
                    in:fly={{ x: 50, delay: i * 100, duration: 500 }}
                >
                    <div
                        class="absolute -top-12 -right-12 w-48 h-48 bg-white/20 rounded-full blur-3xl"
                    ></div>

                    <div class="relative flex items-center justify-between">
                        <div>
                            <div class="flex items-center gap-2 mb-2">
                                <Sparkles size={14} class="text-yellow-300" />
                                <span
                                    class="text-white font-black text-[10px] uppercase tracking-[0.2em] opacity-90"
                                    >Limited Offer</span
                                >
                            </div>
                            <p
                                class="text-4xl font-black text-white tracking-tight leading-none mb-1"
                            >
                                {formatDiscountString(
                                    offer.discountType,
                                    offer.discountValue,
                                )}
                            </p>
                            <p
                                class="text-white/90 text-xs font-bold uppercase tracking-wider"
                            >
                                {offer.itemName}
                            </p>
                        </div>
                    </div>

                    <div
                        class="mt-8 pt-5 border-t border-white/20 flex items-center justify-between"
                    >
                        <div class="flex items-center gap-1.5 text-white/80">
                            <Clock size={14} />
                            <span
                                class="font-black text-[9px] uppercase tracking-widest"
                                >{formatExpiryTime(offer.expiresAt)}</span
                            >
                        </div>
                        <button
                            class="w-10 h-10 rounded-full bg-white text-primary flex items-center justify-center shadow-lg active:scale-90 transition-transform"
                        >
                            <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            {/each}
        </div>
    </section>
{/if}
