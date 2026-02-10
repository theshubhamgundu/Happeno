<script lang="ts">
    import type { MenuItem, MenuCategory } from "$lib/types";
    import MenuCard from "$lib/components/MenuCard.svelte";
    import { Search, Filter } from "lucide-svelte";
    import { fly } from "svelte/transition";

    let { menuItems, categories } = $props<{
        menuItems: MenuItem[];
        categories: MenuCategory[];
    }>();

    let activeCategory = $state("all");
    let searchQuery = $state("");

    let filteredItems = $derived.by(() => {
        let list = [...menuItems];
        if (activeCategory !== "all") {
            list = list.filter((item) => item.category === activeCategory);
        }
        if (searchQuery) {
            list = list.filter(
                (item) =>
                    item.name
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()) ||
                    item.description
                        .toLowerCase()
                        .includes(searchQuery.toLowerCase()),
            );
        }
        return list;
    });
</script>

<div class="space-y-8 animate-in fade-in duration-500">
    <!-- Category & Search -->
    <div class="space-y-6">
        <div class="relative group">
            <Search
                size={18}
                class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            />
            <input
                bind:value={searchQuery}
                type="text"
                placeholder="Search in menu..."
                class="w-full h-12 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 text-sm font-bold placeholder:text-gray-400 focus:bg-white focus:border-primary/20 outline-none transition-all"
            />
        </div>

        <div class="flex gap-2 overflow-x-auto no-scrollbar py-2">
            <button
                onclick={() => (activeCategory = "all")}
                class="flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeCategory ===
                'all'
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'bg-white text-gray-400 border border-gray-100'}"
            >
                ALL
            </button>
            {#each categories as cat}
                <button
                    onclick={() => (activeCategory = cat.id)}
                    class="flex-shrink-0 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all {activeCategory ===
                    cat.id
                        ? 'bg-primary text-white shadow-lg shadow-primary/20'
                        : 'bg-white text-gray-400 border border-gray-100'}"
                >
                    {cat.name} ({cat.itemCount})
                </button>
            {/each}
        </div>
    </div>

    <!-- Items Grid -->
    {#if filteredItems.length > 0}
        <div class="grid gap-4">
            {#each filteredItems as item, i}
                <div in:fly={{ y: 20, delay: i * 50, duration: 400 }}>
                    <MenuCard {item} />
                </div>
            {/each}
        </div>
    {:else}
        <div class="py-20 text-center space-y-4">
            <div class="text-6xl text-gray-200">🍽️</div>
            <p class="text-gray-400 font-bold">
                No results found for "{searchQuery}"
            </p>
        </div>
    {/if}
</div>
