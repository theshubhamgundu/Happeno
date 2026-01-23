<script lang="ts">
  import { onMount } from 'svelte';
  import OfferCard from '$lib/components/OfferCard.svelte';
  import Map from '$lib/components/Map.svelte';
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { Map as MapIcon, List, Search, Filter } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  let view = $state('list'); // list or map
  let loading = $state(true);
  
  // Mock data
  const offers = [
    { id: '1', merchant_name: 'Burger King', title: 'Buy 1 Get 1 Free on Whoppers', distance: 450, time_left: '2h 15m' },
    { id: '2', merchant_name: 'Zara', title: 'Flat 50% Off Flash Sale', distance: 1200, time_left: '45m' },
    { id: '3', merchant_name: 'Starbucks', title: 'Free Upgrade to Venti', distance: 800, time_left: '1h 30m' },
    { id: '4', merchant_name: 'H&M', title: 'Extra 20% off on Fresh Arrivals', distance: 2100, time_left: '5h 10m' },
  ];

  onMount(() => {
    setTimeout(() => loading = false, 1000);
  });
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <!-- Header -->
  <header class="sticky top-0 z-30 bg-bg-app/80 backdrop-blur-xl px-6 py-4 flex flex-col gap-4">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-heading font-extrabold text-text-primary">Near You</h1>
      <div class="flex bg-white p-1 rounded-2xl border border-border-peach shadow-sm">
        <button 
          onclick={() => view = 'list'} 
          class={cn("p-2 rounded-xl transition-all", view === 'list' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-muted")}
        >
          <List size={20} />
        </button>
        <button 
          onclick={() => view = 'map'} 
          class={cn("p-2 rounded-xl transition-all", view === 'map' ? "bg-primary text-white shadow-md shadow-primary/20" : "text-text-muted")}
        >
          <MapIcon size={20} />
        </button>
      </div>
    </div>

    <div class="flex gap-2">
      <div class="flex-1 relative">
        <Search size={18} class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input 
          placeholder="Search offers or brands..." 
          class="w-full pl-11 pr-4 py-3 bg-white border border-border-peach rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all"
        />
      </div>
      <button class="p-3 bg-white border border-border-peach rounded-2xl text-text-secondary">
        <Filter size={20} />
      </button>
    </div>

    <!-- Categories -->
    <div class="flex gap-2 overflow-x-auto no-scrollbar py-1">
      {#each ['All', 'Food', 'Fashion', 'Tech', 'Grooming', 'Sports'] as cat}
        <button class={cn(
          "px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border",
          cat === 'All' ? "bg-primary text-white border-primary shadow-md shadow-primary/20" : "bg-white text-text-muted border-border-peach"
        )}>
          {cat}
        </button>
      {/each}
    </div>
  </header>

  <!-- Content -->
  <main class="px-6 mt-2">
    {#if view === 'list'}
      <div class="flex flex-col gap-4">
        {#each offers as offer}
          <a href="/offer/{offer.id}">
            <OfferCard {offer} />
          </a>
        {/each}
      </div>
    {:else}
      <div class="h-[60vh] w-full mt-2 relative">
        <Map 
          markers={offers.map(o => ({ lat: 17.4483 + (Math.random() - 0.5) * 0.02, lng: 78.3915 + (Math.random() - 0.5) * 0.02, title: o.merchant_name }))} 
        />
      </div>
    {/if}
  </main>
</div>

<BottomNav />
