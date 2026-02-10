<script lang="ts">
    import { Plus, Minus, Star } from "lucide-svelte";

    let {
        dish,
        quantity = 0,
        onAdd,
        onRemove,
    } = $props<{
        dish: any;
        quantity?: number;
        onAdd: () => void;
        onRemove: () => void;
    }>();
</script>

<div
    class="bg-white rounded-[28px] p-4 flex gap-4 shadow-xl shadow-gray-200/50 border border-gray-50 group active:scale-[0.98] transition-all relative overflow-hidden"
>
    {#if dish.bestSeller}
        <div class="absolute top-0 right-0 p-2">
            <span
                class="bg-orange-100 text-orange-600 text-[8px] font-black px-2 py-0.5 rounded-bl-xl uppercase tracking-tighter"
                >Bestseller</span
            >
        </div>
    {/if}
    <div class="w-24 h-24 rounded-2xl overflow-hidden shrink-0 relative">
        <img
            src={dish.img}
            alt={dish.name}
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div
            class="absolute top-2 left-2 w-4 h-4 rounded-sm border border-gray-200 bg-white flex items-center justify-center"
        >
            <div
                class="w-1.5 h-1.5 rounded-full {dish.type === 'veg'
                    ? 'bg-green-600'
                    : 'bg-red-600'}"
            ></div>
        </div>
    </div>
    <div class="flex-1 min-w-0">
        <div class="flex justify-between items-start">
            <h3
                class="font-black text-gray-900 text-base leading-tight truncate"
            >
                {dish.name}
            </h3>
            <div
                class="flex items-center gap-0.5 text-yellow-500 font-black text-xs"
            >
                <Star size={12} fill="currentColor" />
                <span>{dish.rating}</span>
            </div>
        </div>
        <p
            class="text-gray-400 text-[10px] leading-relaxed mt-1 line-clamp-2 font-medium italic"
        >
            "{dish.desc}"
        </p>
        <div class="flex justify-between items-center mt-3">
            <p class="text-primary font-black text-base">
                ₹{dish.price}
            </p>

            {#if quantity > 0}
                <div
                    class="flex items-center gap-3 bg-primary rounded-xl px-2 py-1.5 text-white shadow-md"
                >
                    <button
                        onclick={onRemove}
                        class="w-6 h-6 flex items-center justify-center"
                        aria-label="Remove one"><Minus size={14} /></button
                    >
                    <span class="text-sm font-black w-4 text-center"
                        >{quantity}</span
                    >
                    <button
                        onclick={onAdd}
                        class="w-6 h-6 flex items-center justify-center"
                        aria-label="Add one"><Plus size={14} /></button
                    >
                </div>
            {:else}
                <button
                    onclick={onAdd}
                    class="bg-white border-2 border-primary/20 text-primary font-black px-6 py-2 rounded-xl text-xs hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
                >
                    ADD +
                </button>
            {/if}
        </div>
    </div>
</div>
