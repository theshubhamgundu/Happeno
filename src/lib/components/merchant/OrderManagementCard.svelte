<script lang="ts">
    import type { Order } from "$lib/types";
    import StatusBadge from "$lib/components/StatusBadge.svelte";
    import { Printer, Receipt, ChevronRight } from "lucide-svelte";
    import { formatOrderTime } from "$lib/data/orders";
    import { fly } from "svelte/transition";
    import { cn } from "$lib/utils";

    let { order, i, onAction } = $props<{
        order: Order;
        i: number;
        onAction: (order: Order) => void;
    }>();

    const isActionable = $derived(
        order.status === "ready" ||
            (order.status === "served" && order.paymentStatus !== "paid"),
    );

    const getActionLabel = (status: string) => {
        if (status === "ready") return "MARK SERVED";
        if (status === "served") return "GENERATE BILL";
        return "VIEW DETAILS";
    };
</script>

<div
    class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-xl shadow-gray-200/5 group hover:shadow-2xl transition-all"
    in:fly={{ y: 20, delay: i * 100, duration: 500 }}
>
    <!-- Header -->
    <div class="flex justify-between items-start mb-6">
        <div class="flex items-center gap-4">
            <div
                class="w-14 h-14 rounded-2xl bg-gray-50 flex flex-col items-center justify-center border border-gray-100"
            >
                <span class="text-[8px] font-black text-gray-400 uppercase"
                    >TABLE</span
                >
                <span class="text-xl font-black text-gray-900"
                    >{order.tableNumber}</span
                >
            </div>
            <div>
                <div class="flex items-center gap-2 mb-1">
                    <h3 class="font-black text-gray-900 text-base">
                        {order.id}
                    </h3>
                    {#if order.paymentStatus === "paid"}
                        <span
                            class="px-2 py-0.5 bg-emerald-100 text-emerald-600 rounded text-[8px] font-black uppercase"
                            >PAID</span
                        >
                    {/if}
                </div>
                <p
                    class="text-[10px] font-bold text-gray-400 uppercase tracking-widest"
                >
                    {formatOrderTime(order.createdAt)}
                </p>
            </div>
        </div>
        <StatusBadge status={order.status} />
    </div>

    <!-- Items List -->
    <div
        class="bg-gray-50/50 rounded-2xl p-4 mb-6 border border-dashed border-gray-200"
    >
        <div class="space-y-2">
            {#each order.items as item}
                <div class="flex justify-between items-center text-xs">
                    <span class="font-medium text-gray-500"
                        >{item.quantity}x {item.name}</span
                    >
                    <span class="text-gray-400 font-bold"
                        >₹{item.price * item.quantity}</span
                    >
                </div>
            {/each}
        </div>
        <div
            class="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center"
        >
            <span class="text-[10px] font-black text-gray-300 uppercase"
                >Subtotal</span
            >
            <span class="text-lg font-black text-gray-900">₹{order.total}</span>
        </div>
    </div>

    <!-- Actions -->
    <div class="flex gap-3">
        <button
            onclick={() => onAction(order)}
            disabled={!isActionable}
            class={cn(
                "flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all shadow-lg active:scale-95",
                isActionable
                    ? "bg-primary text-white shadow-primary/20"
                    : "bg-gray-50 text-gray-300 shadow-none cursor-not-allowed",
            )}
        >
            {getActionLabel(order.status)}
        </button>
        <button
            class="px-5 py-4 bg-gray-50 text-gray-400 rounded-2xl active:scale-95 transition-all hover:bg-gray-100 hover:text-gray-600"
        >
            <Printer size={18} />
        </button>
    </div>
</div>
