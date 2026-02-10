<script lang="ts">
    import { fade, scale } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import {
        ChevronLeft,
        Receipt,
        CreditCard,
        Banknote,
        X,
        Check,
        Timer,
        TrendingUp,
    } from "lucide-svelte";

    // Modular Components
    import OrderManagementCard from "$lib/components/merchant/OrderManagementCard.svelte";

    // Stores & Data
    import {
        liveOrdersStore,
        completedOrdersStore,
        merchantStatsStore,
    } from "$lib/stores/merchant";
    import type { Order } from "$lib/types";

    import { dbService } from "$lib/services/db";
    import { pdfService } from "$lib/services/pdf";
    import { profileStore } from "$lib/stores/merchant";

    let activeFilter = $state("active"); // active, completed
    let showBillModal = $state(false);
    let selectedOrder = $state<Order | null>(null);

    let displayOrders = $derived(
        activeFilter === "active" ? $liveOrdersStore : $completedOrdersStore,
    );

    function handleAction(order: Order) {
        if (order.status === "pending") {
            dbService.updateOrderStatus(order.id, 'preparing');
        } else if (order.status === "preparing") {
            dbService.updateOrderStatus(order.id, 'ready');
        } else if (order.status === "ready") {
            dbService.updateOrderStatus(order.id, 'served');
        } else if (order.status === "served") {
            selectedOrder = order;
            showBillModal = true;
        }
    }

    async function settlePayment(method: string) {
        if (!selectedOrder) return;

        // 1. Generate PDF Bill
        await pdfService.generateBill(selectedOrder, $profileStore.businessName);

        // 2. Clear from live and move to completed (via DB Service locally)
        liveOrdersStore.update((orders) =>
            orders.filter((o) => o.id !== selectedOrder!.id),
        );
        completedOrdersStore.update((orders) => [
            {
                ...selectedOrder!,
                status: "completed",
                paymentStatus: "paid",
                paymentMethod: method as any,
                updatedAt: new Date()
            },
            ...orders,
        ]);

        // 3. Update global stats
        merchantStatsStore.update((s) => ({
            ...s,
            liveOrders: s.liveOrders - 1,
            revenueToday: s.revenueToday + selectedOrder!.total,
        }));

        showBillModal = false;
        selectedOrder = null;
    }
</script>

<div class="min-h-screen bg-[#FDFCFB] pb-32">
    <!-- Premium Header -->
    <header
        class="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50"
    >
        <div class="flex items-center justify-between mb-2">
            <div class="flex items-center gap-4">
                <a
                    href="/merchant/dashboard"
                    class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400"
                >
                    <ChevronLeft size={20} />
                </a>
                <h1
                    class="text-xl font-black text-gray-900 uppercase tracking-tight"
                >
                    Orders Feed
                </h1>
            </div>
            <div
                class="bg-primary/5 px-4 py-2 rounded-2xl flex items-center gap-2"
            >
                <TrendingUp size={14} class="text-primary" />
                <span
                    class="text-[10px] font-black text-primary uppercase tracking-widest"
                    >₹{$merchantStatsStore.revenueToday}</span
                >
            </div>
        </div>

        <div class="flex gap-2 mt-4">
            <button
                onclick={() => (activeFilter = "active")}
                class="flex-1 py-3 rounded-2xl text-[10px] font-black transition-all {activeFilter ===
                'active'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-50 text-gray-400'}"
            >
                ACTIVE ({$liveOrdersStore.length})
            </button>
            <button
                onclick={() => (activeFilter = "completed")}
                class="flex-1 py-3 rounded-2xl text-[10px] font-black transition-all {activeFilter ===
                'completed'
                    ? 'bg-primary text-white shadow-lg'
                    : 'bg-gray-50 text-gray-400'}"
            >
                HISTORY ({$completedOrdersStore.length})
            </button>
        </div>
    </header>

    <main class="p-6 space-y-6">
        {#if displayOrders.length > 0}
            <div class="grid gap-6">
                {#each displayOrders as order, i (order.id)}
                    <OrderManagementCard {order} {i} onAction={handleAction} />
                {/each}
            </div>
        {:else}
            <div class="py-32 text-center" in:fade>
                <div
                    class="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center mx-auto mb-4 text-gray-200"
                >
                    <Timer size={40} />
                </div>
                <p class="text-gray-400 font-bold">
                    No {activeFilter} orders at the moment
                </p>
            </div>
        {/if}
    </main>

    <!-- Professional Settlement Modal -->
    {#if showBillModal && selectedOrder}
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div
            class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] p-6 flex items-center justify-center"
            transition:fade
        >
            <div
                class="bg-white w-full max-w-md rounded-[48px] p-8 shadow-2xl relative overflow-hidden"
                in:scale={{ duration: 400, easing: cubicOut }}
            >
                <button
                    onclick={() => (showBillModal = false)}
                    class="absolute top-8 right-8 text-gray-400"
                >
                    <X size={24} />
                </button>

                <div class="text-center mb-10">
                    <div
                        class="w-20 h-20 bg-emerald-50 text-emerald-500 rounded-[32px] flex items-center justify-center mx-auto mb-6"
                    >
                        <Receipt size={40} />
                    </div>
                    <h2 class="text-2xl font-black text-gray-900 leading-none">
                        Final Settlement
                    </h2>
                    <p
                        class="text-gray-400 font-bold uppercase tracking-widest text-[10px] mt-2"
                    >
                        Table {selectedOrder.tableNumber} • {selectedOrder.id}
                    </p>
                </div>

                <div class="bg-gray-50/50 rounded-[32px] p-8 mb-10 space-y-4">
                    <div
                        class="flex justify-between items-center text-gray-500 font-bold text-sm"
                    >
                        <span>Items Total</span>
                        <span>₹{selectedOrder.total}</span>
                    </div>
                    <div
                        class="flex justify-between items-center text-gray-500 font-bold text-sm"
                    >
                        <span>S.C. (5%)</span>
                        <span>₹{Math.floor(selectedOrder.total * 0.05)}</span>
                    </div>
                    <div
                        class="pt-4 border-t border-gray-200 flex justify-between items-center"
                    >
                        <span class="text-lg font-black text-gray-900"
                            >Total Payable</span
                        >
                        <span
                            class="text-4xl font-black text-primary tracking-tighter"
                            >₹{Math.floor(selectedOrder.total * 1.05)}</span
                        >
                    </div>
                </div>

                <div class="grid grid-cols-2 gap-4">
                    <button
                        onclick={() => settlePayment("upi")}
                        class="p-6 bg-[#F1F3F4] rounded-[32px] flex flex-col items-center gap-3 hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                    >
                        <CreditCard
                            size={28}
                            class="text-blue-500 group-hover:text-emerald-500"
                        />
                        <span
                            class="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-emerald-500"
                            >UPI / DIGITAL</span
                        >
                    </button>
                    <button
                        onclick={() => settlePayment("cash")}
                        class="p-6 bg-[#F1F3F4] rounded-[32px] flex flex-col items-center gap-3 hover:bg-emerald-50 hover:text-emerald-600 transition-all group"
                    >
                        <Banknote size={28} class="text-emerald-500" />
                        <span
                            class="text-[10px] font-black uppercase tracking-widest text-gray-900 group-hover:text-emerald-500"
                            >CASH</span
                        >
                    </button>
                </div>
            </div>
        </div>
    {/if}
</div>
