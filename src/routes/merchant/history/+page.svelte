<script lang="ts">
  import {
    History as HistoryIcon,
    Calendar,
    Eye,
    ThumbsUp,
    Search,
    UtensilsCrossed,
  } from "lucide-svelte";
  import { page } from "$app/stores";
  import { goto } from "$app/navigation";
  import { activeOffersStore, pastOffersStore } from "$lib/stores/merchant";
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

    // Filter by status
    if (filter === "active") {
      // Show only offers that are Active (not Completed)
      return matches.filter(
        (h) => h.status === "Active" || h.status === "Expiring",
      );
    }
    if (filter === "expiring") {
      // Show only offers that are Expiring or have short expiry time
      return matches.filter(
        (h) =>
          h.status === "Expiring" ||
          (h.status === "Active" &&
            h.expiry &&
            (h.expiry.includes("m") ||
              h.expiry.includes("h") ||
              h.expiry.includes(":"))),
      );
    }
    if (filter === "views") {
      // Sort active offers by views
      return matches
        .filter((h) => h.status === "Active" || h.status === "Expiring")
        .sort((a, b) => b.views - a.views);
    }
    if (filter === "likes") {
      return [...matches].sort((a, b) => b.likes - a.likes);
    }
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
  <main class="px-4 md:px-8 lg:px-12 max-w-7xl mx-auto flex flex-col gap-6">
    <!-- Page Header -->
    <div
      class="flex flex-col md:flex-row md:items-center md:justify-between gap-4"
    >
      <div>
        <h1
          class="text-3xl font-heading font-extrabold text-text-primary capitalize mb-1"
        >
          {title}
        </h1>
        <p class="text-text-secondary font-medium">
          {#if filter === "all"}
            Review all your offers and broadcasts.
          {:else if filter === "active"}
            Currently running offers.
          {:else if filter === "expiring"}
            Offers expiring soon.
          {:else if filter === "views"}
            Your most viewed offers.
          {:else}
            Filtered by {filter} status.
          {/if}
        </p>
      </div>

      <!-- Filter Tabs -->
      <div class="flex flex-wrap gap-2">
        <button
          onclick={() => goto("/merchant/history")}
          class="px-4 py-2 rounded-xl text-sm font-bold transition-all {filter ===
          'all'
            ? 'bg-primary text-white'
            : 'bg-surface border border-border-peach text-text-muted hover:text-text-primary'}"
        >
          All
        </button>
        <button
          onclick={() => goto("/merchant/history?filter=active")}
          class="px-4 py-2 rounded-xl text-sm font-bold transition-all {filter ===
          'active'
            ? 'bg-success text-white'
            : 'bg-surface border border-border-peach text-text-muted hover:text-text-primary'}"
        >
          Active
        </button>
        <button
          onclick={() => goto("/merchant/history?filter=expiring")}
          class="px-4 py-2 rounded-xl text-sm font-bold transition-all {filter ===
          'expiring'
            ? 'bg-urgency text-white'
            : 'bg-surface border border-border-peach text-text-muted hover:text-text-primary'}"
        >
          Expiring
        </button>
        <button
          onclick={() => goto("/merchant/history?filter=views")}
          class="px-4 py-2 rounded-xl text-sm font-bold transition-all {filter ===
          'views'
            ? 'bg-blue-500 text-white'
            : 'bg-surface border border-border-peach text-text-muted hover:text-text-primary'}"
        >
          Most Viewed
        </button>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="relative w-full md:w-80">
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

    <!-- Offers Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {#each filteredHistory as item, i}
        <div
          use:reveal={{ delay: i * 50, x: 50 }}
          class="bg-surface p-4 rounded-[24px] border border-border-peach flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 hover:shadow-lg transition-all"
        >
          <!-- Image -->
          <div
            class="w-full h-40 bg-highlight rounded-2xl overflow-hidden relative"
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
                <UtensilsCrossed size={32} />
              </div>
            {/if}

            <!-- Discount Badge -->
            {#if item.discount}
              <span
                class="absolute top-3 right-3 px-2 py-1 bg-success text-white text-[10px] font-black uppercase tracking-wider rounded-lg shadow-lg"
              >
                {item.discount}
              </span>
            {/if}
          </div>

          <!-- Content -->
          <div class="flex-1 flex flex-col gap-2">
            <div class="flex items-center justify-between">
              <span
                class="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest"
              >
                <Calendar size={10} />
                {item.date}
              </span>
            </div>

            <h3
              class="text-base font-bold text-text-primary leading-tight line-clamp-1"
            >
              {item.item}
            </h3>

            {#if item.description}
              <p class="text-xs text-text-secondary line-clamp-2">
                {item.description}
              </p>
            {/if}

            <!-- Pricing -->
            <div class="flex items-baseline gap-2 mt-auto">
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

            <!-- Stats -->
            <div
              class="flex items-center gap-4 pt-3 border-t border-dashed border-border-peach/50"
            >
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-text-secondary"
              >
                <Eye size={14} class="text-blue-500" />
                {item.views}
              </div>
              <div
                class="flex items-center gap-1.5 text-xs font-bold text-text-secondary"
              >
                <ThumbsUp size={14} class="text-success" />
                {item.likes}
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
    </div>

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
