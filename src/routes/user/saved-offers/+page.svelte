<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { ChevronLeft, ClipboardList, Star, MapPin, Clock, Search, Heart } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const savedOffers = [
    {
      id: 1,
      restaurant: 'Paradise Biryani',
      area: 'Secunderabad',
      rating: 4.6,
      cuisines: 'Biryani, North Indian',
      offer: '20% OFF on Dine-in',
      offerDetails: 'Valid on orders above ₹500',
      validTill: 'Today, 11 PM',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
      offerColor: 'bg-primary'
    },
    {
      id: 2,
      restaurant: 'The Rameshwaram Cafe',
      area: 'Jubilee Hills',
      rating: 4.4,
      cuisines: 'South Indian, Dosa',
      offer: 'Flat ₹100 OFF',
      offerDetails: 'No minimum order',
      validTill: 'This week',
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80',
      offerColor: 'bg-gradient-to-r from-amber-500 to-orange-500'
    }
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Saved Offers</h1>
  </header>

  <main class="px-6 space-y-6 pt-6">
    {#if savedOffers.length > 0}
      <div class="grid gap-4">
        {#each savedOffers as offer}
          <div class="block bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm transition-shadow group">
            <div class="flex gap-4 p-4">
              <!-- Image -->
              <div class="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={offer.image} alt={offer.restaurant} class="w-full h-full object-cover" />
                <button class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-primary shadow-sm">
                   <Heart size={14} fill="currentColor" />
                </button>
              </div>

              <!-- Details -->
              <div class="flex-1 py-1">
                <h3 class="font-bold text-base line-clamp-1">{offer.restaurant}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex items-center gap-0.5 px-1.5 py-0.5 bg-success text-white rounded text-[10px] font-bold">
                    <Star size={9} fill="white" /> {offer.rating}
                  </div>
                  <span class="text-[10px] text-text-muted">{offer.cuisines}</span>
                </div>
                <div class="flex items-center gap-1 mt-1 text-[10px] text-text-muted">
                  <MapPin size={10} /> {offer.area}
                </div>

                <!-- Offer Badge -->
                <div class="mt-3">
                  <div class={cn("inline-block px-3 py-1.5 rounded-lg text-[10px] font-black text-white uppercase tracking-wide", offer.offerColor)}>
                    {offer.offer}
                  </div>
                </div>
              </div>
            </div>

            <!-- Offer Footer -->
            <div class="px-4 py-3 bg-bg-app border-t border-border-dark/50 flex items-center justify-between">
              <span class="text-[10px] text-text-muted">{offer.offerDetails}</span>
              <div class="flex items-center gap-1 text-[10px] text-primary font-bold">
                <Clock size={10} /> {offer.validTill}
              </div>
            </div>
          </div>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div class="w-20 h-20 bg-surface border border-border-dark rounded-full flex items-center justify-center text-text-muted">
          <ClipboardList size={32} />
        </div>
        <div>
          <h3 class="font-bold text-lg">No saved offers</h3>
          <p class="text-sm text-text-muted">Save offers to quickly find them later.</p>
        </div>
        <a href="/user/offers" class="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-soft">
          Explore Offers
        </a>
      </div>
    {/if}
  </main>
</div>

<BottomNav />
