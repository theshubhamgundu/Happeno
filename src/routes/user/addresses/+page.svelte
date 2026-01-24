<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { ChevronLeft, MapPin, Home, Briefcase, Plus, MoreVertical } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const addresses = [
    {
      id: 1,
      type: 'Home',
      icon: Home,
      address: 'Flat 402, Sunshine Apartments, Jubilee Hills, Hyderabad, 500033',
    },
    {
      id: 2,
      type: 'Work',
      icon: Briefcase,
      address: 'Floor 12, T-Hub 2.0, Madhapur, Hyderabad, 500081',
    }
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Saved Addresses</h1>
  </header>

  <main class="px-6 space-y-6 pt-6">
    <button class="w-full flex items-center justify-center gap-2 p-5 bg-primary/5 border border-dashed border-primary/30 rounded-[24px] text-primary font-bold hover:bg-primary/10 transition-colors shadow-sm">
      <Plus size={20} />
      <span>Add New Address</span>
    </button>

    {#if addresses.length > 0}
      <div class="grid gap-4">
        {#each addresses as addr}
          <div class="bg-surface border border-border-dark rounded-[24px] p-5 shadow-sm flex items-start gap-4">
            <div class="p-3 bg-bg-app rounded-2xl text-primary flex-shrink-0">
              <addr.icon size={22} strokeWidth={1.5} />
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <h3 class="font-bold text-base">{addr.type}</h3>
                <button class="p-1 text-text-muted">
                  <MoreVertical size={18} />
                </button>
              </div>
              <p class="text-xs text-text-muted leading-relaxed font-medium">
                {addr.address}
              </p>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div class="w-20 h-20 bg-surface border border-border-dark rounded-full flex items-center justify-center text-text-muted">
          <MapPin size={32} />
        </div>
        <div>
          <h3 class="font-bold text-lg">No addresses saved</h3>
          <p class="text-sm text-text-muted">Add your home or work address for faster deals.</p>
        </div>
      </div>
    {/if}
  </main>
</div>

<BottomNav />
