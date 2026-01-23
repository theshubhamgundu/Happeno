<script lang="ts">
  import {
    LayoutDashboard,
    Calendar,
    Users,
    Zap,
    TrendingUp,
    MoreHorizontal,
    Eye,
    ThumbsUp,
    Clock,
    Plus,
    History,
    Wallet,
    User,
  } from "lucide-svelte";
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";

  let timeRange = $state("7D"); // 24H, 7D, 1M, 1Y

  // Mocked Data
  const stats = [
    { label: "Active Offers", value: "3", icon: Zap, color: "text-primary" },
    {
      label: "Expiring Soon",
      value: "1",
      subtext: "in 24 hours",
      icon: Clock,
      color: "text-urgency",
    },
    {
      label: "Total Views",
      value: "12,450",
      icon: Eye,
      color: "text-blue-500",
    },
    {
      label: "Total Likes",
      value: "892",
      icon: ThumbsUp,
      color: "text-success",
    },
  ];

  const activeOffers = [
    {
      id: 1,
      item: "Spicy Chicken Burger",
      price: "₹199",
      discount: "50% OFF",
      views: 1204,
      likes: 85,
      expiry: "2h 15m",
    },
    {
      id: 2,
      item: "Cold Coffee",
      price: "₹120",
      discount: "Buy 1 Get 1",
      views: 850,
      likes: 120,
      expiry: "5h 30m",
    },
  ];

  const pastOffers = [
    { id: 101, item: "Weekend Combo", date: "Jan 15", views: 2500, likes: 230 },
    { id: 102, item: "Family Feast", date: "Jan 10", views: 1800, likes: 150 },
  ];
</script>

