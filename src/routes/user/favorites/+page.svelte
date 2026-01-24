<script lang="ts">
  import BottomNav from '$lib/components/BottomNav.svelte';
  import { ChevronLeft, Heart, Star, MapPin, Search } from 'lucide-svelte';
  import { cn } from '$lib/utils';

  const favoriteRestaurants = [
    {
      id: 1,
      name: 'Paradise Biryani',
      area: 'Secunderabad',
      rating: 4.6,
      reviews: '10k+',
      cuisines: 'Biryani, North Indian',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400&q=80',
    },
    {
      id: 2,
      name: 'The Rameshwaram Cafe',
      area: 'Jubilee Hills',
      rating: 4.4,
      reviews: '5k+',
      cuisines: 'South Indian, Dosa',
      image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400&q=80',
    },
    {
      id: 3,
      name: 'Barbeque Nation',
      area: 'Banjara Hills',
      rating: 4.3,
      reviews: '8k+',
      cuisines: 'Buffet, BBQ, North Indian',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80',
    }
  ];
</script>

<div class="min-h-screen bg-bg-app pb-32 text-text-primary">
  <!-- Header -->
  <header class="px-6 pt-12 pb-6 sticky top-0 bg-bg-app/95 backdrop-blur-xl z-20 flex items-center gap-4 border-b border-border-dark/50">
    <button onclick={() => history.back()} class="p-2 -ml-2">
      <ChevronLeft size={24} />
    </button>
    <h1 class="text-xl font-black">Favorite Restaurants</h1>
  </header>

  <main class="px-6 space-y-6 pt-6">
    {#if favoriteRestaurants.length > 0}
      <div class="grid gap-4">
        {#each favoriteRestaurants as restaurant}
          <a href="/user/restaurant/{restaurant.name}" class="block bg-surface border border-border-dark rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
            <div class="flex gap-4 p-4">
              <!-- Image -->
              <div class="relative w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                <img src={restaurant.image} alt={restaurant.name} class="w-full h-full object-cover" />
                <button class="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm rounded-full text-primary shadow-sm">
                   <Heart size={14} fill="currentColor" />
                </button>
              </div>

              <!-- Details -->
              <div class="flex-1 py-1">
                <h3 class="font-bold text-base line-clamp-1">{restaurant.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex items-center gap-0.5 px-1.5 py-0.5 bg-success text-white rounded text-[10px] font-bold">
                    <Star size={9} fill="white" /> {restaurant.rating}
                  </div>
                  <span class="text-[10px] text-text-muted">{restaurant.reviews} reviews</span>
                </div>
                <p class="text-[10px] text-text-muted mt-1">{restaurant.cuisines}</p>
                <div class="flex items-center gap-1 mt-2 text-[10px] text-primary font-bold">
                  <MapPin size={10} /> {restaurant.area}
                </div>
              </div>
            </div>
          </a>
        {/each}
      </div>
    {:else}
      <div class="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div class="w-20 h-20 bg-surface border border-border-dark rounded-full flex items-center justify-center text-text-muted">
          <Heart size={32} />
        </div>
        <div>
          <h3 class="font-bold text-lg">No favorites yet</h3>
          <p class="text-sm text-text-muted">Start liking restaurants to see them here.</p>
        </div>
        <a href="/user/offers" class="px-6 py-3 bg-primary text-white rounded-full font-bold shadow-soft">
          Find Restaurants
        </a>
      </div>
    {/if}
  </main>
</div>

<BottomNav />
