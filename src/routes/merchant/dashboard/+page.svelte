<script lang="ts">
  import {
    Zap,
    Eye,
    ThumbsUp,
    Clock,
    History,
    UtensilsCrossed,
    LayoutDashboard,
    ChefHat,
    QrCode,
    Users,
    Receipt
  } from "lucide-svelte";
  import { goto } from "$app/navigation";
  import { activeOffersStore, menuItemsStore, merchantStatsStore, liveOrdersStore, kitchenTicketsStore, completedOrdersStore, profileStore } from "$lib/stores/merchant";
  import { reveal } from "$lib/actions/reveal";
  import { pdfService } from "$lib/services/pdf";

  let timeRange = $state("7D"); // 24H, 7D, 1M, 1Y

  const operations = $derived([
    {
      label: "Orders Feed",
      sub: "Manage live orders",
      icon: Receipt,
      link: "/merchant/orders",
      color: "bg-blue-500",
      count: $liveOrdersStore.length
    },
    {
      label: "Kitchen Display",
      sub: "KDS Terminal",
      icon: ChefHat,
      link: "/merchant/kitchen",
      color: "bg-emerald-500",
      count: $kitchenTicketsStore.length
    }
  ]);

  const management = [
    {
      label: "QR Codes",
      sub: "Table ordering",
      icon: QrCode,
      link: "/merchant/qr-management",
      color: "bg-primary"
    },
    {
      label: "Staff",
      sub: "Manage team",
      icon: Users,
      link: "/merchant/staff-management",
      color: "bg-orange-500"
    }
  ];

  const pastOffers = [
    {
      id: 101,
      item: "Weekend Combo",
      date: "Jan 15",
      views: 2500,
      likes: 230,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80",
    },
    {
      id: 102,
      item: "Family Feast",
      date: "Jan 10",
      views: 1800,
      likes: 150,
      image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80",
    },
  ];

  let expiringCount = $derived(
    $activeOffersStore.filter(o => o.status === "Expiring" || (o.status === "Active" && o.expiry && (o.expiry.includes("h") || o.expiry.includes("m") || o.expiry.includes(":")))).length,
  );

  let totalViews = $derived($activeOffersStore.reduce((acc, o) => acc + (o.views || 0), 0));

  let stats = $derived([
    { label: "Active Offers", value: $activeOffersStore.length.toString(), icon: Zap, color: "text-primary", bg: "bg-surface", hover: "hover:border-primary/50", link: "/merchant/history?filter=active", iconBg: "bg-highlight" },
    { label: "Expiring Soon", value: expiringCount.toString(), subtext: "in 24 hours", icon: Clock, color: "text-urgency", bg: "bg-surface", hover: "hover:border-urgency/50", link: "/merchant/history?filter=expiring", iconBg: "bg-highlight" },
    { label: "Total Views", value: totalViews.toLocaleString(), icon: Eye, color: "text-blue-500", bg: "bg-surface", hover: "hover:border-blue-500/50", link: "/merchant/history?filter=views", iconBg: "bg-highlight" },
    { label: "Your Menu", value: $menuItemsStore.length.toString(), icon: UtensilsCrossed, color: "text-orange-500", bg: "bg-surface", hover: "hover:border-orange-500/50 group", link: "/merchant/menu", iconBg: "bg-highlight group-hover:bg-orange-50" },
  ]);

  // --- Dynamic Graph Logic ---
  let weeklyRev = $derived.by(() => {
    const data = [0, 0, 0, 0, 0, 0, 0];
    $completedOrdersStore.forEach(o => {
        try {
            const day = new Date(o.createdAt).getDay();
            const index = day === 0 ? 6 : day - 1;
            if (index >= 0 && index < 7) data[index] += o.total;
        } catch(e) {}
    });
    return data;
  });

  let maxRevCount = $derived(Math.max(...weeklyRev, 5000));
  let areaPathStr = $derived.by(() => {
    const points = weeklyRev.map((v, i) => {
        const x = (i / 6) * 100;
        const y = 80 - (v / maxRevCount) * 60;
        return `L ${x},${y}`;
    }).join(' ');
    const firstY = 80 - (weeklyRev[0] / maxRevCount) * 60;
    return `M 0,100 L 0,${firstY} ${points} L 100,100 Z`;
  });

  let polylinePathStr = $derived.by(() => {
    return weeklyRev.map((v, i) => {
        const x = (i / 6) * 100;
        const y = 80 - (v / maxRevCount) * 60;
        return `${x},${y}`;
    }).join(' ');
  });
