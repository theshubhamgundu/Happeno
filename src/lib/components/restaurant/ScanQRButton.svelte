<script lang="ts">
    import { fly } from "svelte/transition";
    import { ScanLine } from "lucide-svelte";

    let { show = true } = $props<{ show?: boolean }>();
</script>

{#if show}
    <div
        class="fixed bottom-24 left-1/2 -translate-x-1/2 z-[45]"
        in:fly={{ y: 50, duration: 600, delay: 400 }}
    >
        <a
            href="/user/scan"
            class="flex items-center gap-3 bg-gray-900 border border-white/20 text-white px-8 py-4 rounded-full shadow-2xl active:scale-95 transition-all group overflow-hidden relative"
        >
            <!-- Beam animation -->
            <div
                class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"
            ></div>

            <div class="relative flex items-center gap-3">
                <div
                    class="w-8 h-8 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20"
                >
                    <ScanLine size={18} />
                </div>
                <span class="text-[10px] font-black uppercase tracking-[0.2em]"
                    >Scan to Order</span
                >
            </div>
        </a>
    </div>
{/if}
