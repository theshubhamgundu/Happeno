<script lang="ts">
    import { page } from "$app/stores";
    import { liveOrdersStore } from "$lib/stores/merchant";
    import { 
        ChevronLeft, 
        Clock, 
        ChefHat, 
        CheckCircle2, 
        Circle,
        MessageSquare,
        Phone
    } from "lucide-svelte";
    import { fade, fly, scale } from "svelte/transition";
    import { onMount } from "svelte";

    let orderId = $state("");
    let currentOrder = $derived($liveOrdersStore.find(o => o.id === orderId));

    onMount(() => {
        const saved = localStorage.getItem(`current_order_${$page.params.id}`);
        if (saved) {
            orderId = JSON.parse(saved).id;
        }
    });

    const steps = [
        { status: 'pending', icon: Clock, label: 'Order Confirmed', sub: 'The kitchen has received your order' },
        { status: 'preparing', icon: ChefHat, label: 'Preparing', sub: 'Our chef is crafting your meal' },
        { status: 'ready', icon: CheckCircle2, label: 'Ready to Serve', sub: 'Your food is hot and ready' }
    ];

    let activeStepIndex = $derived.by(() => {
        if (!currentOrder) return 0;
        if (currentOrder.status === 'pending') return 0;
        if (currentOrder.status === 'preparing') return 1;
        if (currentOrder.status === 'ready' || currentOrder.status === 'served') return 2;
        return 0;
    });
</script>

<div class="min-h-screen bg-[#FDFCFB] pb-32">
    <!-- Header -->
    <header class="bg-white/80 backdrop-blur-xl border-b border-gray-100 p-6 sticky top-0 z-50 flex items-center gap-4">
        <a href="/user/restaurant/{$page.params.id}" class="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400">
            <ChevronLeft size={20} />
        </a>
        <h1 class="text-xl font-black text-gray-900 uppercase tracking-tight">Live Tracking</h1>
    </header>

    <main class="p-6 max-w-xl mx-auto space-y-8">
        {#if currentOrder}
            <!-- Order ID & Table -->
            <div class="bg-white rounded-[32px] p-6 border border-gray-100 shadow-sm flex items-center justify-between" in:fly={{ y: 20 }}>
                <div>
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                    <p class="font-black text-gray-900">#{currentOrder.id.substring(0,8)}</p>
                </div>
                <div class="text-right">
                    <p class="text-[10px] font-black text-gray-400 uppercase tracking-widest">Table</p>
                    <p class="font-black text-primary">{currentOrder.tableNumber}</p>
                </div>
            </div>

            <!-- Visual Progress -->
            <div class="bg-white rounded-[40px] p-8 border border-gray-100 shadow-xl space-y-12 relative overflow-hidden">
                <!-- Vertical Line -->
                <div class="absolute left-[59px] top-20 bottom-24 w-1 bg-gray-50">
                    <div class="w-full bg-primary transition-all duration-1000" style="height: {(activeStepIndex / 2) * 100}%"></div>
                </div>

                {#each steps as step, i}
                    <div class="flex items-start gap-6 relative z-10">
                        <div class="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 {i <= activeStepIndex ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 'bg-gray-50 text-gray-300'}">
                            <step.icon size={24} />
                        </div>
                        <div>
                            <h3 class="font-black text-lg {i <= activeStepIndex ? 'text-gray-900' : 'text-gray-300 transition-colors'}">{step.label}</h3>
                            <p class="text-sm font-medium {i <= activeStepIndex ? 'text-gray-500' : 'text-gray-200 transition-colors'}">{step.sub}</p>
                        </div>
                        {#if i < activeStepIndex}
                            <div class="ml-auto text-emerald-500" in:scale>
                                <CheckCircle2 size={24} />
                            </div>
                        {/if}
                    </div>
                {/each}
            </div>

            <!-- Help & Support -->
            <div class="grid grid-cols-2 gap-4">
                <button class="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all">
                    <div class="p-3 bg-blue-50 text-blue-500 rounded-2xl">
                        <MessageSquare size={24} />
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-900">Call Waiter</span>
                </button>
                <button class="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col items-center gap-3 shadow-sm active:scale-95 transition-all">
                    <div class="p-3 bg-emerald-50 text-emerald-500 rounded-2xl">
                        <Phone size={24} />
                    </div>
                    <span class="text-[10px] font-black uppercase tracking-widest text-gray-900">Contact</span>
                </button>
            </div>
        {:else}
            <div class="flex flex-col items-center justify-center py-20 text-center" in:fade>
                <div class="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-200 mb-6">
                    <Clock size={40} />
                </div>
                <h2 class="text-xl font-black text-gray-900 uppercase">No Active Order</h2>
                <p class="text-sm text-gray-400 font-bold uppercase tracking-widest mt-2">Place an order to start tracking</p>
                <a href="/user/restaurant/{$page.params.id}" class="mt-8 bg-primary text-white px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">Back to Menu</a>
            </div>
        {/if}
    </main>
</div>
