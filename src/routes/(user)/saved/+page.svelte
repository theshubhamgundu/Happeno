<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { Bookmark, Search } from 'lucide-svelte';

  const savedMerchants = [
    { id: '1', name: 'Burger King', category: 'Food & Beverage', status: 'Active Offer' },
    { id: '2', name: 'Zara', category: 'Fashion', status: 'No Live Offers' },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-24">
  <header class="p-8">
    <h1 class="text-3xl font-heading font-extrabold text-text-primary">Saved</h1>
    <p class="text-text-secondary font-medium">Your favorite merchants and brands.</p>
  </header>

  <main class="px-6 flex flex-col gap-6">
    {#each savedMerchants as merchant}
      <div class="bg-white p-6 rounded-[32px] border border-border-peach shadow-sm flex items-center justify-between group active:scale-[0.98] transition-all">
        <div class="flex items-center gap-4">
          <div class="w-14 h-14 bg-highlight rounded-2xl flex items-center justify-center font-bold text-primary text-xl">
            {merchant.name[0]}
          </div>
          <div>
            <h3 class="font-bold text-text-primary">{merchant.name}</h3>
            <span class="text-xs font-medium text-text-muted">{merchant.category}</span>
          </div>
        </div>
        
        <div class="flex flex-col items-end gap-1">
          <div class={cn(
            "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest",
            merchant.status === 'Active Offer' ? "bg-success/10 text-success" : "bg-border-peach text-text-muted"
          )}>
            {merchant.status}
          </div>
          <Bookmark size={20} class="text-primary fill-current mt-1" />
        </div>
      </div>
    {/each}

    {#if savedMerchants.length === 0}
      <div class="flex flex-col items-center justify-center py-20 text-center opacity-50">
        <Bookmark size={64} class="mb-4" />
        <p class="font-bold text-text-secondary">No saved merchants yet.</p>
      </div>
    {/if}
  </main>
</div>

<BottomNav />

<script context="module">
  import { cn } from '$lib/utils';
</script>