</script>

<div class="px-5 py-8 pb-32 flex flex-col gap-10 bg-bg-app min-h-screen">
  <!-- Dynamic Graph - Business Intelligence Card -->
  <div
    class="bg-white p-7 rounded-[48px] border border-gray-100 shadow-2xl shadow-primary/5 relative overflow-hidden group"
    use:reveal={{ delay: 100, x: 0 }}
  >
    <div class="flex justify-between items-center mb-8 relative z-10">
      <div>
        <h2 class="text-xs font-black text-gray-400 uppercase tracking-[0.2em] mb-1">Weekly Performance</h2>
        <div class="flex items-baseline gap-2">
            <span class="text-3xl font-black text-gray-900 tracking-tighter">₹{weeklyRev[new Date().getDay() === 0 ? 6 : new Date().getDay()-1].toLocaleString()}</span>
            <span class="text-[10px] font-black text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-widest">+12.5%</span>
        </div>
      </div>
      <div class="flex gap-1 bg-gray-50 p-1 rounded-2xl border border-gray-100/50">
        {#each ['7D', '1M'] as range}
          <button
            class="px-4 py-2 text-[10px] font-black rounded-xl transition-all uppercase tracking-widest {timeRange === range ? 'bg-white text-primary shadow-lg shadow-primary/10' : 'text-gray-400'}"
            onclick={() => (timeRange = range)}
          >
            {range}
          </button>
        {/each}
      </div>
    </div>

    <!-- Main SVG Graph -->
    <div class="relative h-44 w-full">
      <div class="absolute inset-0 flex flex-col justify-between py-2">
        {#each Array(4) as _}
          <div class="border-b border-dashed border-gray-50 w-full h-0"></div>
        {/each}
      </div>

      <svg class="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
        <path d={areaPathStr} fill="url(#mainGradient)" opacity="0.4" class="transition-all duration-1000" />
        <polyline points={polylinePathStr} fill="none" class="stroke-primary stroke-[4]" stroke-linecap="round" stroke-linejoin="round" vector-effect="non-scaling-stroke" />
        <defs>
          <linearGradient id="mainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="#EC1C79" />
            <stop offset="100%" stop-color="white" stop-opacity="0" />
          </linearGradient>
        </defs>
      </svg>
    </div>

    <div class="flex justify-between text-[10px] text-gray-400 font-black mt-6 uppercase tracking-widest px-1">
      <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
    </div>

    <!-- Decorative background circle -->
    <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-primary/5 rounded-full blur-[60px] group-hover:bg-primary/10 transition-colors"></div>
  </div>

  <!-- Live Order Pulse (New Quick Feed) -->
  {#if $liveOrdersStore.length > 0}
    <div class="space-y-4" use:reveal={{ delay: 150, y: 10 }}>
        <div class="flex items-center justify-between px-1">
            <h2 class="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                <div class="w-1.5 h-1.5 rounded-full bg-primary animate-ping"></div>
                New Activity
            </h2>
            <button onclick={() => goto('/merchant/orders')} class="text-[10px] font-black text-primary uppercase tracking-widest">Feed &rarr;</button>
        </div>
        <div class="flex gap-4 overflow-x-auto no-scrollbar py-2">
            {#each $liveOrdersStore.slice(0, 3) as order}
                <div class="bg-white px-5 py-4 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 shrink-0 min-w-[240px] hover:shadow-md transition-all">
                    <div class="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-black text-xs">
                        T{order.tableNumber}
                    </div>
                    <div class="flex-1">
                        <p class="text-xs font-black text-gray-900 line-clamp-1">{order.items[0].name}{order.items.length > 1 ? ` +${order.items.length - 1}` : ''}</p>
                        <p class="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{order.status} • {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                </div>
            {/each}
        </div>
    </div>
  {/if}

  <!-- Live Pulse Stats (High Density Grid) -->
  <div class="grid grid-cols-2 gap-4">
    {#each stats as stat, i}
      <button
        onclick={() => stat.link && goto(stat.link)}
        class="bg-white p-6 rounded-[36px] border border-gray-100 shadow-sm relative overflow-hidden text-left group transition-all hover:shadow-xl active:scale-95 duration-500"
        use:reveal={{ delay: i * 100 + 200, y: 30 }}
      >
        <div class="w-10 h-10 {stat.iconBg} rounded-xl flex items-center justify-center {stat.color} mb-4 shadow-sm group-hover:scale-110 transition-transform">
          <stat.icon size={20} />
        </div>
        <div class="flex flex-col">
          <span class="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</span>
          <span class="text-2xl font-black text-gray-900 tracking-tighter">{stat.value}</span>
          {#if stat.subtext}
            <span class="text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">● {stat.subtext}</span>
          {/if}
        </div>
      </button>
    {/each}
  </div>

  <!-- Core Operations (Edge to Edge Interface) -->
  <section class="space-y-5">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
        Live Operations
      </h2>
      <div class="px-3 py-1 bg-gray-100 rounded-full text-[9px] font-black text-gray-500">
        HUB SYNC ACTIVE
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      {#each operations as op}
        <button 
          onclick={() => goto(op.link)}
          class="flex items-center gap-5 bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 text-left group overflow-hidden relative"
        >
          <div class="w-16 h-16 {op.color} rounded-[28px] flex items-center justify-center text-white shadow-xl relative z-10 overflow-hidden">
            <op.icon size={32} />
            <div class="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
          </div>
          <div class="flex-1 relative z-10">
            <h3 class="font-black text-gray-900 text-lg leading-none">{op.label}</h3>
            <p class="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1.5">{op.sub}</p>
          </div>
          {#if op.count !== undefined}
            <div class="bg-gray-900 px-4 py-2 rounded-2xl font-black text-xs text-white z-10">
              {op.count}
            </div>
          {/if}
          <!-- Background Abstract Pattern -->
          <div class="absolute right-0 bottom-0 opacity-[0.03] scale-150 rotate-12 group-hover:scale-110 transition-transform duration-700">
            <op.icon size={120} />
          </div>
        </button>
      {/each}
    </div>
  </section>

  <!-- Business Management (Horizontal Flow) -->
  <section class="space-y-5">
    <h2 class="text-sm font-black text-gray-400 uppercase tracking-[0.2em] px-1">Studio Management</h2>
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {#each management as item}
        <button 
          onclick={() => goto(item.link)}
          class="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left flex flex-col gap-5 group"
        >
          <div class="w-12 h-12 {item.color}/10 rounded-2xl flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
            <item.icon size={22} class={item.color.replace('bg-', 'text-')} />
          </div>
          <div>
            <h3 class="font-black text-gray-900 text-sm leading-tight">{item.label}</h3>
            <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">{item.sub}</p>
          </div>
        </button>
      {/each}

      <!-- Admin Actions -->
      <button 
        onclick={() => pdfService.generateSalesReport($completedOrdersStore, $profileStore.businessName)}
        class="bg-gray-900 p-6 rounded-[40px] shadow-xl hover:shadow-gray-900/40 transition-all active:scale-95 text-left flex flex-col gap-5 group"
      >
        <div class="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white scale-110">
          <History size={22} />
        </div>
        <div>
          <h3 class="font-black text-white text-sm leading-tight">Export PDF</h3>
          <p class="text-[9px] font-black text-white/40 uppercase tracking-widest mt-1">Sales Reports</p>
        </div>
      </button>

      <button 
        onclick={() => goto('/merchant/settings')}
        class="bg-white p-6 rounded-[40px] border border-gray-100 shadow-sm hover:shadow-lg transition-all active:scale-95 text-left flex flex-col gap-5 group"
      >
        <div class="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-gray-900 group-hover:text-white transition-all">
          <LayoutDashboard size={22} />
        </div>
        <div>
          <h3 class="font-black text-gray-900 text-sm leading-tight">Settings</h3>
          <p class="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Configurations</p>
        </div>
      </button>
    </div>
  </section>

  <!-- Live Social Pulse -->
  <section class="space-y-6">
    <div class="flex items-center justify-between px-1">
      <h2 class="text-sm font-black text-gray-900 uppercase tracking-[0.2em] flex items-center gap-2">
        <Zap size={18} class="text-primary" />
        Campaign Pulse
      </h2>
      <button class="text-[10px] font-black text-primary uppercase tracking-widest bg-primary/5 px-4 py-1.5 rounded-full">Boost Reach</button>
    </div>

    <div class="grid grid-cols-1 gap-5">
      {#each $activeOffersStore as offer, i}
        <div
          use:reveal={{ delay: i * 150, x: 20 }}
          class="bg-white p-6 rounded-[44px] border border-gray-100 shadow-sm relative overflow-hidden group flex gap-6 transition-all hover:bg-gray-50/50 hover:shadow-2xl hover:-translate-y-1 duration-700"
        >
          <div class="w-32 h-32 bg-gray-50 rounded-[32px] shrink-0 overflow-hidden relative shadow-inner group-hover:scale-95 transition-transform duration-700">
            {#if offer.image}
              <img src={offer.image} alt={offer.item} class="w-full h-full object-cover group-hover:scale-125 transition-transform duration-1000" />
            {:else}
              <div class="w-full h-full flex items-center justify-center text-gray-200"><UtensilsCrossed size={32} /></div>
            {/if}
            <div class="absolute bottom-0 inset-x-0 bg-primary/90 text-white text-[10px] font-black text-center py-2 backdrop-blur-md">
              {offer.discount}
            </div>
          </div>

          <div class="flex-1 flex flex-col justify-center min-w-0">
            <div class="flex justify-between items-start mb-2">
              <h3 class="font-black text-gray-900 text-xl line-clamp-1 leading-none tracking-tight">{offer.item}</h3>
              <div class="px-3 py-1.5 bg-urgency/5 text-urgency text-[10px] font-black rounded-xl flex items-center gap-1.5 shrink-0 ml-3 shadow-sm shadow-urgency/5">
                <Clock size={12} /> {offer.expiry}
              </div>
            </div>

            <p class="text-xs font-semibold text-gray-400 line-clamp-2 mb-4 leading-relaxed">{offer.description || 'Promoting special menu items to local customers within 2km radius.'}</p>

            <div class="flex items-center gap-6 border-t border-gray-50 pt-4">
              <div class="flex items-center gap-2 text-gray-400 group/count">
                <div class="p-2 bg-blue-50 rounded-xl text-blue-500 group-hover/count:bg-blue-500 group-hover/count:text-white transition-colors">
                    <Eye size={14} />
                </div>
                <span class="text-xs font-black text-gray-600">{offer.views.toLocaleString()} Views</span>
              </div>
              <div class="flex items-center gap-2 text-gray-400 group/count">
                <div class="p-2 bg-primary/5 rounded-xl text-primary group-hover/count:bg-primary group-hover/count:text-white transition-colors">
                    <ThumbsUp size={14} />
                </div>
                <span class="text-xs font-black text-gray-600">{offer.likes.toLocaleString()} Likes</span>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
</style>
