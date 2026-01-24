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
  import { fly, fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

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

<div
  class="px-4 py-6 pb-32 flex flex-col gap-6 bg-bg-app min-h-screen transition-colors duration-300"
  in:fade={{ duration: 300 }}
>
  <!-- Header with generic add -->
  <header class="flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-text-primary flex items-center gap-2">
        <LayoutDashboard class="text-primary" size={24} />
        Dashboard
      </h1>

      <div class="flex items-center gap-2">
        <a
          href="/merchant/create-offer"
          class="rounded-xl p-2.5 sm:px-4 sm:py-2 text-sm font-bold bg-[#FF69B4] text-white hover:bg-[#FF1493] hover:shadow-lg hover:-translate-y-0.5 transition-all shadow-md flex items-center gap-2 active:scale-95 duration-200"
        >
          <Plus size={20} />
          <span class="hidden sm:inline whitespace-nowrap">Custom Offer</span>
        </a>

        <a
          href="/merchant/history"
          class="p-2.5 bg-surface border border-border-peach rounded-xl text-text-secondary hover:text-primary hover:border-primary/50 hover:shadow-md hover:-translate-y-0.5 transition-all shadow-sm active:scale-95 duration-200"
          title="History"
        >
          <History size={20} />
        </a>
        <a
          href="/merchant/profile"
          class="p-1 rounded-full border border-border-peach hover:border-primary/50 hover:shadow-md transition-all shadow-sm overflow-hidden w-10 h-10 flex items-center justify-center bg-surface active:scale-95 duration-200"
          title="Profile"
        >
          {#if $profileStore.image}
            <img
              src={$profileStore.image}
              alt="Profile"
              class="w-full h-full object-cover rounded-full"
            />
          {:else}
            <User size={20} class="text-text-secondary" />
          {/if}
        </a>
      </div>
    </div>
  </header>

  <!-- Summary Stats Grid -->
  <div
    class="grid grid-cols-2 gap-3"
    in:fly={{ y: 20, duration: 600, delay: 100, easing: cubicOut }}
  >
    <button
      onclick={() => goto("/merchant/history?filter=active")}
      class="text-left bg-surface p-4 rounded-3xl border border-border-peach shadow-sm flex flex-col gap-3 hover:border-primary/50 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 duration-300"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-highlight">
          <Zap size={18} class="text-primary" />
        </div>
      </div>
      <div>
        <div
          class="text-text-secondary text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Active Offers
        </div>
        <div class="text-2xl font-black text-text-primary truncate">
          {$activeOffersStore.length}
        </div>
      </div>
    </button>

    <button
      onclick={() => goto("/merchant/history?filter=expiring")}
      class="text-left bg-surface p-4 rounded-3xl border border-border-peach shadow-sm flex flex-col gap-3 hover:border-urgency/50 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 duration-300"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-highlight">
          <Clock size={18} class="text-urgency" />
        </div>
      </div>
      <div>
        <div
          class="text-text-secondary text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Expiring Soon
        </div>
        <div class="text-2xl font-black text-text-primary truncate">1</div>
        <div class="text-[10px] font-bold text-urgency mt-1">in 24 hours</div>
      </div>
    </button>

    <button
      onclick={() => goto("/merchant/history?filter=views")}
      class="text-left bg-surface p-4 rounded-3xl border border-border-peach shadow-sm flex flex-col gap-3 hover:border-blue-500/50 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 duration-300"
    >
      <div class="flex justify-between items-start">
        <div class="p-2.5 rounded-2xl bg-highlight">
          <Eye size={18} class="text-blue-500" />
        </div>
      </div>
      <div>
        <div
          class="text-text-secondary text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Total Views
        </div>
        <div class="text-2xl font-black text-text-primary truncate">12,450</div>
      </div>
    </button>

    <!-- NEW 4th Menu Card -->
    <button
      onclick={() => goto("/merchant/menu")}
      class="text-left bg-surface p-4 rounded-3xl border border-border-peach shadow-sm flex flex-col gap-3 hover:border-orange-500/50 hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 group duration-300"
    >
      <div class="flex justify-between items-start">
        <div
          class="p-2.5 rounded-2xl bg-highlight group-hover:bg-orange-50 transition-colors"
        >
          <UtensilsCrossed size={18} class="text-orange-500" />
        </div>
      </div>
      <div>
        <div
          class="text-text-secondary text-xs font-bold uppercase tracking-wide mb-1 truncate"
        >
          Your Menu
        </div>
        <div class="text-2xl font-black text-text-primary truncate">
          {$menuItemsStore.length}
        </div>
      </div>
    </button>
  </div>

  <!-- Customer Reach Graph -->
  <div
    class="bg-surface p-6 rounded-[32px] border border-border-peach shadow-sm"
    in:fly={{ y: 20, duration: 600, delay: 200, easing: cubicOut }}
  >
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-lg font-bold text-text-primary">Customer Reach</h2>
      <div class="flex gap-1 bg-highlight p-1 rounded-xl">
        <button
          class="px-3 py-1 text-[10px] font-bold rounded-lg transition-colors {timeRange ===
          '7D'
            ? 'bg-surface text-primary shadow-sm'
            : 'text-text-muted'}"
          onclick={() => (timeRange = "7D")}
        >
          Day
        </button>
        <button
          class="px-3 py-1 text-[10px] font-bold rounded-lg transition-colors {timeRange ===
          '1M'
            ? 'bg-surface text-primary shadow-sm'
            : 'text-text-muted'}"
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
        <div
          class="border-b border-dashed border-border-peach w-full h-0"
        ></div>
        <div
          class="border-b border-dashed border-border-peach w-full h-0"
        ></div>
        <div
          class="border-b border-dashed border-border-peach w-full h-0"
        ></div>
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
          class="animate-pulse duration-[3000ms]"
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
      class="flex justify-between text-[10px] text-text-muted font-bold mt-4 uppercase"
    >
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span
        >Fri</span
      ><span>Sat</span><span>Sun</span>
    </div>
  </div>

  <!-- Active Offers List -->
  <div class="flex flex-col gap-4">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-success animate-pulse"></div>
        Live Offers
      </h2>
    </div>

    {#each $activeOffersStore as offer, i}
      <div
        in:fly={{
          y: 20,
          duration: 500,
          delay: 300 + i * 100,
          easing: cubicOut,
        }}
        class="bg-surface p-4 rounded-[28px] border border-border-peach shadow-sm relative overflow-hidden group flex gap-4 transition-all hover:border-primary/30 hover:shadow-md hover:-translate-y-1 duration-300"
      >
        <!-- Offer Image -->
        <div
          class="w-24 h-24 bg-highlight rounded-2xl shrink-0 overflow-hidden relative"
        >
          {#if offer.image}
            <img
              src={offer.image}
              alt={offer.item}
              class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
          {:else}
            <div
              class="w-full h-full flex items-center justify-center bg-highlight text-text-muted"
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
              class="font-bold text-text-primary text-base line-clamp-2 leading-tight"
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
            class="flex items-center gap-4 border-t border-border-peach pt-2 mt-1"
          >
            <div class="flex items-center gap-1.5 text-text-secondary">
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
  <div
    class="flex flex-col gap-4 mt-2"
    in:fly={{ y: 20, duration: 600, delay: 500, easing: cubicOut }}
  >
    <div class="flex items-center justify-between px-1">
      <h2 class="text-lg font-bold text-text-primary flex items-center gap-2">
        <History size={18} class="text-text-muted" />
        Past Offers
      </h2>
      <button class="text-xs font-bold text-primary">View All</button>
    </div>

    <div
      class="bg-surface rounded-[28px] border border-border-peach overflow-hidden"
    >
      {#each pastOffers as offer, i}
        <div
          class="p-4 border-b border-border-peach last:border-0 flex items-center justify-between gap-3 hover:bg-highlight/50 transition-colors"
        >
          <div class="flex items-center gap-4 flex-1 overflow-hidden">
            <div
              class="w-12 h-12 bg-highlight rounded-xl overflow-hidden shrink-0"
            >
              {#if offer.image}
                <img
                  src={offer.image}
                  alt={offer.item}
                  class="w-full h-full object-cover"
                />
              {:else}
                <div class="w-full h-full flex items-center justify-center">
                  <UtensilsCrossed size={16} class="text-text-muted" />
                </div>
              {/if}
            </div>
            <div class="flex flex-col overflow-hidden">
              <span class="font-bold text-text-primary text-sm line-clamp-1"
                >{offer.item}</span
              >
              <span class="text-[10px] font-bold text-text-muted"
                >{offer.date}</span
              >
            </div>
          </div>
          <div class="flex items-center gap-4 shrink-0">
            <div class="text-right">
              <div class="text-xs font-bold text-text-secondary">
                {offer.views}
              </div>
              <div class="text-[9px] font-bold text-text-muted uppercase">
                Views
              </div>
            </div>
            <div class="text-right">
              <div class="text-xs font-bold text-primary">{offer.likes}</div>
              <div class="text-[9px] font-bold text-text-muted uppercase">
                Likes
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
</div>
