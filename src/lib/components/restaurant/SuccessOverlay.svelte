<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { backOut } from "svelte/easing";
    import { CheckCircle2, PartyPopper } from "lucide-svelte";

    let { show = false, tableNumber = "4", restaurantId = "", onClose = () => {} } = $props<{
        show: boolean;
        tableNumber?: string;
        restaurantId?: string;
        onClose?: () => void;
    }>();
</script>

{#if show}
    <div
        class="fixed inset-0 z-[100] flex items-center justify-center p-6"
        transition:fade={{ duration: 300 }}
    >
        <div class="absolute inset-0 bg-white/80 backdrop-blur-2xl"></div>
        <div
            class="relative text-center space-y-8"
            in:scale={{ start: 0.5, duration: 600, easing: backOut }}
        >
            <div class="relative inline-block">
                <div
                    class="absolute inset-0 bg-emerald-100 rounded-full scale-150 animate-ping opacity-20"
                ></div>
                <div
                    class="w-32 h-32 bg-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-emerald-500/30"
                >
                    <CheckCircle2 size={64} class="text-white" />
                </div>
            </div>

            <div class="space-y-2">
                <h2 class="text-4xl font-black text-gray-900 tracking-tighter">
                    ORDER PLACED!
                </h2>
                <p
                    class="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs"
                >
                    Ticket #HAP-429 • Table {tableNumber}
                </p>
            </div>

            <div class="flex flex-col gap-3 w-full max-w-xs mx-auto">
                <a
                    href="/user/restaurant/{restaurantId}/order/track"
                    class="w-full bg-primary text-white py-5 rounded-[24px] font-black text-[12px] uppercase tracking-[0.2em] shadow-2xl shadow-primary/30 active:scale-95 transition-all block"
                >
                    Track My Order
                </a>
                <button
                    onclick={onClose}
                    class="w-full bg-gray-50 text-gray-400 py-4 rounded-[20px] font-bold text-xs"
                >
                    Dismiss
                </button>
            </div>
        </div>
    </div>
{/if}
