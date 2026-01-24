<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { Ticket, Star, MapPin, Clock, Filter, ChevronDown, CircleUser, Search } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  let activeCategory = $state('all');

  const categories = [
    { id: 'all', name: 'All Offers' },
    { id: 'dining', name: 'Dining' },
    { id: 'buffet', name: 'Buffet' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'desserts', name: 'Desserts' },
  ];

  const offers = [
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
    },
    {
      id: 3,
      restaurant: 'Barbeque Nation',
      area: 'Banjara Hills',
      rating: 4.3,
      cuisines: 'Buffet, BBQ, North Indian',
      offer: 'Buy 1 Get 1 Free',
      offerDetails: 'On weekday lunch buffet',
      validTill: 'Mon - Fri',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
      offerColor: 'bg-gradient-to-r from-emerald-500 to-teal-500'
    },
    {
      id: 4,
      restaurant: 'Starbucks',
      area: 'Madhapur',
      rating: 4.5,
      cuisines: 'Cafe, Coffee, Beverages',
      offer: '25% OFF on Beverages',
      offerDetails: 'Happy Hours 3-6 PM',
      validTill: 'Daily',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&q=80',
      offerColor: 'bg-gradient-to-r from-green-600 to-green-700'
    },
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header (Standardized) -->
  <header class="sticky top-0 bg-bg-app/95 backdrop-blur-xl z-30 border-b border-border-dark/30">
    <div class="px-2 py-2 flex items-center justify-between gap-1">
      <div class="flex items-center gap-1 ml-1">
          <h1 class="text-xl font-black">🔥 Exclusive Offers</h1>
      </div>

      <div class="flex items-center gap-3 shrink-0 mr-1">
        <a href="/user/search" class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary">
          <Search size={20} />
        </a>
        <a href="/user/profile" class="w-10 h-10 bg-surface rounded-full flex items-center justify-center shadow-sm border border-border-dark text-text-primary">
           <CircleUser size={20} />
        </a>
      </div>
    </div>
    
    <!-- Categories (Edge-to-Edge) -->
    <div class="px-6 pb-4">
      <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2 -mx-6 px-6">
      {#each categories as cat}
        <button 
          onclick={() => activeCategory = cat.id}
          class={cn(
            "px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors",
            activeCategory === cat.id 
              ? "bg-primary text-white" 
              : "bg-surface border border-border-dark text-text-secondary hover:border-primary/30"
          )}
        >
          {cat.name}
        </button>
      {/each}
      </div>
    </div>
  </header>

  <main class="px-6 pt-6 space-y-4">
    {#each offers as offer}
      <a href="/user/restaurant/{offer.restaurant}" class="block bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
        <div class="flex gap-4 p-4">
          <!-- Image -->
          <div class="relative w-28 h-28 rounded-2xl overflow-hidden flex-shrink-0">
            <img src={offer.image} alt={offer.restaurant} class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
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
      </a>
    {/each}
  </main>
</div>

<BottomNav />
