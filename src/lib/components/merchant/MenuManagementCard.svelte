<script lang="ts">
    import type { MenuItem } from "$lib/types";
    import { Pencil, Zap, Trash2, UtensilsCrossed } from "lucide-svelte";
    import { fly } from "svelte/transition";
    import { cn } from "$lib/utils";

    let { item, i, onEdit, onOffer, onDelete } = $props<{
        item: MenuItem;
        i: number;
        onEdit: (item: MenuItem) => void;
        onOffer: (item: MenuItem) => void;
        onDelete: (id: number) => void;
    }>();
</script>

<div
    in:fly={{ y: 20, duration: 400, delay: i * 100 }}
    class="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/5 overflow-hidden transition-all hover:border-primary/30 group hover:shadow-2xl duration-300"
>
    <!-- Image -->
    <div class="w-full h-48 bg-gray-50 overflow-hidden relative">
        {#if item.image}
            <img
                src={item.image}
                alt={item.name}
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
        {:else}
            <div
                class="w-full h-full flex items-center justify-center text-gray-200"
            >
                <UtensilsCrossed size={40} />
            </div>
        {/if}

        <!-- Price Badge -->
        <div
            class="absolute bottom-4 left-4 px-4 py-2 bg-white/90 backdrop-blur-md rounded-2xl font-black text-primary text-lg shadow-xl border border-white/20"
        >
            ₹{item.price}
        </div>

        <!-- Veg/Non-Veg Indicator -->
        <div
            class="absolute top-4 left-4 w-6 h-6 rounded-lg border border-white/50 bg-white/20 backdrop-blur-md flex items-center justify-center shadow-lg"
        >
            <div
                class={cn(
                    "w-2 h-2 rounded-full",
                    item.type === "veg"
                        ? "bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        : "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]",
                )}
            ></div>
        </div>
    </div>

    <!-- Content -->
    <div class="p-6 flex flex-col gap-2">
        <h3 class="font-black text-gray-900 text-lg line-clamp-1 truncate">
            {item.name}
        </h3>
        <p
            class="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed line-clamp-2 min-h-[2.5rem]"
        >
            {item.description || "No description provided."}
        </p>

        <!-- Actions -->
        <div
            class="flex items-center justify-end gap-2 pt-4 border-t border-gray-50 mt-4"
        >
            <button
                onclick={() => onEdit(item)}
                class="p-3 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all active:scale-90"
                title="Edit Item"
            >
                <Pencil size={18} />
            </button>
            <button
                onclick={() => onOffer(item)}
                class="p-3 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-2xl transition-all active:scale-90"
                title="Create Offer"
            >
                <Zap size={18} />
            </button>
            <button
                onclick={() => onDelete(item.id)}
                class="p-3 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all active:scale-90"
                title="Delete Item"
            >
                <Trash2 size={18} />
            </button>
        </div>
    </div>
</div>
