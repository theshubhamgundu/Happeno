<script lang="ts">
    import { fade, fly } from "svelte/transition";
    import { cubicOut } from "svelte/easing";
    import {
        ShoppingBag,
        Minus,
        Plus,
        Sparkles,
        X,
        Flame,
    } from "lucide-svelte";
    import { cartStore } from "$lib/stores/user";
    import { mockUpsellItems } from "$lib/data/upsells";
    import { cn } from "$lib/utils";

    let { show = $bindable(), onPlaceOrder } = $props<{
        show: boolean;
        onPlaceOrder: () => void;
    }>();

    let cartTotal = $derived($cartStore.subtotal);
    let cartItems = $derived($cartStore.items);

    function add(item: any) {
        cartStore.addItem({
            menuItemId: item.menuItemId || item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
        });
    }

    function remove(id: number) {
        cartStore.removeItem(id);
    }
</script>

{#if show}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
        class="fixed inset-0 bg-black/60 backdrop-blur-sm z-[80]"
        onclick={() => (show = false)}
        transition:fade={{ duration: 200 }}
    ></div>

    <div
        class="fixed bottom-0 left-0 right-0 bg-white rounded-t-[48px] z-[90] p-8 pt-12 shadow-2xl"
        in:fly={{ y: "100%", duration: 500, easing: cubicOut }}
        out:fly={{ y: "100%", duration: 400 }}
    >
        <button
            onclick={() => (show = false)}
            class="absolute top-5 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-100 rounded-full"
        ></button>

        <div class="flex items-center justify-between mb-8">
            <h2 class="text-3xl font-black text-gray-900 tracking-tighter">
                Your Table Cart
            </h2>
            <div
                class="flex items-center gap-2 text-primary font-black text-[10px] bg-primary/10 px-4 py-2 rounded-xl uppercase tracking-widest"
            >
                <Flame size={14} />
                <span>Quick Serve</span>
            </div>
        </div>

        <!-- Cart Items -->
        <div
            class="max-h-[300px] overflow-y-auto no-scrollbar space-y-4 pr-1 mb-8"
        >
            {#each cartItems as item}
                <div
                    class="flex items-center justify-between bg-gray-50/50 p-5 rounded-[28px] border border-gray-100"
                >
                    <div class="flex items-center gap-4">
                        {#if item.image}
                            <img
                                src={item.image}
                                alt=""
                                class="w-14 h-14 rounded-2xl object-cover shadow-md"
                            />
                        {:else}
                            <div
                                class="w-14 h-14 rounded-2xl bg-gray-200 animate-pulse"
                            ></div>
                        {/if}
                        <div>
                            <h4
                                class="font-black text-gray-900 text-sm leading-none mb-1"
                            >
                                {item.name}
                            </h4>
                            <p class="text-primary font-black text-xs">
                                ₹{item.price}
                            </p>
                        </div>
                    </div>
                    <div
                        class="flex items-center gap-3 bg-white rounded-2xl px-3 py-2 shadow-sm border border-gray-100"
                    >
                        <button
                            onclick={() => remove(item.menuItemId)}
                            class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary"
                            ><Minus size={14} /></button
                        >
                        <span
                            class="text-sm font-black w-4 text-center text-gray-900"
                            >{item.quantity}</span
                        >
                        <button
                            onclick={() => add(item)}
                            class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-primary"
                            ><Plus size={14} /></button
                        >
                    </div>
                </div>
            {/each}
        </div>

        <!-- Upsell Section -->
        <div class="mb-10">
            <h3
                class="text-[11px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"
            >
                <Sparkles size={16} class="text-yellow-500" />
                Ditch the thirst?
            </h3>
            <div class="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {#each mockUpsellItems as item}
                    <button
                        onclick={() => add({ ...item, menuItemId: item.id })}
                        class="flex-shrink-0 w-48 bg-blue-50/30 p-4 rounded-3xl flex items-center gap-4 border border-blue-100/50 hover:bg-blue-50 active:scale-95 transition-all group"
                    >
                        <img
                            src={item.image}
                            alt=""
                            class="w-12 h-12 rounded-xl object-cover shadow-sm group-hover:scale-110 transition-transform"
                        />
                        <div class="text-left">
                            <p
                                class="text-[10px] font-black text-gray-900 uppercase tracking-tight line-clamp-1"
                            >
                                {item.name}
                            </p>
                            <p
                                class="text-[10px] text-primary font-black mt-0.5"
                            >
                                +₹{item.price}
                            </p>
                        </div>
                    </button>
                {/each}
            </div>
        </div>

        <!-- Checkout Actions -->
        <div class="space-y-4">
            <div class="flex justify-between items-center px-2">
                <span
                    class="font-black text-gray-400 uppercase tracking-widest text-xs"
                    >Payable Amount</span
                >
                <span class="font-black text-3xl text-gray-900 tracking-tighter"
                    >₹{cartTotal}</span
                >
            </div>

            <div class="flex gap-4">
                <button
                    onclick={onPlaceOrder}
                    class="flex-[3] bg-primary text-white py-6 rounded-3xl font-black text-sm shadow-2xl shadow-primary/30 flex items-center justify-center gap-3 active:scale-95 transition-all group"
                >
                    <ShoppingBag
                        size={20}
                        class="group-hover:scale-110 transition-transform"
                    />
                    PLACE ORDER NOW
                </button>
                <button
                    class="flex-1 bg-gray-100 text-gray-900 rounded-3xl font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all"
                >
                    CASH
                </button>
            </div>
        </div>
    </div>
{/if}
