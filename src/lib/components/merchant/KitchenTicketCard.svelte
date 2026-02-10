<script lang="ts">
    import type { KitchenTicket } from "$lib/types";
    import { Clock, CheckCircle2, Flame, AlertCircle } from "lucide-svelte";
    import { fly, fade } from "svelte/transition";
    import { cn } from "$lib/utils";

    let { ticket, onReady, onComplete } = $props<{
        ticket: KitchenTicket;
        onReady: (orderId: string, itemName: string) => void;
        onComplete: (orderId: string) => void;
    }>();

    let allReady = $derived(ticket.items.every((i) => i.isReady));
</script>

<div
    class={cn(
        "bg-[#1A1A1A] rounded-[32px] p-6 border-2 transition-all duration-500",
        ticket.priority === "rush"
            ? "border-rose-500/50 shadow-2xl shadow-rose-500/10"
            : "border-gray-800",
    )}
>
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div>
            <div class="flex items-center gap-3 mb-1">
                <span class="text-3xl font-black text-white"
                    >#{ticket.tableNumber}</span
                >
                {#if ticket.priority === "rush"}
                    <span
                        class="px-2 py-0.5 bg-rose-500 text-white rounded text-[8px] font-black uppercase tracking-widest animate-pulse"
                        >RUSH</span
                    >
                {/if}
            </div>
            <div class="flex items-center gap-2 text-gray-500">
                <Clock size={14} />
                <span class="text-[10px] font-black uppercase tracking-widest"
                    >{ticket.elapsedMinutes}M ELAPSED</span
                >
            </div>
        </div>
        <div class="text-right">
            <p
                class="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-1"
            >
                {ticket.orderId}
            </p>
            <div
                class={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                    allReady
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        : "bg-orange-500/10 text-orange-500 border-orange-500/20",
                )}
            >
                {allReady ? "ALL READY" : "COOKING"}
            </div>
        </div>
    </div>

    <!-- Items List -->
    <div class="space-y-3 mb-8">
        {#each ticket.items as item}
            <button
                onclick={() => onReady(ticket.orderId, item.name)}
                class={cn(
                    "w-full flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98]",
                    item.isReady
                        ? "bg-emerald-500/5 border border-emerald-500/20 opacity-40"
                        : "bg-[#222] border border-gray-800",
                )}
            >
                <div class="flex items-center gap-4">
                    <div
                        class={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center border",
                            item.isReady
                                ? "bg-emerald-500 border-emerald-500 text-white"
                                : "bg-transparent border-gray-700 text-gray-700",
                        )}
                    >
                        {#if item.isReady}
                            <CheckCircle2 size={14} />
                        {:else}
                            <div
                                class="w-1.5 h-1.5 rounded-full bg-gray-700"
                            ></div>
                        {/if}
                    </div>
                    <div class="text-left">
                        <p
                            class={cn(
                                "text-sm font-black tracking-tight",
                                item.isReady
                                    ? "text-emerald-500 line-through"
                                    : "text-white",
                            )}
                        >
                            {item.quantity}x {item.name}
                        </p>
                        {#if item.modifications}
                            <p
                                class="text-[9px] font-bold text-rose-400 uppercase tracking-wider"
                            >
                                {item.modifications}
                            </p>
                        {/if}
                    </div>
                </div>
            </button>
        {/each}
    </div>

    <!-- Actions -->
    <button
        disabled={!allReady}
        onclick={() => onComplete(ticket.orderId)}
        class={cn(
            "w-full py-4 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl",
            allReady
                ? "bg-emerald-500 text-white shadow-emerald-500/20 active:scale-95"
                : "bg-gray-800 text-gray-600 cursor-not-allowed",
        )}
    >
        {#if allReady}
            <CheckCircle2 size={18} />
            MARK ORDER READY
        {:else}
            WAITING FOR ITEMS...
        {/if}
    </button>
</div>
