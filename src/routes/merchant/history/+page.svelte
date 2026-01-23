<script lang="ts">
  import {
    History as HistoryIcon,
    Clock,
    Users,
    Zap,
    Calendar,
    Eye,
    ThumbsUp,
  } from "lucide-svelte";
  import { page } from "$app/stores";

  let filter = $derived($page.url.searchParams.get("filter") || "all");

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
    },
  ];

  let filteredHistory = $derived.by(() => {
    if (filter === "active")
      return history.filter((h) => h.status === "Active");
    if (filter === "expiring")
      return history.filter(
        (h) =>
          h.status === "Expiring" ||
          (h.status === "Active" && h.expiry.includes("m")),
      );
    if (filter === "views")
      return [...history].sort((a, b) => b.views - a.views);
    if (filter === "likes")
      return [...history].sort((a, b) => b.likes - a.likes);
    return history;
  });

  let title = $derived.by(() => {
    if (filter === "active") return "Active Offers";
    if (filter === "expiring") return "Expiring Soon";
    if (filter === "views") return "Most Viewed";
    if (filter === "likes") return "Top Liked";
    return "History";
  });
</script>

<div class="min-h-screen bg-bg-app pb-24">
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
    {#each filteredHistory as item}
      <div
        class="bg-white p-6 rounded-[32px] border border-border-peach flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-all"
      >
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1">
            <span
              class="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest"
            >
              <Calendar size={10} />
              {item.date}
            </span>
            <h3 class="text-lg font-bold text-text-primary leading-tight">
              {item.title}
            </h3>
          </div>
          <div class="flex flex-col items-end gap-1">
            <div
              class="px-3 py-1 bg-highlight text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full"
            >
              {item.price}
            </div>
          </div>
        </div>

        <div
          class="grid grid-cols-2 gap-4 py-4 border-y border-border-peach/50"
        >
          <div class="flex flex-col gap-1">
            <span
              class="text-[10px] font-bold text-text-muted uppercase tracking-widest text-[8px]"
              >Engagement</span
            >
            <div class="flex gap-3">
              <div
                class="flex items-center gap-1 text-sm font-bold text-text-primary"
              >
                <Eye size={14} class="text-blue-500" />
                {item.views}
              </div>
              <div
                class="flex items-center gap-1 text-sm font-bold text-text-primary"
              >
                <ThumbsUp size={14} class="text-success" />
                {item.likes}
              </div>
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <span
              class="text-[10px] font-bold text-text-muted uppercase tracking-widest text-[8px]"
              >Total Reach</span
            >
            <div
              class="flex items-center gap-1.5 text-text-primary font-bold text-sm"
            >
              <Users size={14} class="text-primary" />
              {item.reach}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span
            class="text-xs font-bold flex items-center gap-1 {item.status ===
            'Active'
              ? 'text-success'
              : item.status === 'Expiring'
                ? 'text-urgency'
                : 'text-slate-400'}"
          >
            <div
              class="w-1.5 h-1.5 rounded-full {item.status === 'Active'
                ? 'bg-success animate-pulse'
                : item.status === 'Expiring'
                  ? 'bg-urgency animate-pulse'
                  : 'bg-slate-400'}"
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
        <HistoryIcon size={64} class="mb-4" />
        <p class="font-bold text-text-secondary">
          No offers found for "{filter}".
        </p>
      </div>
    {/if}
  </main>
</div>
