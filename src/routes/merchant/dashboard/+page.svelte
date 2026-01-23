<script lang="ts">
  import { ArrowUpRight, Clock, Users, Zap, AlertCircle } from 'lucide-svelte';
  import Button from '$lib/components/Button.svelte';
  import { goto } from '$app/navigation';
  let isApproved = $state(false); // Mocked for demo

  const stats = [
    { label: 'Active Offers', value: '3', icon: Zap, color: 'text-primary' },
    { label: 'Total Reach', value: '1,240', icon: Users, color: 'text-blue-500' },
    { label: 'Money Spent', value: '₹450', icon: ArrowUpRight, color: 'text-success' },
  ];

  const activeOffers = [
    { id: '1', title: 'Flash 50% Off Burgers', time_left: '1h 20m', reach: 450, radius: '3km' },
    { id: '2', title: 'Buy 1 Get 1 Coffee', time_left: '4h 10m', reach: 120, radius: '1km' },
  ];
</script>

<div class="px-6 py-8 flex flex-col gap-8">
  <header class="flex justify-between items-center">
    <div>
      <h1 class="text-3xl font-heading font-extrabold text-text-primary">Dashboard</h1>
      <p class="text-text-secondary font-medium italic">Welcome back, Burger King!</p>
    </div>
    <div class="w-12 h-12 bg-white border border-border-peach rounded-2xl flex items-center justify-center font-bold text-primary shadow-sm">
      BK
    </div>
  </header>

  {#if !isApproved}
    <div class="bg-urgency/10 border border-urgency rounded-[40px] p-8 flex flex-col items-center text-center gap-4 animate-in fade-in slide-in-from-top-4">
      <div class="p-4 bg-white rounded-[24px] text-urgency shadow-sm">
        <AlertCircle size={32} />
      </div>
      <div>
        <h3 class="text-xl font-bold text-text-primary">Verification Pending</h3>
        <p class="text-sm font-medium text-text-secondary mt-1">Our team is reviewing your business details. You'll be able to broadcast offers once approved.</p>
      </div>
      <Button variant="outline" class="w-full border-urgency text-urgency">Check Status</Button>
    </div>
  {/if}

  <!-- Stats Grid -->
  <div class="grid grid-cols-3 gap-4">
    {#each stats as stat}
      <div class="bg-white p-4 rounded-[32px] border border-border-peach flex flex-col gap-2 items-center text-center">
        <div class="p-2 rounded-xl bg-bg-app">
          <stat.icon size={20} class={stat.color} />
        </div>
        <div>
          <div class="text-xl font-extrabold text-text-primary">{stat.value}</div>
          <div class="text-[9px] font-bold uppercase tracking-widest text-text-muted">{stat.label}</div>
        </div>
      </div>
    {/each}
  </div>

  <!-- Active Offers Section -->
  <div>
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-xl font-bold text-text-primary">Live Now</h2>
      <a href="/merchant/history" class="text-sm font-bold text-primary">View All</a>
    </div>

    <div class="flex flex-col gap-4">
      {#each activeOffers as offer}
        <div class="bg-white p-6 rounded-[32px] border border-border-peach flex flex-col gap-4 relative overflow-hidden group">
          <div class="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
          
          <div class="flex justify-between items-start">
            <div>
              <h3 class="text-lg font-bold text-text-primary leading-tight">{offer.title}</h3>
              <div class="flex gap-3 mt-1">
                <span class="text-xs font-bold text-text-muted flex items-center gap-1">
                  <Zap size={12} /> {offer.radius} Radius
                </span>
                <span class="text-xs font-bold text-text-muted flex items-center gap-1">
                  <Users size={12} /> {offer.reach} Reach
                </span>
              </div>
            </div>
            <div class="px-3 py-1 bg-urgency/10 text-urgency text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1 animate-pulse">
              <Clock size={12} />
              {offer.time_left} left
            </div>
          </div>

          <div class="flex gap-2">
            <button class="flex-1 py-3 bg-bg-app text-text-primary text-sm font-bold rounded-2xl border border-border-peach hover:bg-highlight hover:border-primary transition-all">
              Pause
            </button>
            <button class="flex-1 py-3 bg-bg-app text-text-primary text-sm font-bold rounded-2xl border border-border-peach hover:bg-highlight hover:border-primary transition-all">
              Analytics
            </button>
          </div>
        </div>
      {/each}
      
      {#if activeOffers.length === 0}
        <div class="py-12 flex flex-col items-center justify-center text-center gap-4 border-2 border-dashed border-border-peach rounded-[40px] opacity-60">
          <Zap size={48} class="text-text-muted" />
          <p class="font-bold text-text-secondary px-12">No active offers. Broadcast one to reach nearby customers!</p>
        </div>
      {/if}
    </div>
  </div>

  <!-- Quick Action -->
  <div class="bg-primary p-8 rounded-[40px] text-white shadow-2xl shadow-primary/30 flex flex-col gap-4">
    <h3 class="text-2xl font-heading font-extrabold italic">Reach 1000+ users instantly</h3>
    <p class="text-white/80 font-medium">Create a new flash offer and see it go live in seconds.</p>
    <Button variant="secondary" onclick={() => goto('/merchant/create-offer')} class="w-full bg-white text-primary border-none py-5 rounded-[22px]">
      Start Broadcasting
    </Button>
  </div>
</div>
