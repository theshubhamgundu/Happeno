<script lang="ts">
    import { fly } from "svelte/transition";
    import { ShoppingBag, ArrowRight } from "lucide-svelte";

    let {
        cartCount = 0,
        cartTotal = 0,
        onClick,
    } = $props<{
        cartCount: number;
        cartTotal: number;
        onClick: () => void;
    }>();
</script>

{#if cartCount > 0}
    <div
        in:fly={{ y: 100, duration: 400 }}
        class="fixed bottom-4 left-4 right-4 z-[70]"
    >
        <button
            onclick={onClick}
            class="w-full bg-gray-900 text-white p-5 rounded-[28px] flex items-center justify-between shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
        >
            <div class="flex items-center gap-4 relative">
                <div
                    class="bg-primary w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                    <ShoppingBag size={22} />
                    <span
                        class="absolute -top-1 -right-1 bg-white text-primary text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-primary"
                        >{cartCount}</span
                    >
                </div>
                <div class="text-left">
                    <p
                        class="text-[10px] font-black uppercase tracking-widest opacity-50 mb-0.5"
                    >
                        Bill Amount
                    </p>
                    <p class="text-xl font-black">₹{cartTotal}</p>
                </div>
            </div>

            <div class="flex items-center gap-2 relative">
                <span class="text-sm font-black uppercase tracking-widest"
                    >PROCEED</span
                >
                <ArrowRight
                    size={20}
                    class="group-hover:translate-x-1 transition-transform"
                />
            </div>
        </button>
    </div>
{/if}
