<script lang="ts">
  import {
    History as HistoryIcon,
    Clock,
    Users,
    Zap,
    Calendar,
    Eye,
    ThumbsUp,
    Search,
    UtensilsCrossed,
    ChevronLeft,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { activeOffersStore, pastOffersStore } from "$lib/stores/merchant";
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  import { reveal } from "$lib/actions/reveal";

  let filter = $derived($page.url.searchParams.get("filter") || "all");

  let searchQuery = $state("");

  let history = $derived([...$activeOffersStore, ...$pastOffersStore]);

  let filteredHistory = $derived.by(() => {
    let matches = history;

    // Search Filter
    if (searchQuery) {
      matches = matches.filter((h) =>
        h.item.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filter === "active")
      return matches.filter(
        (h) => !h.status || h.status === "Active" || h.status === "Expiring",
      );
    if (filter === "expiring")
      return matches.filter(
        (h) =>
          h.status === "Expiring" ||
          (h.status === "Active" && h.expiry.includes("m")),
      );
    if (filter === "views")
      return matches
        .filter((h) => h.status === "Active")
        .sort((a, b) => b.views - a.views);
    if (filter === "likes")
      return [...matches].sort((a, b) => b.likes - a.likes);
    return matches;
  });

  let title = $derived.by(() => {
    if (filter === "active") return "Active Offers";
    if (filter === "expiring") return "Expiring Soon";
    if (filter === "views") return "Most Viewed";
    if (filter === "likes") return "Top Liked";
    return "History";
  });
</script>

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300 pt-6">
  <main class="px-6 flex flex-col gap-6">
    <!-- Page Title -->
    <div>
      <h1
        class="text-3xl font-heading font-extrabold text-text-primary capitalize mb-1"
      >
        {title}
      </h1>
      <p class="text-text-secondary font-medium">
        {#if filter === "all"}
          Review your past broadcasts.
        {:else}
          Filtered by {filter} status.
        {/if}
      </p>
    </div>

    <!-- Search Bar -->
    <div class="relative">
      <Search
        class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted"
        size={20}
      />
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search offers..."
        class="w-full bg-surface border border-border-peach rounded-2xl py-3 pl-12 pr-4 text-text-primary focus:outline-none focus:border-primary/50 transition-all font-bold placeholder:font-normal"
      />
    </div>

    {#each filteredHistory as item, i}
      <div
        use:reveal={{ delay: i * 50, x: 50 }}
        class="bg-surface p-4 rounded-[32px] border border-border-peach flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-all shadow-sm"
      >
        <div class="flex gap-4">
          <!-- Image -->
          <div
            class="w-24 h-24 bg-highlight rounded-2xl shrink-0 overflow-hidden relative"
          >
            {#if item.image}
              <img
                src={item.image}
                alt={item.item}
                class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />
            {:else}
              <div
                class="w-full h-full flex items-center justify-center bg-highlight text-text-muted"
              >
                <UtensilsCrossed size={24} />
              </div>
            {/if}
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col gap-2">
            <div>
              <div class="flex justify-between items-start mb-1">
                <span
                  class="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest"
                >
                  <Calendar size={10} />
                  {item.date}
                </span>
                {#if item.discount}
                  <span
                    class="ml-2 px-1.5 py-0.5 bg-success/10 text-success text-[10px] font-black uppercase tracking-widest rounded-md whitespace-nowrap"
                  >
                    {item.discount}
                  </span>
                {/if}
              </div>

              <h3
                class="text-base font-bold text-text-primary leading-tight line-clamp-1"
              >
                {item.item}
              </h3>

              {#if item.description}
                <p class="text-xs text-text-secondary line-clamp-2 mt-1">
                  {item.description}
                </p>
              {/if}

              <!-- Pricing -->
              <div class="flex items-baseline gap-2 mt-2">
                {#if item.originalPrice}
                  <span class="text-xs text-text-muted line-through"
                    >₹{item.originalPrice}</span
                  >
                {/if}
                <span class="text-sm font-black text-primary">
                  {#if item.finalPrice}
                    ₹{item.finalPrice}
                  {:else}
                    {item.price || item.discount}
                  {/if}
                </span>
              </div>
            </div>

            <!-- Stats Mini -->
            <div
              class="flex items-center gap-3 mt-auto pt-2 border-t border-dashed border-border-peach/50"
            >
              <div
                class="flex items-center gap-1 text-xs font-bold text-text-secondary"
              >
                <Eye size={12} class="text-blue-500" />
                {item.views}
              </div>
              <div
                class="flex items-center gap-1 text-xs font-bold text-text-secondary"
              >
                <ThumbsUp size={12} class="text-success" />
                {item.likes}
              </div>
            </div>
          </div>
        </div>

        <!-- Status Footer -->
        <div
          class="flex items-center justify-between border-t border-border-peach pt-3"
        >
          <span
            class="text-xs font-bold flex items-center gap-1 {item.status ===
            'Active'
              ? 'text-success'
              : item.status === 'Expiring'
                ? 'text-urgency'
                : 'text-text-muted'}"
          >
            <div
              class="w-1.5 h-1.5 rounded-full {item.status === 'Active'
                ? 'bg-success animate-pulse'
                : item.status === 'Expiring'
                  ? 'bg-urgency animate-pulse'
                  : 'bg-text-muted'}"
            ></div>
            {item.status}
            {#if item.status !== "Completed" && item.expiry}
              <span class="ml-1 opacity-70">({item.expiry})</span>
            {/if}
          </span>
          <button class="text-xs font-bold text-primary hover:underline">
            {item.status === "Completed" ? "Re-broadcast" : "Manage"}
          </button>
        </div>
      </div>
    {/each}

    {#if filteredHistory.length === 0}
      <div
        class="py-20 flex flex-col items-center justify-center text-center opacity-50 px-12"
      >
        <HistoryIcon size={64} class="mb-4 text-text-muted" />
        <p class="font-bold text-text-secondary">
          No offers found matching "{searchQuery}".
        </p>
      </div>
    {/if}
  </main>
</div>
