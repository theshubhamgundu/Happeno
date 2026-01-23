<script lang="ts">
  import { History as HistoryIcon, Clock, Users, Zap, Calendar } from 'lucide-svelte';

  const history = [
    { id: '1', title: 'Weekend Flash Sale', date: '21 Jan 2026', reach: '1,240', radius: '5km', status: 'Completed', price: '₹200' },
    { id: '2', title: 'Evening Rush Offer', date: '19 Jan 2026', reach: '850', radius: '3km', status: 'Completed', price: '₹120' },
    { id: '3', title: 'New Launch Promo', date: '15 Jan 2026', reach: '2,100', radius: '10km', status: 'Completed', price: '₹500' },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <header class="p-8">
    <h1 class="text-3xl font-heading font-extrabold text-text-primary">History</h1>
    <p class="text-text-secondary font-medium">Review your past broadcasts.</p>
  </header>

  <main class="px-6 flex flex-col gap-6">
    {#each history as item}
      <div class="bg-white p-6 rounded-[32px] border border-border-peach flex flex-col gap-4 relative overflow-hidden group hover:border-primary/30 transition-all">
        <div class="flex justify-between items-start">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-text-muted flex items-center gap-1 uppercase tracking-widest">
              <Calendar size={10} /> {item.date}
            </span>
            <h3 class="text-lg font-bold text-text-primary leading-tight">{item.title}</h3>
          </div>
          <div class="px-3 py-1 bg-highlight text-primary text-[10px] font-extrabold uppercase tracking-widest rounded-full">
            {item.price}
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4 py-4 border-y border-border-peach/50">
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest text-[8px]">Total Reach</span>
            <div class="flex items-center gap-1.5 text-text-primary font-bold text-sm">
              <Users size={14} class="text-primary" />
              {item.reach} Users
            </div>
          </div>
          <div class="flex flex-col gap-1">
            <span class="text-[10px] font-bold text-text-muted uppercase tracking-widest text-[8px]">Radius</span>
            <div class="flex items-center gap-1.5 text-text-primary font-bold text-sm">
              <Zap size={14} class="text-primary" />
              {item.radius}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between">
          <span class="text-xs font-bold text-success flex items-center gap-1">
            <div class="w-1.5 h-1.5 rounded-full bg-success"></div>
            {item.status}
          </span>
          <button class="text-xs font-bold text-primary hover:underline">Re-broadcast</button>
        </div>
      </div>
    {/each}

    {#if history.length === 0}
      <div class="py-20 flex flex-col items-center justify-center text-center opacity-50 px-12">
        <HistoryIcon size={64} class="mb-4" />
        <p class="font-bold text-text-secondary">No history found. Your broadcasts will appear here.</p>
      </div>
    {/if}
  </main>
</div>