<div class="px-4 py-6 pb-32 flex flex-col gap-6 bg-slate-50 min-h-screen">
  <!-- Header Actions -->
  <header class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <LayoutDashboard class="text-primary" size={24} />
        Dashboard
      </h1>

      <div class="flex items-center gap-2">
        <Button
          onclick={() => goto("/merchant/create-offer")}
          class="rounded-xl px-4 py-2 text-sm shadow-lg shadow-primary/20 mr-2"
        >
          <Plus size={18} class="mr-1" /> Create
        </Button>

        <a
          href="/merchant/history"
          class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          title="History"
        >
          <History size={20} />
        </a>
        <a
          href="/merchant/wallet"
          class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          title="Wallet"
        >
          <Wallet size={20} />
        </a>
        <a
          href="/merchant/profile"
          class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          title="Settings"
        >
          <User size={20} />
        </a>
      </div>
    </div>
  </header>

  <!-- Summary Stats Grid -->
  <div class="grid grid-cols-2 gap-3">
    <button
      onclick={() => goto("/merchant/history?filter=active")}
      class="text-left bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-primary/50 transition-all active:scale-95"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-slate-50">
          <Zap size={18} class="text-primary" />
        </div>
      </div>
      <div>
        <div
          class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Active Offers
        </div>
        <div class="text-2xl font-black text-slate-800 truncate">3</div>
      </div>
    </button>

    <button
      onclick={() => goto("/merchant/history?filter=expiring")}
      class="text-left bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-urgency/50 transition-all active:scale-95"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-slate-50">
          <Clock size={18} class="text-urgency" />
        </div>
      </div>
      <div>
        <div
          class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Expiring Soon
        </div>
        <div class="text-2xl font-black text-slate-800 truncate">1</div>
        <div class="text-[10px] font-bold text-urgency mt-1">in 24 hours</div>
      </div>
    </button>

    <button
      onclick={() => goto("/merchant/history?filter=views")}
      class="text-left bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-blue-500/50 transition-all active:scale-95"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-slate-50">
          <Eye size={18} class="text-blue-500" />
        </div>
      </div>
      <div>
        <div
          class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Total Views
        </div>
        <div class="text-2xl font-black text-slate-800 truncate">12,450</div>
      </div>
    </button>

    <button
      onclick={() => goto("/merchant/history?filter=likes")}
      class="text-left bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-success/50 transition-all active:scale-95"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-slate-50">
          <ThumbsUp size={18} class="text-success" />
        </div>
      </div>
      <div>
        <div
          class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Total Likes
        </div>
        <div class="text-2xl font-black text-slate-800 truncate">892</div>
      </div>
    </button>
  </div>

  <!-- Customer Reach Graph -->
  <div class="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-slate-800">Customer Reach</h2>
      <div class="flex gap-1 bg-slate-50 p-1 rounded-xl">
        <button
          class="px-3 py-1 text-[10px] font-bold rounded-lg transition-colors {timeRange ===
          '7D'
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-400'}"
          onclick={() => (timeRange = "7D")}
        >
          Day
        </button>
        <button
          class="px-3 py-1 text-[10px] font-bold rounded-lg transition-colors {timeRange ===
          '1M'
            ? 'bg-white text-primary shadow-sm'
            : 'text-slate-400'}"
          onclick={() => (timeRange = "1M")}
        >
          Month
        </button>
      </div>
    </div>

    <!-- CSS Chart Simulation -->
    <div class="relative h-40 w-full">
      <div
        class="absolute inset-0 flex flex-col justify-between text-xs text-slate-300"
      >
        <div class="border-b border-dashed border-slate-100 w-full h-0"></div>
        <div class="border-b border-dashed border-slate-100 w-full h-0"></div>
        <div class="border-b border-dashed border-slate-100 w-full h-0"></div>
      </div>

      <svg
        class="absolute inset-0 w-full h-full overflow-visible"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        <path
          d="M0,80 C20,70 40,40 60,50 S80,20 100,30 V100 H0 Z"
          fill="url(#gradient)"
          opacity="0.15"
        />
        <path
          d="M0,80 C20,70 40,40 60,50 S80,20 100,30"
          fill="none"
          class="stroke-primary"
          stroke-width="3"
          stroke-linecap="round"
          vector-effect="non-scaling-stroke"
        />
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="var(--color-primary)" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div
      class="flex justify-between text-[10px] text-slate-400 font-bold mt-4 uppercase"
    >
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span
        >Fri</span
      ><span>Sat</span><span>Sun</span>
    </div>
  </div>

  <!-- Active Offers List -->
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        Live Offers
      </h2>
    </div>

    {#each activeOffers as offer}
      <div
        class="bg-white p-5 rounded-[28px] border border-slate-100 shadow-sm relative overflow-hidden group"
      >
        <div class="flex justify-between items-start mb-2">
          <div>
            <h3 class="font-bold text-slate-800 text-lg leading-tight">
              {offer.item}
            </h3>
            <div class="text-primary font-black text-sm mt-0.5">
              {offer.discount}
            </div>
          </div>
          <div
            class="px-2.5 py-1 bg-urgency/10 text-urgency text-[10px] font-bold rounded-lg flex items-center gap-1"
          >
            <Clock size={10} />
            {offer.expiry} left
          </div>
        </div>

        <div class="flex items-center gap-4 mt-3 pt-3 border-t border-slate-50">
          <div class="flex items-center gap-1.5 text-slate-500">
            <Eye size={14} />
            <span class="text-xs font-bold">{offer.views} Views</span>
          </div>
          <div class="flex items-center gap-1.5 text-primary">
            <ThumbsUp size={14} />
            <span class="text-xs font-bold">{offer.likes} Likes</span>
          </div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Offers History -->
  <div class="flex flex-col gap-4 mt-2">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-bold text-slate-800 flex items-center gap-2">
        <History size={18} class="text-slate-400" />
        Past Offers
      </h2>
      <button class="text-xs font-bold text-primary">View All</button>
    </div>

    <div
      class="bg-white rounded-[28px] border border-slate-100 overflow-hidden"
    >
      {#each pastOffers as offer}
        <div
          class="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between"
        >
          <div class="flex flex-col">
            <span class="font-bold text-slate-800 text-sm">{offer.item}</span>
            <span class="text-[10px] font-bold text-slate-400"
              >{offer.date}</span
            >
          </div>
          <div class="flex items-center gap-4">
            <div class="text-right">
              <div class="text-xs font-bold text-slate-600">{offer.views}</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase">
                Views
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-primary">{offer.likes}</div>
              <div class="text-[9px] font-bold text-slate-400 uppercase">
                Likes
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
