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
  } from "lucide-svelte";
  import { page } from "$app/stores";

  let filter = $derived($page.url.searchParams.get("filter") || "all");

  let searchQuery = $state("");

  const history = [
    {
      id: "1",
      title: "Weekend Flash Sale",
      date: "21 Jan 2026",
      reach: "1,240",
      radius: "5km",
      status: "Completed",
      price: "₹200",
      views: 2400,
      likes: 150,
      expiry: "Ended",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "2",
      title: "Evening Rush Offer",
      date: "19 Jan 2026",
      reach: "850",
      radius: "3km",
      status: "Completed",
      price: "₹120",
      views: 850,
      likes: 80,
      expiry: "Ended",
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "3",
      title: "New Launch Promo",
      date: "15 Jan 2026",
      reach: "2,100",
      radius: "10km",
      status: "Completed",
      price: "₹500",
      views: 3200,
      likes: 450,
      expiry: "Ended",
      image:
        "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "4",
      title: "Spicy Chicken Burger",
      date: "Today",
      reach: "450",
      radius: "3km",
      status: "Active",
      price: "₹199",
      views: 1204,
      likes: 85,
      expiry: "2h 15m",
      image:
        "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "5",
      title: "Cold Coffee BOGO",
      date: "Today",
      reach: "120",
      radius: "1km",
      status: "Active",
      price: "₹120",
      views: 850,
      likes: 120,
      expiry: "5h 30m",
      image:
        "https://images.unsplash.com/photo-1461023058926-03fcc68e60a0?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: "6",
      title: "Midnight Snack Deal",
      date: "Tomorrow",
      reach: "600",
      radius: "5km",
      status: "Expiring",
      price: "₹150",
      views: 900,
      likes: 95,
      expiry: "30m",
      image:
        "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&w=400&q=80",
    },
  ];

  let filteredHistory = $derived.by(() => {
    let matches = history;

    // Search Filter
    if (searchQuery) {
      matches = matches.filter((h) =>
        h.title.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }

    if (filter === "active")
      return matches.filter((h) => h.status === "Active");
    if (filter === "expiring")
      return matches.filter(
        (h) =>
          h.status === "Expiring" ||
          (h.status === "Active" && h.expiry.includes("m")),
      );
    if (filter === "views")
      return [...matches].sort((a, b) => b.views - a.views);
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

<div class="min-h-screen bg-bg-app pb-24 transition-colors duration-300">
  <header class="p-8">
    <div class="flex flex-col gap-1">
      <h1
        class="text-3xl font-heading font-extrabold text-text-primary capitalize"
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
  </header>

  <main class="px-6 flex flex-col gap-6">
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

    {#each filteredHistory as item}
      <div
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
                alt={item.title}
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
            <div class="flex justify-between items-start">
              <div class="flex flex-col gap-1">
                <span
                  class="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest"
                >
                  <Calendar size={10} />
                  {item.date}
                </span>
                <h3
                  class="text-base font-bold text-text-primary leading-tight line-clamp-2"
                >
                  {item.title}
                </h3>
              </div>
              <div
                class="px-2 py-1 bg-highlight text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full whitespace-nowrap"
              >
                {item.price}
              </div>
            </div>

            <!-- Stats Mini -->
            <div class="flex items-center gap-3 mt-auto">
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
              <div
                class="flex items-center gap-1 text-xs font-bold text-text-secondary ml-auto"
              >
                <Users size={12} class="text-primary" />
                {item.reach}
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
