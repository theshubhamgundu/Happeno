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
    UtensilsCrossed,
  } from "lucide-svelte";
  import Button from "$lib/components/Button.svelte";
  import { goto } from "$app/navigation";
  import {
    activeOffersStore,
    menuItemsStore,
    profileStore,
  } from "$lib/stores/merchant";

  let timeRange = $state("7D"); // 24H, 7D, 1M, 1Y

  // Mocked Data
  // We make stats derived so it updates when store changes
  let stats = $derived([
    {
      label: "Active Offers",
      value: $activeOffersStore.length.toString(),
      icon: Zap,
      color: "text-primary",
    },
    {
      label: "Expiring Soon",
      value: "0",
      subtext: "",
      icon: Clock,
      color: "text-urgency",
    },
    {
      label: "Total Views",
      value: "12,450",
      icon: Eye,
      color: "text-blue-500",
    },
  ]);

  const pastOffers = [
    {
      id: 101,
      item: "Weekend Combo",
      date: "Jan 15",
      views: 2500,
      likes: 230,
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 102,
      item: "Family Feast",
      date: "Jan 10",
      views: 1800,
      likes: 150,
      image:
        "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    },
  ];
</script>

<div class="px-4 py-6 pb-32 flex flex-col gap-6 bg-[#FFF5E1] min-h-screen">
  <!-- Header with generic add -->
  <header class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <LayoutDashboard class="text-primary" size={24} />
        Dashboard
      </h1>

      <div class="flex items-center gap-2">
        <a
          href="/merchant/create-offer"
          class="rounded-xl p-2.5 sm:px-4 sm:py-2 text-sm font-bold bg-[#FF69B4] text-white hover:bg-[#FF1493] transition-all shadow-md flex items-center gap-2"
        >
          <Plus size={20} />
          <span class="hidden sm:inline whitespace-nowrap">Custom Offer</span>
        </a>

        <a
          href="/merchant/history"
          class="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-primary hover:border-primary/50 transition-all shadow-sm"
          title="History"
        >
          <History size={20} />
        </a>
        <a
          href="/merchant/profile"
          class="p-1 rounded-full border border-slate-200 hover:border-primary/50 transition-all shadow-sm overflow-hidden w-10 h-10 flex items-center justify-center bg-white"
          title="Profile"
        >
          {#if $profileStore.image}
            <img
              src={$profileStore.image}
              alt="Profile"
              class="w-full h-full object-cover rounded-full"
            />
          {:else}
            <User size={20} class="text-slate-500" />
          {/if}
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
        <div class="text-2xl font-black text-slate-800 truncate">
          {$activeOffersStore.length}
        </div>
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

    <!-- NEW 4th Menu Card -->
    <button
      onclick={() => goto("/merchant/menu")}
      class="text-left bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-3 hover:border-orange-500/50 transition-all active:scale-95 group"
    >
      <div class="flex justify-between items-start">
        <div
          class="p-2.5 rounded-2xl bg-slate-50 group-hover:bg-orange-50 transition-colors"
        >
          <UtensilsCrossed size={18} class="text-orange-500" />
        </div>
      </div>
      <div>
        <div
          class="text-slate-500 text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Your Menu
        </div>
        <div class="text-2xl font-black text-slate-800 truncate">
          {$menuItemsStore.length}
        </div>
      </div>
    </button>
  </div>

  <!-- Menu Management Section (Collapsible) -->

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

    {#each $activeOffersStore as offer}
      <div
        class="bg-white p-4 rounded-[28px] border border-slate-100 shadow-sm relative overflow-hidden group flex gap-4 transition-all hover:border-primary/30"
      >
        <!-- Offer Image -->
        <div
          class="w-24 h-24 bg-slate-100 rounded-2xl shrink-0 overflow-hidden relative"
        >
          {#if offer.image}
            <img
              src={offer.image}
              alt={offer.item}
              class="w-full h-full object-cover"
            />
          {:else}
            <div
              class="w-full h-full flex items-center justify-center bg-slate-50 text-slate-300"
            >
              <UtensilsCrossed size={24} />
            </div>
          {/if}
          <!-- Discount Badge Overlay -->
          <div
            class="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[10px] font-black text-center py-1 backdrop-blur-sm"
          >
            {offer.discount}
          </div>
        </div>

        <div class="flex-1 flex flex-col justify-between py-1">
          <div class="flex justify-between items-start">
            <h3
              class="font-bold text-slate-800 text-base line-clamp-2 leading-tight"
            >
              {offer.item}
            </h3>
            <div
              class="px-2 py-1 bg-urgency/10 text-urgency text-[10px] font-bold rounded-lg flex items-center gap-1 shrink-0 whitespace-nowrap ml-2"
            >
              <Clock size={10} />
              {offer.expiry}
            </div>
          </div>

          <div
            class="flex items-center gap-4 border-t border-slate-50 pt-2 mt-1"
          >
            <div class="flex items-center gap-1.5 text-slate-500">
              <Eye size={14} />
              <span class="text-xs font-bold">{offer.views}</span>
            </div>
            <div class="flex items-center gap-1.5 text-primary">
              <ThumbsUp size={14} />
              <span class="text-xs font-bold">{offer.likes}</span>
            </div>
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
          class="p-4 border-b border-slate-50 last:border-0 flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-4 flex-1 overflow-hidden">
            <div
              class="w-12 h-12 bg-slate-100 rounded-xl overflow-hidden shrink-0"
            >
              {#if offer.image}
                <img
                  src={offer.image}
                  alt={offer.item}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed size={16} class="text-slate-300" />
                </div>
              {/if}
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="font-bold text-slate-800 text-sm line-clamp-1"
                >{offer.item}</span
              >
              <span class="text-[10px] font-bold text-slate-400"
                >{offer.date}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-4 shrink-0">
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
