<script lang="ts">
  import { goto } from '$app/navigation';
  import { MapPin, Navigation, ChevronRight, Search } from 'lucide-svelte';

  let searchQuery = $state('');
  let detecting = $state(false);

  async function useCurrentLocation() {
    detecting = true;
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setTimeout(() => {
          detecting = false;
          goto('/nearby');
        }, 1000);
      },
      (error) => {
        detecting = false;
        alert('Could not detect location. Please search for your area.');
      }
    );
  }

  const savedAddresses = [
    { type: 'Home', address: 'Vignan Vidyalayam, VITS Entrance Rd, Hyderabad' },
    { type: 'Work', address: 'Banjara Hills, Road No. 12, Hyderabad' },
  ];
</script>

<div class="min-h-screen bg-bg-app text-text-primary flex flex-col">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6">
    <h1 class="text-2xl font-black mb-2">Find restaurants near you</h1>
    <p class="text-sm text-text-muted">Set your location to discover offers</p>
  </header>

  <main class="px-6 flex-1 space-y-8">
    <!-- Search Bar -->
    <div class="relative">
      <Search size={20} class="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
      <input 
        bind:value={searchQuery}
        placeholder="Search for area, street name..." 
        class="w-full pl-12 pr-4 py-4 bg-surface border border-border-dark rounded-2xl text-sm font-medium outline-none focus:border-primary transition-all placeholder:text-text-muted shadow-sm"
      />
    </div>

    <!-- Use Current Location -->
    <button 
      onclick={useCurrentLocation}
      disabled={detecting}
      class="w-full p-5 bg-surface border border-primary/30 rounded-2xl flex items-center gap-4 hover:bg-primary/5 transition-colors shadow-sm disabled:opacity-70"
    >
      <div class="p-3 bg-primary/10 rounded-xl">
        <Navigation size={22} class="text-primary" />
      </div>
      <div class="flex-1 text-left">
        <h3 class="font-bold text-primary">
          {detecting ? 'Detecting location...' : 'Use current location'}
        </h3>
        <p class="text-xs text-text-muted">Using GPS</p>
      </div>
      <ChevronRight size={20} class="text-primary" />
    </button>

    <!-- Saved Addresses -->
    {#if savedAddresses.length > 0}
      <section class="space-y-4">
        <h3 class="text-sm font-bold text-text-secondary uppercase tracking-wider">Saved Addresses</h3>
        <div class="space-y-3">
          {#each savedAddresses as address}
            <button 
              onclick={() => goto('/nearby')}
              class="w-full p-5 bg-surface border border-border-dark rounded-2xl flex items-center gap-4 hover:border-primary/30 transition-colors shadow-sm text-left"
            >
              <div class="p-3 bg-bg-app rounded-xl">
                <MapPin size={20} class="text-text-muted" />
              </div>
              <div class="flex-1">
                <h4 class="font-bold text-sm">{address.type}</h4>
                <p class="text-xs text-text-muted line-clamp-1">{address.address}</p>
              </div>
              <ChevronRight size={18} class="text-text-muted" />
            </button>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Skip Option -->
    <div class="text-center pt-4">
      <button 
        onclick={() => goto('/nearby')}
        class="text-sm font-bold text-text-muted hover:text-primary transition-colors"
      >
        Skip for now →
      </button>
    </div>
  </main>

  <!-- Footer -->
  <footer class="px-6 py-6 text-center">
    <p class="text-xs text-text-muted">
      Your location helps us show the best offers near you
    </p>
  </footer>
</div>
