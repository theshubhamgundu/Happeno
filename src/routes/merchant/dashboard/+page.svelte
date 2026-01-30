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
    Crown,
  } from "lucide-svelte";
  import Button from "$lib/components/Button.svelte";
  import DistrictHeader from "$lib/components/DistrictHeader.svelte";
  import { goto } from "$app/navigation";
  import {
    activeOffersStore,
    menuItemsStore,
    profileStore,
  } from "$lib/stores/merchant";
  import { fly, fade, slide, scale } from "svelte/transition";
  import { cubicOut, elasticOut, backOut } from "svelte/easing";

  let timeRange = $state("7D"); // 24H, 7D, 1M, 1Y

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

  // Calculate expiring offers (status is 'Expiring' or duration has 'h'/'m' and not 'D')
  let expiringCount = $derived(
    $activeOffersStore.filter(
      (o) =>
        o.status === "Expiring" ||
        (o.expiry &&
          (o.expiry.includes("h") || o.expiry.includes("m")) &&
          !o.expiry.includes("D")),
    ).length,
  );

  // Calculate Total Views
  let totalViews = $derived(
    $activeOffersStore.reduce((acc, o) => acc + (o.views || 0), 0),
  );

  // Mocked Data
  // We make stats derived so it updates when store changes
  let stats = $derived([
    {
      label: "Active Offers",
      value: $activeOffersStore.length.toString(),
      icon: Zap,
      color: "text-primary",
      bg: "bg-surface",
      hover: "hover:border-primary/50",
      link: "/merchant/history?filter=active",
      iconBg: "bg-highlight",
    },
    {
      label: "Expiring Soon",
      value: expiringCount.toString(),
      subtext: "in 24 hours",
      icon: Clock,
      color: "text-urgency",
      bg: "bg-surface",
      hover: "hover:border-urgency/50",
      link: "/merchant/history?filter=expiring",
      iconBg: "bg-highlight",
    },
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      icon: Eye,
      color: "text-blue-500",
      bg: "bg-surface",
      hover: "hover:border-blue-500/50",
      link: "/merchant/history?filter=views",
      iconBg: "bg-highlight",
    },
    {
      label: "Your Menu",
      value: $menuItemsStore.length.toString(),
      icon: UtensilsCrossed,
      color: "text-orange-500",
      bg: "bg-surface",
      hover: "hover:border-orange-500/50 group",
      link: "/merchant/menu",
      iconBg: "bg-highlight group-hover:bg-orange-50",
    },
  ]);
  import { reveal } from "$lib/actions/reveal";
</script>

<div
  class="px-4 py-6 pb-32 flex flex-col gap-6 bg-bg-app min-h-screen transition-colors duration-300"
>
  <!-- Summary Stats Grid -->
  <div class="grid grid-cols-2 gap-3">
    {#each stats as stat, i}
      <button
        onclick={() => goto(stat.link)}
        class="text-left {stat.bg} p-4 rounded-3xl border border-border-peach shadow-sm flex flex-col gap-3 {stat.hover} hover:shadow-md hover:-translate-y-1 transition-all active:scale-95 duration-300 relative overflow-hidden"
        use:reveal={{ delay: i * 100, x: 50 }}
      >
        <div class="flex justify-between items-start z-10">
          <div class="p-2.5 rounded-2xl {stat.iconBg} transition-colors">
            <stat.icon size={18} class={stat.color} />
          </div>
        </div>
        <div class="z-10">
          <div
            class="text-text-secondary text-xs font-bold uppercase tracking-wide mb-1 truncate"
          >
            {stat.label}
          </div>
          <div class="text-2xl font-black text-text-primary truncate">
            {stat.value}
          </div>
          {#if stat.subtext}
            <div class="text-[10px] font-bold text-urgency mt-1">
              {stat.subtext}
            </div>
          {/if}
        </div>

        <!-- Subtle Glow Blob -->
        <div
          class="absolute -right-4 -bottom-4 w-20 h-20 bg-highlight rounded-full blur-2xl opacity-50 group-hover:scale-150 transition-transform duration-700"
        ></div>
      </button>
    {/each}
  </div>

  <!-- Customer Reach Graph -->
  <div
    class="bg-surface p-6 rounded-[32px] border border-border-peach shadow-sm"
    use:reveal={{ delay: 200, x: 50 }}
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
        use:reveal={{ delay: i * 150, x: 50 }}
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

        <div class="flex-1 flex flex-col pt-1 min-w-0">
          <div class="flex justify-between items-start mb-0.5">
            <h3
              class="font-bold text-text-primary text-base line-clamp-1 leading-tight"
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

          {#if offer.description}
            <p class="text-xs text-text-secondary line-clamp-1 mb-1">
              {offer.description}
            </p>
          {/if}

          <!-- Pricing -->
          <div class="flex items-baseline gap-2 mb-2">
            {#if offer.originalPrice}
              <span class="text-xs text-text-muted line-through"
                >₹{offer.originalPrice}</span
              >
            {/if}
            <span class="text-sm font-black text-primary">
              {#if offer.finalPrice}
                ₹{offer.finalPrice}
              {:else}
                {offer.price || offer.discount}
              {/if}
            </span>
          </div>

          <div
            class="flex items-center gap-4 border-t border-dashed border-border-peach pt-2 mt-auto"
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
  <div class="flex flex-col gap-4 mt-2" use:reveal={{ delay: 300, x: 50 }}>
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

<style>
</style>
