<script lang="ts">
    import { onMount } from "svelte";
    import { fade, fly } from "svelte/transition";
    import {
        ChefHat,
        Clock,
        AlertCircle,
        Bell,
        History,
        LayoutGrid,
        Settings,
    } from "lucide-svelte";

    // Modular Components
    import KitchenTicketCard from "$lib/components/merchant/KitchenTicketCard.svelte";

    // Stores
    import { kitchenTicketsStore } from "$lib/stores/merchant";

    let filter = $state("active"); // active, rush, completed

    // Auto-increment elapsed time every minute
    onMount(() => {
        const interval = setInterval(() => {
            kitchenTicketsStore.update((tickets) =>
                tickets.map((t) => ({
                    ...t,
                    elapsedMinutes: t.elapsedMinutes + 1,
                })),
            );
        }, 60000);
        return () => clearInterval(interval);
    });

    let displayTickets = $derived.by(() => {
        let list = $kitchenTicketsStore;
        if (filter === "rush") return list.filter((t) => t.priority === "rush");
        return list;
    });

    function handleItemReady(orderId: string, itemName: string) {
        kitchenTicketsStore.update((tickets) =>
            tickets.map((t) => {
                if (t.orderId === orderId) {
                    return {
                        ...t,
                        items: t.items.map((i) =>
                            i.name === itemName
                                ? { ...i, isReady: !i.isReady }
                                : i,
                        ),
                    };
                }
                return t;
            }),
        );
    }

    function handleOrderComplete(orderId: string) {
        // In a real app, this would notify the waiter and move to completed
        kitchenTicketsStore.update((tickets) =>
            tickets.filter((t) => t.orderId !== orderId),
        );
    }
</script>

<div class="min-h-screen bg-[#0A0A0A] text-white p-6 pb-32">
    <!-- Dark Mode Header -->
    <header class="flex items-center justify-between mb-10">
        <div class="flex items-center gap-4">
            <div
                class="w-14 h-14 bg-emerald-500 rounded-[24px] flex items-center justify-center shadow-2xl shadow-emerald-500/20"
            >
                <ChefHat size={32} class="text-white" />
            </div>
            <div>
                <h1 class="text-2xl font-black uppercase tracking-tighter">
                    Kitchen Display
                </h1>
                <div class="flex items-center gap-2 text-gray-500">
                    <div
                        class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"
                    ></div>
                    <span
                        class="text-[10px] font-black uppercase tracking-widest leading-none"
                        >Live Terminal • HUB-01</span
                    >
                </div>
            </div>
        </div>

        <div class="flex gap-4">
            <button
                class="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-gray-400 active:scale-95 transition-all"
            >
                <Bell size={20} />
            </button>
            <button
                class="w-12 h-12 rounded-2xl bg-[#1A1A1A] border border-gray-800 flex items-center justify-center text-gray-400 active:scale-95 transition-all"
            >
                <Settings size={20} />
            </button>
        </div>
    </header>

    <!-- Filters -->
    <div class="flex gap-3 mb-10 overflow-x-auto no-scrollbar">
        {#each ["active", "rush", "completed"] as f}
            <button
                onclick={() => (filter = f)}
                class="flex-shrink-0 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all {filter ===
                f
                    ? 'bg-white text-black'
                    : 'bg-[#1A1A1A] text-gray-500 border border-gray-800'}"
            >
                {f}
                {#if f === "active"}<span class="ml-2 opacity-50"
                        >{$kitchenTicketsStore.length}</span
                    >{/if}
            </button>
        {/each}
    </div>

    <!-- Kitchen Grid -->
    {#if displayTickets.length > 0}
        <div
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
            {#each displayTickets as ticket (ticket.orderId)}
                <div in:fly={{ y: 20, duration: 500 }}>
                    <KitchenTicketCard
                        {ticket}
                        onReady={handleItemReady}
                        onComplete={handleOrderComplete}
                    />
                </div>
            {/each}
        </div>
    {:else}
        <div class="py-40 text-center space-y-6" in:fade>
            <div
                class="w-24 h-24 bg-[#1A1A1A] rounded-[40px] flex items-center justify-center mx-auto text-gray-800 border-2 border-dashed border-gray-800"
            >
                <LayoutGrid size={40} />
            </div>
            <p class="text-gray-600 font-bold uppercase tracking-[0.1em]">
                All clear! No orders in queue
            </p>
        </div>
    {/if}

    <!-- Quick Stats Footer -->
    <div
        class="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black via-black/95 to-transparent flex justify-center gap-12 z-50"
    >
        <div class="flex items-center gap-3">
            <p
                class="text-[10px] font-black text-gray-600 uppercase tracking-widest"
            >
                Avg Prep
            </p>
            <p class="text-xl font-black text-emerald-500">18:42</p>
        </div>
        <div class="flex items-center gap-3">
            <p
                class="text-[10px] font-black text-gray-600 uppercase tracking-widest"
            >
                Efficiency
            </p>
            <p class="text-xl font-black text-blue-500">94%</p>
        </div>
    </div>
</div>

<style>
    :global(body) {
        background-color: #0a0a0a;
    }
</style>
