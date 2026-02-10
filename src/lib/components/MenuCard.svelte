<script lang="ts">
    import type { MenuItem } from "$lib/types";
    import { Plus, Minus, Star, Flame } from "lucide-svelte";
    import { cn } from "$lib/utils";
    import { cartStore } from "$lib/stores/user";
    import { fade, scale } from "svelte/transition";

    let { item, class: className = "" } = $props<{
        item: MenuItem;
        class?: string;
    }>();

    let quantity = $derived(
        $cartStore.items.find((i) => i.menuItemId === item.id)?.quantity || 0,
    );

    function add() {
        cartStore.addItem({
            menuItemId: item.id,
            name: item.name,
            price: item.price,
            quantity: 1,
            image: item.image,
        });
    }

    function remove() {
        cartStore.removeItem(item.id);
    }
</script>

<div
    class={cn(
        "bg-white rounded-[28px] p-4 flex gap-4 shadow-xl shadow-gray-200/50 border border-gray-50 group active:scale-[0.99] transition-all",
        className,
    )}
>
    <!-- Image -->
    <div class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
        <img
            src={item.image}
            alt={item.name}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
            class="absolute top-2 left-2 w-4 h-4 rounded-sm border border-gray-200 bg-white flex items-center justify-center"
        >
            <div
                class="w-1.5 h-1.5 rounded-full {item.type === 'veg'
                    ? 'bg-green-600'
                    : 'bg-red-600'}"
            ></div>
        </div>
        {#if item.bestSeller}
            <div
                class="absolute bottom-0 left-0 right-0 bg-orange-500 text-white text-[8px] font-black uppercase tracking-widest py-1 text-center"
            >
                Bestseller
            </div>
        {/if}
    </div>

    <!-- Content -->
    <div class="flex-1 min-w-0 flex flex-col">
        <div class="flex justify-between items-start">
            <h3
                class="font-black text-gray-900 text-base leading-tight truncate"
            >
                {item.name}
            </h3>
            <div
                class="flex items-center gap-0.5 text-yellow-500 font-black text-xs"
            >
                <Star size={12} fill="currentColor" />
                <span>{item.rating}</span>
            </div>
        </div>

        <p
            class="text-gray-400 text-[10px] leading-relaxed mt-1 line-clamp-2 font-medium italic"
        >
            "{item.description}"
        </p>

        <div class="flex justify-between items-center mt-auto pt-3">
            <p class="text-primary font-black text-lg">₹{item.price}</p>

            {#if quantity > 0}
                <div
                    class="flex items-center gap-3 bg-primary rounded-xl px-2 py-1.5 text-white shadow-lg shadow-primary/20"
                    transition:scale={{ duration: 200 }}
                >
                    <button
                        onclick={remove}
                        class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Minus size={14} />
                    </button>
                    <span class="text-sm font-black w-4 text-center"
                        >{quantity}</span
                    >
                    <button
                        onclick={add}
                        class="w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-lg transition-colors"
                    >
                        <Plus size={14} />
                    </button>
                </div>
            {:else}
                <button
                    onclick={add}
                    class="bg-white border-2 border-primary/20 text-primary font-black px-6 py-2 rounded-xl text-xs hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                >
                    ADD +
                </button>
            {/if}
        </div>
    </div>
</div>
